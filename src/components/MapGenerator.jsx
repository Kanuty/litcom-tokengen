import React, { useState, useRef } from 'react';

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
 * @param {number} cx - Center X
 * @param {number} cy - Center Y
 * @param {number} r - Radius
 * @param {string} orientation - 'pointy' | 'flat'
 * @returns {string} Points string for SVG polygon "x1,y1 x2,y2 ..."
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

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupStrokeColor, setNewGroupStrokeColor] = useState('#3b82f6');
  const [newGroupStrokeWidth, setNewGroupStrokeWidth] = useState(3);
  const [newGroupFillColor, setNewGroupFillColor] = useState('#3b82f6');

  // Selected Hex Direct Styling State
  const [selectedHexStrokeColor, setSelectedHexStrokeColor] = useState('#ef4444');
  const [selectedHexStrokeWidth, setSelectedHexStrokeWidth] = useState(3);
  const [selectedHexFillColor, setSelectedHexFillColor] = useState('#ef4444');
  const [selectedHexFillOpacity, setSelectedHexFillOpacity] = useState(0.2);

  // Default color groups fallback
  const colorGroups = mapData.colorGroups || [
    { id: 'naval', name: 'Naval', strokeColor: '#0284c7', strokeWidth: 1, fillColor: '#0284c7', fillOpacity: 0.1 },
    { id: 'land_easy', name: 'Land Easy', strokeColor: '#22c55e', strokeWidth: 3, fillColor: '#22c55e', fillOpacity: 0.1 },
    { id: 'land_med', name: 'Land Medium', strokeColor: '#eab308', strokeWidth: 3, fillColor: '#eab308', fillOpacity: 0.1 },
    { id: 'land_hard', name: 'Land Hard', strokeColor: '#f97316', strokeWidth: 4, fillColor: '#f97316', fillOpacity: 0.15 },
    { id: 'land_vhard', name: 'Land Very Hard', strokeColor: '#dc2626', strokeWidth: 5, fillColor: '#dc2626', fillOpacity: 0.2 }
  ];

  const hexOverrides = mapData.hexOverrides || {};

  // Handle image dimensions when image is loaded
  const handleImageLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.target;
    if (w && h) {
      setNaturalWidth(w);
      setNaturalHeight(h);
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

  // Hex selection handler
  const handleHexClick = (hexId, e) => {
    e.stopPropagation();
    if (e.shiftKey) {
      setSelectedHexIds((prev) =>
        prev.includes(hexId) ? prev.filter((id) => id !== hexId) : [...prev, hexId]
      );
    } else {
      setSelectedHexIds((prev) =>
        prev.length === 1 && prev[0] === hexId ? [] : [hexId]
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
      fillColor: newGroupFillColor,
      fillOpacity: 0.15
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
    // Clear overrides that used this group
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
        isInaccessible: false
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
        isInaccessible
      };
    });
    onChangeMapData({ ...mapData, hexOverrides: updated });
    showNotification({
      title: isInaccessible ? 'MARKED INACCESSIBLE' : 'UNMARKED INACCESSIBLE',
      message: `${selectedHexIds.length} hex(es) marked as ${isInaccessible ? 'inaccessible' : 'accessible'}.`
    });
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
        fillColor: selectedHexFillColor,
        fillOpacity: Number(selectedHexFillOpacity),
        groupId: null
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
              Upload any map image, configure hex density, initial coordinates (e.g. J22, AA0), custom terrain color groups, and inaccessible hexes.
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

        {/* TWO COLUMN STUDIO LAYOUT: CONTROLS PANEL ON LEFT | MAP PREVIEW CANVAS ON RIGHT */}
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.25rem', alignItems: 'start' }}>

          {/* CONTROLS PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

            {/* 1. MAP FILE UPLOAD & NAME */}
            <div className="tint-card tint-card-attributes">
              <h3 className="subsection-header">🖼️ Map Image File</h3>

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
            </div>

            {/* 2. GRID DENSITY & HEX SIZE */}
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

            {/* 3. DEFAULT GRID LINE STYLING */}
            <div className="tint-card tint-card-colors">
              <h3 className="subsection-header">🎨 Default Grid Line Styling</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Line Color</label>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={mapData.strokeColor || '#22c55e'}
                      onChange={(e) => onChangeMapData({ ...mapData, strokeColor: e.target.value })}
                    />
                    <input
                      type="text"
                      value={mapData.strokeColor || '#22c55e'}
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
                <label className="field-label">Grid Line Opacity ({Math.round((mapData.strokeOpacity ?? 0.8) * 100)}%)</label>
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
                <label className="field-label">Default Hex Fill Color & Opacity</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={mapData.fillColor || '#ffffff'}
                      onChange={(e) => onChangeMapData({ ...mapData, fillColor: e.target.value })}
                    />
                    <input
                      type="text"
                      value={mapData.fillColor || '#ffffff'}
                      onChange={(e) => onChangeMapData({ ...mapData, fillColor: e.target.value })}
                      style={{ width: '80px', fontSize: '0.8rem', textTransform: 'uppercase' }}
                    />
                  </div>
                  <div>
                    <input
                      type="range"
                      min="0.0"
                      max="0.5"
                      step="0.02"
                      value={mapData.fillOpacity ?? 0.0}
                      onChange={(e) => onChangeMapData({ ...mapData, fillOpacity: Number(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. COORDINATE NUMBERS & LABELS */}
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
                          value={mapData.coordColor || '#15803d'}
                          onChange={(e) => onChangeMapData({ ...mapData, coordColor: e.target.value })}
                        />
                        <input
                          type="text"
                          value={mapData.coordColor || '#15803d'}
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
                      <label className="field-label">Transparency ({Math.round((mapData.coordOpacity ?? 1.0) * 100)}%)</label>
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

            {/* 5. TERRAIN COLOR GROUPS */}
            <div className="tint-card tint-card-aircraft">
              <h3 className="subsection-header">🏰 Terrain Color Groups</h3>
              <p className="field-help-text" style={{ margin: '0 0 0.6rem 0' }}>
                Color groups control styling (Naval, Land Easy/Medium/Hard/Very Hard). Editing a group updates all assigned hexes automatically.
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
                      <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {grp.name}
                      </span>

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
                          + Apply to Selected ({selectedHexIds.length})
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
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Border</span>
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
                            style={{ width: '45px', fontSize: '0.75rem' }}
                          />
                          px
                        </div>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Fill</span>
                        <input
                          type="color"
                          value={grp.fillColor}
                          onChange={(e) => handleUpdateGroup(grp.id, 'fillColor', e.target.value)}
                        />
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Fill Opacity</span>
                        <input
                          type="range"
                          min="0.0"
                          max="0.5"
                          step="0.02"
                          value={grp.fillOpacity}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', fontSize: '0.75rem' }}>
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
                    <span style={{ color: 'var(--text-muted)' }}>Width (px)</span>
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
                    <span style={{ color: 'var(--text-muted)' }}>Fill Color</span>
                    <input
                      type="color"
                      value={newGroupFillColor}
                      onChange={(e) => setNewGroupFillColor(e.target.value)}
                      style={{ display: 'block', width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 6. SELECTED HEXES STYLING & INACCESSIBLE CONTROLS */}
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

              <p className="field-help-text" style={{ margin: '0.4rem 0' }}>
                Click hexes on the map preview to select them (hold Shift for multi-select). Apply custom styling, mark as inaccessible, or assign terrain groups below.
              </p>

              {/* INACCESSIBLE HEX BUTTONS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
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

              {/* DIRECT INDIVIDUAL HEX STYLING */}
              <div style={{ background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)', marginTop: '0.4rem' }}>
                <span className="field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.4rem' }}>
                  🎨 Apply Direct Custom Hex Style
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.4rem' }}>
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
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Border Width (px)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={selectedHexStrokeWidth}
                      onChange={(e) => setSelectedHexStrokeWidth(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Fill Color</label>
                    <input
                      type="color"
                      value={selectedHexFillColor}
                      onChange={(e) => setSelectedHexFillColor(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Fill Opacity</label>
                    <input
                      type="range"
                      min="0.0"
                      max="0.5"
                      step="0.02"
                      value={selectedHexFillOpacity}
                      onChange={(e) => setSelectedHexFillOpacity(Number(e.target.value))}
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

            {/* 7. PRESET STORAGE SAVE CARD */}
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

          {/* MAP CANVAS PREVIEW */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              alignItems: 'center',
              width: '100%',
              overflow: 'hidden'
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
              <div
                style={{
                  width: '100%',
                  overflow: 'auto',
                  background: '#05080f',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                {/* CONTAINER FOR HTML-TO-IMAGE PNG EXPORT */}
                <div
                  id="tactical-map-export-container"
                  ref={containerRef}
                  style={{
                    position: 'relative',
                    width: `${naturalWidth}px`,
                    height: `${naturalHeight}px`,
                    maxWidth: '100%',
                    background: '#05080f',
                    lineHeight: 0
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
                      display: 'block'
                    }}
                  />

                  {/* SVG OVERLAY HEX GRID */}
                  {isGenerated && (
                    <svg
                      width={naturalWidth}
                      height={naturalHeight}
                      viewBox={`0 0 ${naturalWidth} ${naturalHeight}`}
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

                      {hexes.map((hex) => {
                        const pointsStr = getHexPoints(hex.cx, hex.cy, radius, orientation);
                        const isSelected = selectedHexIds.includes(hex.id);
                        const override = hexOverrides[hex.id];

                        // Compute styling based on override, color group, or default
                        let hexStrokeColor = mapData.strokeColor || '#22c55e';
                        let hexStrokeWidth = mapData.strokeWidth || 2;
                        let hexFillColor = mapData.fillColor || '#ffffff';
                        let hexFillOpacity = mapData.fillOpacity ?? 0.0;
                        let isInaccessible = false;

                        if (override) {
                          if (override.isInaccessible) {
                            isInaccessible = true;
                            hexStrokeColor = '#dc2626';
                            hexStrokeWidth = Math.max(4, Number(override.strokeWidth) || mapData.strokeWidth || 3);
                          } else if (override.groupId) {
                            const group = colorGroups.find((g) => g.id === override.groupId);
                            if (group) {
                              hexStrokeColor = group.strokeColor;
                              hexStrokeWidth = group.strokeWidth;
                              hexFillColor = group.fillColor;
                              hexFillOpacity = group.fillOpacity;
                            }
                          } else {
                            if (override.strokeColor) hexStrokeColor = override.strokeColor;
                            if (override.strokeWidth) hexStrokeWidth = override.strokeWidth;
                            if (override.fillColor) hexFillColor = override.fillColor;
                            if (override.fillOpacity !== undefined) hexFillOpacity = override.fillOpacity;
                          }
                        }

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
                            onClick={(e) => handleHexClick(hex.id, e)}
                            style={{ cursor: 'pointer' }}
                          >
                            {/* Base Hex Fill & Polygon */}
                            <polygon
                              points={pointsStr}
                              fill={isInaccessible ? 'url(#inaccessible-hatch-pattern)' : hexFillColor}
                              fillOpacity={isInaccessible ? 1.0 : hexFillOpacity}
                              stroke={isSelected ? '#00f0ff' : hexStrokeColor}
                              strokeWidth={isSelected ? Math.max(4, hexStrokeWidth + 2) : hexStrokeWidth}
                              strokeOpacity={isSelected ? 1.0 : (mapData.strokeOpacity ?? 0.8)}
                            />

                            {/* Additional Glow / Highlight Outline for Selected Hex */}
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
                                fill={mapData.coordColor || '#15803d'}
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
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
