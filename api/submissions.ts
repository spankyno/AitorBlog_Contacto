
import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return new Response(JSON.stringify({ error: 'DATABASE_URL no configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sql = neon(databaseUrl);

  try {
    // Manejar GET: Obtener todos los registros
    if (req.method === 'GET') {
      const submissions = await sql`
        SELECT * FROM submissions 
        ORDER BY fecha_hora DESC 
        LIMIT 50
      `;
      return new Response(JSON.stringify(submissions), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Manejar POST: Crear nuevo registro
    if (req.method === 'POST') {
      const body = await req.json();
      const { direccion_ip, nombre, email, asunto, comentario } = body;

      if (!nombre || !email || !asunto || !comentario) {
        return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await sql`
        INSERT INTO submissions (direccion_ip, nombre, email, asunto, comentario)
        VALUES (${direccion_ip}, ${nombre}, ${email}, ${asunto}, ${comentario})
      `;

      return new Response(JSON.stringify({ message: 'Registro creado con éxito' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Database Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
