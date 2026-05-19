
import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

// ── Constantes ────────────────────────────────────────────────────────────────
const ALLOWED_ORIGIN    = 'https://aitor-blog-contacto.vercel.app';
const ASUNTOS_PERMITIDOS = ['Comentario', 'Opinión', 'Colaboración'] as const;
const MAX_NOMBRE        = 100;
const MAX_EMAIL         = 254;
const MAX_COMENTARIO    = 250;
const EMAIL_REGEX       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting: máx. 2 POST por cookie firmada en 60 minutos
const RL_WINDOW_MS   = 60 * 60 * 1000;
const RL_MAX         = 2;
const RL_COOKIE      = '__rl';
const RL_SECRET      = process.env.RATE_LIMIT_SECRET ?? 'dev-secret-change-me';

// ── Cabeceras ─────────────────────────────────────────────────────────────────
function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin':  ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function jsonHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json', ...corsHeaders() };
}

function respond(body: unknown, status: number, extra?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...jsonHeaders(), ...extra },
  });
}

// ── IP real desde Vercel ──────────────────────────────────────────────────────
function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'Desconocida';
}

// ── HMAC-SHA256 para firmar cookies ──────────────────────────────────────────
async function hmacSign(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(RL_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function hmacVerify(data: string, sig: string): Promise<boolean> {
  return (await hmacSign(data)) === sig;
}

// ── Cookie de rate limiting ───────────────────────────────────────────────────
interface RLState { count: number; windowStart: number; }

function parseCookieHeader(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k.trim() === name) return rest.join('=').trim();
  }
  return null;
}

async function parseRLCookie(raw: string | null): Promise<RLState | null> {
  if (!raw) return null;
  try {
    const [payload, sig] = raw.split('.');
    const json = atob(payload);
    if (!(await hmacVerify(json, sig))) return null;
    return JSON.parse(json) as RLState;
  } catch { return null; }
}

async function buildRLCookie(state: RLState): Promise<string> {
  const json = JSON.stringify(state);
  return `${btoa(json)}.${await hmacSign(json)}`;
}

// ── Handler principal ─────────────────────────────────────────────────────────
export default async function handler(req: Request) {

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return respond({ error: 'Error de configuración del servidor.' }, 500);
  }

  // ── GET: Recuperar registros ──────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const sql = neon(databaseUrl);
      const rows = await sql`
        SELECT id, fecha_hora, nombre, asunto, comentario, revisado
        FROM submissions
        ORDER BY fecha_hora DESC
        LIMIT 100
      `;
      return respond(rows ?? [], 200);
    } catch (err) {
      console.error('[submissions] GET error:', err);
      return respond({ error: 'Error interno del servidor.' }, 500);
    }
  }

  // ── POST ──────────────────────────────────────────────────────────────────
  if (req.method === 'POST') {

    // 1. Leer body una sola vez
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return respond({ error: 'Cuerpo de la petición inválido.' }, 400);
    }

    // 2. Honeypot — respuesta silenciosa si viene relleno
    if (body._hp && String(body._hp).length > 0) {
      console.warn('[submissions] Honeypot activado desde IP:', getClientIp(req));
      return respond({ success: true }, 200);
    }

    // 3. Rate limiting por cookie firmada
    const rawCookie = parseCookieHeader(req.headers.get('cookie'), RL_COOKIE);
    const now       = Date.now();
    let state       = await parseRLCookie(rawCookie);

    if (!state || now - state.windowStart > RL_WINDOW_MS) {
      state = { count: 1, windowStart: now };
    } else if (state.count >= RL_MAX) {
      return respond(
        { error: 'Demasiados envíos. Por favor, espera antes de volver a intentarlo.' },
        429,
        { 'Retry-After': '3600' }
      );
    } else {
      state.count += 1;
    }

    const cookieValue  = await buildRLCookie(state);
    const remainingSec = Math.ceil((RL_WINDOW_MS - (now - state.windowStart)) / 1000);
    const setCookieHdr = `${RL_COOKIE}=${cookieValue}; HttpOnly; Secure; SameSite=Strict; Max-Age=${remainingSec}; Path=/api/submissions`;

    // 4. Validación y saneamiento de campos
    const nombre     = String(body.nombre     ?? '').trim();
    const email      = String(body.email      ?? '').trim().toLowerCase();
    const asunto     = String(body.asunto     ?? '').trim();
    const comentario = String(body.comentario ?? '').trim();

    if (!nombre || !email || !asunto || !comentario) {
      return respond({ error: 'Faltan campos requeridos.' }, 400,
        { 'Set-Cookie': setCookieHdr });
    }

    const errores: string[] = [];
    if (nombre.length > MAX_NOMBRE)
      errores.push(`El nombre debe tener como máximo ${MAX_NOMBRE} caracteres.`);
    if (!EMAIL_REGEX.test(email) || email.length > MAX_EMAIL)
      errores.push('El email no tiene un formato válido.');
    if (!(ASUNTOS_PERMITIDOS as readonly string[]).includes(asunto))
      errores.push('El asunto no es válido.');
    if (comentario.length > MAX_COMENTARIO)
      errores.push(`El comentario debe tener como máximo ${MAX_COMENTARIO} caracteres.`);

    if (errores.length > 0) {
      return respond({ error: errores.join(' ') }, 422,
        { 'Set-Cookie': setCookieHdr });
    }

    // 5. Inserción en base de datos
    try {
      const sql = neon(databaseUrl);
      const direccion_ip = getClientIp(req);
      const result = await sql`
        INSERT INTO submissions (direccion_ip, nombre, email, asunto, comentario)
        VALUES (${direccion_ip}, ${nombre}, ${email}, ${asunto}, ${comentario})
        RETURNING id, fecha_hora, nombre, asunto, comentario, revisado
      `;
      const responseData = result?.[0] ?? { success: true };
      return respond(responseData, 201, { 'Set-Cookie': setCookieHdr });
    } catch (err) {
      console.error('[submissions] POST DB error:', err);
      return respond({ error: 'Error interno del servidor. Inténtalo de nuevo más tarde.' }, 500);
    }
  }

  // Método no soportado
  return respond({ error: 'Método no soportado.' }, 405,
    { Allow: 'GET, POST, OPTIONS' });
}

