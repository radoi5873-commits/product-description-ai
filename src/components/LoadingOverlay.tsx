import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LOADING_STATUSES = [
  "Analyse des spécificités du produit...",
  "Identification du public cible...",
  "Recherche des mots-clés SEO les plus performants...",
  "Rédaction du titre accrocheur...",
  "Formulation de la description courte (AIDA)...",
  "Structuration de la description longue...",
  "Optimisation des 5 avantages principaux...",
  "Création du Call-To-Action persuasif...",
  "Génération des balises Meta e-commerce...",
  "Finalisation et mise en forme de la fiche..."
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      setStatusIndex(0);
      return;
    }

    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length);
    }, 1200);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev;
        return prev + 1;
      });
    }, 18);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Barre d'action supérieure en chargement */}
      <div className="saas-card flex items-center justify-between p-4 border-dashed border-orange-500/20">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-[#FF6B00] shrink-0">
            <Loader2 className="w-4.5 h-4.5 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{LOADING_STATUSES[statusIndex]}</p>
            <div className="w-full bg-white/5 border border-white/5 h-1.5 rounded-full overflow-hidden mt-1.5 max-w-md relative">
              <div 
                className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FFA15A] transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-extrabold text-[#FF6B00] shrink-0 ml-2">{progress}%</span>
        </div>
      </div>

      {/* Grille de Squelettes de Cartes de Résultats */}
      <div className="result-card-grid">
        {/* Titre */}
        <div className="skeleton-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3.5 h-3.5 rounded bg-orange-500/20" />
            <div className="w-24 h-3 skeleton-shimmer" />
          </div>
          <div className="w-3/4 h-5 skeleton-shimmer" />
        </div>

        {/* Desc Courte */}
        <div className="skeleton-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3.5 h-3.5 rounded bg-orange-500/20" />
            <div className="w-32 h-3 skeleton-shimmer" />
          </div>
          <div className="w-full h-4 skeleton-shimmer mb-2" />
          <div className="w-5/6 h-4 skeleton-shimmer" />
        </div>

        {/* Desc Longue */}
        <div className="skeleton-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3.5 h-3.5 rounded bg-orange-500/20" />
            <div className="w-40 h-3 skeleton-shimmer" />
          </div>
          <div className="w-full h-4 skeleton-shimmer mb-2" />
          <div className="w-full h-4 skeleton-shimmer mb-2" />
          <div className="w-4/5 h-4 skeleton-shimmer" />
        </div>

        {/* Avantages */}
        <div className="skeleton-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3.5 h-3.5 rounded bg-orange-500/20" />
            <div className="w-36 h-3 skeleton-shimmer" />
          </div>
          <div className="space-y-2.5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex gap-2 items-center">
                <div className="w-4 h-4 rounded-full bg-orange-500/10 shrink-0" />
                <div className="w-2/3 h-3.5 skeleton-shimmer" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="skeleton-card flex items-center justify-between">
          <div className="space-y-2">
            <div className="w-20 h-2.5 skeleton-shimmer" />
            <div className="w-28 h-4 skeleton-shimmer" />
          </div>
          <div className="w-16 h-8 rounded-lg bg-orange-500/10" />
        </div>

        {/* SEO */}
        <div className="skeleton-card border-orange-500/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3.5 h-3.5 rounded bg-orange-500/20" />
            <div className="w-28 h-3 skeleton-shimmer" />
          </div>
          <div className="w-full h-3 skeleton-shimmer mb-2 border-l-2 border-orange-500/10 pl-2" />
          <div className="w-2/3 h-3 skeleton-shimmer border-l-2 border-orange-500/10 pl-2" />
        </div>
      </div>
    </div>
  );
};
