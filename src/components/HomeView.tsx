import React from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';

interface HomeViewProps {
  projects: Project[];
  lang: 'ko' | 'en';
  onNavigateToProject: (id: string) => void;
  onNavigateToWorks: () => void;
  homeStartImage?: string;
}

export default function HomeView({
  projects,
  homeStartImage,
}: HomeViewProps) {
  // Use custom home start image, or fall back to the first project's image, or a high-quality art fallback
  const featuredImage = homeStartImage || projects[0]?.coverImage || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1600";

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 bg-stone-100" id="home-immersive-stage">
      {/* Immersive Full-Page Background Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className="w-full h-full relative"
      >
        <img
          src={featuredImage}
          alt="Featured Spotlight Artwork"
          className="w-full h-full object-cover select-none pointer-events-none filter brightness-[0.98]"
          referrerPolicy="no-referrer"
        />
        
        {/* Subtle, highly polished vignette overlay for a premium gallery atmosphere */}
        <div className="absolute inset-0 bg-stone-950/5 pointer-events-none" />
      </motion.div>
    </div>
  );
}
