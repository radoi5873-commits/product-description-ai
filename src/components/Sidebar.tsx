import React from 'react';
import { Sparkles, Plus, History, Settings, Trash2, ShieldCheck } from 'lucide-react';
import type { GenerationResult } from '../types';

interface SidebarProps {
  history: GenerationResult[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onNew: () => void;
  onSettingsClick: () => void;
  isOpen: boolean;
  onClose: () => void;
  apiConfigured: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  history,
  activeId,
  onSelect,
  onDelete,
  onNew,
  onSettingsClick,
  isOpen,
  onClose,
  apiConfigured,
}) => {
  return (
    <>
      {/* Mobile Sidebar backdrop overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar-saas ${isOpen ? 'open' : ''}`}>
        <div className="flex-col w-full h-full justify-between flex">
          {/* Logo & New Button Section */}
          <div>
            <div className="flex items-center gap-2.5 px-1 py-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6B00] to-[#FF8C39] flex items-center justify-center shadow-lg shadow-orange-500/10 shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-md font-extrabold tracking-tight text-foreground flex items-center gap-1">
                Product Description <span className="text-[#FF6B00]">AI</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-orange-500/10 text-[8px] font-bold text-[#FF6B00] uppercase tracking-wider border border-orange-500/10 ml-1">
                  SaaS
                </span>
              </span>
            </div>

            <button
              onClick={() => {
                onNew();
                onClose();
              }}
              className="btn-saas btn-saas-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              <Plus className="w-4 h-4 text-inverse" />
              Nouveau Produit
            </button>
          </div>

          {/* History Container Section */}
          <div className="flex-1 flex flex-col min-h-0 mt-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              <History className="w-3.5 h-3.5" />
              Dernières générations
            </div>
            
            <div className="sidebar-history-container">
              {history.length === 0 ? (
                <div className="text-xs text-muted-foreground/60 italic p-3 text-center">
                  Aucun historique
                </div>
              ) : (
                history.map((item) => {
                  const date = new Date(item.timestamp);
                  const formattedDate = date.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelect(item.id);
                        onClose();
                      }}
                      className={`sidebar-history-item ${activeId === item.id ? 'active' : ''}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onSelect(item.id);
                          onClose();
                        }
                      }}
                    >
                      <div className="flex flex-col min-w-0 pr-2 flex-1">
                        <span className="text-xs font-semibold text-foreground truncate w-full">
                          {item.input.name}
                        </span>
                        <span className="text-[9px] text-muted-foreground mt-0.5">
                          {formattedDate} • {item.input.category}
                        </span>
                      </div>
                      
                      <button
                        onClick={(e) => onDelete(item.id, e)}
                        className="sidebar-history-delete"
                        title="Supprimer la fiche"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom Settings Section */}
          <div className="border-t border-zinc-800/40 pt-4 mt-auto">
            {/* Quick Engine Indicator */}
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/5 mb-3">
              <ShieldCheck className={`w-3.5 h-3.5 ${apiConfigured ? 'text-[#FF6B00]' : 'text-zinc-500'}`} />
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                  Moteur IA
                </span>
                <span className="text-[10px] font-semibold text-foreground">
                  {apiConfigured ? 'Gemini Pro Actif' : 'Moteur Local'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onSettingsClick();
                onClose();
              }}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <Settings className="w-4 h-4" />
              Configuration de l'API
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
