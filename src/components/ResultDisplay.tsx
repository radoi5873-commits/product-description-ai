import React, { useState, useEffect } from 'react';
import { 
  Copy, Check, Download, RotateCcw, 
  CheckCircle2, ArrowRight, Globe, FileText,
  Heading, AlignLeft, ListChecks, MousePointerClick, Sparkles,
  Share2, Loader2, AlertCircle
} from 'lucide-react';
import type { GenerationResult, AppSettings } from '../types';

interface ResultDisplayProps {
  result: GenerationResult | null;
  onRegenerate: () => void;
  isNewGeneration: boolean;
  settings?: AppSettings;
}

// 1. Machine à écrire animée
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

// 2. Composant Carte Individuel Glassmorphism Premium
interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  textToCopy: string;
  className?: string;
  delayClass?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  icon,
  content,
  textToCopy,
  className = '',
  delayClass = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`result-glass-card ${className} ${delayClass}`}>
      <div className="result-card-header-premium">
        <span className="result-card-title-premium">
          <div className="card-icon-wrapper-premium">
            {icon}
          </div>
          {title}
        </span>
        <button
          onClick={handleCopy}
          className={`card-copy-btn-premium ${copied ? 'copied' : ''}`}
          title={`Copier ${title}`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>
      <div className="result-card-body-premium">
        {content}
      </div>
    </div>
  );
};

// 3. Rendu Principal des Résultats
export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  result, 
  onRegenerate, 
  isNewGeneration,
  settings
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [publishing, setPublishing] = useState<'shopify' | 'woocommerce' | null>(null);
  const [publishStatus, setPublishStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const handlePublishShopify = async () => {
    if (!settings?.shopifyShopUrl || !settings?.shopifyAccessToken) {
      setPublishStatus({
        type: 'error',
        message: "Les identifiants Shopify ne sont pas configurés dans les paramètres."
      });
      return;
    }

    setPublishing('shopify');
    setPublishStatus(null);

    const shopUrl = settings.shopifyShopUrl.replace(/^(https?:\/\/)?/, 'https://').replace(/\/$/, '');
    const endpoint = `${shopUrl}/admin/api/2023-10/products.json`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': settings.shopifyAccessToken
        },
        body: JSON.stringify({
          product: {
            title: title,
            body_html: `<p>${shortDescription}</p><h3>Avantages</h3><ul>${benefits.map(b => `<li>${b}</li>`).join('')}</ul><h3>Description</h3><p>${longDescription}</p><p><strong>Appel à l'action:</strong> ${cta}</p>`,
            product_type: result.input.category,
            status: 'draft'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Shopify HTTP ${response.status}`);
      }

      setPublishStatus({
        type: 'success',
        message: "Produit exporté avec succès comme brouillon sur Shopify !"
      });
    } catch (err: any) {
      console.error(err);
      
      // Fallback: Download JSON
      const shopifyJson = {
        product: {
          title: title,
          body_html: `<p>${shortDescription}</p><h3>Avantages</h3><ul>${benefits.map(b => `<li>${b}</li>`).join('')}</ul><h3>Description</h3><p>${longDescription}</p>`,
          product_type: result.input.category,
          status: 'draft'
        }
      };
      const blob = new Blob([JSON.stringify(shopifyJson, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${result.input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-shopify.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setPublishStatus({
        type: 'error',
        message: "CORS bloqué : Shopify rejette les appels direct du navigateur. Le fichier JSON Shopify a été téléchargé pour importation manuelle."
      });
    } finally {
      setPublishing(null);
    }
  };

  const handlePublishWoo = async () => {
    if (!settings?.wooUrl || !settings?.wooConsumerKey || !settings?.wooConsumerSecret) {
      setPublishStatus({
        type: 'error',
        message: "Les identifiants WooCommerce ne sont pas configurés dans les paramètres."
      });
      return;
    }

    setPublishing('woocommerce');
    setPublishStatus(null);

    const wooUrlBase = settings.wooUrl.replace(/^(https?:\/\/)?/, 'https://').replace(/\/$/, '');
    const endpoint = `${wooUrlBase}/wp-json/wc/v3/products?consumer_key=${settings.wooConsumerKey}&consumer_secret=${settings.wooConsumerSecret}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: title,
          type: 'simple',
          description: `<p>${longDescription}</p><h3>Avantages</h3><ul>${benefits.map(b => `<li>${b}</li>`).join('')}</ul>`,
          short_description: shortDescription,
          categories: [{ name: result.input.category }],
          status: 'draft'
        })
      });

      if (!response.ok) {
        throw new Error(`WooCommerce HTTP ${response.status}`);
      }

      setPublishStatus({
        type: 'success',
        message: "Produit exporté avec succès comme brouillon sur WooCommerce !"
      });
    } catch (err: any) {
      console.error(err);

      // Fallback: Download JSON
      const wooJson = {
        name: title,
        type: 'simple',
        description: longDescription,
        short_description: shortDescription,
        status: 'draft'
      };
      const blob = new Blob([JSON.stringify(wooJson, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${result.input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-woocommerce.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setPublishStatus({
        type: 'error',
        message: "CORS bloqué : WooCommerce rejette les appels direct du navigateur. Le fichier JSON WooCommerce a été téléchargé pour importation manuelle."
      });
    } finally {
      setPublishing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Status Banner */}
      {publishStatus && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-semibold ${
          publishStatus.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400' 
            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-400'
        }`}>
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <div className="flex-1">
            {publishStatus.message}
          </div>
          <button 
            onClick={() => setPublishStatus(null)} 
            className="text-[10px] uppercase font-bold tracking-wider hover:opacity-75"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Barre d'action supérieure */}
      <div className="saas-card p-3 flex flex-wrap items-center justify-between gap-3 bg-zinc-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2 pl-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Fiche Rédigée</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRegenerate}
            className="btn-saas btn-saas-secondary py-1.5 px-3 text-xs"
            style={{ width: 'auto' }}
            title="Régénérer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Régénérer
          </button>
          
          <button
            onClick={handleExport}
            className="btn-saas btn-saas-secondary py-1.5 px-3 text-xs"
            style={{ width: 'auto' }}
            title="Exporter en Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            Exporter .MD
          </button>

          {/* Shopify Publish Button */}
          {settings?.shopifyActive && (
            <button
              onClick={handlePublishShopify}
              disabled={publishing !== null}
              className="btn-saas btn-saas-secondary py-1.5 px-3 text-xs inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 border-emerald-250/50 dark:border-emerald-900/30 hover:bg-emerald-50/20"
              style={{ width: 'auto' }}
              title="Exporter vers Shopify"
            >
              {publishing === 'shopify' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              Shopify
            </button>
          )}

          {/* WooCommerce Publish Button */}
          {settings?.wooActive && (
            <button
              onClick={handlePublishWoo}
              disabled={publishing !== null}
              className="btn-saas btn-saas-secondary py-1.5 px-3 text-xs inline-flex items-center gap-1.5 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/30 hover:bg-purple-50/20"
              style={{ width: 'auto' }}
              title="Exporter vers WooCommerce"
            >
              {publishing === 'woocommerce' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              WooCommerce
            </button>
          )}
          
          <button
            onClick={handleCopyAll}
            className={`btn-saas ${copiedAll ? 'btn-saas-secondary copied' : 'btn-saas-primary'} py-1.5 px-4 text-xs`}
            style={{ width: 'auto', backgroundColor: copiedAll ? 'rgba(16, 185, 129, 0.08)' : '', borderColor: copiedAll ? 'rgba(16, 185, 129, 0.2)' : '' }}
            title="Copier toute la fiche"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10b981]" />
                <span style={{ color: '#10b981' }}>Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-inverse" />
                <span>Copier tout</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grille flexible de fiches produits */}
      <div className="results-grid-premium">
        
        {/* 1. Titre Produit */}
        <ResultCard
          title="Titre du Produit"
          icon={<Heading className="w-4 h-4" />}
          textToCopy={title}
          className="results-full-width"
          delayClass="delay-100"
          content={
            <h3 className="result-card-content-title">
              <TypewrittenText text={title} active={isNewGeneration} />
            </h3>
          }
        />

        {/* 2. Description Courte */}
        <ResultCard
          title="Description Courte"
          icon={<Sparkles className="w-4 h-4" />}
          textToCopy={shortDescription}
          className="results-full-width"
          delayClass="delay-150"
          content={
            <p className="result-card-content-short">
              <TypewrittenText text={shortDescription} active={isNewGeneration} />
            </p>
          }
        />

        {/* 3. Description Longue */}
        <ResultCard
          title="Description Longue"
          icon={<AlignLeft className="w-4 h-4" />}
          textToCopy={longDescription}
          className="results-full-width"
          delayClass="delay-200"
          content={
            <p className="result-card-content-long">
              <TypewrittenText text={longDescription} active={isNewGeneration} />
            </p>
          }
        />

        {/* 4. Avantages */}
        <ResultCard
          title="Avantages Clés"
          icon={<ListChecks className="w-4 h-4" />}
          textToCopy={benefits.join('\n')}
          className="results-full-width"
          delayClass="delay-250"
          content={
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
          }
        />

        {/* 5. Appel à l'Action */}
        <ResultCard
          title="Appel à l'Action (CTA)"
          icon={<MousePointerClick className="w-4 h-4" />}
          textToCopy={cta}
          delayClass="delay-300"
          content={
            <div className="result-card-content-cta">
              <TypewrittenText text={cta} active={isNewGeneration} />
              <ArrowRight className="w-4 h-4 text-[#FF6B00]" />
            </div>
          }
        />

        {/* 6. Meta Description SEO */}
        <ResultCard
          title="Meta Description SEO"
          icon={<Globe className="w-4 h-4" />}
          textToCopy={seoMeta}
          delayClass="delay-350"
          content={
            <div>
              <p className="result-card-content-seo">
                <TypewrittenText text={seoMeta} active={isNewGeneration} />
              </p>
              <div className="result-card-footer-seo">
                <span>{seoMeta.length} caractères</span>
                <span className={seoMeta.length > 160 ? 'seo-char-count-alert' : ''}>
                  Conseillé : &lt; 160
                </span>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};
