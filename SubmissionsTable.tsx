
import React from 'react';
import { Submission } from '../types';
import { formatDate } from '../services/utils';

interface SubmissionsTableProps {
  submissions: Submission[];
}

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ submissions }) => {
  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-200 shadow-sm">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Sin actividad para mostrar</p>
        <p className="text-gray-500 mt-2 font-medium">¡Inicia la conversación enviando un mensaje arriba!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/30 border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-slate-50/70">
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Remitente</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Asunto</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Comentario</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Fecha</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50 transition-all duration-300">
                <td className="px-8 py-8 align-top">
                  <div className="flex flex-col">
                    <span className="text-base font-black text-gray-900 leading-tight mb-0.5">{sub.nombre}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{sub.email}</span>
                  </div>
                </td>
                <td className="px-8 py-8 align-top">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    sub.asunto === 'Colaboración' ? 'bg-purple-100 text-purple-700' :
                    sub.asunto === 'Opinión' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {sub.asunto}
                  </span>
                </td>
                <td className="px-8 py-8 align-top">
                  {/* Comentario se muestra completo */}
                  <div className="max-w-xl">
                    <p className="text-base text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                      {sub.comentario}
                    </p>
                  </div>
                </td>
                <td className="px-8 py-8 align-top whitespace-nowrap">
                  {/* Solo la fecha es mostrada */}
                  <span className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                    {formatDate(sub.fecha_hora)}
                  </span>
                </td>
                <td className="px-8 py-8 align-top">
                  <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${sub.revisado ? 'text-green-600' : 'text-amber-600'}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${sub.revisado ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-amber-500 animate-pulse'}`}></span>
                    {sub.revisado ? 'Leído' : 'Nuevo'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
