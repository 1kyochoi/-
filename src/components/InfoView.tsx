import React from 'react';
import { Mail, Instagram } from 'lucide-react';
import { ArtistInfo, CvItem, TextSection } from '../types';

interface InfoViewProps {
  artistInfo: ArtistInfo;
  cvItems: CvItem[];
  texts: TextSection[];
  lang: 'ko' | 'en';
}

export default function InfoView({ artistInfo, cvItems, texts, lang }: InfoViewProps) {
  // Separate CV items by their exact sections
  const soloExhibitions = cvItems.filter((item) => item.section === 'solo');
  const groupExhibitions = cvItems.filter((item) => item.section === 'group');
  const collections = cvItems.filter((item) => item.section === 'collection');
  
  // Combine award and residency into a unified section like Goudal
  const awardsAndResidencies = cvItems.filter(
    (item) => item.section === 'award' || item.section === 'residency'
  );
  
  // Extract statements and reviews
  const statements = texts.filter((t) => t.category === 'statement');
  const reviews = texts.filter((t) => t.category === 'review' || t.category === 'press');

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20" id="info-immersive-page">
      
      {/* 1. ARTIST BIOGRAPHY / PROFILE */}
      <section className="mb-20" id="goudal-info-bio">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-8 space-y-6">
            <h1 className="font-sans font-light text-xl tracking-[0.15em] text-stone-900 uppercase">
              {lang === 'ko' ? artistInfo.nameKo : artistInfo.nameEn}
            </h1>
            <p className="font-mono text-[9px] text-stone-400 uppercase tracking-[0.2em]">
              {lang === 'ko' ? '작가 소개 / Biography' : 'BIOGRAPHY'}
            </p>
            <div className="space-y-4 text-stone-600 text-xs sm:text-sm leading-relaxed font-light text-justify">
              <p className="font-medium text-stone-800">
                {lang === 'ko' ? artistInfo.headlineKo : artistInfo.headlineEn}
              </p>
              <p className="whitespace-pre-line">
                {lang === 'ko' ? artistInfo.bioKo : artistInfo.bioEn}
              </p>
            </div>
          </div>
          
          <div className="md:col-span-4 aspect-[4/5] bg-stone-100 overflow-hidden border border-stone-200/50">
            <img
              src={artistInfo.profileImage || "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600"}
              alt={`${artistInfo.nameEn} Portrait`}
              className="w-full h-full object-cover filter grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Thin elegant separator */}
      <hr className="border-t border-stone-200/50 my-16" />

      {/* 2. SOLO EXHIBITIONS */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8" id="goudal-info-solo">
        <div className="md:col-span-3">
          <h2 className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.25em] font-medium sticky top-24">
            {lang === 'ko' ? '개인전' : 'SOLO EXHIBITIONS'}
          </h2>
        </div>
        <div className="md:col-span-9 space-y-4">
          {soloExhibitions.length > 0 ? (
            soloExhibitions.map((item) => (
              <div key={item.id} className="flex gap-8 text-xs sm:text-sm items-start">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">
                  {item.year}
                </span>
                <span className="text-stone-700 leading-relaxed font-light">
                  {lang === 'ko' ? item.contentKo : item.contentEn}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-300 font-mono italic">No entries</p>
          )}
        </div>
      </section>

      <hr className="border-t border-stone-100/70 my-12" />

      {/* 3. GROUP EXHIBITIONS */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8" id="goudal-info-group">
        <div className="md:col-span-3">
          <h2 className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.25em] font-medium sticky top-24">
            {lang === 'ko' ? '단체전' : 'GROUP EXHIBITIONS'}
          </h2>
        </div>
        <div className="md:col-span-9 space-y-4">
          {groupExhibitions.length > 0 ? (
            groupExhibitions.map((item) => (
              <div key={item.id} className="flex gap-8 text-xs sm:text-sm items-start">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">
                  {item.year}
                </span>
                <span className="text-stone-700 leading-relaxed font-light">
                  {lang === 'ko' ? item.contentKo : item.contentEn}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-300 font-mono italic">No entries</p>
          )}
        </div>
      </section>

      <hr className="border-t border-stone-100/70 my-12" />

      {/* 4. COLLECTIONS */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8" id="goudal-info-collection">
        <div className="md:col-span-3">
          <h2 className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.25em] font-medium sticky top-24">
            {lang === 'ko' ? '소장처' : 'COLLECTIONS'}
          </h2>
        </div>
        <div className="md:col-span-9 space-y-4">
          {collections.length > 0 ? (
            collections.map((item) => (
              <div key={item.id} className="flex gap-8 text-xs sm:text-sm items-start">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">
                  {item.year}
                </span>
                <span className="text-stone-700 leading-relaxed font-light">
                  {lang === 'ko' ? item.contentKo : item.contentEn}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-300 font-mono italic">No entries</p>
          )}
        </div>
      </section>

      <hr className="border-t border-stone-100/70 my-12" />

      {/* 5. PUBLICATIONS (ARTIST BOOKS) */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8" id="goudal-info-publications">
        <div className="md:col-span-3">
          <h2 className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.25em] font-medium sticky top-24">
            {lang === 'ko' ? '출판물' : 'PUBLICATIONS'}
          </h2>
        </div>
        <div className="md:col-span-9 space-y-4">
          {lang === 'ko' ? (
            <>
              <div className="flex gap-8 text-xs sm:text-sm items-start">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">2026</span>
                <span className="text-stone-700 leading-relaxed font-light">
                  <strong>《기억의 표면 (Surfaces of Memory)》</strong>, 리소그래프 스튜디오 출판, 84페이지 (50부 한정판 아티스트 북)
                </span>
              </div>
              <div className="flex gap-8 text-xs sm:text-sm items-start">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">2024</span>
                <span className="text-stone-700 leading-relaxed font-light">
                  <strong>《최원교: 과도기적 스케치 (Choi Wonkyo: Sketches of Transition)》</strong>, 미술 아카이브 인쇄, 120페이지
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-8 text-xs sm:text-sm items-start">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">2026</span>
                <span className="text-stone-700 leading-relaxed font-light">
                  <strong>"Surfaces of Memory (Artist Book)"</strong>, Risograph Studio Publications, 84 pages (Edition of 50)
                </span>
              </div>
              <div className="flex gap-8 text-xs sm:text-sm items-start">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">2024</span>
                <span className="text-stone-700 leading-relaxed font-light">
                  <strong>"Choi Wonkyo: Sketches of Transition"</strong>, Fine Art Archive Press, 120 pages
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      <hr className="border-t border-stone-100/70 my-12" />

      {/* 6. AWARDS & RESIDENCIES */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8" id="goudal-info-awards">
        <div className="md:col-span-3">
          <h2 className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.25em] font-medium sticky top-24">
            {lang === 'ko' ? '수상 및 레지던시' : 'AWARDS & RESIDENCIES'}
          </h2>
        </div>
        <div className="md:col-span-9 space-y-4">
          {awardsAndResidencies.length > 0 ? (
            awardsAndResidencies.map((item) => (
              <div key={item.id} className="flex gap-8 text-xs sm:text-sm items-start">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">
                  {item.year}
                </span>
                <span className="text-stone-700 leading-relaxed font-light">
                  {lang === 'ko' ? item.contentKo : item.contentEn}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-300 font-mono italic">No entries</p>
          )}
        </div>
      </section>

      <hr className="border-t border-stone-100/70 my-12" />

      {/* 7. WRITINGS & CRITICISM (글) */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8" id="goudal-info-writings">
        <div className="md:col-span-3">
          <h2 className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.25em] font-medium sticky top-24">
            {lang === 'ko' ? '글과 비평' : 'TEXTS'}
          </h2>
        </div>
        <div className="md:col-span-9 space-y-12">
          {/* Critic Reviews */}
          {reviews.map((rev) => (
            <div key={rev.id} className="space-y-3 pt-6 border-t border-stone-100/80">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-widest text-stone-400 uppercase">
                  {lang === 'ko' ? `[비평글 / CRITICAL REVIEW — ${rev.authorKo || '평론가'}]` : `[CRITICAL REVIEW — ${rev.authorEn || 'Critic'}]`}
                </span>
                {rev.date && <span className="font-mono text-[9px] text-stone-400">{rev.date}</span>}
              </div>
              <h3 className="text-sm font-semibold text-stone-900 tracking-wide">
                {lang === 'ko' ? rev.titleKo : rev.titleEn}
              </h3>
              <div className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light whitespace-pre-line text-justify">
                {lang === 'ko' ? rev.contentKo : rev.contentEn}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-t border-stone-100/70 my-12" />

      {/* 8. PRESS / BIBLIOGRAPHY (프레스) */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8" id="goudal-info-press">
        <div className="md:col-span-3">
          <h2 className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.25em] font-medium sticky top-24">
            {lang === 'ko' ? '보도 및 비평지' : 'PRESS & BIBLIOGRAPHY'}
          </h2>
        </div>
        <div className="md:col-span-9 space-y-4">
          {lang === 'ko' ? (
            <>
              <div className="flex gap-8 text-xs sm:text-sm items-start py-1">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">2026</span>
                <span className="text-stone-700 leading-relaxed font-light">월간 퍼블릭아트, 3월호 기획 미술가 조명, '지워진 벽면의 수사학 - 최원교'</span>
              </div>
              <div className="flex gap-8 text-xs sm:text-sm items-start py-1">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">2025</span>
                <span className="text-stone-700 leading-relaxed font-light">부산미술평론, 창간 제15호 평론 수록, '기억의 유동성과 오간자 실크의 떨림'</span>
              </div>
              <div className="flex gap-8 text-xs sm:text-sm items-start py-1">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">2024</span>
                <span className="text-stone-700 leading-relaxed font-light">아트인컬처, '주목할 만한 동시대 젊은 미술가 20인' 특별 지면 선정 및 인터뷰 수록</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-8 text-xs sm:text-sm items-start py-1">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">2026</span>
                <span className="text-stone-700 leading-relaxed font-light">Public Art Magazine, March Issue Spotlight: "The Rhetoric of Weathered Façades - Choi Wonkyo"</span>
              </div>
              <div className="flex gap-8 text-xs sm:text-sm items-start py-1">
                <span className="font-mono text-stone-400 w-10 text-left shrink-0 font-light select-none">2025</span>
                <span className="text-stone-700 leading-relaxed font-light">Busan Art Criticism, Vol. 15 Review: "The Fluidity of Recollection and Shivering Silk Surfaces"</span>
              </div>
              <div className="flex gap-8 text-xs sm:text-sm items-start py-1">
                <span className="text-stone-700 leading-relaxed font-light">Art in Culture, Featured & Interviewed in "20 Emerging Contemporary Artists of the Year" portfolio</span>
              </div>
            </>
          )}
        </div>
      </section>

      <hr className="border-t border-stone-200/50 my-16" />

      {/* 9. CONTACT DETAILS */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8" id="goudal-info-contact">
        <div className="md:col-span-3">
          <h2 className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.25em] font-medium sticky top-24">
            {lang === 'ko' ? '연락처' : 'CONTACT'}
          </h2>
        </div>
        <div className="md:col-span-9 space-y-6">
          <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
            {lang === 'ko'
              ? '작품 소장, 대여 및 기획 전시 참여 제안은 메일 혹은 인스타그램 DM을 이용해주시기 바랍니다.'
              : 'For original work acquisition, renting inquiries, or exhibition proposals, please connect using the email or Instagram references below.'}
          </p>
          
          <div className="space-y-3 text-xs sm:text-sm font-mono pt-2">
            <div className="flex gap-8">
              <span className="text-stone-400 w-24 uppercase tracking-wider select-none">EMAIL</span>
              <a href={`mailto:${artistInfo.email}`} className="text-stone-700 hover:text-stone-950 transition-colors border-b border-stone-300 hover:border-stone-950">
                {artistInfo.email}
              </a>
            </div>
            <div className="flex gap-8">
              <span className="text-stone-400 w-24 uppercase tracking-wider select-none">INSTAGRAM</span>
              <a href={`https://instagram.com/${artistInfo.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-stone-700 hover:text-stone-950 transition-colors border-b border-stone-300 hover:border-stone-950">
                {artistInfo.instagram}
              </a>
            </div>
            {artistInfo.agencyKo && (
              <div className="flex gap-8">
                <span className="text-stone-400 w-24 uppercase tracking-wider select-none">GALLERY</span>
                <span className="text-stone-600">
                  {lang === 'ko' ? artistInfo.agencyKo : artistInfo.agencyEn}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
