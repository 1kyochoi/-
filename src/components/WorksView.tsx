import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, WorkCategory } from '../types';

interface WorksViewProps {
  projects: Project[];
  lang: 'ko' | 'en';
  onNavigateToProject: (projectId: string) => void;
  categories?: WorkCategory[];
}

export default function WorksView({ projects, lang, onNavigateToProject, categories }: WorksViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const defaultCategories: WorkCategory[] = [
    { name: 'Projects', enabled: true },
    { name: 'Exhibitions', enabled: true },
    { name: 'Books', enabled: true }
  ];

  const currentCategories = categories && categories.length > 0 ? categories : defaultCategories;
  const activeCategoriesList = useMemo(() => {
    return currentCategories.filter(c => c.enabled).map(c => c.name);
  }, [currentCategories]);

  // Filter out unpublished items for visitors and items belonging to disabled categories
  const publishedItems = useMemo(() => {
    return projects.filter((p) => p.isPublished && activeCategoriesList.includes(p.category));
  }, [projects, activeCategoriesList]);

  // Filter categories shown in the UI
  const filterCategories = useMemo(() => {
    return ['All', ...activeCategoriesList];
  }, [activeCategoriesList]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return publishedItems;
    return publishedItems.filter((p) => {
      // Graceful mapping for any older items in local database
      if (activeCategory === 'Projects' && ((p.category as string) === 'Works' || (p.category as string) === 'Archive')) {
        return true;
      }
      return p.category === activeCategory;
    });
  }, [publishedItems, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" id="works-view-stage">
      {/* 1. Quiet Header with Minimal Styling */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200/40 pb-6">
        <div>
          <span className="text-[10px] font-mono text-stone-400 tracking-widest uppercase">
            {lang === 'ko' ? 'INDEX OF WORKS' : 'INDEX OF WORKS'}
          </span>
          <h1 className="text-xl sm:text-2xl font-light tracking-wide text-stone-900 uppercase mt-1">
            {lang === 'ko' ? '작품 및 아카이브' : 'WORKS'}
          </h1>
        </div>

        {/* 2. Noémie Goudal-Style Minimal Sort / Filter Menu */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0 text-[11px] font-mono tracking-widest uppercase" id="goudal-filters">
          <span className="text-stone-300 select-none mr-1">{lang === 'ko' ? '분류 ↓' : 'SORT BY ↓'}</span>
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative py-1 cursor-pointer transition-all ${
                activeCategory === cat
                  ? 'text-stone-950 font-medium'
                  : 'text-stone-400 hover:text-stone-950'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.span
                  layoutId="activeFilterUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-stone-900"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Repeating Grid Rows (Up to 5 columns with natural aspect ratio images) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-12 mt-12" id="goudal-works-list">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const displayIndex = String(index + 1).padStart(2, '0');
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                onClick={() => onNavigateToProject(item.id)}
                className="group cursor-pointer flex flex-col space-y-3"
                id={`catalog-row-${item.id}`}
              >
                {/* Image Container - Natural Aspect Ratio */}
                <div className="w-full bg-stone-50 overflow-hidden border border-stone-200/60 relative flex items-center justify-center">
                  <img
                    src={item.coverImage}
                    alt={item.titleEn}
                    className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-[1.025]"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Delicate Hover Vignette overlay */}
                  <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info Block (Minimal and type-driven) */}
                <div className="flex flex-col text-left pt-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono text-stone-300 tracking-tight font-light shrink-0">
                      {displayIndex}
                    </span>
                    {/* Micro sales indicator status (Quiet gallery style) */}
                    <div className="text-[9px] font-mono tracking-widest text-right shrink-0">
                      {item.salesStatus === 'available' && (
                        <span className="text-stone-400 uppercase">{lang === 'ko' ? '● 문의가능' : '● Available'}</span>
                      )}
                      {item.salesStatus === 'sold' && (
                        <span className="text-stone-300 uppercase">{lang === 'ko' ? '개인소장' : 'Acquired'}</span>
                      )}
                      {item.salesStatus === 'inquire' && (
                        <span className="text-stone-400 uppercase font-medium">{lang === 'ko' ? '문의필요' : 'Inquire'}</span>
                      )}
                      {item.salesStatus === 'private' && (
                        <span className="text-stone-300 uppercase">{lang === 'ko' ? '비공개' : 'Private'}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-0.5">
                    {/* Category Label */}
                    <span className="text-[9px] font-mono text-stone-400 tracking-widest uppercase">
                      [{item.category}]
                    </span>

                    {/* Project/Series Title (작업명) */}
                    <h3 className="text-xs font-normal text-stone-950 tracking-wide line-clamp-2 leading-relaxed">
                      {lang === 'ko' ? item.titleKo : item.titleEn}
                    </h3>

                    {/* Specific piece title if registered (작품명) */}
                    {item.artworkNameKo && (
                      <p className="text-[11px] text-stone-500 font-light italic tracking-wide line-clamp-1">
                        {lang === 'ko' ? item.artworkNameKo : item.artworkNameEn}
                      </p>
                    )}

                    {/* Material, Dimensions & Year string */}
                    <p className="text-[10px] font-mono text-stone-400 font-light tracking-wide pt-0.5 leading-normal">
                      {lang === 'ko'
                        ? `${item.materialKo || ''}${item.size ? `, ${item.size}` : ''}, ${item.year}`
                        : `${item.materialEn || ''}${item.size ? `, ${item.size}` : ''}, ${item.year}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty Filter State */}
      {filteredItems.length === 0 && (
        <div className="py-32 text-center border border-dashed border-stone-200 mt-12 bg-white/50" id="works-empty-view">
          <span className="text-xs font-mono text-stone-400 tracking-widest">
            {lang === 'ko' ? '선택하신 분류의 기록이 없습니다.' : 'NO ENTRIES FOUND FOR THIS CATEGORY.'}
          </span>
        </div>
      )}
    </div>
  );
}
