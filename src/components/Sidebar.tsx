import React from 'react';
import { LayoutDashboard, Sparkles, History, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'generator' | 'history' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'generator' | 'history' | 'settings') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-3.5rem)]">
      {/* Brand box & Nav Links */}
      <div className="space-y-6">
        {/* Brand Widget */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/40">
          <div className="w-10 h-10 rounded-lg bg-[#A04E00] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
              AIGenius Pro
            </span>
            <span className="text-[10px] text-zinc-500 truncate">
              Suite Produit
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-500/15'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Tableau de bord
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'generator'
                ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-500/15'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Générateur
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-500/15'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <History className="w-4 h-4" />
            Historique
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-500/15'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            Paramètres
          </button>
        </nav>
      </div>

      {/* Pro Plan Activation Card */}
      <div className="p-4 rounded-2xl bg-[#FFF5EE] dark:bg-orange-950/20 border border-[#FFE4D0] dark:border-orange-900/30 flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-extrabold text-[#A04E00] dark:text-[#FFA15A] uppercase tracking-wider">
            Passer au Pro
          </span>
          <span className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
            Obtenez des générations illimitées et un accès API prioritaire.
          </span>
        </div>
        <button className="w-full py-2 px-3 text-center text-xs font-bold text-white rounded-xl bg-[#8A3A00] hover:bg-[#6F2F00] transition-colors">
          Mettre à niveau
        </button>
      </div>
    </aside>
  );
};
