
import React from 'react';

interface ProfileCardProps {
  name: string;
  email: string;
  xHandle: string;
  imageUrl: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, xHandle, imageUrl }) => {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
      <div className="relative glass-effect rounded-3xl p-10 shadow-2xl border border-white/40 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl rotate-6 opacity-10 group-hover:rotate-12 transition-transform duration-500"></div>
            {/* 50% larger image: w-32 -> w-48 (8rem -> 12rem) */}
            <a 
				href="https://aitorblog.infinityfreeapp.com" 
				className="block cursor-pointer transition-transform active:scale-95"
			>
			<div className="w-48 h-48 rounded-3xl overflow-hidden ring-8 ring-white shadow-2xl relative z-10">
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aitor';
                }}
              />
            </div>
          </div>
          
          <h3 className="text-3xl font-black text-gray-900 mb-2">{name}</h3>
          <div className="h-1.5 w-12 bg-blue-600 rounded-full mb-6 mx-auto"></div>
          
          <div className="w-full space-y-4">
            <a 
              href={`mailto:${email}`}
              className="group flex items-center gap-4 w-full px-5 py-4 bg-white/50 hover:bg-white rounded-2xl border border-gray-100 transition-all hover:shadow-md"
            >
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700 truncate">{email}</span>
            </a>
            
            <a 
              href={`https://x.com/${xHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 w-full px-5 py-4 bg-white/50 hover:bg-white rounded-2xl border border-gray-100 transition-all hover:shadow-md"
            >
              <div className="p-2 bg-gray-50 rounded-lg text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">{xHandle}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
