import React from 'react';
import { LandToken } from './LandToken';

// MiniDie component to render token dice inside tracker squares
export function MiniDie({ die, size = 24 }) {
  if (!die) return null;
  const diceType = die.type || 'red';
  const bigVal = die.bigValue ?? 10;
  const smallVal = die.smallValue ?? '0';

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
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: "'Trebuchet MS', 'Arial Bold', sans-serif"
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
      <div
        style={{
          zIndex: 1,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          lineHeight: 1,
          marginTop: '-1px'
        }}
      >
        <span style={{ fontSize: size * 0.44, fontWeight: 900, textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
          {bigVal}
        </span>
        <span
          style={{
            fontSize: size * 0.22,
            fontWeight: 800,
            verticalAlign: 'top',
            alignSelf: 'flex-start',
            marginLeft: '0.5px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.6)'
          }}
        >
          {smallVal}
        </span>
      </div>
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
      {/* Attachments on border (2 small triangles pointing up on top border) */}
      <div
        style={{
          position: 'absolute',
          top: '-1px',
          left: '32%',
          display: 'flex',
          gap: '8px',
          zIndex: 10
        }}
      >
        <svg width="14" height="10" viewBox="0 0 10 8">
          <polygon points="5,0 10,8 0,8" fill="#000000" />
        </svg>
        <svg width="14" height="10" viewBox="0 0 10 8">
          <polygon points="5,0 10,8 0,8" fill="#000000" />
        </svg>
      </div>

      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        {/* Upper Left Token Preview */}
        <div style={{ flexShrink: 0, border: '1.5px solid #000000', borderRadius: '4px', overflow: 'hidden' }}>
          <LandToken tokenData={tokenData} side="front" size={82} />
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
                  fontSize: '0.72rem',
                  color: '#333333',
                  lineHeight: 1.25,
                  fontWeight: '600'
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
          margin: '14px 0 8px 0'
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
                borderRadius: '3px',
                backgroundColor: '#ffffff',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 2px',
                cursor: onSquareClick ? 'pointer' : 'default',
                boxSizing: 'border-box'
              }}
            >
              {/* Upper half: Markers (Initial HP black square and/or Token Dice) */}
              <div
                style={{
                  flex: 1,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  paddingTop: '2px'
                }}
              >
                {isInitialHp && (
                  <div
                    title="Initial HP"
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#000000',
                      borderRadius: '2px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
                    }}
                  />
                )}

                {diceOnSquare.map((dieObj, dIdx) => (
                  <MiniDie key={dIdx} die={dieObj} size={22} />
                ))}
              </div>

              {/* Lower half: Number centered horizontally */}
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontWeight: '900',
                  fontSize: '1rem',
                  lineHeight: 1,
                  color: '#000000',
                  paddingBottom: '2px'
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
