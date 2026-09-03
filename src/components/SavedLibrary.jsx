import React, { useRef } from 'react';
import { exportAllItemsToJSON, importItemsFromJSON } from '../utils/storage';

export function SavedLibrary({ items, onLoadItem, onDeleteItem, onRefreshItems }) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result;
        if (typeof content === 'string') {
          const res = importItemsFromJSON(content);
          if (res.success) {
            alert(`Successfully imported ${res.count} preset(s)!`);
            onRefreshItems();
          } else {
            alert(`Import failed: ${res.error}`);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div
      style={{
        background: 'var(--panel-bg)',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid var(--panel-border)',
        boxShadow: 'var(--hud-glow)',
        marginBottom: '2rem',
        position: 'relative'
      }}
      id="saved-presets-library"
    >
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          left: '15px',
          background: 'var(--bg-dark)',
          color: 'var(--accent-cyan)',
          fontSize: '0.75rem',
          padding: '0 8px',
          letterSpacing: '1.5px',
          border: '1px solid var(--accent-cyan)'
        }}
      >
        /// SAVED_PRESETS_DATABASE
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <h2
          style={{
            margin: 0,
            color: 'var(--accent-cyan)',
            fontFamily: "'Teko', sans-serif",
            fontSize: '1.8rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase'
          }}
        >
          💾 Internal Saved Presets Library ({items.length})
        </h2>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={handleImportClick}
            style={{
              padding: '0.4rem 0.8rem',
              background: '#1e293b',
              color: '#00f0ff',
              border: '1px solid #00f0ff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            📂 Import JSON Config
          </button>

          <button
            type="button"
            onClick={() => exportAllItemsToJSON(items)}
            disabled={items.length === 0}
            style={{
              padding: '0.4rem 0.8rem',
              background: items.length === 0 ? '#334155' : '#00f0ff',
              color: items.length === 0 ? '#9ca3af' : '#0a0e17',
              border: 'none',
              borderRadius: '4px',
              cursor: items.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            📥 Export All Presets (JSON)
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', background: '#0a0e17', borderRadius: '6px', border: '1px dashed #1f293d', color: 'var(--text-muted)' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>No saved presets found in browser storage.</p>
          <span style={{ fontSize: '0.85rem' }}>Save tokens or unit trackers from below, or import a `.json` configuration file to get started!</span>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
            maxHeight: '360px',
            overflowY: 'auto',
            paddingRight: '0.3rem'
          }}
        >
          {items.map((item) => {
            const isToken = item.type === 'token';
            const categoryLabel = isToken
              ? item.category === 'misc'
                ? 'Misc Token'
                : item.category === 'naval'
                ? 'Naval Unit'
                : 'Land Unit'
              : 'Army Tracker';

            const badgeColor = isToken ? '#3b82f6' : '#10b981';

            return (
              <div
                key={item.id}
                style={{
                  background: '#0a0e17',
                  border: '1px solid #1f293d',
                  borderRadius: '6px',
                  padding: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  gap: '0.6rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <span
                      style={{
                        background: badgeColor,
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {categoryLabel}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{formatDate(item.updatedAt)}</span>
                  </div>

                  <h3
                    style={{
                      margin: '0 0 0.3rem 0',
                      color: '#ffffff',
                      fontSize: '1.1rem',
                      fontFamily: "'Share Tech Mono', monospace",
                      wordBreak: 'break-word'
                    }}
                  >
                    {item.name}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.4rem', borderTop: '1px dashed #1f293d' }}>
                  <button
                    type="button"
                    onClick={() => onLoadItem(item)}
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.6rem',
                      background: 'rgba(0, 240, 255, 0.15)',
                      color: '#00f0ff',
                      border: '1px solid #00f0ff',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.8rem'
                    }}
                  >
                    ⚡ Load Preset
                  </button>

                  <button
                    type="button"
                    onClick={() => exportAllItemsToJSON([item], `${item.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_config.json`)}
                    title="Export single preset to JSON file"
                    style={{
                      padding: '0.35rem 0.5rem',
                      background: '#1e293b',
                      color: '#cbd5e1',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    💾 JSON
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                        onDeleteItem(item.id);
                      }
                    }}
                    title="Delete Preset"
                    style={{
                      padding: '0.35rem 0.5rem',
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
