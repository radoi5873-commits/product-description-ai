import React from 'react';
import { Settings, Sun, Moon, Sparkles, LayoutDashboard, History, Activity } from 'lucide-react';

interface TopBarProps {
  activeTab: 'dashboard' | 'generator' | 'history';
  setActiveTab: (tab: 'dashboard' | 'generator' | 'history') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onSettingsClick: () => void;
  provider: 'openai' | 'gemini';
  apiConfigured: boolean;
  historyCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  onSettingsClick,
  provider,
  apiConfigured,
  historyCount,
}) => {
  return (
    <header className="navbar-premium">
      <div className="navbar-inner-premium">
        {/* Left Side: Logo */}
        <div className="navbar-brand-premium" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon-container">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="logo-text-premium">
            Product Description <span className="logo-accent-premium">AI</span>
          </span>
          <span className="logo-badge-premium">PRO</span>
        </div>

        {/* Center: Main Navigation Tabs */}
        <nav className="nav-tabs-premium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`nav-tab-link-premium ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="nav-tab-label">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`nav-tab-link-premium ${activeTab === 'generator' ? 'active' : ''}`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="nav-tab-label">Générateur</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`nav-tab-link-premium ${activeTab === 'history' ? 'active' : ''}`}
          >
            <History className="w-4 h-4" />
            <span className="nav-tab-label">Historique</span>
            {historyCount > 0 && (
              <span className="nav-counter-badge">{historyCount}</span>
            )}
          </button>
        </nav>

        {/* Right Side: Actions & Profile */}
        <div className="navbar-actions-premium">
          {/* Status Badge */}
          <div className="status-pill-premium">
            <Activity className={`w-3.5 h-3.5 ${apiConfigured ? 'status-active' : 'status-local'}`} />
            <span className="status-label-premium">
              {apiConfigured
                ? (provider === 'openai' ? 'OpenAI GPT-4o' : 'Gemini 2.0 Flash')
                : 'Non configuré'}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="navbar-action-btn-premium"
            title={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onSettingsClick}
            className="navbar-action-btn-premium"
            title="Paramètres de l'API"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Widget */}
          <div className="user-profile-widget-premium">
            <div className="user-avatar-premium">
              <span>AC</span>
              <span className="user-online-indicator"></span>
            </div>
            <div className="user-info-premium">
              <span className="user-name-premium">Ayena Conrad</span>
              <span className="user-plan-premium">Plan Premium</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
