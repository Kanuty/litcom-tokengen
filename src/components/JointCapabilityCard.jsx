import React from 'react';

// Default type configurations
export const CARD_TYPES = {
  fires: {
    name: 'Fires',
    color: '#d32f2f',
    textColor: '#ffffff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
};

// Feature tags icons
export const FEATURE_TAG_ICONS = {
  PERSIST: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6" />
      <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  ),
  INTERCEPT: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  ATTACH: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  NULLIFY: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  FTR: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    bodyText = 'Provides long-range anti-ship missile defense against surface combatants.',
    featureTags = { PERSIST: true, INTERCEPT: false, ATTACH: true, NULLIFY: false, FTR: false },
    showLore = true,
    loreText = 'Deployed rapidly to sea denial zones in the Indo-Pacific theater.',
    setNameNumber = 'USMC 999',
    // Styling
    borderColor = '#00f0ff',
    borderWidth = 3,
    bgColor = '#0f172a',
    cardTextColor = '#f8fafc',
    topStripTextColor = '#ffffff',
    loreBgColor = '#1e293b',
    loreTextColor = '#94a3b8',
    // Back side options
    backBgColor = '#0f172a',
    backCamoColor = '#1e293b',
    showBackCamo = true,
    backTitle = 'JOINT CAPABILITY CARD',
    backSubtitle = 'LITTORAL COMMANDER SUITE',
    customBackImageUrl = null
  } = cardData;

  // Height calculated strictly for 5.5cm wide x 9.5cm height ratio
  // 9.5 / 5.5 = 1.727272...
  const height = Math.round(width * (9.5 / 5.5));

  const selectedTypeObj = CARD_TYPES[cardType] || CARD_TYPES.custom;
  const stripBgColor = cardType === 'custom' ? customStripColor : selectedTypeObj.color;
  const typeDisplayName = cardType === 'custom' && customTypeTitle ? customTypeTitle : selectedTypeObj.name;

  if (side === 'back') {
    return (
      <div
        id={id}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: backBgColor,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: '12px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          fontFamily: "'Share Tech Mono', 'Courier New', monospace",
          color: cardTextColor
        }}
      >
        {/* Optional Camo Pattern Background */}
        {showBackCamo && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.18,
              backgroundImage: `radial-gradient(${backCamoColor} 30%, transparent 31%), radial-gradient(${backCamoColor} 30%, transparent 31%)`,
              backgroundPosition: '0 0, 15px 15px',
              backgroundSize: '30px 30px',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Back Frame Border */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            border: `1px dashed ${borderColor}`,
            borderRadius: '8px',
            opacity: 0.5,
            pointerEvents: 'none'
          }}
        />

        {/* Header */}
        <div style={{ textAlign: 'center', zIndex: 1, marginTop: '12px' }}>
          <div
            style={{
              fontSize: `${Math.round(width * 0.04)}px`,
              letterSpacing: '2px',
              color: borderColor,
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
          >
            /// LITTORAL COMMANDER
          </div>
        </div>

        {/* Center Graphic / Custom Back Image */}
        <div
          style={{
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            width: '100%',
            padding: '10px'
          }}
        >
          {customBackImageUrl ? (
            <img
              src={customBackImageUrl}
              alt="Back Emblem"
              style={{
                maxWidth: '85%',
                maxHeight: '60%',
                objectFit: 'contain',
                borderRadius: '8px',
                border: `1px solid ${borderColor}`
              }}
            />
          ) : (
            <div
              style={{
                width: `${Math.round(width * 0.45)}px`,
                height: `${Math.round(width * 0.45)}px`,
                borderRadius: '50%',
                border: `3px double ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.3)',
                boxShadow: `0 0 15px ${borderColor}33`
              }}
            >
              <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke={borderColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
          )}

          <h3
            style={{
              marginTop: '16px',
              marginBottom: '4px',
              fontFamily: "'Teko', sans-serif",
              fontSize: `${Math.round(width * 0.08)}px`,
              letterSpacing: '2px',
              textAlign: 'center',
              textTransform: 'uppercase',
              lineHeight: 1.1
            }}
          >
            {backTitle}
          </h3>

          <div
            style={{
              fontSize: `${Math.round(width * 0.035)}px`,
              color: loreTextColor,
              letterSpacing: '1px',
              textAlign: 'center'
            }}
          >
            {backSubtitle}
          </div>
        </div>

        {/* Footer Set Name */}
        <div style={{ zIndex: 1, marginBottom: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: `${Math.round(width * 0.038)}px`, fontWeight: 'bold', color: borderColor, letterSpacing: '1px' }}>
            {setNameNumber}
          </div>
        </div>
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
        borderRadius: '12px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        fontFamily: "'Trebuchet MS', Arial, sans-serif",
        color: cardTextColor
      }}
    >
      {/* 1. TOP STRIP */}
      <div
        style={{
          backgroundColor: stripBgColor,
          color: topStripTextColor,
          height: `${Math.round(height * 0.088)}px`,
          padding: '0 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `2px solid ${borderColor}`,
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Left Side: Cost Badge & Optional Size Triangle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Cost Circle */}
          <div
            style={{
              width: `${Math.round(height * 0.06)}px`,
              height: `${Math.round(height * 0.06)}px`,
              borderRadius: '50%',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: '2px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: `${Math.round(height * 0.038)}px`,
              fontFamily: "'Share Tech Mono', monospace",
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
            title={`Cost: ${cost}`}
          >
            {cost}
          </div>

          {/* Size Triangle */}
          {showSizeTriangle && (
            <div
              style={{
                position: 'relative',
                width: `${Math.round(height * 0.05)}px`,
                height: `${Math.round(height * 0.05)}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={`Size: ${sizeNumber}`}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <polygon points="50,10 90,85 10,85" fill="#ffffff" stroke="#000000" strokeWidth="6" />
                <text x="50" y="72" fill="#000000" fontSize="42" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                  {sizeNumber}
                </text>
              </svg>
            </div>
          )}
        </div>

        {/* Middle: Title */}
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '0 6px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              fontSize: `${Math.round(height * 0.031)}px`,
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: "'Teko', sans-serif",
              lineHeight: 1
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: `${Math.round(height * 0.018)}px`, opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {typeDisplayName}
          </div>
        </div>

        {/* Right Side: Type Icon Badge */}
        <div
          style={{
            width: `${Math.round(height * 0.058)}px`,
            height: `${Math.round(height * 0.058)}px`,
            borderRadius: '6px',
            backgroundColor: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={`Type: ${typeDisplayName}`}
        >
          {selectedTypeObj.icon}
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
          borderBottom: `2px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
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

      {/* 3. MAIN BODY & FEATURE TAGS */}
      <div
        style={{
          flex: 1,
          padding: '8px',
          display: 'flex',
          gap: '8px',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Left Side: Dark Square Feature Tags Stack */}
        {activeTags.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
            {activeTags.map((tagKey) => (
              <div
                key={tagKey}
                style={{
                  width: `${Math.round(width * 0.12)}px`,
                  minHeight: `${Math.round(width * 0.12)}px`,
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
                title={tagKey}
              >
                <div style={{ color: borderColor }}>
                  {FEATURE_TAG_ICONS[tagKey] || FEATURE_TAG_ICONS.PERSIST}
                </div>
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
              </div>
            ))}
          </div>
        )}

        {/* Right Side: Description Text */}
        <div
          style={{
            flex: 1,
            fontSize: `${Math.round(height * 0.023)}px`,
            lineHeight: 1.35,
            color: cardTextColor,
            overflowY: 'auto',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap'
          }}
        >
          {bodyText}
        </div>
      </div>

      {/* 4. FOOTER AREA (LORE & SET DESIGNATION) */}
      <div
        style={{
          padding: '6px 8px 8px 8px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          boxSizing: 'border-box'
        }}
      >
        {/* Optional Lore Box */}
        {showLore && (
          <div
            style={{
              backgroundColor: loreBgColor,
              color: loreTextColor,
              padding: '5px 8px',
              borderRadius: '4px',
              fontSize: `${Math.round(height * 0.019)}px`,
              fontStyle: 'italic',
              lineHeight: 1.25,
              borderLeft: `3px solid ${stripBgColor}`
            }}
          >
            {loreText}
          </div>
        )}

        {/* Bottom Right Set Designation */}
        <div
          style={{
            display: 'flex',
            justify: 'flex-end',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              fontSize: `${Math.round(height * 0.021)}px`,
              fontWeight: 'bold',
              fontFamily: "'Share Tech Mono', monospace",
              color: borderColor,
              letterSpacing: '1px'
            }}
          >
            {setNameNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
