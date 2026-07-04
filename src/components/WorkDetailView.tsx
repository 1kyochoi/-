import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mail, Check, X, AlertCircle } from 'lucide-react';
import { Project, Inquiry } from '../types';

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

  const handleOpenInquiry = () => {
    setInquiryOpen(true);
    setSenderName('');
    setSenderEmail('');
    setMessage(
      lang === 'ko'
        ? `안녕하세요, 임세형 작가님. '${project.titleKo}' (${project.year}) 작품에 대한 상세 정보 및 소장/대여 문의드립니다.`
        : `Dear Sehyung Lim, I am writing to inquire about the details and availability of your work '${project.titleEn}' (${project.year}).`
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
      <div className="w-full bg-stone-50 border border-stone-200 overflow-hidden mb-12 flex justify-center items-center" id="detail-primary-plate">
        <img
          src={project.coverImage}
          alt={project.titleEn}
          className="w-full h-auto max-h-[85vh] object-contain"
          referrerPolicy="no-referrer"
        />
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
            <div key={idx} className="w-full bg-stone-50 border border-stone-200/60 overflow-hidden flex justify-center items-center">
              <img
                src={img}
                alt={`${project.titleEn} - plate ${idx + 1}`}
                className="w-full h-auto max-h-[85vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      )}

      {/* 6. Technical Specifications Sheet */}
      <div className="bg-white border border-stone-200 p-8 mb-12" id="detail-specs-table">
        <h3 className="text-[10px] font-mono text-stone-400 tracking-widest uppercase mb-6 border-b border-stone-100 pb-3">
          {lang === 'ko' ? '작품 및 전시 세부 규격' : 'TECHNICAL SPECIFICATIONS'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-xs font-light">
          <div className="flex justify-between border-b border-stone-100 py-2">
            <span className="text-stone-400 font-mono text-[10px] uppercase">{lang === 'ko' ? '작업명 / 시리즈' : 'PROJECT / SERIES'}</span>
            <span className="text-stone-900 font-medium">{lang === 'ko' ? project.titleKo : project.titleEn}</span>
          </div>

          <div className="flex justify-between border-b border-stone-100 py-2">
            <span className="text-stone-400 font-mono text-[10px] uppercase">{lang === 'ko' ? '작품명' : 'PIECE TITLE'}</span>
            <span className="text-stone-900 font-medium italic">{lang === 'ko' ? (project.artworkNameKo || '—') : (project.artworkNameEn || '—')}</span>
          </div>

          <div className="flex justify-between border-b border-stone-100 py-2">
            <span className="text-stone-400 font-mono text-[10px] uppercase">{lang === 'ko' ? '제작 연도' : 'YEAR'}</span>
            <span className="text-stone-900 font-mono">{project.year}</span>
          </div>

          <div className="flex justify-between border-b border-stone-100 py-2">
            <span className="text-stone-400 font-mono text-[10px] uppercase">{lang === 'ko' ? '재료 / 매체' : 'MATERIALS'}</span>
            <span className="text-stone-900">{lang === 'ko' ? (project.materialKo || '—') : (project.materialEn || '—')}</span>
          </div>

          <div className="flex justify-between border-b border-stone-100 py-2">
            <span className="text-stone-400 font-mono text-[10px] uppercase">{lang === 'ko' ? '규격 / 크기' : 'DIMENSIONS'}</span>
            <span className="text-stone-900 font-mono">{project.size || 'Dimensions Variable'}</span>
          </div>

          <div className="flex justify-between border-b border-stone-100 py-2">
            <span className="text-stone-400 font-mono text-[10px] uppercase">{lang === 'ko' ? '소장 및 전시 장소' : 'PROVENANCE'}</span>
            <span className="text-stone-900">{lang === 'ko' ? (project.locationKo || '작가 소장') : (project.locationEn || 'Artist Collection')}</span>
          </div>

          <div className="flex justify-between border-b border-stone-100 py-2">
            <span className="text-stone-400 font-mono text-[10px] uppercase">{lang === 'ko' ? '에디션' : 'EDITION'}</span>
            <span className="text-stone-900 font-mono">{lang === 'ko' ? (project.editionKo || '—') : (project.editionEn || '—')}</span>
          </div>

          <div className="flex justify-between border-b border-stone-100 py-2">
            <span className="text-stone-400 font-mono text-[10px] uppercase">{lang === 'ko' ? '판매 상태' : 'ACQUISITION'}</span>
            <span className="text-stone-900 font-mono tracking-wider">
              {project.salesStatus === 'available' && (lang === 'ko' ? '● 소장 가능' : '● Available')}
              {project.salesStatus === 'sold' && (lang === 'ko' ? '소장 완료 (개인소장)' : 'Acquired (Private Collection)')}
              {project.salesStatus === 'inquire' && (lang === 'ko' ? '문의 요망' : 'Contact Gallery')}
              {project.salesStatus === 'private' && (lang === 'ko' ? '비매품' : 'Private Archive')}
            </span>
          </div>
        </div>

        {/* Purchase Inquire trigger */}
        <div className="mt-8 flex justify-end" id="specs-inquire-gate">
          {project.salesStatus !== 'private' && (
            <button
              onClick={handleOpenInquiry}
              className="flex items-center space-x-2 bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs tracking-widest uppercase py-3 px-6 rounded-sm transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{lang === 'ko' ? '소장 / 대여 문의하기' : 'SEND ACQUISITION INQUIRY'}</span>
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
    </div>
  );
}
