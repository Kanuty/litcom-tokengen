import React, { useState } from 'react';
import { TokenForm } from './components/TokenForm';
import { TokenPreview } from './components/TokenPreview';
import { UnitTracker } from './components/UnitTracker';
import { JointCapabilityCard, CARD_TYPES } from './components/JointCapabilityCard';
import { SavedLibrary } from './components/SavedLibrary';
import { downloadTokenAsPNG, downloadUnitTrackerAsPNG, downloadCapabilityCardAsPNG } from './utils/export';
import { getSavedItems, saveItem, deleteItem, updateItemName } from './utils/storage';
import './App.css';

// Mini SVG die icon for Interactive Grid Placement Mode buttons
function MiniDieIcon({ die, isHp = false, isSupply = false }) {
  if (isHp) {
    return (
      <svg width="20" height="20" viewBox="0 0 100 100" style={{ verticalAlign: 'middle' }}>
        <rect x="5" y="5" width="90" height="90" rx="8" fill="#000000" stroke="#00f0ff" strokeWidth="8" />
        <text x="50" y="62" fill="#00f0ff" fontSize="42" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          HP
        </text>
      </svg>
    );
  }

  if (isSupply) {
    return (
      <svg width="20" height="20" viewBox="0 0 100 100" style={{ verticalAlign: 'middle' }}>
        <circle cx="50" cy="50" r="42" fill="#1976d2" stroke="#ffffff" strokeWidth="8" />
      </svg>
    );
  }

  const diceType = die?.type || 'red';
  const bigVal = die?.bigValue ?? 10;
  let defaultBg = '#c83232';
  if (diceType === 'green') defaultBg = '#2e7d32';
  if (diceType === 'purple') defaultBg = '#7b1fa2';
  if (diceType === 'blue') defaultBg = '#1976d2';

  const bg = die?.color || defaultBg;
  const strokeC = die?.hasThickBorder ? (die?.borderColor || '#ffcc00') : '#ffffff';
  const strokeW = die?.hasThickBorder ? 12 : 6;

  return (
    <svg width="22" height="22" viewBox="0 0 100 100" style={{ verticalAlign: 'middle' }}>
      {diceType === 'red' && (
        <rect x="5" y="5" width="90" height="90" rx="8" fill={bg} stroke={strokeC} strokeWidth={strokeW} />
      )}
      {diceType === 'green' && (
        <path
          d="M 5 11 C 5 7.7 7.7 5 11 5 L 89 5 C 92.3 5 95 7.7 95 11 L 95 65 L 65 95 L 11 95 C 7.7 95 5 92.3 5 89 Z"
          fill={bg}
          stroke={strokeC}
          strokeWidth={strokeW}
        />
      )}
      {diceType === 'purple' && (
        <polygon points="20,5 80,5 96,65 50,95 4,65" fill={bg} stroke={strokeC} strokeWidth={strokeW} />
      )}
      {diceType === 'blue' && (
        <circle cx="50" cy="50" r="42" fill={bg} stroke={strokeC} strokeWidth={strokeW} />
      )}
      <text x="50" y="64" fill="#ffffff" fontSize="46" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        {bigVal}
      </text>
    </svg>
  );
}

function App() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('lc_app_theme') || 'cyber-blue';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('lc_app_theme', currentTheme);
  }, [currentTheme]);

  const [tokenData, setTokenData] = useState({
    category: 'land',
    bgColor: '#2b6cb0',
    stripeColor: '#ffffff',
    hexColor: '#7e8388',
    hexBorderColor: '#ffffff',
    natoSymbolColor: '#ffffff',
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
  const [trackerPreviewSide, setTrackerPreviewSide] = useState('front'); // 'front' | 'back' | 'both'
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
    placedDice: {},
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

  // Joint Capability Cards state
  const [cardExportFace, setCardExportFace] = useState('both');
  const [cardPreviewSide, setCardPreviewSide] = useState('front');
  const [cardSaveName, setCardSaveName] = useState('');
  const [cardData, setCardData] = useState({
    title: 'NSM BATTERY',
    cardType: 'fires', // 'fires' | 'maneuver' | 'interception' | 'info_ops' | 'c5isr' | 'custom'
    customTypeTitle: '',
    cost: 2, // 0 to 5
    showSizeTriangle: true,
    sizeNumber: 1,
    customStripColor: '#d32f2f',
    customImageUrl: null,
    bodyText: 'Provides long-range anti-ship missile defense against surface combatants in contested littoral zones.',
    featureTags: { PERSIST: true, INTERCEPT: false, ATTACH: true, NULLIFY: false, FTR: false },
    showLore: true,
    loreText: 'Deployed rapidly to sea denial zones in the Indo-Pacific theater.',
    setNameNumber: 'USMC 999',
    borderColor: '#00f0ff',
    borderWidth: 3,
    bgColor: '#0f172a',
    cardTextColor: '#f8fafc',
    topStripTextColor: '#ffffff',
    loreBgColor: '#1e293b',
    loreTextColor: '#94a3b8',
    backBgColor: '#0f172a',
    backCamoColor: '#1e293b',
    showBackCamo: true,
    backTitle: 'JOINT CAPABILITY CARD',
    backSubtitle: 'LITTORAL COMMANDER SUITE',
    customBackImageUrl: null
  });

  const [clickMode, setClickMode] = useState('dice'); // 'dice' or 'hp'
  const [selectedDieIndex, setSelectedDieIndex] = useState('supply'); // 'supply' or index of tokenData.dice

  // Saved presets state
  const [savedItems, setSavedItems] = useState(() => getSavedItems());

  // Modal HUD alert
  const [modalState, setModalState] = useState(null);

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

  const handleSaveCardPreset = (e) => {
    e.preventDefault();
    const name = cardSaveName.trim() || cardData.title || 'Unnamed Capability Card';
    const updated = saveItem({
      name,
      type: 'card',
      category: 'card',
      data: cardData
    });
    setSavedItems(updated);
    setCardSaveName('');
    showNotification({
      title: 'CAPABILITY CARD PRESET SAVED',
      message: `Capability Card preset "${name}" was successfully saved to browser storage.`,
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
    } else if (item.type === 'card') {
      setCardData(item.data);
      const elem = document.getElementById('capability-card');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      showNotification({
        title: 'PRESET LOADED',
        message: `Loaded Capability Card configuration "${item.name}".`,
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

  const handleCardImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCardData((prev) => ({ ...prev, customImageUrl: evt.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCardBackImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCardData((prev) => ({ ...prev, customBackImageUrl: evt.target.result }));
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

  const handleDownloadCardPNG = () => {
    downloadCapabilityCardAsPNG(
      'capability-card-export-front',
      'capability-card-export-back',
      cardExportFace,
      cardData.title,
      cardData.setNameNumber
    );
  };

  const handleClearAllMarkers = () => {
    setTrackerData((prev) => ({
      ...prev,
      initialHpSquare: null,
      placedDice: {}
    }));
  };

  const handleSquareClick = (squareNum) => {
    if (clickMode === 'hp') {
      setTrackerData((prev) => ({
        ...prev,
        initialHpSquare: prev.initialHpSquare === squareNum ? null : squareNum
      }));
    } else {
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
      {/* HUD Modal Alert */}
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
              background: 'var(--panel-bg)',
              border: `2px solid ${modalState.type === 'danger' ? '#ef4444' : 'var(--accent-cyan)'}`,
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
                background: 'var(--panel-bg)',
                color: modalState.type === 'danger' ? '#ef4444' : 'var(--accent-cyan)',
                fontSize: '0.75rem',
                padding: '0 8px',
                letterSpacing: '1.5px',
                border: `1px solid ${modalState.type === 'danger' ? '#ef4444' : 'var(--accent-cyan)'}`
              }}
            >
              /// SYSTEM_ALERT
            </div>

            <h3
              style={{
                margin: '0 0 0.8rem 0',
                color: modalState.type === 'danger' ? '#ef4444' : 'var(--accent-cyan)',
                fontFamily: "'Teko', sans-serif",
                fontSize: '1.8rem',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}
            >
              {modalState.title}
            </h3>

            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
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
                      background: 'var(--input-bg)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--panel-border)',
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
                    background: 'var(--accent-cyan)',
                    color: 'var(--bg-dark)',
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

      {/* Offscreen containers for export generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', pointerEvents: 'none' }}>
        <UnitTracker
          id="unit-tracker-export-front"
          tokenData={tokenData}
          trackerData={trackerData}
          side="front"
          width={420}
        />
        <UnitTracker
          id="unit-tracker-export-back"
          tokenData={tokenData}
          trackerData={trackerData}
          side="back"
          width={420}
        />
        <JointCapabilityCard
          id="capability-card-export-front"
          cardData={cardData}
          side="front"
          width={380}
        />
        <JointCapabilityCard
          id="capability-card-export-back"
          cardData={cardData}
          side="back"
          width={380}
        />
      </div>

      <nav className="sticky-nav">
        <div className="nav-brand">LITTORAL COMMANDER SUITE</div>
        <div className="nav-links" style={{ alignItems: 'center' }}>
          <a href="#saved-presets-library" className="nav-link">💾 SAVED PRESETS</a>
          <a href="#token-generator" className="nav-link">🎯 TOKEN GENERATOR</a>
          <a href="#unit-tracker" className="nav-link">📋 UNIT TRACKER</a>
          <a href="#capability-card" className="nav-link">🃏 CAPABILITY CARDS</a>

          {/* Social & External Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.2rem' }}>
            <a
              href="https://www.linkedin.com/in/bartosz-dudek-050362120/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-btn"
              title="Bartosz Dudek - LitComTokenGen developer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/sebastian-bae/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-btn"
              title="Sebastian Bae (Littoral Commander Creator LinkedIn)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>

            <a
              href="https://dietzfoundation.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-btn"
              title="Dietz Foundation - Buy Littoral Commander here"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </a>

            <a
              href="https://github.com/Kanuty/litcom-tokengen"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-btn"
              title="GitHub Repository"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
              </svg>
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>THEME:</span>
            <select
              value={currentTheme}
              onChange={(e) => setCurrentTheme(e.target.value)}
              style={{
                fontSize: '0.78rem',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
                border: '1px solid var(--accent-cyan)',
                background: 'var(--input-bg)',
                color: 'var(--input-color)',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <option value="cyber-blue">Dark Cyber-Blue</option>
              <option value="blueprint">Light Blueprint</option>
              <option value="oldschool">Old School</option>
              <option value="vaporwave">Neo Vaporwave</option>
            </select>
          </div>
        </div>
      </nav>

      <header className="app-header">
        <h1>Littoral Commander Token & Tracker Generator</h1>
        <p>Unofficial tool for rapid design of custom tokens, unit trackers, and joint capability cards</p>
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

      {/* TOKEN GENERATOR SECTION */}
      <section className="token-generator-section" id="token-generator" style={{ marginTop: '1.5rem' }}>
        <div className="token-generator-panel">
          <h2>Token Generator</h2>

          <div className="token-grid">
            <div className="form-section">
              <TokenForm tokenData={tokenData} onChange={setTokenData} />

              {/* TOKEN SAVE PRESET BOX */}
              <div
                style={{
                  marginTop: '1.2rem',
                  paddingTop: '0.8rem',
                  borderTop: '1px dashed var(--panel-border)'
                }}
              >
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--accent-cyan)', fontFamily: "'Teko', sans-serif", fontSize: '1.3rem', letterSpacing: '1px' }}>
                  💾 Save Token Preset
                </h4>
                <form onSubmit={handleSaveTokenPreset} style={{ display: 'flex', gap: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder={tokenData.unitName || 'Preset Name...'}
                    value={tokenSaveName}
                    onChange={(e) => setTokenSaveName(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.4rem 1rem',
                      background: 'var(--accent-cyan)',
                      color: 'var(--bg-dark)',
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
            </div>

            <div className="preview-section">
              <TokenPreview
                tokenData={tokenData}
                onChange={setTokenData}
                exportFace={exportFace}
                onExportFaceChange={setExportFace}
                onDownloadPNG={handleDownloadPNG}
              />
            </div>
          </div>
        </div>
      </section>

      {/* UNIT TRACKER SECTION */}
      <section className="unit-tracker-section" id="unit-tracker" style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            background: 'var(--panel-bg)',
            padding: '1.25rem',
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
              background: 'var(--panel-bg)',
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
              marginBottom: '1rem',
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
              gap: '1.5rem',
              alignItems: 'start'
            }}
            className="tracker-grid"
          >
            {/* Tracker Form Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

              {/* 1. BASIC TRACKER IDENTIFICATION */}
              <div className="tint-card tint-card-attributes">
                <h3 className="subsection-header">📋 Tracker Identification & Designation</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="field-label">Tracker Type</label>
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
                      style={{ width: '100%' }}
                    >
                      <option value="standard">Standard Unit Tracker</option>
                      <option value="carrier">Carrier Unit Tracker (Embarked Aircraft Box)</option>
                    </select>
                  </div>

                  <div>
                    <label className="field-label">Bottom Right Tracker Name</label>
                    <input
                      type="text"
                      value={trackerData.footerName}
                      onChange={(e) => setTrackerData({ ...trackerData, footerName: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Tracker Title</label>
                  <input
                    type="text"
                    value={trackerData.title}
                    onChange={(e) => setTrackerData({ ...trackerData, title: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="field-label">Description (Under Title)</label>
                  <textarea
                    rows="2"
                    value={trackerData.description}
                    onChange={(e) => setTrackerData({ ...trackerData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.5rem',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      fontSize: '0.82rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
                  <div>
                    <label className="field-label">Triangle ▲ Num (1-50)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={trackerData.triangleNumber}
                      onChange={(e) => {
                        const val = Math.min(50, Math.max(1, parseInt(e.target.value) || 1));
                        setTrackerData({ ...trackerData, triangleNumber: val });
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="field-label">Reversed ▲ Num (1-50)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={trackerData.reverseTriangleNumber}
                      onChange={(e) => {
                        const val = Math.min(50, Math.max(1, parseInt(e.target.value) || 1));
                        setTrackerData({ ...trackerData, reverseTriangleNumber: val });
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="field-label">Initial HP Square (1-20)</label>
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
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. AIRCRAFT DISPLAY OPTIONS (CARRIER MODE) */}
              {trackerData.trackerType === 'carrier' && (
                <div className="tint-card tint-card-aircraft">
                  <h3 className="subsection-header">✈️ Embarked Aircraft Display Options</h3>

                  <div>
                    <label className="field-label">Visible Aircraft Types</label>
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
                      style={{ width: '100%' }}
                    >
                      <option value="both">Both (Airplane & Helicopter)</option>
                      <option value="jet">Airplane Only</option>
                      <option value="helicopter">Helicopter Only</option>
                      <option value="none">None</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label" style={{ fontSize: '0.78rem' }}>Custom Airplane Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleJetIconUpload}
                        style={{ width: '100%', fontSize: '0.78rem' }}
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
                          Reset Airplane Image
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="field-label" style={{ fontSize: '0.78rem' }}>Custom Helicopter Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHelicopterIconUpload}
                        style={{ width: '100%', fontSize: '0.78rem' }}
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
                          Reset Helicopter Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. INTERACTIVE GRID PLACEMENT MODE WITH MINI DIE GRAPHICS */}
              <div className="tint-card tint-card-grid">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="subsection-header">🎯 Interactive Grid Placement Mode</h3>
                  <button
                    onClick={handleClearAllMarkers}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🗑️ Clear Markers
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setClickMode('dice')}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      border: clickMode === 'dice' ? '2px solid var(--accent-cyan)' : '1px solid var(--panel-border)',
                      background: clickMode === 'dice' ? 'rgba(0,240,255,0.2)' : 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <MiniDieIcon die={tokenData.dice?.[0]} /> Place Token / Supply Dice
                  </button>
                  <button
                    onClick={() => setClickMode('hp')}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      border: clickMode === 'hp' ? '2px solid var(--accent-cyan)' : '1px solid var(--panel-border)',
                      background: clickMode === 'hp' ? 'rgba(0,240,255,0.2)' : 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <MiniDieIcon isHp /> Set HP Marker
                  </button>
                </div>

                {clickMode === 'dice' && (
                  <div>
                    <p className="field-help-text">
                      Select a die below, then click any numbered square (1–20) on the preview to place/remove it!
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div
                        onClick={() => setSelectedDieIndex('supply')}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '4px',
                          border: selectedDieIndex === 'supply' ? '2px solid var(--accent-cyan)' : '1px solid var(--panel-border)',
                          background: selectedDieIndex === 'supply' ? 'rgba(0,240,255,0.25)' : 'var(--input-bg)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.82rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <MiniDieIcon isSupply /> Supply Die
                      </div>

                      {tokenData.dice && tokenData.dice.map((die, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedDieIndex(idx)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '4px',
                            border: selectedDieIndex === idx ? '2px solid var(--accent-cyan)' : '1px solid var(--panel-border)',
                            background: selectedDieIndex === idx ? 'rgba(0,240,255,0.15)' : 'var(--input-bg)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <MiniDieIcon die={die} /> Die #{idx + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {clickMode === 'hp' && (
                  <p className="field-help-text" style={{ margin: 0 }}>
                    Click any numbered square (1–20) on the preview to place or move the black Initial HP square!
                  </p>
                )}
              </div>

              {/* 4. CUSTOM TOKEN & BACKSIDE IMAGES */}
              <div className="tint-card tint-card-colors">
                <h3 className="subsection-header">🖼️ Custom Token & Backside Images</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label className="field-label">Front Token Image Override</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ width: '100%', fontSize: '0.78rem' }}
                    />
                    {trackerData.customImageUrl && (
                      <button
                        onClick={() => setTrackerData({ ...trackerData, customImageUrl: null })}
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
                        Reset Front Image
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="field-label">Backside Image Override</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackImageUpload}
                      style={{ width: '100%', fontSize: '0.78rem' }}
                    />
                    {trackerData.customBackImageUrl && (
                      <button
                        onClick={() => setTrackerData({ ...trackerData, customBackImageUrl: null })}
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
                        Reset Backside Image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. COLORS & BACKGROUND STYLING */}
              <div className="tint-card tint-card-colors">
                <h3 className="subsection-header">🎨 Colors & Background Styling</h3>

                <div className="color-picker-grid-4">
                  <div className="color-cell">
                    <span className="cell-label">Base Card Color</span>
                    <input
                      type="color"
                      value={trackerData.bgColor}
                      onChange={(e) => setTrackerData({ ...trackerData, bgColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Front Camo Color</span>
                    <input
                      type="color"
                      value={trackerData.camoColor}
                      onChange={(e) => setTrackerData({ ...trackerData, camoColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Backside BG Color</span>
                    <input
                      type="color"
                      value={trackerData.backBgColor}
                      onChange={(e) => setTrackerData({ ...trackerData, backBgColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Backside Camo Color</span>
                    <input
                      type="color"
                      value={trackerData.backCamoColor}
                      onChange={(e) => setTrackerData({ ...trackerData, backCamoColor: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: 'var(--color-cell-bg)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-cell-border)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    <input
                      type="checkbox"
                      checked={trackerData.showCamo}
                      onChange={(e) => setTrackerData({ ...trackerData, showCamo: e.target.checked })}
                    />
                    Front Camo
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    <input
                      type="checkbox"
                      checked={trackerData.showBackCamo}
                      onChange={(e) => setTrackerData({ ...trackerData, showBackCamo: e.target.checked })}
                    />
                    Backside Camo
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    <input
                      type="checkbox"
                      checked={trackerData.showSquareBorders}
                      onChange={(e) => setTrackerData({ ...trackerData, showSquareBorders: e.target.checked })}
                    />
                    Longsquare Borders
                  </label>
                </div>
              </div>

              {/* 6. TEXT ELEMENTS COLORING */}
              <div className="tint-card tint-card-text">
                <h3 className="subsection-header">✒️ Text Elements Coloring</h3>

                <div className="color-picker-grid-6">
                  <div className="color-cell">
                    <span className="cell-label">Title</span>
                    <input
                      type="color"
                      value={trackerData.titleColor}
                      onChange={(e) => setTrackerData({ ...trackerData, titleColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Description</span>
                    <input
                      type="color"
                      value={trackerData.descriptionColor}
                      onChange={(e) => setTrackerData({ ...trackerData, descriptionColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Triangle Num</span>
                    <input
                      type="color"
                      value={trackerData.triangleNumberColor}
                      onChange={(e) => setTrackerData({ ...trackerData, triangleNumberColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Attachment Text</span>
                    <input
                      type="color"
                      value={trackerData.attachmentTextColor}
                      onChange={(e) => setTrackerData({ ...trackerData, attachmentTextColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Footer Name</span>
                    <input
                      type="color"
                      value={trackerData.footerNameColor}
                      onChange={(e) => setTrackerData({ ...trackerData, footerNameColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Square Numbers</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                      <input
                        type="color"
                        value={trackerData.squareNumberColor === 'bgColor' ? trackerData.bgColor : trackerData.squareNumberColor}
                        onChange={(e) => setTrackerData({ ...trackerData, squareNumberColor: e.target.value })}
                      />
                      <button
                        type="button"
                        title="Set square numbers color to background color"
                        onClick={() =>
                          setTrackerData({
                            ...trackerData,
                            squareNumberColor: trackerData.squareNumberColor === 'bgColor' ? '#8c939d' : 'bgColor'
                          })
                        }
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 5px',
                          background: trackerData.squareNumberColor === 'bgColor' ? 'var(--accent-cyan)' : 'var(--input-bg)',
                          color: trackerData.squareNumberColor === 'bgColor' ? 'var(--bg-dark)' : 'var(--text-primary)',
                          border: '1px solid var(--panel-border)',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        {trackerData.squareNumberColor === 'bgColor' ? 'Matched' : 'Match BG'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. EXPORT & PRESET ACTIONS CARD */}
              <div className="tint-card tint-card-attributes">
                <h3 className="subsection-header">💾 Export & Preset Storage</h3>

                <div>
                  <label className="field-label">Tracker Export Side</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {['front', 'back', 'both'].map((f) => (
                      <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem' }}>
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
                    padding: '0.75rem',
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
                  <span>📥</span> EXPORT UNIT TRACKER ({trackerExportFace.toUpperCase()})
                </button>

                {/* TRACKER SAVE PRESET BOX */}
                <div style={{ paddingTop: '0.6rem', borderTop: '1px dashed var(--panel-border)' }}>
                  <form onSubmit={handleSaveTrackerPreset} style={{ display: 'flex', gap: '0.6rem' }}>
                    <input
                      type="text"
                      placeholder={trackerData.title || 'Preset Name...'}
                      value={trackerSaveName}
                      onChange={(e) => setTrackerSaveName(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '0.4rem 1rem',
                        background: 'var(--accent-cyan)',
                        color: 'var(--bg-dark)',
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

            {/* SWAPPABLE UNIT TRACKER LIVE PREVIEW WITH TABS (STICKY WITHIN SECTION) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                position: 'sticky',
                top: '80px'
              }}
            >
              {/* Swappable Face Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  background: 'var(--input-bg)',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  border: '1px solid var(--panel-border)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setTrackerPreviewSide('front')}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: trackerPreviewSide === 'front' ? 'var(--accent-cyan)' : 'transparent',
                    color: trackerPreviewSide === 'front' ? 'var(--bg-dark)' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Teko', sans-serif",
                    fontSize: '1rem',
                    letterSpacing: '1px'
                  }}
                >
                  FRONT SIDE
                </button>
                <button
                  type="button"
                  onClick={() => setTrackerPreviewSide('back')}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: trackerPreviewSide === 'back' ? 'var(--accent-cyan)' : 'transparent',
                    color: trackerPreviewSide === 'back' ? 'var(--bg-dark)' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Teko', sans-serif",
                    fontSize: '1rem',
                    letterSpacing: '1px'
                  }}
                >
                  BACK SIDE
                </button>
                <button
                  type="button"
                  onClick={() => setTrackerPreviewSide('both')}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: trackerPreviewSide === 'both' ? 'var(--accent-cyan)' : 'transparent',
                    color: trackerPreviewSide === 'both' ? 'var(--bg-dark)' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Teko', sans-serif",
                    fontSize: '1rem',
                    letterSpacing: '1px'
                  }}
                >
                  BOTH SIDES
                </button>
              </div>

              {/* Render Selected Preview */}
              {(trackerPreviewSide === 'front' || trackerPreviewSide === 'both') && (
                <div>
                  <h3 style={{ color: 'var(--accent-cyan)', margin: '0 0 0.4rem 0', textAlign: 'center', fontFamily: "'Teko', sans-serif", fontSize: '1.3rem', letterSpacing: '1px' }}>
                    FRONT SIDE PREVIEW
                  </h3>
                  <UnitTracker
                    tokenData={tokenData}
                    trackerData={trackerData}
                    side="front"
                    width={420}
                    onSquareClick={handleSquareClick}
                  />
                </div>
              )}

              {(trackerPreviewSide === 'back' || trackerPreviewSide === 'both') && (
                <div>
                  <h3 style={{ color: 'var(--accent-cyan)', margin: '0 0 0.4rem 0', textAlign: 'center', fontFamily: "'Teko', sans-serif", fontSize: '1.3rem', letterSpacing: '1px' }}>
                    BACK SIDE PREVIEW
                  </h3>
                  <UnitTracker
                    tokenData={tokenData}
                    trackerData={trackerData}
                    side="back"
                    width={420}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* JOINT CAPABILITY CARDS SECTION */}
      <section className="capability-card-section" id="capability-card" style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            background: 'var(--panel-bg)',
            padding: '1.25rem',
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
              background: 'var(--panel-bg)',
              color: 'var(--accent-cyan)',
              fontSize: '0.75rem',
              padding: '0 8px',
              letterSpacing: '1.5px',
              border: '1px solid var(--accent-cyan)'
            }}
          >
            /// CAPABILITY_CARD_GENERATOR
          </div>

          <h2
            style={{
              marginTop: '0',
              marginBottom: '1rem',
              color: 'var(--accent-cyan)',
              fontFamily: "'Teko', sans-serif",
              fontSize: '1.8rem',
              letterSpacing: '1.5px',
              borderBottom: '1px solid var(--panel-border)',
              paddingBottom: '0.4rem',
              textTransform: 'uppercase'
            }}
          >
            Joint Capability Cards Builder (5.5cm x 9.5cm)
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1.5rem',
              alignItems: 'start'
            }}
            className="tracker-grid"
          >
            {/* Card Form Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

              {/* 1. CARD TYPE & TOP STRIP DESIGN */}
              <div className="tint-card tint-card-attributes">
                <h3 className="subsection-header">🎴 Card Type & Top Strip Configuration</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="field-label">Card Title</label>
                    <input
                      type="text"
                      value={cardData.title}
                      onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="field-label">Card Type (Top Strip Color & Icon)</label>
                    <select
                      value={cardData.cardType}
                      onChange={(e) => setCardData({ ...cardData, cardType: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      <option value="fires">🔴 Red - Fires</option>
                      <option value="maneuver">🟢 Green - Maneuver</option>
                      <option value="interception">🟣 Purple - Interception</option>
                      <option value="info_ops">🔵 Blue - Information Operations</option>
                      <option value="c5isr">🟡 Yellow - C5ISR</option>
                      <option value="custom">⚙️ Custom Type</option>
                    </select>
                  </div>
                </div>

                {cardData.cardType === 'custom' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Custom Type Name</label>
                      <input
                        type="text"
                        placeholder="Special Ops"
                        value={cardData.customTypeTitle}
                        onChange={(e) => setCardData({ ...cardData, customTypeTitle: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label className="field-label">Custom Top Strip Color</label>
                      <input
                        type="color"
                        value={cardData.customStripColor}
                        onChange={(e) => setCardData({ ...cardData, customStripColor: e.target.value })}
                        style={{ width: '100%', height: '36px', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
                  <div>
                    <label className="field-label">Cost (Top Left Circle 0–5)</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={cardData.cost}
                      onChange={(e) => {
                        const val = Math.min(5, Math.max(0, parseInt(e.target.value) || 0));
                        setCardData({ ...cardData, cost: val });
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="field-label">Size Number (▲ 1–50)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={cardData.sizeNumber}
                      onChange={(e) => {
                        const val = Math.min(50, Math.max(1, parseInt(e.target.value) || 1));
                        setCardData({ ...cardData, sizeNumber: val });
                      }}
                      disabled={!cardData.showSizeTriangle}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      <input
                        type="checkbox"
                        checked={cardData.showSizeTriangle}
                        onChange={(e) => setCardData({ ...cardData, showSizeTriangle: e.target.checked })}
                      />
                      Show Size Triangle (▲)
                    </label>
                  </div>
                </div>
              </div>

              {/* 2. MAIN BODY, IMAGE & FEATURE ICONS */}
              <div className="tint-card tint-card-grid">
                <h3 className="subsection-header">🖼️ Photo & Body Description</h3>

                <div>
                  <label className="field-label">Import Photo (Middle Image Container)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCardImageUpload}
                    style={{ width: '100%', fontSize: '0.78rem' }}
                  />
                  {cardData.customImageUrl && (
                    <button
                      onClick={() => setCardData({ ...cardData, customImageUrl: null })}
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
                      Reset Photo
                    </button>
                  )}
                </div>

                <div>
                  <label className="field-label">Body Text (Description)</label>
                  <textarea
                    rows="3"
                    value={cardData.bodyText}
                    onChange={(e) => setCardData({ ...cardData, bodyText: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.5rem',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label className="field-label">Feature Icons (Dark Squares on Left Side)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)' }}>
                    {['PERSIST', 'INTERCEPT', 'ATTACH', 'NULLIFY', 'FTR'].map((tag) => (
                      <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 'bold' }}>
                        <input
                          type="checkbox"
                          checked={!!cardData.featureTags[tag]}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              featureTags: {
                                ...cardData.featureTags,
                                [tag]: e.target.checked
                              }
                            })
                          }
                        />
                        {tag}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. LORE & SET DESIGNATION */}
              <div className="tint-card tint-card-text">
                <h3 className="subsection-header">📜 Lore Box & Set Designation</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      <input
                        type="checkbox"
                        checked={cardData.showLore}
                        onChange={(e) => setCardData({ ...cardData, showLore: e.target.checked })}
                      />
                      Enable Bottom Lore Field
                    </label>
                  </div>

                  <div>
                    <label className="field-label">Set Name & Number (Bottom Right)</label>
                    <input
                      type="text"
                      value={cardData.setNameNumber}
                      onChange={(e) => setCardData({ ...cardData, setNameNumber: e.target.value })}
                      placeholder="e.g. USMC 999"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {cardData.showLore && (
                  <div>
                    <label className="field-label">Lore Text</label>
                    <textarea
                      rows="2"
                      value={cardData.loreText}
                      onChange={(e) => setCardData({ ...cardData, loreText: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.4rem 0.5rem',
                        borderRadius: '4px',
                        fontFamily: 'inherit',
                        fontSize: '0.82rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 4. COLORS & BACKSIDE OPTIONS */}
              <div className="tint-card tint-card-colors">
                <h3 className="subsection-header">🎨 Card Colors & Back Side Customization</h3>

                <div className="color-picker-grid-6">
                  <div className="color-cell">
                    <span className="cell-label">Border Color</span>
                    <input
                      type="color"
                      value={cardData.borderColor}
                      onChange={(e) => setCardData({ ...cardData, borderColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Card BG</span>
                    <input
                      type="color"
                      value={cardData.bgColor}
                      onChange={(e) => setCardData({ ...cardData, bgColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Text Color</span>
                    <input
                      type="color"
                      value={cardData.cardTextColor}
                      onChange={(e) => setCardData({ ...cardData, cardTextColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Strip Text</span>
                    <input
                      type="color"
                      value={cardData.topStripTextColor}
                      onChange={(e) => setCardData({ ...cardData, topStripTextColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Lore BG</span>
                    <input
                      type="color"
                      value={cardData.loreBgColor}
                      onChange={(e) => setCardData({ ...cardData, loreBgColor: e.target.value })}
                    />
                  </div>

                  <div className="color-cell">
                    <span className="cell-label">Backside BG</span>
                    <input
                      type="color"
                      value={cardData.backBgColor}
                      onChange={(e) => setCardData({ ...cardData, backBgColor: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.4rem' }}>
                  <div>
                    <label className="field-label">Back Side Header Title</label>
                    <input
                      type="text"
                      value={cardData.backTitle}
                      onChange={(e) => setCardData({ ...cardData, backTitle: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="field-label">Custom Backside Emblem/Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCardBackImageUpload}
                      style={{ width: '100%', fontSize: '0.78rem' }}
                    />
                    {cardData.customBackImageUrl && (
                      <button
                        onClick={() => setCardData({ ...cardData, customBackImageUrl: null })}
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
                        Reset Back Image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. EXPORT & PRESET ACTIONS CARD */}
              <div className="tint-card tint-card-attributes">
                <h3 className="subsection-header">💾 Export & Preset Storage</h3>

                <div>
                  <label className="field-label">Capability Card Export Side</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {['front', 'back', 'both'].map((f) => (
                      <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                          type="radio"
                          name="cardExportFace"
                          value={f}
                          checked={cardExportFace === f}
                          onChange={(e) => setCardExportFace(e.target.value)}
                        />
                        {f.toUpperCase()}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleDownloadCardPNG}
                  style={{
                    padding: '0.75rem',
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
                  <span>📥</span> EXPORT CAPABILITY CARD ({cardExportFace.toUpperCase()})
                </button>

                {/* CARD SAVE PRESET BOX */}
                <div style={{ paddingTop: '0.6rem', borderTop: '1px dashed var(--panel-border)' }}>
                  <form onSubmit={handleSaveCardPreset} style={{ display: 'flex', gap: '0.6rem' }}>
                    <input
                      type="text"
                      placeholder={cardData.title || 'Preset Name...'}
                      value={cardSaveName}
                      onChange={(e) => setCardSaveName(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '0.4rem 1rem',
                        background: 'var(--accent-cyan)',
                        color: 'var(--bg-dark)',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontFamily: "'Teko', sans-serif",
                        fontSize: '1.1rem',
                        letterSpacing: '1px'
                      }}
                    >
                      SAVE CARD
                    </button>
                  </form>
                </div>
              </div>

            </div>

            {/* SWAPPABLE CAPABILITY CARD LIVE PREVIEW WITH TABS (STICKY WITHIN SECTION) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                position: 'sticky',
                top: '80px'
              }}
            >
              {/* Swappable Face Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  background: 'var(--input-bg)',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  border: '1px solid var(--panel-border)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setCardPreviewSide('front')}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: cardPreviewSide === 'front' ? 'var(--accent-cyan)' : 'transparent',
                    color: cardPreviewSide === 'front' ? 'var(--bg-dark)' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Teko', sans-serif",
                    fontSize: '1rem',
                    letterSpacing: '1px'
                  }}
                >
                  FRONT SIDE
                </button>
                <button
                  type="button"
                  onClick={() => setCardPreviewSide('back')}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: cardPreviewSide === 'back' ? 'var(--accent-cyan)' : 'transparent',
                    color: cardPreviewSide === 'back' ? 'var(--bg-dark)' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Teko', sans-serif",
                    fontSize: '1rem',
                    letterSpacing: '1px'
                  }}
                >
                  BACK SIDE
                </button>
                <button
                  type="button"
                  onClick={() => setCardPreviewSide('both')}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: cardPreviewSide === 'both' ? 'var(--accent-cyan)' : 'transparent',
                    color: cardPreviewSide === 'both' ? 'var(--bg-dark)' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Teko', sans-serif",
                    fontSize: '1rem',
                    letterSpacing: '1px'
                  }}
                >
                  BOTH SIDES
                </button>
              </div>

              {/* Render Selected Preview */}
              {(cardPreviewSide === 'front' || cardPreviewSide === 'both') && (
                <div>
                  <h3 style={{ color: 'var(--accent-cyan)', margin: '0 0 0.4rem 0', textAlign: 'center', fontFamily: "'Teko', sans-serif", fontSize: '1.3rem', letterSpacing: '1px' }}>
                    FRONT SIDE PREVIEW
                  </h3>
                  <JointCapabilityCard
                    cardData={cardData}
                    side="front"
                    width={330}
                  />
                </div>
              )}

              {(cardPreviewSide === 'back' || cardPreviewSide === 'both') && (
                <div>
                  <h3 style={{ color: 'var(--accent-cyan)', margin: '0 0 0.4rem 0', textAlign: 'center', fontFamily: "'Teko', sans-serif", fontSize: '1.3rem', letterSpacing: '1px' }}>
                    BACK SIDE PREVIEW
                  </h3>
                  <JointCapabilityCard
                    cardData={cardData}
                    side="back"
                    width={330}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
