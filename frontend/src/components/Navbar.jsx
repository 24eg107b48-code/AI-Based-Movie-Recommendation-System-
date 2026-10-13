import React from 'react';
import { Film, Sparkles, Search, User, LogIn, Heart } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  watchlistCount,
}) {
  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => setActiveTab('discover')}>
        <div className="brand-icon">
          <Film size={28} />
        </div>
        <span>CineAI</span>
        <span className="brand-badge">AI Recommendations</span>
      </div>

      <nav className="nav-links">
        <button
          className={`nav-link ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          Discover
        </button>
        <button
          className={`nav-link ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} color="#38bdf8" /> AI Picks
          </span>
        </button>
        <button
          className={`nav-link ${activeTab === 'top-rated' ? 'active' : ''}`}
          onClick={() => setActiveTab('top-rated')}
        >
          Top Rated
        </button>
        <button
          className={`nav-link ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          Trending
        </button>
        <button
          className={`nav-link ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Heart size={14} color="#f43f5e" /> Watchlist ({watchlistCount})
          </span>
        </button>
      </nav>

      <div className="nav-actions">
        <div className="search-box">
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search title, genre, director..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ color: '#94a3b8', fontSize: '0.8rem' }}
            >
              ✕
            </button>
          )}
        </div>

        {currentUser ? (
          <button className="user-profile-btn" onClick={onOpenProfile}>
            <div className="user-avatar">
              {currentUser.username ? currentUser.username[0].toUpperCase() : 'U'}
            </div>
            <span>{currentUser.fullName || currentUser.username}</span>
          </button>
        ) : (
          <button className="btn-primary" onClick={onOpenAuth}>
            <LogIn size={16} /> Sign In
          </button>
        )}
      </div>
    </header>
  );
}
