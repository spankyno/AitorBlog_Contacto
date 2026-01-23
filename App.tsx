
import React, { useState, useEffect } from 'react';
import { ProfileCard } from './components/ProfileCard';
import { ContactForm } from './components/ContactForm';
import { SubmissionsTable } from './components/SubmissionsTable';
import { Submission, FormData } from './types';
import { getPublicIp } from './services/utils';

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/submissions');
      
      // Verificamos si la respuesta es JSON antes de parsear
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`El servidor no devolvió JSON (Estado: ${res.status}). Verifica la configuración del backend.`);
      }

      const data = await res.json();
      
      if (res.ok) {
        setSubmissions(Array.isArray(data) ? data : []);
        setError(null);
      } else {
        setError(data.error || 'Error en el servidor');
      }
    } catch (err: any) {
      console.error("Error cargando datos:", err);
      setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const ip = await getPublicIp();
      const payload = {
        direccion_ip: ip,
        nombre: data.nombre,
        email: data.email,
        asunto: data.asunto,
        comentario: data.comentario
      };

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error("Respuesta del servidor no válida (No JSON)");
      }

      if (!response.ok) throw new Error(result.error || 'Error al guardar');

      await fetchSubmissions();
      alert("¡Registro guardado correctamente en Neon!");
    } catch (error: any) {
      console.error("Error al guardar:", error);
      alert(error.message || "Error al procesar el envío.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <ProfileCard 
                name="Aitor"
                email="aitor@ejemplo.com"
                xHandle="@aitor_dev"
                imageUrl="/AitorCaricatura.webp"
              />
            </div>
            <div className="lg:col-span-7">
              <div className="max-w-xl">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Colabora con <span className="gradient-text">Aitor</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Esta página está conectada directamente a una base de datos **Neon PostgreSQL**. 
                  Los datos se persisten en tiempo real y son visibles en el historial público.
                </p>
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl animate-pulse">
                    <p className="text-red-700 text-sm font-semibold">{error}</p>
                    <button 
                      onClick={fetchSubmissions}
                      className="mt-2 text-xs text-red-600 underline hover:text-red-800"
                    >
                      Reintentar conexión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <section className="xl:col-span-1">
            <div className="sticky top-8">
              <ContactForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
            </div>
          </section>

          <section className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Historial en Tiempo Real</h2>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {submissions.length} Registros
                </span>
              </div>
            </div>
            
            <SubmissionsTable submissions={submissions} />
          </section>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 mt-20 text-center text-gray-400 text-xs border-t border-gray-100 pt-8 pb-12">
        <p>Aitor | Powered by Neon + Vercel Edge + React</p>
      </footer>
    </div>
  );
};

export default App;
