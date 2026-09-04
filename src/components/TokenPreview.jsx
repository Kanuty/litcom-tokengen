import React, { useState } from 'react';
import { LandToken } from './LandToken';

export function TokenPreview({ tokenData, onChange, exportFace, onExportFaceChange, onDownloadPNG }) {
  const [activeTab, setActiveTab] = useState('front');

  const handleSizeChange = (e) => {
    const val = parseInt(e.target.value) || 250;
    if (onChange) {
      onChange({ ...tokenData, tokenSize: val });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'var(--panel-bg)',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: 'var(--hud-glow)',
        border: '1px solid var(--panel-border)',
        width: '100%',
        maxWidth: '420px',
        position: 'relative'
      }}
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
        /// HUD_PREVIEW_FEED
      </div>

      <h3
        style={{
          marginTop: '0.4rem',
          marginBottom: '1rem',
          color: 'var(--accent-cyan)',
          fontFamily: "'Teko', sans-serif",
          fontSize: '1.8rem',
          letterSpacing: '1.5px',
          textTransform: 'uppercase'
        }}
      >
        TOKEN LIVE PREVIEW
      </h3>

      {/* Tabs to switch Front / Back */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', width: '100%' }}>
        <button
          onClick={() => setActiveTab('front')}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid var(--accent-cyan)',
            borderRadius: '4px',
            backgroundColor: activeTab === 'front' ? 'var(--accent-cyan)' : 'transparent',
            color: activeTab === 'front' ? 'var(--bg-dark)' : 'var(--accent-cyan)',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: "'Share Tech Mono', monospace"
          }}
        >
          [ FRONT FACE ]
        </button>
        <button
          onClick={() => setActiveTab('back')}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid var(--accent-cyan)',
            borderRadius: '4px',
            backgroundColor: activeTab === 'back' ? 'var(--accent-cyan)' : 'transparent',
            color: activeTab === 'back' ? 'var(--bg-dark)' : 'var(--accent-cyan)',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: "'Share Tech Mono', monospace"
          }}
        >
          [ REVERSE FACE ]
        </button>
      </div>

      {/* Offscreen / Export Container so both front and back always exist in DOM for PNG export */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none' }}>
        <LandToken id="token-preview-front" tokenData={tokenData} side="front" size={tokenData.tokenSize || 250} />
        <LandToken id="token-preview-back" tokenData={tokenData} side="back" size={tokenData.tokenSize || 250} />
      </div>

      {/* Token Container for Active Tab Preview */}
      <div
        style={{
          padding: '1.2rem',
          background: 'var(--card-dice-bg)',
          borderRadius: '8px',
          border: '1px dashed var(--accent-cyan)',
          marginBottom: '1.2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <LandToken
          tokenData={tokenData}
          side={activeTab}
          size={250}
        />
      </div>

      {/* Side-by-side thumbnail indicator */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div
          onClick={() => setActiveTab('front')}
          style={{
            cursor: 'pointer',
            border: activeTab === 'front' ? '2px solid var(--accent-cyan)' : '1px solid var(--panel-border)',
            borderRadius: '6px',
            padding: '4px',
            background: 'var(--card-dice-bg)'
          }}
        >
          <LandToken id="token-preview-thumb-front" tokenData={tokenData} side="front" size={80} />
          <div style={{ fontSize: '11px', textAlign: 'center', marginTop: '4px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
            FRONT
          </div>
        </div>

        <div
          onClick={() => setActiveTab('back')}
          style={{
            cursor: 'pointer',
            border: activeTab === 'back' ? '2px solid var(--accent-cyan)' : '1px solid var(--panel-border)',
            borderRadius: '6px',
            padding: '4px',
            background: 'var(--card-dice-bg)'
          }}
        >
          <LandToken id="token-preview-thumb-back" tokenData={tokenData} side="back" size={80} />
          <div style={{ fontSize: '11px', textAlign: 'center', marginTop: '4px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
            BACK
          </div>
        </div>
      </div>

      {/* Token Display Size & Export Selection & Download Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.3rem' }}>
            Token Display Size (px)
          </label>
          <input
            type="number"
            min="150"
            max="600"
            value={tokenData.tokenSize || 250}
            onChange={handleSizeChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid var(--accent-cyan)',
              background: 'var(--input-bg)',
              color: 'var(--accent-cyan)',
              fontFamily: "'Share Tech Mono', monospace"
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.3rem' }}>
            Export Face Selection
          </label>
          <select
            value={exportFace || 'both'}
            onChange={(e) => onExportFaceChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid var(--accent-cyan)',
              background: 'var(--input-bg)',
              color: 'var(--accent-cyan)',
              fontFamily: "'Share Tech Mono', monospace"
            }}
          >
            <option value="both">Both Faces (Front & Back PNGs)</option>
            <option value="front">Front Face Only</option>
            <option value="back">Back Face Only</option>
          </select>
        </div>

        <button
          onClick={onDownloadPNG}
          style={{
            padding: '0.85rem',
            backgroundColor: 'var(--accent-cyan)',
            color: 'var(--bg-dark)',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontFamily: "'Teko', sans-serif",
            letterSpacing: '1px'
          }}
        >
          <span>📥</span> DOWNLOAD TOKEN IMAGE ({exportFace === 'both' ? 'BOTH FACES' : exportFace.toUpperCase()})
        </button>
      </div>
    </div>
  );
}
