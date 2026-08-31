import React from 'react';
import { LandToken } from './LandToken';

// MiniDie component to render token dice inside tracker squares (without numbers)
export function MiniDie({ die, size = 24 }) {
  if (!die) return null;
  const diceType = die.type || 'red';

  let defaultBg = '#c83232';
  if (diceType === 'green') defaultBg = '#2e7d32';
  if (diceType === 'purple') defaultBg = '#7b1fa2';
  if (diceType === 'blue') defaultBg = '#1976d2';

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
        {diceType === 'blue' && (
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
  width = 475,
  onSquareClick
}) {
  // Ratio 9.5 : 13.5 -> aspect ratio height = width * (13.5 / 9.5)
  const height = width * (13.5 / 9.5);

  const {
    title = 'MRIC SECTION',
    description = 'Medium Range Interdiction Capability Section',
    triangleNumber = 3,
    footerName = 'CUSTOM UNIT TRACKER',
    customImageUrl = null,
    bgColor = '#e2e8f0',
    showCamo = true,
    initialHpSquare = 12, // 1 to 20
    placedDice = {} // { [squareNum]: [dieObject1, dieObject2] }
  } = trackerData || {};

  // 20 vertical long squares (4 rows of 5)
  const squares = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div
      id={id}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#ffffff',
        border: '6px solid #000000',
        borderRadius: '2px',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 14px 12px 14px',
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
            opacity: 0.12,
            zIndex: 0
          }}
        >
          <pattern id="camo-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 0,20 Q 30,0 60,30 T 120,20 L 120,60 Q 90,80 60,50 T 0,70 Z" fill="#4a5568" />
            <path d="M 20,80 Q 50,60 80,90 T 120,100 L 120,120 L 0,120 Z" fill="#2d3748" />
            <circle cx="30" cy="40" r="15" fill="#718096" />
            <circle cx="90" cy="30" r="22" fill="#a0aec0" />
            <circle cx="70" cy="100" r="18" fill="#4a5568" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#camo-pattern)" />
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
          background: '#ffffff',
          padding: '0 6px'
        }}
      >
        <span style={{ fontSize: '0.65rem', color: '#000000' }}>▲</span>
        <span style={{ fontSize: '0.65rem', fontWeight: '900', letterSpacing: '1.5px', color: '#000000' }}>
          ATTACHMENT
        </span>
        <span style={{ fontSize: '0.65rem', color: '#000000' }}>▲</span>
      </div>

      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', zIndex: 1 }}>
        {/* Upper Left Token Preview or Custom Image */}
        <div style={{ flexShrink: 0, border: '1.5px solid #000000', borderRadius: '4px', overflow: 'hidden', width: 82, height: 82, background: '#ffffff' }}>
          {customImageUrl ? (
            <img src={customImageUrl} alt="Token" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <LandToken tokenData={tokenData} side="front" size={82} />
          )}
        </div>

        {/* Title, Description & White Triangle with Number */}
        <div style={{ flex: 1, paddingLeft: '6px', paddingTop: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ paddingRight: '4px' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: '900',
                  color: '#000000',
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
                  color: '#1a202c',
                  lineHeight: 1.2,
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                {description}
              </p>
            </div>

            {/* White Triangle with Border & Number inside */}
            <div
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="38" height="38" viewBox="0 0 40 40" style={{ position: 'absolute', top: 0, left: 0 }}>
                <polygon points="20,2 38,36 2,36" fill="#ffffff" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />
              </svg>
              <span
                style={{
                  position: 'relative',
                  top: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '900',
                  color: '#000000'
                }}
              >
                {triangleNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

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
                border: '2px solid #000000',
                borderRadius: '2px',
                backgroundColor: '#ffffff',
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

              {/* Lower half: Double-sized grey military number centered horizontally */}
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
                  color: '#8c939d',
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
            color: '#000000',
            textTransform: 'uppercase'
          }}
        >
          {footerName}
        </span>
      </div>
    </div>
  );
}
