export interface ArtistInfo {
  nameKo: string;
  nameEn: string;
  headlineKo: string;
  headlineEn: string;
  bioKo: string;
  bioEn: string;
  email: string;
  instagram: string;
  agencyKo?: string;
  agencyEn?: string;
  profileImage?: string;
  nameFontFamily?: string;
  nameColor?: string;
  nameFontSize?: string;
  nameFontWeight?: string;
  menuFontFamily?: string;
  menuColor?: string;
  menuActiveColor?: string;
  homeStartImage?: string;
}

export interface Project {
  id: string;
  category: string;
  titleKo: string; // 작업명 / 시리즈명
  titleEn: string;
  artworkNameKo?: string; // 작품명 (선택)
  artworkNameEn?: string;
  year: string; // 연도
  materialKo?: string; // 재료
  materialEn?: string;
  size?: string; // 크기
  descriptionKo: string; // 작업 설명글 (작가노트)
  descriptionEn: string;
  coverImage: string; // 대표 이미지
  detailImages: string[]; // 상세 이미지 목록
  locationKo?: string; // 전시 장소
  locationEn?: string;
  editionKo?: string; // 에디션 (e.g. Ed. 1/5)
  editionEn?: string;
  isPublished: boolean; // 공개/비공개
  isFeatured: boolean;
  salesStatus: 'available' | 'sold' | 'private' | 'inquire'; // 판매 가능, 판매 완료, 비공개, 문의 필요
  videoUrl?: string; // 동영상 링크
}

export interface TextSection {
  id: string;
  category: 'statement' | 'project' | 'review' | 'press' | 'interview';
  titleKo: string;
  titleEn: string;
  authorKo?: string;
  authorEn?: string;
  contentKo: string;
  contentEn: string;
  date?: string;
}

export interface CvItem {
  id: string;
  section: 'education' | 'solo' | 'group' | 'award' | 'residency' | 'collection' | 'press';
  year: string;
  contentKo: string;
  contentEn: string;
}

export interface Inquiry {
  id: string;
  date: string;
  senderName: string;
  senderEmail: string;
  message: string;
  artworkTitle?: string;
  isRead: boolean;
}

export interface WorkCategory {
  name: string;
  enabled: boolean;
}

export interface PortfolioData {
  artistInfo: ArtistInfo;
  projects: Project[];
  texts: TextSection[];
  cvItems: CvItem[];
  inquiries: Inquiry[];
  categories?: WorkCategory[];
}

