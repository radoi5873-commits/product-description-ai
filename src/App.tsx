import { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { ProductForm } from './components/ProductForm';
import { ResultDisplay } from './components/ResultDisplay';
import { SettingsModal } from './components/SettingsModal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { generateProductDescription } from './utils/generator';
import type { ProductInput, GenerationResult, AppSettings } from './types';
import { ShoppingBag, FileText, BrainCircuit, Play, Search, Trash2, Copy, Download, Plus, Star, Sparkles, Globe, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

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
        if (parsed.provider) return parsed;
      } catch (e) {
        // Ignorer l'erreur et utiliser le fallback
      }
    }
    
    // Fallback aux variables d'environnement
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    return {
      provider: openaiKey ? 'openai' : (geminiKey ? 'gemini' : 'openai'),
      openaiApiKey: openaiKey,
      geminiApiKey: geminiKey
    };
  });

  const [history, setHistory] = useState<GenerationResult[]>(() => {
    const saved = localStorage.getItem('pda-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewGeneration, setIsNewGeneration] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // SaaS Navigation Tabs State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'generator' | 'history'>('dashboard');

  // Search & Filter state for History view
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sync Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pda-theme', theme);
  }, [theme]);

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

    const activeKey = settings.provider === 'openai' ? settings.openaiApiKey : settings.geminiApiKey;
    if (!activeKey || activeKey.trim() === '') {
      setGenerationError(`La clé API ${settings.provider === 'openai' ? 'OpenAI' : 'Gemini'} n'est pas configurée. Veuillez l'ajouter dans les paramètres.`);
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
  const totalGenerations = history.length;
  const wordsGenerated = history.reduce((acc, curr) => {
    const text = [
      curr.title,
      curr.shortDescription,
      curr.longDescription,
      curr.cta,
      curr.seoMeta,
      ...curr.benefits
    ].join(' ');
    // Simple word counter
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    return acc + count;
  }, 0);

  // Extract unique categories from history
  const categories = Array.from(new Set(history.map(h => h.input.category)));

  // Filtered history
  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.input.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.input.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.input.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onSettingsClick={() => setIsSettingsOpen(true)}
        provider={settings.provider}
        apiConfigured={settings.provider === 'openai' ? !!settings.openaiApiKey : !!settings.geminiApiKey}
        historyCount={history.length}
      />

      {/* Main Workspace */}
      <main className="workspace-saas flex-1" style={{ paddingTop: '2.5rem' }}>
        
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="welcome-card-premium animate-slide-up">
              <h1 className="welcome-title-premium">Bonjour, Ayena Mandégnon Conrad 👋</h1>
              <p className="welcome-subtitle-premium">
                Simplifiez la création de vos fiches produits e-commerce. Rédigez des descriptions captivantes, optimisées pour le SEO et prêtes à vendre en un temps record.
              </p>
              <div className="quick-actions-row-premium">
                <button
                  onClick={() => {
                    handleNewProduct();
                    setActiveTab('generator');
                  }}
                  className="quick-action-btn-premium btn-saas btn-saas-primary"
                  style={{ width: 'auto' }}
                >
                  <Plus className="w-4.5 h-4.5 text-inverse" />
                  Nouveau Produit
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="quick-action-btn-premium btn-saas btn-saas-secondary"
                  style={{ width: 'auto' }}
                >
                  Configurer la clé API
                </button>
              </div>
            </div>

            {/* KPI Stats Grid */}
            <div className="stats-row animate-slide-up delay-100">
              <div className="stat-card-premium">
                <div className="stat-card-icon">
                  <ShoppingBag className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-label">Fiches Rédigées</span>
                  <span className="stat-card-value">{totalGenerations}</span>
                </div>
              </div>

              <div className="stat-card-premium">
                <div className="stat-card-icon">
                  <FileText className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-label">Mots Générés</span>
                  <span className="stat-card-value">{wordsGenerated.toLocaleString()}</span>
                </div>
              </div>

              <div className="stat-card-premium">
                <div className="stat-card-icon">
                  <BrainCircuit className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-label">Moteur IA</span>
                  <span className="stat-card-value">
                    {settings.provider === 'openai'
                      ? (settings.openaiApiKey ? 'OpenAI GPT-4o' : 'Non configuré')
                      : (settings.geminiApiKey ? 'Gemini 1.5' : 'Non configuré')}
                  </span>
                </div>
              </div>

              <div className="stat-card-premium">
                <div className="stat-card-icon">
                  <Star className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-label">Score SEO Moyen</span>
                  <span className="stat-card-value">98.4%</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="recent-activity-section animate-slide-up delay-150">
              <div className="section-header-premium">
                <h2 className="section-title-premium">Générations Récentes</h2>
                {history.length > 3 && (
                  <button
                    onClick={() => setActiveTab('history')}
                    className="btn-saas btn-saas-secondary py-1.5 px-3 text-xs"
                    style={{ width: 'auto' }}
                  >
                    Voir tout l'historique
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="saas-card text-center p-12 text-muted-foreground text-xs italic">
                  Aucune fiche produit n'a encore été générée. Lancez le générateur pour commencer.
                </div>
              ) : (
                <div className="recent-activity-grid">
                  {history.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="recent-card-premium animate-slide-up"
                      onClick={() => {
                        setCurrentResult(item);
                        setIsNewGeneration(false);
                        setActiveTab('generator');
                      }}
                    >
                      <div className="recent-card-top">
                        <div className="recent-card-info">
                          <span className="recent-card-title">{item.input.name}</span>
                          <span className="recent-card-meta">
                            {new Date(item.timestamp).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <span className="recent-card-tag">{item.input.category}</span>
                      </div>
                      <p className="recent-card-preview">{item.shortDescription}</p>
                      <div className="recent-card-bottom">
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          Ton : {item.input.tone}
                        </span>
                        <span className="recent-card-action">
                          Ouvrir <Play className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: GENERATOR (2 COLUMNS) */}
        {activeTab === 'generator' && (
          <div className="space-y-4">
            {/* Hero Section displayed before starting a new product sheet */}
            {!currentResult && (
              <div className="hero-section-premium animate-slide-up">
                <div className="hero-content-left">
                  <div className="hero-badges-row">
                    <span className="hero-badge badge-ia">
                      <Sparkles className="w-3.5 h-3.5" /> Intelligence Artificielle
                    </span>
                    <span className="hero-badge badge-seo">
                      <Globe className="w-3.5 h-3.5" /> Optimisé SEO
                    </span>
                    <span className="hero-badge badge-ecommerce">
                      <ShoppingBag className="w-3.5 h-3.5" /> E-commerce
                    </span>
                  </div>
                  <h1 className="hero-title">
                    Générez des fiches produits optimisées pour la vente en quelques secondes
                  </h1>
                  <p className="hero-subtitle">
                    Créez automatiquement des descriptions produits, avantages, CTA et contenus SEO grâce à l'intelligence artificielle.
                  </p>
                  <button
                    onClick={() => {
                      document.getElementById('generator-workspace')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-saas btn-saas-primary hero-cta-btn"
                  >
                    Commencer
                    <ArrowRight className="w-4 h-4 text-inverse ml-1.5" />
                  </button>
                </div>

                <div className="hero-illustration-right">
                  <div className="mockup-container">
                    <div className="mockup-bg-glow" />
                    <div className="mockup-card mockup-card-1 animate-float-slow">
                      <div className="mockup-dots">
                        <span className="mockup-dot dot-red" />
                        <span className="mockup-dot dot-yellow" />
                        <span className="mockup-dot dot-green" />
                      </div>
                      <div className="mockup-line title-line" />
                      <div className="mockup-line text-line-1" />
                      <div className="mockup-line text-line-2" />
                    </div>
                    <div className="mockup-card mockup-card-2 animate-float-medium">
                      <div className="mockup-seo-badge">Score SEO : 98%</div>
                      <div className="mockup-line seo-line-1" />
                    </div>
                    <div className="mockup-card mockup-card-3 animate-float-fast">
                      <div className="mockup-cta-text">Acheter maintenant →</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div id="generator-workspace" className="flex items-center justify-between animate-slide-up pt-4">
              <h2 className="text-md font-bold text-foreground">
                {currentResult ? `Modification : ${currentResult.input.name}` : 'Création de fiche produit'}
              </h2>
              {currentResult && (
                <button
                  onClick={handleNewProduct}
                  className="btn-saas btn-saas-secondary py-1.5 px-3 text-xs"
                  style={{ width: 'auto' }}
                >
                  <Plus className="w-3.5 h-3.5" /> Nouveau Produit
                </button>
              )}
            </div>

            <div className="app-layout" style={{ maxWidth: '100%', padding: '0 0 6rem 0' }}>
              <div className="grid-cols-layout">
                {/* Form panel */}
                <section className="space-y-6 animate-slide-up delay-100">
                  <ProductForm 
                    key={currentResult ? currentResult.id : 'new'}
                    initialInput={currentResult ? currentResult.input : null}
                    onSubmit={handleGenerate} 
                    isLoading={isLoading} 
                  />
                </section>

                {/* Output bento grid panel */}
                <section className="min-w-0 animate-slide-up delay-150">
                  {isLoading ? (
                    <LoadingOverlay isLoading={isLoading} />
                  ) : generationError ? (
                    <div className="saas-card p-8 flex flex-col items-center justify-center text-center min-h-[420px] border-red-500/20 bg-red-500/5">
                      <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#ff4d4d] mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="text-md font-bold mb-2 text-foreground">Échec de la génération</h3>
                      <p className="text-xs text-muted-foreground max-w-sm leading-relaxed mb-6">
                        {generationError}
                      </p>
                      <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="btn-saas btn-saas-primary text-xs py-2 px-4"
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
                    />
                  )}
                </section>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: HISTORY DASHBOARD */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="animate-slide-up">
              <h1 className="text-lg font-bold text-foreground">Historique des Générations</h1>
              <p className="text-xs text-muted-foreground">Retrouvez, gérez et exportez vos fiches produits rédigées précédemment.</p>
            </div>

            {/* Search & Filter Controls */}
            <div className="history-controls-premium animate-slide-up">
              <div className="search-wrapper-premium">
                <Search className="search-icon-premium" />
                <input
                  type="text"
                  placeholder="Rechercher une fiche produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-premium"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select-premium"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* History Table */}
            {filteredHistory.length === 0 ? (
              <div className="saas-card text-center p-12 text-muted-foreground animate-slide-up delay-100">
                Aucun résultat trouvé dans votre historique.
              </div>
            ) : (
              <div className="overflow-x-auto animate-slide-up delay-100" style={{ width: '100%' }}>
                <table className="history-table-premium">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Catégorie</th>
                      <th>Ton</th>
                      <th>Date de création</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="history-table-row">
                        <td className="history-table-cell">
                          <div className="history-product-name">{item.input.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate max-w-xs">{item.title}</div>
                        </td>
                        <td className="history-table-cell">
                          <span className="history-badge-tag badge-category">{item.input.category}</span>
                        </td>
                        <td className="history-table-cell">
                          <span className="history-badge-tag badge-tone">{item.input.tone}</span>
                        </td>
                        <td className="history-table-cell text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="history-table-cell history-actions-cell">
                          <button
                            onClick={() => {
                              setCurrentResult(item);
                              setIsNewGeneration(false);
                              setActiveTab('generator');
                            }}
                            className="history-action-btn"
                            title="Ouvrir dans le générateur"
                          >
                            <Play className="w-4 h-4 text-primary" />
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `# ${item.title}\n\n${item.shortDescription}\n\n${item.longDescription}`
                              );
                            }}
                            className="history-action-btn"
                            title="Copier en Markdown"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const content = `# ${item.title}\n\n${item.shortDescription}\n\n${item.longDescription}`;
                              const blob = new Blob([content], { type: 'text/markdown' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${item.input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
                              a.click();
                            }}
                            className="history-action-btn"
                            title="Télécharger"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteHistory(item.id, e)}
                            className="history-action-btn btn-delete"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* API Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={saveSettings}
      />
    </div>
  );
}
