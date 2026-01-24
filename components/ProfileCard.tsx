
import React from 'react';

interface ProfileCardProps {
  name: string;
  email: string;
  xHandle: string;
  imageUrl: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, xHandle, imageUrl }) => {
  return (
    <div className="relative group h-full">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-[2.5rem] blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
      
      <div className="relative glass-effect bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-white flex flex-col items-center h-full justify-center">
        
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-blue-100 rounded-[2.5rem] rotate-6 scale-105 opacity-50"></div>
          {/* Foto de perfil 50% más grande (w-48 es un 50% más que w-32) */}
          <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden relative z-10 bg-white ring-8 ring-white shadow-2xl">
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
              }}
            />
          </div>
        </div>

        <div className="text-center mb-10">
          <h3 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{name}</h3>
          <div className="h-2 w-16 bg-blue-600 rounded-full mx-auto"></div>
        </div>

        <div className="w-full space-y-4">
          <div className="flex flex-col gap-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">E-mail de contacto</p>
            <p className="text-base font-bold text-gray-700 break-all">{email}</p>
          </div>

          <a 
            href={`https://x.com/${xHandle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-gray-900/10 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Twitter / X</p>
            <p className="text-base font-bold text-gray-700">{xHandle}</p>
          </a>
        </div>
      </div>
    </div>
  );
};
