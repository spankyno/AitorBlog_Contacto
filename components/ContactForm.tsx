
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
    <div className="glass-effect rounded-2xl p-6 shadow-xl border border-white/20">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Enviar Mensaje</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            required
            type="text"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Tu nombre..."
            value={formData.nombre}
            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            required
            type="email"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
          <select
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
            value={formData.asunto}
            onChange={e => setFormData({ ...formData, asunto: e.target.value as AsuntoType })}
          >
            <option value="Comentario">Comentario</option>
            <option value="Opinión">Opinión</option>
            <option value="Colaboración">Colaboración</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Escribe aquí tu colaboración o mensaje..."
            value={formData.comentario}
            onChange={e => setFormData({ ...formData, comentario: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all shadow-lg ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-200'
          }`}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Registro'}
        </button>
      </form>
    </div>
  );
};
