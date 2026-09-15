import React from 'react';
import { LandToken, NatoSymbol } from './LandToken';
import { MiniDie } from './UnitTracker';

/**
 * TacticalGroupTracker component renders a dynamic unit tracker for group/tactical formations.
 */
export function TacticalGroupTracker({
  id = 'tactical-group-tracker-preview',
  groupData,
  side = 'front', // 'front' | 'back'
  columnWidth = 110, // px per token column
  onSquareClick,
  onColumnClick,
  onDeleteColumn,
  onReplaceColumnToken,
  onAddColumnWithToken,
  selectedColumnIndex = null,
  isInteractive = true
}) {
  const {
    title = '1ST TACTICAL STRIKE GROUP',
    footerName = 'USMC TACTICAL GROUP',
    columns = [],
    fontFamily = "'Trebuchet MS', 'Arial Bold', sans-serif",
    bgColor = '#ffffff',
    camoColor = '#4a5568',
    showCamo = true,
    backBgColor = '#2b6cb0',
    backCamoColor = '#1a365d',
    showBackCamo = true,
    customBackImageUrl = null,
    customEmblemUrl = null,
    showNatoSymbol = false,
    natoSymbolType = 'infantry',
    natoAffiliation = 'friendly',
    natoEchelon = 'III',
    natoModifiers = [],
    customNatoSymbolUrl = null,
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
  const sidePadding = 16;

  // Calculate required width for header elements so NATO symbol, emblem, and title text are always on one line without wrapping
  const titleCharCount = (title || '').length;
  const approxTitleWidth = titleCharCount * 18 + 40; // ~18px per uppercase letter + padding
  const natoWidth = showNatoSymbol ? 70 : 0;
  const emblemWidth = customEmblemUrl ? 70 : 0;
  const headerRequiredWidth = approxTitleWidth + natoWidth + emblemWidth + sidePadding * 2 + 40;

  const minWidth = 480;
  const rawWidth = numColumns * columnWidth + sidePadding * 2;
  const calculatedWidth = Math.max(minWidth, rawWidth, headerRequiredWidth);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropOnColumn = (e, colIdx) => {
    e.preventDefault();
    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (rawData) {
        const token = JSON.parse(rawData);
        if (onReplaceColumnToken) {
          onReplaceColumnToken(colIdx, token);
        }
      }
    } catch (err) {
      console.error('Failed to parse dropped token:', err);
    }
  };

  const handleDropOnAddZone = (e) => {
    e.preventDefault();
    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (rawData) {
        const token = JSON.parse(rawData);
        if (onAddColumnWithToken) {
          onAddColumnWithToken(token);
        }
      }
    } catch (err) {
      console.error('Failed to parse dropped token:', err);
    }
  };

  // Backside rendering
  if (side === 'back') {
    return (
      <div
        id={id}
        style={{
          width: `${calculatedWidth}px`,
          minHeight: '990px',
          height: '100%',
          flex: 1,
          backgroundColor: backBgColor || '#2b6cb0',
          border: '6px solid #000000',
          borderRadius: '0px',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '24px 16px',
          margin: '0px'
        }}
      >
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
          <div style={{ zIndex: 1, color: '#ffffff', textAlign: 'center', fontFamily: fontFamily }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>{title}</h2>
            <p style={{ fontSize: '1.2rem', margin: '8px 0 0 0', letterSpacing: '1px', textTransform: 'uppercase' }}>{footerName}</p>
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
        minHeight: '990px',
        backgroundColor: bgColor || '#ffffff',
        border: '6px solid #000000',
        borderRadius: '0px',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 16px 10px 16px',
        margin: '0px',
        fontFamily: fontFamily,
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
          padding: '0 12px',
          whiteSpace: 'nowrap'
        }}
      >
        <span style={{ fontSize: '0.65rem', color: effColumnHeaderColor }}>▲</span>
        <span style={{ fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1.5px', color: effColumnHeaderColor, whiteSpace: 'nowrap' }}>
          TACTICAL GROUP TRACKER
        </span>
        <span style={{ fontSize: '0.65rem', color: effColumnHeaderColor }}>▲</span>
      </div>

      {/* Main Group Header: Title, Custom Emblem & NATO Symbol */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          borderBottom: '3px solid #000000',
          padding: '12px 0 12px 0',
          margin: '24px 0 12px 0',
          zIndex: 1
        }}
      >
        {/* NATO Symbol / Custom NATO Symbol Graphic (NO FRAME OR BACKGROUND BOX) */}
        {showNatoSymbol && (
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {customNatoSymbolUrl ? (
              <img
                src={customNatoSymbolUrl}
                alt="NATO Symbol"
                style={{ width: '54px', height: '54px', objectFit: 'contain' }}
              />
            ) : (
              <>
                <div
                  style={{
                    color: effTitleColor,
                    fontSize: '10px',
                    fontWeight: 'bold',
                    lineHeight: 1,
                    letterSpacing: '1px',
                    marginBottom: '2px'
                  }}
                >
                  {natoEchelon}
                </div>
                <NatoSymbol
                  affiliation={natoAffiliation}
                  symbolType={natoSymbolType}
                  modifiers={natoModifiers}
                  size={120}
                  symbolColor={effTitleColor}
                />
              </>
            )}
          </div>
        )}

        {/* Custom Warbanner / Emblem Image (NO FRAME OR BACKGROUND BOX) */}
        {customEmblemUrl && (
          <div
            style={{
              width: '54px',
              height: '54px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={customEmblemUrl}
              alt="Unit Emblem"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        )}

        <h2
          style={{
            margin: 0,
            padding: '2px 0',
            fontSize: '1.5rem',
            fontWeight: '900',
            color: effTitleColor,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            lineHeight: 1.1
          }}
        >
          {title}
        </h2>
      </div>

      {/* Drop Zone to Add Column via Drag and Drop (Interactive Only - Moved to Top) */}
      {isInteractive && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropOnAddZone}
          style={{
            margin: '0 0 8px 0',
            padding: '6px',
            border: '2px dashed var(--accent-cyan)',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: 'var(--accent-cyan)',
            background: 'rgba(0, 240, 255, 0.05)',
            cursor: 'pointer',
            zIndex: 1
          }}
        >
          ➕ Drag token here to drop & add as new column
        </div>
      )}

      {/* Token Columns Grid - NO GAP OR MARGIN BETWEEN COLUMNS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numColumns}, ${columnWidth}px)`,
          gap: '0px',
          padding: '0px',
          margin: '0px',
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
            whiteTriangleNum = tokenData.sizeNumber || tokenData.triangleNumber || 1,
            showBlackTriangle = true,
            blackTriangleNum = tokenData.reverseTriangleNumber || 1,
            placedDice = {},
            initialHpSquare = null
          } = col;

          const isSelected = selectedColumnIndex === colIdx;
          const showWhite = showWhiteTriangleGlobal && showWhiteTriangle;
          const showBlack = showBlackTriangleGlobal && showBlackTriangle;

          const effWhiteWeight = whiteTriangleNum ?? tokenData.sizeNumber ?? 1;
          const effBlackWeight = blackTriangleNum ?? tokenData.reverseTriangleNumber ?? 1;

          return (
            <div
              key={col.id || colIdx}
              onClick={() => onColumnClick && onColumnClick(colIdx)}
              onDragOver={isInteractive ? handleDragOver : undefined}
              onDrop={isInteractive ? (e) => handleDropOnColumn(e, colIdx) : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: isSelected ? '2px solid #00f0ff' : '1px solid #000000',
                borderRadius: '0px',
                padding: '0px',
                margin: '0px',
                backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.85)',
                position: 'relative',
                boxSizing: 'border-box'
              }}
            >
              {/* Header Bar with Column Index and Red Minus Deletion Button */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '2px 4px',
                  boxSizing: 'border-box',
                  lineHeight: 1
                }}
              >
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    color: effColumnHeaderColor,
                    textTransform: 'uppercase'
                  }}
                >
                  #{colIdx + 1}
                </div>

                {isInteractive && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteColumn) onDeleteColumn(colIdx);
                    }}
                    title="Remove column"
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      lineHeight: 1,
                      padding: 0
                    }}
                  >
                    −
                  </button>
                )}
              </div>

              {/* Column / Token Name Above Token Graphic */}
              <div
                style={{
                  width: '100%',
                  fontSize: '0.68rem',
                  fontWeight: '900',
                  color: effColumnHeaderColor,
                  margin: '0px',
                  padding: '2px 2px 3px 2px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  boxSizing: 'border-box',
                  borderBottom: '1px solid #000000',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  lineHeight: 1.1,
                  textTransform: 'uppercase'
                }}
                title={col.columnName || tokenData?.unitName || `Unit ${colIdx + 1}`}
              >
                {col.columnName || tokenData?.unitName || `UNIT ${colIdx + 1}`}
              </div>

              {/* 1. TOP: Full-size Token Graphic */}
              <div
                style={{
                  width: `${columnWidth}px`,
                  height: `${columnWidth}px`,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid #000000',
                  borderRadius: '0px',
                  backgroundColor: tokenData?.bgColor || '#2b6cb0',
                  padding: '0px',
                  margin: '0px'
                }}
              >
                {customImageUrl ? (
                  <img src={customImageUrl} alt="Token" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <LandToken tokenData={col.tokenData || tokenData} side="front" size={columnWidth} />
                )}
              </div>

              {/* 2. MIDDLE: Weight Triangles Area (White ▲ & Black Reversed ▲) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  minHeight: '28px',
                  margin: '0px',
                  padding: '2px 0',
                  width: '100%',
                  borderBottom: '1px solid #000000'
                }}
              >
                {/* White Upright Triangle ▲ */}
                {showWhite && (
                  <div
                    title="White Weight Triangle"
                    style={{
                      position: 'relative',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 40 40" style={{ position: 'absolute', top: 0, left: 0 }}>
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
                      {effWhiteWeight}
                    </span>
                  </div>
                )}

                {/* Black Reversed Triangle ▲ */}
                {showBlack && (
                  <div
                    title="Black Weight Triangle"
                    style={{
                      position: 'relative',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 40 40" style={{ position: 'absolute', top: 0, left: 0 }}>
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
                      {effBlackWeight}
                    </span>
                  </div>
                )}
              </div>

              {/* 3. BOTTOM: Vertical Column of Points (1 to 20) - FLUSH / NO GAPS */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0px',
                  padding: '0px',
                  margin: '0px',
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
                        border: showSquareBorders ? '1px solid #000000' : 'none',
                        borderRadius: '0px',
                        backgroundColor: squareBgColor || '#ffffff',
                        height: '36px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1px 0',
                        margin: '0px',
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
                          padding: '0px',
                          margin: '0px',
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
                              borderRadius: '0px'
                            }}
                          />
                        )}

                        {diceOnSquare.map((dieObj, dIdx) => (
                          <MiniDie key={dIdx} die={dieObj} size={15} />
                        ))}
                      </div>

                      {/* Bottom section: Point track number (1-20) */}
                      <div
                        style={{
                          fontWeight: '900',
                          fontSize: '1.25rem',
                          fontFamily: "'Teko', 'Trebuchet MS', sans-serif",
                          lineHeight: 1,
                          color: effSquareNumColor,
                          padding: '0px',
                          margin: '0px'
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
          marginTop: '8px',
          paddingTop: '4px',
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
