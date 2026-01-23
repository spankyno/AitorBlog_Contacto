
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
    <div className="min-h-screen bg-[#fdfdfd]">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

      <header className="relative pt-16 pb-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Aitor's blog <span className="gradient-text">Contacto</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed font-light">
            ¡Hola! Este es el espacio dedicado para que puedas ponerte en contacto conmigo. 
            Ya sea para proponer una colaboración, dejar un comentario sobre algún artículo del blog 
            o simplemente compartir tu opinión, estaré encantado de leerte. 
            Todos los mensajes se registran en el historial de la comunidad para fomentar la transparencia y la participación.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-12 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar: Profile & Form */}
          <div className="lg:col-span-5 space-y-8">
            <ProfileCard 
              name="Aitor"
              email="aitorblog.sustained708@passinbox.com"
              xHandle="@Kalbo___"
              imageUrl="/AitorCaricatura.webp"
            />
            <ContactForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
          </div>

          {/* Main Content: Table */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-end justify-between px-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Actividad Reciente</h2>
                <p className="text-sm text-gray-500">Comentarios y colaboraciones de la comunidad</p>
              </div>
              <div className="flex items-center gap-3">
                {isLoading && (
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
                )}
                <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {submissions.length} MENSAJES
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm flex justify-between items-center">
                <span>{error}</span>
                <button onClick={fetchSubmissions} className="font-bold underline">Reintentar</button>
              </div>
            )}

            <SubmissionsTable submissions={submissions} />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-12 text-center">
        <p className="text-sm text-gray-400 font-medium tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Aitor's Blog - Espacio de Colaboración
        </p>
      </footer>
    </div>
  );
};

export default App;
