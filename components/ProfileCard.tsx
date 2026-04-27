
import React from 'react';

interface ProfileCardProps {
  name: string;
  email: string;
  xHandle: string;
  imageUrl: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, xHandle, imageUrl }) => {
  return (
    <div className="relative group w-full h-full">
      <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      
      <div className="relative bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/40 border border-white h-full flex flex-col items-center justify-center">
        
        {/* Profile Image Container - w-48 is 50% larger than base w-32 */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-blue-100 rounded-[3rem] rotate-6 scale-105 opacity-30"></div>
          <a 
            href="https://aitorsanchez.pages.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-48 h-48 rounded-[3rem] overflow-hidden relative z-10 bg-white ring-[10px] ring-white shadow-2xl cursor-pointer hover:ring-blue-500 transition-all duration-500"
            title="Visitar mi blog"
          >
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
              }}
            />
          </a>
        </div>

        <div className="text-center mb-10">
          <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">{name}</h3>
          <div className="h-2 w-16 bg-blue-600 rounded-full mx-auto"></div>
        </div>

        <div className="w-full space-y-4">
          <div className="flex flex-col gap-1.5 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-blue-300 transition-all duration-500 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">E-mail</p>
            <p className="text-base font-bold text-gray-800 break-words leading-tight">{email}</p>
          </div>

          <a 
            href={`https://x.com/${xHandle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-1.5 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-gray-900 transition-all duration-500 shadow-sm"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Twitter / X</p>
            <p className="text-base font-bold text-gray-800">{xHandle}</p>
          </a>
        </div>
      </div>
    </div>
  );
};

