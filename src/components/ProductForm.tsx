import React, { useState } from 'react';
import { Sparkles, Tag, Users, Type } from 'lucide-react';
import type { ProductInput, ToneOption } from '../types';

interface ProductFormProps {
  onSubmit: (input: ProductInput) => void;
  isLoading: boolean;
  initialInput?: ProductInput | null;
}

const CATEGORY_SUGGESTIONS = [
  'High-Tech',
  'Mode & Voyage',
  'Maison & Déco',
  'Beauté & Santé',
  'Gastronomie'
];

const TARGET_SUGGESTIONS = [
  'Jeunes adultes',
  'Randonneurs',
  'Professionnels',
  'Familles actives',
  'Passionnés de design'
];

const TONE_OPTIONS: { value: ToneOption; title: string; desc: string }[] = [
  { value: 'commercial', title: 'Commercial / Vente', desc: 'Accrocheur, persuasif, axé conversion.' },
  { value: 'professional', title: 'Professionnel / Tech', desc: 'Précis, factuel, inspire la confiance.' },
  { value: 'luxury', title: 'Luxe / Haut de Gamme', desc: 'Raffiné, sélectif, axé prestige.' },
  { value: 'dynamic', title: 'Dynamique / Moderne', desc: 'Frais, percutant, direct.' }
];

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, isLoading, initialInput }) => {
  const [name, setName] = useState(initialInput?.name || '');
  const [category, setCategory] = useState(initialInput?.category || '');
  const [targetAudience, setTargetAudience] = useState(initialInput?.targetAudience || '');
  const [tone, setTone] = useState<ToneOption>(initialInput?.tone || 'commercial');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim() || !targetAudience.trim()) return;
    
    onSubmit({
      name: name.trim(),
      category: category.trim(),
      targetAudience: targetAudience.trim(),
      tone
    });
  };

  return (
    <div className="saas-card">
      <h2 className="text-md font-bold mb-5 flex items-center gap-2 text-foreground">
        <Sparkles className="w-4.5 h-4.5 text-[#FF6B00]" />
        Configuration du Produit
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nom du produit */}
        <div className="form-group">
          <label htmlFor="productName" className="form-label">
            Nom du Produit
          </label>
          <div className="input-container">
            <Type className="input-icon" />
            <input
              id="productName"
              type="text"
              required
              disabled={isLoading}
              placeholder="ex: Sac à dos imperméable Pro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-premium"
            />
          </div>
        </div>

        {/* Catégorie */}
        <div className="form-group">
          <label htmlFor="productCategory" className="form-label">
            Catégorie
          </label>
          <div className="input-container">
            <Tag className="input-icon" />
            <input
              id="productCategory"
              type="text"
              required
              disabled={isLoading}
              placeholder="ex: Accessoires de Voyage, Mode..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-premium"
            />
          </div>
          <div className="chip-container">
            {CATEGORY_SUGGESTIONS.map((cat) => (
              <button
                key={cat}
                type="button"
                disabled={isLoading}
                onClick={() => setCategory(cat)}
                className="chip-button"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Public cible */}
        <div className="form-group">
          <label htmlFor="targetAudience" className="form-label">
            Public Cible
          </label>
          <div className="input-container">
            <Users className="input-icon" />
            <input
              id="targetAudience"
              type="text"
              required
              disabled={isLoading}
              placeholder="ex: Randonneurs, Citadins actifs..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="input-premium"
            />
          </div>
          <div className="chip-container">
            {TARGET_SUGGESTIONS.map((target) => (
              <button
                key={target}
                type="button"
                disabled={isLoading}
                onClick={() => setTargetAudience(target)}
                className="chip-button"
              >
                {target}
              </button>
            ))}
          </div>
        </div>

        {/* Ton du texte */}
        <div className="form-group">
          <label className="form-label">Ton de Rédaction</label>
          <div className="tone-grid">
            {TONE_OPTIONS.map((option) => (
              <div
                key={option.value}
                onClick={() => !isLoading && setTone(option.value)}
                className={`tone-card-premium ${tone === option.value ? 'selected' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="tone-title">{option.title}</span>
                <span className="tone-desc">{option.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !name.trim() || !category.trim() || !targetAudience.trim()}
          className="btn-saas btn-saas-primary py-3.5 mt-2"
        >
          <Sparkles className="w-4.5 h-4.5 text-inverse" />
          {isLoading ? 'Rédaction par l\'IA...' : 'Générer la Fiche Produit'}
        </button>
      </form>
    </div>
  );
};
