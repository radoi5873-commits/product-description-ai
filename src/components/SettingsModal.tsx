import { useState } from 'react';
import { X, Eye, EyeOff, Key, ExternalLink, HelpCircle } from 'lucide-react';
import type { AppSettings } from '../types';

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
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ apiKey: apiKey.trim() });
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
          <h2 className="text-xl font-bold text-foreground">Configuration de l'API</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="apiKey" className="form-label flex items-center justify-between">
              <span>Clé API Gemini (Optionnel)</span>
              <span className="text-[10px] text-orange-500 font-semibold px-2 py-0.5 rounded bg-orange-500/10 uppercase">
                {apiKey ? 'Configurée' : 'Mode Démo Local'}
              </span>
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title={showKey ? "Masquer la clé" : "Afficher la clé"}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              Si aucune clé n'est fournie, l'application utilisera le générateur de templates intelligent local en français pour simuler la création.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <h3 className="text-xs font-bold flex items-center gap-1.5 text-foreground">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF6B00]" />
              Comment obtenir une clé API gratuite ?
            </h3>
            <ol className="text-xs text-muted-foreground list-decimal list-inside space-y-1">
              <li>Rendez-vous sur <span className="text-foreground">Google AI Studio</span>.</li>
              <li>Connectez-vous avec votre compte Google.</li>
              <li>Cliquez sur <span className="font-medium text-foreground">"Get API key"</span> puis créez une clé.</li>
              <li>Collez la clé ci-dessus et enregistrez.</li>
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
