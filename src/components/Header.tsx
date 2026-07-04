import React from 'react';
import { Menu, X, Globe, Lock } from 'lucide-react';
import { ArtistInfo } from '../types';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  lang: 'ko' | 'en';
  onLangToggle: () => void;
  artistInfo: ArtistInfo;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Header({
  currentView,
  onViewChange,
  lang,
  onLangToggle,
  artistInfo,
  isAdmin,
  onLogout,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'works', label: { ko: 'WORKS', en: 'WORKS' } },
    { id: 'info', label: { ko: 'INFO', en: 'INFO' } },
  ];

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setMobileMenuOpen(false);
  };

  const isHome = currentView === 'home';

  return (
    <header 
      className={`${
        isHome 
          ? 'absolute top-0 left-0 right-0 z-50 bg-transparent border-b border-transparent' 
          : 'sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/40'
      } transition-all duration-500`} 
      id="app-header"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo / Artist Name */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group flex flex-col cursor-pointer justify-center"
          id="header-logo-btn"
        >
          <span className="custom-artist-name font-light text-base sm:text-lg tracking-[0.25em] group-hover:text-stone-500 transition-colors duration-300 uppercase">
            {lang === 'ko' ? artistInfo.nameKo : artistInfo.nameEn}
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-12" id="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`custom-menu-item text-xs tracking-[0.2em] transition-all duration-300 relative py-2 cursor-pointer ${
                currentView === item.id
                  ? 'custom-menu-item-active font-semibold'
                  : 'hover:text-stone-900'
              }`}
              id={`nav-item-${item.id}`}
            >
              {item.label[lang]}
              {currentView === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-stone-900" />
              )}
            </button>
          ))}
        </nav>

        {/* Global Utilities (Language, Admin status) */}
        <div className="hidden md:flex items-center space-x-6" id="header-utilities">
          {isAdmin ? (
            <button
              onClick={() => handleNavClick('admin')}
              className="text-stone-900 hover:text-stone-500 transition-colors cursor-pointer p-1"
              title="Admin Panel Active"
              id="admin-active-badge"
            >
              <Lock className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('admin')}
              className="text-stone-300 hover:text-stone-900 transition-colors cursor-pointer p-1"
              title="Admin Login"
              id="header-admin-login-btn"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onLangToggle}
            className="flex items-center space-x-1.5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer text-xs font-mono py-1 px-2 border border-stone-200 hover:border-stone-400 rounded"
            id="lang-toggle-btn"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="tracking-widest">{lang.toUpperCase()}</span>
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center space-x-4 md:hidden" id="mobile-utility-wrapper">
          {isAdmin ? (
            <button
              onClick={() => handleNavClick('admin')}
              className="text-stone-900 hover:text-stone-500 transition-colors cursor-pointer p-1"
              title="Admin Panel Active"
            >
              <Lock className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('admin')}
              className="text-stone-300 hover:text-stone-900 transition-colors cursor-pointer p-1"
              title="Admin Login"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onLangToggle}
            className="text-stone-400 hover:text-stone-900 transition-colors font-mono text-xs py-1 px-2 border border-stone-200 rounded"
          >
            {lang.toUpperCase()}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-stone-900 hover:text-stone-600 focus:outline-none p-1"
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-50 border-b border-stone-200/80 animate-fade-in absolute w-full left-0 top-20 z-30" id="mobile-drawer">
          <div className="px-6 py-8 flex flex-col space-y-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left custom-menu-item text-xs tracking-[0.2em] py-2 transition-all ${
                  currentView === item.id ? 'custom-menu-item-active font-semibold pl-2 border-l border-stone-950' : ''
                }`}
              >
                {item.label[lang]}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="text-left pt-2 border-t border-stone-200 mt-2 text-stone-900 hover:text-stone-500 flex items-center gap-2"
                title="Admin Panel"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
