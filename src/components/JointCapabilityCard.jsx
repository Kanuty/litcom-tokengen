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

// Feature tags icons (smaller, clean white stroke)
const FEATURE_TAG_ICONS = {
  PERSIST: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6" />
      <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  ),
  INTERCEPT: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  ATTACH: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  NULLIFY: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  FTR: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
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
    // Styling
    borderColor = '#000000',
    borderWidth = 6,
    bgColor = '#cbd5e1', // light camouflage background
    camoColor = '#4a5568',
    showCamo = true,
    cardTextColor = '#000000', // black body text resting directly on camo
    topStripTextColor = '#ffffff',
    loreBgColor = '#334155',
    loreTextColor = '#ffffff',
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
          </div>
        )}
      </div>
    );
  }

  // Active feature tags array (standard + custom)
  const activeStandardTags = Object.keys(featureTags).filter((tag) => featureTags[tag]);
  const activeCustomTags = (customFeatureTags || []).filter((tag) => tag.enabled && tag.label.trim() !== '');

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
            opacity: 0.18,
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

      {/* 1. TOP STRIP (CHAMFERED CORNER CUT, NO TYPE NAME TEXT DISPLAYED PER REQUIREMENT #10) */}
      <div
        style={{
          backgroundColor: stripBgColor,
          color: topStripTextColor,
          height: `${Math.round(height * 0.09)}px`,
          padding: '0 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid #000000',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 2,
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'
        }}
      >
        {/* Left Side: Cost Number */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${Math.round(height * 0.06)}px`,
            height: `${Math.round(height * 0.06)}px`,
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

        {/* Title (No Type Name displayed below title per requirement #10) */}
        <div
          style={{
            flex: 1,
            textAlign: 'left',
            paddingLeft: '8px',
            paddingRight: '6px',
            overflow: 'hidden'
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
              lineHeight: 1.1
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
                width: `${Math.round(height * 0.062)}px`,
                height: `${Math.round(height * 0.062)}px`,
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

          {/* Type Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: topStripTextColor
            }}
          >
            {selectedTypeObj.icon}
          </div>
        </div>
      </div>

      {/* 2. PHOTO CONTAINER (CHAMFERED LOWER-RIGHT CORNER PER REQUIREMENT #8) */}
      <div
        style={{
          width: '100%',
          height: `${Math.round(height * 0.38)}px`,
          backgroundColor: '#0f172a',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '3px solid #000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)'
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
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 6px auto', display: 'block' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ fontSize: `${Math.round(width * 0.035)}px`, letterSpacing: '1px' }}>PHOTO AREA</span>
          </div>
        )}
      </div>

      {/* 3. MAIN BODY: FEATURE ICONS ABOVE DESCRIPTION (REQUIREMENT #4) + NO BACKGROUND/BORDER (REQUIREMENT #3) */}
      <div
        style={{
          flex: 1,
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        {/* Feature Icons Row: Placed ABOVE description text, smaller, with white color default (Requirement #2 & #4 & #5) */}
        {(activeStandardTags.length > 0 || activeCustomTags.length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            {/* Standard Feature Tags */}
            {activeStandardTags.map((tagKey) => (
              <div
                key={tagKey}
                style={{
                  backgroundColor: '#0f172a',
                  color: featureIconColor,
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 6px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
                title={tagKey}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {FEATURE_TAG_ICONS[tagKey] || FEATURE_TAG_ICONS.PERSIST}
                </div>
                {showFeatureIconLabels && (
                  <span
                    style={{
                      fontSize: `${Math.round(width * 0.026)}px`,
                      fontWeight: 'bold',
                      letterSpacing: '0.5px',
                      fontFamily: "'Share Tech Mono', monospace"
                    }}
                  >
                    {tagKey}
                  </span>
                )}
              </div>
            ))}

            {/* Custom Feature Tags */}
            {activeCustomTags.map((cTag, idx) => (
              <div
                key={cTag.id || idx}
                style={{
                  backgroundColor: '#0f172a',
                  color: featureIconColor,
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 6px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
                title={cTag.label}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {FEATURE_TAG_ICONS.CUSTOM}
                </div>
                {showFeatureIconLabels && (
                  <span
                    style={{
                      fontSize: `${Math.round(width * 0.026)}px`,
                      fontWeight: 'bold',
                      letterSpacing: '0.5px',
                      fontFamily: "'Share Tech Mono', monospace"
                    }}
                  >
                    {cTag.label.toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Description Text: NO BACKGROUND OR BORDER, rests on camo background (Requirement #3) */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            color: cardTextColor,
            padding: '2px 0',
            fontSize: `${Math.round(height * 0.024)}px`,
            lineHeight: 1.35,
            overflowY: 'auto',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            fontWeight: 'bold'
          }}
        >
          {bodyText}
        </div>
      </div>

      {/* 4. LORE & SET DESIGNATION AT BOTTOM (FULL WIDTH LORE BOX PER REQUIREMENT #7, SET NUMBER PER REQUIREMENT #7) */}
      <div
        style={{
          padding: '4px 8px 6px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Lore Box (Full Width at Bottom, Requirement #7) */}
        {showLore && (
          <div
            style={{
              backgroundColor: loreBgColor,
              color: loreTextColor,
              padding: '6px 8px',
              borderRadius: '2px',
              fontSize: `${Math.round(height * 0.02)}px`,
              fontStyle: 'italic',
              lineHeight: 1.25,
              borderLeft: `4px solid ${stripBgColor}`,
              boxSizing: 'border-box',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)'
            }}
          >
            {loreText}
          </div>
        )}

        {/* Bottom Right Set Designation Number */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            fontSize: `${Math.round(height * 0.022)}px`,
            fontWeight: '900',
            fontFamily: "'Share Tech Mono', 'Trebuchet MS', monospace",
            color: cardTextColor,
            letterSpacing: '1px',
            paddingRight: '2px'
          }}
        >
          {setNameNumber}
        </div>
      </div>
    </div>
  );
}
