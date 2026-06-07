import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ProductForm } from './components/ProductForm';
import { ResultDisplay } from './components/ResultDisplay';
import { SettingsModal } from './components/SettingsModal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { generateProductDescription } from './utils/generator';
import type { ProductInput, GenerationResult, AppSettings } from './types';
import { ShoppingBag, FileText, BrainCircuit } from 'lucide-react';
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
    return saved ? JSON.parse(saved) : { apiKey: '' };
  });

  const [history, setHistory] = useState<GenerationResult[]>(() => {
    const saved = localStorage.getItem('pda-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewGeneration, setIsNewGeneration] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

    try {
      const result = await generateProductDescription(input, settings.apiKey);
      
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Select Item from Sidebar History
  const handleSelectHistory = (id: string) => {
    const item = history.find(r => r.id === id);
    if (item) {
      setIsNewGeneration(false);
      setCurrentResult(item);
    }
  };

  // Delete Item from Sidebar History
  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent trigger select
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

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Navigation & History */}
      <Sidebar
        history={history}
        activeId={currentResult?.id || null}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        onNew={handleNewProduct}
        onSettingsClick={() => setIsSettingsOpen(true)}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        apiConfigured={!!settings.apiKey}
      />

      {/* Main Dashboard Panel */}
      <div className="main-content-saas">
        {/* TopBar controls */}
        <TopBar
          theme={theme}
          toggleTheme={toggleTheme}
          onSettingsClick={() => setIsSettingsOpen(true)}
          apiConfigured={!!settings.apiKey}
          onBurgerClick={() => setIsMobileSidebarOpen(true)}
          activeProductName={currentResult ? currentResult.input.name : null}
        />

        {/* Content Workspace */}
        <main className="workspace-saas">
          {/* Key KPI Metrics Grid */}
          <div className="stats-row animate-slide-up">
            {/* KPI 1 : Total Generated */}
            <div className="stat-card-premium">
              <div className="stat-card-icon">
                <ShoppingBag className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Fiches Rédigées</span>
                <span className="stat-card-value">{totalGenerations}</span>
              </div>
            </div>

            {/* KPI 2 : Total Words */}
            <div className="stat-card-premium">
              <div className="stat-card-icon">
                <FileText className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Mots Générés</span>
                <span className="stat-card-value">{wordsGenerated.toLocaleString()}</span>
              </div>
            </div>

            {/* KPI 3 : Engine Status */}
            <div className="stat-card-premium">
              <div className="stat-card-icon">
                <BrainCircuit className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Moteur Actif</span>
                <span className="stat-card-value">
                  {settings.apiKey ? 'Gemini 1.5' : 'Mode Local'}
                </span>
              </div>
            </div>
          </div>

          {/* Form and Results Workspace */}
          <div className="app-layout">
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

              {/* Output Bento grid panel */}
              <section className="min-w-0 animate-slide-up delay-150">
                {isLoading ? (
                  <LoadingOverlay isLoading={isLoading} />
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
        </main>
      </div>

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
