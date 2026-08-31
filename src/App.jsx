import React, { useState } from 'react';
import { TokenForm } from './components/TokenForm';
import { TokenPreview } from './components/TokenPreview';
import { UnitTracker } from './components/UnitTracker';
import { downloadTokenAsPNG, downloadUnitTrackerAsPNG } from './utils/export';
import './App.css';

function App() {
  const [tokenData, setTokenData] = useState({
    category: 'land',
    bgColor: '#2b6cb0',
    stripeColor: '#ffffff',
    hexColor: '#7e8388',
    fontFamily: "'Trebuchet MS', 'Arial Bold', sans-serif",
    echelon: '••',
    affiliation: 'friendly',
    symbolType: 'infantry',
    modifiers: [],
    movementRange: 3,
    unitName: '1-1 CHARLIE',
    dice: [
      { type: 'red', bigValue: 10, smallValue: '4' },
      { type: 'red', bigValue: 12, smallValue: '9' }
    ]
  });

  const [exportFace, setExportFace] = useState('both');

  // Unit Tracker state
  const [trackerData, setTrackerData] = useState({
    title: 'MRIC SECTION',
    description: 'Medium Range Interdiction Capability Section',
    triangleNumber: 3,
    footerName: 'CUSTOM UNIT TRACKER',
    initialHpSquare: 12,
    placedDice: {
      12: [
        { type: 'red', bigValue: 10, smallValue: '4' }
      ]
    }
  });

  const [selectedDieIndex, setSelectedDieIndex] = useState(0);

  const handleDownloadPNG = () => {
    const name = tokenData.unitName || 'token';
    if (exportFace === 'front' || exportFace === 'both') {
      downloadTokenAsPNG('token-preview-front', `${name}-front.png`);
    }
    if (exportFace === 'back' || exportFace === 'both') {
      setTimeout(() => {
        downloadTokenAsPNG('token-preview-back', `${name}-back.png`);
      }, exportFace === 'both' ? 300 : 0);
    }
  };

  const handleDownloadTrackerPNG = () => {
    const name = trackerData.footerName ? trackerData.footerName.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'unit-tracker';
    downloadUnitTrackerAsPNG('unit-tracker-export', `${name}.png`);
  };

  // Toggle or add dice / HP placement on square click
  const handleSquareClick = (squareNum) => {
    const currentPlaced = { ...trackerData.placedDice };
    const currentList = currentPlaced[squareNum] || [];

    // Selected die from tokenData.dice
    const availableDie = tokenData.dice[selectedDieIndex] || tokenData.dice[0];

    if (availableDie) {
      // Check if die already placed on this square; if yes, cycle or remove, else add
      const existsIndex = currentList.findIndex(
        (d) => d.type === availableDie.type && d.bigValue === availableDie.bigValue && d.smallValue === availableDie.smallValue
      );

      if (existsIndex >= 0) {
        // Remove this die
        const updated = [...currentList];
        updated.splice(existsIndex, 1);
        if (updated.length === 0) {
          delete currentPlaced[squareNum];
        } else {
          currentPlaced[squareNum] = updated;
        }
      } else {
        // Add die
        currentPlaced[squareNum] = [...currentList, availableDie];
      }

      setTrackerData({
        ...trackerData,
        placedDice: currentPlaced
      });
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Littoral Commander Token & Tracker Generator</h1>
        <p>Unofficial tool for rapid design of custom tokens and unit trackers</p>
      </header>

      <main className="app-main">
        <section className="form-section">
          <h2>Token Attributes</h2>
          <TokenForm tokenData={tokenData} onChange={setTokenData} />
        </section>

        <section className="preview-section">
          <TokenPreview
            tokenData={tokenData}
            onChange={setTokenData}
            exportFace={exportFace}
            onExportFaceChange={setExportFace}
            onDownloadPNG={handleDownloadPNG}
          />
        </section>
      </main>

      {/* UNIT TRACKER SECTION */}
      <section className="unit-tracker-section" style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            background: 'var(--panel-bg)',
            padding: '1.8rem',
            borderRadius: '8px',
            boxShadow: 'var(--hud-glow)',
            border: '1px solid var(--panel-border)',
            position: 'relative'
          }}
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
            /// UNIT_TRACKER_GENERATOR
          </div>

          <h2
            style={{
              marginTop: '0',
              marginBottom: '1.2rem',
              color: 'var(--accent-cyan)',
              fontFamily: "'Teko', sans-serif",
              fontSize: '1.8rem',
              letterSpacing: '1.5px',
              borderBottom: '1px solid var(--panel-border)',
              paddingBottom: '0.4rem',
              textTransform: 'uppercase'
            }}
          >
            Unit Tracker Builder
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
              alignItems: 'start'
            }}
            className="tracker-grid"
          >
            {/* Tracker Form Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                  Tracker Title
                </label>
                <input
                  type="text"
                  value={trackerData.title}
                  onChange={(e) => setTrackerData({ ...trackerData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                  Description (under title)
                </label>
                <input
                  type="text"
                  value={trackerData.description}
                  onChange={(e) => setTrackerData({ ...trackerData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                    Triangle Number (1-50)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={trackerData.triangleNumber}
                    onChange={(e) => {
                      const val = Math.min(50, Math.max(1, parseInt(e.target.value) || 1));
                      setTrackerData({ ...trackerData, triangleNumber: val });
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                    Initial HP Square (1-20)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={trackerData.initialHpSquare}
                    onChange={(e) => {
                      const val = Math.min(20, Math.max(1, parseInt(e.target.value) || 1));
                      setTrackerData({ ...trackerData, initialHpSquare: val });
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                  Bottom Right Tracker Name
                </label>
                <input
                  type="text"
                  value={trackerData.footerName}
                  onChange={(e) => setTrackerData({ ...trackerData, footerName: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                />
              </div>

              {/* Dice Placement Selector & Instructions */}
              <div style={{ background: '#0a0e17', padding: '1rem', borderRadius: '6px', border: '1px solid #1f293d' }}>
                <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                  Interactive Dice Placement on Grid Squares
                </label>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 0.8rem 0' }}>
                  Select one of your unit token dice below, then click any numbered square on the tracker to toggle placing that die on it!
                </p>

                {tokenData.dice && tokenData.dice.length > 0 ? (
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    {tokenData.dice.map((die, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedDieIndex(idx)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '4px',
                          border: selectedDieIndex === idx ? '2px solid #00f0ff' : '1px solid #334155',
                          background: selectedDieIndex === idx ? 'rgba(0,240,255,0.15)' : '#111827',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}
                      >
                        Die #{idx + 1} ({die.type.toUpperCase()}: {die.bigValue}
                        <sup>{die.smallValue}</sup>)
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ color: '#f87171', fontSize: '0.85rem' }}>No dice defined on unit token.</span>
                )}
              </div>

              <button
                onClick={handleDownloadTrackerPNG}
                style={{
                  padding: '0.85rem',
                  backgroundColor: '#00f0ff',
                  color: '#0a0e17',
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
                  letterSpacing: '1px',
                  boxShadow: '0 0 12px rgba(0, 240, 255, 0.4)',
                  marginTop: '0.5rem'
                }}
              >
                <span>📥</span> EXPORT UNIT TRACKER IMAGE (9.5 x 13.5)
              </button>
            </div>

            {/* Tracker Preview Render */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <UnitTracker
                tokenData={tokenData}
                trackerData={trackerData}
                width={420}
                onSquareClick={handleSquareClick}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
