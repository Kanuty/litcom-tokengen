import React, { useState, useRef } from 'react';
import { exportAllItemsToJSON, importItemsFromJSON } from '../utils/storage';

export function SavedLibrary({ items, onLoadItem, onDeleteItem, onUpdateItemName, onRefreshItems, showNotification, confirmAction }) {
  const fileInputRef = useRef(null);

  // States for user features
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');

  // Filtering & Sorting states
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'token' | 'tracker' | 'card'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc'); // 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc'

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
            showNotification({
              title: 'SUCCESS',
              message: `Successfully imported ${res.count} preset(s) into database!`,
              type: 'info'
            });
            onRefreshItems();
          } else {
            showNotification({
              title: 'IMPORT ERROR',
              message: res.error || 'Failed to import JSON configuration file.',
              type: 'danger'
            });
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditNameValue(item.name);
  };

  const handleSaveEdit = (id) => {
    if (editNameValue.trim()) {
      onUpdateItemName(id, editNameValue.trim());
      showNotification({
        title: 'PRESET UPDATED',
        message: `Preset name changed to "${editNameValue.trim()}".`,
        type: 'info'
      });
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
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

  // Filter and sort items
  let processedItems = items.filter((item) => {
    if (typeFilter === 'token' && item.type !== 'token') return false;
    if (typeFilter === 'tracker' && item.type !== 'tracker') return false;
    if (typeFilter === 'card' && item.type !== 'card') return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(query);
      const matchCategory = (item.category || '').toLowerCase().includes(query);
      if (!matchName && !matchCategory) return false;
    }
    return true;
  });

  processedItems.sort((a, b) => {
    if (sortBy === 'date_desc') {
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    }
    if (sortBy === 'date_asc') {
      return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
    }
    if (sortBy === 'name_asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name_desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  return (
    <div
      style={{
        background: 'var(--panel-bg)',
        padding: '1.25rem',
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
          background: 'var(--panel-bg)',
          color: 'var(--accent-cyan)',
          fontSize: '0.75rem',
          padding: '0 8px',
          letterSpacing: '1.5px',
          border: '1px solid var(--accent-cyan)'
        }}
      >
        /// SAVED_PRESETS_DATABASE
      </div>

      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
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
            💾 Internal Saved Presets ({items.length})
          </h2>

          {items.length > 0 && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                padding: '0.3rem 0.6rem',
                background: 'var(--card-dice-bg)',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--panel-border)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 'bold'
              }}
            >
              {isCollapsed ? `▼ Expand All (${items.length})` : `▲ Collapse (1 Row)`}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
              background: 'var(--card-dice-bg)',
              color: 'var(--accent-cyan)',
              border: '1px solid var(--accent-cyan)',
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
            onClick={() => {
              exportAllItemsToJSON(items);
              showNotification({
                title: 'CONFIG EXPORTED',
                message: `Exported ${items.length} saved preset(s) into JSON file.`,
                type: 'info'
              });
            }}
            disabled={items.length === 0}
            style={{
              padding: '0.4rem 0.8rem',
              background: items.length === 0 ? 'var(--card-colors-bg)' : 'var(--accent-cyan)',
              color: items.length === 0 ? 'var(--text-muted)' : 'var(--bg-dark)',
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

      {/* Filter & Search Bar */}
      {items.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '0.8rem',
            alignItems: 'center',
            marginBottom: '0.8rem',
            background: 'var(--card-dice-bg)',
            padding: '0.5rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid var(--panel-border)',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Filter:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}
            >
              <option value="all">All Presets ({items.length})</option>
              <option value="token">Tokens Only</option>
              <option value="tracker">Army Trackers Only</option>
              <option value="card">Capability Cards Only</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, minWidth: '180px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Search:</span>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '0.3rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}
            >
              <option value="date_desc">Date (Newest First)</option>
              <option value="date_asc">Date (Oldest First)</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.2rem', background: 'var(--card-dice-bg)', borderRadius: '6px', border: '1px dashed var(--panel-border)', color: 'var(--text-muted)' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>No saved presets found in browser storage.</p>
          <span style={{ fontSize: '0.82rem' }}>Save tokens, unit trackers, or capability cards from below, or import a `.json` configuration file to get started!</span>
        </div>
      ) : processedItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--card-dice-bg)', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No presets match the selected filter/search query.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '0.8rem',
            maxHeight: isCollapsed ? '108px' : '380px',
            overflow: isCollapsed ? 'hidden' : 'auto',
            paddingRight: '0.3rem',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          {processedItems.map((item) => {
            const isToken = item.type === 'token';
            const isCard = item.type === 'card';
            const categoryLabel = isToken
              ? item.category === 'misc'
                ? 'Misc Token'
                : item.category === 'naval'
                ? 'Naval Unit'
                : 'Land Unit'
              : isCard
              ? 'Capability Card'
              : 'Army Tracker';

            const badgeColor = isToken ? '#3b82f6' : isCard ? '#8b5cf6' : '#10b981';
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--card-colors-bg)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '6px',
                  padding: '0.65rem 0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  gap: '0.5rem',
                  height: '100px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                    <span
                      style={{
                        background: badgeColor,
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 'bold',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {categoryLabel}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatDate(item.updatedAt)}</span>
                  </div>

                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.2rem' }}>
                      <input
                        type="text"
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        autoFocus
                        style={{ flex: 1, padding: '0.25rem', fontSize: '0.85rem', borderRadius: '4px' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item.id)}
                        style={{ padding: '0.25rem 0.5rem', background: 'var(--accent-blue)', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        style={{ padding: '0.25rem 0.5rem', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3
                        style={{
                          margin: '0',
                          color: 'var(--text-primary)',
                          fontSize: '1rem',
                          fontFamily: "'Share Tech Mono', monospace",
                          wordBreak: 'break-word',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        title="Edit preset name"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          padding: '2px 4px'
                        }}
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', paddingTop: '0.3rem', borderTop: '1px dashed var(--panel-border)' }}>
                  <button
                    type="button"
                    onClick={() => onLoadItem(item)}
                    style={{
                      flex: 1,
                      padding: '0.3rem 0.5rem',
                      background: 'var(--accent-blue)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.78rem'
                    }}
                  >
                    ⚡ Load
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      exportAllItemsToJSON([item], `${item.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_config.json`);
                      showNotification({
                        title: 'CONFIG EXPORTED',
                        message: `Exported preset "${item.name}" as JSON file.`,
                        type: 'info'
                      });
                    }}
                    title="Export single preset to JSON file"
                    style={{
                      padding: '0.3rem 0.5rem',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--panel-border)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
                    }}
                  >
                    💾 JSON
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      confirmAction({
                        title: 'DELETE PRESET',
                        message: `Are you sure you want to permanently delete "${item.name}" from internal storage?`,
                        onConfirm: () => {
                          onDeleteItem(item.id);
                          showNotification({
                            title: 'DELETED',
                            message: `Preset "${item.name}" removed from database.`,
                            type: 'danger'
                          });
                        }
                      });
                    }}
                    title="Delete Preset"
                    style={{
                      padding: '0.3rem 0.5rem',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#dc2626',
                      border: '1px solid #dc2626',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
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
