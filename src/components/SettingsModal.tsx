import { useState } from 'react';
import { X, Eye, EyeOff, Key, ExternalLink, HelpCircle, Sparkles } from 'lucide-react';
import type { AppSettings, ProviderOption } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [provider, setProvider] = useState<ProviderOption>(settings.provider || 'openai');
  const [openaiApiKey, setOpenaiApiKey] = useState(settings.openaiApiKey || '');
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');
  
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      provider,
      openaiApiKey: openaiApiKey.trim(),
      geminiApiKey: geminiApiKey.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay de flou d'arrière-plan */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Conteneur de la modale */}
      <div className="glass-container w-full max-w-md p-6 relative z-10 animate-fade-in shadow-2xl border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-[#FF6B00]">
            <Key className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Configuration des API</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sélection du fournisseur */}
          <div>
            <label className="form-label mb-2 block">Fournisseur d'IA actif</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                  provider === 'openai'
                    ? 'bg-orange-500/10 border-[#FF6B00] text-foreground'
                    : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                }`}
              >
                <Sparkles className={`w-4.5 h-4.5 ${provider === 'openai' ? 'text-[#FF6B00]' : ''}`} />
                <span className="text-xs font-bold">OpenAI (GPT-4o)</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                  provider === 'gemini'
                    ? 'bg-orange-500/10 border-[#FF6B00] text-foreground'
                    : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                }`}
              >
                <Sparkles className={`w-4.5 h-4.5 ${provider === 'gemini' ? 'text-[#FF6B00]' : ''}`} />
                <span className="text-xs font-bold">Google Gemini</span>
              </button>
            </div>
          </div>

          {/* Clé API OpenAI */}
          <div className={provider === 'openai' ? 'block animate-fade-in' : 'hidden'}>
            <label htmlFor="openaiKey" className="form-label flex items-center justify-between mb-1.5">
              <span>Clé API OpenAI</span>
              <span className="text-[10px] text-orange-500 font-semibold px-2 py-0.5 rounded bg-orange-500/10 uppercase">
                {openaiApiKey ? 'Configurée' : 'Requise'}
              </span>
            </label>
            <div className="relative">
              <input
                id="openaiKey"
                type={showOpenaiKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title={showOpenaiKey ? "Masquer la clé" : "Afficher la clé"}
              >
                {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Clé API Gemini */}
          <div className={provider === 'gemini' ? 'block animate-fade-in' : 'hidden'}>
            <label htmlFor="geminiKey" className="form-label flex items-center justify-between mb-1.5">
              <span>Clé API Google Gemini</span>
              <span className="text-[10px] text-orange-500 font-semibold px-2 py-0.5 rounded bg-orange-500/10 uppercase">
                {geminiApiKey ? 'Configurée' : 'Requise'}
              </span>
            </label>
            <div className="relative">
              <input
                id="geminiKey"
                type={showGeminiKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title={showGeminiKey ? "Masquer la clé" : "Afficher la clé"}
              >
                {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Instructions d'obtention de la clé */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <h3 className="text-xs font-bold flex items-center gap-1.5 text-foreground">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF6B00]" />
              Comment obtenir votre clé API ?
            </h3>
            {provider === 'openai' ? (
              <div className="space-y-2">
                <ol className="text-xs text-muted-foreground list-decimal list-inside space-y-1">
                  <li>Rendez-vous sur la <span className="text-foreground">plateforme OpenAI</span>.</li>
                  <li>Connectez-vous ou créez un compte utilisateur.</li>
                  <li>Allez dans <span className="font-medium text-foreground">"API Keys"</span> et créez une nouvelle clé secrète.</li>
                </ol>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF6B00] hover:text-[#FF8C39] transition-colors"
                >
                  Aller sur OpenAI Platform
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                <ol className="text-xs text-muted-foreground list-decimal list-inside space-y-1">
                  <li>Rendez-vous sur <span className="text-foreground">Google AI Studio</span>.</li>
                  <li>Connectez-vous avec votre compte Google.</li>
                  <li>Cliquez sur <span className="font-medium text-foreground">"Get API key"</span> puis créez une clé.</li>
                </ol>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF6B00] hover:text-[#FF8C39] transition-colors"
                >
                  Aller sur Google AI Studio
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary py-2.5 px-4"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary py-2.5 px-5"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
