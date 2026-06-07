import React from 'react';
import { Menu, Settings, Sun, Moon, Sparkles, ChevronRight, Activity } from 'lucide-react';

interface TopBarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onSettingsClick: () => void;
  apiConfigured: boolean;
  onBurgerClick: () => void;
  activeProductName: string | null;
}

export const TopBar: React.FC<TopBarProps> = ({
  theme,
  toggleTheme,
  onSettingsClick,
  apiConfigured,
  onBurgerClick,
  activeProductName,
}) => {
  return (
    <header className="topbar-saas">
      {/* Left Navigation and Burger Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBurgerClick}
          className="burger-menu-btn"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>Générateur</span>
          {activeProductName && (
            <>
              <ChevronRight className="w-3 h-3 text-zinc-500" />
              <span className="text-foreground font-bold truncate max-w-[150px] sm:max-w-[300px]">
                {activeProductName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right Action Icons & Badges */}
      <div className="flex items-center gap-3">
        {/* Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/40 backdrop-blur-md border border-zinc-800/40 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
          <Activity className={`w-3 h-3 ${apiConfigured ? 'text-green-500' : 'text-[#FF6B00]'}`} />
          <span>{apiConfigured ? 'Gemini 1.5' : 'Mode Local'}</span>
        </div>

        {/* Settings Trigger */}
        <button
          onClick={onSettingsClick}
          className="btn-saas-icon rounded-lg p-2 bg-white/5 border border-zinc-800 hover:border-zinc-700 text-foreground transition-all flex items-center justify-center"
          title="Paramètres de l'API"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Theme Toggle Trigger */}
        <button
          onClick={toggleTheme}
          className="btn-saas-icon rounded-lg p-2 bg-white/5 border border-zinc-800 hover:border-zinc-700 text-foreground transition-all flex items-center justify-center"
          title={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
