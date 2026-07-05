import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Mail, Send, AlertCircle } from 'lucide-react';
import { ArtistInfo, Inquiry } from '../types';

interface GlobalInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistInfo: ArtistInfo;
  lang: 'ko' | 'en';
  onAddInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'isRead'>) => void;
}

export default function GlobalInquiryModal({
  isOpen,
  onClose,
  artistInfo,
  lang,
  onAddInquiry
}: GlobalInquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General'); // General / Exhibition / Acquisition / StudioVisit / Collab
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const subjects = [
    { id: 'General', labelKo: '일반 문의 및 인사', labelEn: 'General & Contact' },
    { id: 'Exhibition', labelKo: '전시 및 기획 문의', labelEn: 'Curatorial & Exhibition' },
    { id: 'Acquisition', labelKo: '작품 소장 및 구입 문의', labelEn: 'Acquisition / Purchase' },
    { id: 'Collaboration', labelKo: '브랜드 협업 및 프로젝트', labelEn: 'Collaboration / Projects' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(lang === 'ko' ? '모든 항목을 필수 입력해주십시오.' : 'Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      setError(lang === 'ko' ? '올바른 이메일 형식을 작성해 주세요.' : 'Please enter a valid email address.');
      return;
    }

    // Capture subject prefix inside the message
    const selectedSubjectLabel = subjects.find(s => s.id === subject)?.[lang === 'ko' ? 'labelKo' : 'labelEn'] || subject;
    const fullMessage = `[Type: ${selectedSubjectLabel}]\n\n${message}`;

    // 1. Add to local administration storage/state
    onAddInquiry({
      senderName: name,
      senderEmail: email,
      message: fullMessage,
    });

    setIsSubmitted(true);

    // 2. Automatically dispatch/trigger native email redirection (mailto) to the artist's address!
    // This allows the message to be actually transmitted to the artist's real inbox.
    const emailSubject = `[Wonkyo Choi Portfolio Inquiry] ${selectedSubjectLabel}`;
    const emailBody = `Sender: ${name} (${email})\nType: ${selectedSubjectLabel}\n\nMessage:\n${message}\n\n---\nSent via Portfolio Contact Form`;
    
    const mailtoUrl = `mailto:${artistInfo.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Redirect after a small delay to let the user see the success screen
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 1500);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm" id="global-inquiry-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white max-w-lg w-full border border-stone-200 shadow-2xl rounded overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-stone-900 text-stone-50 px-6 py-4 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-stone-300" />
                <span className="text-[10px] font-mono tracking-widest uppercase text-stone-300 font-medium">
                  {lang === 'ko' ? '작가에게 이메일 문의' : 'EMAIL INQUIRY TO ARTIST'}
                </span>
              </div>
              <button 
                onClick={handleClose} 
                className="text-stone-400 hover:text-white cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
              {isSubmitted ? (
                <div className="py-12 text-center flex flex-col items-center justify-center space-y-4" id="global-inquiry-success">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="serif-display text-xl text-stone-900">
                    {lang === 'ko' ? '문의가 성공적으로 기록되었습니다' : 'Inquiry Saved Successfully'}
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto">
                    {lang === 'ko'
                      ? '작품 문의 데이터베이스에 저장되었습니다. 작가 이메일 주소(1kyochoi@gmail.com)로 직접 전송하실 수 있도록 이메일 전송창(Mail App)을 연동해 드립니다. 창이 열리면 바로 보내기를 눌러주세요.'
                      : 'Saved to the local portfolio inquiries. We are launching your mail app with the pre-filled inquiry. Simply hit [Send] in your mail app to complete delivery.'}
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 text-xs font-mono text-stone-900 hover:text-stone-600 underline underline-offset-4 cursor-pointer"
                  >
                    {lang === 'ko' ? '닫기' : 'Close Window'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" id="global-inquiry-form">
                  <div className="bg-stone-50 p-4 border border-stone-200/60 rounded text-xs leading-relaxed text-stone-500 font-light">
                    {lang === 'ko'
                      ? '이메일 주소 클릭 시 나타나는 문의 양식입니다. 폼을 작성하신 뒤 발송 버튼을 누르시면, 작가 웹 관리자 사서함에 보관되며 동시에 실제 작가의 이메일(1kyochoi@gmail.com)로 메시지가 연결 발송됩니다.'
                      : 'This inquiry form is launched by clicking the email link. Submitting will register the inquiry in the portfolio dashboard and pop up your email app pre-filled to Wonkyo Choi.'}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1.5 font-bold">
                        {lang === 'ko' ? '성함' : 'YOUR NAME'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-stone-50 border border-stone-200 focus:border-stone-900 p-2.5 text-xs outline-none rounded font-light text-stone-900"
                        placeholder={lang === 'ko' ? '성함을 기재해 주세요' : 'Name'}
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1.5 font-bold">
                        {lang === 'ko' ? '회신받을 이메일 주소' : 'YOUR EMAIL'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-stone-50 border border-stone-200 focus:border-stone-900 p-2.5 text-xs outline-none rounded text-stone-900 font-mono"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Subject Selector */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1.5 font-bold">
                      {lang === 'ko' ? '문의 목적' : 'INQUIRY TYPE'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      {subjects.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setSubject(sub.id)}
                          className={`text-left p-2.5 border rounded cursor-pointer transition-all ${
                            subject === sub.id
                              ? 'border-stone-900 bg-stone-900 text-stone-50 font-normal shadow-sm'
                              : 'border-stone-200 hover:border-stone-400 bg-stone-50'
                          }`}
                        >
                          <span className="block font-medium text-[11px]">{lang === 'ko' ? sub.labelKo : sub.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1.5 font-bold">
                      {lang === 'ko' ? '문의 내용' : 'MESSAGE CONTENT'} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-stone-50 border border-stone-200 focus:border-stone-900 p-2.5 text-xs outline-none rounded font-light text-stone-900 resize-none"
                      placeholder={
                        lang === 'ko'
                          ? '프로젝트 기획안, 전시 협업 요청, 혹은 소장 희망 작품 등의 자세한 내용을 작성해 주세요.'
                          : 'Please specify curate layouts, series timeline, sizing request, or media inquiry details.'
                      }
                    />
                  </div>

                  {error && (
                    <div className="flex items-center space-x-1.5 text-red-600 bg-red-50 border border-red-100 p-2.5 rounded text-xs font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs tracking-wider py-3 rounded uppercase font-medium cursor-pointer transition-colors text-center border border-stone-200"
                    >
                      {lang === 'ko' ? '취소' : 'CANCEL'}
                    </button>
                    
                    <button
                      type="submit"
                      className="flex-[2] flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs tracking-wider py-3 rounded uppercase font-medium cursor-pointer transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{lang === 'ko' ? '메시지 발송' : 'SEND MESSAGE'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
