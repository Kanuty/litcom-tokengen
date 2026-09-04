import React from 'react';

// Default type configurations
const CARD_TYPES = {
  fires: {
    name: 'Fires',
    color: '#d32f2f',
    textColor: '#ffffff',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
};

// Feature tags icons
const FEATURE_TAG_ICONS = {
  PERSIST: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6" />
      <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  ),
  INTERCEPT: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  ATTACH: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  NULLIFY: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  FTR: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
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
    customTypeTitle = '',
    cost = 2, // 0 to 5
    showSizeTriangle = true,
    sizeNumber = 1,
    customStripColor = '#d32f2f',
    customImageUrl = null,
    bodyText = 'Provides long-range anti-ship missile defense against surface combatants in contested littoral zones.',
    featureTags = { PERSIST: true, INTERCEPT: false, ATTACH: true, NULLIFY: false, FTR: false },
    showFeatureIconLabels = true,
    showLore = true,
    loreText = 'Deployed rapidly to sea denial zones in the Indo-Pacific theater.',
    setNameNumber = 'USMC 999',
    // Styling
    borderColor = '#000000',
    borderWidth = 6,
    bgColor = '#cbd5e1', // greyish base background
    camoColor = '#4a5568',
    showCamo = true,
    descBgColor = '#ffffff', // white description area by default
    cardTextColor = '#000000', // black text by default
    topStripTextColor = '#ffffff',
    loreBgColor = '#f1f5f9',
    loreTextColor = '#1e293b',
    // Back side options
    backBgColor = '#2b6cb0',
    backCamoColor = '#1a365d',
    showBackCamo = true,
    customBackImageUrl = null
  } = cardData;

  // Height calculated strictly for 5.5cm wide x 9.5cm height ratio
  // 9.5 / 5.5 = 1.727272...
  const height = Math.round(width * (9.5 / 5.5));

  const selectedTypeObj = CARD_TYPES[cardType] || CARD_TYPES.custom;
  const stripBgColor = cardType === 'custom' ? customStripColor : selectedTypeObj.color;
  const typeDisplayName = cardType === 'custom' && customTypeTitle ? customTypeTitle : selectedTypeObj.name;

  // Backside rendering (similar to unit tracker card)
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
              color: '#ffffff',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: `${Math.round(width * 0.42)}px`,
                height: `${Math.round(width * 0.42)}px`,
                borderRadius: '50%',
                border: '4px double #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.25)',
                marginBottom: '12px'
              }}
            >
              <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div style={{ fontSize: `${Math.round(width * 0.055)}px`, fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
              JOINT CAPABILITY CARD
            </div>
            <div style={{ fontSize: `${Math.round(width * 0.038)}px`, opacity: 0.9, marginTop: '4px' }}>
              {setNameNumber}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active feature tags array
  const activeTags = Object.keys(featureTags).filter((tag) => featureTags[tag]);

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
            opacity: 0.15,
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

      {/* 1. TOP STRIP */}
      <div
        style={{
          backgroundColor: stripBgColor,
          color: topStripTextColor,
          height: `${Math.round(height * 0.095)}px`,
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid #000000',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Left Side: Cost Number as a square seamlessly integrated into top strip (no background circle/container) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${Math.round(height * 0.065)}px`,
            height: `${Math.round(height * 0.065)}px`,
            fontSize: `${Math.round(height * 0.055)}px`,
            fontWeight: '900',
            fontFamily: "'Teko', 'Trebuchet MS', sans-serif",
            lineHeight: 1,
            flexShrink: 0
          }}
          title={`Cost: ${cost}`}
        >
          {cost}
        </div>

        {/* Left Aligned Title & Visible Type Subtitle */}
        <div
          style={{
            flex: 1,
            textAlign: 'left',
            paddingLeft: '10px',
            paddingRight: '6px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              fontSize: `${Math.round(height * 0.034)}px`,
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.1
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: `${Math.round(height * 0.021)}px`,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              opacity: 0.95,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {typeDisplayName}
          </div>
        </div>

        {/* Right Side: Bigger/Wider Size Triangle (no border) and Type Icon (no background) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Size Triangle (▲ 1), wider and bigger, positioned before the icon */}
          {showSizeTriangle && (
            <div
              style={{
                position: 'relative',
                width: `${Math.round(height * 0.068)}px`,
                height: `${Math.round(height * 0.068)}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={`Size: ${sizeNumber}`}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <polygon points="50,5 95,92 5,92" fill="#ffffff" stroke="none" />
                <text x="50" y="78" fill="#000000" fontSize="52" fontWeight="900" textAnchor="middle" fontFamily="'Trebuchet MS', sans-serif">
                  {sizeNumber}
                </text>
              </svg>
            </div>
          )}

          {/* Type Icon (No background container) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: topStripTextColor
            }}
            title={`Type: ${typeDisplayName}`}
          >
            {selectedTypeObj.icon}
          </div>
        </div>
      </div>

      {/* 2. PHOTO CONTAINER */}
      <div
        style={{
          width: '100%',
          height: `${Math.round(height * 0.38)}px`,
          backgroundColor: '#020617',
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
          <div style={{ textAlign: 'center', color: '#64748b', padding: '10px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 6px auto', display: 'block' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ fontSize: `${Math.round(width * 0.035)}px`, letterSpacing: '1px' }}>PHOTO AREA</span>
          </div>
        )}
      </div>

      {/* 3. MAIN BODY (WHITE DESCRIPTION AREA WITH BLACK TEXT DEFAULT & FEATURE ICONS WITHOUT BORDERS) */}
      <div
        style={{
          flex: 1,
          padding: '8px',
          display: 'flex',
          gap: '8px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        {/* Left Side: Feature Icons Stack (NO BORDERS) */}
        {activeTags.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
            {activeTags.map((tagKey) => (
              <div
                key={tagKey}
                style={{
                  width: `${Math.round(width * 0.13)}px`,
                  minHeight: `${Math.round(width * 0.13)}px`,
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none', // No border
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px 2px'
                }}
                title={tagKey}
              >
                <div style={{ color: '#00f0ff' }}>
                  {FEATURE_TAG_ICONS[tagKey] || FEATURE_TAG_ICONS.PERSIST}
                </div>
                {showFeatureIconLabels && (
                  <span
                    style={{
                      fontSize: `${Math.round(width * 0.024)}px`,
                      fontWeight: 'bold',
                      marginTop: '2px',
                      letterSpacing: '0.5px',
                      fontFamily: "'Share Tech Mono', monospace"
                    }}
                  >
                    {tagKey}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Description Box: White background with black text by default */}
        <div
          style={{
            flex: 1,
            backgroundColor: descBgColor,
            color: '#000000',
            padding: '8px 10px',
            borderRadius: '3px',
            border: '2px solid #000000',
            fontSize: `${Math.round(height * 0.024)}px`,
            lineHeight: 1.35,
            overflowY: 'auto',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            fontWeight: '600'
          }}
        >
          {bodyText}
        </div>
      </div>

      {/* 4. FOOTER AREA (LORE & VERTICAL SET DESIGNATION) */}
      <div
        style={{
          padding: '6px 8px 8px 8px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '8px',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Lore Box */}
        <div style={{ flex: 1 }}>
          {showLore && (
            <div
              style={{
                backgroundColor: loreBgColor,
                color: loreTextColor,
                padding: '5px 8px',
                borderRadius: '3px',
                fontSize: `${Math.round(height * 0.02)}px`,
                fontStyle: 'italic',
                lineHeight: 1.25,
                borderLeft: `4px solid ${stripBgColor}`,
                border: '1px solid #cbd5e1'
              }}
            >
              {loreText}
            </div>
          )}
        </div>

        {/* Bottom Right Vertical Set Designation Number (e.g. USMC 999) */}
        <div
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: `${Math.round(height * 0.022)}px`,
            fontWeight: '900',
            fontFamily: "'Share Tech Mono', 'Trebuchet MS', monospace",
            color: '#000000',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            alignSelf: 'center',
            paddingLeft: '2px'
          }}
        >
          {setNameNumber}
        </div>
      </div>
    </div>
  );
}
