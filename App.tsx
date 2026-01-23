
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

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      } else {
        // Fallback a localStorage si la API falla (solo para desarrollo)
        const saved = localStorage.getItem('neon_submissions_v2');
        if (saved) setSubmissions(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Error cargando datos de la API", err);
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

      if (!response.ok) throw new Error('Error al enviar a la base de datos');

      // Refrescar la lista de la base de datos
      await fetchSubmissions();
      
      alert("¡Registro guardado en Neon con éxito!");
    } catch (error) {
      console.error("Error al guardar", error);
      // Fallback local en caso de error de red o API no lista
      const newSubmission: Submission = {
        id: Date.now(), 
        fecha_hora: new Date().toISOString(),
        direccion_ip: 'Local/Error',
        nombre: data.nombre,
        email: data.email,
        asunto: data.asunto,
        comentario: data.comentario,
        revisado: false
      };
      setSubmissions(prev => [newSubmission, ...prev]);
      alert("Enviado al historial local (la API no respondió correctamente).");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <ProfileCard 
                name="Aitor"
                email="aitor@ejemplo.com"
                xHandle="@aitor_dev"
                imageUrl="public/AitorCaricatura.webp"
              />
            </div>
            <div className="lg:col-span-7">
              <div className="max-w-xl">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Página de <span className="gradient-text">Contacto</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  ¿Tienes una idea brillante o quieres colaborar? Utiliza el formulario 
                  de abajo para registrarte directamente en mi base de datos de **Neon**. 
                  Los datos se persisten en tiempo real.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <section className="xl:col-span-1">
            <div className="sticky top-8">
              <ContactForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
            </div>
          </section>

          <section className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Historial en Neon DB</h2>
              <div className="flex items-center gap-2">
                {isLoading && <span className="text-xs text-blue-500 animate-pulse font-medium">Sincronizando...</span>}
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  {submissions.length} Registros
                </span>
              </div>
            </div>
            <SubmissionsTable submissions={submissions} />
          </section>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 mt-20 text-center text-gray-400 text-sm border-t border-gray-100 pt-8">
        <p>Aitor | Conectado a Neon PostgreSQL vía Vercel Functions</p>
      </footer>
    </div>
  );
};

export default App;
