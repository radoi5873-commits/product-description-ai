import React, { useState, useEffect } from 'react';
import { 
  Copy, Check, Download, RotateCcw, 
  CheckCircle2, ArrowRight, Globe, FileText,
  Heading, TextQuote, AlignLeft, ListChecks, MousePointerClick
} from 'lucide-react';
import type { GenerationResult } from '../types';

interface ResultDisplayProps {
  result: GenerationResult | null;
  onRegenerate: () => void;
  isNewGeneration: boolean;
}

const TypewrittenText: React.FC<{ text: string; speed?: number; active: boolean }> = ({ 
  text, 
  speed = 3, 
  active 
}) => {
  const [displayedText, setDisplayedText] = useState(active ? '' : text);

  useEffect(() => {
    if (!active) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, active]);

  return <span className="whitespace-pre-line">{displayedText}</span>;
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  result, 
  onRegenerate, 
  isNewGeneration 
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!result) {
    return (
      <div className="saas-card p-12 flex flex-col items-center justify-center text-center min-h-[420px] border-dashed border-zinc-700/40">
        <div className="w-14 h-14 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center text-muted-foreground mb-4">
          <FileText className="w-6 h-6 opacity-60 text-zinc-500" />
        </div>
        <h3 className="text-md font-bold mb-2">Aucune fiche produit</h3>
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
          Saisissez les caractéristiques de votre produit à gauche pour lancer la rédaction automatisée optimisée pour le e-commerce.
        </p>
      </div>
    );
  }

  const { title, shortDescription, longDescription, benefits, cta, seoMeta } = result;

  const getMarkdownContent = () => {
    return `# ${title}

## Description Courte
${shortDescription}

## Description Longue
${longDescription}

## Avantages Principaux
${benefits.map((b) => `- ${b}`).join('\n')}

## Call To Action
**${cta}**

---
## Métadonnées SEO
- **Meta Description** : ${seoMeta}
`;
  };

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(getMarkdownContent());
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExport = () => {
    const markdown = getMarkdownContent();
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `${result.input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-fiche-produit.md`;
    
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Barre d'action supérieure */}
      <div className="saas-card p-3 flex flex-wrap items-center justify-between gap-3 bg-zinc-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2 pl-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Fiche Rédigée</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerate}
            className="btn-saas btn-saas-secondary py-1.5 px-3 text-xs"
            title="Régénérer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Régénérer
          </button>
          
          <button
            onClick={handleExport}
            className="btn-saas btn-saas-secondary py-1.5 px-3 text-xs"
            title="Exporter en Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            Exporter .MD
          </button>
          
          <button
            onClick={handleCopyAll}
            className="btn-saas btn-saas-primary py-1.5 px-4 text-xs"
            title="Copier toute la fiche"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-inverse" />
                Copié !
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-inverse" />
                Copier tout
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grille de fiches produits */}
      <div className="bento-grid">
        {/* 1. Titre Produit */}
        <div className="saas-card bento-col-2 animate-slide-up">
          <div className="result-card-header">
            <span className="result-card-title">
              <Heading className="w-4 h-4" />
              Titre du Produit
            </span>
            <button
              onClick={() => handleCopy(title, 'title')}
              className="result-copy-btn"
              title="Copier le titre"
            >
              {copiedSection === 'title' ? (
                <>
                  <Check className="w-3 h-3 text-[#FF6B00]" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copier
                </>
              )}
            </button>
          </div>
          <h3 className="text-md font-bold text-foreground">
            <TypewrittenText text={title} active={isNewGeneration} />
          </h3>
        </div>

        {/* 2. Description Courte */}
        <div className="saas-card bento-col-2 animate-slide-up delay-100">
          <div className="result-card-header">
            <span className="result-card-title">
              <TextQuote className="w-4 h-4" />
              Description Courte
            </span>
            <button
              onClick={() => handleCopy(shortDescription, 'short')}
              className="result-copy-btn"
              title="Copier la description courte"
            >
              {copiedSection === 'short' ? (
                <>
                  <Check className="w-3 h-3 text-[#FF6B00]" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copier
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            <TypewrittenText text={shortDescription} active={isNewGeneration} />
          </p>
        </div>

        {/* 3. Description Longue */}
        <div className="saas-card bento-col-2 animate-slide-up delay-150">
          <div className="result-card-header">
            <span className="result-card-title">
              <AlignLeft className="w-4 h-4" />
              Description Longue
            </span>
            <button
              onClick={() => handleCopy(longDescription, 'long')}
              className="result-copy-btn"
              title="Copier la description longue"
            >
              {copiedSection === 'long' ? (
                <>
                  <Check className="w-3 h-3 text-[#FF6B00]" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copier
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            <TypewrittenText text={longDescription} active={isNewGeneration} />
          </p>
        </div>

        {/* 4. Avantages */}
        <div className="saas-card bento-row-2 animate-slide-up delay-200">
          <div className="result-card-header">
            <span className="result-card-title">
              <ListChecks className="w-4 h-4" />
              5 Avantages Clés
            </span>
            <button
              onClick={() => handleCopy(benefits.join('\n'), 'benefits')}
              className="result-copy-btn"
              title="Copier les avantages"
            >
              {copiedSection === 'benefits' ? (
                <>
                  <Check className="w-3 h-3 text-[#FF6B00]" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copier
                </>
              )}
            </button>
          </div>
          <ul className="space-y-3">
            {benefits.map((benefit, idx) => {
              const [titleText, descText] = benefit.includes(':') 
                ? benefit.split(':', 2) 
                : [benefit, ''];

              return (
                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-orange-500/10 flex items-center justify-center text-[#FF6B00] shrink-0 mt-0.5 border border-orange-500/10">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed">
                    {descText ? (
                      <>
                        <strong className="text-foreground font-semibold">
                          <TypewrittenText text={titleText.trim() + ' : '} active={isNewGeneration} />
                        </strong>
                        <TypewrittenText text={descText.trim()} active={isNewGeneration} />
                      </>
                    ) : (
                      <TypewrittenText text={benefit} active={isNewGeneration} />
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 5. Call To Action */}
        <div className="saas-card animate-slide-up delay-250 flex items-center justify-between">
          <div className="space-y-1">
            <span className="result-card-title mb-0.5">
              <MousePointerClick className="w-4 h-4" />
              Appel à l'Action (CTA)
            </span>
            <div className="text-foreground font-bold text-sm">
              <TypewrittenText text={cta} active={isNewGeneration} />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(cta, 'cta')}
              className="result-copy-btn py-1.5 px-3 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs"
            >
              {copiedSection === 'cta' ? (
                <>
                  <Check className="w-3 h-3 text-[#FF6B00]" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copier
                </>
              )}
            </button>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-[#FF6B00] flex items-center justify-center border border-orange-500/10">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 6. SEO Meta Description */}
        <div className="saas-card bento-col-3 bento-seo-card animate-slide-up delay-300">
          <div className="result-card-header">
            <span className="result-card-title">
              <Globe className="w-4 h-4" />
              Balise Meta Description (SEO)
            </span>
            <button
              onClick={() => handleCopy(seoMeta, 'seo')}
              className="result-copy-btn"
              title="Copier la meta description"
            >
              {copiedSection === 'seo' ? (
                <>
                  <Check className="w-3 h-3 text-[#FF6B00]" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copier
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground italic leading-relaxed border-l border-orange-500/30 pl-3">
            <TypewrittenText text={seoMeta} active={isNewGeneration} />
          </p>
          <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground font-medium">
            <span>{seoMeta.length} caractères</span>
            <span className="text-[#FF6B00] font-semibold">Conseillé : &lt; 160</span>
          </div>
        </div>
      </div>
    </div>
  );
};
