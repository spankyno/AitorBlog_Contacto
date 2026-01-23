
import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    return new Response(JSON.stringify({ 
      error: 'DATABASE_URL no encontrada. Configúrala en el panel de Vercel.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sql = neon(databaseUrl);

  try {
    // GET: Recuperar registros
    if (req.method === 'GET') {
      const submissions = await sql`
        SELECT * FROM submissions 
        ORDER BY fecha_hora DESC 
        LIMIT 100
      `;
      // Aseguramos que devolvemos un array aunque esté vacío
      return new Response(JSON.stringify(submissions || []), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // POST: Guardar nuevo registro
    if (req.method === 'POST') {
      const body = await req.json();
      const { direccion_ip, nombre, email, asunto, comentario } = body;

      if (!nombre || !email || !asunto || !comentario) {
        return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const result = await sql`
        INSERT INTO submissions (direccion_ip, nombre, email, asunto, comentario)
        VALUES (${direccion_ip || 'Desconocida'}, ${nombre}, ${email}, ${asunto}, ${comentario})
        RETURNING *
      `;

      // Si result[0] es undefined, devolvemos un objeto de éxito genérico
      const responseData = result && result.length > 0 ? result[0] : { success: true };

      return new Response(JSON.stringify(responseData), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Método no soportado' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Database Error:', error);
    
    let message = 'Error de conexión con la base de datos.';
    if (error.message?.includes('relation "submissions" does not exist')) {
      message = 'La tabla "submissions" no existe. Debes crearla en el SQL Editor de Neon.';
    }

    return new Response(JSON.stringify({ 
      error: message, 
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
