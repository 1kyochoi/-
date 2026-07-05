import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { initialPortfolioData } from './data/seedData';
import { PortfolioData, Inquiry } from './types';
import { isSupabaseConfigured, fetchArtworks } from './supabaseClient';

// Import Views
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import WorksView from './components/WorksView';
import WorkDetailView from './components/WorkDetailView';
import InfoView from './components/InfoView';
import ContactView from './components/ContactView';
import AdminView from './components/AdminView';
import GlobalInquiryModal from './components/GlobalInquiryModal';

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialPortfolioData);
  const [currentView, setCurrentView] = useState<string>('home'); // home, works, text, cv, contact, admin
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [lang, setLang] = useState<'ko' | 'en'>('en');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [globalInquiryOpen, setGlobalInquiryOpen] = useState<boolean>(false);
  const [supabaseLoading, setSupabaseLoading] = useState<boolean>(isSupabaseConfigured());
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // 1. Initial State Sync with localStorage
  useEffect(() => {
    const saved = localStorage.getItem('artist_portfolio_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.artistInfo) {
          // If the stored data still refers to the old artist Sehyung Lim, force override with initialPortfolioData
          if (parsed.artistInfo.nameEn === "SEHYUNG LIM" || parsed.artistInfo.nameKo === "임세형") {
            setPortfolioData(initialPortfolioData);
            localStorage.setItem('artist_portfolio_data', JSON.stringify(initialPortfolioData));
          } else {
            // Sanitize old defaults if they are still loaded from the user's active session
            let changed = false;
            if (parsed.artistInfo.headlineKo === "부산과 서울을 오가며 활동하는 현대미술가. 지층과 외벽, 소멸하는 일상적 무대를 촉각적 표면으로 환원하는 회화와 장소특정적 설치 미술을 선보인다.") {
              parsed.artistInfo.headlineKo = "";
              changed = true;
            }
            if (parsed.artistInfo.headlineEn === "A contemporary artist working between Busan and Seoul, translating urban interfaces, weathered facades, and vanishing spaces into tactile paintings and site-specific installations.") {
              parsed.artistInfo.headlineEn = "";
              changed = true;
            }
            if (parsed.artistInfo.agencyKo === "갤러리 컨템포러리 서울") {
              parsed.artistInfo.agencyKo = "";
              changed = true;
            }
            if (parsed.artistInfo.agencyEn === "Gallery Contemporary Seoul") {
              parsed.artistInfo.agencyEn = "";
              changed = true;
            }
            if (parsed.artistInfo.instagram === "@wonkyo.choi.studio") {
              parsed.artistInfo.instagram = "@1kyochoi";
              changed = true;
            }
            if (changed) {
              localStorage.setItem('artist_portfolio_data', JSON.stringify(parsed));
            }
            
            // If Supabase is configured, keep the local storage projects empty to rely solely on Supabase
            if (isSupabaseConfigured()) {
              setPortfolioData({
                ...parsed,
                projects: []
              });
            } else {
              setPortfolioData(parsed);
            }
          }
        } else {
          localStorage.setItem('artist_portfolio_data', JSON.stringify(initialPortfolioData));
        }
      } catch (e) {
        localStorage.setItem('artist_portfolio_data', JSON.stringify(initialPortfolioData));
      }
    } else {
      localStorage.setItem('artist_portfolio_data', JSON.stringify(initialPortfolioData));
    }
  }, []);

  // 1.5 Fetch Artworks from Supabase if configured
  useEffect(() => {
    async function loadSupabase() {
      if (isSupabaseConfigured()) {
        try {
          setSupabaseLoading(true);
          setSupabaseError(null);
          const artworks = await fetchArtworks();
          setPortfolioData((prev) => ({
            ...prev,
            projects: artworks,
          }));
        } catch (err: any) {
          console.error('Error fetching artworks from Supabase:', err);
          setSupabaseError(err.message || 'Failed to fetch artworks from Supabase.');
        } finally {
          setSupabaseLoading(false);
        }
      }
    }
    loadSupabase();
  }, []);

  // Update Portfolio handler (saves state + persists to storage)
  const handleUpdatePortfolio = (updatedData: PortfolioData) => {
    setPortfolioData(updatedData);
    if (isSupabaseConfigured()) {
      // Clear out the projects before saving to local storage to satisfy "Do not store uploaded artworks in localStorage"
      const dataToSave = {
        ...updatedData,
        projects: []
      };
      localStorage.setItem('artist_portfolio_data', JSON.stringify(dataToSave));
    } else {
      localStorage.setItem('artist_portfolio_data', JSON.stringify(updatedData));
    }
  };


  // Reset to default seed data
  const handleResetToDefault = () => {
    if (confirm(lang === 'ko' ? '정말로 모든 포트폴리오 데이터를 공장 초기 상태로 되돌리시겠습니까? 작성한 글이나 추가한 작품이 모두 초기화됩니다.' : 'Are you sure you want to force reset all portfolio data back to defaults? All custom changes will be lost.')) {
      setPortfolioData(initialPortfolioData);
      localStorage.setItem('artist_portfolio_data', JSON.stringify(initialPortfolioData));
      setIsAdminLoggedIn(false);
      setCurrentView('home');
      setSelectedProjectId(null);
    }
  };

  // Add a new Inquiry to the inbox
  const handleAddInquiry = (inqDraft: Omit<Inquiry, 'id' | 'date' | 'isRead'>) => {
    const newInq: Inquiry = {
      id: `inq-${Date.now()}`,
      date: new Date().toISOString(),
      isRead: false,
      ...inqDraft,
    };

    const updatedInquiries = [newInq, ...(portfolioData.inquiries || [])];
    handleUpdatePortfolio({
      ...portfolioData,
      inquiries: updatedInquiries,
    });
  };

  // Language Toggle
  const handleLangToggle = () => {
    setLang((l) => (l === 'ko' ? 'en' : 'ko'));
  };

  // Navigation controller helper
  const handleViewChange = (viewId: string) => {
    setCurrentView(viewId);
    setSelectedProjectId(null); // clean up project selection if navigating away
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('works-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Current active project lookup
  const activeProject = portfolioData.projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-stone-900 selection:text-stone-50" id="portfolio-app-root">
      
      {/* Dynamic Style injection for custom Fonts and Colors */}
      <style>{`
        .custom-artist-name {
          font-family: "${portfolioData.artistInfo.nameFontFamily || 'Cormorant Garamond'}", serif, sans-serif !important;
          color: ${portfolioData.artistInfo.nameColor || '#1c1917'} !important;
          font-size: ${portfolioData.artistInfo.nameFontSize || '18px'} !important;
          font-weight: ${portfolioData.artistInfo.nameFontWeight || '300'} !important;
        }
        .custom-menu-item {
          font-family: "${portfolioData.artistInfo.menuFontFamily || 'JetBrains Mono'}", monospace, sans-serif !important;
          color: ${portfolioData.artistInfo.menuColor || '#a8a29e'} !important;
        }
        .custom-menu-item-active {
          color: ${portfolioData.artistInfo.menuActiveColor || '#1c1917'} !important;
        }
      `}</style>

      {/* Dynamic Header */}
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        lang={lang}
        onLangToggle={handleLangToggle}
        artistInfo={portfolioData.artistInfo}
        isAdmin={isAdminLoggedIn}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          handleViewChange('home');
        }}
      />

      {/* Main stage with luxury page transitions */}
      <main className="flex-grow pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (selectedProjectId || '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="w-full h-full"
            id="view-animation-wrapper"
          >
            {currentView === 'home' && (
              <HomeView
                projects={portfolioData.projects}
                lang={lang}
                onNavigateToProject={handleNavigateToProject}
                onNavigateToWorks={() => handleViewChange('works')}
                homeStartImage={portfolioData.artistInfo.homeStartImage}
              />
            )}

            {currentView === 'works' && (
              <WorksView
                projects={portfolioData.projects}
                lang={lang}
                onNavigateToProject={handleNavigateToProject}
                categories={portfolioData.categories}
              />
            )}

            {currentView === 'works-detail' && activeProject && (
              <WorkDetailView
                project={activeProject}
                lang={lang}
                onBack={() => handleViewChange('works')}
                onAddInquiry={handleAddInquiry}
              />
            )}

            {currentView === 'info' && (
              <InfoView
                artistInfo={portfolioData.artistInfo}
                cvItems={portfolioData.cvItems}
                texts={portfolioData.texts}
                lang={lang}
                onOpenInquiry={() => setGlobalInquiryOpen(true)}
              />
            )}

            {currentView === 'contact' && (
              <ContactView
                artistInfo={portfolioData.artistInfo}
                lang={lang}
                onAddInquiry={handleAddInquiry}
                onOpenInquiry={() => setGlobalInquiryOpen(true)}
              />
            )}

            {currentView === 'admin' && (
              <AdminView
                portfolioData={portfolioData}
                onUpdatePortfolio={handleUpdatePortfolio}
                lang={lang}
                onResetToDefault={handleResetToDefault}
                isAdminLoggedIn={isAdminLoggedIn}
                onAdminLoginSuccess={() => setIsAdminLoggedIn(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Footer */}
      {currentView !== 'home' && (
        <Footer
          artistInfo={portfolioData.artistInfo}
          lang={lang}
          onAdminClick={() => handleViewChange('admin')}
          isAdmin={isAdminLoggedIn}
          onLogout={() => {
            setIsAdminLoggedIn(false);
            handleViewChange('home');
          }}
          hideIntro={currentView === 'works' || currentView === 'contact'}
          onOpenInquiry={() => setGlobalInquiryOpen(true)}
        />
      )}

      {/* Global Inquiry Modal */}
      <GlobalInquiryModal
        isOpen={globalInquiryOpen}
        onClose={() => setGlobalInquiryOpen(false)}
        artistInfo={portfolioData.artistInfo}
        lang={lang}
        onAddInquiry={handleAddInquiry}
      />
    </div>
  );
}
