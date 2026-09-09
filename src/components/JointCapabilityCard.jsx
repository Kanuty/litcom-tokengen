import React from 'react';

// Default type configurations
const CARD_TYPES = {
  fires: {
    name: 'Fires',
    color: '#dc2626', // red
    textColor: '#ffffff',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="1" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="1" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="23" y2="12" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    )
  },
  maneuver: {
    name: 'Maneuver',
    color: '#2e7d32',
    textColor: '#ffffff',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 19 21 12 17 5 21 12 2" fill="currentColor" opacity="0.3" />
        <polygon points="12 2 19 21 12 17 5 21 12 2" />
      </svg>
    )
  },
  interception: {
    name: 'Interception',
    color: '#7b1fa2',
    textColor: '#ffffff',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" opacity="0.2" />
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    )
  },
  info_ops: {
    name: 'Information Operations',
    color: '#1976d2',
    textColor: '#ffffff',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.9 19.1C1.3 15.5 1.3 9.7 4.9 6.1" />
        <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
        <path d="M19.1 4.9c3.6 3.6 3.6 9.4 0 13" />
      </svg>
    )
  },
  c5isr: {
    name: 'C5ISR',
    color: '#d97706',
    textColor: '#ffffff',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    )
  },
  custom: {
    name: 'Custom',
    color: '#475569',
    textColor: '#ffffff',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
};

// Feature tags icons (matching real game card icons, foreground color configurable via currentColor)
const FEATURE_TAG_ICONS = {
  // Infinity loop symbol with inner dots
  PERSIST: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12C9.5 15.5 6.8 17 4.5 17C2.2 17 0.8 15 0.8 12.5C0.8 10 2.2 8 4.5 8C6.8 8 9.5 9.5 12 12C14.5 14.5 17.2 16 19.5 16C21.8 16 23.2 14 23.2 11.5C23.2 9 21.8 7 19.5 7C17.2 7 14.5 8.5 12 12Z"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="5" cy="12.5" r="1.3" fill="currentColor" />
      <circle cx="19" cy="11.5" r="1.3" fill="currentColor" />
    </svg>
  ),
  // SAM Launcher / Missile Truck silhouette from SAM.png
  INTERCEPT: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="11.3,4.8 12.9,8.9 9.6,10.8 9.0,14.4 14.6,14.7 15.0,12.2 15.6,11.6 21.2,11.0 23.0,13.6 23.0,15.7 22.6,16.3 21.5,16.4 21.1,18.4 19.9,19.2 18.7,19.0 17.9,18.0 16.6,19.0 15.2,19.0 14.2,18.2 14.1,16.9 9.2,17.1 8.2,18.6 7.1,19.0 5.5,17.9 4.1,18.8 2.7,18.8 1.8,17.9 1.0,15.3 2.0,12.6 1.0,9.9" />
    </svg>
  ),
  // Paperclip icon
  ATTACH: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.41 11.58l-9-9a5.5 5.5 0 0 0-7.78 7.78l9 9a3.5 3.5 0 0 0 4.95-4.95l-9-9a1.5 1.5 0 0 0-2.12 2.12l8.29 8.29" />
    </svg>
  ),
  // Circle with diagonal line from top-right to bottom-left
  NULLIFY: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  ),
  // Fighter jet silhouette from FTR.png
  FTR: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="22.8,1.0 22.1,3.4 18.1,8.3 18.3,9.8 17.2,11.1 17.0,19.1 18.1,20.0 16.0,22.2 15.0,23.0 14.6,22.6 12.6,15.2 11.4,16.3 10.9,21.9 10.3,22.8 9.4,22.3 7.7,19.6 4.5,19.3 4.9,17.8 4.5,16.1 1.2,13.5 2.5,12.7 7.7,12.4 9.0,11.2 1.5,8.8 1.5,8.3 4.5,5.3 4.9,5.3 4.7,6.6 13.1,6.6 13.9,5.8 15.7,6.0 20.4,2.1" />
    </svg>
  ),
  CUSTOM: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
};

export function JointCapabilityCard({
  cardData = {},
  side = 'front',
  width = 330,
  id
}) {
  const {
    title = 'NSM BATTERY',
    cardType = 'fires',
    cost = 2, // 0 to 5
    showSizeTriangle = true,
    sizeNumber = 1,
    customStripColor = '#dc2626',
    customImageUrl = null,
    bodyText = 'Provides long-range anti-ship missile defense against surface combatants in contested littoral zones.',
    featureTags = { PERSIST: true, INTERCEPT: false, ATTACH: true, NULLIFY: false, FTR: false },
    customFeatureTags = [], // [{ id: 'c1', label: 'RADAR', enabled: true }]
    featureIconColor = '#ffffff',
    showFeatureIconLabels = true,
    showLore = true,
    loreText = 'Deployed rapidly to sea denial zones in the Indo-Pacific theater.',
    setNameNumber = 'USMC 999',
    // Fonts
    titleFont = "'Trebuchet MS', 'Arial Bold', sans-serif",
    bodyFont = "'Trebuchet MS', 'Arial Bold', sans-serif",
    loreFont = "'Trebuchet MS', 'Arial Bold', sans-serif",
    // Styling
    borderColor = '#000000',
    borderWidth = 6,
    bgColor = '#e2e8f0', // soft background
    camoColor = '#94a3b8', // subtle camo color
    showCamo = true,
    cardTextColor = '#000000', // black body text resting directly on camo
    topStripTextColor = '#ffffff',
    loreBgColor = '#ffffff', // pure white background per requirement
    loreTextColor = '#000000', // black text per requirement
    // Individual text colors & global text color toggle
    applySingleTextColor = false,
    singleTextColor = '#000000',
    titleTextColor,
    costTextColor,
    cardTypeTextColor,
    bodyTextColor,
    setNumTextColor,
    placeholderColor = '#64748b',
    backEmblemColor = '#ffffff',
    // Back side options
    backBgColor = '#2b6cb0',
    backCamoColor = '#1a365d',
    showBackCamo = true,
    customBackImageUrl = null
  } = cardData;

  // Compute effective text colors with single-color override or individual fallback
  const effTitleColor = applySingleTextColor ? singleTextColor : (titleTextColor || topStripTextColor || '#ffffff');
  const effCostColor = applySingleTextColor ? singleTextColor : (costTextColor || topStripTextColor || '#ffffff');
  const effTypeColor = applySingleTextColor ? singleTextColor : (cardTypeTextColor || topStripTextColor || '#ffffff');
  const effBodyColor = applySingleTextColor ? singleTextColor : (bodyTextColor || cardTextColor || '#000000');
  const effSetNumColor = applySingleTextColor ? singleTextColor : (setNumTextColor || cardTextColor || '#000000');
  const effLoreColor = applySingleTextColor ? singleTextColor : (loreTextColor || '#000000');
  const effFeatureIconColor = applySingleTextColor ? singleTextColor : (featureIconColor || '#ffffff');

  // Height calculated strictly for 5.5cm wide x 9.5cm height ratio
  // 9.5 / 5.5 = 1.727272...
  const height = Math.round(width * (9.5 / 5.5));

  const selectedTypeObj = CARD_TYPES[cardType] || CARD_TYPES.custom;
  const stripBgColor = cardType === 'custom' ? customStripColor : selectedTypeObj.color;

  // Backside rendering (No set number per requirement #1)
  if (side === 'back') {
    return (
      <div
        id={id}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: backBgColor,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: '2px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          fontFamily: "'Trebuchet MS', Arial, sans-serif"
        }}
      >
        {/* Camo Pattern Overlay for Back side */}
        {showBackCamo && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              opacity: 0.2,
              zIndex: 0
            }}
          >
            <pattern id={`camo-card-back-${id || 'default'}`} width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 0,20 Q 30,0 60,30 T 120,20 L 120,60 Q 90,80 60,50 T 0,70 Z" fill={backCamoColor} />
              <path d="M 20,80 Q 50,60 80,90 T 120,100 L 120,120 L 0,120 Z" fill={backCamoColor} />
              <circle cx="30" cy="40" r="15" fill={backCamoColor} />
              <circle cx="90" cy="30" r="22" fill={backCamoColor} />
              <circle cx="70" cy="100" r="18" fill={backCamoColor} />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#camo-card-back-${id || 'default'})`} />
          </svg>
        )}

        {/* Custom User Back Image or Emblem */}
        {customBackImageUrl ? (
          <img
            src={customBackImageUrl}
            alt="Card Back"
            style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }}
          />
        ) : (
          <div
            style={{
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: backEmblemColor,
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: `${Math.round(width * 0.42)}px`,
                height: `${Math.round(width * 0.42)}px`,
                borderRadius: '50%',
                border: `4px double ${backEmblemColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.25)',
                marginBottom: '12px'
              }}
            >
              <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke={backEmblemColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div style={{ fontSize: `${Math.round(width * 0.055)}px`, fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: titleFont }}>
              JOINT CAPABILITY CARD
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active feature tags array (standard + custom) - limited to max 5 total icons per user requirement
  const rawStandard = Object.keys(featureTags)
    .filter((tag) => featureTags[tag])
    .map((tag) => ({ type: 'standard', key: tag, label: tag }));

  const rawCustom = (customFeatureTags || [])
    .filter((tag) => tag.enabled && tag.label.trim() !== '')
    .map((tag) => ({ type: 'custom', key: tag.id, label: tag.label.toUpperCase() }));

  const allActiveIcons = [...rawStandard, ...rawCustom].slice(0, 5);

  return (
    <div
      id={id}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: bgColor,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: '2px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        fontFamily: "'Trebuchet MS', 'Arial Bold', sans-serif",
        color: cardTextColor
      }}
    >
      {/* Camouflage Pattern Background Overlay for Front side */}
      {showCamo && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.08,
            zIndex: 0
          }}
        >
          <pattern id={`camo-card-front-${id || 'default'}`} width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 0,20 Q 30,0 60,30 T 120,20 L 120,60 Q 90,80 60,50 T 0,70 Z" fill={camoColor} />
            <path d="M 20,80 Q 50,60 80,90 T 120,100 L 120,120 L 0,120 Z" fill={camoColor} />
            <circle cx="30" cy="40" r="15" fill={camoColor} />
            <circle cx="90" cy="30" r="22" fill={camoColor} />
            <circle cx="70" cy="100" r="18" fill={camoColor} />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#camo-card-front-${id || 'default'})`} />
        </svg>
      )}

      {/* 1. TOP STRIP WITH CUT CORNERS & DROP SHADOW + PHOTO AREA */}
      <div style={{ position: 'relative', width: '100%', zIndex: 2 }}>
        {/* TOP STRIP */}
        <div
          style={{
            backgroundColor: stripBgColor,
            color: topStripTextColor,
            height: `${Math.round(height * 0.09)}px`,
            margin: '6px 4px 0 4px', // inset slightly from side borders
            display: 'flex',
            alignItems: 'stretch',
            position: 'relative',
            zIndex: 3,
            filter: 'drop-shadow(0 4px 5px rgba(0, 0, 0, 0.75))',
            boxSizing: 'border-box'
          }}
        >
          {/* Left Cost Block (rectangular box) */}
          <div
            style={{
              width: `${Math.round(height * 0.07)}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${Math.round(height * 0.055)}px`,
              fontWeight: '900',
              fontFamily: "'Teko', 'Trebuchet MS', sans-serif",
              lineHeight: 1,
              flexShrink: 0,
              borderRight: '2px solid rgba(0, 0, 0, 0.4)',
              color: effCostColor
            }}
            title={`Cost: ${cost}`}
          >
            {cost}
          </div>

          {/* Right Main Strip with Cut Corner top-right and Notch at bottom-left */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '8px',
              paddingRight: '10px',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%, 0 calc(100% - 8px), 8px 100%, 0 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Title */}
            <div
              style={{
                flex: 1,
                textAlign: 'left',
                overflow: 'hidden',
                paddingRight: '6px'
              }}
            >
              <div
                style={{
                  fontSize: `${Math.round(height * 0.033)}px`,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.1,
                  fontFamily: titleFont,
                  color: effTitleColor
                }}
              >
                {title}
              </div>
            </div>

            {/* Right Side: Size Triangle and Type Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              {showSizeTriangle && (
                <div
                  style={{
                    position: 'relative',
                    width: `${Math.round(height * 0.088)}px`,
                    height: `${Math.round(height * 0.062)}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={`Size: ${sizeNumber}`}
                >
                  <svg width="100%" height="100%" viewBox="0 0 140 100" preserveAspectRatio="none">
                    <polygon points="70,5 138,95 2,95" fill="#ffffff" stroke="none" />
                    <text x="70" y="80" fill="#000000" fontSize="54" fontWeight="900" textAnchor="middle" fontFamily="'Trebuchet MS', sans-serif">
                      {sizeNumber}
                    </text>
                  </svg>
                </div>
              )}

              {/* Type Icon */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: effTypeColor
                }}
              >
                {selectedTypeObj.icon}
              </div>
            </div>
          </div>
        </div>

        {/* 2. PHOTO CONTAINER (Narrower than top strip, covered by strip shadow) */}
        <div
          style={{
            margin: '-12px 10px 0 10px', // slightly inset horizontally so top strip is wider than image
            height: `${Math.round(height * 0.36)}px`,
            backgroundColor: '#0f172a',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '3px solid #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          {customImageUrl ? (
            <img
              src={customImageUrl}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: placeholderColor, padding: '10px' }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={placeholderColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 6px auto', display: 'block' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span style={{ fontSize: `${Math.round(width * 0.035)}px`, letterSpacing: '1px', fontWeight: 'bold' }}>PHOTO AREA</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. MAIN BODY: FEATURE ICONS VERTICALLY ON THE LEFT SIDE (STRICTLY SQUARE DARK BLOCKS) + DESCRIPTION TEXT */}
      <div
        style={{
          flex: 1,
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          alignItems: 'stretch',
          boxSizing: 'border-box',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        {/* Left Vertical Column: Feature Icons in strictly SQUARE dark blocks */}
        {allActiveIcons.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              flexShrink: 0
            }}
          >
            {allActiveIcons.map((iconItem, idx) => (
              <div
                key={iconItem.key || idx}
                style={{
                  backgroundColor: '#0f172a',
                  color: effFeatureIconColor,
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: `${Math.round(height * 0.065)}px`,
                  height: `${Math.round(height * 0.065)}px`,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  boxSizing: 'border-box',
                  padding: '2px'
                }}
                title={iconItem.label}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {iconItem.type === 'standard'
                    ? (FEATURE_TAG_ICONS[iconItem.key] || FEATURE_TAG_ICONS.PERSIST)
                    : FEATURE_TAG_ICONS.CUSTOM}
                </div>
                {showFeatureIconLabels && (
                  <span
                    style={{
                      fontSize: `${Math.max(7, Math.round(width * 0.021))}px`,
                      fontWeight: 'bold',
                      letterSpacing: '0.2px',
                      fontFamily: "'Share Tech Mono', monospace",
                      lineHeight: 1,
                      marginTop: '2px',
                      textAlign: 'center',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {iconItem.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Right Side: Body Description Text resting directly on camo background */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            color: effBodyColor,
            padding: '2px 0',
            fontSize: `${Math.round(height * 0.024)}px`,
            lineHeight: 1.35,
            overflowY: 'auto',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            fontWeight: 'bold',
            fontFamily: bodyFont
          }}
        >
          {bodyText}
        </div>

        {/* Vertical Set Designation Number (USMC 999) */}
        {setNameNumber && (
          <div
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${Math.round(height * 0.022)}px`,
              fontWeight: '900',
              fontFamily: "'Share Tech Mono', 'Trebuchet MS', monospace",
              color: effSetNumColor,
              letterSpacing: '1px',
              paddingLeft: '2px',
              userSelect: 'none'
            }}
          >
            {setNameNumber}
          </div>
        )}
      </div>

      {/* 4. LORE PART AT BOTTOM (FULL WIDTH FROM LEFT TO RIGHT, NO BORDER, NO MARGINS) */}
      {showLore && (
        <div
          style={{
            width: '100%',
            backgroundColor: loreBgColor,
            color: effLoreColor,
            padding: '6px 10px',
            fontSize: `${Math.round(height * 0.02)}px`,
            fontStyle: 'italic',
            lineHeight: 1.25,
            boxSizing: 'border-box',
            zIndex: 1,
            fontFamily: loreFont
          }}
        >
          {loreText}
        </div>
      )}
    </div>
  );
}
