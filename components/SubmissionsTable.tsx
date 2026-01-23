
import React from 'react';
import { Submission } from '../types';
import { formatDate } from '../services/utils';

interface SubmissionsTableProps {
  submissions: Submission[];
}

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ submissions }) => {
  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
        <p className="text-gray-500">No hay registros aún. ¡Sé el primero en colaborar!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto glass-effect rounded-2xl shadow-lg border border-white/20">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha / IP</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Persona</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Asunto</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Comentario</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {submissions.map((sub) => (
            <tr key={sub.id} className="hover:bg-white/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{formatDate(sub.fecha_hora)}</div>
                <div className="text-xs text-gray-400 font-mono">{sub.direccion_ip}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-bold text-gray-800">{sub.nombre}</div>
                <div className="text-xs text-gray-500">{sub.email}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                  sub.asunto === 'Colaboración' ? 'bg-purple-100 text-purple-700' :
                  sub.asunto === 'Opinión' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {sub.asunto}
                </span>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{sub.comentario}</p>
              </td>
              <td className="px-6 py-4">
                <span className={`flex items-center gap-1 text-xs font-medium ${sub.revisado ? 'text-green-600' : 'text-amber-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${sub.revisado ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
                  {sub.revisado ? 'Revisado' : 'Pendiente'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
