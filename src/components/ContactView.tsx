import React, { useState } from 'react';
import { Mail, Instagram, Check, Send, AlertCircle, MapPin } from 'lucide-react';
import { ArtistInfo, Inquiry } from '../types';

interface ContactViewProps {
  artistInfo: ArtistInfo;
  lang: 'ko' | 'en';
  onAddInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'isRead'>) => void;
}

export default function ContactView({ artistInfo, lang, onAddInquiry }: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Exhibition'); // Exhibition / Purchase / Studio Visit / Collab
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const subjects = [
    { id: 'Exhibition', labelKo: '전시 및 도록 기획 문의', labelEn: 'Curatorial & Exhibition' },
    { id: 'Acquisition', labelKo: '작품 소장 및 구입 문의', labelEn: 'Acquisition / Purchase' },
    { id: 'StudioVisit', labelKo: '아틀리에 방문 / 프레스', labelEn: 'Studio Visit & Press' },
    { id: 'Collaboration', labelKo: '브랜드 협업 및 프로젝트', labelEn: 'Collaboration / Projects' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError(lang === 'ko' ? '필수 입력 항목을 채워주세요.' : 'Please fill in all required fields.');
      return;
    }

    if (!email.includes('@')) {
      setFormError(lang === 'ko' ? '올바른 이메일 형식을 작성해 주세요.' : 'Please enter a valid email address.');
      return;
    }

    // Capture subject prefix inside the message or store it
    const fullMessage = `[Type: ${subject}]\n\n${message}`;

    onAddInquiry({
      senderName: name,
      senderEmail: email,
      message: fullMessage,
    });

    setIsSubmitted(true);
    setFormError('');

    // Reset fields
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" id="contact-view">
      {/* Title section */}
      <div className="mb-12 border-b border-stone-200/50 pb-6">
        <span className="mono-meta text-[10px] text-stone-400 tracking-widest">
          {lang === 'ko' ? '문의 및 협업' : 'CONTACT PORTAL'}
        </span>
        <h1 className="serif-display text-3xl sm:text-4xl text-stone-900 mt-2">
          {lang === 'ko' ? '소통 및 문의' : 'Inquiries & Channels'}
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-3 font-light leading-relaxed max-w-2xl">
          {lang === 'ko'
            ? '전시 제안, 작품 구매 소장, 아틀리에 방문 및 협업 문의를 남겨주시면, 작가 혹은 소속 에이전시 매니저가 내용을 검토한 뒤 기재하신 이메일 주소로 연락드리겠습니다.'
            : 'For proposals, acquisitions, studio visits, or general questions, please send a message. We will respond promptly to your provided email address.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="contact-content-grid">
        
        {/* Left: General Info channels */}
        <div className="lg:col-span-5 space-y-8" id="channels-column">
          <div className="bg-stone-100 p-6 sm:p-8 rounded border border-stone-200/80">
            <h2 className="serif-display text-xl text-stone-900 mb-6 tracking-wide">
              {lang === 'ko' ? '직접 연락 채널' : 'Direct Contacts'}
            </h2>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-stone-50 border border-stone-200 rounded flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-stone-600" />
                </div>
                <div>
                  <span className="mono-meta text-[9px] text-stone-400 block font-light">{lang === 'ko' ? '공식 이메일' : 'EMAIL ADDRESS'}</span>
                  <a href={`mailto:${artistInfo.email}`} className="text-xs sm:text-sm text-stone-800 hover:text-stone-950 hover:underline font-mono mt-0.5 block">
                    {artistInfo.email}
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-stone-50 border border-stone-200 rounded flex items-center justify-center shrink-0">
                  <Instagram className="w-4 h-4 text-stone-600" />
                </div>
                <div>
                  <span className="mono-meta text-[9px] text-stone-400 block font-light">{lang === 'ko' ? '인스타그램' : 'INSTAGRAM'}</span>
                  <a
                    href={`https://instagram.com/${artistInfo.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-stone-800 hover:text-stone-950 hover:underline font-mono mt-0.5 block"
                  >
                    {artistInfo.instagram}
                  </a>
                </div>
              </div>

              {/* Studio Location */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-stone-50 border border-stone-200 rounded flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-stone-600" />
                </div>
                <div>
                  <span className="mono-meta text-[9px] text-stone-400 block font-light">{lang === 'ko' ? '작업실 위치' : 'STUDIO LOCATION'}</span>
                  <span className="text-xs sm:text-sm text-stone-800 mt-0.5 block font-light">
                    {lang === 'ko' ? '대한민국 부산광역시 영도구' : 'Yeongdo-gu, Busan, South Korea'}
                  </span>
                </div>
              </div>
            </div>

            {/* Representation footnote */}
            {artistInfo.agencyKo && (
              <div className="mt-8 pt-6 border-t border-stone-200/80 text-[11px] text-stone-400 font-light">
                <span className="font-mono text-[9px] text-stone-400 block uppercase mb-1">{lang === 'ko' ? '대표 에이전시' : 'REPRESENTING AGENCY'}</span>
                {lang === 'ko' 
                  ? `본 작가의 일부 연작은 '${artistInfo.agencyKo}'가 대표 위탁 및 배급하고 있습니다.` 
                  : `Select canvas series are exclusively represented and managed by ${artistInfo.agencyEn}.`}
              </div>
            )}
          </div>

          {/* Aesthetic Quote block */}
          <div className="hidden lg:block p-6 border-l-2 border-stone-300 italic font-serif text-stone-500 font-light text-sm leading-relaxed">
            {lang === 'ko'
              ? '"예술가는 기억의 퇴적물 위에 주관적 영토를 짓고 흔드는 기록자이다. 찰나의 흔들림을 소장하는 것은 또 다른 시간의 차원을 방 안에 들여놓는 것과 같다."'
              : '"An artist is a chronicler building and shaking subjective territories upon the sediments of memory. Acquiring an artwork is like welcoming a different temporal dimension into your quiet room."'}
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-stone-50 border border-stone-200 p-6 sm:p-8 rounded" id="form-column">
          {isSubmitted ? (
            <div className="py-16 text-center flex flex-col items-center justify-center" id="form-success-pane">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 border border-emerald-300">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="serif-display text-2xl text-stone-900">
                {lang === 'ko' ? '메시지가 성공적으로 전송되었습니다' : 'Message Sent Successfully'}
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-3 max-w-md font-light leading-relaxed mx-auto">
                {lang === 'ko'
                  ? '문의해주셔서 대단히 감사드립니다. 남겨주신 소중한 메시지는 작가의 인박스에 저장되었으며, 검토 후 이메일로 신속하게 회신을 드리겠습니다.'
                  : 'Thank you for contacting us. Your message has been saved in the artist inquiries database. We will reply to your provided email address shortly.'}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-8 text-xs font-mono text-stone-900 underline underline-offset-4 hover:text-stone-600 cursor-pointer"
              >
                {lang === 'ko' ? '새 문의 메시지 작성하기' : 'Write Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" id="general-contact-form">
              <h2 className="serif-display text-xl text-stone-900 pb-2 border-b border-stone-100">
                {lang === 'ko' ? '문의 메시지 송신' : 'Inquiry Form'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Sender name */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-2 font-medium">
                    {lang === 'ko' ? '성함 / 기관명' : 'YOUR NAME / AGENCY'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ko' ? '성함을 작성해주세요' : 'Jane Doe'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-stone-100/50 border border-stone-200 focus:border-stone-950 p-3 text-xs outline-none rounded font-light text-stone-900"
                  />
                </div>

                {/* Sender Email */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-2 font-medium">
                    {lang === 'ko' ? '회신받을 이메일' : 'EMAIL ADDRESS'} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-stone-100/50 border border-stone-200 focus:border-stone-950 p-3 text-xs outline-none rounded font-light text-stone-900 font-mono"
                  />
                </div>
              </div>

              {/* Inquiry Type */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-2 font-medium">
                  {lang === 'ko' ? '문의 유형' : 'INQUIRY TYPE'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" id="subject-selector">
                  {subjects.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSubject(sub.id)}
                      className={`text-left p-3 border rounded transition-all cursor-pointer font-light ${
                        subject === sub.id
                          ? 'border-stone-950 bg-stone-950 text-stone-50 font-normal'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-100/30'
                      }`}
                    >
                      <span className="block font-medium text-[11px]">{lang === 'ko' ? sub.labelKo : sub.labelEn}</span>
                      <span className={`text-[9px] font-mono ${subject === sub.id ? 'text-stone-400' : 'text-stone-400'}`}>
                        {sub.id.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-2 font-medium">
                  {lang === 'ko' ? '상세 메시지 내용' : 'MESSAGE CONTENT'} *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder={
                    lang === 'ko'
                      ? '기획하시는 전시의 취지, 소장을 원하는 작품 규격, 협업 제안 일정 등을 상세하게 작성해 주십시오.'
                      : 'Please provide structural plans, timelines, exhibition layouts, or custom requests.'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-stone-100/50 border border-stone-200 focus:border-stone-950 p-3 text-xs outline-none rounded font-light text-stone-900 resize-none"
                />
              </div>

              {formError && (
                <div className="flex items-center space-x-1.5 text-red-600 bg-red-50 border border-red-200 p-3 rounded text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs tracking-widest py-3.5 px-6 rounded uppercase font-medium cursor-pointer transition-all duration-300 w-full shadow-sm hover:shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'ko' ? '메시지 발송 (SUBMIT)' : 'SEND MESSAGE'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
