import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mail, Check, X, AlertCircle } from 'lucide-react';
import { Project, Inquiry } from '../types';

function getEmbedUrl(url: string): { type: 'youtube' | 'vimeo' | 'direct' | 'unknown'; embedUrl: string } {
  if (!url) return { type: 'unknown', embedUrl: '' };
  
  const trimmed = url.trim();
  
  // YouTube
  const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const youtubeMatch = trimmed.match(youtubeRegExp);
  if (youtubeMatch && youtubeMatch[2].length === 11) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[2]}`
    };
  }
  
  // Vimeo
  const vimeoRegExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
  const vimeoMatch = trimmed.match(vimeoRegExp);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
    };
  }

  // Direct MP4 / WebM / OGG
  const lower = trimmed.toLowerCase();
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg') || lower.includes('.mp4?') || lower.includes('.webm?')) {
    return {
      type: 'direct',
      embedUrl: trimmed
    };
  }

  // Unknown fallback
  return {
    type: 'unknown',
    embedUrl: trimmed
  };
}

interface WorkDetailViewProps {
  project: Project;
  lang: 'ko' | 'en';
  onBack: () => void;
  onAddInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'isRead'>) => void;
}

export default function WorkDetailView({ project, lang, onBack, onAddInquiry }: WorkDetailViewProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleOpenInquiry = () => {
    setInquiryOpen(true);
    setSenderName('');
    setSenderEmail('');
    setMessage(
      lang === 'ko'
        ? `안녕하세요, 최원교 작가님. '${project.titleKo}' (${project.year}) 작품에 대한 상세 정보 및 소장/대여 문의드립니다.`
        : `Dear Wonkyo Choi, I am writing to inquire about the details and availability of your work '${project.titleEn}' (${project.year}).`
    );
    setIsSubmitted(false);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) {
      setError(lang === 'ko' ? '모든 항목을 필수 입력해주십시오.' : 'Please fill in all fields.');
      return;
    }
    if (!senderEmail.includes('@')) {
      setError(lang === 'ko' ? '이메일 형식이 유효하지 않습니다.' : 'Please enter a valid email address.');
      return;
    }

    onAddInquiry({
      senderName,
      senderEmail,
      message,
      artworkTitle: `${project.titleEn} (${project.titleKo})`,
    });

    setIsSubmitted(true);
    setError('');
    setTimeout(() => {
      setInquiryOpen(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6" id="work-detail-stage">
      {/* 1. Minimal Back Button */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="group flex items-center space-x-1.5 text-stone-400 hover:text-stone-900 transition-colors text-xs font-mono tracking-widest uppercase cursor-pointer"
          id="back-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← {lang === 'ko' ? '목록으로' : 'INDEX'}</span>
        </button>
      </div>

      {/* 2. Title & Year Header */}
      <div className="mb-10 text-left border-b border-stone-200/40 pb-6" id="detail-header">
        <span className="text-[10px] font-mono text-stone-400 tracking-widest uppercase block mb-1">
          [{project.category}]
        </span>
        <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-stone-900">
          {lang === 'ko' ? project.titleKo : project.titleEn}
        </h1>
        {project.artworkNameKo && (
          <p className="text-sm text-stone-500 font-serif italic mt-1">
            {lang === 'ko' ? project.artworkNameKo : project.artworkNameEn}
          </p>
        )}
        <span className="text-xs font-mono text-stone-400 mt-2 block">{project.year}</span>
      </div>

      {/* 3. Primary Full-width Showcase Image */}
      <div 
        className="w-full bg-stone-50 border border-stone-200 overflow-hidden mb-12 flex justify-center items-center cursor-zoom-in group relative" 
        id="detail-primary-plate"
        onClick={() => setLightboxImage(project.coverImage)}
        title={lang === 'ko' ? '클릭하면 사진을 크게 볼 수 있습니다' : 'Click to enlarge image'}
      >
        <img
          src={project.coverImage}
          alt={project.titleEn}
          className="w-full h-auto max-h-[85vh] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-3 right-3 bg-black/40 text-white/90 text-[10px] font-mono py-1 px-2.5 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-xs pointer-events-none">
          {lang === 'ko' ? '확대 보기' : 'CLICK TO ENLARGE'}
        </div>
      </div>

      {/* 4. Elegant Minimal Description / Artist Note (500~800 chars) */}
      {project.category !== 'Projects' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 pb-12 border-b border-stone-200/40" id="detail-essay">
          <div className="md:col-span-3 text-[10px] font-mono text-stone-400 tracking-widest uppercase pt-1">
            {project.category === 'Exhibitions'
              ? (lang === 'ko' ? '텍스트' : 'TEXT')
              : (lang === 'ko' ? '작가 노트' : 'ARTIST STATEMENT')}
          </div>
          <div className="md:col-span-9">
            <p className="text-stone-600 text-sm leading-relaxed font-light whitespace-pre-line text-justify">
              {lang === 'ko' ? project.descriptionKo : project.descriptionEn}
            </p>
          </div>
        </div>
      )}

      {/* 5. Additional Plates / Sub-images (Staggered or stacked) */}
      {project.detailImages && project.detailImages.length > 1 && (
        <div className="space-y-12 mb-16" id="detail-secondary-plates">
          <span className="text-[10px] font-mono text-stone-400 tracking-widest uppercase block mb-6">
            {lang === 'ko' ? '세부 이미지 / 추가 기록' : 'ADDITIONAL PLATES'}
          </span>
          {project.detailImages.filter(img => img !== project.coverImage).map((img, idx) => (
            <div 
              key={idx} 
              className="w-full bg-stone-50 border border-stone-200/60 overflow-hidden flex justify-center items-center cursor-zoom-in group relative"
              onClick={() => setLightboxImage(img)}
              title={lang === 'ko' ? '클릭하면 사진을 크게 볼 수 있습니다' : 'Click to enlarge image'}
            >
              <img
                src={img}
                alt={`${project.titleEn} - plate ${idx + 1}`}
                className="w-full h-auto max-h-[85vh] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 right-3 bg-black/40 text-white/90 text-[10px] font-mono py-1 px-2.5 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-xs pointer-events-none">
                {lang === 'ko' ? '확대 보기' : 'CLICK TO ENLARGE'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Section */}
      {project.videoUrl && project.videoUrl.trim().length > 0 && (
        <div className="w-full mb-12 border-t border-stone-200/60 pt-8 text-left" id="detail-video-player">
          <span className="text-[10px] font-mono text-stone-400 tracking-widest uppercase block mb-4">
            {lang === 'ko' ? '비디오 기록 / 움직임' : 'VIDEO DOCUMENTATION'}
          </span>
          {(() => {
            const parsed = getEmbedUrl(project.videoUrl);
            if (parsed.type === 'youtube' || parsed.type === 'vimeo') {
              return (
                <div className="relative w-full aspect-video bg-black overflow-hidden border border-stone-200/80 shadow-xs">
                  <iframe
                    src={parsed.embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={project.titleEn}
                  />
                </div>
              );
            } else if (parsed.type === 'direct') {
              return (
                <div className="w-full bg-black border border-stone-200/80 overflow-hidden flex justify-center items-center shadow-xs">
                  <video
                    src={parsed.embedUrl}
                    controls
                    playsInline
                    className="w-full h-auto max-h-[75vh]"
                  />
                </div>
              );
            } else {
              return (
                <div className="p-5 border border-stone-200/80 text-left bg-stone-50/50 rounded-xs">
                  <p className="text-xs text-stone-500 font-light mb-2.5">
                    {lang === 'ko' 
                      ? '등록된 동영상을 확인하려면 외부 링크를 방문해 주십시오.' 
                      : 'Please visit the external link to view the registered video documentation.'}
                  </p>
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-[10px] tracking-widest uppercase py-2 px-3.5 rounded-xs transition-colors"
                  >
                    <span>{lang === 'ko' ? '동영상 열기' : 'OPEN VIDEO LINK'}</span>
                  </a>
                </div>
              );
            }
          })()}
        </div>
      )}

      {/* 6. Simplified Technical Specifications Sheet */}
      <div className="border-t border-stone-200/60 pt-8 mb-12 text-left" id="detail-specs-table">
        <h3 className="text-[10px] font-mono text-stone-400 tracking-widest uppercase mb-4">
          {lang === 'ko' ? '작품 상세 규격' : 'TECHNICAL SPECIFICATIONS'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-[11px] font-light text-stone-600">
          {!project.hideProjectTitle && (
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-400 font-mono text-[9px] tracking-wider uppercase">{lang === 'ko' ? '프로젝트' : 'PROJECT'}</span>
              <span className="text-stone-850 font-medium truncate max-w-[65%]">{lang === 'ko' ? project.titleKo : project.titleEn}</span>
            </div>
          )}

          {!project.hideArtworkName && (
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-400 font-mono text-[9px] tracking-wider uppercase">{lang === 'ko' ? '작품명' : 'TITLE'}</span>
              <span className="text-stone-850 font-medium italic truncate max-w-[65%]">{lang === 'ko' ? (project.artworkNameKo || '—') : (project.artworkNameEn || '—')}</span>
            </div>
          )}

          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-400 font-mono text-[9px] tracking-wider uppercase">{lang === 'ko' ? '제작 연도' : 'YEAR'}</span>
            <span className="text-stone-850 font-mono">{project.year || '—'}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-400 font-mono text-[9px] tracking-wider uppercase">{lang === 'ko' ? '재료' : 'MEDIUM'}</span>
            <span className="text-stone-850 truncate max-w-[65%]">{lang === 'ko' ? (project.materialKo || '—') : (project.materialEn || '—')}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-400 font-mono text-[9px] tracking-wider uppercase">{lang === 'ko' ? '규격' : 'DIMENSIONS'}</span>
            <span className="text-stone-850 font-mono">{project.size || 'Dimensions Variable'}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-400 font-mono text-[9px] tracking-wider uppercase">{lang === 'ko' ? '소장' : 'PROVENANCE'}</span>
            <span className="text-stone-850 truncate max-w-[65%]">{lang === 'ko' ? (project.locationKo || '작가 소장') : (project.locationEn || 'Artist Collection')}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-400 font-mono text-[9px] tracking-wider uppercase">{lang === 'ko' ? '에디션' : 'EDITION'}</span>
            <span className="text-stone-850 font-mono">{lang === 'ko' ? (project.editionKo || '—') : (project.editionEn || '—')}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-400 font-mono text-[9px] tracking-wider uppercase">{lang === 'ko' ? '상태' : 'ACQUISITION'}</span>
            <span className="text-stone-850">
              {project.salesStatus === 'available' && (lang === 'ko' ? '● 소장 가능' : '● Available')}
              {project.salesStatus === 'sold' && (lang === 'ko' ? '소장 완료' : 'Acquired')}
              {project.salesStatus === 'inquire' && (lang === 'ko' ? '문의 요망' : 'Contact Gallery')}
              {project.salesStatus === 'private' && (lang === 'ko' ? '비매품' : 'Private Archive')}
            </span>
          </div>
        </div>

        {/* Purchase Inquire trigger */}
        <div className="mt-5 flex justify-end" id="specs-inquire-gate">
          {project.salesStatus !== 'private' && (
            <button
              onClick={handleOpenInquiry}
              className="flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-[10px] tracking-widest uppercase py-2 px-4 rounded-xs transition-colors cursor-pointer"
            >
              <Mail className="w-3 h-3" />
              <span>{lang === 'ko' ? '소장 및 대여 문의' : 'SEND INQUIRY'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Inquiry Dialog Box */}
      <AnimatePresence>
        {inquiryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm" id="inquiry-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white max-w-md w-full border border-stone-300 shadow-2xl rounded-sm overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest uppercase text-stone-300">
                  {lang === 'ko' ? '작품 소장 문의 양식' : 'OFFICIAL ACQUISITION FORM'}
                </span>
                <button onClick={() => setInquiryOpen(false)} className="text-stone-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {isSubmitted ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center">
                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center mb-4 border border-stone-300">
                      <Check className="w-5 h-5 text-stone-900" />
                    </div>
                    <h4 className="text-sm font-semibold text-stone-900">
                      {lang === 'ko' ? '문의가 접수되었습니다.' : 'Inquiry Filed Successfully'}
                    </h4>
                    <p className="text-stone-400 text-[11px] mt-1.5 max-w-xs font-mono">
                      {lang === 'ko' 
                        ? '입력하신 이메일로 2~3일 내 연락드리겠습니다.' 
                        : 'We will get back to you within 48 hours.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-stone-50 p-3 border border-stone-100 text-xs">
                      <span className="text-stone-400 font-mono text-[9px] uppercase block">{lang === 'ko' ? '문의 대상 작품' : 'INQUIRY TARGET'}</span>
                      <span className="font-serif font-medium text-stone-800">{lang === 'ko' ? project.titleKo : project.titleEn}</span>
                      <span className="text-stone-400 text-[10px] font-mono block mt-0.5">{project.year} · {project.size}</span>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-1 font-medium">
                        {lang === 'ko' ? '문의자 성함' : 'YOUR NAME'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="border border-stone-200 focus:border-stone-950 p-2 text-xs outline-none rounded-sm font-light text-stone-900"
                        placeholder={lang === 'ko' ? '성함 혹은 대리인 명칭' : 'Name / Gallery Representative'}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-1 font-medium">
                        {lang === 'ko' ? '회신용 이메일' : 'EMAIL ADDRESS'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="border border-stone-200 focus:border-stone-950 p-2 text-xs outline-none rounded-sm text-stone-900 font-mono"
                        placeholder="example@gallery.com"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-1 font-medium">
                        {lang === 'ko' ? '상세 메시지' : 'MESSAGE'} *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border border-stone-200 focus:border-stone-950 p-2 text-xs outline-none rounded-sm text-stone-900 resize-none font-light"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center space-x-1.5 text-red-600 text-[11px] font-mono">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs tracking-widest py-2.5 rounded-sm uppercase transition-colors cursor-pointer"
                    >
                      {lang === 'ko' ? '전송하기' : 'SUBMIT FORM'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal for High-Resolution View */}
      <AnimatePresence>
        {lightboxImage && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xs cursor-zoom-out select-none"
            onClick={() => setLightboxImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-stone-400 hover:text-white transition-colors cursor-pointer p-2 z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(null);
              }}
              title={lang === 'ko' ? '닫기' : 'Close'}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={lightboxImage}
              alt="Expanded view"
              className="max-w-[95vw] max-h-[92vh] object-contain shadow-2xl"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
