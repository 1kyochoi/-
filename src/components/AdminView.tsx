import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Unlock,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  User,
  FolderOpen,
  FileText,
  Mail,
  Sliders,
  CheckCircle2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { PortfolioData, Project, TextSection, CvItem, Inquiry } from '../types';
import {
  isSupabaseConfigured,
  saveArtworkInSupabase,
  deleteArtworkFromSupabase,
  updateArtworksOrderInSupabase,
  uploadArtworkImage
} from '../supabaseClient';

interface AdminViewProps {
  portfolioData: PortfolioData;
  onUpdatePortfolio: (data: PortfolioData) => void;
  lang: 'ko' | 'en';
  onResetToDefault: () => void;
  isAdminLoggedIn: boolean;
  onAdminLoginSuccess: () => void;
}

export default function AdminView({
  portfolioData,
  onUpdatePortfolio,
  lang,
  onResetToDefault,
  isAdminLoggedIn,
  onAdminLoginSuccess
}: AdminViewProps) {
  // Login State
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'profile' | 'texts' | 'cv' | 'inquiries' | 'system' | 'categories'>('projects');

  // Supabase states
  const [showSupabaseSetup, setShowSupabaseSetup] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingDetails, setIsUploadingDetails] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingHomeStart, setIsUploadingHomeStart] = useState(false);

  // Edit / Add States for Projects (Flattened Catalog)
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  
  // detailImages is handled in form as a string separated by newlines
  const [detailImagesText, setDetailImagesText] = useState('');

  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    category: 'Projects',
    titleKo: '',
    titleEn: '',
    artworkNameKo: '',
    artworkNameEn: '',
    year: '2026',
    materialKo: '',
    materialEn: '',
    size: '',
    descriptionKo: '',
    descriptionEn: '',
    coverImage: '',
    detailImages: [],
    locationKo: '',
    locationEn: '',
    editionKo: '',
    editionEn: '',
    isPublished: true,
    isFeatured: false,
    salesStatus: 'available'
  });

  // Edit / Add States for Text Sections
  const [editingText, setEditingText] = useState<TextSection | null>(null);
  const [isAddingText, setIsAddingText] = useState(false);
  const [textForm, setTextForm] = useState<Partial<TextSection>>({
    category: 'project',
    titleKo: '',
    titleEn: '',
    authorKo: '',
    authorEn: '',
    contentKo: '',
    contentEn: '',
    date: '2026.07'
  });

  // Edit / Add States for CV Items
  const [editingCvItem, setEditingCvItem] = useState<CvItem | null>(null);
  const [isAddingCvItem, setIsAddingCvItem] = useState(false);
  const [cvForm, setCvForm] = useState<Partial<CvItem>>({
    section: 'education',
    year: '2026',
    contentKo: '',
    contentEn: ''
  });

  // System notification
  const [systemNotice, setSystemNotice] = useState('');

  // Profile Portrait Image state
  const [profileImage, setProfileImage] = useState(portfolioData.artistInfo.profileImage || '');
  const [homeStartImage, setHomeStartImage] = useState(portfolioData.artistInfo.homeStartImage || '');

  // Visual styling live states
  const [nameFontFamily, setNameFontFamily] = useState(portfolioData.artistInfo.nameFontFamily || 'Cormorant Garamond');
  const [nameColor, setNameColor] = useState(portfolioData.artistInfo.nameColor || '#1c1917');
  const [nameFontSize, setNameFontSize] = useState(portfolioData.artistInfo.nameFontSize || '18px');
  const [nameFontWeight, setNameFontWeight] = useState(portfolioData.artistInfo.nameFontWeight || '300');
  const [menuFontFamily, setMenuFontFamily] = useState(portfolioData.artistInfo.menuFontFamily || 'JetBrains Mono');
  const [menuColor, setMenuColor] = useState(portfolioData.artistInfo.menuColor || '#a8a29e');
  const [menuActiveColor, setMenuActiveColor] = useState(portfolioData.artistInfo.menuActiveColor || '#1c1917');

  useEffect(() => {
    if (portfolioData.artistInfo.profileImage) {
      setProfileImage(portfolioData.artistInfo.profileImage);
    }
    if (portfolioData.artistInfo.homeStartImage) {
      setHomeStartImage(portfolioData.artistInfo.homeStartImage);
    }
    if (portfolioData.artistInfo.nameFontFamily) {
      setNameFontFamily(portfolioData.artistInfo.nameFontFamily);
    }
    if (portfolioData.artistInfo.nameColor) {
      setNameColor(portfolioData.artistInfo.nameColor);
    }
    if (portfolioData.artistInfo.nameFontSize) {
      setNameFontSize(portfolioData.artistInfo.nameFontSize);
    }
    if (portfolioData.artistInfo.nameFontWeight) {
      setNameFontWeight(portfolioData.artistInfo.nameFontWeight);
    }
    if (portfolioData.artistInfo.menuFontFamily) {
      setMenuFontFamily(portfolioData.artistInfo.menuFontFamily);
    }
    if (portfolioData.artistInfo.menuColor) {
      setMenuColor(portfolioData.artistInfo.menuColor);
    }
    if (portfolioData.artistInfo.menuActiveColor) {
      setMenuActiveColor(portfolioData.artistInfo.menuActiveColor);
    }
  }, [
    portfolioData.artistInfo.profileImage,
    portfolioData.artistInfo.homeStartImage,
    portfolioData.artistInfo.nameFontFamily,
    portfolioData.artistInfo.nameColor,
    portfolioData.artistInfo.nameFontSize,
    portfolioData.artistInfo.nameFontWeight,
    portfolioData.artistInfo.menuFontFamily,
    portfolioData.artistInfo.menuColor,
    portfolioData.artistInfo.menuActiveColor
  ]);

  // Password Login execution
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1111') {
      onAdminLoginSuccess();
      setLoginError('');
    } else {
      setLoginError(lang === 'ko' ? '비밀번호가 올바르지 않습니다. (비밀번호: 1111)' : 'Incorrect password. (Try 1111)');
    }
  };

  const showNotification = (msg: string) => {
    setSystemNotice(msg);
    setTimeout(() => {
      setSystemNotice('');
    }, 3000);
  };

  // Artist Profile Update
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updatedInfo = {
      ...portfolioData.artistInfo,
      nameKo: formData.get('nameKo') as string,
      nameEn: formData.get('nameEn') as string,
      headlineKo: formData.get('headlineKo') as string,
      headlineEn: formData.get('headlineEn') as string,
      bioKo: formData.get('bioKo') as string,
      bioEn: formData.get('bioEn') as string,
      email: formData.get('email') as string,
      instagram: formData.get('instagram') as string,
      agencyKo: formData.get('agencyKo') as string,
      agencyEn: formData.get('agencyEn') as string,
      profileImage: profileImage,
      homeStartImage: homeStartImage,
      nameFontFamily: formData.get('nameFontFamily') as string,
      nameColor: formData.get('nameColor') as string,
      nameFontSize: formData.get('nameFontSize') as string,
      nameFontWeight: formData.get('nameFontWeight') as string,
      menuFontFamily: formData.get('menuFontFamily') as string,
      menuColor: formData.get('menuColor') as string,
      menuActiveColor: formData.get('menuActiveColor') as string,
    };

    onUpdatePortfolio({
      ...portfolioData,
      artistInfo: updatedInfo
    });
    showNotification(lang === 'ko' ? '작가 정보가 성공적으로 변경되었습니다.' : 'Artist profile successfully updated.');
  };

  // PROJECT ACTIONS
  const handleMoveProject = async (index: number, direction: 'up' | 'down') => {
    const updatedProjects = [...portfolioData.projects];
    if (direction === 'up' && index > 0) {
      const temp = updatedProjects[index];
      updatedProjects[index] = updatedProjects[index - 1];
      updatedProjects[index - 1] = temp;
    } else if (direction === 'down' && index < updatedProjects.length - 1) {
      const temp = updatedProjects[index];
      updatedProjects[index] = updatedProjects[index + 1];
      updatedProjects[index + 1] = temp;
    } else {
      return;
    }

    if (isSupabaseConfigured()) {
      try {
        await updateArtworksOrderInSupabase(updatedProjects);
      } catch (err: any) {
        console.error(err);
        alert(lang === 'ko' ? `순서 저장 실패: ${err.message}` : `Failed to save order in Supabase: ${err.message}`);
        return;
      }
    }

    onUpdatePortfolio({ ...portfolioData, projects: updatedProjects });
    showNotification(lang === 'ko' ? '순서가 성공적으로 변경되었습니다.' : 'Works order successfully updated.');
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingProject) return;

    let updatedProjects = [...portfolioData.projects];

    // Parse newline separated images to detailImages array
    const detailImagesList = detailImagesText
      .split('\n')
      .map(img => img.trim())
      .filter(img => img.length > 0);

    // Make sure coverImage is included in detailImages if not already there
    if (projectForm.coverImage && !detailImagesList.includes(projectForm.coverImage)) {
      detailImagesList.unshift(projectForm.coverImage);
    }

    const compiledProjectForm: Project = {
      id: editingProject ? editingProject.id : `project-${Date.now()}`,
      category: projectForm.category || 'Projects',
      titleKo: projectForm.titleKo || '',
      titleEn: projectForm.titleEn || '',
      artworkNameKo: projectForm.artworkNameKo || '',
      artworkNameEn: projectForm.artworkNameEn || '',
      year: projectForm.year || '2026',
      materialKo: projectForm.materialKo || '',
      materialEn: projectForm.materialEn || '',
      size: projectForm.size || '',
      descriptionKo: projectForm.descriptionKo || '',
      descriptionEn: projectForm.descriptionEn || '',
      coverImage: projectForm.coverImage || '',
      detailImages: detailImagesList,
      locationKo: projectForm.locationKo || '',
      locationEn: projectForm.locationEn || '',
      editionKo: projectForm.editionKo || '',
      editionEn: projectForm.editionEn || '',
      isPublished: projectForm.isPublished !== undefined ? projectForm.isPublished : true,
      isFeatured: projectForm.isFeatured !== undefined ? projectForm.isFeatured : false,
      salesStatus: projectForm.salesStatus || 'available',
      videoUrl: projectForm.videoUrl || '',
    };

    setIsSavingProject(true);
    try {
      if (editingProject) {
        // Edit mode
        const index = updatedProjects.findIndex(p => p.id === editingProject.id);
        const orderIndex = index !== -1 ? index : updatedProjects.length;

        if (isSupabaseConfigured()) {
          await saveArtworkInSupabase(compiledProjectForm, orderIndex);
        }

        updatedProjects = updatedProjects.map((p) =>
          p.id === editingProject.id ? compiledProjectForm : p
        );
        showNotification(lang === 'ko' ? '작품 및 연작 정보를 수정했습니다.' : 'Project successfully updated.');
      } else {
        // Add mode
        const orderIndex = updatedProjects.length;

        if (isSupabaseConfigured()) {
          await saveArtworkInSupabase(compiledProjectForm, orderIndex);
        }

        updatedProjects.push(compiledProjectForm);
        showNotification(lang === 'ko' ? '새 작품 및 연작을 카탈로그에 등록했습니다.' : 'New project successfully added.');
      }

      onUpdatePortfolio({ ...portfolioData, projects: updatedProjects });
      setIsAddingProject(false);
      setEditingProject(null);
    } catch (err: any) {
      console.error(err);
      alert(lang === 'ko' ? `저장 실패: ${err.message}` : `Save failed: ${err.message}`);
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm(lang === 'ko' ? '정말로 이 작품/연작을 삭제하시겠습니까?' : 'Are you sure you want to delete this project?')) {
      if (isSupabaseConfigured()) {
        try {
          await deleteArtworkFromSupabase(id);
        } catch (err: any) {
          console.error(err);
          alert(lang === 'ko' ? `Supabase 삭제 실패: ${err.message}` : `Failed to delete from Supabase: ${err.message}`);
          return;
        }
      }
      const updatedProjects = portfolioData.projects.filter((p) => p.id !== id);
      onUpdatePortfolio({ ...portfolioData, projects: updatedProjects });
      showNotification(lang === 'ko' ? '삭제 완료되었습니다.' : 'Project deleted.');
    }
  };

  const handleStartEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm(project);
    setDetailImagesText(project.detailImages.join('\n'));
    setIsAddingProject(true);
  };

  const handleStartAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      category: (currentCategories[0]?.name || 'Projects') as any,
      titleKo: '',
      titleEn: '',
      artworkNameKo: '',
      artworkNameEn: '',
      year: '2026',
      materialKo: '',
      materialEn: '',
      size: '',
      descriptionKo: '',
      descriptionEn: '',
      coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
      detailImages: [],
      locationKo: '',
      locationEn: '',
      editionKo: '',
      editionEn: '',
      isPublished: true,
      isFeatured: false,
      salesStatus: 'available',
      videoUrl: ''
    });
    setDetailImagesText('https://images.unsplash.com/photo-1541701494587-cb58502866ab');
    setIsAddingProject(true);
  };

  // TEXT ACTIONS
  const handleSaveText = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedTexts = [...portfolioData.texts];

    if (editingText) {
      updatedTexts = updatedTexts.map((t) => (t.id === editingText.id ? { ...t, ...textForm } as TextSection : t));
    } else {
      const newText: TextSection = {
        id: `text-${Date.now()}`,
        category: textForm.category || 'project',
        titleKo: textForm.titleKo || '',
        titleEn: textForm.titleEn || '',
        authorKo: textForm.authorKo || '',
        authorEn: textForm.authorEn || '',
        contentKo: textForm.contentKo || '',
        contentEn: textForm.contentEn || '',
        date: textForm.date || '2026.07'
      };
      updatedTexts.push(newText);
    }

    onUpdatePortfolio({ ...portfolioData, texts: updatedTexts });
    setIsAddingText(false);
    setEditingText(null);
    showNotification(lang === 'ko' ? '글을 저장했습니다.' : 'Writing successfully saved.');
  };

  const handleDeleteText = (id: string) => {
    if (confirm(lang === 'ko' ? '이 글을 삭제하시겠습니까?' : 'Are you sure you want to delete this text?')) {
      const updatedTexts = portfolioData.texts.filter((t) => t.id !== id);
      onUpdatePortfolio({ ...portfolioData, texts: updatedTexts });
      showNotification(lang === 'ko' ? '글이 삭제되었습니다.' : 'Text entry deleted.');
    }
  };

  // CV ACTIONS
  const handleSaveCv = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedCv = [...portfolioData.cvItems];

    if (editingCvItem) {
      updatedCv = updatedCv.map((item) => (item.id === editingCvItem.id ? { ...item, ...cvForm } as CvItem : item));
    } else {
      const newItem: CvItem = {
        id: `cv-${Date.now()}`,
        section: cvForm.section || 'education',
        year: cvForm.year || '2026',
        contentKo: cvForm.contentKo || '',
        contentEn: cvForm.contentEn || ''
      };
      updatedCv.push(newItem);
    }

    onUpdatePortfolio({ ...portfolioData, cvItems: updatedCv });
    setIsAddingCvItem(false);
    setEditingCvItem(null);
    showNotification(lang === 'ko' ? 'CV 약력 항목을 성공적으로 추가했습니다.' : 'CV item successfully saved.');
  };

  const handleDeleteCvItem = (id: string) => {
    if (confirm(lang === 'ko' ? '이 CV 약력 항목을 삭제하시겠습니까?' : 'Are you sure you want to delete this CV entry?')) {
      const updatedCv = portfolioData.cvItems.filter((item) => item.id !== id);
      onUpdatePortfolio({ ...portfolioData, cvItems: updatedCv });
      showNotification(lang === 'ko' ? '삭제되었습니다.' : 'CV item deleted.');
    }
  };

  // INQUIRIES ACTIONS
  const handleToggleInquiryRead = (id: string) => {
    const updatedInqs = portfolioData.inquiries.map((inq) =>
      inq.id === id ? { ...inq, isRead: !inq.isRead } : inq
    );
    onUpdatePortfolio({ ...portfolioData, inquiries: updatedInqs });
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm(lang === 'ko' ? '이 문의 내역을 로그에서 삭제하시겠습니까?' : 'Are you sure you want to delete this inquiry?')) {
      const updatedInqs = portfolioData.inquiries.filter((inq) => inq.id !== id);
      onUpdatePortfolio({ ...portfolioData, inquiries: updatedInqs });
      showNotification(lang === 'ko' ? '기록이 삭제되었습니다.' : 'Inquiry entry deleted.');
    }
  };

  // CATEGORIES ACTIONS
  const defaultCategories = [
    { name: 'Projects', enabled: true },
    { name: 'Exhibitions', enabled: true },
    { name: 'Books', enabled: true }
  ];

  const currentCategories = portfolioData.categories && portfolioData.categories.length > 0
    ? portfolioData.categories
    : defaultCategories;

  const handleAddCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    
    // Check for duplicates
    if (currentCategories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      alert(lang === 'ko' ? '이미 존재하는 분류명입니다.' : 'This category name already exists.');
      return;
    }

    const updatedCategories = [
      ...currentCategories,
      { name: trimmed, enabled: true }
    ];

    onUpdatePortfolio({
      ...portfolioData,
      categories: updatedCategories
    });
    showNotification(lang === 'ko' ? '새 분류가 추가되었습니다.' : 'New category successfully added.');
  };

  const handleToggleCategory = (name: string) => {
    const updatedCategories = currentCategories.map(c => 
      c.name === name ? { ...c, enabled: !c.enabled } : c
    );
    onUpdatePortfolio({
      ...portfolioData,
      categories: updatedCategories
    });
    showNotification(lang === 'ko' ? '분류 상태가 변경되었습니다.' : 'Category status successfully toggled.');
  };

  const handleDeleteCategory = (name: string) => {
    // Check if any project is using this category
    const hasProjects = portfolioData.projects.some(p => p.category === name);
    if (hasProjects) {
      if (!confirm(lang === 'ko' 
        ? `이 분류로 등록된 작품이 존재합니다. 정말로 삭제하시겠습니까? (삭제된 분류의 작품은 Works 메뉴에서 보이지 않게 됩니다.)`
        : `Projects are registered under this category. Are you sure you want to delete this category? (Its projects will not be visible on the Works page.)`
      )) {
        return;
      }
    } else {
      if (!confirm(lang === 'ko' ? '이 분류를 삭제하시겠습니까?' : 'Are you sure you want to delete this category?')) {
        return;
      }
    }

    const updatedCategories = currentCategories.filter(c => c.name !== name);
    onUpdatePortfolio({
      ...portfolioData,
      categories: updatedCategories
    });
    showNotification(lang === 'ko' ? '분류가 삭제되었습니다.' : 'Category successfully deleted.');
  };

  // Backup state
  const handleExportState = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio_state_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification(lang === 'ko' ? '포트폴리오 백업 JSON 파일을 다운로드했습니다.' : 'Successfully exported portfolio state JSON.');
  };

  const handleImportState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target?.result as string);
        if (parsedData.artistInfo && parsedData.projects) {
          onUpdatePortfolio(parsedData);
          showNotification(lang === 'ko' ? '데이터가 백업 파일로부터 성공적으로 복구되었습니다.' : 'Portfolio state successfully restored!');
        } else {
          alert(lang === 'ko' ? '백업 파일 양식이 바르지 않습니다.' : 'Invalid file structure for portfolio state.');
        }
      } catch (err) {
        alert(lang === 'ko' ? '파일 파싱 에러 발생' : 'JSON Parse Error.');
      }
    };
    fileReader.readAsText(files[0]);
  };

  // Return password login if unauthorized
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-6 py-24" id="admin-lockscreen">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-stone-200 p-8 rounded text-center shadow-lg"
        >
          <div className="w-12 h-12 bg-stone-900 text-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-5 h-5" />
          </div>

          <h1 className="serif-display text-2xl text-stone-900 mb-2">
            {lang === 'ko' ? '관리자 인증 데스크' : 'Admin Area'}
          </h1>
          <p className="text-stone-400 text-xs font-mono tracking-widest mb-6 uppercase">
            {lang === 'ko' ? '보안 인증 암호 입력' : 'ENTER PASSWORD TO PROCEED'}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder={lang === 'ko' ? '비밀번호를 입력하세요 (기본: 1111)' : 'Enter password (Default: 1111)'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-stone-950 p-3 text-xs outline-none rounded font-mono text-center tracking-widest font-bold"
              autoFocus
            />

            {loginError && (
              <div className="flex items-center space-x-1 justify-center text-red-600 text-xs font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs tracking-widest py-3 rounded uppercase font-medium cursor-pointer transition-all"
            >
              {lang === 'ko' ? '잠금 해제 (UNLOCK)' : 'UNLOCK DASHBOARD'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" id="admin-dashboard">
      
      {/* Notifications system */}
      {systemNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-50 px-5 py-3 rounded shadow-xl flex items-center space-x-2 text-xs font-mono animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{systemNotice}</span>
        </div>
      )}

      {/* Admin Dashboard Title Bar */}
      <div className="mb-10 border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="mono-meta text-[10px] text-stone-400 tracking-widest block mb-1 uppercase">
            {lang === 'ko' ? '● 시스템 백엔드 관리자 세션 활성화' : '● SECURITY AUTHENTICATED'}
          </span>
          <h1 className="text-2xl font-light text-stone-900 flex items-center gap-2 tracking-wide uppercase">
            <Unlock className="w-5 h-5 text-stone-700 shrink-0" />
            <span>{lang === 'ko' ? '작가 포트폴리오 관리 데스크' : 'Artist Portfolio Administration'}</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onResetToDefault}
            className="flex items-center space-x-1.5 text-xs font-mono text-stone-600 hover:text-red-700 transition-colors py-2 px-3 border border-stone-200 bg-white hover:bg-stone-50 rounded cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'ko' ? '초기 시드 데이터 복구' : 'RESET TO DEFAULTS'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="admin-panel-grid">
        
        {/* Left Side: Sidebar controls */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 gap-1.5 text-xs font-mono border-b lg:border-b-0 lg:border-r border-stone-200/80 pr-0 lg:pr-6" id="admin-sidebar">
          
          <button
            onClick={() => { setActiveTab('projects'); }}
            className={`flex items-center space-x-2 py-3 px-4 rounded text-left shrink-0 cursor-pointer w-full transition-all ${
              activeTab === 'projects' ? 'bg-stone-900 text-stone-50' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/40'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span className="truncate">{lang === 'ko' ? '작품 및 연작 카탈로그' : 'Portfolio Catalog'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('categories'); }}
            className={`flex items-center space-x-2 py-3 px-4 rounded text-left shrink-0 cursor-pointer w-full transition-all ${
              activeTab === 'categories' ? 'bg-stone-900 text-stone-50' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/40'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="truncate">{lang === 'ko' ? '분류(카테고리) 관리' : 'Category Management'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('profile'); }}
            className={`flex items-center space-x-2 py-3 px-4 rounded text-left shrink-0 cursor-pointer w-full transition-all ${
              activeTab === 'profile' ? 'bg-stone-900 text-stone-50' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/40'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="truncate">{lang === 'ko' ? '작가 프로필 설정' : 'Artist Profile'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('texts'); }}
            className={`flex items-center space-x-2 py-3 px-4 rounded text-left shrink-0 cursor-pointer w-full transition-all ${
              activeTab === 'texts' ? 'bg-stone-900 text-stone-50' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="truncate">{lang === 'ko' ? '작가 노트 및 평론글' : 'Texts & Criticism'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('cv'); }}
            className={`flex items-center space-x-2 py-3 px-4 rounded text-left shrink-0 cursor-pointer w-full transition-all ${
              activeTab === 'cv' ? 'bg-stone-900 text-stone-50' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/40'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="truncate">{lang === 'ko' ? '약력 (CV) 편찬' : 'Curriculum Vitae'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('inquiries'); }}
            className={`flex items-center justify-between py-3 px-4 rounded shrink-0 cursor-pointer w-full transition-all ${
              activeTab === 'inquiries' ? 'bg-stone-900 text-stone-50' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/40'
            }`}
          >
            <div className="flex items-center space-x-2 truncate">
              <Mail className="w-4 h-4" />
              <span>{lang === 'ko' ? '소장 문의 기록로그' : 'Inquiries & Logs'}</span>
            </div>
            {portfolioData.inquiries.filter(i => !i.isRead).length > 0 && (
              <span className="bg-stone-900 text-stone-100 border border-stone-700 text-[10px] py-0.5 px-2 rounded-full font-bold">
                {portfolioData.inquiries.filter(i => !i.isRead).length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('system'); }}
            className={`flex items-center space-x-2 py-3 px-4 rounded text-left shrink-0 cursor-pointer w-full transition-all ${
              activeTab === 'system' ? 'bg-stone-900 text-stone-50' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/40'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="truncate">{lang === 'ko' ? '백업 및 데이터 관리' : 'Backup & Data'}</span>
          </button>

        </div>

        {/* Right Side: Tab Contents Panel */}
        <div className="lg:col-span-9 bg-white border border-stone-200 p-6 sm:p-8 rounded" id="admin-main-panel">
          
          {/* TAB 1: PORTFOLIO CATALOG (FLATTENED PROJECTS) */}
          {activeTab === 'projects' && (
            <div className="space-y-8" id="projects-list-tab">
              {/* Supabase Status Banner */}
              <div className="bg-white border border-stone-200/80 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-stone-400">PERSISTENT STORAGE</span>
                    {isSupabaseConfigured() ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[9px] font-mono tracking-wider font-bold uppercase py-0.5 px-2 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        SUPABASE ACTIVE
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200/60 text-[9px] font-mono tracking-wider font-bold uppercase py-0.5 px-2 rounded-full">
                        LOCAL DEMO MODE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 font-light max-w-xl">
                    {isSupabaseConfigured()
                      ? (lang === 'ko' ? '작품 및 업로드된 이미지가 실시간으로 Supabase 데이터베이스와 스토리지 버킷에 영구 저장됩니다.' : 'Artworks and uploaded image files are saved directly in real-time to your Supabase database and storage bucket.')
                      : (lang === 'ko' ? '로컬 세션 상태로 실행 중입니다. 영구 저장을 위해 .env 파일에 Supabase 환경변수를 등록해 주십시오.' : 'Currently running in simulated state. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env variables for persistent storage.')
                    }
                  </p>
                </div>
                {!isSupabaseConfigured() && (
                  <button
                    type="button"
                    onClick={() => setShowSupabaseSetup(!showSupabaseSetup)}
                    className="text-[10px] font-mono tracking-widest bg-stone-100 hover:bg-stone-200 text-stone-800 py-1.5 px-3 border border-stone-200 rounded uppercase cursor-pointer shrink-0 transition-colors"
                  >
                    {showSupabaseSetup ? (lang === 'ko' ? '안내 닫기' : 'HIDE SQL SETUP') : (lang === 'ko' ? '연동 SQL 보기' : 'VIEW SQL SETUP')}
                  </button>
                )}
              </div>

              {/* Toggleable SQL setup wizard for the user */}
              {!isSupabaseConfigured() && showSupabaseSetup && (
                <div className="bg-stone-900 text-stone-100 p-5 rounded border border-stone-800 space-y-4 font-light text-xs leading-relaxed" id="supabase-setup-instructions">
                  <p className="font-medium text-stone-200">
                    {lang === 'ko' ? '● Supabase 초기 연동 단계 (SQL 스크립트)' : '● Supabase Integration Steps & SQL Script'}
                  </p>
                  <p className="text-stone-400">
                    {lang === 'ko'
                      ? '1. Supabase 콘솔(supabase.com)에서 새 프로젝트를 생성합니다.\n2. SQL Editor 탭을 열고 아래 쿼리를 입력해 실행(Run)하여 artworks 테이블과 Row Level Security(RLS) 보안 규칙을 생성합니다.'
                      : '1. Create a project in your Supabase Console (supabase.com).\n2. Navigate to SQL Editor and run this query to bootstrap the artworks table & public read access policies.'}
                  </p>
                  <pre className="bg-stone-950 p-3.5 border border-stone-800 rounded font-mono text-[10px] leading-normal overflow-x-auto text-stone-300 max-h-48 select-all">
{`-- Create the artworks database table
create table if not exists public.artworks (
  id text primary key,
  title text not null,
  year text,
  medium text,
  size text,
  category text,
  description text,
  image_url text,
  order_index integer default 0,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.artworks enable row level security;

-- Setup RLS Policies for public access and anonymous editing
create policy "Allow public read access" on public.artworks
  for select using (true);

create policy "Allow public inserts" on public.artworks
  for insert with check (true);

create policy "Allow public updates" on public.artworks
  for update using (true);

create policy "Allow public deletes" on public.artworks
  for delete using (true);`}
                  </pre>
                  <p className="text-stone-400">
                    {lang === 'ko'
                      ? '3. Storage 탭에서 "artworks"라는 이름으로 새로운 [Public] 버킷을 하나 만들어 줍니다. (반드시 Public으로 체크해주십시오)\n4. .env 파일에 프로젝트의 URL과 Anon Key를 추가하면 연동이 즉시 완료됩니다.'
                      : '3. Create a public Storage Bucket named exactly "artworks" in your Storage panel.\n4. Complete the process by populating VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your env settings.'}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pb-4 border-b border-stone-200/60">
                <h2 className="text-lg font-light tracking-wide text-stone-900">{lang === 'ko' ? '등록된 작품 및 연작 리스트' : 'Portfolio Works'}</h2>
                {!isAddingProject && (
                  <button
                    onClick={handleStartAddProject}
                    className="flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 py-2 px-3 text-xs font-mono tracking-widest rounded uppercase cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'ko' ? '새 작품 등록' : 'NEW PROJECT'}</span>
                  </button>
                )}
              </div>

              {isAddingProject ? (
                <form onSubmit={handleSaveProject} className="space-y-5 bg-stone-50 p-6 border border-stone-200 rounded">
                  <h3 className="text-base font-light tracking-wide text-stone-900 pb-2 border-b border-stone-200">
                    {editingProject ? (lang === 'ko' ? '작품 상세 정보 수정' : 'Edit Work Details') : (lang === 'ko' ? '새 작품 정보 등록' : 'Register New Work')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Category (분류) *</label>
                      <select
                        value={projectForm.category || (currentCategories[0]?.name || 'Projects')}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none cursor-pointer font-mono"
                      >
                        {currentCategories.map((cat) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.name} {!cat.enabled ? ` (${lang === 'ko' ? '비활성화됨' : 'Disabled'})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Year (제작연도) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2026 또는 2024–2026"
                        value={projectForm.year || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Project/Series Title (Korean) *</label>
                      <input
                        type="text"
                        required
                        placeholder="연작 혹은 상위 대분류 제목"
                        value={projectForm.titleKo || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, titleKo: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Project/Series Title (English) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Series Title"
                        value={projectForm.titleEn || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, titleEn: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Piece Title (Korean - 선택)</label>
                      <input
                        type="text"
                        placeholder="개별 작품명 (예: 무제, No. 12)"
                        value={projectForm.artworkNameKo || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, artworkNameKo: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Piece Title (English - 선택)</label>
                      <input
                        type="text"
                        placeholder="Piece Title (e.g. Untitled)"
                        value={projectForm.artworkNameEn || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, artworkNameEn: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Material / Medium (Korean)</label>
                      <input
                        type="text"
                        placeholder="e.g. 캔버스에 아크릴, 오간자 실크"
                        value={projectForm.materialKo || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, materialKo: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Material / Medium (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Acrylic on canvas, organza silk"
                        value={projectForm.materialEn || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, materialEn: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Size / Dimension (예: 162.2 × 130.3 cm)</label>
                      <input
                        type="text"
                        placeholder="가변크기 혹은 가로세로 규격"
                        value={projectForm.size || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, size: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Acquisition Status (판매 가능여부) *</label>
                      <select
                        value={projectForm.salesStatus || 'available'}
                        onChange={(e) => setProjectForm({ ...projectForm, salesStatus: e.target.value as any })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none cursor-pointer font-mono"
                      >
                        <option value="available">available (소장 가능)</option>
                        <option value="sold">sold (소장 완료 - 개인 소장)</option>
                        <option value="inquire">inquire (문의 요망 - 갤러리 경유)</option>
                        <option value="private">private (비매품 / 단순 아카이브)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Exhibition Venue / Location (Korean)</label>
                      <input
                        type="text"
                        placeholder="전시 및 설치 공간 (예: 영도 복합공간)"
                        value={projectForm.locationKo || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, locationKo: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Exhibition Venue / Location (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Gallery L'Espace, Busan"
                        value={projectForm.locationEn || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, locationEn: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Edition (Korean)</label>
                      <input
                        type="text"
                        placeholder="에디션 정보 (예: 단작 / Ed. 1/5)"
                        value={projectForm.editionKo || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, editionKo: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Edition (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Unique Piece / Ed. 1/5"
                        value={projectForm.editionEn || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, editionEn: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Video Link (동영상 링크 - YouTube, Vimeo, MP4 등)</label>
                    <input
                      type="text"
                      placeholder="예: https://www.youtube.com/watch?v=... 혹은 동영상 URL (없으면 비워둠)"
                      value={projectForm.videoUrl || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
                      className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono"
                    />
                    <span className="text-[9px] text-stone-400 font-sans mt-0.5">
                      유튜브, 비메오 주소 또는 직접 .mp4 동영상 주소를 입력하면 개별 작품 상세 페이지에서 동영상이 바로 재생됩니다.
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold">Cover Image (대표 이미지) *</label>
                    <div className="flex items-start gap-4 p-3 bg-stone-50 border border-stone-200 rounded">
                      {projectForm.coverImage && (
                        <img
                          src={projectForm.coverImage}
                          alt="Cover Preview"
                          className="w-16 h-16 object-cover border border-stone-300 rounded shrink-0 bg-stone-100"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="flex-1 flex flex-col gap-2">
                        <input
                          type="text"
                          required
                          value={projectForm.coverImage || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                          placeholder="Image URL or upload a file below"
                          className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono w-full"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingCover}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (isSupabaseConfigured()) {
                                  setIsUploadingCover(true);
                                  try {
                                    const url = await uploadArtworkImage(file);
                                    setProjectForm(prev => ({ ...prev, coverImage: url }));
                                    showNotification(lang === 'ko' ? '커버 이미지가 성공적으로 업로드되었습니다.' : 'Cover image uploaded successfully.');
                                  } catch (err: any) {
                                    console.error(err);
                                    alert(err.message || 'Cover image upload failed');
                                  } finally {
                                    setIsUploadingCover(false);
                                  }
                                } else {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (typeof reader.result === 'string') {
                                      setProjectForm(prev => ({ ...prev, coverImage: reader.result as string }));
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }
                            }}
                            className="text-[11px] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-mono file:bg-stone-900 file:text-stone-50 hover:file:bg-stone-800 cursor-pointer"
                          />
                          {isUploadingCover && (
                            <span className="text-[10px] font-mono text-amber-600 animate-pulse">UPLOADING...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold">
                      Detail Images (세부 이미지 목록 - 한 작품당 여러 장 첨부 가능)
                    </label>
                    <div className="bg-white border border-stone-200 p-4 rounded flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-[11px] text-stone-500">
                          {lang === 'ko' ? '내 컴퓨터에서 이미지 파일들을 선택하여 일괄 추가합니다.' : 'Select local image files to add to the work.'}
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={isUploadingDetails}
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                if (isSupabaseConfigured()) {
                                  setIsUploadingDetails(true);
                                  try {
                                    const urls: string[] = [];
                                    for (const file of Array.from(files) as File[]) {
                                      const url = await uploadArtworkImage(file);
                                      urls.push(url);
                                    }
                                    const currentDetailImages = detailImagesText
                                      .split('\n')
                                      .map(img => img.trim())
                                      .filter(img => img.length > 0);
                                    const updatedList = [...currentDetailImages, ...urls];
                                    setDetailImagesText(updatedList.join('\n'));
                                    showNotification(lang === 'ko' ? `${urls.length}개의 세부 이미지가 업로드되었습니다.` : `${urls.length} detail images uploaded successfully.`);
                                  } catch (err: any) {
                                    console.error(err);
                                    alert(err.message || 'Detail images upload failed');
                                  } finally {
                                    setIsUploadingDetails(false);
                                  }
                                } else {
                                  const promises = Array.from(files).map((file: File) => {
                                    return new Promise<string>((resolve) => {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        resolve(reader.result as string);
                                      };
                                      reader.readAsDataURL(file);
                                    });
                                  });
                                  Promise.all(promises).then(base64Images => {
                                    const currentDetailImages = detailImagesText
                                      .split('\n')
                                      .map(img => img.trim())
                                      .filter(img => img.length > 0);
                                    const updatedList = [...currentDetailImages, ...base64Images];
                                    setDetailImagesText(updatedList.join('\n'));
                                  });
                                }
                              }
                            }}
                            className="text-[11px] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-mono file:bg-stone-900 file:text-stone-50 hover:file:bg-stone-800 cursor-pointer"
                          />
                          {isUploadingDetails && (
                            <span className="text-[10px] font-mono text-amber-600 animate-pulse">UPLOADING...</span>
                          )}
                        </div>
                      </div>

                      {detailImagesText.split('\n').map(x => x.trim()).filter(Boolean).length > 0 && (
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 pt-3 border-t border-stone-100">
                          {detailImagesText.split('\n').map((imgUrl, idx) => {
                            const trimmed = imgUrl.trim();
                            if (!trimmed) return null;
                            return (
                              <div key={idx} className="relative aspect-square border border-stone-200 rounded overflow-hidden group bg-stone-50 shadow-xs">
                                <img
                                  src={trimmed}
                                  alt={`detail-${idx}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = detailImagesText
                                      .split('\n')
                                      .map(img => img.trim())
                                      .filter(img => img.length > 0);
                                    list.splice(idx, 1);
                                    setDetailImagesText(list.join('\n'));
                                  }}
                                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 shadow-md hover:scale-110 transition-transform cursor-pointer"
                                  title="Remove image"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex flex-col gap-1 mt-1">
                        <span className="text-[9px] text-stone-400 font-mono uppercase">
                          {lang === 'ko' ? '상세 이미지 URL 텍스트 편집기 (필요 시 직접 수정)' : 'Detailed Image URLs Editor (direct edit if needed)'}
                        </span>
                        <textarea
                          rows={3}
                          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                          value={detailImagesText}
                          onChange={(e) => setDetailImagesText(e.target.value)}
                          className="bg-stone-50 border border-stone-200 p-2 text-[11px] rounded outline-none font-mono resize-none text-stone-600 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {projectForm.category !== 'Projects' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                          {projectForm.category === 'Exhibitions'
                            ? (lang === 'ko' ? '전시 텍스트 (Korean) *' : 'Exhibition Text (Korean) *')
                            : (lang === 'ko' ? '작가 노트 (Korean) *' : 'Artist Note (Korean) *')}
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={projectForm.descriptionKo || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, descriptionKo: e.target.value })}
                          className="bg-white border border-stone-200 p-2 text-xs rounded outline-none resize-none font-light leading-relaxed text-justify"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                          {projectForm.category === 'Exhibitions'
                            ? (lang === 'ko' ? '전시 텍스트 (English) *' : 'Exhibition Text (English) *')
                            : (lang === 'ko' ? '작가 노트 (English) *' : 'Artist Note (English) *')}
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={projectForm.descriptionEn || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })}
                          className="bg-white border border-stone-200 p-2 text-xs rounded outline-none resize-none font-light leading-relaxed text-justify"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center space-x-6 py-2">
                    <label className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projectForm.isPublished || false}
                        onChange={(e) => setProjectForm({ ...projectForm, isPublished: e.target.checked })}
                      />
                      <span>Publish Status (홈페이지 공개 여부)</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projectForm.isFeatured || false}
                        onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                      />
                      <span>Feature (메인 홈화면 슬라이드 추가)</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-stone-250">
                    <button
                      type="button"
                      onClick={() => setIsAddingProject(false)}
                      className="bg-stone-200 text-stone-700 font-mono text-xs py-2 px-4 rounded hover:bg-stone-300 transition-colors cursor-pointer"
                    >
                      {lang === 'ko' ? '취소' : 'CANCEL'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProject}
                      className={`bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs py-2 px-4 rounded flex items-center space-x-1.5 cursor-pointer font-medium ${isSavingProject ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSavingProject ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-stone-300 border-t-stone-50 rounded-full animate-spin"></div>
                          <span>{lang === 'ko' ? '저장 중...' : 'SAVING...'}</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>{lang === 'ko' ? '저장하기' : 'SAVE WORK'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4" id="project-admin-cards">
                  {portfolioData.projects.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-stone-50 border border-stone-200/80 rounded gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1 mr-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveProject(idx, 'up')}
                            disabled={idx === 0}
                            className={`p-1 border border-stone-200 bg-white hover:bg-stone-100 rounded cursor-pointer transition-colors ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                            title="Move Up (위로 이동)"
                          >
                            <ArrowUp className="w-3 h-3 text-stone-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveProject(idx, 'down')}
                            disabled={idx === portfolioData.projects.length - 1}
                            className={`p-1 border border-stone-200 bg-white hover:bg-stone-100 rounded cursor-pointer transition-colors ${idx === portfolioData.projects.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                            title="Move Down (아래로 이동)"
                          >
                            <ArrowDown className="w-3 h-3 text-stone-600" />
                          </button>
                        </div>

                        <img
                          src={proj.coverImage}
                          alt="preview cover"
                          className="w-12 h-12 object-cover bg-stone-200 rounded border border-stone-300 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center space-x-2 text-[9px] font-mono text-stone-400">
                            <span className="uppercase text-red-700">[{proj.category}]</span>
                            <span>·</span>
                            <span>{proj.year}</span>
                            <span>·</span>
                            <span>{proj.salesStatus.toUpperCase()}</span>
                            {!proj.isPublished && (
                              <span className="text-red-600 flex items-center gap-1">
                                <EyeOff className="w-2.5 h-2.5" /> Hidden
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif font-medium text-stone-900 text-sm">
                            {proj.titleKo} ({proj.titleEn})
                            {proj.artworkNameKo && <span className="text-stone-500 text-xs ml-2 font-normal">[{proj.artworkNameKo}]</span>}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleStartEditProject(proj)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 border border-stone-200 bg-white hover:bg-stone-50 rounded cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 text-red-700 hover:text-red-900 border border-red-100 bg-red-50 hover:bg-red-100/50 rounded cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ARTIST PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6" id="profile-tab">
              <div className="pb-4 border-b border-stone-200/60">
                <h2 className="text-lg font-light tracking-wide text-stone-900">{lang === 'ko' ? '작가 프로필 기본 설정' : 'Artist Profile Setup'}</h2>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Name (Korean) *</label>
                    <input
                      type="text"
                      name="nameKo"
                      required
                      defaultValue={portfolioData.artistInfo.nameKo}
                      className="bg-stone-50 border border-stone-200 p-2 text-xs rounded outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Name (English) *</label>
                    <input
                      type="text"
                      name="nameEn"
                      required
                      defaultValue={portfolioData.artistInfo.nameEn}
                      className="bg-stone-50 border border-stone-200 p-2 text-xs rounded outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Headline Introduction (Korean) *</label>
                    <input
                      type="text"
                      name="headlineKo"
                      required
                      defaultValue={portfolioData.artistInfo.headlineKo}
                      className="bg-stone-50 border border-stone-200 p-2 text-xs rounded outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Headline Introduction (English) *</label>
                    <input
                      type="text"
                      name="headlineEn"
                      required
                      defaultValue={portfolioData.artistInfo.headlineEn}
                      className="bg-stone-50 border border-stone-200 p-2 text-xs rounded outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Biography / Introduction (Korean) *</label>
                  <textarea
                    rows={5}
                    name="bioKo"
                    required
                    defaultValue={portfolioData.artistInfo.bioKo}
                    className="bg-stone-50 border border-stone-200 p-2 text-xs rounded outline-none resize-none font-light leading-relaxed"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Biography / Introduction (English) *</label>
                  <textarea
                    rows={5}
                    name="bioEn"
                    required
                    defaultValue={portfolioData.artistInfo.bioEn}
                    className="bg-stone-50 border border-stone-200 p-2 text-xs rounded outline-none resize-none font-light leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Official Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      defaultValue={portfolioData.artistInfo.email}
                      className="bg-stone-50 border border-stone-200 p-2 text-xs rounded outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Instagram handle *</label>
                    <input
                      type="text"
                      name="instagram"
                      required
                      defaultValue={portfolioData.artistInfo.instagram}
                      className="bg-stone-50 border border-stone-200 p-2 text-xs rounded outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Represented Agency (Korean - 선택)</label>
                    <input
                      type="text"
                      name="agencyKo"
                      defaultValue={portfolioData.artistInfo.agencyKo || ''}
                      className="bg-stone-50 border border-stone-200 p-2 text-xs rounded outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Represented Agency (English - 선택)</label>
                    <input
                      type="text"
                      name="agencyEn"
                      defaultValue={portfolioData.artistInfo.agencyEn || ''}
                      className="bg-stone-50 border border-stone-200 p-2 text-xs rounded outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold">Profile Portrait (프로필 사진) *</label>
                  <div className="flex items-start gap-4 p-3 bg-stone-50 border border-stone-200 rounded">
                    {profileImage && (
                      <img
                        src={profileImage}
                        alt="Profile Preview"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-stone-300 rounded shrink-0 bg-stone-100"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        type="text"
                        name="profileImage"
                        required
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        placeholder="Image URL or upload a file"
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono w-full"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingProfile}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (isSupabaseConfigured()) {
                                setIsUploadingProfile(true);
                                try {
                                  const url = await uploadArtworkImage(file);
                                  setProfileImage(url);
                                  showNotification(lang === 'ko' ? '프로필 이미지가 업로드되었습니다.' : 'Profile image uploaded successfully.');
                                } catch (err: any) {
                                  console.error(err);
                                  alert(err.message || 'Profile image upload failed');
                                } finally {
                                  setIsUploadingProfile(false);
                                }
                              } else {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setProfileImage(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                          className="text-[11px] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-mono file:bg-stone-900 file:text-stone-50 hover:file:bg-stone-800 cursor-pointer"
                        />
                        {isUploadingProfile && (
                          <span className="text-[10px] font-mono text-amber-600 animate-pulse">UPLOADING...</span>
                        )}
                        {profileImage && (
                          <button
                            type="button"
                            onClick={() => setProfileImage('')}
                            className="text-stone-400 hover:text-red-600 text-xs font-mono py-1 px-2 border border-stone-200 hover:border-red-200 rounded transition-colors"
                          >
                            REMOVE
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold">
                    {lang === 'ko' ? 'Home Start Page Image (홈 시작화면 사진)' : 'Home Start Page Image'} (선택)
                  </label>
                  <div className="flex items-start gap-4 p-3 bg-stone-50 border border-stone-200 rounded">
                    {homeStartImage && (
                      <img
                        src={homeStartImage}
                        alt="Home Start Preview"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-stone-300 rounded shrink-0 bg-stone-100"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        type="text"
                        name="homeStartImage"
                        value={homeStartImage}
                        onChange={(e) => setHomeStartImage(e.target.value)}
                        placeholder={lang === 'ko' ? '이미지 URL을 붙여넣거나 파일을 업로드하세요 (미지정 시 웍스 첫 작품 이미지 사용)' : 'Image URL or upload a file (Uses first work cover image if empty)'}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono w-full"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingHomeStart}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (isSupabaseConfigured()) {
                                setIsUploadingHomeStart(true);
                                try {
                                  const url = await uploadArtworkImage(file);
                                  setHomeStartImage(url);
                                  showNotification(lang === 'ko' ? '홈 이미지가 업로드되었습니다.' : 'Home image uploaded successfully.');
                                } catch (err: any) {
                                  console.error(err);
                                  alert(err.message || 'Home image upload failed');
                                } finally {
                                  setIsUploadingHomeStart(false);
                                }
                              } else {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setHomeStartImage(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                          className="text-[11px] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-mono file:bg-stone-900 file:text-stone-50 hover:file:bg-stone-800 cursor-pointer"
                        />
                        {isUploadingHomeStart && (
                          <span className="text-[10px] font-mono text-amber-600 animate-pulse">UPLOADING...</span>
                        )}
                        {homeStartImage && (
                          <button
                            type="button"
                            onClick={() => setHomeStartImage('')}
                            className="text-stone-400 hover:text-red-600 text-xs font-mono py-1 px-2 border border-stone-200 hover:border-red-200 rounded transition-colors"
                          >
                            REMOVE
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-400 font-light leading-relaxed">
                        {lang === 'ko' 
                          ? '* 홈 화면(시작페이지) 배경으로 설정할 전면 이미지를 지정합니다. 입력하지 않으면 Works 첫 번째 프로젝트의 대표 이미지가 자동으로 사용됩니다.'
                          : '* Set the full-screen background image for the start page. If empty, the cover image of the first project in Works is used automatically.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual Styling Settings */}
                <div className="pt-6 mt-6 border-t border-stone-200/80">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono mb-4">
                    {lang === 'ko' ? '비주얼 스타일 설정 (글자체 & 색상)' : 'VISUAL STYLING SETTINGS (FONTS & COLORS)'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-stone-50 border border-stone-200 rounded">
                    {/* Brand Name Style */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-stone-700">
                        {lang === 'ko' ? '작가명 스타일 (Header/Footer)' : 'Artist Name Style'}
                      </h4>
                      
                      <div className="flex flex-col">
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Font Family (글자체)</label>
                        <select
                          name="nameFontFamily"
                          value={nameFontFamily}
                          onChange={(e) => setNameFontFamily(e.target.value)}
                          className="bg-white border border-stone-200 p-2 text-xs rounded outline-none cursor-pointer font-sans"
                        >
                          <option value="Cormorant Garamond">Cormorant Garamond (Elegant Serif)</option>
                          <option value="Cinzel">Cinzel (Classic Editorial Serif)</option>
                          <option value="Bodoni Moda">Bodoni Moda (High-Contrast Editorial)</option>
                          <option value="EB Garamond">EB Garamond (Classic Masterpiece Serif)</option>
                          <option value="Playfair Display">Playfair Display (Bold Classic Serif)</option>
                          <option value="Noto Serif KR">노토 세리프 KR (Korean Classy Serif)</option>
                          <option value="Nanum Myeongjo">나눔 명조 (Soft Traditional Serif)</option>
                          <option value="Inter">Inter (Swiss Modernist Sans)</option>
                          <option value="Space Grotesk">Space Grotesk (Neo-Grotesque Tech)</option>
                          <option value="Montserrat">Montserrat (Geometric Display)</option>
                          <option value="Syne">Syne (Artistic Avant-Garde)</option>
                          <option value="Oswald">Oswald (Bold Compact Sans)</option>
                          <option value="DM Sans">DM Sans (Clean Modern Sans)</option>
                          <option value="Noto Sans KR">노토 산스 KR (Clean Korean Sans)</option>
                          <option value="Nanum Gothic">나눔 고딕 (Clear Korean Gothic)</option>
                          <option value="JetBrains Mono">JetBrains Mono (Technical Mono)</option>
                        </select>
                      </div>

                      {/* Font Size & Weight fields requested by the user */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Font Size (글자 크기)</label>
                          <select
                            name="nameFontSize"
                            value={nameFontSize}
                            onChange={(e) => setNameFontSize(e.target.value)}
                            className="bg-white border border-stone-200 p-2 text-xs rounded outline-none cursor-pointer font-sans"
                          >
                            <option value="12px">12px (Very Small)</option>
                            <option value="14px">14px (Small)</option>
                            <option value="16px">16px (Normal)</option>
                            <option value="18px">18px (Medium - Default)</option>
                            <option value="20px">20px (Large)</option>
                            <option value="22px">22px (Extra Large)</option>
                            <option value="24px">24px (Display Small)</option>
                            <option value="28px">28px (Display Medium)</option>
                            <option value="32px">32px (Display Large)</option>
                            <option value="36px">36px (Double XL)</option>
                          </select>
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Font Weight (볼드 / 두께)</label>
                          <select
                            name="nameFontWeight"
                            value={nameFontWeight}
                            onChange={(e) => setNameFontWeight(e.target.value)}
                            className="bg-white border border-stone-200 p-2 text-xs rounded outline-none cursor-pointer font-sans"
                          >
                            <option value="300">Light (300) - 기본</option>
                            <option value="400">Regular (400)</option>
                            <option value="500">Medium (500)</option>
                            <option value="600">Semi Bold (600)</option>
                            <option value="700">Bold (700) - 두껍게</option>
                            <option value="800">Extra Bold (800) - 매우두껍게</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Text Color (색상)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="nameColorPicker"
                            value={nameColor}
                            onChange={(e) => setNameColor(e.target.value)}
                            className="w-8 h-8 rounded border border-stone-200 cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            id="nameColorInput"
                            name="nameColor"
                            placeholder="#1c1917"
                            value={nameColor}
                            onChange={(e) => setNameColor(e.target.value)}
                            className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Works & Info Menu Style */}
                    <div className="space-y-4 border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6">
                      <h4 className="text-xs font-bold text-stone-700 font-sans">
                        {lang === 'ko' ? '메뉴 탭 스타일 (WORKS, INFO)' : 'Menu Tabs Style'}
                      </h4>
                      
                      <div className="flex flex-col">
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Font Family (글자체)</label>
                        <select
                          name="menuFontFamily"
                          value={menuFontFamily}
                          onChange={(e) => setMenuFontFamily(e.target.value)}
                          className="bg-white border border-stone-200 p-2 text-xs rounded outline-none cursor-pointer font-sans"
                        >
                          <option value="JetBrains Mono">JetBrains Mono (Technical Mono)</option>
                          <option value="Inter">Inter (Swiss Modernist Sans)</option>
                          <option value="Cormorant Garamond">Cormorant Garamond (Elegant Serif)</option>
                          <option value="Cinzel">Cinzel (Classic Editorial Serif)</option>
                          <option value="Playfair Display">Playfair Display (Bold Classic Serif)</option>
                          <option value="Space Grotesk">Space Grotesk (Neo-Grotesque Tech)</option>
                          <option value="Montserrat">Montserrat (Geometric Display)</option>
                          <option value="Noto Sans KR">노토 산스 KR (Clean Korean Sans)</option>
                          <option value="Noto Serif KR">노토 세리프 KR (Korean Classy Serif)</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Inactive Color (비활성 색상)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="menuColorPicker"
                            value={menuColor}
                            onChange={(e) => setMenuColor(e.target.value)}
                            className="w-8 h-8 rounded border border-stone-200 cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            id="menuColorInput"
                            name="menuColor"
                            placeholder="#a8a29e"
                            value={menuColor}
                            onChange={(e) => setMenuColor(e.target.value)}
                            className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono flex-1"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Active Color (활성 색상)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="menuActiveColorPicker"
                            value={menuActiveColor}
                            onChange={(e) => setMenuActiveColor(e.target.value)}
                            className="w-8 h-8 rounded border border-stone-200 cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            id="menuActiveColorInput"
                            name="menuActiveColor"
                            placeholder="#1c1917"
                            value={menuActiveColor}
                            onChange={(e) => setMenuActiveColor(e.target.value)}
                            className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Dynamic Preview Card */}
                  <div className="mt-6 p-5 bg-white border border-stone-200 rounded shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="text-[10px] font-bold font-mono text-stone-400 uppercase tracking-wider">
                        {lang === 'ko' ? '실시간 스타일 미리보기 (Live Style Preview)' : 'LIVE STYLE PREVIEW'}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest font-semibold animate-pulse">
                        {lang === 'ko' ? '실시간 반영됨' : 'Real-time Sync'}
                      </span>
                    </div>

                    <div className="space-y-6 bg-stone-50/50 p-4 rounded border border-stone-100">
                      {/* Brand Name Preview */}
                      <div className="flex flex-col gap-1.5 pb-4 border-b border-stone-100">
                        <span className="text-[9px] font-mono text-stone-400 uppercase font-semibold">
                          {lang === 'ko' ? '작가명 미리보기' : 'Artist Name Preview'}
                        </span>
                        <div className="py-2 px-1">
                          <span 
                            style={{ 
                              fontFamily: `"${nameFontFamily}", sans-serif`,
                              color: nameColor,
                              fontSize: nameFontSize,
                              fontWeight: nameFontWeight
                            }}
                            className="tracking-[0.25em] transition-all uppercase duration-300 block"
                          >
                            {portfolioData.artistInfo.nameKo} / {portfolioData.artistInfo.nameEn}
                          </span>
                        </div>
                      </div>

                      {/* Menu Style Preview */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-mono text-stone-400 uppercase font-semibold">
                          {lang === 'ko' ? '메뉴 미리보기 (활성 / 비활성)' : 'Menu Tabs Preview (Active / Inactive)'}
                        </span>
                        
                        <div className="flex items-center gap-6 py-2 px-1">
                          <span 
                            style={{ 
                              fontFamily: `"${menuFontFamily}", monospace`,
                              color: menuActiveColor 
                            }}
                            className="text-xs tracking-[0.2em] font-semibold transition-all duration-300 border-b border-stone-900 pb-0.5"
                          >
                            WORKS (ACTIVE)
                          </span>
                          <span 
                            style={{ 
                              fontFamily: `"${menuFontFamily}", monospace`,
                              color: menuColor 
                            }}
                            className="text-xs tracking-[0.2em] transition-all duration-300"
                          >
                            INFO (INACTIVE)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs py-2.5 px-6 rounded flex items-center space-x-1.5 cursor-pointer font-medium"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{lang === 'ko' ? '설정 저장' : 'SAVE CHANGES'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: TEXTS & CRITICISM */}
          {activeTab === 'texts' && (
            <div className="space-y-6" id="texts-tab">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200/60">
                <h2 className="text-lg font-light tracking-wide text-stone-900">{lang === 'ko' ? '작가 서술 및 외부 미술평론글' : 'Texts & Criticism'}</h2>
                {!isAddingText && (
                  <button
                    onClick={() => {
                      setEditingText(null);
                      setTextForm({
                        category: 'project',
                        titleKo: '',
                        titleEn: '',
                        authorKo: '',
                        authorEn: '',
                        contentKo: '',
                        contentEn: '',
                        date: '2026.07'
                      });
                      setIsAddingText(true);
                    }}
                    className="flex items-center space-x-1 bg-stone-900 hover:bg-stone-800 text-stone-50 py-2 px-3 text-xs font-mono tracking-widest rounded uppercase cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'ko' ? '새 글 작성' : 'ADD NEW TEXT'}</span>
                  </button>
                )}
              </div>

              {isAddingText ? (
                <form onSubmit={handleSaveText} className="space-y-4 bg-stone-50 p-5 border border-stone-200 rounded">
                  <h3 className="text-base font-light tracking-wide text-stone-900 pb-2 border-b border-stone-200">
                    {editingText ? (lang === 'ko' ? '글 내용 수정' : 'Edit Text Entry') : (lang === 'ko' ? '새 텍스트 등록' : 'Register New Text')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Category (분류) *</label>
                      <select
                        value={textForm.category || 'project'}
                        onChange={(e) => setTextForm({ ...textForm, category: e.target.value as any })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none cursor-pointer"
                      >
                        <option value="project">Project Essay (기획의 글)</option>
                        <option value="review">Critical Review (미술 평론)</option>
                        <option value="press">Press Report (언론 보도)</option>
                        <option value="interview">Interview (인터뷰)</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Date (기재 시기 - 선택)</label>
                      <input
                        type="text"
                        placeholder="e.g. 2026.07"
                        value={textForm.date || ''}
                        onChange={(e) => setTextForm({ ...textForm, date: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Title (Korean) *</label>
                      <input
                        type="text"
                        required
                        value={textForm.titleKo || ''}
                        onChange={(e) => setTextForm({ ...textForm, titleKo: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={textForm.titleEn || ''}
                        onChange={(e) => setTextForm({ ...textForm, titleEn: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Author Name (Korean - 평론가/프레스 필자)</label>
                      <input
                        type="text"
                        value={textForm.authorKo || ''}
                        onChange={(e) => setTextForm({ ...textForm, authorKo: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Author Name (English)</label>
                      <input
                        type="text"
                        value={textForm.authorEn || ''}
                        onChange={(e) => setTextForm({ ...textForm, authorEn: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Content Text (Korean) *</label>
                    <textarea
                      rows={8}
                      required
                      value={textForm.contentKo || ''}
                      onChange={(e) => setTextForm({ ...textForm, contentKo: e.target.value })}
                      className="bg-white border border-stone-200 p-2 text-xs rounded outline-none resize-none font-light leading-relaxed text-justify"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Content Text (English) *</label>
                    <textarea
                      rows={8}
                      required
                      value={textForm.contentEn || ''}
                      onChange={(e) => setTextForm({ ...textForm, contentEn: e.target.value })}
                      className="bg-white border border-stone-200 p-2 text-xs rounded outline-none resize-none font-light leading-relaxed text-justify"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setIsAddingText(false)}
                      className="bg-stone-200 text-stone-700 font-mono text-xs py-2 px-4 rounded hover:bg-stone-300 transition-colors cursor-pointer"
                    >
                      {lang === 'ko' ? '취소' : 'CANCEL'}
                    </button>
                    <button
                      type="submit"
                      className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs py-2 px-4 rounded flex items-center space-x-1.5 cursor-pointer font-medium"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{lang === 'ko' ? '저장하기' : 'SAVE TEXT'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {portfolioData.texts.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded"
                    >
                      <div>
                        <div className="flex items-center space-x-2 text-[9px] font-mono text-stone-400">
                          <span className="uppercase text-red-700">[{t.category}]</span>
                          <span>·</span>
                          <span>{t.date || '—'}</span>
                          {t.authorKo && (
                            <>
                              <span>·</span>
                              <span>By {t.authorKo}</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-serif font-medium text-stone-900 text-sm mt-0.5">
                          {t.titleKo} ({t.titleEn})
                        </h3>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingText(t);
                            setTextForm(t);
                            setIsAddingText(true);
                          }}
                          className="p-1.5 text-stone-600 hover:text-stone-900 border border-stone-200 bg-white hover:bg-stone-50 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteText(t.id)}
                          className="p-1.5 text-red-700 hover:text-red-900 border border-red-100 bg-red-50 hover:bg-red-100/50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CURRICULUM VITAE */}
          {activeTab === 'cv' && (
            <div className="space-y-6" id="cv-tab">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200/60">
                <h2 className="text-lg font-light tracking-wide text-stone-900">{lang === 'ko' ? 'CV 약력 연혁 연도별 관리' : 'Curriculum Vitae'}</h2>
                {!isAddingCvItem && (
                  <button
                    onClick={() => {
                      setEditingCvItem(null);
                      setCvForm({
                        section: 'education',
                        year: '2026',
                        contentKo: '',
                        contentEn: ''
                      });
                      setIsAddingCvItem(true);
                    }}
                    className="flex items-center space-x-1 bg-stone-900 hover:bg-stone-800 text-stone-50 py-2 px-3 text-xs font-mono tracking-widest rounded uppercase cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'ko' ? '약력 추가' : 'NEW CV LINE'}</span>
                  </button>
                )}
              </div>

              {isAddingCvItem ? (
                <form onSubmit={handleSaveCv} className="space-y-4 bg-stone-50 p-5 border border-stone-200 rounded">
                  <h3 className="text-base font-light tracking-wide text-stone-900 pb-2 border-b border-stone-200">
                    {editingCvItem ? (lang === 'ko' ? 'CV 정보 수정' : 'Edit CV Line') : (lang === 'ko' ? '새 CV 정보 등록' : 'Register New CV Line')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Section (카테고리 분류) *</label>
                      <select
                        value={cvForm.section || 'education'}
                        onChange={(e) => setCvForm({ ...cvForm, section: e.target.value as any })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none cursor-pointer"
                      >
                        <option value="education">Education (학력)</option>
                        <option value="solo">Solo Exhibitions (개인전)</option>
                        <option value="group">Group Exhibitions (단체전)</option>
                        <option value="award">Awards & Grants (수상 및 선정)</option>
                        <option value="residency">Residencies (레지던시)</option>
                        <option value="collection">Public Collections (소장처)</option>
                        <option value="press">Press (언론 소개)</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Year (연도) *</label>
                      <input
                        type="text"
                        required
                        value={cvForm.year || '2026'}
                        onChange={(e) => setCvForm({ ...cvForm, year: e.target.value })}
                        className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Content Line (Korean) *</label>
                    <input
                      type="text"
                      required
                      value={cvForm.contentKo || ''}
                      onChange={(e) => setCvForm({ ...cvForm, contentKo: e.target.value })}
                      className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-light"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">Content Line (English) *</label>
                    <input
                      type="text"
                      required
                      value={cvForm.contentEn || ''}
                      onChange={(e) => setCvForm({ ...cvForm, contentEn: e.target.value })}
                      className="bg-white border border-stone-200 p-2 text-xs rounded outline-none font-light"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setIsAddingCvItem(false)}
                      className="bg-stone-200 text-stone-700 font-mono text-xs py-2 px-4 rounded hover:bg-stone-300 transition-colors cursor-pointer"
                    >
                      {lang === 'ko' ? '취소' : 'CANCEL'}
                    </button>
                    <button
                      type="submit"
                      className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs py-2 px-4 rounded flex items-center space-x-1.5 cursor-pointer font-medium"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{lang === 'ko' ? '저장하기' : 'SAVE LINE'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {['education', 'solo', 'group', 'award', 'residency', 'collection'].map((sect) => {
                    const filtered = portfolioData.cvItems.filter(item => item.section === sect);
                    if (filtered.length === 0) return null;

                    return (
                      <div key={sect} className="border border-stone-150 p-4 rounded bg-stone-50/50">
                        <span className="text-[9px] font-mono text-stone-400 uppercase font-bold tracking-widest block mb-2 border-b border-stone-100 pb-1">
                          {sect.toUpperCase()}
                        </span>
                        <div className="space-y-2">
                          {filtered.map(item => (
                            <div key={item.id} className="flex items-center justify-between text-xs py-1 hover:bg-stone-100/30 px-1 rounded">
                              <div className="flex gap-4">
                                <span className="font-mono text-stone-400 font-light w-8">{item.year}</span>
                                <span className="text-stone-700 font-light">{item.contentKo}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingCvItem(item);
                                    setCvForm(item);
                                    setIsAddingCvItem(true);
                                  }}
                                  className="text-stone-400 hover:text-stone-900"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCvItem(item.id)}
                                  className="text-stone-400 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: INQUIRIES & LOGS */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6" id="inquiries-tab">
              <div className="pb-4 border-b border-stone-200/60">
                <h2 className="text-lg font-light tracking-wide text-stone-900">{lang === 'ko' ? '작품 소장 및 대여 연락로그' : 'Inquiries Logs'}</h2>
              </div>

              {portfolioData.inquiries.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs font-mono">
                  {lang === 'ko' ? '현재 수신된 공식 문의가 없습니다.' : 'NO MESSAGES RECEIVED YET.'}
                </div>
              ) : (
                <div className="space-y-4" id="admin-inquiries-stack">
                  {portfolioData.inquiries.slice().reverse().map((inq) => (
                    <div
                      key={inq.id}
                      className={`border p-5 rounded flex flex-col gap-3 transition-colors ${
                        inq.isRead ? 'border-stone-200 bg-stone-50/50' : 'border-stone-950 bg-stone-100/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-stone-400">{inq.date}</span>
                            {!inq.isRead && (
                              <span className="bg-stone-900 text-stone-50 text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">
                                New
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif font-medium text-stone-900 text-sm mt-1">
                            {inq.senderName} ({inq.senderEmail})
                          </h4>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => handleToggleInquiryRead(inq.id)}
                            className="p-1.5 text-stone-600 hover:text-stone-950 border border-stone-200 bg-white hover:bg-stone-50 rounded cursor-pointer text-[10px] font-mono uppercase"
                          >
                            {inq.isRead ? (lang === 'ko' ? '안읽음 처리' : 'Mark Unread') : (lang === 'ko' ? '읽음 완료' : 'Mark Read')}
                          </button>
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 text-red-600 hover:text-red-900 border border-red-100 bg-red-50 hover:bg-red-100 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {inq.artworkTitle && (
                        <div className="bg-stone-200/50 p-2 border border-stone-300/40 text-[11px] font-mono text-stone-700">
                          <span className="text-[8px] text-stone-400 block tracking-widest uppercase">Target Artwork:</span>
                          {inq.artworkTitle}
                        </div>
                      )}

                      <p className="text-stone-700 text-xs font-light whitespace-pre-line leading-relaxed border-t border-stone-200/40 pt-3">
                        {inq.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-6" id="categories-tab">
              <div className="pb-4 border-b border-stone-200/60 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-light tracking-wide text-stone-900">
                    {lang === 'ko' ? '분류(카테고리) 관리' : 'Category Management'}
                  </h2>
                  <p className="text-xs text-stone-400 mt-1 font-light">
                    {lang === 'ko' ? 'Works 메뉴에 나타날 탭 분류를 추가하고 활성/비활성화합니다.' : 'Add and enable/disable category tabs shown in the Works menu.'}
                  </p>
                </div>
              </div>

              {/* Add New Category Form */}
              <div className="p-5 bg-stone-50 border border-stone-200 rounded space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
                  {lang === 'ko' ? '새 분류(카테고리) 추가' : 'Create New Category'}
                </h3>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    id="new-category-input"
                    placeholder={lang === 'ko' ? '분류 영문명 (예: Drawings)' : 'Category Name (e.g. Drawings)'}
                    className="flex-1 bg-white border border-stone-200 p-2 text-xs rounded outline-none font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.currentTarget;
                        handleAddCategory(target.value);
                        target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('new-category-input') as HTMLInputElement;
                      if (input) {
                        handleAddCategory(input.value);
                        input.value = '';
                      }
                    }}
                    className="bg-stone-900 hover:bg-stone-800 text-stone-50 px-4 py-2 text-xs font-mono tracking-wider rounded uppercase cursor-pointer transition-colors"
                  >
                    {lang === 'ko' ? '추가' : 'ADD'}
                  </button>
                </div>
              </div>

              {/* Category List */}
              <div className="border border-stone-200 rounded divide-y divide-stone-100 bg-white">
                <div className="grid grid-cols-12 gap-4 p-3 bg-stone-50/80 text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <div className="col-span-6">{lang === 'ko' ? '분류 이름' : 'Category Name'}</div>
                  <div className="col-span-3 text-center">{lang === 'ko' ? '노출 상태' : 'Status'}</div>
                  <div className="col-span-3 text-right">{lang === 'ko' ? '작업' : 'Actions'}</div>
                </div>

                {currentCategories.map((cat) => {
                  const isStandard = ['Projects', 'Exhibitions', 'Books'].includes(cat.name);
                  const projectCount = portfolioData.projects.filter(p => p.category === cat.name).length;

                  return (
                    <div key={cat.name} className="grid grid-cols-12 gap-4 p-4 items-center text-xs">
                      <div className="col-span-6 font-mono font-medium text-stone-900">
                        {cat.name}
                        <span className="text-[10px] text-stone-400 font-light ml-2 font-sans">
                          ({lang === 'ko' ? `등록된 작품 ${projectCount}개` : `${projectCount} projects`})
                        </span>
                      </div>
                      <div className="col-span-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleCategory(cat.name)}
                          className={`px-3 py-1 text-[10px] font-mono tracking-wider rounded uppercase cursor-pointer transition-all border ${
                            cat.enabled
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200 hover:text-stone-600'
                          }`}
                        >
                          {cat.enabled ? (lang === 'ko' ? '노출 중' : 'Active') : (lang === 'ko' ? '숨김' : 'Disabled')}
                        </button>
                      </div>
                      <div className="col-span-3 text-right">
                        {!isStandard ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.name)}
                            className="p-1.5 text-red-600 hover:text-red-900 border border-red-100 bg-red-50 hover:bg-red-100 rounded cursor-pointer transition-colors inline-flex items-center"
                            title={lang === 'ko' ? '카테고리 삭제' : 'Delete Category'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-stone-300 font-mono uppercase tracking-wider">
                            {lang === 'ko' ? '기본 분류' : 'System'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: BACKUP & DATA OVERWRITE */}
          {activeTab === 'system' && (
            <div className="space-y-6" id="system-tab">
              <div className="pb-4 border-b border-stone-200/60">
                <h2 className="text-lg font-light tracking-wide text-stone-900">{lang === 'ko' ? '포트폴리오 백업 및 이관 데이터 보관' : 'Backup & Sync Panel'}</h2>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">{lang === 'ko' ? '현재 데이터 파일로 백업받기' : 'Export Current Portfolio State'}</h3>
                  <p className="text-xs text-stone-500 font-light mb-4">
                    {lang === 'ko'
                      ? '현재까지 추가/수정한 작가 정보, 연작 목록, 비평문 및 문의 로그 전체를 하나의 로컬 JSON 파일로 다운로드합니다.'
                      : 'Download your entire system content state (projects, biography details, curriculum vitae items, inquiry emails) as a solid local JSON payload.'}
                  </p>
                  <button
                    onClick={handleExportState}
                    className="flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs py-2 px-4 rounded uppercase transition-colors cursor-pointer"
                  >
                    <span>{lang === 'ko' ? '백업 JSON 파일 다운로드' : 'EXPORT BACKUP JSON'}</span>
                  </button>
                </div>

                <div className="border-t border-stone-200 pt-6">
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">{lang === 'ko' ? '기존 백업 파일 가져오기 (오버라이트)' : 'Restore / Import Backup State'}</h3>
                  <p className="text-xs text-red-600 font-medium mb-4">
                    {lang === 'ko'
                      ? '주의: 백업 JSON 파일을 가져올 경우, 현재 작성 중이던 모든 데이터는 덮어씌워지며 완전히 영구 유실됩니다.'
                      : 'WARNING: Restoring from a backup will overwrite and permanently erase any active catalog changes made on this browser.'}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <label className="bg-stone-200 hover:bg-stone-300 text-stone-800 font-mono text-xs py-2 px-4 rounded uppercase cursor-pointer transition-colors">
                      <span>{lang === 'ko' ? '백업 파일 선택' : 'CHOOSE JSON FILE'}</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportState}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
