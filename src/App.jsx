import React, { useState } from 'react';
import { TokenForm } from './components/TokenForm';
import { TokenPreview } from './components/TokenPreview';
import { UnitTracker } from './components/UnitTracker';
import { SavedLibrary } from './components/SavedLibrary';
import { downloadTokenAsPNG, downloadUnitTrackerAsPNG } from './utils/export';
import { getSavedItems, saveItem, deleteItem, updateItemName } from './utils/storage';
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
  const [tokenSaveName, setTokenSaveName] = useState('');

  // Unit Tracker state
  const [trackerExportFace, setTrackerExportFace] = useState('both'); // 'front' | 'back' | 'both'
  const [trackerSaveName, setTrackerSaveName] = useState('');
  const [trackerData, setTrackerData] = useState({
    trackerType: 'standard', // 'standard' | 'carrier'
    title: 'MRIC SECTION',
    description: 'The Medium Range Intercept Capability (MRIC) section is an integrated air and missile defense (IAMD) unit, equipped with the Tamir interceptor missile and non-kinetic capabilities.',
    triangleNumber: 2,
    reverseTriangleNumber: 6,
    showReverseTriangle: false,
    showJetIcon: true,
    showHelicopterIcon: true,
    customJetIconUrl: null,
    customHelicopterIconUrl: null,
    footerName: 'USMC UNIT TRACKER',
    customImageUrl: null,
    bgColor: '#ffffff',
    camoColor: '#4a5568',
    showCamo: true,
    initialHpSquare: 2,
    placedDice: {}, // Default empty as requested
    backBgColor: '#2b6cb0',
    backCamoColor: '#1a365d',
    showBackCamo: true,
    customBackImageUrl: null,
    showSquareBorders: true,
    titleColor: '#000000',
    descriptionColor: '#1a202c',
    triangleNumberColor: '#000000',
    footerNameColor: '#000000',
    attachmentTextColor: '#000000',
    squareNumberColor: '#8c939d',
    squareBgColor: '#ffffff'
  });

  const [clickMode, setClickMode] = useState('dice'); // 'dice' or 'hp'
  const [selectedDieIndex, setSelectedDieIndex] = useState('supply'); // 'supply' or index of tokenData.dice

  // Saved presets state
  const [savedItems, setSavedItems] = useState(() => getSavedItems());

  // Custom styled HUD notification / modal pop-up state
  const [modalState, setModalState] = useState(null); // { title, message, type: 'info' | 'danger', onConfirm?: fn }

  const showNotification = ({ title, message, type = 'info' }) => {
    setModalState({ title, message, type });
  };

  const confirmAction = ({ title, message, onConfirm }) => {
    setModalState({ title, message, type: 'danger', onConfirm });
  };

  const closeModal = () => {
    setModalState(null);
  };

  const refreshSavedItems = () => {
    setSavedItems(getSavedItems());
  };

  const handleSaveTokenPreset = (e) => {
    e.preventDefault();
    const name = tokenSaveName.trim() || tokenData.unitName || 'Unnamed Token';
    const updated = saveItem({
      name,
      type: 'token',
      category: tokenData.category || 'land',
      data: tokenData
    });
    setSavedItems(updated);
    setTokenSaveName('');
    showNotification({
      title: 'TOKEN PRESET SAVED',
      message: `Token preset "${name}" was successfully saved to browser storage.`,
      type: 'info'
    });
  };

  const handleSaveTrackerPreset = (e) => {
    e.preventDefault();
    const name = trackerSaveName.trim() || trackerData.title || 'Unnamed Tracker';
    const updated = saveItem({
      name,
      type: 'tracker',
      category: 'tracker',
      data: trackerData
    });
    setSavedItems(updated);
    setTrackerSaveName('');
    showNotification({
      title: 'UNIT TRACKER PRESET SAVED',
      message: `Unit Tracker preset "${name}" was successfully saved to browser storage.`,
      type: 'info'
    });
  };

  const handleLoadItem = (item) => {
    if (item.type === 'token') {
      setTokenData(item.data);
      const elem = document.getElementById('token-generator');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      showNotification({
        title: 'PRESET LOADED',
        message: `Loaded token configuration "${item.name}".`,
        type: 'info'
      });
    } else if (item.type === 'tracker') {
      setTrackerData(item.data);
      const elem = document.getElementById('unit-tracker');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      showNotification({
        title: 'PRESET LOADED',
        message: `Loaded Unit Tracker configuration "${item.name}".`,
        type: 'info'
      });
    }
  };

  const handleDeleteSavedItem = (id) => {
    const updated = deleteItem(id);
    setSavedItems(updated);
  };

  const handleUpdateItemName = (id, newName) => {
    const updated = updateItemName(id, newName);
    setSavedItems(updated);
  };

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

  const handleJetIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setTrackerData((prev) => ({ ...prev, customJetIconUrl: evt.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHelicopterIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setTrackerData((prev) => ({ ...prev, customHelicopterIconUrl: evt.target.result }));
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
    downloadUnitTrackerAsPNG(
      'unit-tracker-export-front',
      'unit-tracker-export-back',
      trackerExportFace,
      trackerData.title,
      trackerData.footerName
    );
  };

  // Clear all dice & HP square markers
  const handleClearAllMarkers = () => {
    setTrackerData((prev) => ({
      ...prev,
      initialHpSquare: null,
      placedDice: {}
    }));
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

      let availableDie = null;
      if (selectedDieIndex === 'supply') {
        availableDie = { type: 'supply', color: '#1976d2' };
      } else {
        availableDie = tokenData.dice[selectedDieIndex] || tokenData.dice[0];
      }

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
      {/* CUSTOM STYLED CYBER-MILITARY HUD MODAL POP-UP */}
      {modalState && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 8, 15, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: '#0d1322',
              border: `2px solid ${modalState.type === 'danger' ? '#ef4444' : '#00f0ff'}`,
              borderRadius: '8px',
              padding: '1.8rem',
              maxWidth: '460px',
              width: '100%',
              boxShadow: `0 0 20px ${modalState.type === 'danger' ? 'rgba(239,68,68,0.4)' : 'rgba(0,240,255,0.4)'}`,
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '15px',
                background: '#0a0e17',
                color: modalState.type === 'danger' ? '#ef4444' : '#00f0ff',
                fontSize: '0.75rem',
                padding: '0 8px',
                letterSpacing: '1.5px',
                border: `1px solid ${modalState.type === 'danger' ? '#ef4444' : '#00f0ff'}`
              }}
            >
              /// SYSTEM_ALERT
            </div>

            <h3
              style={{
                margin: '0 0 0.8rem 0',
                color: modalState.type === 'danger' ? '#ef4444' : '#00f0ff',
                fontFamily: "'Teko', sans-serif",
                fontSize: '1.8rem',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}
            >
              {modalState.title}
            </h3>

            <p style={{ margin: '0 0 1.5rem 0', color: '#f3f4f6', lineHeight: 1.5, fontSize: '0.95rem' }}>
              {modalState.message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              {modalState.onConfirm ? (
                <>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#1e293b',
                      color: '#cbd5e1',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      modalState.onConfirm();
                      closeModal();
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  >
                    CONFIRM
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: '0.5rem 1.2rem',
                    background: '#00f0ff',
                    color: '#0a0e17',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    fontFamily: "'Teko', sans-serif",
                    letterSpacing: '1px'
                  }}
                >
                  ACKNOWLEDGE
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="sticky-nav">
        <div className="nav-brand">LITTORAL COMMANDER SUITE</div>
        <div className="nav-links">
          <a href="#saved-presets-library" className="nav-link">💾 SAVED PRESETS</a>
          <a href="#token-generator" className="nav-link">🎯 TOKEN GENERATOR</a>
          <a href="#unit-tracker" className="nav-link">📋 UNIT TRACKER</a>
        </div>
      </nav>

      <header className="app-header">
        <h1>Littoral Commander Token & Tracker Generator</h1>
        <p>Unofficial tool for rapid design of custom tokens and unit trackers</p>
      </header>

      {/* SAVED PRESETS LIBRARY SECTION */}
      <SavedLibrary
        items={savedItems}
        onLoadItem={handleLoadItem}
        onDeleteItem={handleDeleteSavedItem}
        onUpdateItemName={handleUpdateItemName}
        onRefreshItems={refreshSavedItems}
        showNotification={showNotification}
        confirmAction={confirmAction}
      />

      <main className="app-main" id="token-generator">
        <section className="form-section">
          <h2>Token Attributes</h2>
          <TokenForm tokenData={tokenData} onChange={setTokenData} />

          {/* TOKEN SAVE PRESET BOX */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px dashed var(--panel-border)'
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-cyan)' }}>💾 Save Token Preset</h4>
            <form onSubmit={handleSaveTokenPreset} style={{ display: 'flex', gap: '0.6rem' }}>
              <input
                type="text"
                placeholder={tokenData.unitName || 'Preset Name...'}
                value={tokenSaveName}
                onChange={(e) => setTokenSaveName(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px' }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--accent-cyan)',
                  color: '#0a0e17',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: "'Teko', sans-serif",
                  fontSize: '1.1rem',
                  letterSpacing: '1px'
                }}
              >
                SAVE TOKEN
              </button>
            </form>
          </div>
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
                <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem', fontSize: '1.15rem' }}>
                  Tracker Type
                </label>
                <select
                  value={trackerData.trackerType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setTrackerData({
                      ...trackerData,
                      trackerType: newType,
                      showReverseTriangle: newType === 'carrier' ? true : trackerData.showReverseTriangle
                    });
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                >
                  <option value="standard">Standard Unit Tracker</option>
                  <option value="carrier">Carrier Unit Tracker (Embarked Aircraft Box)</option>
                </select>
              </div>

              {/* Aircraft Icon Options (Carrier Mode) */}
              {trackerData.trackerType === 'carrier' && (
                <div style={{ background: '#0a0e17', padding: '1rem', borderRadius: '6px', border: '1px solid #1f293d', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block' }}>
                    ✈️ Embarked Aircraft Display Options
                  </label>

                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '0.82rem', display: 'block', marginBottom: '0.3rem' }}>
                      Visible Aircraft Types
                    </label>
                    <select
                      value={
                        trackerData.showJetIcon && trackerData.showHelicopterIcon
                          ? 'both'
                          : trackerData.showJetIcon
                          ? 'jet'
                          : trackerData.showHelicopterIcon
                          ? 'helicopter'
                          : 'none'
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setTrackerData((prev) => ({
                          ...prev,
                          showJetIcon: val === 'both' || val === 'jet',
                          showHelicopterIcon: val === 'both' || val === 'helicopter'
                        }));
                      }}
                      style={{ width: '100%', padding: '0.48rem', borderRadius: '4px' }}
                    >
                      <option value="both">Both (Airplane & Helicopter)</option>
                      <option value="jet">Airplane Only</option>
                      <option value="helicopter">Helicopter Only</option>
                      <option value="none">None</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem' }}>
                        Custom Airplane Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleJetIconUpload}
                        style={{ width: '100%', fontSize: '0.78rem', color: 'var(--text-muted)' }}
                      />
                      {trackerData.customJetIconUrl && (
                        <button
                          onClick={() => setTrackerData({ ...trackerData, customJetIconUrl: null })}
                          style={{
                            marginTop: '0.3rem',
                            fontSize: '0.72rem',
                            padding: '2px 6px',
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          Reset Default Airplane
                        </button>
                      )}
                    </div>

                    <div>
                      <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem' }}>
                        Custom Helicopter Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHelicopterIconUpload}
                        style={{ width: '100%', fontSize: '0.78rem', color: 'var(--text-muted)' }}
                      />
                      {trackerData.customHelicopterIconUrl && (
                        <button
                          onClick={() => setTrackerData({ ...trackerData, customHelicopterIconUrl: null })}
                          style={{
                            marginTop: '0.3rem',
                            fontSize: '0.72rem',
                            padding: '2px 6px',
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          Reset Default Helicopter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
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
                <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
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
                  <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
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
                  <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                    Reversed ▲ Number (1-50)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={trackerData.reverseTriangleNumber}
                    onChange={(e) => {
                      const val = Math.min(50, Math.max(1, parseInt(e.target.value) || 1));
                      setTrackerData({ ...trackerData, reverseTriangleNumber: val });
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                    Initial HP Square (1-20)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={trackerData.initialHpSquare || ''}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        setTrackerData({ ...trackerData, initialHpSquare: null });
                      } else {
                        const val = Math.min(20, Math.max(1, parseInt(raw) || 1));
                        setTrackerData({ ...trackerData, initialHpSquare: val });
                      }
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                  />
                </div>
              </div>

              {/* Grid Interactive Placement Control (Relocated to top of controls) */}
              <div style={{ background: '#0a0e17', padding: '1rem', borderRadius: '6px', border: '1px solid #1f293d' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                    Interactive Grid Placement Mode
                  </label>
                  <button
                    onClick={handleClearAllMarkers}
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.3rem 0.6rem',
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🗑️ Clear All Markers
                  </button>
                </div>

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
                    🎲 Place Token / Supply Dice
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
                      Select a die type or Supply die below, then click any numbered square on the tracker to place/remove it!
                    </p>

                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Supply die (Blue Circle) */}
                      <div
                        onClick={() => setSelectedDieIndex('supply')}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '4px',
                          border: selectedDieIndex === 'supply' ? '2px solid #00f0ff' : '1px solid #334155',
                          background: selectedDieIndex === 'supply' ? 'rgba(0,240,255,0.25)' : '#111827',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <span style={{ color: '#3b82f6' }}>🔵</span> Supply Circle Die
                      </div>

                      {tokenData.dice && tokenData.dice.map((die, idx) => (
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
                  </div>
                )}

                {clickMode === 'hp' && (
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>
                    Click any numbered square (1–20) on the preview to place or move the black Initial HP square!
                  </p>
                )}
              </div>

              {/* Custom Token Image & Camouflage Pattern Options */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
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
                  <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
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

              {/* Color & Styling Customization */}
              <div style={{ background: '#0a0e17', padding: '1rem', borderRadius: '6px', border: '1px solid #1f293d' }}>
                <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.6rem' }}>
                  🎨 Colors & Background Styling
                </label>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>
                      Base Card Color
                    </label>
                    <input
                      type="color"
                      value={trackerData.bgColor}
                      onChange={(e) => setTrackerData({ ...trackerData, bgColor: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>
                      Front Camo Color
                    </label>
                    <input
                      type="color"
                      value={trackerData.camoColor}
                      onChange={(e) => setTrackerData({ ...trackerData, camoColor: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>
                      Backside BG Color
                    </label>
                    <input
                      type="color"
                      value={trackerData.backBgColor}
                      onChange={(e) => setTrackerData({ ...trackerData, backBgColor: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>
                      Backside Camo Color
                    </label>
                    <input
                      type="color"
                      value={trackerData.backCamoColor}
                      onChange={(e) => setTrackerData({ ...trackerData, backCamoColor: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={trackerData.showCamo}
                      onChange={(e) => setTrackerData({ ...trackerData, showCamo: e.target.checked })}
                    />
                    Front Camo
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={trackerData.showBackCamo}
                      onChange={(e) => setTrackerData({ ...trackerData, showBackCamo: e.target.checked })}
                    />
                    Backside Camo
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={trackerData.showSquareBorders}
                      onChange={(e) => setTrackerData({ ...trackerData, showSquareBorders: e.target.checked })}
                    />
                    Longsquare Borders
                  </label>
                </div>
              </div>

              {/* Text Elements Coloring */}
              <div style={{ background: '#0a0e17', padding: '1rem', borderRadius: '6px', border: '1px solid #1f293d' }}>
                <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.6rem' }}>
                  ✒️ Text Elements Coloring
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.8rem' }}>
                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '0.78rem', display: 'block', marginBottom: '0.2rem' }}>Title</label>
                    <input
                      type="color"
                      value={trackerData.titleColor}
                      onChange={(e) => setTrackerData({ ...trackerData, titleColor: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '0.78rem', display: 'block', marginBottom: '0.2rem' }}>Description</label>
                    <input
                      type="color"
                      value={trackerData.descriptionColor}
                      onChange={(e) => setTrackerData({ ...trackerData, descriptionColor: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '0.78rem', display: 'block', marginBottom: '0.2rem' }}>Triangle Num</label>
                    <input
                      type="color"
                      value={trackerData.triangleNumberColor}
                      onChange={(e) => setTrackerData({ ...trackerData, triangleNumberColor: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '0.78rem', display: 'block', marginBottom: '0.2rem' }}>Attachment Text</label>
                    <input
                      type="color"
                      value={trackerData.attachmentTextColor}
                      onChange={(e) => setTrackerData({ ...trackerData, attachmentTextColor: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '0.78rem', display: 'block', marginBottom: '0.2rem' }}>Footer Name</label>
                    <input
                      type="color"
                      value={trackerData.footerNameColor}
                      onChange={(e) => setTrackerData({ ...trackerData, footerNameColor: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '0.78rem', display: 'block', marginBottom: '0.2rem' }}>Square Numbers</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <input
                        type="color"
                        value={trackerData.squareNumberColor === 'bgColor' ? trackerData.bgColor : trackerData.squareNumberColor}
                        onChange={(e) => setTrackerData({ ...trackerData, squareNumberColor: e.target.value })}
                      />
                      <button
                        title="Set square numbers color to background color"
                        onClick={() =>
                          setTrackerData({
                            ...trackerData,
                            squareNumberColor: trackerData.squareNumberColor === 'bgColor' ? '#8c939d' : 'bgColor'
                          })
                        }
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 4px',
                          background: trackerData.squareNumberColor === 'bgColor' ? '#00f0ff' : '#334155',
                          color: trackerData.squareNumberColor === 'bgColor' ? '#000' : '#fff',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        {trackerData.squareNumberColor === 'bgColor' ? 'BG Color' : 'Match BG'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                  Bottom Right Tracker Name
                </label>
                <input
                  type="text"
                  value={trackerData.footerName}
                  onChange={(e) => setTrackerData({ ...trackerData, footerName: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.5rem' }}>
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
                    boxShadow: '0 0 12px rgba(0, 240, 255, 0.4)'
                  }}
                >
                  <span>📥</span> EXPORT UNIT TRACKER ({trackerExportFace.toUpperCase()})
                </button>

                {/* TRACKER SAVE PRESET BOX */}
                <div
                  style={{
                    paddingTop: '0.8rem',
                    borderTop: '1px dashed var(--panel-border)'
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-cyan)' }}>💾 Save Tracker Preset</h4>
                  <form onSubmit={handleSaveTrackerPreset} style={{ display: 'flex', gap: '0.6rem' }}>
                    <input
                      type="text"
                      placeholder={trackerData.title || 'Preset Name...'}
                      value={trackerSaveName}
                      onChange={(e) => setTrackerSaveName(e.target.value)}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '4px' }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--accent-cyan)',
                        color: '#0a0e17',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontFamily: "'Teko', sans-serif",
                        fontSize: '1.1rem',
                        letterSpacing: '1px'
                      }}
                    >
                      SAVE TRACKER
                    </button>
                  </form>
                </div>
              </div>
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
