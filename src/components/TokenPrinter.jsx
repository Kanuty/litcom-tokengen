import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { LandToken } from './LandToken';

const PAPER_PRESETS = {
  A4_P: { name: 'A4 Portrait (210 x 297 mm)', width: 210, height: 297 },
  A4_L: { name: 'A4 Landscape (297 x 210 mm)', width: 297, height: 210 },
  LETTER_P: { name: 'US Letter Portrait (215.9 x 279.4 mm)', width: 215.9, height: 279.4 },
  LETTER_L: { name: 'US Letter Landscape (279.4 x 215.9 mm)', width: 279.4, height: 215.9 },
  A3_P: { name: 'A3 Portrait (297 x 420 mm)', width: 297, height: 420 },
  A3_L: { name: 'A3 Landscape (420 x 297 mm)', width: 420, height: 297 }
};

export function TokenPrinter({
  activeTokenData,
  savedItems = [],
  confirmAction,
  onExportPDF
}) {
  // Paper & Sheet settings
  const [paperKey, setPaperKey] = useState('A4_P');
  const [sizeOption, setSizeOption] = useState('15'); // '15' | '25' | '30' | '40' | 'custom'
  const [tokenSizeMM, setTokenSizeMM] = useState(15); // default 15mm as requested
  const [gapX, setGapX] = useState(2); // mm
  const [gapY, setGapY] = useState(2); // mm
  const [marginTop, setMarginTop] = useState(10); // mm
  const [marginBottom, setMarginBottom] = useState(10); // mm
  const [marginLeft, setMarginLeft] = useState(10); // mm
  const [marginRight, setMarginRight] = useState(10); // mm
  const [defaultFace, setDefaultFace] = useState('both'); // 'front' | 'back' | 'both'
  const [duplicatePairTogether, setDuplicatePairTogether] = useState(true);

  // Grid Preview & Snapping Controls
  const [showGridLines, setShowGridLines] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false); // default free hand

  // Quantity selector for adding tokens
  const [addQuantity, setAddQuantity] = useState(1);

  // Tokens placed on print sheet
  // Item structure: { id, presetId, name, data, side, x, y } (x, y in mm)
  const [sheetTokens, setSheetTokens] = useState([]);
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  // Dragging state
  const [draggingId, setDraggingId] = useState(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const paperRef = useRef(null);

  const paperConfig = PAPER_PRESETS[paperKey] || PAPER_PRESETS.A4_P;
  const paperWidthMM = paperConfig.width;
  const paperHeightMM = paperConfig.height;

  // On-screen scale: convert mm to px for screen preview
  const [canvasPixelWidth, setCanvasPixelWidth] = useState(600);
  const mmToPx = canvasPixelWidth / paperWidthMM;
  const canvasPixelHeight = paperHeightMM * mmToPx;

  // Handle Token Size Option changes
  const handleSizeOptionChange = (e) => {
    const val = e.target.value;
    setSizeOption(val);
    if (val !== 'custom') {
      setTokenSizeMM(Number(val));
    }
  };

  // Update canvasPixelWidth on window resize
  useEffect(() => {
    const handleResize = () => {
      if (paperRef.current) {
        const parentW = paperRef.current.parentElement?.clientWidth || 600;
        const targetW = Math.min(750, Math.max(300, parentW - 20));
        setCanvasPixelWidth(targetW);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [paperKey]);

  // Saved tokens filter
  const savedTokens = savedItems.filter((i) => i.type === 'token');

  // Detect overlapping tokens for pulsing red border glow
  const overlappingTokenIds = useMemo(() => {
    const overlapSet = new Set();
    const len = sheetTokens.length;
    const threshold = tokenSizeMM - 0.5; // Slight tolerance in mm for minor floating precision

    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const t1 = sheetTokens[i];
        const t2 = sheetTokens[j];

        const dx = Math.abs(t1.x - t2.x);
        const dy = Math.abs(t1.y - t2.y);

        if (dx < threshold && dy < threshold) {
          overlapSet.add(t1.id);
          overlapSet.add(t2.id);
        }
      }
    }
    return overlapSet;
  }, [sheetTokens, tokenSizeMM]);

  // Snap position (X, Y in mm) to nearest grid cell based on margins and gaps
  const calculateSnapPosition = useCallback((xMM, yMM) => {
    const stepX = tokenSizeMM + gapX;
    const stepY = tokenSizeMM + gapY;

    // Calculate nearest col & row
    const col = Math.max(0, Math.round((xMM - marginLeft) / stepX));
    const row = Math.max(0, Math.round((yMM - marginTop) / stepY));

    let snappedX = marginLeft + col * stepX;
    let snappedY = marginTop + row * stepY;

    // Constrain to paper bounds
    snappedX = Math.max(marginLeft, Math.min(paperWidthMM - marginRight - tokenSizeMM, snappedX));
    snappedY = Math.max(marginTop, Math.min(paperHeightMM - marginBottom - tokenSizeMM, snappedY));

    return {
      x: Math.round(snappedX * 10) / 10,
      y: Math.round(snappedY * 10) / 10
    };
  }, [gapX, gapY, marginLeft, marginRight, marginTop, marginBottom, paperHeightMM, paperWidthMM, tokenSizeMM]);

  // Nearest-Slot Auto-Arrange Grid for Free-Hand Mode (when snapToGrid is OFF)
  const arrangeNearestGridSlots = useCallback(() => {
    if (sheetTokens.length === 0) return;

    // Calculate all available grid slots on page
    const usableW = paperWidthMM - marginLeft - marginRight;
    const usableH = paperHeightMM - marginTop - marginBottom;
    const stepX = tokenSizeMM + gapX;
    const stepY = tokenSizeMM + gapY;

    const cols = Math.floor((usableW + gapX) / stepX);
    const rows = Math.floor((usableH + gapY) / stepY);

    const slots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        slots.push({
          x: Math.round((marginLeft + c * stepX) * 10) / 10,
          y: Math.round((marginTop + r * stepY) * 10) / 10,
          taken: false
        });
      }
    }

    if (slots.length === 0) return;

    // Map each token to its nearest available grid slot
    const updatedTokens = sheetTokens.map((token) => {
      let minDistance = Infinity;
      let bestSlotIndex = -1;

      slots.forEach((slot, idx) => {
        if (!slot.taken) {
          const dist = Math.hypot(slot.x - token.x, slot.y - token.y);
          if (dist < minDistance) {
            minDistance = dist;
            bestSlotIndex = idx;
          }
        }
      });

      if (bestSlotIndex !== -1) {
        slots[bestSlotIndex].taken = true;
        return {
          ...token,
          x: slots[bestSlotIndex].x,
          y: slots[bestSlotIndex].y
        };
      } else {
        // If all grid slots full, snap to paper bounds
        return {
          ...token,
          x: Math.max(marginLeft, Math.min(paperWidthMM - marginRight - tokenSizeMM, token.x)),
          y: Math.max(marginTop, Math.min(paperHeightMM - marginBottom - tokenSizeMM, token.y))
        };
      }
    });

    setSheetTokens(updatedTokens);
  }, [gapX, gapY, marginLeft, marginRight, marginTop, marginBottom, paperHeightMM, paperWidthMM, tokenSizeMM, sheetTokens]);

  // Count instances of a token on the sheet
  const getTokenCount = (presetIdOrName) => {
    return sheetTokens.filter(
      (t) => t.presetId === presetIdOrName || t.name.startsWith(presetIdOrName)
    ).length;
  };

  // Unique tokens count
  const uniqueTokenTypesCount = new Set(sheetTokens.map((t) => t.presetId || t.name)).size;

  // Add token(s) to sheet silently without pop-ups
  const handleAddTokenToSheet = (tokenObj, presetId = null, qtyToAdd = addQuantity, targetPos = null) => {
    const name = tokenObj.unitName || tokenObj.name || 'Token';
    const numCopies = Math.max(1, qtyToAdd);

    const startX = targetPos ? targetPos.x : marginLeft;
    const startY = targetPos ? targetPos.y : marginTop;

    const newItems = [];
    for (let q = 0; q < numCopies; q++) {
      const baseId = 'st_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5) + '_' + q;
      const initialPos = snapToGrid ? calculateSnapPosition(startX, startY) : { x: startX, y: startY };

      if (defaultFace === 'both') {
        newItems.push({
          id: baseId + '_f',
          presetId: presetId || name,
          name: `${name} (Front)`,
          data: tokenObj.data || tokenObj,
          side: 'front',
          x: initialPos.x,
          y: initialPos.y
        });
        newItems.push({
          id: baseId + '_b',
          presetId: presetId || name,
          name: `${name} (Back)`,
          data: tokenObj.data || tokenObj,
          side: 'back',
          x: initialPos.x,
          y: initialPos.y
        });
      } else {
        newItems.push({
          id: baseId,
          presetId: presetId || name,
          name: `${name} (${defaultFace.toUpperCase()})`,
          data: tokenObj.data || tokenObj,
          side: defaultFace,
          x: initialPos.x,
          y: initialPos.y
        });
      }
    }

    const updated = [...sheetTokens, ...newItems];
    setSheetTokens(updated);
  };

  // HTML5 Drag and Drop Handlers for dragging tokens from palette onto paper canvas
  const handleDragStartPaletteToken = (e, tokenObj, presetId = null) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        tokenObj,
        presetId
      })
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOverCanvas = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropOnCanvas = (e) => {
    e.preventDefault();
    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (!rawData) return;
      const { tokenObj, presetId } = JSON.parse(rawData);

      if (paperRef.current) {
        const rect = paperRef.current.getBoundingClientRect();
        const dropXMM = (e.clientX - rect.left) / mmToPx - tokenSizeMM / 2;
        const dropYMM = (e.clientY - rect.top) / mmToPx - tokenSizeMM / 2;

        const constrainedX = Math.max(marginLeft, Math.min(paperWidthMM - marginRight - tokenSizeMM, dropXMM));
        const constrainedY = Math.max(marginTop, Math.min(paperHeightMM - marginBottom - tokenSizeMM, dropYMM));

        handleAddTokenToSheet(tokenObj, presetId, 1, { x: constrainedX, y: constrainedY });
      }
    } catch (err) {
      console.error('Failed to parse dropped token data', err);
    }
  };

  // Remove token from sheet
  const handleRemoveToken = (tokenId) => {
    const updated = sheetTokens.filter((t) => t.id !== tokenId);
    setSheetTokens(updated);
    if (selectedTokenId === tokenId) setSelectedTokenId(null);
  };

  // Duplicate token on sheet (seamless, with optional front/back pair duplication)
  const handleDuplicateTokenOnSheet = (tokenId) => {
    const target = sheetTokens.find((t) => t.id === tokenId);
    if (!target) return;

    const baseOffset = tokenSizeMM + gapX;
    const rawX = Math.min(paperWidthMM - marginRight - tokenSizeMM, target.x + baseOffset);
    const rawY = target.y;

    const pos = snapToGrid ? calculateSnapPosition(rawX, rawY) : { x: rawX, y: rawY };

    if (duplicatePairTogether) {
      // Create duplicate of both front and back
      const baseId = 'st_dup_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5);
      const nameWithoutSide = target.name.replace(/\s*\((Front|Back)\)$/i, '');

      const newFront = {
        ...target,
        id: baseId + '_f',
        name: `${nameWithoutSide} (Front)`,
        side: 'front',
        x: pos.x,
        y: pos.y
      };

      const newBack = {
        ...target,
        id: baseId + '_b',
        name: `${nameWithoutSide} (Back)`,
        side: 'back',
        x: pos.x,
        y: pos.y
      };

      setSheetTokens((prev) => [...prev, newFront, newBack]);
    } else {
      // Create duplicate of single selected side
      const newId = 'st_dup_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5);
      const newItem = {
        ...target,
        id: newId,
        x: pos.x,
        y: pos.y
      };
      setSheetTokens((prev) => [...prev, newItem]);
    }
  };

  // Clear sheet
  const handleClearSheet = () => {
    confirmAction({
      title: 'CLEAR PRINT SHEET',
      message: 'Are you sure you want to remove all tokens from the printable page?',
      onConfirm: () => {
        setSheetTokens([]);
        setSelectedTokenId(null);
      }
    });
  };

  // Fill sheet with copies
  const handleFillPage = (tokenObj, presetId = null) => {
    const usableW = paperWidthMM - marginLeft - marginRight;
    const usableH = paperHeightMM - marginTop - marginBottom;
    const cols = Math.floor((usableW + gapX) / (tokenSizeMM + gapX));
    const rows = Math.floor((usableH + gapY) / (tokenSizeMM + gapY));
    const totalSlots = Math.max(1, cols * rows);

    const name = tokenObj.unitName || tokenObj.name || 'Token';
    const fillItems = [];

    let count = 0;
    while (count < totalSlots) {
      const baseId = 'st_fill_' + count + '_' + Date.now().toString(36);
      if (defaultFace === 'both' && count + 1 < totalSlots) {
        fillItems.push({
          id: baseId + '_f',
          presetId: presetId || name,
          name: `${name} (Front)`,
          data: tokenObj.data || tokenObj,
          side: 'front',
          x: 0,
          y: 0
        });
        fillItems.push({
          id: baseId + '_b',
          presetId: presetId || name,
          name: `${name} (Back)`,
          data: tokenObj.data || tokenObj,
          side: 'back',
          x: 0,
          y: 0
        });
        count += 2;
      } else {
        fillItems.push({
          id: baseId,
          presetId: presetId || name,
          name: `${name} (${defaultFace === 'both' ? 'Front' : defaultFace.toUpperCase()})`,
          data: tokenObj.data || tokenObj,
          side: defaultFace === 'both' ? 'front' : defaultFace,
          x: 0,
          y: 0
        });
        count += 1;
      }
    }

    setSheetTokens(fillItems);
  };

  // Pointer/Mouse events for Drag and Drop on paper canvas
  const handleMouseDownToken = (e, token) => {
    e.stopPropagation();
    setSelectedTokenId(token.id);
    setDraggingId(token.id);

    if (paperRef.current) {
      const rect = paperRef.current.getBoundingClientRect();
      const clickXMM = (e.clientX - rect.left) / mmToPx;
      const clickYMM = (e.clientY - rect.top) / mmToPx;

      dragOffsetRef.current = {
        x: clickXMM - token.x,
        y: clickYMM - token.y
      };
    }
  };

  const handleMouseMoveCanvas = (e) => {
    if (!draggingId || !paperRef.current) return;

    const rect = paperRef.current.getBoundingClientRect();
    const cursorXMM = (e.clientX - rect.left) / mmToPx;
    const cursorYMM = (e.clientY - rect.top) / mmToPx;

    let newX = cursorXMM - dragOffsetRef.current.x;
    let newY = cursorYMM - dragOffsetRef.current.y;

    if (snapToGrid) {
      const snapped = calculateSnapPosition(newX, newY);
      newX = snapped.x;
      newY = snapped.y;
    } else {
      // Constrain to paper bounds
      newX = Math.max(0, Math.min(paperWidthMM - tokenSizeMM, newX));
      newY = Math.max(0, Math.min(paperHeightMM - tokenSizeMM, newY));
      newX = Math.round(newX * 10) / 10;
      newY = Math.round(newY * 10) / 10;
    }

    setSheetTokens((prev) =>
      prev.map((t) => (t.id === draggingId ? { ...t, x: newX, y: newY } : t))
    );
  };

  const handleMouseUpCanvas = () => {
    setDraggingId(null);
  };

  // PDF Export trigger
  const handleExportPDFClick = () => {
    if (sheetTokens.length === 0) return;
    if (onExportPDF) {
      onExportPDF({
        sheetTokens,
        paperKey,
        paperWidthMM,
        paperHeightMM,
        tokenSizeMM
      });
    }
  };

  // Direct Browser Print
  const handlePrintClick = () => {
    if (sheetTokens.length === 0) return;
    window.print();
  };

  return (
    <div className="token-printer-container" style={{ width: '100%', marginBottom: '3rem' }}>
      {/* SECTION TITLE & HEADER */}
      <div
        style={{
          background: 'var(--panel-bg)',
          padding: '1.25rem',
          borderRadius: '8px',
          boxShadow: 'var(--hud-glow)',
          border: '1px solid var(--panel-border)',
          position: 'relative',
          marginBottom: '1.5rem'
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
          /// TAC_PRINT_LAYOUT_STUDIO
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2
              style={{
                margin: 0,
                color: 'var(--accent-cyan)',
                fontFamily: "'Teko', sans-serif",
                fontSize: '2.2rem',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}
            >
              🖨️ Token Printer & Layout Studio
            </h2>
            <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Arrange tokens onto printable pages with precise gap spacing, margins, free-hand nearest-grid snapping, overlap detection, and seamless drag & drop.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportPDFClick}
              disabled={sheetTokens.length === 0}
              style={{
                padding: '0.6rem 1.2rem',
                background: sheetTokens.length === 0 ? 'var(--card-colors-bg)' : 'var(--accent-cyan)',
                color: sheetTokens.length === 0 ? 'var(--text-muted)' : 'var(--bg-dark)',
                border: 'none',
                borderRadius: '4px',
                cursor: sheetTokens.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontFamily: "'Teko', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              📄 EXPORT PDF (TRUE SCALE)
            </button>

            <button
              type="button"
              onClick={handlePrintClick}
              disabled={sheetTokens.length === 0}
              style={{
                padding: '0.6rem 1.2rem',
                background: sheetTokens.length === 0 ? 'var(--card-colors-bg)' : 'var(--accent-blue)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: sheetTokens.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontFamily: "'Teko', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              🖨️ BROWSER PRINT
            </button>

            {sheetTokens.length > 0 && (
              <button
                type="button"
                onClick={handleClearSheet}
                style={{
                  padding: '0.6rem 1rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  border: '1px solid #ef4444',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontFamily: "'Teko', sans-serif",
                  fontSize: '1.2rem',
                  letterSpacing: '1px'
                }}
              >
                🗑️ CLEAR SHEET
              </button>
            )}
          </div>
        </div>
      </div>

      {/* THREE-COLUMN LAYOUT: SETTINGS ON LEFT | CANVAS IN CENTER | PALETTE ON RIGHT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(290px, 340px) 1fr minmax(290px, 340px)',
          gap: '1.25rem',
          alignItems: 'start'
        }}
        className="printer-grid"
      >
        {/* LEFT COLUMN: PAGE SETTINGS & SPACING CONFIGURATION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="tint-card tint-card-attributes">
            <h3 className="subsection-header">📄 Page Settings</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label className="field-label">Paper Format</label>
                <select
                  value={paperKey}
                  onChange={(e) => setPaperKey(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {Object.entries(PAPER_PRESETS).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Token Print Size (mm)</label>
                <select
                  value={sizeOption}
                  onChange={handleSizeOptionChange}
                  style={{ width: '100%' }}
                >
                  <option value="15">15 mm (Small Game Token - Default)</option>
                  <option value="25">25 mm (Standard 1" Game Token)</option>
                  <option value="30">30 mm Medium Token</option>
                  <option value="40">40 mm Large Token</option>
                  <option value="custom">Custom Size...</option>
                </select>
              </div>

              {sizeOption === 'custom' && (
                <div>
                  <label className="field-label">Custom Size (mm)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={tokenSizeMM}
                    onChange={(e) => setTokenSizeMM(Math.max(5, Math.min(100, Number(e.target.value) || 15)))}
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label className="field-label">Horiz. Gap (X mm)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={gapX}
                    onChange={(e) => setGapX(Math.max(0, Number(e.target.value) || 0))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="field-label">Vert. Gap (Y mm)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={gapY}
                    onChange={(e) => setGapY(Math.max(0, Number(e.target.value) || 0))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Print Face Side</label>
                <select
                  value={defaultFace}
                  onChange={(e) => setDefaultFace(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="both">Both (Front & Back Pair)</option>
                  <option value="front">Front Side Only</option>
                  <option value="back">Back Side Only</option>
                </select>
              </div>

              {/* DUPLICATE PAIR TOGGLE */}
              <div style={{ background: 'var(--input-bg)', padding: '0.5rem 0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  <input
                    type="checkbox"
                    checked={duplicatePairTogether}
                    onChange={(e) => setDuplicatePairTogether(e.target.checked)}
                  />
                  Duplicate Front & Back Pair Together
                </label>
                <p style={{ margin: '0.2rem 0 0 1.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  When enabled, duplicating a token automatically duplicates both its front and back sides.
                </p>
              </div>

              {/* MARGINS INPUTS */}
              <div>
                <label className="field-label" style={{ marginBottom: '0.2rem' }}>Page Margins (mm)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.3rem' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Top</span>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={marginTop}
                      onChange={(e) => setMarginTop(Math.max(0, Number(e.target.value) || 0))}
                      style={{ width: '100%', padding: '0.2rem' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Bottom</span>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={marginBottom}
                      onChange={(e) => setMarginBottom(Math.max(0, Number(e.target.value) || 0))}
                      style={{ width: '100%', padding: '0.2rem' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Left</span>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={marginLeft}
                      onChange={(e) => setMarginLeft(Math.max(0, Number(e.target.value) || 0))}
                      style={{ width: '100%', padding: '0.2rem' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Right</span>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={marginRight}
                      onChange={(e) => setMarginRight(Math.max(0, Number(e.target.value) || 0))}
                      style={{ width: '100%', padding: '0.2rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* GRID LINES TOGGLE */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '0.2rem' }}>
                <input
                  type="checkbox"
                  checked={showGridLines}
                  onChange={(e) => setShowGridLines(e.target.checked)}
                />
                📐 Show Red Preview Grid Lines
              </label>

              {/* CONNECTED DIV FOR SNAP TO GRID & AUTO-ARRANGE */}
              <div
                style={{
                  background: 'var(--input-bg)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: snapToGrid ? '1px solid var(--accent-cyan)' : '1px solid var(--panel-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  marginTop: '0.3rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <input
                      type="checkbox"
                      checked={snapToGrid}
                      onChange={(e) => setSnapToGrid(e.target.checked)}
                    />
                    🧲 Live Snap to Grid
                  </label>
                  <span style={{ fontSize: '0.7rem', color: snapToGrid ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                    {snapToGrid ? 'Active' : 'Free-Hand'}
                  </span>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
                  {snapToGrid
                    ? 'Tokens automatically lock to grid slots during live dragging.'
                    : 'Tokens can be moved freely anywhere. Use Auto-Arrange below to snap all tokens to their nearest empty grid slots.'}
                </div>

                <button
                  type="button"
                  onClick={arrangeNearestGridSlots}
                  disabled={snapToGrid || sheetTokens.length === 0}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.6rem',
                    background: snapToGrid || sheetTokens.length === 0 ? 'var(--card-colors-bg)' : 'var(--accent-cyan)',
                    color: snapToGrid || sheetTokens.length === 0 ? 'var(--text-muted)' : 'var(--bg-dark)',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: snapToGrid || sheetTokens.length === 0 ? 'not-allowed' : 'pointer',
                    fontFamily: "'Teko', sans-serif",
                    fontSize: '1rem',
                    letterSpacing: '1px'
                  }}
                  title={snapToGrid ? 'Auto-arrange is available when Live Snap to Grid is OFF' : 'Snap free-placed tokens to nearest open grid slots'}
                >
                  📐 Auto-Arrange to Nearest Grid Slots
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* CENTER COLUMN: INTERACTIVE PRINTABLE PAPER CANVAS */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

          {/* Sheet Stats Header */}
          <div
            style={{
              width: '100%',
              maxWidth: `${canvasPixelWidth}px`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem',
              background: 'var(--input-bg)',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: '1px solid var(--panel-border)',
              fontSize: '0.82rem'
            }}
          >
            <div>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>Paper:</span> {paperConfig.name} |{' '}
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>Total Tokens:</span> {sheetTokens.length} ({uniqueTokenTypesCount} unique)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {overlappingTokenIds.size > 0 && (
                <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  ⚠️ {overlappingTokenIds.size} Overlapping
                </span>
              )}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                💡 Drag tokens from right list onto canvas
              </span>
            </div>
          </div>

          {/* PAPER CANVAS */}
          <div
            id="token-printer-paper-sheet"
            ref={paperRef}
            onMouseMove={handleMouseMoveCanvas}
            onMouseUp={handleMouseUpCanvas}
            onMouseLeave={handleMouseUpCanvas}
            onDragOver={handleDragOverCanvas}
            onDrop={handleDropOnCanvas}
            style={{
              width: `${canvasPixelWidth}px`,
              height: `${canvasPixelHeight}px`,
              backgroundColor: '#ffffff',
              borderRadius: '2px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 1px rgba(0,0,0,0.4)',
              position: 'relative',
              overflow: 'hidden',
              userSelect: 'none',
              cursor: draggingId ? 'grabbing' : 'default',
              transition: 'height 0.2s ease, width 0.2s ease'
            }}
          >
            {/* Margin Indicator Guidelines */}
            <div
              className="print-ui-overlay"
              style={{
                position: 'absolute',
                top: `${marginTop * mmToPx}px`,
                bottom: `${marginBottom * mmToPx}px`,
                left: `${marginLeft * mmToPx}px`,
                right: `${marginRight * mmToPx}px`,
                border: '1px dashed #ef4444',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />

            {/* Red Dotted Preview Grid Lines */}
            {showGridLines && (
              <svg
                className="print-ui-overlay"
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.45, zIndex: 0 }}
              >
                <defs>
                  <pattern
                    id="printer-red-grid-pattern"
                    x={marginLeft * mmToPx}
                    y={marginTop * mmToPx}
                    width={(tokenSizeMM + gapX) * mmToPx}
                    height={(tokenSizeMM + gapY) * mmToPx}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width={tokenSizeMM * mmToPx}
                      height={tokenSizeMM * mmToPx}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#printer-red-grid-pattern)" />
              </svg>
            )}

            {sheetTokens.length === 0 ? (
              <div
                className="print-ui-overlay"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: '#94a3b8',
                  fontFamily: "'Share Tech Mono', monospace"
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>🖨️</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>PRINTABLE PAGE SHEET IS EMPTY</div>
                <div style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>Drag or click tokens from the right panel to place them on this page!</div>
              </div>
            ) : (
              sheetTokens.map((token) => {
                const tokenPxSize = tokenSizeMM * mmToPx;
                const leftPx = token.x * mmToPx;
                const topPx = token.y * mmToPx;
                const isSelected = selectedTokenId === token.id;
                const isOverlapping = overlappingTokenIds.has(token.id);

                return (
                  <div
                    key={token.id}
                    onMouseDown={(e) => handleMouseDownToken(e, token)}
                    style={{
                      position: 'absolute',
                      left: `${leftPx}px`,
                      top: `${topPx}px`,
                      width: `${tokenPxSize}px`,
                      height: `${tokenPxSize}px`,
                      cursor: 'grab',
                      zIndex: isSelected ? 10 : isOverlapping ? 5 : 1,
                      transition: draggingId === token.id ? 'none' : 'box-shadow 0.15s ease'
                    }}
                  >
                    {/* Render Land Token */}
                    <LandToken
                      tokenData={token.data}
                      side={token.side || 'front'}
                      size={tokenPxSize}
                    />

                    {/* Overlap Pulsing Red Border Glow (Class print-ui-overlay excluded during export) */}
                    {isOverlapping && (
                      <div
                        className="print-ui-overlay pulsing-overlap-glow"
                        style={{
                          position: 'absolute',
                          top: -2,
                          left: -2,
                          right: -2,
                          bottom: -2,
                          border: '2px solid #ef4444',
                          pointerEvents: 'none'
                        }}
                      />
                    )}

                    {/* Selection & Hover Controls Overlay */}
                    <div
                      className="print-ui-overlay"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: `${tokenPxSize * 0.08}px`,
                        border: isSelected ? '2px solid #00f0ff' : '1px solid transparent',
                        boxShadow: isSelected ? '0 0 8px rgba(0,240,255,0.8)' : 'none',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Quick Action Delete Button */}
                    <button
                      type="button"
                      className="print-ui-overlay"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveToken(token.id);
                      }}
                      title="Remove token from sheet"
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ef4444',
                        color: '#ffffff',
                        border: '1px solid #ffffff',
                        borderRadius: '50%',
                        width: `${Math.max(18, tokenPxSize * 0.28)}px`,
                        height: `${Math.max(18, tokenPxSize * 0.28)}px`,
                        fontSize: `${Math.max(10, tokenPxSize * 0.16)}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                        zIndex: 20
                      }}
                    >
                      ✕
                    </button>

                    {/* Duplicate Button on Select */}
                    {isSelected && (
                      <button
                        type="button"
                        className="print-ui-overlay"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateTokenOnSheet(token.id);
                        }}
                        title={duplicatePairTogether ? 'Duplicate both front & back pair' : 'Duplicate this token'}
                        style={{
                          position: 'absolute',
                          bottom: '-8px',
                          right: '-8px',
                          background: '#00f0ff',
                          color: '#0a0e17',
                          border: '1px solid #ffffff',
                          borderRadius: '50%',
                          width: `${Math.max(18, tokenPxSize * 0.28)}px`,
                          height: `${Math.max(18, tokenPxSize * 0.28)}px`,
                          fontSize: `${Math.max(10, tokenPxSize * 0.16)}px`,
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                          zIndex: 20
                        }}
                      >
                        +
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: TOKEN SELECTION PALETTE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* TOKEN ADD QUANTITY CONTROLLER */}
          <div className="tint-card tint-card-dice">
            <h3 className="subsection-header">🎯 Token Selection Palette</h3>
            <p className="field-help-text">Click or drag any token onto the printable page sheet on the left!</p>

            {/* BATCH QUANTITY INPUT */}
            <div style={{ background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--panel-border)', marginBottom: '0.5rem' }}>
              <label className="field-label">Batch Add Quantity (Per Click)</label>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={addQuantity}
                  onChange={(e) => setAddQuantity(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                  style={{ width: '70px', fontWeight: 'bold', textAlign: 'center' }}
                />

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {[1, 2, 5, 10].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAddQuantity(q)}
                      style={{
                        padding: '0.25rem 0.45rem',
                        background: addQuantity === q ? 'var(--accent-cyan)' : 'var(--card-colors-bg)',
                        color: addQuantity === q ? 'var(--bg-dark)' : 'var(--text-primary)',
                        border: '1px solid var(--panel-border)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.78rem'
                      }}
                    >
                      {q}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* A) ACTIVE TOKEN FROM GENERATOR */}
            <div
              draggable
              onDragStart={(e) => handleDragStartPaletteToken(e, activeTokenData, 'active_token')}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: '6px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.8rem',
                cursor: 'grab'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                <div style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                  <LandToken tokenData={activeTokenData} side="front" size={48} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--accent-cyan)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activeTokenData.unitName || 'ACTIVE WORKSPACE TOKEN'}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Currently editing token</span>
                  {getTokenCount(activeTokenData.unitName || 'ACTIVE WORKSPACE TOKEN') > 0 && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', fontWeight: 'bold' }}>
                      On sheet: {getTokenCount(activeTokenData.unitName || 'ACTIVE WORKSPACE TOKEN')} copy(ies)
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <button
                  type="button"
                  onClick={() => handleAddTokenToSheet(activeTokenData, 'active_token', addQuantity)}
                  style={{
                    padding: '0.35rem 0.6rem',
                    background: 'var(--accent-cyan)',
                    color: 'var(--bg-dark)',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  + Add {addQuantity}x
                </button>

                <button
                  type="button"
                  onClick={() => handleFillPage(activeTokenData, 'active_token')}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: 'var(--card-colors-bg)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.72rem'
                  }}
                >
                  Fill Sheet
                </button>
              </div>
            </div>

            {/* B) SAVED TOKENS LIBRARY LIST */}
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Saved Tokens Library ({savedTokens.length})
              </div>

              {savedTokens.length === 0 ? (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.8rem', background: 'var(--input-bg)', borderRadius: '4px', border: '1px dashed var(--panel-border)' }}>
                  No saved token presets found. Save tokens from the Token Generator section to use them here!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.2rem' }}>
                  {savedTokens.map((item) => {
                    const count = getTokenCount(item.id);
                    const tokenData = item.data;

                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStartPaletteToken(e, item.data, item.id)}
                        style={{
                          background: 'var(--input-bg)',
                          border: count > 0 ? '1px solid var(--accent-cyan)' : '1px solid var(--panel-border)',
                          borderRadius: '6px',
                          padding: '0.5rem 0.65rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.6rem',
                          cursor: 'grab'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0 }}>
                          <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                            <LandToken tokenData={tokenData} side="front" size={40} />
                          </div>
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{tokenData.category || 'land'}</span>
                              {count > 0 && (
                                <span style={{ fontSize: '0.68rem', background: 'var(--accent-blue)', color: '#fff', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
                                  x{count} on sheet
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <button
                            type="button"
                            onClick={() => handleAddTokenToSheet(item.data, item.id, addQuantity)}
                            style={{
                              padding: '0.3rem 0.5rem',
                              background: 'var(--accent-cyan)',
                              color: 'var(--bg-dark)',
                              border: 'none',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            + Add {addQuantity}x
                          </button>

                          <button
                            type="button"
                            onClick={() => handleFillPage(item.data, item.id)}
                            style={{
                              padding: '0.3rem 0.4rem',
                              background: 'var(--card-colors-bg)',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--panel-border)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.7rem'
                            }}
                          >
                            Fill Page
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
