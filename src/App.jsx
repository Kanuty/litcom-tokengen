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
  const [trackerType, setTrackerType] = useState('standard'); // 'standard' | 'carrier'
  const [trackerExportFace, setTrackerExportFace] = useState('both'); // 'front' | 'back' | 'both'
  const [trackerData, setTrackerData] = useState({
    title: 'MRIC SECTION',
    description: 'The Medium Range Intercept Capability (MRIC) section is an integrated air and missile defense (IAMD) unit, equipped with the Tamir interceptor missile and non-kinetic capabilities.',
    triangleNumber: 2,
    footerName: 'USMC UNIT TRACKER',
    customImageUrl: null,
    bgColor: '#ffffff',
    camoColor: '#4a5568',
    showCamo: true,
    initialHpSquare: 2,
    placedDice: {
      10: [
        { type: 'purple', bigValue: 12, smallValue: '9' }
      ]
    },
    backBgColor: '#2b6cb0',
    customBackImageUrl: null
  });

  const [clickMode, setClickMode] = useState('dice'); // 'dice' or 'hp'
  const [selectedDieIndex, setSelectedDieIndex] = useState(0);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setTrackerData((prev) => ({ ...prev, customImageUrl: evt.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setTrackerData((prev) => ({ ...prev, customBackImageUrl: evt.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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
    downloadUnitTrackerAsPNG('unit-tracker-export-front', 'unit-tracker-export-back', trackerExportFace, name);
  };

  // Toggle or add dice / HP placement on square click
  const handleSquareClick = (squareNum) => {
    if (clickMode === 'hp') {
      // Set HP marker to clicked square
      setTrackerData((prev) => ({
        ...prev,
        initialHpSquare: prev.initialHpSquare === squareNum ? null : squareNum
      }));
    } else {
      // Place or remove die
      const currentPlaced = { ...trackerData.placedDice };
      const currentList = currentPlaced[squareNum] || [];
      const availableDie = tokenData.dice[selectedDieIndex] || tokenData.dice[0];

      if (availableDie) {
        const existsIndex = currentList.findIndex(
          (d) => d.type === availableDie.type && d.bigValue === availableDie.bigValue && d.smallValue === availableDie.smallValue
        );

        if (existsIndex >= 0) {
          const updated = [...currentList];
          updated.splice(existsIndex, 1);
          if (updated.length === 0) {
            delete currentPlaced[squareNum];
          } else {
            currentPlaced[squareNum] = updated;
          }
        } else {
          currentPlaced[squareNum] = [...currentList, availableDie];
        }

        setTrackerData((prev) => ({
          ...prev,
          placedDice: currentPlaced
        }));
      }
    }
  };

  return (
    <div className="app-container">
      <nav className="sticky-nav">
        <div className="nav-brand">LITTORAL COMMANDER SUITE</div>
        <div className="nav-links">
          <a href="#token-generator" className="nav-link">🎯 TOKEN GENERATOR</a>
          <a href="#unit-tracker" className="nav-link">📋 UNIT TRACKER</a>
        </div>
      </nav>

      <header className="app-header" id="token-generator">
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
      <section className="unit-tracker-section" id="unit-tracker" style={{ marginTop: '2.5rem' }}>
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
                  Tracker Type
                </label>
                <select
                  value={trackerType}
                  onChange={(e) => setTrackerType(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                >
                  <option value="standard">Standard Unit Tracker</option>
                  <option value="carrier" disabled>
                    Carrier Unit Tracker (Disabled / Coming Soon)
                  </option>
                </select>
              </div>

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
                <textarea
                  rows="3"
                  value={trackerData.description}
                  onChange={(e) => setTrackerData({ ...trackerData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    background: '#0d1322',
                    color: 'var(--accent-cyan)',
                    border: '1px solid #1e293b',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
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
                    value={trackerData.initialHpSquare || ''}
                    onChange={(e) => {
                      const val = Math.min(20, Math.max(1, parseInt(e.target.value) || 1));
                      setTrackerData({ ...trackerData, initialHpSquare: val });
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                  />
                </div>
              </div>

              {/* Custom Token Image & Camouflage Pattern Options */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                    Front Token Image (Optional Upload)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  />
                  {trackerData.customImageUrl && (
                    <button
                      onClick={() => setTrackerData({ ...trackerData, customImageUrl: null })}
                      style={{
                        marginTop: '0.4rem',
                        fontSize: '0.75rem',
                        padding: '2px 6px',
                        background: '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Reset to Token Preview
                    </button>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                    Backside Image (Optional Upload)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackImageUpload}
                    style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  />
                  {trackerData.customBackImageUrl && (
                    <button
                      onClick={() => setTrackerData({ ...trackerData, customBackImageUrl: null })}
                      style={{
                        marginTop: '0.4rem',
                        fontSize: '0.75rem',
                        padding: '2px 6px',
                        background: '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Reset Backside Image
                    </button>
                  )}
                </div>
              </div>

              {/* Color Customization (Base Color, Camo Color, Backside BG Color) */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                    Base Card Color
                  </label>
                  <input
                    type="color"
                    value={trackerData.bgColor}
                    onChange={(e) => setTrackerData({ ...trackerData, bgColor: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                    Camo Color
                  </label>
                  <input
                    type="color"
                    value={trackerData.camoColor}
                    onChange={(e) => setTrackerData({ ...trackerData, camoColor: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                    Backside Color
                  </label>
                  <input
                    type="color"
                    value={trackerData.backBgColor}
                    onChange={(e) => setTrackerData({ ...trackerData, backBgColor: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                    Camo Overlay
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff' }}>
                    <input
                      type="checkbox"
                      checked={trackerData.showCamo}
                      onChange={(e) => setTrackerData({ ...trackerData, showCamo: e.target.checked })}
                    />
                    Enable Camo
                  </label>
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

              {/* Grid Interactive Placement Control */}
              <div style={{ background: '#0a0e17', padding: '1rem', borderRadius: '6px', border: '1px solid #1f293d' }}>
                <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                  Interactive Grid Placement Mode
                </label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem' }}>
                  <button
                    onClick={() => setClickMode('dice')}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      border: clickMode === 'dice' ? '2px solid #00f0ff' : '1px solid #334155',
                      background: clickMode === 'dice' ? 'rgba(0,240,255,0.2)' : '#111827',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🎲 Place Token Dice
                  </button>
                  <button
                    onClick={() => setClickMode('hp')}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      border: clickMode === 'hp' ? '2px solid #00f0ff' : '1px solid #334155',
                      background: clickMode === 'hp' ? 'rgba(0,240,255,0.2)' : '#111827',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ⬛ Set HP Square Marker
                  </button>
                </div>

                {clickMode === 'dice' && (
                  <div>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 0.8rem 0' }}>
                      Select a die type below, then click any numbered square on the tracker to place/remove it!
                    </p>
                    {tokenData.dice && tokenData.dice.length > 0 ? (
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
                            Die #{idx + 1} ({die.type.toUpperCase()})
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#f87171', fontSize: '0.85rem' }}>No dice defined on unit token.</span>
                    )}
                  </div>
                )}

                {clickMode === 'hp' && (
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>
                    Click any numbered square (1–20) on the preview to place or move the black Initial HP square!
                  </p>
                )}
              </div>

              <div>
                <label style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                  Tracker Export Side
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['front', 'back', 'both'].map((f) => (
                    <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fff', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="trackerExportFace"
                        value={f}
                        checked={trackerExportFace === f}
                        onChange={(e) => setTrackerExportFace(e.target.value)}
                      />
                      {f.toUpperCase()}
                    </label>
                  ))}
                </div>
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
                <span>📥</span> EXPORT UNIT TRACKER ({trackerExportFace.toUpperCase()})
              </button>
            </div>

            {/* Tracker Preview Render (Front & Back) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
              <div>
                <h3 style={{ color: 'var(--accent-cyan)', margin: '0 0 0.5rem 0', textAlign: 'center' }}>FRONT SIDE</h3>
                <UnitTracker
                  id="unit-tracker-export-front"
                  tokenData={tokenData}
                  trackerData={trackerData}
                  side="front"
                  width={420}
                  onSquareClick={handleSquareClick}
                />
              </div>

              <div>
                <h3 style={{ color: 'var(--accent-cyan)', margin: '0 0 0.5rem 0', textAlign: 'center' }}>BACK SIDE</h3>
                <UnitTracker
                  id="unit-tracker-export-back"
                  tokenData={tokenData}
                  trackerData={trackerData}
                  side="back"
                  width={420}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
