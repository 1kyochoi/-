import React from 'react';
import { Mail, Instagram, Lock, ShieldCheck } from 'lucide-react';
import { ArtistInfo } from '../types';

interface FooterProps {
  artistInfo: ArtistInfo;
  lang: 'ko' | 'en';
  onAdminClick: () => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Footer({ artistInfo, lang, onAdminClick, isAdmin, onLogout }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-50 border-t border-stone-200 mt-24 py-16 px-6" id="app-footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
        
        {/* Left column: Name and short description */}
        <div className="max-w-md flex flex-col">
          <span className="custom-artist-name font-light text-sm tracking-[0.2em] uppercase">
            {lang === 'ko' ? artistInfo.nameKo : artistInfo.nameEn}
          </span>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed">
            {lang === 'ko' ? artistInfo.headlineKo : artistInfo.headlineEn}
          </p>
          <span className="text-[10px] text-stone-400 font-mono mt-8 tracking-wider">
            © {year} {artistInfo.nameEn}. ALL RIGHTS RESERVED.
          </span>
        </div>

        {/* Right column: Contact & admin link */}
        <div className="flex flex-col md:items-end justify-between self-stretch md:text-right gap-6">
          <div className="flex flex-col space-y-2.5">
            <span className="mono-meta text-[10px] text-stone-400 font-light tracking-widest">
              {lang === 'ko' ? '연락처 및 소셜 미디어' : 'CONTACT & CHANNELS'}
            </span>
            
            <a
              href={`mailto:${artistInfo.email}`}
              className="flex items-center md:justify-end text-xs text-stone-600 hover:text-stone-950 transition-colors gap-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="font-mono">{artistInfo.email}</span>
            </a>
            
            <a
              href={`https://instagram.com/${artistInfo.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center md:justify-end text-xs text-stone-600 hover:text-stone-950 transition-colors gap-2"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span className="font-mono">{artistInfo.instagram}</span>
            </a>
          </div>

          {/* Discreet Admin Entrance */}
          <div className="flex items-center md:justify-end mt-4">
            {isAdmin ? (
              <div className="flex items-center space-x-3 text-xs font-mono">
                <button
                  onClick={onAdminClick}
                  className="text-stone-900 hover:text-stone-500 cursor-pointer p-1"
                  title="Admin Dashboard"
                >
                  <Lock className="w-4 h-4 text-stone-900" />
                </button>
                <button
                  onClick={onLogout}
                  className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer text-[10px] uppercase font-mono tracking-wider border border-stone-200 hover:border-red-200 rounded px-1.5 py-0.5"
                >
                  {lang === 'ko' ? '로그아웃' : 'LOGOUT'}
                </button>
              </div>
            ) : (
              <button
                onClick={onAdminClick}
                className="text-stone-350 hover:text-stone-900 transition-colors cursor-pointer p-1"
                id="footer-admin-login-link"
                title="Admin Login"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
