
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

  const inputStyles = "w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all duration-200 placeholder:text-gray-400 font-bold text-gray-800";

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-white">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Nuevo Mensaje</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Tu Nombre</label>
            <input
              required
              type="text"
              className={inputStyles}
              placeholder="¿Quién escribe?"
              value={formData.nombre}
              onChange={e => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Correo de contacto</label>
            <input
              required
              type="email"
              className={inputStyles}
              placeholder="tu@email.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">¿Cuál es el motivo?</label>
          <div className="relative">
            <select
              className={`${inputStyles} appearance-none cursor-pointer pr-12`}
              value={formData.asunto}
              onChange={e => setFormData({ ...formData, asunto: e.target.value as AsuntoType })}
            >
              <option value="Comentario">💬 Dejar un saludo o comentario</option>
              <option value="Opinión">⭐ Dar mi opinión sobre el blog</option>
              <option value="Colaboración">🤝 Propuesta de colaboración</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Escribe tu comentario</label>
          <textarea
            required
            maxLength={250}
            rows={5}
            className={`${inputStyles} resize-none font-medium`}
            placeholder="Escribe aquí tu mensaje (máx. 250 caracteres)..."
            value={formData.comentario}
            onChange={e => setFormData({ ...formData, comentario: e.target.value })}
          />
          <div className="text-[10px] text-right text-gray-400 font-bold uppercase tracking-widest px-2">
            {formData.comentario.length} / 250 caracteres
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`group relative w-full py-5 rounded-[1.5rem] font-black text-white text-xl tracking-tight overflow-hidden transition-all duration-300 shadow-xl shadow-blue-500/30 active:scale-95 ${
            isSubmitting ? 'bg-gray-200 cursor-not-allowed text-gray-400 shadow-none' : 'bg-gray-900 hover:bg-black'
          }`}
        >
          <span className="relative z-10">{isSubmitting ? 'Enviando...' : 'Publicar mensaje'}</span>
          {!isSubmitting && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
        </button>
      </form>
    </div>
  );
};
