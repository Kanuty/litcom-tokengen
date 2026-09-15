import React, { useState } from 'react';
import { LandToken } from './LandToken';
import { MiniDie } from './UnitTracker';

/**
 * TacticalGroupTracker component renders a dynamic unit tracker for group/tactical formations.
 *
 * Layout Structure:
 * - Header: Title (Group Name) at top
 * - Horizontal Columns (1 to 20 tokens):
 *   - Column Top: Token Graphic / Image
 *   - Middle: Weight Indicators (White ▲ and Black Reversed ▲, separately toggleable)
 *   - Bottom: Vertical column (points 1 to 20) for tracking stats (HP, dice, logistics) linked to that token.
 * - Dynamic Width: Card grows wider as tokens are added.
 */
export function TacticalGroupTracker({
  id = 'tactical-group-tracker-preview',
  groupData,
  side = 'front', // 'front' | 'back'
  columnWidth = 80, // px per token column
  onSquareClick,
  onColumnClick,
  selectedColumnIndex = null,
  isInteractive = true
}) {
  const {
    title = 'TACTICAL GROUP TRACKER',
    footerName = 'USMC TACTICAL GROUP',
    columns = [],
    bgColor = '#ffffff',
    camoColor = '#4a5568',
    showCamo = true,
    backBgColor = '#2b6cb0',
    backCamoColor = '#1a365d',
    showBackCamo = true,
    customBackImageUrl = null,
    showSquareBorders = true,
    applySingleTextColor = false,
    singleTextColor = '#000000',
    titleColor = '#000000',
    footerNameColor = '#000000',
    columnHeaderColor = '#000000',
    squareNumberColor = '#8c939d',
    squareBgColor = '#ffffff',
    showWhiteTriangleGlobal = true,
    showBlackTriangleGlobal = true
  } = groupData || {};

  const effTitleColor = applySingleTextColor ? singleTextColor : titleColor;
  const effFooterColor = applySingleTextColor ? singleTextColor : footerNameColor;
  const effColumnHeaderColor = applySingleTextColor ? singleTextColor : columnHeaderColor;
  const effSquareNumColor = applySingleTextColor
    ? singleTextColor
    : squareNumberColor === 'bgColor'
    ? bgColor
    : squareNumberColor || '#8c939d';

  const numColumns = Math.max(1, columns.length);
  // Calculate total canvas width dynamically based on column count
  const sidePadding = 24; // left/right padding
  const columnGap = 10;
  const calculatedWidth = numColumns * columnWidth + (numColumns - 1) * columnGap + sidePadding * 2;

  // Backside rendering
  if (side === 'back') {
    return (
      <div
        id={id}
        style={{
          width: `${calculatedWidth}px`,
          minHeight: '620px',
          backgroundColor: backBgColor || '#2b6cb0',
          border: '6px solid #000000',
          borderRadius: '2px',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '20px'
        }}
      >
        {/* Backside Camo Overlay */}
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
            <pattern id="camo-pattern-group-back" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 0,20 Q 30,0 60,30 T 120,20 L 120,60 Q 90,80 60,50 T 0,70 Z" fill={backCamoColor || '#1a365d'} />
              <path d="M 20,80 Q 50,60 80,90 T 120,100 L 120,120 L 0,120 Z" fill={backCamoColor || '#1a365d'} />
              <circle cx="30" cy="40" r="15" fill={backCamoColor || '#1a365d'} />
              <circle cx="90" cy="30" r="22" fill={backCamoColor || '#1a365d'} />
              <circle cx="70" cy="100" r="18" fill={backCamoColor || '#1a365d'} />
            </pattern>
            <rect width="100%" height="100%" fill="url(#camo-pattern-group-back)" />
          </svg>
        )}

        {customBackImageUrl ? (
          <img
            src={customBackImageUrl}
            alt="Group Tracker Back"
            style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }}
          />
        ) : (
          <div style={{ zIndex: 1, color: '#ffffff', textAlign: 'center', fontFamily: "'Teko', sans-serif" }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '2px' }}>{title}</h2>
            <p style={{ fontSize: '1.2rem', margin: '8px 0 0 0', letterSpacing: '1px' }}>{footerName}</p>
          </div>
        )}
      </div>
    );
  }

  const verticalPoints = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div
      id={id}
      style={{
        width: `${calculatedWidth}px`,
        backgroundColor: bgColor || '#ffffff',
        border: '6px solid #000000',
        borderRadius: '2px',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 24px 14px 24px',
        fontFamily: "'Trebuchet MS', 'Arial Bold', sans-serif",
        color: '#000000',
        overflow: 'hidden',
        userSelect: 'none',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Camouflage Background Overlay */}
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
          <pattern id="camo-pattern-group" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 0,20 Q 30,0 60,30 T 120,20 L 120,60 Q 90,80 60,50 T 0,70 Z" fill={camoColor} />
            <path d="M 20,80 Q 50,60 80,90 T 120,100 L 120,120 L 0,120 Z" fill={camoColor} />
            <circle cx="30" cy="40" r="15" fill={camoColor} />
            <circle cx="90" cy="30" r="22" fill={camoColor} />
            <circle cx="70" cy="100" r="18" fill={camoColor} />
          </pattern>
          <rect width="100%" height="100%" fill="url(#camo-pattern-group)" />
        </svg>
      )}

      {/* Attachments Border Label */}
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
          padding: '0 12px'
        }}
      >
        <span style={{ fontSize: '0.65rem', color: effColumnHeaderColor }}>▲</span>
        <span style={{ fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1.5px', color: effColumnHeaderColor }}>
          TACTICAL GROUP TRACKER
        </span>
        <span style={{ fontSize: '0.65rem', color: effColumnHeaderColor }}>▲</span>
      </div>

      {/* Main Group Header: Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '3px solid #000000',
          paddingBottom: '8px',
          marginBottom: '12px',
          marginTop: '12px',
          zIndex: 1
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.6rem',
            fontWeight: '900',
            color: effTitleColor,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            textAlign: 'center'
          }}
        >
          {title}
        </h2>
      </div>

      {/* Token Columns Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numColumns}, ${columnWidth}px)`,
          gap: `${columnGap}px`,
          justifyContent: 'center',
          zIndex: 1,
          flex: 1
        }}
      >
        {columns.map((col, colIdx) => {
          const {
            tokenData = {},
            customImageUrl = null,
            showWhiteTriangle = true,
            whiteTriangleNum = 1,
            showBlackTriangle = true,
            blackTriangleNum = 1,
            placedDice = {},
            initialHpSquare = null
          } = col;

          const isSelected = selectedColumnIndex === colIdx;
          const showWhite = showWhiteTriangleGlobal && showWhiteTriangle;
          const showBlack = showBlackTriangleGlobal && showBlackTriangle;

          return (
            <div
              key={col.id || colIdx}
              onClick={() => onColumnClick && onColumnClick(colIdx)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: isSelected ? '2px solid #00f0ff' : '1px solid #000000',
                borderRadius: '3px',
                padding: '6px 4px',
                backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)',
                position: 'relative',
                boxSizing: 'border-box'
              }}
            >
              {/* Column Index Tag */}
              <div
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  color: effColumnHeaderColor,
                  marginBottom: '4px',
                  textTransform: 'uppercase'
                }}
              >
                #{colIdx + 1}
              </div>

              {/* 1. TOP: Token Graphic */}
              <div
                style={{
                  width: `${columnWidth - 12}px`,
                  height: `${columnWidth - 12}px`,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #000000',
                  borderRadius: '2px',
                  backgroundColor: '#ffffff'
                }}
              >
                {customImageUrl ? (
                  <img src={customImageUrl} alt="Token" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div
                    style={{
                      transform: `scale(${(columnWidth - 12) / 240})`,
                      transformOrigin: 'top left',
                      width: 240,
                      height: 240
                    }}
                  >
                    <LandToken tokenData={tokenData} side="front" size={240} />
                  </div>
                )}
              </div>

              {/* Token Name Label */}
              <div
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  color: effColumnHeaderColor,
                  margin: '4px 0',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: `${columnWidth - 8}px`
                }}
                title={tokenData?.unitName || 'Unit Token'}
              >
                {tokenData?.unitName || 'UNIT TOKEN'}
              </div>

              {/* 2. MIDDLE: Weight Triangles Area (White ▲ & Black Reversed ▲) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  minHeight: '32px',
                  margin: '4px 0 8px 0'
                }}
              >
                {/* White Upright Triangle ▲ */}
                {showWhite && (
                  <div
                    title="White Weight Triangle"
                    style={{
                      position: 'relative',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 40 40" style={{ position: 'absolute', top: 0, left: 0 }}>
                      <polygon points="20,2 38,36 2,36" fill="#ffffff" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                    <span
                      style={{
                        position: 'relative',
                        top: '2px',
                        fontSize: '0.72rem',
                        fontWeight: '900',
                        color: effColumnHeaderColor
                      }}
                    >
                      {whiteTriangleNum}
                    </span>
                  </div>
                )}

                {/* Black Reversed Triangle ▲ */}
                {showBlack && (
                  <div
                    title="Black Weight Triangle"
                    style={{
                      position: 'relative',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 40 40" style={{ position: 'absolute', top: 0, left: 0 }}>
                      <polygon points="2,4 38,4 20,38" fill="#000000" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                    <span
                      style={{
                        position: 'relative',
                        top: '-2px',
                        fontSize: '0.72rem',
                        fontWeight: '900',
                        color: '#ffffff'
                      }}
                    >
                      {blackTriangleNum}
                    </span>
                  </div>
                )}
              </div>

              {/* 3. BOTTOM: Vertical Column of Points (1 to 20) */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  width: '100%'
                }}
              >
                {verticalPoints.map((ptNum) => {
                  const isInitialHp = Number(initialHpSquare) === ptNum;
                  const diceOnSquare = placedDice[ptNum] || [];

                  return (
                    <div
                      key={ptNum}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSquareClick && isInteractive) {
                          onSquareClick(colIdx, ptNum);
                        }
                      }}
                      style={{
                        border: showSquareBorders ? '1.5px solid #000000' : 'none',
                        borderRadius: '2px',
                        backgroundColor: squareBgColor || '#ffffff',
                        height: '38px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '2px',
                        cursor: isInteractive ? 'pointer' : 'default',
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Top section: HP marker / Dice icons */}
                      <div
                        style={{
                          height: '16px',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px',
                          overflow: 'hidden'
                        }}
                      >
                        {isInitialHp && (
                          <div
                            title="Initial HP"
                            style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#000000',
                              borderRadius: '1px'
                            }}
                          />
                        )}

                        {diceOnSquare.map((dieObj, dIdx) => (
                          <MiniDie key={dIdx} die={dieObj} size={14} />
                        ))}
                      </div>

                      {/* Bottom section: Military point number (1-20) */}
                      <div
                        style={{
                          fontWeight: '900',
                          fontSize: '1.25rem',
                          fontFamily: "'Teko', 'Trebuchet MS', sans-serif",
                          lineHeight: 1,
                          color: effSquareNumColor
                        }}
                      >
                        {ptNum}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Area */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          paddingTop: '6px',
          borderTop: '2px solid #000000',
          zIndex: 1
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: '900',
            letterSpacing: '1px',
            color: effFooterColor,
            textTransform: 'uppercase'
          }}
        >
          {numColumns} UNITS ATTACHED
        </span>

        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: '900',
            letterSpacing: '1px',
            color: effFooterColor,
            textTransform: 'uppercase'
          }}
        >
          {footerName}
        </span>
      </div>
    </div>
  );
}
