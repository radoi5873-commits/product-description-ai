import React from 'react';
import { Search, Bell, Grid, Sun, Moon } from 'lucide-react';

interface TopBarProps {
  activeTab: 'dashboard' | 'generator' | 'history' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'generator' | 'history' | 'settings') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userName: string;
  avatarUrl?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  userName,
  avatarUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
}) => {
  return (
    <header className="navbar-premium border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="navbar-inner-premium flex items-center justify-between px-6 py-3 h-14">
        {/* Left Side: Brand & Tabs */}
        <div className="flex items-center gap-8">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="text-lg font-extrabold tracking-tight text-[#A04E00] dark:text-[#FFA15A]">
              AIGenius
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`text-xs font-semibold px-1 py-4 relative transition-all ${
                activeTab === 'dashboard' 
                  ? 'text-[#A04E00] dark:text-[#FFA15A]' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-250'
              }`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`text-xs font-semibold px-1 py-4 relative transition-all ${
                activeTab === 'generator' 
                  ? 'text-[#A04E00] dark:text-[#FFA15A]' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-250'
              }`}
            >
              Générateur
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`text-xs font-semibold px-1 py-4 relative transition-all ${
                activeTab === 'history' 
                  ? 'text-[#A04E00] dark:text-[#FFA15A]' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-250'
              }`}
            >
              Historique
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`text-xs font-semibold px-1 py-4 relative transition-all ${
                activeTab === 'settings' 
                  ? 'text-[#A04E00] dark:text-[#FFA15A]' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-250'
              }`}
            >
              Paramètres
            </button>
          </nav>
        </div>

        {/* Right Side: Search, Notifications, Theme, Profile */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="relative search-container-header hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher des générations..."
              className="pl-9 pr-4 py-1.5 w-64 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#A04E00]"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            title={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Notification icon */}
          <button className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FF6B00] rounded-full"></span>
          </button>

          {/* Grid icon */}
          <button className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <Grid className="w-4.5 h-4.5" />
          </button>

          {/* Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <img 
              src={avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'} 
              alt={userName} 
              className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
