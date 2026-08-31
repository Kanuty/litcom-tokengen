import React from 'react';
import { LandToken } from './LandToken';

// MiniDie component to render token dice / supply dice inside tracker squares (without numbers)
export function MiniDie({ die, size = 24 }) {
  if (!die) return null;
  const diceType = die.type || 'red';

  let defaultBg = '#c83232';
  if (diceType === 'green') defaultBg = '#2e7d32';
  if (diceType === 'purple') defaultBg = '#7b1fa2';
  if (diceType === 'blue' || diceType === 'supply') defaultBg = '#1976d2';

  const diceBg = die.color || defaultBg;
  const borderThick = die.hasThickBorder ? true : false;
  const borderColor = die.borderColor || '#ffcc00';
  const strokeW = borderThick ? 7 : 3;
  const strokeC = borderThick ? borderColor : '#ffffff';

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        {diceType === 'red' && (
          <rect x="5" y="5" width="90" height="90" rx="6" fill={diceBg} stroke={strokeC} strokeWidth={strokeW} />
        )}
        {diceType === 'green' && (
          <path
            d="M 5 11 C 5 7.7 7.7 5 11 5 L 89 5 C 92.3 5 95 7.7 95 11 L 95 65 L 65 95 L 11 95 C 7.7 95 5 92.3 5 89 Z"
            fill={diceBg}
            stroke={strokeC}
            strokeWidth={strokeW}
          />
        )}
        {diceType === 'purple' && (
          <polygon
            points="20,5 80,5 96,65 50,95 4,65"
            fill={diceBg}
            stroke={strokeC}
            strokeWidth={strokeW}
          />
        )}
        {(diceType === 'blue' || diceType === 'supply') && (
          <circle cx="50" cy="50" r="45" fill={diceBg} stroke={strokeC} strokeWidth={strokeW} />
        )}
      </svg>
    </div>
  );
}

export function UnitTracker({
  id = 'unit-tracker-export',
  tokenData,
  trackerData,
  side = 'front', // 'front' | 'back'
  width = 475,
  onSquareClick
}) {
  // Ratio 9.5 : 13.5 -> aspect ratio height = width * (13.5 / 9.5)
  const height = width * (13.5 / 9.5);

  const {
    trackerType = 'standard', // 'standard' | 'carrier'
    title = 'MRIC SECTION',
    description = 'Medium Range Interdiction Capability Section',
    triangleNumber = 3,
    reverseTriangleNumber = 6,
    showReverseTriangle = true,
    showJetIcon = true,
    showHelicopterIcon = true,
    customJetIconUrl = null,
    customHelicopterIconUrl = null,
    footerName = 'CUSTOM UNIT TRACKER',
    customImageUrl = null,
    bgColor = '#ffffff',
    camoColor = '#4a5568',
    showCamo = true,
    initialHpSquare = null,
    placedDice = {},
    backBgColor = '#2b6cb0',
    backCamoColor = '#1a365d',
    showBackCamo = true,
    customBackImageUrl = null,
    showSquareBorders = true,
    titleColor = '#000000',
    descriptionColor = '#1a202c',
    triangleNumberColor = '#000000',
    footerNameColor = '#000000',
    attachmentTextColor = '#000000',
    squareNumberColor = '#8c939d',
    squareBgColor = '#ffffff'
  } = trackerData || {};

  const isCarrier = trackerType === 'carrier';

  // Backside rendering
  if (side === 'back') {
    const effectiveBackBg = backBgColor || tokenData?.bgColor || '#2b6cb0';
    const effectiveBackCamoColor = backCamoColor || camoColor || '#1a365d';

    return (
      <div
        id={id}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: effectiveBackBg,
          border: '6px solid #000000',
          borderRadius: '2px',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '16px'
        }}
      >
        {/* Camouflage Pattern Background Overlay for Backside */}
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
            <pattern id="camo-pattern-tracker-back" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 0,20 Q 30,0 60,30 T 120,20 L 120,60 Q 90,80 60,50 T 0,70 Z" fill={effectiveBackCamoColor} />
              <path d="M 20,80 Q 50,60 80,90 T 120,100 L 120,120 L 0,120 Z" fill={effectiveBackCamoColor} />
              <circle cx="30" cy="40" r="15" fill={effectiveBackCamoColor} />
              <circle cx="90" cy="30" r="22" fill={effectiveBackCamoColor} />
              <circle cx="70" cy="100" r="18" fill={effectiveBackCamoColor} />
            </pattern>
            <rect width="100%" height="100%" fill="url(#camo-pattern-tracker-back)" />
          </svg>
        )}

        {customBackImageUrl && (
          <img
            src={customBackImageUrl}
            alt="Tracker Back"
            style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }}
          />
        )}
      </div>
    );
  }

  // 20 vertical long squares (4 rows of 5)
  const squares = Array.from({ length: 20 }, (_, i) => i + 1);

  // Determine effective square number color
  const effectiveNumColor =
    squareNumberColor === 'bgColor'
      ? bgColor
      : squareNumberColor || '#8c939d';

  return (
    <div
      id={id}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: bgColor || '#ffffff',
        border: '6px solid #000000',
        borderRadius: '2px',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 14px 12px 14px',
        fontFamily: "'Trebuchet MS', 'Arial Bold', sans-serif",
        color: '#000000',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Camouflage Pattern Background Overlay */}
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
          <pattern id="camo-pattern-tracker" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 0,20 Q 30,0 60,30 T 120,20 L 120,60 Q 90,80 60,50 T 0,70 Z" fill={camoColor} />
            <path d="M 20,80 Q 50,60 80,90 T 120,100 L 120,120 L 0,120 Z" fill={camoColor} />
            <circle cx="30" cy="40" r="15" fill={camoColor} />
            <circle cx="90" cy="30" r="22" fill={camoColor} />
            <circle cx="70" cy="100" r="18" fill={camoColor} />
          </pattern>
          <rect width="100%" height="100%" fill="url(#camo-pattern-tracker)" />
        </svg>
      )}

      {/* Attachments on border (centered ▲ ATTACHMENT ▲) */}
      <div
        style={{
          position: 'absolute',
          top: '-1px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 10,
          background: bgColor || '#ffffff',
          padding: '0 8px'
        }}
      >
        <span style={{ fontSize: '0.65rem', color: attachmentTextColor }}>▲</span>
        <span style={{ fontSize: '0.65rem', fontWeight: '900', letterSpacing: '1.5px', color: attachmentTextColor }}>
          ATTACHMENT
        </span>
        <span style={{ fontSize: '0.65rem', color: attachmentTextColor }}>▲</span>
      </div>

      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', zIndex: 1 }}>
        {/* Upper Left Token Area: No border, big token preview scaled to fit 82x82 */}
        <div style={{ flexShrink: 0, width: 82, height: 82, position: 'relative', overflow: 'hidden' }}>
          {customImageUrl ? (
            <img src={customImageUrl} alt="Token" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ transform: 'scale(0.3416667)', transformOrigin: 'top left', width: 240, height: 240 }}>
              <LandToken tokenData={tokenData} side="front" size={240} />
            </div>
          )}
        </div>

        {/* Title, Description & White Triangle with Number */}
        <div style={{ flex: 1, paddingLeft: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ paddingRight: '4px' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: '900',
                  color: titleColor,
                  letterSpacing: '0.5px',
                  lineHeight: 1.1,
                  textTransform: 'uppercase'
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '0.68rem',
                  color: descriptionColor,
                  lineHeight: 1.2,
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                {description}
              </p>
            </div>

            {/* Triangles Area (Top Right) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                border: isCarrier || showReverseTriangle ? '1px solid #000000' : 'none',
                padding: isCarrier || showReverseTriangle ? '2px 4px' : '0',
                background: isCarrier || showReverseTriangle ? '#ffffff' : 'transparent',
                borderRadius: '2px',
                flexShrink: 0
              }}
            >
              {/* White Upright Triangle with Number */}
              <div
                style={{
                  position: 'relative',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="34" height="34" viewBox="0 0 40 40" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <polygon points="20,2 38,36 2,36" fill="#ffffff" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                <span
                  style={{
                    position: 'relative',
                    top: '3px',
                    fontSize: '0.8rem',
                    fontWeight: '900',
                    color: triangleNumberColor
                  }}
                >
                  {triangleNumber}
                </span>
              </div>

              {/* Reversed Solid Black Triangle with Upright White Number (Carrier Mode / Option) */}
              {(isCarrier || showReverseTriangle) && (
                <div
                  style={{
                    position: 'relative',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 40 40" style={{ position: 'absolute', top: 0, left: 0 }}>
                    <polygon points="2,4 38,4 20,38" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  <span
                    style={{
                      position: 'relative',
                      top: '-3px',
                      fontSize: '0.8rem',
                      fontWeight: '900',
                      color: '#ffffff'
                    }}
                  >
                    {reverseTriangleNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EMBARKED UNITS Box (Carrier Mode) */}
      {isCarrier && (
        <div
          style={{
            margin: '8px 0 0 0',
            border: '2px solid #000000',
            borderRadius: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            padding: '6px 12px',
            minHeight: '85px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Label centered at top inside box */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.75rem',
              fontWeight: '900',
              letterSpacing: '1.2px',
              color: '#000000',
              textTransform: 'uppercase'
            }}
          >
            EMBARKED UNITS
          </div>

          <div style={{ flex: 1 }} />

          {/* Right side Jet & Helicopter icons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', paddingTop: '12px' }}>
            {showJetIcon && (
              customJetIconUrl ? (
                <img src={customJetIconUrl} alt="Jet" style={{ width: '38px', height: '24px', objectFit: 'contain' }} />
              ) : (
                <svg viewBox="0 0 100 100" width="36" height="24" fill="#000000">
                  <path d="M50 5 L58 35 L95 55 L95 65 L58 55 L58 80 L72 90 L72 98 L50 90 L28 98 L28 90 L42 80 L42 55 L5 65 L5 55 L42 35 Z" />
                </svg>
              )
            )}

            {showHelicopterIcon && (
              customHelicopterIconUrl ? (
                <img src={customHelicopterIconUrl} alt="Helicopter" style={{ width: '42px', height: '22px', objectFit: 'contain' }} />
              ) : (
                <svg viewBox="0 0 100 60" width="42" height="22" fill="#000000">
                  <rect x="10" y="5" width="80" height="4" rx="2" />
                  <rect x="48" y="9" width="4" height="7" />
                  <path d="M25 20 C25 15, 70 15, 75 25 C80 32, 70 42, 50 42 C30 42, 20 35, 25 20 Z" />
                  <path d="M60 20 C65 20, 72 23, 70 28 C65 28, 60 25, 60 20 Z" fill="#ffffff" />
                  <path d="M30 28 L5 25 L5 30 L30 35 Z" />
                  <path d="M2 18 L7 18 L7 37 L2 37 Z" />
                  <rect x="0" y="26" width="10" height="3" />
                  <rect x="30" y="47" width="40" height="3" rx="1.5" />
                  <rect x="38" y="41" width="3" height="7" />
                  <rect x="58" y="41" width="3" height="7" />
                </svg>
              )
            )}
          </div>
        </div>
      )}

      {/* Grid of 20 vertical long squares (4 rows x 5 columns) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '8px 10px',
          flex: 1,
          margin: '14px 0 8px 0',
          zIndex: 1
        }}
      >
        {squares.map((num) => {
          const isInitialHp = Number(initialHpSquare) === num;
          const diceOnSquare = placedDice[num] || [];

          return (
            <div
              key={num}
              onClick={() => onSquareClick && onSquareClick(num)}
              style={{
                border: showSquareBorders ? '2px solid #000000' : 'none',
                borderRadius: '2px',
                backgroundColor: squareBgColor || '#ffffff',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2px',
                cursor: onSquareClick ? 'pointer' : 'default',
                boxSizing: 'border-box'
              }}
            >
              {/* Upper half: Markers (Initial HP black square and/or Token Dice) */}
              <div
                style={{
                  height: '42%',
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  gap: '2px',
                  boxSizing: 'border-box',
                  overflow: 'hidden'
                }}
              >
                {isInitialHp && (
                  <div
                    title="Initial HP"
                    style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#000000',
                      borderRadius: '1px'
                    }}
                  />
                )}

                {diceOnSquare.map((dieObj, dIdx) => (
                  <MiniDie key={dIdx} die={dieObj} size={20} />
                ))}
              </div>

              {/* Lower half: Military number centered horizontally */}
              <div
                style={{
                  height: '58%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontSize: '2.1rem',
                  fontFamily: "'Teko', 'Trebuchet MS', sans-serif",
                  lineHeight: 1,
                  color: effectiveNumColor,
                  paddingBottom: '2px',
                  boxSizing: 'border-box'
                }}
              >
                {num}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Area */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: '900',
            letterSpacing: '1px',
            color: footerNameColor,
            textTransform: 'uppercase'
          }}
        >
          {footerName}
        </span>
      </div>
    </div>
  );
}
