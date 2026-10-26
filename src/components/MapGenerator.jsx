import React, { useState, useRef, useEffect } from 'react';

/**
 * Converts a 0-indexed column integer to letter representation (0 -> 'A', 25 -> 'Z', 26 -> 'AA', 27 -> 'AB', etc.)
 */
function colIndexToLetters(index) {
  let num = Math.max(0, index) + 1;
  let letters = '';
  while (num > 0) {
    let rem = (num - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    num = Math.floor((num - 1) / 26);
  }
  return letters;
}

/**
 * Converts a letter string (e.g. 'A', 'Z', 'AA', 'J') to 0-indexed column integer ('A' -> 0, 'J' -> 9, 'AA' -> 26)
 */
function lettersToColIndex(str) {
  if (!str) return 0;
  const upper = String(str).toUpperCase().replace(/[^A-Z]/g, '');
  if (!upper) return 0;
  let index = 0;
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
}

/**
 * Helper function to compute SVG polygon points for a single hexagon.
 */
function getHexPoints(cx, cy, r, orientation = 'pointy') {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angleRad =
      orientation === 'flat'
        ? (i * Math.PI) / 3
        : (Math.PI / 6) + (i * Math.PI) / 3;
    const x = cx + r * Math.cos(angleRad);
    const y = cy + r * Math.sin(angleRad);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(' ');
}

export function MapGenerator({
  mapData,
  onChangeMapData,
  onSavePreset,
  onExportPNG,
  onExportJSON,
  onImportJSON,
  showNotification
}) {
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const jsonImportRef = useRef(null);

  const [naturalWidth, setNaturalWidth] = useState(1200);
  const [naturalHeight, setNaturalHeight] = useState(800);
  const [isGenerated, setIsGenerated] = useState(true);
  const [saveName, setSaveName] = useState('');
  const [selectedHexIds, setSelectedHexIds] = useState([]);

  // Interactive Brush Tool State
  const [interactionMode, setInteractionMode] = useState('select'); // 'select' | 'brush'
  const [brushAction, setBrushAction] = useState('group'); // 'group' | 'solid_mask' | 'inaccessible' | 'custom' | 'clear'
  const [brushSize, setBrushSize] = useState(1); // 1 (Small), 7 (Medium), 19 (Large)
  const [activeBrushGroup, setActiveBrushGroup] = useState('naval');
  const [brushMaskColor, setBrushMaskColor] = useState('#ffffff');
  const [isMouseDown, setIsMouseDown] = useState(false);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupStrokeColor, setNewGroupStrokeColor] = useState('#3b82f6');
  const [newGroupStrokeWidth, setNewGroupStrokeWidth] = useState(3);
  const [newGroupStrokeOpacity, setNewGroupStrokeOpacity] = useState(0.8);
  const [newGroupFillColor, setNewGroupFillColor] = useState('#3b82f6');
  const [newGroupFillOpacity, setNewGroupFillOpacity] = useState(0.15);
  const [newGroupImportance, setNewGroupImportance] = useState(1);

  // Selected Hex Direct Styling State
  const [selectedHexStrokeColor, setSelectedHexStrokeColor] = useState('#ef4444');
  const [selectedHexStrokeWidth, setSelectedHexStrokeWidth] = useState(3);
  const [selectedHexStrokeOpacity, setSelectedHexStrokeOpacity] = useState(1.0);
  const [selectedHexFillColor, setSelectedHexFillColor] = useState('#ef4444');
  const [selectedHexFillOpacity, setSelectedHexFillOpacity] = useState(0.25);
  const [selectedHexImportance, setSelectedHexImportance] = useState(5);
  const [selectedMaskColor, setSelectedMaskColor] = useState('#ffffff');

  // Global mouseup listener for smooth drag brush painting
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsMouseDown(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Default color groups setup (Naval Configuration with Gradation Importance Levels)
  const colorGroups = mapData.colorGroups || [
    { id: 'naval', name: 'Naval', strokeColor: '#0284c7', strokeWidth: 2, strokeOpacity: 0.8, fillColor: '#0284c7', fillOpacity: 0.15, importance: 0 },
    { id: 'land_easy', name: 'Land Easy', strokeColor: '#22c55e', strokeWidth: 3, strokeOpacity: 0.8, fillColor: '#22c55e', fillOpacity: 0.15, importance: 1 },
    { id: 'land_med', name: 'Land Medium', strokeColor: '#eab308', strokeWidth: 3, strokeOpacity: 0.8, fillColor: '#eab308', fillOpacity: 0.15, importance: 2 },
    { id: 'land_hard', name: 'Land Hard', strokeColor: '#f97316', strokeWidth: 4, strokeOpacity: 0.9, fillColor: '#f97316', fillOpacity: 0.2, importance: 3 },
    { id: 'land_vhard', name: 'Land Very Hard', strokeColor: '#dc2626', strokeWidth: 5, strokeOpacity: 1.0, fillColor: '#dc2626', fillOpacity: 0.25, importance: 4 }
  ];

  const hexOverrides = mapData.hexOverrides || {};

  // Handle image dimensions when image is loaded
  const handleImageLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.target;
    if (w && h) {
      setNaturalWidth(w);
      setNaturalHeight(h);
      if (!mapData.exportWidth || !mapData.exportHeight) {
        onChangeMapData({
          ...mapData,
          exportWidth: w,
          exportHeight: h
        });
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        onChangeMapData({
          ...mapData,
          imageUrl: evt.target.result,
          title: file.name.replace(/\.[^/.]+$/, '')
        });
        setIsGenerated(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateClick = () => {
    if (!mapData.imageUrl) {
      showNotification({
        title: 'NO IMAGE UPLOADED',
        message: 'Please upload a map image file first before generating grid.',
        type: 'info'
      });
      return;
    }
    setIsGenerated(true);
    showNotification({
      title: 'GRID GENERATED',
      message: 'Hexagonal grid overlaid onto map image.',
      type: 'info'
    });
  };

  // Compute hex grid
  const hexes = [];
  const radius = Math.max(10, Math.min(300, Number(mapData.hexSize) || 40));
  const orientation = mapData.orientation || 'pointy';
  const offsetX = Number(mapData.offsetX) || 0;
  const offsetY = Number(mapData.offsetY) || 0;

  // Starting coordinate offsets
  const startColLetter = mapData.startColLetter || 'A';
  const startColNum = isNaN(Number(mapData.startColNum)) ? 1 : Number(mapData.startColNum);
  const startRow = isNaN(Number(mapData.startRow)) ? 1 : Number(mapData.startRow);
  const startColLetterIdx = lettersToColIndex(startColLetter);

  if (mapData.imageUrl && isGenerated) {
    if (orientation === 'pointy') {
      const hexW = Math.sqrt(3) * radius;
      const colSpacing = hexW;
      const rowSpacing = 1.5 * radius;

      const cols = Math.ceil((naturalWidth + hexW) / colSpacing) + 2;
      const rows = Math.ceil((naturalHeight + radius * 2) / rowSpacing) + 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = c * colSpacing + (r % 2 === 1 ? colSpacing / 2 : 0) + offsetX;
          const cy = r * rowSpacing + radius + offsetY;

          if (cx >= -radius && cx <= naturalWidth + radius && cy >= -radius && cy <= naturalHeight + radius) {
            const actualColIdx = c + startColLetterIdx;
            const actualColNum = c + startColNum;
            const actualRow = r + startRow;

            let label = '';
            if (mapData.coordFormat === 'A1') {
              const letterStr = colIndexToLetters(actualColIdx);
              label = `${letterStr}${actualRow}`;
            } else {
              const colStr = String(actualColNum).padStart(2, '0');
              const rowStr = String(actualRow).padStart(2, '0');
              label = `${colStr}${rowStr}`;
            }

            hexes.push({ id: `h_${c}_${r}`, cx, cy, label, col: c, row: r });
          }
        }
      }
    } else {
      // flat-topped
      const hexH = Math.sqrt(3) * radius;
      const colSpacing = 1.5 * radius;
      const rowSpacing = hexH;

      const cols = Math.ceil((naturalWidth + radius * 2) / colSpacing) + 2;
      const rows = Math.ceil((naturalHeight + hexH) / rowSpacing) + 2;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const cx = c * colSpacing + radius + offsetX;
          const cy = r * rowSpacing + (c % 2 === 1 ? rowSpacing / 2 : 0) + offsetY;

          if (cx >= -radius && cx <= naturalWidth + radius && cy >= -radius && cy <= naturalHeight + radius) {
            const actualColIdx = c + startColLetterIdx;
            const actualColNum = c + startColNum;
            const actualRow = r + startRow;

            let label = '';
            if (mapData.coordFormat === 'A1') {
              const letterStr = colIndexToLetters(actualColIdx);
              label = `${letterStr}${actualRow}`;
            } else {
              const colStr = String(actualColNum).padStart(2, '0');
              const rowStr = String(actualRow).padStart(2, '0');
              label = `${colStr}${rowStr}`;
            }

            hexes.push({ id: `h_${c}_${r}`, cx, cy, label, col: c, row: r });
          }
        }
      }
    }
  }

  // Helper to compute hex importance level
  const getHexImportance = (hexId) => {
    const override = hexOverrides[hexId];
    if (!override) return -1; // Default grid
    if (override.isSolidMask) return 100;
    if (override.isInaccessible) return 50;
    if (override.groupId) {
      const group = colorGroups.find((g) => g.id === override.groupId);
      return group ? (group.importance ?? 0) : 0;
    }
    return override.importance ?? 10;
  };

  // Brush Painting Handler
  const applyBrushToHexes = (targetHex) => {
    if (!targetHex) return;

    let thresholdDist = radius * 0.8; // Small (1 hex)
    if (brushSize === 7) thresholdDist = radius * 2.2; // Medium (7 hexes)
    if (brushSize === 19) thresholdDist = radius * 4.0; // Large (19 hexes)

    const affectedHexes = hexes.filter((h) => {
      const dx = h.cx - targetHex.cx;
      const dy = h.cy - targetHex.cy;
      return Math.sqrt(dx * dx + dy * dy) <= thresholdDist;
    });

    if (affectedHexes.length === 0) return;

    const updated = { ...hexOverrides };
    affectedHexes.forEach((h) => {
      if (brushAction === 'clear') {
        delete updated[h.id];
      } else if (brushAction === 'solid_mask') {
        updated[h.id] = {
          isSolidMask: true,
          solidMaskColor: brushMaskColor
        };
      } else if (brushAction === 'inaccessible') {
        updated[h.id] = {
          isInaccessible: true,
          isSolidMask: false
        };
      } else if (brushAction === 'group') {
        updated[h.id] = {
          groupId: activeBrushGroup,
          isInaccessible: false,
          isSolidMask: false
        };
      } else if (brushAction === 'custom') {
        updated[h.id] = {
          strokeColor: selectedHexStrokeColor,
          strokeWidth: selectedHexStrokeWidth,
          strokeOpacity: selectedHexStrokeOpacity,
          fillColor: selectedHexFillColor,
          fillOpacity: selectedHexFillOpacity,
          importance: selectedHexImportance,
          groupId: null,
          isSolidMask: false,
          isInaccessible: false
        };
      }
    });

    onChangeMapData({ ...mapData, hexOverrides: updated });
  };

  // Hex click handler for select mode
  const handleHexClick = (hex, e) => {
    if (interactionMode === 'brush') return;
    e.stopPropagation();
    if (e.shiftKey) {
      setSelectedHexIds((prev) =>
        prev.includes(hex.id) ? prev.filter((id) => id !== hex.id) : [...prev, hex.id]
      );
    } else {
      setSelectedHexIds((prev) =>
        prev.length === 1 && prev[0] === hex.id ? [] : [hex.id]
      );
    }
  };

  const handleSelectAll = () => {
    setSelectedHexIds(hexes.map((h) => h.id));
  };

  const handleDeselectAll = () => {
    setSelectedHexIds([]);
  };

  // Group Management Handlers
  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    const gId = 'group_' + Date.now().toString(36);
    const newGroup = {
      id: gId,
      name: newGroupName.trim(),
      strokeColor: newGroupStrokeColor,
      strokeWidth: Number(newGroupStrokeWidth) || 2,
      strokeOpacity: Number(newGroupStrokeOpacity),
      fillColor: newGroupFillColor,
      fillOpacity: Number(newGroupFillOpacity),
      importance: Number(newGroupImportance) || 0
    };

    const updatedGroups = [...colorGroups, newGroup];
    onChangeMapData({ ...mapData, colorGroups: updatedGroups });
    setNewGroupName('');
    showNotification({ title: 'COLOR GROUP ADDED', message: `Added terrain color group "${newGroup.name}".` });
  };

  const handleUpdateGroup = (groupId, field, value) => {
    const updated = colorGroups.map((g) => {
      if (g.id === groupId) {
        return { ...g, [field]: value };
      }
      return g;
    });
    onChangeMapData({ ...mapData, colorGroups: updated });
  };

  const handleDeleteGroup = (groupId) => {
    const updated = colorGroups.filter((g) => g.id !== groupId);
    const newOverrides = { ...hexOverrides };
    Object.keys(newOverrides).forEach((hId) => {
      if (newOverrides[hId]?.groupId === groupId) {
        delete newOverrides[hId].groupId;
      }
    });
    onChangeMapData({ ...mapData, colorGroups: updated, hexOverrides: newOverrides });
  };

  // Apply Group to Selected Hexes
  const handleAssignSelectedToGroup = (groupId) => {
    if (selectedHexIds.length === 0) return;
    const updated = { ...hexOverrides };
    selectedHexIds.forEach((hId) => {
      updated[hId] = {
        ...(updated[hId] || {}),
        groupId,
        isInaccessible: false,
        isSolidMask: false
      };
    });
    onChangeMapData({ ...mapData, hexOverrides: updated });
    showNotification({ title: 'STYLE APPLIED', message: `Assigned ${selectedHexIds.length} hex(es) to group.` });
  };

  // Toggle Inaccessible for Selected Hexes
  const handleToggleInaccessibleSelected = (isInaccessible) => {
    if (selectedHexIds.length === 0) return;
    const updated = { ...hexOverrides };
    selectedHexIds.forEach((hId) => {
      updated[hId] = {
        ...(updated[hId] || {}),
        isInaccessible,
        isSolidMask: false
      };
    });
    onChangeMapData({ ...mapData, hexOverrides: updated });
    showNotification({
      title: isInaccessible ? 'MARKED INACCESSIBLE' : 'UNMARKED INACCESSIBLE',
      message: `${selectedHexIds.length} hex(es) marked as ${isInaccessible ? 'inaccessible' : 'accessible'}.`
    });
  };

  // Apply Solid Mask to Selected Hexes
  const handleApplySolidMaskSelected = () => {
    if (selectedHexIds.length === 0) return;
    const updated = { ...hexOverrides };
    selectedHexIds.forEach((hId) => {
      updated[hId] = {
        isSolidMask: true,
        solidMaskColor: selectedMaskColor
      };
    });
    onChangeMapData({ ...mapData, hexOverrides: updated });
    showNotification({ title: 'SOLID COVER APPLIED', message: `Applied solid mask cover to ${selectedHexIds.length} hex(es).` });
  };

  // Apply Custom Individual Style to Selected Hexes
  const handleApplyCustomStyleSelected = () => {
    if (selectedHexIds.length === 0) return;
    const updated = { ...hexOverrides };
    selectedHexIds.forEach((hId) => {
      updated[hId] = {
        ...(updated[hId] || {}),
        strokeColor: selectedHexStrokeColor,
        strokeWidth: Number(selectedHexStrokeWidth) || 3,
        strokeOpacity: Number(selectedHexStrokeOpacity),
        fillColor: selectedHexFillColor,
        fillOpacity: Number(selectedHexFillOpacity),
        importance: Number(selectedHexImportance) || 5,
        groupId: null,
        isSolidMask: false
      };
    });
    onChangeMapData({ ...mapData, hexOverrides: updated });
    showNotification({ title: 'CUSTOM STYLING APPLIED', message: `Applied custom styling to ${selectedHexIds.length} hex(es).` });
  };

  // Clear Overrides on Selected Hexes
  const handleClearSelectedOverrides = () => {
    if (selectedHexIds.length === 0) return;
    const updated = { ...hexOverrides };
    selectedHexIds.forEach((hId) => {
      delete updated[hId];
    });
    onChangeMapData({ ...mapData, hexOverrides: updated });
    showNotification({ title: 'STYLING RESET', message: `Reset styling for ${selectedHexIds.length} hex(es) to default.` });
  };

  // Sort hexes by style importance level for rendering order
  const sortedHexes = [...hexes].sort((a, b) => getHexImportance(a.id) - getHexImportance(b.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* HEADER BAR & CONTROLS */}
      <div
        style={{
          background: 'var(--panel-bg)',
          padding: '1.25rem',
          borderRadius: '8px',
          boxShadow: 'var(--hud-glow)',
          border: '1px solid var(--panel-border)',
          position: 'relative'
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
          /// TACTICAL_MAP_GENERATOR
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
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
              🗺️ Tactical Map & Hex Grid Generator
            </h2>
            <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Upload map images, paint terrain with brush tools, adjust style importance levels, cover non-hex spaces, and set custom PNG export resolution.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleGenerateClick}
              style={{
                padding: '0.6rem 1.2rem',
                background: 'var(--accent-cyan)',
                color: 'var(--bg-dark)',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: "'Teko', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '1px'
              }}
            >
              ⚡ GENERATE GRID ({hexes.length} Hexes)
            </button>

            <button
              type="button"
              onClick={onExportPNG}
              disabled={!mapData.imageUrl}
              style={{
                padding: '0.6rem 1.2rem',
                background: mapData.imageUrl ? 'var(--accent-cyan)' : 'var(--card-colors-bg)',
                color: mapData.imageUrl ? 'var(--bg-dark)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: mapData.imageUrl ? 'pointer' : 'not-allowed',
                fontFamily: "'Teko', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '1px'
              }}
            >
              📥 EXPORT MAP (PNG)
            </button>

            <button
              type="button"
              onClick={onExportJSON}
              disabled={!mapData.imageUrl}
              style={{
                padding: '0.6rem 1rem',
                background: mapData.imageUrl ? 'var(--accent-blue)' : 'var(--card-colors-bg)',
                color: mapData.imageUrl ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: mapData.imageUrl ? 'pointer' : 'not-allowed',
                fontFamily: "'Teko', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '1px'
              }}
            >
              📤 EXPORT CONFIG (JSON)
            </button>

            <label
              style={{
                padding: '0.6rem 1rem',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: "'Teko', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '1px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              📥 IMPORT JSON
              <input
                type="file"
                ref={jsonImportRef}
                accept=".json"
                onChange={onImportJSON}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* TWO COLUMN STUDIO LAYOUT: CONTROLS PANEL ON LEFT | STICKY MAP PREVIEW CANVAS ON RIGHT */}
        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '1.25rem', alignItems: 'start' }}>

          {/* CONTROLS PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

            {/* 1. MAP FILE UPLOAD, NAME & PNG EXPORT RESOLUTION */}
            <div className="tint-card tint-card-attributes">
              <h3 className="subsection-header">🖼️ Map Image File & PNG Export Size</h3>

              <div>
                <label className="field-label">Upload Map Image File</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label className="field-label">Map Title / Name</label>
                <input
                  type="text"
                  value={mapData.title || ''}
                  onChange={(e) => onChangeMapData({ ...mapData, title: e.target.value })}
                  placeholder="e.g. TAIWAN STRAIT MAP"
                  style={{ width: '100%' }}
                />
              </div>

              {/* PNG EXPORT DIMENSIONS SETUP */}
              <div style={{ background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)', marginTop: '0.2rem' }}>
                <span className="field-label" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                  📐 Custom PNG Export Resolution (Width x Height px)
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label className="field-label" style={{ fontSize: '0.75rem' }}>Export Width (px)</label>
                    <input
                      type="number"
                      placeholder={String(naturalWidth)}
                      value={mapData.exportWidth || ''}
                      onChange={(e) => onChangeMapData({ ...mapData, exportWidth: e.target.value ? Number(e.target.value) : null })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="field-label" style={{ fontSize: '0.75rem' }}>Export Height (px)</label>
                    <input
                      type="number"
                      placeholder={String(naturalHeight)}
                      value={mapData.exportHeight || ''}
                      onChange={(e) => onChangeMapData({ ...mapData, exportHeight: e.target.value ? Number(e.target.value) : null })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => onChangeMapData({ ...mapData, exportWidth: naturalWidth, exportHeight: naturalHeight })}
                    style={{ fontSize: '0.72rem', padding: '2px 6px', background: 'var(--panel-bg)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Reset to Natural ({naturalWidth}x{naturalHeight})
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeMapData({ ...mapData, exportWidth: 1920, exportHeight: 1080 })}
                    style={{ fontSize: '0.72rem', padding: '2px 6px', background: 'var(--panel-bg)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    1080p (1920x1080)
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeMapData({ ...mapData, exportWidth: 3840, exportHeight: 2160 })}
                    style={{ fontSize: '0.72rem', padding: '2px 6px', background: 'var(--panel-bg)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    4K (3840x2160)
                  </button>
                </div>
              </div>
            </div>

            {/* 2. INTERACTIVE BRUSH TOOL PANEL */}
            <div className="tint-card tint-card-grid">
              <h3 className="subsection-header">🖌️ Interactive Brush Tool</h3>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setInteractionMode('select')}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    background: interactionMode === 'select' ? 'var(--accent-cyan)' : 'var(--input-bg)',
                    color: interactionMode === 'select' ? 'var(--bg-dark)' : 'var(--text-primary)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  👆 Select Tool
                </button>

                <button
                  type="button"
                  onClick={() => setInteractionMode('brush')}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    background: interactionMode === 'brush' ? 'var(--accent-cyan)' : 'var(--input-bg)',
                    color: interactionMode === 'brush' ? 'var(--bg-dark)' : 'var(--text-primary)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  🖌️ Brush Paint Tool
                </button>
              </div>

              {interactionMode === 'brush' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)' }}>
                  <div>
                    <label className="field-label">Brush Size</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                      {[
                        { size: 1, label: 'Small (1 Hex)' },
                        { size: 7, label: 'Med (7 Hexes)' },
                        { size: 19, label: 'Large (19 Hexes)' }
                      ].map((b) => (
                        <button
                          key={b.size}
                          type="button"
                          onClick={() => setBrushSize(b.size)}
                          style={{
                            padding: '0.3rem',
                            background: brushSize === b.size ? 'var(--accent-cyan)' : 'var(--panel-bg)',
                            color: brushSize === b.size ? 'var(--bg-dark)' : 'var(--text-primary)',
                            border: '1px solid var(--panel-border)',
                            borderRadius: '3px',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Brush Paint Action</label>
                    <select
                      value={brushAction}
                      onChange={(e) => setBrushAction(e.target.value)}
                      style={{ width: '100%', fontSize: '0.82rem' }}
                    >
                      <option value="group">🏰 Paint Color Group</option>
                      <option value="solid_mask">⬛ Paint Solid Cover / Mask</option>
                      <option value="inaccessible">🚫 Paint Inaccessible Pattern</option>
                      <option value="custom">🎨 Paint Custom Style</option>
                      <option value="clear">🧹 Clear / Eraser</option>
                    </select>
                  </div>

                  {brushAction === 'group' && (
                    <div>
                      <label className="field-label">Select Color Group to Paint</label>
                      <select
                        value={activeBrushGroup}
                        onChange={(e) => setActiveBrushGroup(e.target.value)}
                        style={{ width: '100%', fontSize: '0.82rem' }}
                      >
                        {colorGroups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name} (Lvl {g.importance ?? 0})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {brushAction === 'solid_mask' && (
                    <div>
                      <label className="field-label">Solid Mask Cover Color</label>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={brushMaskColor}
                          onChange={(e) => setBrushMaskColor(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setBrushMaskColor('#ffffff')}
                          style={{ fontSize: '0.72rem', padding: '2px 6px', background: '#ffffff', color: '#000', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          White
                        </button>
                        <button
                          type="button"
                          onClick={() => setBrushMaskColor('#000000')}
                          style={{ fontSize: '0.72rem', padding: '2px 6px', background: '#000000', color: '#fff', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Black
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="field-help-text" style={{ margin: '0.2rem 0 0 0' }}>
                    Click and drag mouse across the map preview to paint hexes in real time!
                  </p>
                </div>
              )}
            </div>

            {/* 3. GRID DENSITY & HEX SIZE */}
            <div className="tint-card tint-card-grid">
              <h3 className="subsection-header">📐 Hex Grid Dimensions & Offsets</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Hex Radius (px: {radius})</label>
                  <input
                    type="range"
                    min="15"
                    max="150"
                    step="1"
                    value={mapData.hexSize || 40}
                    onChange={(e) => onChangeMapData({ ...mapData, hexSize: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="field-label">Hex Radius Value</label>
                  <input
                    type="number"
                    min="15"
                    max="200"
                    value={mapData.hexSize || 40}
                    onChange={(e) => onChangeMapData({ ...mapData, hexSize: Math.max(10, Number(e.target.value) || 40) })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Hex Orientation</label>
                  <select
                    value={mapData.orientation || 'pointy'}
                    onChange={(e) => onChangeMapData({ ...mapData, orientation: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="pointy">Pointy-Topped (⬡)</option>
                    <option value="flat">Flat-Topped (⬢)</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Coordinate Format</label>
                  <select
                    value={mapData.coordFormat || '0101'}
                    onChange={(e) => onChangeMapData({ ...mapData, coordFormat: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="0101">Numeric (0101, 0102)</option>
                    <option value="A1">Alpha-Numeric (A1, J22, AA0)</option>
                  </select>
                </div>
              </div>

              {/* INITIAL COORDINATE SELECTION */}
              <div style={{ background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)', marginTop: '0.2rem' }}>
                <span className="field-label" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                  📍 Initial Starting Coordinates
                </span>

                {mapData.coordFormat === 'A1' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label" style={{ fontSize: '0.75rem' }}>Start Col (e.g. A, J, AA)</label>
                      <input
                        type="text"
                        value={mapData.startColLetter ?? 'A'}
                        onChange={(e) => onChangeMapData({ ...mapData, startColLetter: e.target.value.toUpperCase() })}
                        style={{ width: '100%', textTransform: 'uppercase' }}
                      />
                    </div>

                    <div>
                      <label className="field-label" style={{ fontSize: '0.75rem' }}>Start Row (e.g. 0, 1, 22)</label>
                      <input
                        type="number"
                        value={mapData.startRow ?? 1}
                        onChange={(e) => onChangeMapData({ ...mapData, startRow: Number(e.target.value) || 0 })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label" style={{ fontSize: '0.75rem' }}>Start Col Num (e.g. 1, 10)</label>
                      <input
                        type="number"
                        min="0"
                        value={mapData.startColNum ?? 1}
                        onChange={(e) => onChangeMapData({ ...mapData, startColNum: Number(e.target.value) || 0 })}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label className="field-label" style={{ fontSize: '0.75rem' }}>Start Row Num (e.g. 1, 22)</label>
                      <input
                        type="number"
                        min="0"
                        value={mapData.startRow ?? 1}
                        onChange={(e) => onChangeMapData({ ...mapData, startRow: Number(e.target.value) || 0 })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Grid Offset X (px)</label>
                  <input
                    type="number"
                    value={mapData.offsetX || 0}
                    onChange={(e) => onChangeMapData({ ...mapData, offsetX: Number(e.target.value) || 0 })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="field-label">Grid Offset Y (px)</label>
                  <input
                    type="number"
                    value={mapData.offsetY || 0}
                    onChange={(e) => onChangeMapData({ ...mapData, offsetY: Number(e.target.value) || 0 })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* 4. DEFAULT NAVAL GRID STYLING & UNCOVERED SPACES BACKDROP FILL */}
            <div className="tint-card tint-card-colors">
              <h3 className="subsection-header">🎨 Default Grid Line & Fill Opacity Setup</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Line Color</label>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={mapData.strokeColor || '#0284c7'}
                      onChange={(e) => onChangeMapData({ ...mapData, strokeColor: e.target.value })}
                    />
                    <input
                      type="text"
                      value={mapData.strokeColor || '#0284c7'}
                      onChange={(e) => onChangeMapData({ ...mapData, strokeColor: e.target.value })}
                      style={{ width: '80px', fontSize: '0.8rem', textTransform: 'uppercase' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Line Width (px: {mapData.strokeWidth || 2})</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={mapData.strokeWidth || 2}
                    onChange={(e) => onChangeMapData({ ...mapData, strokeWidth: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Border Line Opacity ({Math.round((mapData.strokeOpacity ?? 0.8) * 100)}%)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={mapData.strokeOpacity ?? 0.8}
                  onChange={(e) => onChangeMapData({ ...mapData, strokeOpacity: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="field-label">Default Hex Fill Color & Fill Opacity</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={mapData.fillColor || '#0284c7'}
                      onChange={(e) => onChangeMapData({ ...mapData, fillColor: e.target.value })}
                    />
                    <input
                      type="text"
                      value={mapData.fillColor || '#0284c7'}
                      onChange={(e) => onChangeMapData({ ...mapData, fillColor: e.target.value })}
                      style={{ width: '80px', fontSize: '0.8rem', textTransform: 'uppercase' }}
                    />
                  </div>
                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Fill Opacity ({Math.round((mapData.fillOpacity ?? 0.1) * 100)}%)</label>
                    <input
                      type="range"
                      min="0.0"
                      max="0.8"
                      step="0.02"
                      value={mapData.fillOpacity ?? 0.1}
                      onChange={(e) => onChangeMapData({ ...mapData, fillOpacity: Number(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* COVER UNCOVERED MAP SPACES WITH BACKDROP COLOR */}
              <div style={{ background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 'bold' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(mapData.coverUncoveredSpaces)}
                    onChange={(e) => onChangeMapData({ ...mapData, coverUncoveredSpaces: e.target.checked })}
                  />
                  Cover All Non-Hex Spaces with Backdrop Color
                </label>

                {mapData.coverUncoveredSpaces && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.4rem', alignItems: 'center' }}>
                    <div>
                      <label className="field-label" style={{ fontSize: '0.72rem' }}>Backdrop Color</label>
                      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={mapData.uncoveredSpaceColor || mapData.fillColor || '#0284c7'}
                          onChange={(e) => onChangeMapData({ ...mapData, uncoveredSpaceColor: e.target.value })}
                        />
                        <input
                          type="text"
                          value={mapData.uncoveredSpaceColor || mapData.fillColor || '#0284c7'}
                          onChange={(e) => onChangeMapData({ ...mapData, uncoveredSpaceColor: e.target.value })}
                          style={{ width: '70px', fontSize: '0.75rem', textTransform: 'uppercase' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="field-label" style={{ fontSize: '0.72rem' }}>Opacity ({Math.round((mapData.uncoveredSpaceOpacity ?? 0.1) * 100)}%)</label>
                      <input
                        type="range"
                        min="0.0"
                        max="1.0"
                        step="0.02"
                        value={mapData.uncoveredSpaceOpacity ?? 0.1}
                        onChange={(e) => onChangeMapData({ ...mapData, uncoveredSpaceOpacity: Number(e.target.value) })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 5. COORDINATE NUMBERS & LABELS */}
            <div className="tint-card tint-card-text">
              <h3 className="subsection-header">🔢 Coordinate Labels & Fonts</h3>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  <input
                    type="checkbox"
                    checked={mapData.showCoordinates !== false}
                    onChange={(e) => onChangeMapData({ ...mapData, showCoordinates: e.target.checked })}
                  />
                  Show Hex Coordinates on Map
                </label>
              </div>

              {mapData.showCoordinates !== false && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Coordinate Color</label>
                      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={mapData.coordColor || '#0284c7'}
                          onChange={(e) => onChangeMapData({ ...mapData, coordColor: e.target.value })}
                        />
                        <input
                          type="text"
                          value={mapData.coordColor || '#0284c7'}
                          onChange={(e) => onChangeMapData({ ...mapData, coordColor: e.target.value })}
                          style={{ width: '80px', fontSize: '0.8rem', textTransform: 'uppercase' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="field-label">Font Size (px: {mapData.coordFontSize || 10})</label>
                      <input
                        type="number"
                        min="6"
                        max="32"
                        value={mapData.coordFontSize || 10}
                        onChange={(e) => onChangeMapData({ ...mapData, coordFontSize: Number(e.target.value) || 10 })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Label Placement</label>
                      <select
                        value={mapData.coordPosition || 'top'}
                        onChange={(e) => onChangeMapData({ ...mapData, coordPosition: e.target.value })}
                        style={{ width: '100%' }}
                      >
                        <option value="top">Top Center</option>
                        <option value="center">Center</option>
                        <option value="bottom">Bottom Center</option>
                      </select>
                    </div>

                    <div>
                      <label className="field-label">Opacity ({Math.round((mapData.coordOpacity ?? 1.0) * 100)}%)</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={mapData.coordOpacity ?? 1.0}
                        onChange={(e) => onChangeMapData({ ...mapData, coordOpacity: Number(e.target.value) })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Coordinate Font Family</label>
                    <select
                      value={mapData.coordFontFamily || "'Share Tech Mono', monospace"}
                      onChange={(e) => onChangeMapData({ ...mapData, coordFontFamily: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      <option value="'Share Tech Mono', monospace">Share Tech Mono (Cyber)</option>
                      <option value="'Chakra Petch', sans-serif">Chakra Petch</option>
                      <option value="'Manrope', sans-serif">Manrope</option>
                      <option value="'Special Elite', cursive">Special Elite</option>
                      <option value="'Josefin Sans', sans-serif">Josefin Sans</option>
                      <option value="'Teko', sans-serif">Teko (Condensed Military)</option>
                      <option value="'Courier New', monospace">Courier New</option>
                      <option value="Arial, sans-serif">Arial</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* 6. TERRAIN COLOR GROUPS WITH GRADATION IMPORTANCE */}
            <div className="tint-card tint-card-aircraft">
              <h3 className="subsection-header">🏰 Terrain Color Groups & Height Importance</h3>
              <p className="field-help-text" style={{ margin: '0 0 0.6rem 0' }}>
                Higher importance levels render on top of lower ones (e.g. Land level 1 renders on top of Naval level 0).
              </p>

              {/* EXISTING COLOR GROUPS LIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {colorGroups.map((grp) => (
                  <div
                    key={grp.id}
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--panel-border)',
                      borderRadius: '4px',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          {grp.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', padding: '1px 5px', background: 'var(--accent-cyan)', color: 'var(--bg-dark)', borderRadius: '3px', fontWeight: 'bold' }}>
                          Lvl {grp.importance ?? 0}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleAssignSelectedToGroup(grp.id)}
                          disabled={selectedHexIds.length === 0}
                          title="Apply group to currently selected hexes"
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 6px',
                            background: selectedHexIds.length > 0 ? 'var(--accent-cyan)' : 'var(--panel-border)',
                            color: selectedHexIds.length > 0 ? 'var(--bg-dark)' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: selectedHexIds.length > 0 ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold'
                          }}
                        >
                          + Apply ({selectedHexIds.length})
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(grp.id)}
                          title="Delete group"
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 6px',
                            background: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', fontSize: '0.75rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Border & Width</span>
                        <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                          <input
                            type="color"
                            value={grp.strokeColor}
                            onChange={(e) => handleUpdateGroup(grp.id, 'strokeColor', e.target.value)}
                          />
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={grp.strokeWidth}
                            onChange={(e) => handleUpdateGroup(grp.id, 'strokeWidth', Number(e.target.value))}
                            style={{ width: '40px', fontSize: '0.75rem' }}
                          />
                          px
                        </div>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Border Opacity</span>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={grp.strokeOpacity ?? 0.8}
                          onChange={(e) => handleUpdateGroup(grp.id, 'strokeOpacity', Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Importance Lvl</span>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={grp.importance ?? 0}
                          onChange={(e) => handleUpdateGroup(grp.id, 'importance', Number(e.target.value))}
                          style={{ width: '100%', fontSize: '0.75rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.75rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Fill Color</span>
                        <input
                          type="color"
                          value={grp.fillColor}
                          onChange={(e) => handleUpdateGroup(grp.id, 'fillColor', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Fill Opacity ({Math.round((grp.fillOpacity ?? 0.15) * 100)}%)</span>
                        <input
                          type="range"
                          min="0.0"
                          max="0.8"
                          step="0.02"
                          value={grp.fillOpacity ?? 0.15}
                          onChange={(e) => handleUpdateGroup(grp.id, 'fillOpacity', Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD NEW COLOR GROUP FORM */}
              <div style={{ background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px dashed var(--panel-border)' }}>
                <span className="field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                  + Create New Color Group
                </span>

                <div style={{ display: 'flex', gap: '0.4rem', margin: '0.4rem 0' }}>
                  <input
                    type="text"
                    placeholder="Group Name (e.g. Swamp, Urban)"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddGroup}
                    style={{
                      padding: '0.3rem 0.6rem',
                      background: 'var(--accent-cyan)',
                      color: 'var(--bg-dark)',
                      border: 'none',
                      borderRadius: '3px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Add
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.4rem', fontSize: '0.75rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Border Color</span>
                    <input
                      type="color"
                      value={newGroupStrokeColor}
                      onChange={(e) => setNewGroupStrokeColor(e.target.value)}
                      style={{ display: 'block', width: '100%' }}
                    />
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Width</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newGroupStrokeWidth}
                      onChange={(e) => setNewGroupStrokeWidth(Number(e.target.value))}
                      style={{ width: '100%', fontSize: '0.75rem' }}
                    />
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Fill</span>
                    <input
                      type="color"
                      value={newGroupFillColor}
                      onChange={(e) => setNewGroupFillColor(e.target.value)}
                      style={{ display: 'block', width: '100%' }}
                    />
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Importance</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={newGroupImportance}
                      onChange={(e) => setNewGroupImportance(Number(e.target.value))}
                      style={{ width: '100%', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Border Opacity</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={newGroupStrokeOpacity}
                      onChange={(e) => setNewGroupStrokeOpacity(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Fill Opacity</span>
                    <input
                      type="range"
                      min="0.0"
                      max="0.8"
                      step="0.02"
                      value={newGroupFillOpacity}
                      onChange={(e) => setNewGroupFillOpacity(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 7. SELECTED HEXES STYLING, SOLID COVER & INACCESSIBLE CONTROLS */}
            <div className="tint-card tint-card-grid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="subsection-header" style={{ margin: 0 }}>
                  🎯 Selected Hexes ({selectedHexIds.length})
                </h3>

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 6px',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--panel-border)',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 6px',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--panel-border)',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Deselect
                  </button>
                </div>
              </div>

              {/* SOLID COVER MASK BUTTON & COLOR PICKER */}
              <div style={{ background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)', marginTop: '0.4rem' }}>
                <span className="field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.4rem' }}>
                  ⬛ Solid Cover / Mask Hex (Covers All Markings & Numbers)
                </span>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={selectedMaskColor}
                    onChange={(e) => setSelectedMaskColor(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleApplySolidMaskSelected}
                    disabled={selectedHexIds.length === 0}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      background: selectedHexIds.length > 0 ? 'var(--accent-cyan)' : 'var(--panel-border)',
                      color: selectedHexIds.length > 0 ? 'var(--bg-dark)' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: selectedHexIds.length > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '0.8rem'
                    }}
                  >
                    Cover Selected ({selectedHexIds.length})
                  </button>
                </div>
              </div>

              {/* INACCESSIBLE HEX BUTTONS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => handleToggleInaccessibleSelected(true)}
                  disabled={selectedHexIds.length === 0}
                  style={{
                    padding: '0.4rem',
                    background: selectedHexIds.length > 0 ? '#dc2626' : 'var(--panel-border)',
                    color: selectedHexIds.length > 0 ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: selectedHexIds.length > 0 ? 'pointer' : 'not-allowed',
                    fontSize: '0.8rem'
                  }}
                >
                  🚫 Mark Inaccessible
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleInaccessibleSelected(false)}
                  disabled={selectedHexIds.length === 0}
                  style={{
                    padding: '0.4rem',
                    background: selectedHexIds.length > 0 ? 'var(--accent-blue)' : 'var(--panel-border)',
                    color: selectedHexIds.length > 0 ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: selectedHexIds.length > 0 ? 'pointer' : 'not-allowed',
                    fontSize: '0.8rem'
                  }}
                >
                  ✅ Unmark Inaccessible
                </button>
              </div>

              {/* DIRECT INDIVIDUAL HEX STYLING WITH SEPARATE OPACITIES */}
              <div style={{ background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)', marginTop: '0.4rem' }}>
                <span className="field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.4rem' }}>
                  🎨 Apply Direct Custom Hex Style
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Border Color</label>
                    <input
                      type="color"
                      value={selectedHexStrokeColor}
                      onChange={(e) => setSelectedHexStrokeColor(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Border Width</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={selectedHexStrokeWidth}
                      onChange={(e) => setSelectedHexStrokeWidth(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Fill Color</label>
                    <input
                      type="color"
                      value={selectedHexFillColor}
                      onChange={(e) => setSelectedHexFillColor(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Border Opacity</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={selectedHexStrokeOpacity}
                      onChange={(e) => setSelectedHexStrokeOpacity(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Fill Opacity</label>
                    <input
                      type="range"
                      min="0.0"
                      max="0.8"
                      step="0.02"
                      value={selectedHexFillOpacity}
                      onChange={(e) => setSelectedHexFillOpacity(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Importance Lvl</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={selectedHexImportance}
                      onChange={(e) => setSelectedHexImportance(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={handleApplyCustomStyleSelected}
                    disabled={selectedHexIds.length === 0}
                    style={{
                      padding: '0.4rem',
                      background: selectedHexIds.length > 0 ? 'var(--accent-cyan)' : 'var(--panel-border)',
                      color: selectedHexIds.length > 0 ? 'var(--bg-dark)' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: selectedHexIds.length > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '0.78rem'
                    }}
                  >
                    Apply Custom Style
                  </button>

                  <button
                    type="button"
                    onClick={handleClearSelectedOverrides}
                    disabled={selectedHexIds.length === 0}
                    style={{
                      padding: '0.4rem',
                      background: selectedHexIds.length > 0 ? '#dc2626' : 'var(--panel-border)',
                      color: selectedHexIds.length > 0 ? '#ffffff' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: selectedHexIds.length > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '0.78rem'
                    }}
                  >
                    Reset Selected Styling
                  </button>
                </div>
              </div>
            </div>

            {/* 8. PRESET STORAGE SAVE CARD */}
            <div className="tint-card tint-card-attributes">
              <h3 className="subsection-header">💾 Save Map Preset</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSavePreset(saveName);
                  setSaveName('');
                }}
                style={{ display: 'flex', gap: '0.6rem' }}
              >
                <input
                  type="text"
                  placeholder={mapData.title || 'Preset Name...'}
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.4rem 1rem',
                    background: 'var(--accent-cyan)',
                    color: 'var(--bg-dark)',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Teko', sans-serif",
                    fontSize: '1.1rem',
                    letterSpacing: '1px'
                  }}
                >
                  SAVE MAP
                </button>
              </form>
            </div>

          </div>

          {/* MAP CANVAS PREVIEW (STICKY CONTAINER WITH DUAL-AXIS OVERFLOW SCROLLING) */}
          <div
            style={{
              position: 'sticky',
              top: '80px',
              maxHeight: 'calc(100vh - 100px)',
              overflow: 'auto',
              background: '#05080f',
              border: '1px solid var(--panel-border)',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            {!mapData.imageUrl ? (
              <div
                style={{
                  width: '100%',
                  minHeight: '480px',
                  background: 'var(--input-bg)',
                  border: '2px dashed var(--accent-cyan)',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗺️</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-cyan)', fontFamily: "'Teko', sans-serif", fontSize: '1.8rem' }}>
                  No Map Image Uploaded
                </h3>
                <p style={{ margin: '0 0 1rem 0', maxWidth: '400px', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Click "Upload Map Image File" on the left controls panel to import any image and construct custom hexagonal tabletop gaming grids.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '0.6rem 1.2rem',
                    background: 'var(--accent-cyan)',
                    color: 'var(--bg-dark)',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Teko', sans-serif",
                    fontSize: '1.2rem',
                    letterSpacing: '1px'
                  }}
                >
                  📂 CHOOSE MAP IMAGE FILE
                </button>
              </div>
            ) : (
              /* CONTAINER FOR HTML-TO-IMAGE PNG EXPORT */
              <div
                id="tactical-map-export-container"
                ref={containerRef}
                style={{
                  position: 'relative',
                  width: `${naturalWidth}px`,
                  height: `${naturalHeight}px`,
                  background: '#05080f',
                  lineHeight: 0,
                  userSelect: 'none'
                }}
              >
                {/* BASE MAP IMAGE */}
                <img
                  ref={imageRef}
                  src={mapData.imageUrl}
                  alt={mapData.title || 'Tactical Map'}
                  onLoad={handleImageLoad}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    pointerEvents: 'none'
                  }}
                />

                {/* SVG OVERLAY HEX GRID */}
                {isGenerated && (
                  <svg
                    width={naturalWidth}
                    height={naturalHeight}
                    viewBox={`0 0 ${naturalWidth} ${naturalHeight}`}
                    onMouseDown={() => setIsMouseDown(true)}
                    onMouseUp={() => setIsMouseDown(false)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <defs>
                      {/* INACCESSIBLE DIAGONAL HATCH PATTERN */}
                      <pattern
                        id="inaccessible-hatch-pattern"
                        width="12"
                        height="12"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(45)"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="12"
                          stroke="#dc2626"
                          strokeWidth="3"
                          strokeOpacity="0.85"
                        />
                      </pattern>
                    </defs>

                    {/* BACKDROP COVER FOR UNCOVERED SPACES */}
                    {mapData.coverUncoveredSpaces && (
                      <rect
                        x="0"
                        y="0"
                        width={naturalWidth}
                        height={naturalHeight}
                        fill={mapData.uncoveredSpaceColor || mapData.fillColor || '#0284c7'}
                        fillOpacity={mapData.uncoveredSpaceOpacity ?? 0.1}
                        style={{ pointerEvents: 'none' }}
                      />
                    )}

                    {/* LAYER 1: BASE GRID POLYGONS & OVERRIDES (SORTED BY IMPORTANCE LEVEL) */}
                    {sortedHexes.map((hex) => {
                      const pointsStr = getHexPoints(hex.cx, hex.cy, radius, orientation);
                      const isSelected = selectedHexIds.includes(hex.id);
                      const override = hexOverrides[hex.id];

                      let hexStrokeColor = mapData.strokeColor || '#0284c7';
                      let hexStrokeWidth = mapData.strokeWidth || 2;
                      let hexStrokeOpacity = mapData.strokeOpacity ?? 0.8;
                      let hexFillColor = mapData.fillColor || '#0284c7';
                      let hexFillOpacity = mapData.fillOpacity ?? 0.1;
                      let isInaccessible = false;
                      let isSolidMask = false;

                      if (override) {
                        if (override.isSolidMask) {
                          isSolidMask = true;
                        } else if (override.isInaccessible) {
                          isInaccessible = true;
                          hexStrokeColor = '#dc2626';
                          hexStrokeWidth = Math.max(4, Number(override.strokeWidth) || mapData.strokeWidth || 3);
                          hexStrokeOpacity = 1.0;
                        } else if (override.groupId) {
                          const group = colorGroups.find((g) => g.id === override.groupId);
                          if (group) {
                            hexStrokeColor = group.strokeColor;
                            hexStrokeWidth = group.strokeWidth;
                            hexStrokeOpacity = group.strokeOpacity ?? 0.8;
                            hexFillColor = group.fillColor;
                            hexFillOpacity = group.fillOpacity;
                          }
                        } else {
                          if (override.strokeColor) hexStrokeColor = override.strokeColor;
                          if (override.strokeWidth) hexStrokeWidth = override.strokeWidth;
                          if (override.strokeOpacity !== undefined) hexStrokeOpacity = override.strokeOpacity;
                          if (override.fillColor) hexFillColor = override.fillColor;
                          if (override.fillOpacity !== undefined) hexFillOpacity = override.fillOpacity;
                        }
                      }

                      // If solid mask, skip rendering in base grid layer (will render in TOP layer)
                      if (isSolidMask) return null;

                      // Label Y Position
                      let labelY = hex.cy;
                      if (mapData.coordPosition === 'top') {
                        labelY = hex.cy - radius * 0.55;
                      } else if (mapData.coordPosition === 'bottom') {
                        labelY = hex.cy + radius * 0.55;
                      }

                      return (
                        <g
                          key={hex.id}
                          onClick={(e) => handleHexClick(hex, e)}
                          onMouseDown={() => {
                            if (interactionMode === 'brush') applyBrushToHexes(hex);
                          }}
                          onMouseEnter={() => {
                            if (interactionMode === 'brush' && isMouseDown) applyBrushToHexes(hex);
                          }}
                          style={{ cursor: interactionMode === 'brush' ? 'crosshair' : 'pointer' }}
                        >
                          {/* Base Hex Fill & Polygon */}
                          <polygon
                            points={pointsStr}
                            fill={isInaccessible ? 'url(#inaccessible-hatch-pattern)' : hexFillColor}
                            fillOpacity={isInaccessible ? 1.0 : hexFillOpacity}
                            stroke={isSelected ? '#00f0ff' : hexStrokeColor}
                            strokeWidth={isSelected ? Math.max(4, hexStrokeWidth + 2) : hexStrokeWidth}
                            strokeOpacity={isSelected ? 1.0 : hexStrokeOpacity}
                          />

                          {/* Glow / Highlight Outline for Selected Hex */}
                          {isSelected && (
                            <polygon
                              points={pointsStr}
                              fill="none"
                              stroke="#00f0ff"
                              strokeWidth={Math.max(5, hexStrokeWidth + 3)}
                              strokeDasharray="6,4"
                            />
                          )}

                          {/* Coordinate Label */}
                          {mapData.showCoordinates !== false && (
                            <text
                              x={hex.cx}
                              y={labelY}
                              fill={mapData.coordColor || '#0284c7'}
                              opacity={mapData.coordOpacity ?? 1.0}
                              fontSize={mapData.coordFontSize || 10}
                              fontWeight="bold"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontFamily={mapData.coordFontFamily || "'Share Tech Mono', monospace"}
                              style={{ pointerEvents: 'none', userSelect: 'none' }}
                            >
                              {hex.label}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* LAYER 2: TOP LAYER SOLID COVER / MASK HEXES (Renders over base grid & text labels) */}
                    {hexes.map((hex) => {
                      const override = hexOverrides[hex.id];
                      if (!override || !override.isSolidMask) return null;

                      const pointsStr = getHexPoints(hex.cx, hex.cy, radius, orientation);
                      const isSelected = selectedHexIds.includes(hex.id);
                      const maskColor = override.solidMaskColor || '#ffffff';

                      return (
                        <g
                          key={`top_${hex.id}`}
                          onClick={(e) => handleHexClick(hex, e)}
                          onMouseDown={() => {
                            if (interactionMode === 'brush') applyBrushToHexes(hex);
                          }}
                          onMouseEnter={() => {
                            if (interactionMode === 'brush' && isMouseDown) applyBrushToHexes(hex);
                          }}
                          style={{ cursor: interactionMode === 'brush' ? 'crosshair' : 'pointer' }}
                        >
                          <polygon
                            points={pointsStr}
                            fill={maskColor}
                            fillOpacity={1.0}
                            stroke={isSelected ? '#00f0ff' : maskColor}
                            strokeWidth={isSelected ? 4 : 1}
                          />

                          {isSelected && (
                            <polygon
                              points={pointsStr}
                              fill="none"
                              stroke="#00f0ff"
                              strokeWidth={5}
                              strokeDasharray="6,4"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
