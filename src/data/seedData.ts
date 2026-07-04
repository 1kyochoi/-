import { PortfolioData } from '../types';

export const initialPortfolioData: PortfolioData = {
  artistInfo: {
    nameKo: "최원교",
    nameEn: "CHOI WONKYO",
    headlineKo: "부산과 서울을 오가며 활동하는 현대미술가. 지층과 외벽, 소멸하는 일상적 무대를 촉각적 표면으로 환원하는 회화와 장소특정적 설치 미술을 선보인다.",
    headlineEn: "A contemporary artist working between Busan and Seoul, translating urban interfaces, weathered facades, and vanishing spaces into tactile paintings and site-specific installations.",
    bioKo: "최원교는 일상적인 도시 환경과 잊혀가는 개인적 역사의 틈새를 시각화하는 작업을 진행해 왔다. 그의 작업은 콘크리트 벽의 얼룩, 폐쇄된 공간의 빛, 유실된 가구의 흔적 등 사소하고 덧없는 풍경에서 출발한다. 다양한 층위의 질감을 살린 회화와 관람객의 공감각적 체험을 유도하는 설치 작업을 통해, 그는 고정된 물리적 공간을 유동적이고 주관적인 '기억의 무대'로 환원시킨다.",
    bioEn: "Choi Wonkyo explores the fragile crevices between modern urban topography and fading memories. Starting with overlooked details—facade weathering, concrete staining, dust accumulation, and neglected corners—he builds dense physical interfaces. Through heavily textured multi-layer paintings and quiet, site-specific organza installations, Choi converts rigid structural spaces into fluid, subjective arenas of human time.",
    email: "1kyochoi@gmail.com",
    instagram: "@wonkyo.choi.studio",
    agencyKo: "갤러리 컨템포러리 서울",
    agencyEn: "Gallery Contemporary Seoul",
    profileImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600",
    nameFontFamily: "Cormorant Garamond",
    nameColor: "#1c1917",
    nameFontSize: "18px",
    nameFontWeight: "300",
    menuFontFamily: "JetBrains Mono",
    menuColor: "#a8a29e",
    menuActiveColor: "#1c1917",
    homeStartImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200"
  },
  projects: [
    {
      id: "work-1",
      category: "Projects",
      titleKo: "기억의 표면",
      titleEn: "Surfaces of Memory",
      artworkNameKo: "기억의 표면 No. 12",
      artworkNameEn: "Surface of Memory No. 12",
      year: "2026",
      materialKo: "캔버스에 아크릴, 혼합재료",
      materialEn: "Acrylic and mixed media on canvas",
      size: "162.2 × 130.3 cm",
      descriptionKo: "〈기억의 표면〉 연작은 급격히 변화하는 도시 공간의 외벽과 그 위를 스쳐 지나간 시간의 흔적을 캔버스 위로 불러내는 회화 작업이다. 캔버스 위에 시멘트 가루, 대리석 분말, 아크릴 미디엄을 두껍게 쌓아 올린 뒤, 이를 다시 깎아내고 긁어내는 과정을 반복한다. 이 반복적인 노동은 풍화 작용에 의해 허물어지는 건물 외벽의 흐름과 닮아 있다. 거친 마티에르는 만질 수 없는 시각적 기억에 촉각적인 부피감을 부여하며, 과거와 현재가 겹쳐진 중첩된 시간의 단면을 드러낸다.",
      descriptionEn: "The 'Surfaces of Memory' series is a painterly exploration that summons onto canvas the exterior walls of rapidly changing urban spaces and the passage of time etched upon them. The artist heavily layers cement dust, marble powder, and acrylic mediums onto the canvas, only to scrape, carve, and sand them back down repeatedly. This repetitive labor mirrors the natural weathering of architectural facades, granting a tactile volume to otherwise untouchable visual memories.",
      coverImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200",
      detailImages: [
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200",
        "https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=1200",
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200"
      ],
      locationKo: "작가 소장",
      locationEn: "Artist's Collection",
      editionKo: "단작 (Unique)",
      editionEn: "Unique Piece",
      isPublished: true,
      isFeatured: true,
      salesStatus: "available"
    },
    {
      id: "work-2",
      category: "Exhibitions",
      titleKo: "기억의 형태 (개인전)",
      titleEn: "Forms of Memory (Solo Exhibition)",
      artworkNameKo: "기억의 형태 설치 전경 #03",
      artworkNameEn: "Forms of Memory Installation View #03",
      year: "2025",
      materialKo: "반투명 실크, 목재 구조물, 단채널 비디오, 혼합재료",
      materialEn: "Translucent silk, wooden frames, single-channel video, mixed media",
      size: "가변크기",
      descriptionKo: "〈기억의 형태〉는 특정 공간의 역사적 맥락과 개인의 서사를 결합한 장소특정적(Site-specific) 설치 작업이다. 작가는 가볍고 반투명한 오간자 실크 천을 공간 전체에 공중 매달고, 그 표면 위에 부산 영도 근대 조선소 주변에서 촬영된 이미지들을 투사한다. 공기의 미세한 흐름에 따라 흔들리는 실크는 투사된 기억의 상을 분절하고 흔들리게 함으로써 과거가 아닌, 현재 진행형으로 재구성되는 기억의 유동성을 공감각적으로 시각화한다.",
      descriptionEn: "The 'Forms of Memory' is a site-specific installation that weaves together the historical context of a particular space and subjective personal narratives. The artist suspends layers of sheer, semi-transparent organza silk throughout the gallery and projects onto them fragmental photographs captured around the historic shipyards of Yeongdo, Busan. As the delicate fabrics sway with the ambient air current, the projected memories warp and fragment, visually materializing the fluid instability of recollection.",
      coverImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1200",
      detailImages: [
        "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1200",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200"
      ],
      locationKo: "영도 조선소 예술센터, 부산",
      locationEn: "Yeongdo Shipyard Art Center, Busan",
      editionKo: "가변설치 (Unique)",
      editionEn: "Unique Installation",
      isPublished: true,
      isFeatured: true,
      salesStatus: "inquire"
    },
    {
      id: "work-3",
      category: "Books",
      titleKo: "기억의 표면 (아티스트 북)",
      titleEn: "Surfaces of Memory (Artist Book)",
      artworkNameKo: "아티스트 북 한정판 에디션",
      artworkNameEn: "Artist Book Limited Edition",
      year: "2026",
      materialKo: "하드커버, 리소그래프 인쇄, 84페이지",
      materialEn: "Hardcover, risograph print, 84 pages",
      size: "24.0 × 30.0 cm",
      descriptionKo: "본 아티스트 북은 〈기억의 표면〉 장기 연작의 도판들과 작가 노트를 수록하여 50부 한정판으로 제작되었습니다. 각 책에는 작가의 친필 서명과 에디션 넘버가 기입되어 있으며, 리소그래프 고유의 아날로그 질감과 미세한 정렬 오차를 통해 작업의 촉각성을 고스란히 담아냈습니다.",
      descriptionEn: "This artist book gathers visual plates and personal notes from the multi-year 'Surfaces of Memory' series, produced in a hand-numbered limited edition of 50 copies. Printed using risograph processes, the book captures the physical textures and microscopic alignments of Choi Wonkyo's paintings.",
      coverImage: "https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=1200",
      detailImages: [
        "https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=1200"
      ],
      locationKo: "작가 소장",
      locationEn: "Artist's Collection",
      editionKo: "Ed. 12/50",
      editionEn: "Ed. 12/50",
      isPublished: true,
      isFeatured: false,
      salesStatus: "available"
    },
    {
      id: "work-4",
      category: "Projects",
      titleKo: "구조의 그림자",
      titleEn: "Shadow of Structure",
      artworkNameKo: "구조의 그림자 (에스키스)",
      artworkNameEn: "Shadow of Structure (Esquisse)",
      year: "2024",
      materialKo: "종이에 목탄, 연필",
      materialEn: "Charcoal and pencil on paper",
      size: "76.0 × 56.0 cm",
      descriptionKo: "철거 예정 지역인 사상 공업지대의 철골 트러스 구조물을 관찰하며 기록한 아카이브 성격의 연구 드로잉이다. 가루 형태의 탄소가 거친 수제 종이 펄프 틈새로 스며들어, 소멸하는 장소의 침묵을 명상적으로 헌사한다.",
      descriptionEn: "An archival study drawing documenting the steel trusses of the Sasang industrial area slated for demolition. The carbon particles settle within the micro-cavities of hand-pressed textured paper, capturing the silence of fading architectures.",
      coverImage: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1200",
      detailImages: [
        "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1200",
        "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?q=80&w=1200"
      ],
      locationKo: "작가 소장",
      locationEn: "Artist's Collection",
      editionKo: "단작 (Unique)",
      editionEn: "Unique Piece",
      isPublished: true,
      isFeatured: false,
      salesStatus: "available"
    }
  ],
  texts: [
    {
      id: "text-1",
      category: "statement",
      titleKo: "기억의 퇴적과 주관적 영토",
      titleEn: "The Sedimentation of Memory and Subjective Territory",
      contentKo: "나는 공간이 단순히 기하학적이고 물리적인 차원에 그치지 않고, 그 안에 거쳐 간 이들의 기억과 시간이 축적되어 마침내 스스로 호흡하는 유기체라고 생각한다. 나의 작업은 급격한 개발과 재생의 구호 아래 지워져가는 도시의 틈새를 바라보고, 그 속의 시각적·촉각적 지층을 복원하는 시도이다.\n\n회화 작업에서는 아크릴 미디엄과 시멘트 분말을 겹겹이 축적한 후 날카롭게 깎아내거나 부드럽게 문지른다. 이러한 촉각적 마티에르는 만질 수 없는 시각적 기억에 구체적인 질량을 부여하여, 과거와 현재가 공존하는 중첩의 풍경을 연출한다.",
      contentEn: "I perceive space not merely as a mechanical, geometric layout, but as a living palimpsest saturated with the time, friction, and memories of those who passed through. My work addresses the overlooked cracks in urban developments, transforming fleeting facades into concrete physical surfaces.\n\nIn my painting practice, I layer cement dust and minerals onto the canvas, then aggressively shave, scrape, and polish them. This creates raw textures that grant physical weight to ethereal human recollections, transforming visual planes into tangible, archaeological strata."
    },
    {
      id: "text-2",
      category: "review",
      titleKo: "소멸의 표면을 지탱하는 촉각적 환영",
      titleEn: "Tactile Illusions Sustaining the Surfaces of Disappearance",
      authorKo: "박영훈 (미술평론가)",
      authorEn: "Younghoon Park (Art Critic)",
      date: "2025.10",
      contentKo: "임세형의 작업은 물질과 시간의 긴장 관계에 천착한다. 그가 제작하는 거칠고 육중한 화면은 단순한 추상적 무늬가 아니다. 그것은 소멸의 위기에 처한 도시의 구석들, 혹은 인간 문명이 비워둔 장소의 촉각적 표상이다. 철거 현장의 질감과 닮은 그의 물질적 층위는 마치 역사적 지층처럼 기능한다. 지워진 흔적들이 그의 거친 마티에르 틈 사이에서 희미한 생명을 부여받아 미미하게 요동치고 있다.\n\n그가 만들어내는 가볍고 미세하게 흔들리는 설치 작업과 이 육중한 회화의 대비는 결국 사라지는 것들을 기억하고 붙잡아두려는 필사적인 태도의 양면을 보여준다.",
      contentEn: "Sehyung Lim's practice centers on the persistent friction between weight and disappearance. The concrete-like, deeply layered surfaces of his canvases do not serve as decorative abstractions; they act as tactile memorials to the neglected interfaces of our cities. Lim transforms ordinary walls and historical dust into archaeological strata, where forgotten stories are resurrected within the textured crevices.\n\nThe dynamic play between his heavy, dense paintings and his weightless, shivering installations exposes a profound yearning to anchor and record that which is rapidly vanishing."
    }
  ],
  cvItems: [
    {
      id: "cv-1",
      section: "education",
      year: "2024",
      contentKo: "부산대학교 대학원 미술학과 서양화 전공 석사 졸업 (MFA)",
      contentEn: "MFA, Fine Art (Painting), Pusan National University, Graduate School"
    },
    {
      id: "cv-2",
      section: "education",
      year: "2021",
      contentKo: "부산대학교 예술대학 미술학과 서양화 전공 학사 졸업 (BFA)",
      contentEn: "BFA, Painting, Pusan National University"
    },
    {
      id: "cv-3",
      section: "solo",
      year: "2026",
      contentKo: "《도시의 표면》, 갤러리 팩토리, 서울, 한국",
      contentEn: "'Surfaces of the City', Gallery Factory, Seoul, Korea"
    },
    {
      id: "cv-4",
      section: "solo",
      year: "2025",
      contentKo: "《기억의 형태》, 영도 조선소 예술센터, 부산, 한국",
      contentEn: "'Forms of Memory', Yeongdo Shipyard Art Center, Busan, Korea"
    },
    {
      id: "cv-5",
      section: "group",
      year: "2025",
      contentKo: "《흘러가는 땅, 남아있는 표면》, 국립현대미술관 고양레지던시, 고양, 한국",
      contentEn: "'Flowing Ground, Remaining Surface', MMCA Goyang Residency, Goyang, Korea"
    },
    {
      id: "cv-6",
      section: "group",
      year: "2024",
      contentKo: "《청년미술제: 과도기적 시간》, 부산시립미술관, 부산, 한국",
      contentEn: "'Youth Art Festival: Transitional Time', Busan Museum of Art, Busan, Korea"
    },
    {
      id: "cv-7",
      section: "group",
      year: "2023",
      contentKo: "《질감의 사유》, 아라리오 갤러리 서울, 서울, 한국",
      contentEn: "'Contemplation of Texture', Arario Gallery Seoul, Seoul, Korea"
    },
    {
      id: "cv-8",
      section: "award",
      year: "2025",
      contentKo: "부산문화재단 청년예술가 창작지원 사업 선정",
      contentEn: "Selected for Young Artist Creative Grant, Busan Foundation for Arts and Culture"
    },
    {
      id: "cv-9",
      section: "award",
      year: "2024",
      contentKo: "부산 현대미술대전 우수작가상",
      contentEn: "Excellence Prize, Busan Contemporary Art Competition"
    },
    {
      id: "cv-10",
      section: "residency",
      year: "2025",
      contentKo: "부산 영도 깡깡이예술마을 레지던시 입주 작가",
      contentEn: "Artist-in-Residence, Kangkangee Arts Village, Yeongdo, Busan"
    },
    {
      id: "cv-11",
      section: "collection",
      year: "2026",
      contentKo: "국립현대미술관 미술은행, 부산문화재단, 서울 개인 소장자, 제네바 개인 소장자",
      contentEn: "MMCA Art Bank, Busan Foundation for Arts and Culture, Private Collections in Seoul & Geneva"
    }
  ],
  inquiries: [
    {
      id: "inq-1",
      date: "2026-07-01T15:23:00Z",
      senderName: "김민재 큐레이터",
      senderEmail: "minjae.k@museum.org",
      message: "안녕하세요 최원교 작가님, 올해 말 기획전 참여와 관련하여 작품 대여(기억의 표면 No. 12) 및 스튜디오 방문 미팅을 제안하고자 연락드렸습니다. 상세 조건과 일정 논의가 가능한지 문의드립니다.",
      artworkTitle: "Surface of Memory No. 12",
      isRead: false
    }
  ]
};
