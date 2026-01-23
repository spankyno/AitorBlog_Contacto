
import React, { useState } from 'react';
import { FormData, AsuntoType } from '../types';

interface ContactFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    asunto: 'Comentario',
    comentario: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ ...formData, nombre: '', email: '', comentario: '' });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
        Nueva Colaboración
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tu Nombre</label>
          <input
            required
            type="text"
            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            placeholder="¿Cómo te llamas?"
            value={formData.nombre}
            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">E-mail de contacto</label>
          <input
            required
            type="email"
            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tipo de mensaje</label>
          <div className="relative">
            <select
              className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer"
              value={formData.asunto}
              onChange={e => setFormData({ ...formData, asunto: e.target.value as AsuntoType })}
            >
              <option value="Comentario">💬 Comentario</option>
              <option value="Opinión">⭐ Opinión</option>
              <option value="Colaboración">🤝 Colaboración</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tu Mensaje</label>
          <textarea
            required
            rows={4}
            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all"
            placeholder="Cuéntame tu propuesta o idea..."
            value={formData.comentario}
            onChange={e => setFormData({ ...formData, comentario: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl shadow-blue-500/10 ${
            isSubmitting ? 'bg-gray-300' : 'bg-gray-900 hover:bg-black hover:scale-[1.02] active:scale-95'
          }`}
        >
          {isSubmitting ? 'Enviando...' : 'Publicar en el Blog'}
        </button>
      </form>
    </div>
  );
};
