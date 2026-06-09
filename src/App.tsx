import { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { ProductForm } from './components/ProductForm';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingOverlay } from './components/LoadingOverlay';
import { generateProductDescription } from './utils/generator';
import type { ProductInput, GenerationResult, AppSettings, ProviderOption } from './types';
import { 
  ShoppingBag, FileText, Play, Search, Trash2, Copy, Download, 
  Plus, Sparkles, ArrowRight, TrendingUp, Zap, FileSpreadsheet, Check,
  Filter, ChevronLeft, ChevronRight, Lightbulb, User, Key, Sliders,
  Eye, EyeOff, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ─── Seed Data for Mockup History ───
// ─── Seed Data for Mockup History ───
const MOCK_SEEDED_HISTORY: GenerationResult[] = [
  {
    id: 'mock-1',
    timestamp: new Date('2023-10-24T11:45:00').getTime(),
    input: {
      name: 'Swift-Step Runner X1',
      category: 'Chaussures',
      targetAudience: 'Athlètes & Coureurs',
      tone: 'dynamic'
    },
    title: 'Swift-Step Runner X1 - Description E-commerce',
    shortDescription: 'Libérez votre potentiel avec la Swift-Step Runner X1, conçue pour un confort et une vitesse maximaux.',
    longDescription: 'Conçue avec un amorti réactif et une tige en mesh respirant, la Swift-Step Runner X1 offre un soutien léger pour les longues courses. Elle est dotée d\'une semelle extérieure en caoutchouc à haute adhérence pour une traction exceptionnelle.',
    benefits: ['Amorti réactif', 'Tige en mesh respirant', 'Semelle extérieure adhérente'],
    cta: 'Acheter maintenant',
    seoMeta: 'swift step runner x1, chaussures de course, chaussures de sport'
  },
  {
    id: 'mock-2',
    timestamp: new Date('2023-10-22T09:12:00').getTime(),
    input: {
      name: 'ZenSound Elite Headphones',
      category: 'Électronique',
      targetAudience: 'Amateurs de Musique',
      tone: 'luxury'
    },
    title: 'ZenSound Elite - Expérience Audio Premium',
    shortDescription: 'Plongez dans un son pur avec le casque à réduction active de bruit ZenSound Elite.',
    longDescription: 'Doté d\'une réduction active de bruit hybride, de haut-parleurs de 40 mm réglés sur mesure et de jusqu\'à 40 heures d\'autonomie, le casque ZenSound Elite offre un son de qualité studio dans un confort total.',
    benefits: ['Réduction active du bruit', 'Autonomie de 40 heures', 'Qualité audio studio'],
    cta: 'Commandez aujourd\'hui',
    seoMeta: 'zensound elite, casque réduction bruit, audio premium'
  },
  {
    id: 'mock-3',
    timestamp: new Date('2023-10-21T16:30:00').getTime(),
    input: {
      name: 'Montre Minimaliste Slate',
      category: 'Accessoires',
      targetAudience: 'Professionnels Modernes',
      tone: 'professional'
    },
    title: 'Montre Minimaliste Slate - Élégance Intemporelle',
    shortDescription: 'Un garde-temps élégant et minimaliste conçu pour le style de vie moderne.',
    longDescription: 'Conçue avec un boîtier en acier noir mat et un bracelet en cuir véritable, la montre Minimalist Slate est étanche jusqu\'à 50 mètres et dispose d\'un mouvement à quartz de haute précision.',
    benefits: ['Design minimaliste', 'Bracelet en cuir véritable', 'Mouvement à quartz de précision'],
    cta: 'Découvrir la collection',
    seoMeta: 'montre slate, montre minimaliste, accessoires de mode'
  },
  {
    id: 'mock-4',
    timestamp: new Date('2023-10-19T14:15:00').getTime(),
    input: {
      name: 'Lunettes Aviator Pro Polarisées',
      category: 'Mode',
      targetAudience: 'Amateurs de Plein Air',
      tone: 'commercial'
    },
    title: 'Lunettes Aviator Pro - Protection Polarisée',
    shortDescription: 'Protégez vos yeux avec style grâce aux lunettes de soleil polarisées Aviator Pro.',
    longDescription: 'Fabriquées avec des montures en alliage durable et des verres polarisés résistants aux rayures, ces lunettes offrent une protection UV à 100 % et réduisent l\'éblouissement pour une vision cristalline.',
    benefits: ['Protection UV à 100 %', 'Verres polarisés anti-rayures', 'Monture en alliage durable'],
    cta: 'Acheter les lunettes',
    seoMeta: 'aviator pro, lunettes de soleil polarisées, lunettes de mode'
  }
];

// Helper to calculate stable mock SEO scores and status
export function getMockSEOData(id: string) {
  if (id === 'mock-1') return { score: 94, status: 'PUBLISHED' as const };
  if (id === 'mock-2') return { score: 82, status: 'DRAFT' as const };
  if (id === 'mock-3') return { score: 45, status: 'NEEDS REVISION' as const };
  if (id === 'mock-4') return { score: 88, status: 'PUBLISHED' as const };
  
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const score = Math.abs(hash % 45) + 51; // Score between 51 and 95
  
  let status: 'PUBLISHED' | 'DRAFT' | 'NEEDS REVISION';
  if (score < 65) {
    status = 'NEEDS REVISION';
  } else if (score < 80) {
    status = 'DRAFT';
  } else {
    status = 'PUBLISHED';
  }
  
  return { score, status };
}

// Helper to get product thumbnails based on category/name
export function getProductThumbnail(category: string, name: string) {
  const cat = (category + ' ' + name).toLowerCase();
  if (cat.includes('chaussure') || cat.includes('shoe') || cat.includes('footwear') || cat.includes('sport')) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop';
  }
  if (cat.includes('casque') || cat.includes('sound') || cat.includes('headphone') || cat.includes('audio') || cat.includes('electr')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop';
  }
  if (cat.includes('montre') || cat.includes('watch') || cat.includes('horlog') || cat.includes('access')) {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop';
  }
  if (cat.includes('lunette') || cat.includes('glass') || cat.includes('polar') || cat.includes('fashion') || cat.includes('mode') || cat.includes('sac')) {
    return 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=80&h=80&fit=crop';
}

// Helper to translate categories dynamically
export function translateCategory(category: string): string {
  const cat = category.toLowerCase().trim();
  if (cat === 'footwear') return 'Chaussures';
  if (cat === 'electronics') return 'Électronique';
  if (cat === 'accessories') return 'Accessoires';
  if (cat === 'fashion') return 'Mode';
  return category;
}

// Helper to translate tones dynamically
export function translateTone(tone: string): string {
  const t = tone.toLowerCase().trim();
  if (t === 'dynamic') return 'Dynamique';
  if (t === 'luxury') return 'Luxe';
  if (t === 'professional') return 'Professionnel';
  if (t === 'commercial') return 'Commercial';
  return tone;
}

export default function App() {
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('pda-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  // State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('pda-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.provider) {
          return {
            fullName: 'Tony Alex',
            email: 'tony.alex@aigenius.io',
            avatarUrl: '',
            language: 'French',
            emailNotifications: true,
            anthropicApiKey: '',
            shopifyShopUrl: '',
            shopifyAccessToken: '',
            shopifyActive: false,
            wooUrl: '',
            wooConsumerKey: '',
            wooConsumerSecret: '',
            wooActive: false,
            ...parsed
          };
        }
      } catch {
        // Ignorer l'erreur et utiliser le fallback
      }
    }
    
    // Fallback aux variables d'environnement
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    return {
      provider: openaiKey ? 'openai' : (geminiKey ? 'gemini' : 'openai'),
      openaiApiKey: openaiKey,
      geminiApiKey: geminiKey,
      anthropicApiKey: '',
      fullName: 'Tony Alex',
      email: 'tony.alex@aigenius.io',
      avatarUrl: '',
      language: 'French',
      emailNotifications: true,
      shopifyShopUrl: '',
      shopifyAccessToken: '',
      shopifyActive: false,
      wooUrl: '',
      wooConsumerKey: '',
      wooConsumerSecret: '',
      wooActive: false
    };
  });

  const [history, setHistory] = useState<GenerationResult[]>(() => {
    const saved = localStorage.getItem('pda-history');
    if (saved) return JSON.parse(saved);
    // Seed default mock items if empty
    localStorage.setItem('pda-history', JSON.stringify(MOCK_SEEDED_HISTORY));
    return MOCK_SEEDED_HISTORY;
  });

  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewGeneration, setIsNewGeneration] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Navigation Tab (Dashboard is active by default)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'generator' | 'history' | 'settings'>('dashboard');

  // Search & Filter state for History view
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [seoFilter, setSeoFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pda-theme', theme);
  }, [theme]);

  // Local state for Settings form
  const [draftFullName, setDraftFullName] = useState(settings.fullName || 'Tony Alex');
  const [draftEmail, setDraftEmail] = useState(settings.email || 'tony.alex@aigenius.io');
  const [draftAvatarUrl, setDraftAvatarUrl] = useState(settings.avatarUrl || '');
  const [draftProvider, setDraftProvider] = useState<ProviderOption>(settings.provider || 'openai');
  const [draftOpenaiApiKey, setDraftOpenaiApiKey] = useState(settings.openaiApiKey || '');
  const [draftGeminiApiKey, setDraftGeminiApiKey] = useState(settings.geminiApiKey || '');
  const [draftAnthropicApiKey, setDraftAnthropicApiKey] = useState(settings.anthropicApiKey || '');
  const [draftLanguage, setDraftLanguage] = useState(settings.language || 'French');
  const [draftEmailNotifications, setDraftEmailNotifications] = useState(settings.emailNotifications !== false);
  
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);

  // Integrations states
  const [draftShopifyShopUrl, setDraftShopifyShopUrl] = useState(settings.shopifyShopUrl || '');
  const [draftShopifyAccessToken, setDraftShopifyAccessToken] = useState(settings.shopifyAccessToken || '');
  const [draftShopifyActive, setDraftShopifyActive] = useState(settings.shopifyActive || false);
  const [draftWooUrl, setDraftWooUrl] = useState(settings.wooUrl || '');
  const [draftWooConsumerKey, setDraftWooConsumerKey] = useState(settings.wooConsumerKey || '');
  const [draftWooConsumerSecret, setDraftWooConsumerSecret] = useState(settings.wooConsumerSecret || '');
  const [draftWooActive, setDraftWooActive] = useState(settings.wooActive || false);

  const [lastSaved, setLastSaved] = useState<string>('Dernière sauvegarde aujourd\'hui à 10:45');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync draft states when settings update
  useEffect(() => {
    setDraftFullName(settings.fullName || 'Tony Alex');
    setDraftEmail(settings.email || 'tony.alex@aigenius.io');
    setDraftAvatarUrl(settings.avatarUrl || '');
    setDraftProvider(settings.provider || 'openai');
    setDraftOpenaiApiKey(settings.openaiApiKey || '');
    setDraftGeminiApiKey(settings.geminiApiKey || '');
    setDraftAnthropicApiKey(settings.anthropicApiKey || '');
    setDraftLanguage(settings.language || 'French');
    setDraftEmailNotifications(settings.emailNotifications !== false);

    setDraftShopifyShopUrl(settings.shopifyShopUrl || '');
    setDraftShopifyAccessToken(settings.shopifyAccessToken || '');
    setDraftShopifyActive(settings.shopifyActive || false);
    setDraftWooUrl(settings.wooUrl || '');
    setDraftWooConsumerKey(settings.wooConsumerKey || '');
    setDraftWooConsumerSecret(settings.wooConsumerSecret || '');
    setDraftWooActive(settings.wooActive || false);
  }, [settings]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationError("L'image de profil ne doit pas dépasser 5 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraftAvatarUrl(reader.result as string);
        setValidationError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiscardChanges = () => {
    setDraftFullName(settings.fullName || 'Tony Alex');
    setDraftEmail(settings.email || 'tony.alex@aigenius.io');
    setDraftAvatarUrl(settings.avatarUrl || '');
    setDraftProvider(settings.provider || 'openai');
    setDraftOpenaiApiKey(settings.openaiApiKey || '');
    setDraftGeminiApiKey(settings.geminiApiKey || '');
    setDraftAnthropicApiKey(settings.anthropicApiKey || '');
    setDraftLanguage(settings.language || 'French');
    setDraftEmailNotifications(settings.emailNotifications !== false);

    setDraftShopifyShopUrl(settings.shopifyShopUrl || '');
    setDraftShopifyAccessToken(settings.shopifyAccessToken || '');
    setDraftShopifyActive(settings.shopifyActive || false);
    setDraftWooUrl(settings.wooUrl || '');
    setDraftWooConsumerKey(settings.wooConsumerKey || '');
    setDraftWooConsumerSecret(settings.wooConsumerSecret || '');
    setDraftWooActive(settings.wooActive || false);
    setValidationError(null);
  };

  const handleSaveChanges = () => {
    // API Keys format validations
    if (draftOpenaiApiKey.trim() !== '' && !draftOpenaiApiKey.trim().startsWith('sk-')) {
      setValidationError("La clé API OpenAI doit commencer par 'sk-'.");
      return;
    }
    if (draftAnthropicApiKey.trim() !== '' && !draftAnthropicApiKey.trim().startsWith('sk-ant-')) {
      setValidationError("La clé API Anthropic doit commencer par 'sk-ant-'.");
      return;
    }
    if (draftGeminiApiKey.trim() !== '' && !draftGeminiApiKey.trim().startsWith('AIzaSy')) {
      setValidationError("La clé API Gemini doit commencer par 'AIzaSy'.");
      return;
    }

    setValidationError(null);

    const updatedSettings: AppSettings = {
      ...settings,
      fullName: draftFullName,
      email: draftEmail,
      avatarUrl: draftAvatarUrl,
      provider: draftProvider,
      openaiApiKey: draftOpenaiApiKey,
      geminiApiKey: draftGeminiApiKey,
      anthropicApiKey: draftAnthropicApiKey,
      language: draftLanguage,
      emailNotifications: draftEmailNotifications,
      shopifyShopUrl: draftShopifyShopUrl,
      shopifyAccessToken: draftShopifyAccessToken,
      shopifyActive: draftShopifyActive,
      wooUrl: draftWooUrl,
      wooConsumerKey: draftWooConsumerKey,
      wooConsumerSecret: draftWooConsumerSecret,
      wooActive: draftWooActive
    };
    saveSettings(updatedSettings);
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setLastSaved(`Dernière sauvegarde aujourd'hui à ${timeString}`);
  };

  // Sync Settings
  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pda-settings', JSON.stringify(newSettings));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Submit & Generate Product Sheet
  const handleGenerate = async (input: ProductInput) => {
    setIsLoading(true);
    setIsNewGeneration(true);
    setGenerationError(null);

    const activeKey = settings.provider === 'openai' 
      ? settings.openaiApiKey 
      : (settings.provider === 'anthropic' ? settings.anthropicApiKey : settings.geminiApiKey);
    if (!activeKey || activeKey.trim() === '') {
      const providerName = settings.provider === 'openai' 
        ? 'OpenAI' 
        : (settings.provider === 'anthropic' ? 'Anthropic' : 'Gemini');
      setGenerationError(`La clé API ${providerName} n'est pas configurée. Veuillez l'ajouter dans les paramètres.`);
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateProductDescription(input, settings.provider, activeKey);
      
      setHistory((prevHistory) => {
        const updated = [result, ...prevHistory].slice(0, 50);
        localStorage.setItem('pda-history', JSON.stringify(updated));
        return updated;
      });
      
      setCurrentResult(result);
      
      // Confetti effect
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#FF6B00', '#FFA15A', '#FFFFFF']
      });
    } catch (error: any) {
      console.error(error);
      setGenerationError(error.message || "Une erreur inconnue est survenue lors de la génération.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Item from History
  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click trigger
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem('pda-history', JSON.stringify(updated));
    
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  // Reset to New Product Form
  const handleNewProduct = () => {
    setCurrentResult(null);
    setIsNewGeneration(false);
    setGenerationError(null);
  };

  const handleRegenerate = () => {
    if (currentResult) {
      handleGenerate(currentResult.input);
    }
  };

  // Calculate stats KPI
  const wordsGenerated = history.reduce((acc, curr) => {
    const text = [
      curr.title,
      curr.shortDescription,
      curr.longDescription,
      curr.cta,
      curr.seoMeta,
      ...curr.benefits
    ].join(' ');
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    return acc + count;
  }, 0);

  // Filtered history
  const filteredHistory = history.filter((item) => {
    // 1. Search Query Filter
    const matchesSearch = 
      item.input.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.input.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    // 2. Timeframe Filter
    let matchesTime = true;
    const itemDate = new Date(item.timestamp);
    const now = new Date();
    if (timeFilter === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesTime = itemDate >= sevenDaysAgo;
    } else if (timeFilter === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesTime = itemDate >= thirtyDaysAgo;
    }
    
    // 3. SEO Score Filter
    let matchesSeo = true;
    const { score } = getMockSEOData(item.id);
    if (seoFilter === 'excellent') {
      matchesSeo = score >= 90;
    } else if (seoFilter === 'good') {
      matchesSeo = score >= 70 && score < 90;
    } else if (seoFilter === 'needs_review') {
      matchesSeo = score < 70;
    }
    
    return matchesSearch && matchesTime && matchesSeo;
  });

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      {/* Top Navbar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        userName={settings.fullName || "Tony Alex"}
        avatarUrl={settings.avatarUrl}
      />

      {/* Main Layout containing Sidebar and Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Right Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          
          {/* VIEW 1: REDESIGNED DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* Dashboard Greeting Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                    Bienvenue, {settings.fullName || "Tony Alex"}
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Prêt à créer des descriptions de produits à fort taux de conversion aujourd'hui ?
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleNewProduct();
                    setActiveTab('generator');
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all cursor-pointer self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Créer un nouveau produit
                </button>
              </div>

              {/* Mockup KPI Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Stat 1: Total Products */}
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative flex flex-col justify-between h-32">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF5EE] dark:bg-orange-950/20 flex items-center justify-center text-[#A04E00] dark:text-[#FFA15A]">
                      <ShoppingBag className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                      +12%
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="block text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Total Produits
                    </span>
                    <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 block">
                      {(1284 + history.length).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Stat 2: Total Words */}
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative flex flex-col justify-between h-32">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF5EE] dark:bg-orange-950/20 flex items-center justify-center text-[#A04E00] dark:text-[#FFA15A]">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                      +5.2k
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="block text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Total Mots
                    </span>
                    <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 block">
                      {history.length > 0 
                        ? `${((428500 + wordsGenerated) / 1000).toFixed(1)}k` 
                        : "428.5k"}
                    </span>
                  </div>
                </div>

                {/* Stat 3: Avg SEO Score */}
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative flex flex-col justify-between h-32">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF5EE] dark:bg-orange-950/20 flex items-center justify-center text-[#A04E00] dark:text-[#FFA15A]">
                      <TrendingUp className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF5EE] dark:bg-orange-950/20 text-[#A04E00] dark:text-[#FFA15A]">
                      Top 5%
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="block text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Score SEO Moyen
                    </span>
                    <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 block">
                      92/100
                    </span>
                  </div>
                </div>

                {/* Stat 4: AI Engine Status */}
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative flex flex-col justify-between h-32">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF5EE] dark:bg-orange-950/20 flex items-center justify-center text-[#A04E00] dark:text-[#FFA15A]">
                      <Zap className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F0FE] dark:bg-blue-950/20 text-[#1A73E8] dark:text-blue-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#1A73E8] rounded-full animate-pulse"></span>
                      Stable
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="block text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Statut du Moteur IA
                    </span>
                    <span className="text-xl font-extrabold text-zinc-900 dark:text-white mt-1 block truncate">
                      {settings.provider === 'openai' ? 'GPT-4 Omni' : 'Gemini 2.0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lower Section (2 Columns: Recent Generations & Sidebar Cards) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Generations Card (Left Column) */}
                <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col min-h-[400px]">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-4 mb-4">
                    <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                      Générations récentes
                    </h2>
                    {history.length > 0 && (
                      <button 
                        onClick={() => setActiveTab('history')}
                        className="text-xs font-semibold text-[#FF6B00] hover:text-[#E05E00]"
                      >
                        Voir tout
                      </button>
                    )}
                  </div>

                  {history.length === 0 ? (
                    /* Mockup Empty State Placeholder */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                        <FileSpreadsheet className="w-7 h-7" />
                      </div>
                      <div className="space-y-1.5 max-w-sm">
                        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                          Aucune génération pour le moment
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          Votre espace de travail est vide. Commencez par créer votre première description de produit optimisée par IA pour la voir apparaître ici.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('generator')}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#8A3A00] dark:border-orange-500/40 rounded-xl text-xs font-bold text-[#8A3A00] dark:text-[#FFA15A] hover:bg-orange-50/50 dark:hover:bg-orange-950/10 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-[#8A3A00] dark:text-[#FFA15A]" />
                        Lancer l'assistant de génération
                      </button>
                    </div>
                  ) : (
                    /* List of Recent Generations */
                    <div className="flex-1 space-y-3">
                      {history.slice(0, 4).map((item) => (
                        <div 
                           key={item.id}
                          onClick={() => {
                            setCurrentResult(item);
                            setIsNewGeneration(false);
                            setActiveTab('generator');
                          }}
                          className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 hover:border-orange-100 dark:hover:border-orange-900/30 hover:bg-orange-50/10 dark:hover:bg-zinc-850/20 flex items-center justify-between gap-4 transition-all cursor-pointer group"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-[#FF6B00]">
                              {item.input.name}
                            </span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 flex items-center gap-1.5">
                              {translateCategory(item.input.category)} • {translateTone(item.input.tone)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                              {new Date(item.timestamp).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short'
                              })}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                              Ouvrir <Play className="w-2.5 h-2.5 fill-current" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Columns Cards (Pro Tip, Usage, Active Integrations) */}
                <div className="space-y-6">
                  {/* Pro Tip Card */}
                  <div className="rounded-2xl bg-[#8A3A00] text-white p-6 shadow-sm flex flex-col gap-4">
                    <div className="space-y-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-200">
                        Conseil de Pro
                      </span>
                      <p className="text-xs font-bold leading-relaxed text-zinc-100">
                        Utilisez les paramètres de « Voix de marque » pour garantir la cohérence sur tous vos canaux e-commerce.
                      </p>
                    </div>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}
                      className="text-xs font-bold flex items-center gap-1 text-orange-200 hover:text-white mt-2 transition-colors"
                    >
                      En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Usage This Month Card */}
                  <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-4">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      UTILISATION CE MOIS-CI
                    </h3>
                    
                    {/* Generations usage */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-zinc-700 dark:text-zinc-350">Générations</span>
                        <span className="text-zinc-500">{42 + history.length} / 1 000</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF6B00] rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, ((42 + history.length) / 1000) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* SEO Audits usage */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-zinc-700 dark:text-zinc-350">Audits SEO</span>
                        <span className="text-zinc-500">{15 + history.length} / 100</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, ((15 + history.length) / 100) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active Integrations Card */}
                  <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-4">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Intégrations actives
                    </h3>
                    <div className="flex items-center gap-3">
                      {/* Shopify card placeholder */}
                      <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-center relative group" title="Shopify activé">
                        <ShoppingBag className="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-[#FF6B00] transition-colors" />
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center">
                          <Check className="w-2 h-2 text-white stroke-[3px]" />
                        </span>
                      </div>

                      {/* WooCommerce card placeholder */}
                      <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-center relative group" title="WooCommerce activé">
                        <span className="text-md font-black text-zinc-400 dark:text-zinc-500 group-hover:text-purple-600 transition-colors">W</span>
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center">
                          <Check className="w-2 h-2 text-white stroke-[3px]" />
                        </span>
                      </div>

                      {/* Add new integration card */}
                      <button 
                        onClick={() => setActiveTab('settings')}
                        className="w-12 h-12 rounded-xl border-2 border-dashed border-zinc-250 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:border-orange-500 transition-all"
                        title="Ajouter une intégration"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW 2: GENERATOR (2 COLUMNS) */}
          {activeTab === 'generator' && (
            <div className="space-y-4 animate-fade-in">
              <div id="generator-workspace" className="flex items-center justify-between pt-2">
                <h2 className="text-md font-bold text-zinc-800 dark:text-zinc-250">
                  {currentResult ? `Modification : ${currentResult.input.name}` : 'Création de fiche produit'}
                </h2>
                {currentResult && (
                  <button
                    onClick={handleNewProduct}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-bold rounded-lg text-zinc-700 dark:text-zinc-300"
                    style={{ width: 'auto' }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Nouveau Produit
                  </button>
                )}
              </div>

              <div className="app-layout" style={{ maxWidth: '100%', padding: '0 0 6rem 0' }}>
                <div className="grid-cols-layout">
                  {/* Form panel */}
                  <section className="space-y-6">
                    <ProductForm 
                      key={currentResult ? currentResult.id : 'new'}
                      initialInput={currentResult ? currentResult.input : null}
                      onSubmit={handleGenerate} 
                      isLoading={isLoading} 
                    />
                  </section>

                  {/* Output bento grid panel */}
                  <section className="min-w-0">
                    {isLoading ? (
                      <LoadingOverlay isLoading={isLoading} />
                    ) : generationError ? (
                      <div className="saas-card p-8 flex flex-col items-center justify-center text-center min-h-[420px] border-red-500/20 bg-red-500/5 rounded-2xl">
                        <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#ff4d4d] mb-4">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <h3 className="text-md font-bold mb-2 text-zinc-850 dark:text-foreground">Échec de la génération</h3>
                        <p className="text-xs text-muted-foreground max-w-sm leading-relaxed mb-6">
                          {generationError}
                        </p>
                        <button
                          onClick={() => setActiveTab('settings')}
                          className="inline-flex items-center justify-center px-4 py-2 bg-[#FF6B00] text-white text-xs font-bold rounded-xl"
                          style={{ width: 'auto' }}
                        >
                          Configurer l'API
                        </button>
                      </div>
                    ) : (
                      <ResultDisplay
                        result={currentResult}
                        onRegenerate={handleRegenerate}
                        isNewGeneration={isNewGeneration}
                        settings={settings}
                      />
                    )}
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: HISTORY DASHBOARD */}
          {activeTab === 'history' && (() => {
            // Pagination Calculations
            const itemsPerPage = 4;
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
            const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
            
            // CSV Export Handler
            const handleExportCSV = () => {
              if (filteredHistory.length === 0) return;
              const headers = ['Nom du produit', 'Catégorie', 'Public cible', 'Ton', 'Date de génération', 'Score SEO', 'Statut'];
              const rows = filteredHistory.map(item => {
                const { score, status } = getMockSEOData(item.id);
                const date = new Date(item.timestamp).toISOString();
                return [
                  `"${item.input.name.replace(/"/g, '""')}"`,
                  `"${translateCategory(item.input.category).replace(/"/g, '""')}"`,
                  `"${item.input.targetAudience.replace(/"/g, '""')}"`,
                  `"${translateTone(item.input.tone)}"`,
                  `"${date}"`,
                  score,
                  status
                ];
              });
              const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', `generation_history_${new Date().toISOString().split('T')[0]}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            };

            return (
              <div className="space-y-6 animate-fade-in">
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Historique des générations</h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Gérez et passez en revue vos fiches produits générées précédemment.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleExportCSV} 
                      className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-55 dark:hover:bg-zinc-800 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Exporter en CSV
                    </button>
                    <button 
                      onClick={() => setActiveTab('generator')} 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B00] text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/10 hover:bg-[#E05E00] transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Nouvelle description
                    </button>
                  </div>
                </div>

                {/* Search & Filter Controls */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-3">
                  {/* Search Input */}
                  <div className="search-wrapper-premium w-full">
                    <Search className="search-icon-premium" />
                    <input
                      type="text"
                      placeholder="Filtrer par nom de produit ou mot-clé..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="search-input-premium text-xs"
                    />
                  </div>
                  
                  {/* Timeframe Select */}
                  <select
                    value={timeFilter}
                    onChange={(e) => {
                      setTimeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#A04E00] w-full md:w-44"
                  >
                    <option value="all">Tout le temps</option>
                    <option value="7days">7 derniers jours</option>
                    <option value="30days">30 derniers jours</option>
                  </select>
                  
                  {/* SEO Score Select */}
                  <select
                    value={seoFilter}
                    onChange={(e) => {
                      setSeoFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#A04E00] w-full md:w-44"
                  >
                    <option value="all">Score SEO : Tous</option>
                    <option value="excellent">Excellent (90+)</option>
                    <option value="good">Bon (70-89)</option>
                    <option value="needs_review">À revoir (&lt;70)</option>
                  </select>
                  
                  {/* Filter Icon Button */}
                  <button className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>

                {/* History Table */}
                {filteredHistory.length === 0 ? (
                  <div className="p-12 text-center text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs">
                    Aucun enregistrement correspondant trouvé dans votre historique de génération.
                  </div>
                ) : (
                  <div className="p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b border-zinc-100 dark:border-zinc-800">
                            <th className="p-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Nom du produit</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Date de génération</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Score SEO</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Statut</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((item) => {
                            const { score, status } = getMockSEOData(item.id);
                            return (
                              <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                                <td className="p-4 border-b border-zinc-100 dark:border-zinc-800/80">
                                  <div className="flex items-center gap-3">
                                    <img 
                                      src={getProductThumbnail(item.input.category, item.input.name)} 
                                      alt={item.input.name} 
                                      className="w-10 h-10 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
                                    />
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{item.input.name}</span>
                                      <span className="text-[10px] text-zinc-400 mt-0.5">Catégorie E-commerce : {translateCategory(item.input.category)}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 border-b border-zinc-100 dark:border-zinc-800/80">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                      {new Date(item.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 mt-0.5">
                                      {new Date(item.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4 border-b border-zinc-100 dark:border-zinc-800/80">
                                  <div className="flex items-center gap-3">
                                    <div className="w-20 h-1.5 bg-zinc-100 dark:bg-zinc-850 rounded-full overflow-hidden shrink-0">
                                      <div 
                                        className={`h-full ${
                                          score >= 90 
                                            ? 'bg-emerald-500' 
                                            : score >= 70 
                                              ? 'bg-amber-500' 
                                              : 'bg-red-500'
                                        }`}
                                        style={{ width: `${score}%` }}
                                      ></div>
                                    </div>
                                    <span className={`text-xs font-bold ${
                                      score >= 90 
                                        ? 'text-emerald-600 dark:text-emerald-400' 
                                        : score >= 70 
                                          ? 'text-amber-600 dark:text-amber-400' 
                                          : 'text-red-600 dark:text-red-400'
                                    }`}>
                                      {score}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4 border-b border-zinc-100 dark:border-zinc-800/80">
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                    status === 'PUBLISHED'
                                      ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                                      : status === 'DRAFT'
                                        ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                                        : 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                                  }`}>
                                    {status === 'PUBLISHED' ? 'PUBLIÉ' : status === 'DRAFT' ? 'BROUILLON' : 'À REVOIR'}
                                  </span>
                                </td>
                                <td className="p-4 border-b border-zinc-100 dark:border-zinc-800/80 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setCurrentResult(item);
                                        setIsNewGeneration(false);
                                        setActiveTab('generator');
                                      }}
                                      className="p-1 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors"
                                      title="Ouvrir la description"
                                    >
                                      <Play className="w-4 h-4 text-[#A04E00] dark:text-[#FFA15A]" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          `# ${item.title}\n\n${item.shortDescription}\n\n${item.longDescription}`
                                        );
                                      }}
                                      className="p-1 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors"
                                      title="Copier en Markdown"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => handleDeleteHistory(item.id, e)}
                                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-500 hover:text-red-600 transition-colors"
                                      title="Supprimer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between p-4 border-t border-zinc-100 dark:border-zinc-800">
                        <span className="text-[10px] text-zinc-400 font-medium">
                          Affichage de {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredHistory.length)} sur {filteredHistory.length} résultats
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 transition-all ${
                              currentPage === 1 
                                ? 'opacity-40 cursor-not-allowed' 
                                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                            }`}
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-7 h-7 text-xs font-bold rounded-lg transition-all ${
                                currentPage === pageNum
                                  ? 'bg-[#FF6B00] text-white'
                                  : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 transition-all ${
                              currentPage === totalPages 
                                ? 'opacity-40 cursor-not-allowed' 
                                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                            }`}
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Want better SEO scores? Tip Card */}
                <div className="p-8 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/5 dark:bg-zinc-900/10 flex flex-col items-center justify-center text-center gap-4 mt-8">
                  <div className="w-10 h-10 rounded-full bg-[#FFF5EE] dark:bg-orange-950/20 flex items-center justify-center text-[#A04E00] dark:text-[#FFA15A]">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Vous voulez de meilleurs scores SEO ?</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Notre Analyseur Pro peut vous aider à optimiser vos mots-clés et votre structure pour maximiser la conversion sur Amazon et Shopify.
                    </p>
                  </div>
                  <button className="text-xs font-semibold text-[#A04E00] dark:text-[#FFA15A] hover:underline">
                    En savoir plus sur les conseils d'optimisation
                  </button>
                </div>
              </div>
            );
          })()}

          {/* VIEW 4: SETTINGS DASHBOARD */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl animate-fade-in">
              {/* Header row */}
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Paramètres</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Gérez vos préférences de compte, vos connexions API et vos paramètres d'espace de travail.</p>
              </div>

              {/* Validation Error Alert */}
              {validationError && (
                <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 text-xs font-semibold flex items-center gap-3">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-500" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Account Details Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#A04E00] dark:text-[#FFA15A]">
                  <User className="w-4.5 h-4.5" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Détails du compte</h3>
                </div>
                <div className="border-b border-zinc-100 dark:border-zinc-800/80"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Nom complet</label>
                    <input
                      type="text"
                      value={draftFullName}
                      onChange={(e) => setDraftFullName(e.target.value)}
                      className="px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#A04E00]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Adresse e-mail</label>
                    <input
                      type="email"
                      value={draftEmail}
                      onChange={(e) => setDraftEmail(e.target.value)}
                      className="px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#A04E00]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/45 border border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={draftAvatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"} 
                      alt="Profile Avatar" 
                      className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Photo de profil</span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">PNG, JPG jusqu'à 5 Mo</span>
                    </div>
                  </div>
                  <label htmlFor="avatar-upload" className="cursor-pointer px-4 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    Modifier
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* API Keys Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#A04E00] dark:text-[#FFA15A]">
                  <Key className="w-4.5 h-4.5" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Fournisseur & Clés API</h3>
                </div>
                <div className="border-b border-zinc-100 dark:border-zinc-800/80"></div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Configurez le fournisseur d'IA actif et vos clés d'accès API.</p>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Fournisseur d'IA Actif</label>
                    <select
                      value={draftProvider}
                      onChange={(e) => setDraftProvider(e.target.value as ProviderOption)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#A04E00] font-semibold text-zinc-750 dark:text-zinc-250 w-full"
                    >
                      <option value="openai">OpenAI (GPT-4o-mini)</option>
                      <option value="gemini">Google Gemini (Gemini 3.5 Flash)</option>
                      <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                    </select>
                  </div>

                  {/* OpenAI key */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Clé API OpenAI</span>
                      {draftOpenaiApiKey && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-orange-100 dark:bg-orange-950/30 text-[#A04E00] dark:text-[#FFA15A] rounded-full uppercase tracking-wider">Active</span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showOpenaiKey ? "text" : "password"}
                        value={draftOpenaiApiKey}
                        onChange={(e) => setDraftOpenaiApiKey(e.target.value)}
                        placeholder="sk-••••••••••••••••••••••••••••••••"
                        className="w-full pl-3 pr-10 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#A04E00]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Gemini Key */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Clé API Gemini</span>
                      {draftGeminiApiKey && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-orange-100 dark:bg-orange-950/30 text-[#A04E00] dark:text-[#FFA15A] rounded-full uppercase tracking-wider">Active</span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showGeminiKey ? "text" : "password"}
                        value={draftGeminiApiKey}
                        onChange={(e) => setDraftGeminiApiKey(e.target.value)}
                        placeholder="AIzaSy••••••••••••••••••••••••••••••••"
                        className="w-full pl-3 pr-10 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#A04E00]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Anthropic key */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Clé Anthropic Claude</span>
                      {draftAnthropicApiKey && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-orange-100 dark:bg-orange-950/30 text-[#A04E00] dark:text-[#FFA15A] rounded-full uppercase tracking-wider">Active</span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showAnthropicKey ? "text" : "password"}
                        value={draftAnthropicApiKey}
                        onChange={(e) => setDraftAnthropicApiKey(e.target.value)}
                        placeholder="sk-ant-••••••••••••••••••••••••••••••••"
                        className="w-full pl-3 pr-10 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#A04E00]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        {showAnthropicKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intégrations E-commerce Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-[#A04E00] dark:text-[#FFA15A]">
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Intégrations E-commerce</h3>
                </div>
                <div className="border-b border-zinc-100 dark:border-zinc-800/80"></div>

                {/* Shopify integration settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/40">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Activer l'intégration Shopify</span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">Permet de publier vos descriptions en brouillon sur Shopify.</span>
                    </div>
                    <button
                      onClick={() => setDraftShopifyActive(!draftShopifyActive)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                        draftShopifyActive ? 'bg-[#FF6B00]' : 'bg-zinc-200 dark:bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          draftShopifyActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {draftShopifyActive && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in pl-2 border-l-2 border-orange-500/20">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">URL de la boutique (myshopify.com)</label>
                        <input
                          type="text"
                          value={draftShopifyShopUrl}
                          onChange={(e) => setDraftShopifyShopUrl(e.target.value)}
                          placeholder="ma-boutique.myshopify.com"
                          className="px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#A04E00]"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Jeton d'accès API (Access Token)</label>
                        <input
                          type="password"
                          value={draftShopifyAccessToken}
                          onChange={(e) => setDraftShopifyAccessToken(e.target.value)}
                          placeholder="shpat_••••••••••••••••••••••••••••••••"
                          className="px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#A04E00]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* WooCommerce integration settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/40">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Activer l'intégration WooCommerce</span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">Permet de publier vos descriptions en brouillon sur WooCommerce.</span>
                    </div>
                    <button
                      onClick={() => setDraftWooActive(!draftWooActive)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                        draftWooActive ? 'bg-[#FF6B00]' : 'bg-zinc-200 dark:bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          draftWooActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {draftWooActive && (
                    <div className="space-y-4 animate-fade-in pl-2 border-l-2 border-orange-500/20">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">URL du site WordPress</label>
                        <input
                          type="text"
                          value={draftWooUrl}
                          onChange={(e) => setDraftWooUrl(e.target.value)}
                          placeholder="https://mon-site-woocommerce.com"
                          className="px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#A04E00] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Clé client WooCommerce (Consumer Key)</label>
                          <input
                            type="text"
                            value={draftWooConsumerKey}
                            onChange={(e) => setDraftWooConsumerKey(e.target.value)}
                            placeholder="ck_••••••••••••••••••••"
                            className="px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#A04E00]"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Secret client WooCommerce (Consumer Secret)</label>
                          <input
                            type="password"
                            value={draftWooConsumerSecret}
                            onChange={(e) => setDraftWooConsumerSecret(e.target.value)}
                            placeholder="cs_••••••••••••••••••••"
                            className="px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#A04E00]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preferences Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#A04E00] dark:text-[#FFA15A]">
                  <Sliders className="w-4.5 h-4.5" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Préférences</h3>
                </div>
                <div className="border-b border-zinc-100 dark:border-zinc-800/80"></div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {/* Dark Mode Option */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Mode sombre</span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">Basculez entre les thèmes d'interface clair et sombre.</span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                        theme === 'dark' ? 'bg-[#FF6B00]' : 'bg-zinc-200 dark:bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Language Option */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Langue de génération</span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">Langue de sortie par défaut pour les descriptions.</span>
                    </div>
                    <select
                      value={draftLanguage}
                      onChange={(e) => setDraftLanguage(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#A04E00] w-36 font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      <option value="English (US)">Anglais (US)</option>
                      <option value="French">Français</option>
                      <option value="Spanish">Espagnol</option>
                      <option value="German">Allemand</option>
                    </select>
                  </div>

                  {/* Email Notifications Option */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Notifications par e-mail</span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">Recevez des rapports hebdomadaires sur l'utilisation de l'IA.</span>
                    </div>
                    <button
                      onClick={() => setDraftEmailNotifications(!draftEmailNotifications)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                        draftEmailNotifications ? 'bg-[#FF6B00]' : 'bg-zinc-200 dark:bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          draftEmailNotifications ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 shadow-sm">
                <span className="text-[10px] text-zinc-400 font-semibold">{lastSaved}</span>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleDiscardChanges}
                    className="flex-1 sm:flex-initial px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#8A3A00] hover:bg-[#6F2F00] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
