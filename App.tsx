
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
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Error de conexión al obtener datos.`);
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
      setError('Sincronización temporalmente no disponible.');
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

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Error al guardar');
      }

      await fetchSubmissions();
      alert("¡Tu mensaje ha sido registrado con éxito!");
    } catch (error: any) {
      console.error("Error al guardar:", error);
      alert(error.message || "Error al procesar el envío.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] selection:bg-blue-100">
      {/* Soft gradient background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-slate-100 to-transparent pointer-events-none -z-10"></div>

      <header className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight mb-8">
            Aitor's blog <span className="gradient-text">Contacto</span>
          </h1>
          <p className="max-w-4xl mx-auto text-xl text-gray-600 leading-relaxed font-light italic">
            Este es un formulario de contacto oficial del blog. Puedes utilizar este espacio para dejar tus comentarios, 
            sugerencias sobre los artículos o proponer nuevas colaboraciones. Tu mensaje será visible en el historial público 
            para fomentar la transparencia y el diálogo con toda la comunidad del blog.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-16 pb-24">
        {/* Top Section: Photo (Left) and Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-4 flex">
            <ProfileCard 
              name="Aitor"
              email="blog.cottage627@passinbox.com"
              xHandle="@Kalbo___"
              imageUrl="/AitorCaricatura.webp"
            />
          </div>
          <div className="lg:col-span-8">
            <ContactForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>

        {/* Bottom Section: Recent Activity (Full Width) */}
        <section className="space-y-8 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Actividad reciente</h2>
              <p className="text-gray-500 font-medium mt-1">Últimas aportaciones y mensajes de la comunidad</p>
            </div>
            <div className="flex items-center gap-4">
              {isLoading && (
                <div className="flex gap-1.5 px-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                </div>
              )}
              <div className="bg-gray-900 text-white text-xs font-black px-6 py-2.5 rounded-full shadow-xl tracking-widest uppercase">
                {submissions.length} Aportaciones
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-5 rounded-3xl text-red-700 flex justify-between items-center">
              <span className="font-bold">{error}</span>
              <button onClick={fetchSubmissions} className="bg-red-600 text-white px-4 py-1.5 rounded-xl text-xs font-black hover:bg-red-700 transition-colors uppercase">Reintentar</button>
            </div>
          )}

          <div className="w-full">
            <SubmissionsTable submissions={submissions} />
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400 font-black tracking-[0.4em] uppercase">
            &copy; {new Date().getFullYear()} Aitor's Blog &bull; Colaboración y Contacto
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
