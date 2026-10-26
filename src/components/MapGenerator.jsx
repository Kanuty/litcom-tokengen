import React, { useState, useRef } from 'react';

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

  // Generate grid hexes based on image size and radius
  const hexes = [];
  const radius = Math.max(10, Math.min(300, Number(mapData.hexSize) || 40));
  const orientation = mapData.orientation || 'pointy';
  const offsetX = Number(mapData.offsetX) || 0;
  const offsetY = Number(mapData.offsetY) || 0;

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
            const colLabel = String(c + 1).padStart(2, '0');
            const rowLabel = String(r + 1).padStart(2, '0');
            const label = mapData.coordFormat === 'A1'
              ? `${String.fromCharCode(65 + (c % 26))}${r + 1}`
              : `${colLabel}${rowLabel}`;

            hexes.push({ id: `h_${c}_${r}`, cx, cy, label, col: c + 1, row: r + 1 });
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
            const colLabel = String(c + 1).padStart(2, '0');
            const rowLabel = String(r + 1).padStart(2, '0');
            const label = mapData.coordFormat === 'A1'
              ? `${String.fromCharCode(65 + (c % 26))}${r + 1}`
              : `${colLabel}${rowLabel}`;

            hexes.push({ id: `h_${c}_${r}`, cx, cy, label, col: c + 1, row: r + 1 });
          }
        }
      }
    }
  }

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
              Upload any map image file, configure hexagonal grid density and coordinate labels, and export print-ready maps.
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
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.25rem', alignItems: 'start' }}>

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
              <h3 className="subsection-header">📐 Hex Grid Dimensions & Orientation</h3>

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
                    <option value="A1">Alpha-Numeric (A1, B2)</option>
                  </select>
                </div>
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

            {/* 3. LINE STYLING & COLORS */}
            <div className="tint-card tint-card-colors">
              <h3 className="subsection-header">🎨 Grid Line Styling & Transparency</h3>

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
                <label className="field-label">Hex Fill Color & Opacity</label>
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
              <h3 className="subsection-header">🔢 Coordinate Labels</h3>

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
                      <label className="field-label">Coordinate Text Color</label>
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

                  <div>
                    <label className="field-label">Label Placement</label>
                    <select
                      value={mapData.coordPosition || 'top'}
                      onChange={(e) => onChangeMapData({ ...mapData, coordPosition: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      <option value="top">Top Center of Hex</option>
                      <option value="center">Center of Hex</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* 5. PRESET STORAGE SAVE CARD */}
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
                        height: '100%',
                        pointerEvents: 'none'
                      }}
                    >
                      {hexes.map((hex) => {
                        const pointsStr = getHexPoints(hex.cx, hex.cy, radius, orientation);

                        let labelY = hex.cy;
                        if (mapData.coordPosition === 'top') {
                          labelY = hex.cy - radius * 0.55;
                        }

                        return (
                          <g key={hex.id}>
                            <polygon
                              points={pointsStr}
                              fill={mapData.fillColor || '#ffffff'}
                              fillOpacity={mapData.fillOpacity ?? 0.0}
                              stroke={mapData.strokeColor || '#22c55e'}
                              strokeWidth={mapData.strokeWidth || 2}
                              strokeOpacity={mapData.strokeOpacity ?? 0.8}
                            />

                            {mapData.showCoordinates !== false && (
                              <text
                                x={hex.cx}
                                y={labelY}
                                fill={mapData.coordColor || '#15803d'}
                                fontSize={mapData.coordFontSize || 10}
                                fontWeight="bold"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontFamily="'Share Tech Mono', monospace"
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
