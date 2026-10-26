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

/**
 * Returns 6 vertex coordinate objects [{x, y}, ...] for a hexagon
 */
function getHexVertices(cx, cy, r, orientation = 'pointy') {
  const vertices = [];
  for (let i = 0; i < 6; i++) {
    const angleRad =
      orientation === 'flat'
        ? (i * Math.PI) / 3
        : (Math.PI / 6) + (i * Math.PI) / 3;
    const x = cx + r * Math.cos(angleRad);
    const y = cy + r * Math.sin(angleRad);
    vertices.push({ x, y });
  }
  return vertices;
}

/**
 * Renders a marker icon SVG graphic or image for a given marker group
 */
function renderMarkerIcon(group, size = 32, customColor = null, customSize = null) {
  if (!group) return null;
  const effectiveSize = customSize || size || group.size || 32;
  const color = customColor || group.color || '#000000';
  const customUrl = group.customImageUrl;

  if (customUrl) {
    return (
      <image
        href={customUrl}
        x={-effectiveSize / 2}
        y={-effectiveSize / 2}
        width={effectiveSize}
        height={effectiveSize}
        preserveAspectRatio="xMidYMid meet"
      />
    );
  }

  const svgType = group.svgType || 'plane';

  return (
    <g transform={`translate(${-effectiveSize / 2}, ${-effectiveSize / 2})`}>
      <circle
        cx={effectiveSize / 2}
        cy={effectiveSize / 2}
        r={effectiveSize / 2 - 1}
        fill="#ffffff"
        fillOpacity="1"
        stroke={color}
        strokeWidth="2"
      />

      {svgType === 'plane' && (
        <path
          d="M 12 2 L 15 9 L 22 12 L 22 15 L 15 14 L 14 20 L 17 22 L 17 24 L 12 22.5 L 7 24 L 7 22 L 10 20 L 9 14 L 2 15 L 2 12 L 9 9 Z"
          fill={color}
          transform={`scale(${effectiveSize / 24})`}
        />
      )}

      {svgType === 'bridge' && (
        <path
          d="M 2 18 L 2 14 L 5 10 L 12 8 L 19 10 L 22 14 L 22 18 L 19 18 L 19 15 C 19 13 17 12 15.5 12 C 14 12 13 13 13 15 L 13 18 L 11 18 L 11 15 C 11 13 10 12 8.5 12 C 7 12 5 13 5 15 L 5 18 Z M 2 11 L 22 11"
          fill="none"
          stroke={color}
          strokeWidth="2"
          transform={`scale(${effectiveSize / 24})`}
        />
      )}

      {svgType === 'nuclear' && (
        <g transform={`scale(${effectiveSize / 24})`}>
          <circle cx="12" cy="12" r="3" fill={color} />
          <path d="M 12 12 L 8 4 A 9 9 0 0 1 16 4 Z" fill={color} />
          <path d="M 12 12 L 19 15 A 9 9 0 0 1 15 20 Z" fill={color} />
          <path d="M 12 12 L 5 15 A 9 9 0 0 1 9 20 Z" fill={color} />
        </g>
      )}

      {svgType === 'factory' && (
        <path
          d="M 2 20 L 2 12 L 7 15 L 7 10 L 12 13 L 12 8 L 18 8 L 18 20 Z M 19 4 L 21 4 L 21 7 L 19 7 Z M 14 4 L 16 4 L 16 6 L 14 6 Z"
          fill={color}
          transform={`scale(${effectiveSize / 24})`}
        />
      )}

      {svgType === 'shipyard' && (
        <path
          d="M 12 2 A 3 3 0 0 0 12 8 A 3 3 0 0 0 12 2 M 12 8 L 12 21 M 5 12 L 19 12 M 4 17 A 8 8 0 0 0 20 17"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          transform={`scale(${effectiveSize / 24})`}
        />
      )}

      {svgType === 'fortress' && (
        <path
          d="M 3 20 L 3 8 L 6 8 L 6 11 L 9 11 L 9 8 L 12 8 L 12 11 L 15 11 L 15 8 L 18 8 L 18 11 L 21 11 L 21 20 Z M 9 15 A 3 3 0 0 1 15 15 L 15 20 L 9 20 Z"
          fill={color}
          transform={`scale(${effectiveSize / 24})`}
        />
      )}
    </g>
  );
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
  const textPanelRef = useRef(null);
  const markerPanelRef = useRef(null);
  const wasDraggingRef = useRef(false);

  const [naturalWidth, setNaturalWidth] = useState(1200);
  const [naturalHeight, setNaturalHeight] = useState(800);
  const [isGenerated, setIsGenerated] = useState(true);
  const [saveName, setSaveName] = useState('');
  const [selectedHexIds, setSelectedHexIds] = useState([]);

  // Interactive Brush & Dragging Tool State
  const [interactionMode, setInteractionMode] = useState('select'); // 'select' | 'brush' | 'marker' | 'text'
  const [brushAction, setBrushAction] = useState('group'); // 'group' | 'solid_mask' | 'inaccessible' | 'custom' | 'clear'
  const [brushSize, setBrushSize] = useState(1); // 1 (Small), 7 (Medium), 19 (Large)
  const [activeBrushGroup, setActiveBrushGroup] = useState('naval');
  const [brushMaskColor, setBrushMaskColor] = useState('#ffffff');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [draggingItem, setDraggingItem] = useState(null); // { type: 'marker' | 'text', id: string, startMouseX: number, startMouseY: number, itemStartX: number, itemStartY: number }

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupStrokeColor, setNewGroupStrokeColor] = useState('#3b82f6');
  const [newGroupStrokeWidth, setNewGroupStrokeWidth] = useState(3);
  const [newGroupStrokeOpacity, setNewGroupStrokeOpacity] = useState(0.8);
  const [newGroupFillColor, setNewGroupFillColor] = useState('#3b82f6');
  const [newGroupFillOpacity, setNewGroupFillOpacity] = useState(0.15);

  // Selected Hex Direct Styling State
  const [selectedHexStrokeColor, setSelectedHexStrokeColor] = useState('#ef4444');
  const [selectedHexStrokeWidth, setSelectedHexStrokeWidth] = useState(3);
  const [selectedHexStrokeOpacity, setSelectedHexStrokeOpacity] = useState(1.0);
  const [selectedHexFillColor, setSelectedHexFillColor] = useState('#ef4444');
  const [selectedHexFillOpacity, setSelectedHexFillOpacity] = useState(0.25);
  const [selectedMaskColor, setSelectedMaskColor] = useState('#ffffff');

  // Special Hex Side Border Editor State
  const [selectedSides, setSelectedSides] = useState([0]); // side indices 0..5
  const [sideType, setSideType] = useState('inaccessible'); // 'inaccessible' | 'river' | 'cliff' | 'custom' | 'clear'
  const [sideCustomColor, setSideCustomColor] = useState('#ef4444');
  const [sideCustomWidth, setSideCustomWidth] = useState(4);
  const [sideCustomDash, setSideCustomDash] = useState('solid'); // 'solid' | 'dashed' | 'dotted'

  // Marker Group & Placed Markers State
  const [activeMarkerGroupId, setActiveMarkerGroupId] = useState('airfield');
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const [newMarkerGroupName, setNewMarkerGroupName] = useState('');
  const [newMarkerGroupSvgType, setNewMarkerGroupSvgType] = useState('fortress');
  const [newMarkerGroupColor, setNewMarkerGroupColor] = useState('#000000');
  const [newMarkerGroupSize, setNewMarkerGroupSize] = useState(32);

  // Custom Text Labels State
  const [activeTextId, setActiveTextId] = useState(null);
  const [newTextString, setNewTextString] = useState('NEW LOCATION');
  const [newTextFontSize, setNewTextFontSize] = useState(20);
  const [newTextColor, setNewTextColor] = useState('#00f0ff');
  const [newTextStrokeColor, setNewTextStrokeColor] = useState('#000000');
  const [newTextStrokeWidth, setNewTextStrokeWidth] = useState(2);
  const [newTextIsItalic, setNewTextIsItalic] = useState(false);
  const [newTextIsBold, setNewTextIsBold] = useState(true);
  const [newTextFontFamily, setNewTextFontFamily] = useState("'Share Tech Mono', monospace");

  // Helper to convert client mouse coordinates to SVG viewBox coordinates
  const getSvgCoords = (e) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = naturalWidth / rect.width;
    const scaleY = naturalHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return {
      x: Math.max(0, Math.min(naturalWidth, x)),
      y: Math.max(0, Math.min(naturalHeight, y))
    };
  };

  // Global mousemove and mouseup listeners for dragging and painting
  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      if (!draggingItem) return;
      const { x, y } = getSvgCoords(e);
      const dx = x - draggingItem.startMouseX;
      const dy = y - draggingItem.startMouseY;

      if (Math.hypot(dx, dy) > 2) {
        wasDraggingRef.current = true;
      }

      const newX = Math.round(draggingItem.itemStartX + dx);
      const newY = Math.round(draggingItem.itemStartY + dy);

      if (draggingItem.type === 'marker') {
        const updated = (mapData.placedMarkers || []).map((m) =>
          m.id === draggingItem.id ? { ...m, x: newX, y: newY } : m
        );
        onChangeMapData({ ...mapData, placedMarkers: updated });
      } else if (draggingItem.type === 'text') {
        const updated = (mapData.customTexts || []).map((t) =>
          t.id === draggingItem.id ? { ...t, x: newX, y: newY } : t
        );
        onChangeMapData({ ...mapData, customTexts: updated });
      }
    };

    const handleWindowMouseUp = () => {
      if (draggingItem) {
        setDraggingItem(null);
      }
      setIsMouseDown(false);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [draggingItem, mapData, naturalWidth, naturalHeight]);

  // Default color groups setup
  const colorGroups = mapData.colorGroups || [
    { id: 'naval', name: 'Naval', strokeColor: '#0284c7', strokeWidth: 2, strokeOpacity: 0.8, fillColor: '#0284c7', fillOpacity: 0.15 },
    { id: 'land_easy', name: 'Land Easy', strokeColor: '#22c55e', strokeWidth: 3, strokeOpacity: 0.8, fillColor: '#22c55e', fillOpacity: 0.15 },
    { id: 'land_med', name: 'Land Medium', strokeColor: '#eab308', strokeWidth: 3, strokeOpacity: 0.8, fillColor: '#eab308', fillOpacity: 0.15 },
    { id: 'land_hard', name: 'Land Hard', strokeColor: '#f97316', strokeWidth: 4, strokeOpacity: 0.9, fillColor: '#f97316', fillOpacity: 0.2 },
    { id: 'land_vhard', name: 'Land Very Hard', strokeColor: '#dc2626', strokeWidth: 5, strokeOpacity: 1.0, fillColor: '#dc2626', fillOpacity: 0.25 }
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
          groupId: null,
          isSolidMask: false,
          isInaccessible: false
        };
      }
    });

    onChangeMapData({ ...mapData, hexOverrides: updated });
  };

  // Hex click handler for select, marker, text, brush modes
  const handleHexClick = (hex, e) => {
    if (interactionMode === 'brush') return;
    e.stopPropagation();
    if (interactionMode === 'marker') {
      handleTogglePlaceMarkerOnHex(hex);
      return;
    }
    if (interactionMode === 'text') {
      handleTextMapClick(hex.cx, hex.cy);
      return;
    }
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
      fillOpacity: Number(newGroupFillOpacity)
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
        groupId: null,
        isSolidMask: false
      };
    });
    onChangeMapData({ ...mapData, hexOverrides: updated });
    showNotification({ title: 'CUSTOM STYLING APPLIED', message: `Applied custom styling to ${selectedHexIds.length} hex(es).` });
  };

  // Side Border Handlers
  const handleToggleSide = (sideIdx) => {
    setSelectedSides((prev) =>
      prev.includes(sideIdx) ? prev.filter((s) => s !== sideIdx) : [...prev, sideIdx]
    );
  };

  const handleApplySideBorders = () => {
    if (selectedHexIds.length === 0) {
      showNotification({
        title: 'NO HEXES SELECTED',
        message: 'Please select one or more hexes on the map to edit side borders.',
        type: 'info'
      });
      return;
    }
    if (selectedSides.length === 0) {
      showNotification({
        title: 'NO SIDES SELECTED',
        message: 'Please click one or more side edges in the hex editor diagram to select sides.',
        type: 'info'
      });
      return;
    }

    const updated = { ...hexOverrides };
    selectedHexIds.forEach((hId) => {
      const existing = updated[hId] || {};
      const existingBorders = { ...(existing.customBorders || {}) };

      selectedSides.forEach((sideIdx) => {
        if (sideType === 'clear') {
          delete existingBorders[sideIdx];
        } else {
          existingBorders[sideIdx] = {
            type: sideType,
            color: sideCustomColor,
            width: Number(sideCustomWidth) || 4,
            dash: sideCustomDash
          };
        }
      });

      updated[hId] = {
        ...existing,
        customBorders: existingBorders
      };
    });

    onChangeMapData({ ...mapData, hexOverrides: updated });
    showNotification({
      title: sideType === 'clear' ? 'SIDE BORDERS CLEARED' : 'SIDE BORDERS APPLIED',
      message: `Updated side border(s) on ${selectedHexIds.length} hex(es).`
    });
  };

  const handleClearAllSideBorders = () => {
    if (selectedHexIds.length === 0) return;
    const updated = { ...hexOverrides };
    selectedHexIds.forEach((hId) => {
      if (updated[hId]) {
        const newObj = { ...updated[hId] };
        delete newObj.customBorders;
        updated[hId] = newObj;
      }
    });
    onChangeMapData({ ...mapData, hexOverrides: updated });
    showNotification({
      title: 'SIDE BORDERS RESET',
      message: `Cleared all custom side borders on ${selectedHexIds.length} hex(es).`
    });
  };

  // Marker Groups and Placed Markers Data
  const markerGroups = mapData.markerGroups || [
    { id: 'airfield', name: 'Airfield', iconType: 'svg_preset', svgType: 'plane', color: '#000000', size: 32, customImageUrl: null },
    { id: 'bridge', name: 'Bridge', iconType: 'svg_preset', svgType: 'bridge', color: '#000000', size: 32, customImageUrl: null },
    { id: 'nuclear', name: 'Nuclear Facility', iconType: 'svg_preset', svgType: 'nuclear', color: '#000000', size: 32, customImageUrl: null },
    { id: 'factory', name: 'Factory', iconType: 'svg_preset', svgType: 'factory', color: '#000000', size: 32, customImageUrl: null },
    { id: 'shipyard', name: 'Shipyard', iconType: 'svg_preset', svgType: 'shipyard', color: '#000000', size: 32, customImageUrl: null }
  ];

  const placedMarkers = mapData.placedMarkers || [];

  const handleAddMarkerGroup = () => {
    if (!newMarkerGroupName.trim()) return;
    const gId = 'mg_' + Date.now().toString(36);
    const newGrp = {
      id: gId,
      name: newMarkerGroupName.trim(),
      iconType: 'svg_preset',
      svgType: newMarkerGroupSvgType,
      color: newMarkerGroupColor || '#000000',
      size: Number(newMarkerGroupSize) || 32,
      customImageUrl: null
    };

    const updated = [...markerGroups, newGrp];
    onChangeMapData({ ...mapData, markerGroups: updated });
    setActiveMarkerGroupId(gId);
    setNewMarkerGroupName('');
    showNotification({ title: 'MARKER GROUP CREATED', message: `Created custom marker group "${newGrp.name}".` });
  };

  const handleUpdateMarkerGroup = (groupId, field, value) => {
    const updated = markerGroups.map((g) => (g.id === groupId ? { ...g, [field]: value } : g));
    onChangeMapData({ ...mapData, markerGroups: updated });
  };

  const handleDeleteMarkerGroup = (groupId) => {
    const updatedGroups = markerGroups.filter((g) => g.id !== groupId);
    const updatedMarkers = placedMarkers.filter((m) => m.markerGroupId !== groupId);
    onChangeMapData({ ...mapData, markerGroups: updatedGroups, placedMarkers: updatedMarkers });
    if (activeMarkerGroupId === groupId && updatedGroups.length > 0) {
      setActiveMarkerGroupId(updatedGroups[0].id);
    }
  };

  const handleMarkerGroupImageUpload = (groupId, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        handleUpdateMarkerGroup(groupId, 'customImageUrl', evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMarkerMouseDown = (pm, e) => {
    e.stopPropagation();
    setActiveMarkerId(pm.id);
    markerPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const { x, y } = getSvgCoords(e);
    const hex = hexes.find((h) => h.id === pm.hexId);
    const startX = pm.x !== undefined ? pm.x : (hex ? hex.cx : x);
    const startY = pm.y !== undefined ? pm.y : (hex ? hex.cy : y);

    setDraggingItem({
      type: 'marker',
      id: pm.id,
      startMouseX: x,
      startMouseY: y,
      itemStartX: startX,
      itemStartY: startY
    });
  };

  const handleUpdatePlacedMarker = (markerId, field, value) => {
    const updated = placedMarkers.map((m) => (m.id === markerId ? { ...m, [field]: value } : m));
    onChangeMapData({ ...mapData, placedMarkers: updated });
  };

  const handleDeletePlacedMarker = (markerId) => {
    const updated = placedMarkers.filter((m) => m.id !== markerId);
    onChangeMapData({ ...mapData, placedMarkers: updated });
    if (activeMarkerId === markerId) setActiveMarkerId(null);
  };

  const handleClearAllPlacedMarkers = () => {
    onChangeMapData({ ...mapData, placedMarkers: [] });
    setActiveMarkerId(null);
    showNotification({ title: 'ALL MARKERS CLEARED', message: 'Cleared all placed markers from map.' });
  };

  // Custom Text Labels Data & Handlers
  const customTexts = mapData.customTexts || [];

  const handleTextMouseDown = (txt, e) => {
    e.stopPropagation();
    setActiveTextId(txt.id);
    textPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const { x, y } = getSvgCoords(e);

    setDraggingItem({
      type: 'text',
      id: txt.id,
      startMouseX: x,
      startMouseY: y,
      itemStartX: txt.x,
      itemStartY: txt.y
    });
  };

  const handleTextMapClick = (x, y) => {
    const newId = 'txt_' + Date.now().toString(36);
    const newTextObj = {
      id: newId,
      text: newTextString || 'NEW LOCATION',
      x: Math.round(x),
      y: Math.round(y),
      fontSize: Number(newTextFontSize) || 20,
      color: newTextColor,
      strokeColor: newTextStrokeColor,
      strokeWidth: Number(newTextStrokeWidth) || 2,
      isItalic: Boolean(newTextIsItalic),
      isBold: Boolean(newTextIsBold),
      fontFamily: newTextFontFamily
    };

    const updated = [...customTexts, newTextObj];
    onChangeMapData({ ...mapData, customTexts: updated });
    setActiveTextId(newId);
    showNotification({ title: 'TEXT LABEL ADDED', message: `Added label "${newTextObj.text}" at (${Math.round(x)}, ${Math.round(y)}).` });
  };

  const handleUpdateTextLabel = (textId, field, value) => {
    const updated = customTexts.map((t) => (t.id === textId ? { ...t, [field]: value } : t));
    onChangeMapData({ ...mapData, customTexts: updated });
  };

  const handleDeleteTextLabel = (textId) => {
    const updated = customTexts.filter((t) => t.id !== textId);
    onChangeMapData({ ...mapData, customTexts: updated });
    if (activeTextId === textId) {
      setActiveTextId(null);
    }
  };

  const handleClearAllTextLabels = () => {
    onChangeMapData({ ...mapData, customTexts: [] });
    setActiveTextId(null);
    showNotification({ title: 'ALL TEXT CLEARED', message: 'Cleared all custom text labels from map.' });
  };

  // SVG Canvas Click Handler for placing markers or text when clicking empty map areas
  const handleSvgCanvasClick = (e) => {
    if (wasDraggingRef.current) {
      wasDraggingRef.current = false;
      return;
    }
    const { x, y } = getSvgCoords(e);

    if (interactionMode === 'marker') {
      const newMarker = {
        id: 'm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
        markerGroupId: activeMarkerGroupId,
        x: Math.round(x),
        y: Math.round(y)
      };
      const updated = [...placedMarkers, newMarker];
      onChangeMapData({ ...mapData, placedMarkers: updated });
      setActiveMarkerId(newMarker.id);
      showNotification({ title: 'MARKER PLACED', message: `Placed marker at (${Math.round(x)}, ${Math.round(y)}).` });
    } else if (interactionMode === 'text') {
      handleTextMapClick(x, y);
    }
  };

  const renderMiniHexSelector = () => {
    const miniCx = 60;
    const miniCy = 60;
    const miniR = 40;
    const verts = getHexVertices(miniCx, miniCy, miniR, orientation);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', margin: '0.5rem 0' }}>
        <span className="field-label" style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
          📐 Interactive Hex Side Selector (Click sides to toggle)
        </span>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ background: '#090d16', borderRadius: '6px', border: '1px solid var(--panel-border)' }}>
          <polygon
            points={getHexPoints(miniCx, miniCy, miniR, orientation)}
            fill="#1e293b"
            fillOpacity={0.6}
            stroke="#334155"
            strokeWidth={1}
          />
          {verts.map((v1, idx) => {
            const v2 = verts[(idx + 1) % 6];
            const isSelected = selectedSides.includes(idx);
            const midX = (v1.x + v2.x) / 2;
            const midY = (v1.y + v2.y) / 2;

            return (
              <g key={`mini_side_${idx}`} onClick={() => handleToggleSide(idx)} style={{ cursor: 'pointer' }}>
                <line
                  x1={v1.x}
                  y1={v1.y}
                  x2={v2.x}
                  y2={v2.y}
                  stroke={isSelected ? '#00f0ff' : '#64748b'}
                  strokeWidth={isSelected ? 6 : 3}
                  strokeLinecap="round"
                />
                <circle cx={midX} cy={midY} r={8} fill={isSelected ? '#00f0ff' : '#1e293b'} stroke="#00f0ff" strokeWidth={1} />
                <text
                  x={midX}
                  y={midY}
                  fill={isSelected ? '#000000' : '#ffffff'}
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {idx + 1}
                </text>
              </g>
            );
          })}
        </svg>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button
            type="button"
            onClick={() => setSelectedSides([0, 1, 2, 3, 4, 5])}
            style={{ fontSize: '0.7rem', padding: '1px 5px', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '3px', cursor: 'pointer' }}
          >
            All Sides
          </button>
          <button
            type="button"
            onClick={() => setSelectedSides([])}
            style={{ fontSize: '0.7rem', padding: '1px 5px', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '3px', cursor: 'pointer' }}
          >
            Clear Selection
          </button>
        </div>
      </div>
    );
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
              Upload map images, paint terrain with brush tools, cover non-hex spaces, set custom inward hex border offsets, and export maps in PNG and JSON.
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

              {/* SPECIAL HEX SIDE / EDGE BORDER EDITOR */}
              <div style={{ background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)', marginTop: '0.5rem' }}>
                <span className="field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.3rem' }}>
                  🚧 Special Hex Side / Edge Border Editor
                </span>
                <p className="field-help-text" style={{ margin: '0 0 0.4rem 0' }}>
                  Select one or more sides on the mini hex diagram below and mark them as Inaccessible, River Crossing, Cliff Crossing, or Custom Border.
                </p>

                {renderMiniHexSelector()}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <div>
                    <label className="field-label" style={{ fontSize: '0.75rem' }}>Border Side Feature Type</label>
                    <select
                      value={sideType}
                      onChange={(e) => setSideType(e.target.value)}
                      style={{ width: '100%', fontSize: '0.8rem' }}
                    >
                      <option value="inaccessible">🚫 Inaccessible Border (Movement Blocked)</option>
                      <option value="river">🌊 River Crossing</option>
                      <option value="cliff">🧗 Cliff Crossing</option>
                      <option value="custom">🎨 Custom Border Line</option>
                      <option value="clear">🧹 Clear Side Border</option>
                    </select>
                  </div>

                  {sideType === 'custom' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                      <div>
                        <label className="field-label" style={{ fontSize: '0.72rem' }}>Color</label>
                        <input
                          type="color"
                          value={sideCustomColor}
                          onChange={(e) => setSideCustomColor(e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label className="field-label" style={{ fontSize: '0.72rem' }}>Width (px)</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={sideCustomWidth}
                          onChange={(e) => setSideCustomWidth(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label className="field-label" style={{ fontSize: '0.72rem' }}>Dash Style</label>
                        <select
                          value={sideCustomDash}
                          onChange={(e) => setSideCustomDash(e.target.value)}
                          style={{ width: '100%', fontSize: '0.75rem' }}
                        >
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.3rem' }}>
                    <button
                      type="button"
                      onClick={handleApplySideBorders}
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
                      Apply Side Border(s)
                    </button>

                    <button
                      type="button"
                      onClick={handleClearAllSideBorders}
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
                      Reset All Side Borders
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. INTERACTIVE BRUSH & MAP TOOL PANEL */}
            <div className="tint-card tint-card-grid">
              <h3 className="subsection-header">🖌️ Map Interactive Tool Mode</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.4rem', marginBottom: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setInteractionMode('select')}
                  style={{
                    padding: '0.4rem 0.2rem',
                    background: interactionMode === 'select' ? 'var(--accent-cyan)' : 'var(--input-bg)',
                    color: interactionMode === 'select' ? 'var(--bg-dark)' : 'var(--text-primary)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  👆 Select
                </button>

                <button
                  type="button"
                  onClick={() => setInteractionMode('brush')}
                  style={{
                    padding: '0.4rem 0.2rem',
                    background: interactionMode === 'brush' ? 'var(--accent-cyan)' : 'var(--input-bg)',
                    color: interactionMode === 'brush' ? 'var(--bg-dark)' : 'var(--text-primary)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  🖌️ Brush
                </button>

                <button
                  type="button"
                  onClick={() => setInteractionMode('marker')}
                  style={{
                    padding: '0.4rem 0.2rem',
                    background: interactionMode === 'marker' ? 'var(--accent-cyan)' : 'var(--input-bg)',
                    color: interactionMode === 'marker' ? 'var(--bg-dark)' : 'var(--text-primary)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  📍 Marker
                </button>

                <button
                  type="button"
                  onClick={() => setInteractionMode('text')}
                  style={{
                    padding: '0.4rem 0.2rem',
                    background: interactionMode === 'text' ? 'var(--accent-cyan)' : 'var(--input-bg)',
                    color: interactionMode === 'text' ? 'var(--bg-dark)' : 'var(--text-primary)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  ✍️ Text
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
                            {g.name}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Line Opacity ({Math.round((mapData.strokeOpacity ?? 0.8) * 100)}%)</label>
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
                  <label className="field-label">Inward Border Offset ({mapData.borderInset || 0}px)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={mapData.borderInset || 0}
                    onChange={(e) => onChangeMapData({ ...mapData, borderInset: Math.max(0, Number(e.target.value) || 0) })}
                    style={{ width: '100%' }}
                  />
                </div>
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

            {/* CUSTOM MAP TEXT LABELS PANEL */}
            <div ref={textPanelRef} className="tint-card tint-card-text">
              <h3 className="subsection-header">✍️ Custom Map Text Labels</h3>

              <div style={{ background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)' }}>
                <span className="field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                  Default Text Style for New Click Placements
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Text Content</label>
                    <input
                      type="text"
                      placeholder="e.g. STRAIT OF MALACCA"
                      value={newTextString}
                      onChange={(e) => setNewTextString(e.target.value)}
                      style={{ width: '100%', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <div>
                      <label className="field-label" style={{ fontSize: '0.72rem' }}>Text Color</label>
                      <input
                        type="color"
                        value={newTextColor}
                        onChange={(e) => setNewTextColor(e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label className="field-label" style={{ fontSize: '0.72rem' }}>Font Size (px)</label>
                      <input
                        type="number"
                        min="8"
                        max="120"
                        value={newTextFontSize}
                        onChange={(e) => setNewTextFontSize(Number(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <div>
                      <label className="field-label" style={{ fontSize: '0.72rem' }}>Border / Outline Color</label>
                      <input
                        type="color"
                        value={newTextStrokeColor}
                        onChange={(e) => setNewTextStrokeColor(e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label className="field-label" style={{ fontSize: '0.72rem' }}>Border Width (px)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={newTextStrokeWidth}
                        onChange={(e) => setNewTextStrokeWidth(Number(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Font Family</label>
                    <select
                      value={newTextFontFamily}
                      onChange={(e) => setNewTextFontFamily(e.target.value)}
                      style={{ width: '100%', fontSize: '0.78rem' }}
                    >
                      <option value="'Share Tech Mono', monospace">Share Tech Mono (Cyber)</option>
                      <option value="'Chakra Petch', sans-serif">Chakra Petch</option>
                      <option value="'Manrope', sans-serif">Manrope</option>
                      <option value="'Special Elite', cursive">Special Elite</option>
                      <option value="'Josefin Sans', sans-serif">Josefin Sans</option>
                      <option value="'Teko', sans-serif">Teko (Condensed Military)</option>
                      <option value="'Courier New', monospace">Courier New</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Georgia, serif">Georgia</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newTextIsBold}
                        onChange={(e) => setNewTextIsBold(e.target.checked)}
                      />
                      Bold
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newTextIsItalic}
                        onChange={(e) => setNewTextIsItalic(e.target.checked)}
                      />
                      Italic
                    </label>
                  </div>

                  <p className="field-help-text" style={{ margin: '0.2rem 0 0 0' }}>
                    Click "✍️ Text" mode above, then click anywhere on the map to drop this label!
                  </p>
                </div>
              </div>

              {/* LIST & EDIT EXISTING TEXT LABELS */}
              {customTexts.length > 0 && (
                <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                      Map Text Labels ({customTexts.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleClearAllTextLabels}
                      style={{ fontSize: '0.7rem', padding: '2px 5px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      Clear All Text
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto' }}>
                    {customTexts.map((txt) => (
                      <div
                        key={txt.id}
                        style={{
                          background: 'var(--input-bg)',
                          border: activeTextId === txt.id ? '1px solid var(--accent-cyan)' : '1px solid var(--panel-border)',
                          borderRadius: '4px',
                          padding: '0.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.3rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={txt.text}
                            onChange={(e) => handleUpdateTextLabel(txt.id, 'text', e.target.value)}
                            style={{ fontSize: '0.82rem', fontWeight: 'bold', flex: 1, marginRight: '0.4rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteTextLabel(txt.id)}
                            style={{ fontSize: '0.7rem', padding: '2px 5px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            🗑️
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.3rem', fontSize: '0.72rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Color</span>
                            <input
                              type="color"
                              value={txt.color || '#00f0ff'}
                              onChange={(e) => handleUpdateTextLabel(txt.id, 'color', e.target.value)}
                              style={{ display: 'block', width: '100%', height: '22px' }}
                            />
                          </div>

                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Outline</span>
                            <input
                              type="color"
                              value={txt.strokeColor || '#000000'}
                              onChange={(e) => handleUpdateTextLabel(txt.id, 'strokeColor', e.target.value)}
                              style={{ display: 'block', width: '100%', height: '22px' }}
                            />
                          </div>

                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Size</span>
                            <input
                              type="number"
                              min="8"
                              max="120"
                              value={txt.fontSize || 20}
                              onChange={(e) => handleUpdateTextLabel(txt.id, 'fontSize', Number(e.target.value))}
                              style={{ width: '100%', fontSize: '0.72rem' }}
                            />
                          </div>

                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Outline W</span>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={txt.strokeWidth ?? 2}
                              onChange={(e) => handleUpdateTextLabel(txt.id, 'strokeWidth', Number(e.target.value))}
                              style={{ width: '100%', fontSize: '0.72rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', fontSize: '0.72rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>X Position</span>
                            <input
                              type="number"
                              value={txt.x}
                              onChange={(e) => handleUpdateTextLabel(txt.id, 'x', Number(e.target.value))}
                              style={{ width: '100%', fontSize: '0.72rem' }}
                            />
                          </div>

                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Y Position</span>
                            <input
                              type="number"
                              value={txt.y}
                              onChange={(e) => handleUpdateTextLabel(txt.id, 'y', Number(e.target.value))}
                              style={{ width: '100%', fontSize: '0.72rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={txt.isBold !== false}
                              onChange={(e) => handleUpdateTextLabel(txt.id, 'isBold', e.target.checked)}
                            />
                            Bold
                          </label>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(txt.isItalic)}
                              onChange={(e) => handleUpdateTextLabel(txt.id, 'isItalic', e.target.checked)}
                            />
                            Italic
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MARKERS & MARKER GROUPS PANEL */}
            <div ref={markerPanelRef} className="tint-card tint-card-aircraft">
              <h3 className="subsection-header">📍 Map Markers & Marker Groups</h3>

              <div>
                <label className="field-label">Active Marker Group to Place</label>
                <select
                  value={activeMarkerGroupId}
                  onChange={(e) => setActiveMarkerGroupId(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem', fontWeight: 'bold' }}
                >
                  {markerGroups.map((g) => {
                    const mCount = placedMarkers.filter((m) => m.markerGroupId === g.id).length;
                    return (
                      <option key={g.id} value={g.id}>
                        {g.name} ({mCount} placed)
                      </option>
                    );
                  })}
                </select>
                <p className="field-help-text" style={{ margin: '0.2rem 0 0.5rem 0' }}>
                  Click "📍 Marker" mode above then click hexes on map to place/remove active marker.
                </p>
              </div>

              {/* LIST / EDIT MARKER GROUPS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                  Manage Marker Groups (Changes update all instances on map)
                </span>

                {markerGroups.map((mg) => (
                  <div
                    key={mg.id}
                    style={{
                      background: 'var(--input-bg)',
                      border: mg.id === activeMarkerGroupId ? '1px solid var(--accent-cyan)' : '1px solid var(--panel-border)',
                      borderRadius: '4px',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          {renderMarkerIcon(mg, 24)}
                        </svg>
                        <input
                          type="text"
                          value={mg.name}
                          onChange={(e) => handleUpdateMarkerGroup(mg.id, 'name', e.target.value)}
                          style={{ fontSize: '0.82rem', fontWeight: 'bold', width: '130px' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setActiveMarkerGroupId(mg.id)}
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 5px',
                            background: activeMarkerGroupId === mg.id ? 'var(--accent-cyan)' : 'var(--panel-border)',
                            color: activeMarkerGroupId === mg.id ? 'var(--bg-dark)' : 'var(--text-primary)',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          {activeMarkerGroupId === mg.id ? 'Active' : 'Select'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMarkerGroup(mg.id)}
                          disabled={markerGroups.length <= 1}
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 5px',
                            background: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: markerGroups.length > 1 ? 'pointer' : 'not-allowed'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem', fontSize: '0.72rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Color</span>
                        <input
                          type="color"
                          value={mg.color || '#00f0ff'}
                          onChange={(e) => handleUpdateMarkerGroup(mg.id, 'color', e.target.value)}
                          style={{ display: 'block', width: '100%', height: '24px' }}
                        />
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Size (px)</span>
                        <input
                          type="number"
                          min="16"
                          max="64"
                          value={mg.size || 32}
                          onChange={(e) => handleUpdateMarkerGroup(mg.id, 'size', Number(e.target.value))}
                          style={{ width: '100%', fontSize: '0.75rem' }}
                        />
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Image File</span>
                        <label style={{ display: 'block', fontSize: '0.68rem', padding: '2px 4px', background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '3px', cursor: 'pointer', textAlign: 'center' }}>
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMarkerGroupImageUpload(mg.id, e)}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    </div>

                    {mg.customImageUrl && (
                      <button
                        type="button"
                        onClick={() => handleUpdateMarkerGroup(mg.id, 'customImageUrl', null)}
                        style={{ fontSize: '0.68rem', padding: '1px 4px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', alignSelf: 'flex-start' }}
                      >
                        Reset Image to Vector
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* CREATE CUSTOM MARKER GROUP */}
              <div style={{ background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px dashed var(--panel-border)' }}>
                <span className="field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                  + Create Custom Marker Group
                </span>

                <div style={{ display: 'flex', gap: '0.4rem', margin: '0.4rem 0' }}>
                  <input
                    type="text"
                    placeholder="Group Name (e.g. Fortress)"
                    value={newMarkerGroupName}
                    onChange={(e) => setNewMarkerGroupName(e.target.value)}
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  />
                  <select
                    value={newMarkerGroupSvgType}
                    onChange={(e) => setNewMarkerGroupSvgType(e.target.value)}
                    style={{ fontSize: '0.78rem' }}
                  >
                    <option value="fortress">🏰 Fortress</option>
                    <option value="plane">✈️ Plane</option>
                    <option value="bridge">🌉 Bridge</option>
                    <option value="nuclear">⚛️ Nuclear</option>
                    <option value="factory">🏭 Factory</option>
                    <option value="shipyard">⚓ Shipyard</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Color</span>
                    <input
                      type="color"
                      value={newMarkerGroupColor}
                      onChange={(e) => setNewMarkerGroupColor(e.target.value)}
                      style={{ width: '100%', height: '24px' }}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Size (px)</span>
                    <input
                      type="number"
                      min="16"
                      max="64"
                      value={newMarkerGroupSize}
                      onChange={(e) => setNewMarkerGroupSize(Number(e.target.value))}
                      style={{ width: '100%', fontSize: '0.75rem' }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddMarkerGroup}
                    style={{
                      padding: '0.3rem 0.6rem',
                      background: 'var(--accent-cyan)',
                      color: 'var(--bg-dark)',
                      border: 'none',
                      borderRadius: '3px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      marginTop: '0.9rem'
                    }}
                  >
                    Create
                  </button>
                </div>
              </div>

              {/* PLACED MARKERS SUMMARY & INDIVIDUAL OVERRIDES */}
              {placedMarkers.length > 0 && (
                <div style={{ marginTop: '0.6rem', background: 'var(--input-bg)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--panel-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                      Placed Markers ({placedMarkers.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleClearAllPlacedMarkers}
                      style={{ fontSize: '0.7rem', padding: '2px 5px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      Clear All
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '220px', overflowY: 'auto' }}>
                    {placedMarkers.map((pm) => {
                      const hex = hexes.find((h) => h.id === pm.hexId);
                      const grp = markerGroups.find((g) => g.id === pm.markerGroupId);
                      const posX = pm.x !== undefined ? pm.x : (hex ? hex.cx : 0);
                      const posY = pm.y !== undefined ? pm.y : (hex ? hex.cy : 0);
                      const isSelected = activeMarkerId === pm.id;

                      return (
                        <div
                          key={pm.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.3rem',
                            background: 'var(--panel-bg)',
                            border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--panel-border)',
                            padding: '0.4rem',
                            borderRadius: '4px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <select
                                value={pm.markerGroupId}
                                onChange={(e) => handleUpdatePlacedMarker(pm.id, 'markerGroupId', e.target.value)}
                                style={{ fontSize: '0.75rem', fontWeight: 'bold' }}
                              >
                                {markerGroups.map((g) => (
                                  <option key={g.id} value={g.id}>
                                    {g.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => setActiveMarkerId(pm.id)}
                                style={{
                                  fontSize: '0.68rem',
                                  padding: '1px 4px',
                                  background: isSelected ? 'var(--accent-cyan)' : 'var(--panel-border)',
                                  color: isSelected ? 'var(--bg-dark)' : 'var(--text-primary)',
                                  border: 'none',
                                  borderRadius: '3px',
                                  cursor: 'pointer'
                                }}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeletePlacedMarker(pm.id)}
                                style={{ fontSize: '0.68rem', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '1px 4px' }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.3rem', fontSize: '0.7rem' }}>
                            <div>
                              <span style={{ color: 'var(--text-muted)' }}>Color</span>
                              <input
                                type="color"
                                value={pm.customColor || grp?.color || '#000000'}
                                onChange={(e) => handleUpdatePlacedMarker(pm.id, 'customColor', e.target.value)}
                                style={{ display: 'block', width: '100%', height: '20px' }}
                              />
                            </div>

                            <div>
                              <span style={{ color: 'var(--text-muted)' }}>Size</span>
                              <input
                                type="number"
                                min="16"
                                max="80"
                                value={pm.customSize || grp?.size || 32}
                                onChange={(e) => handleUpdatePlacedMarker(pm.id, 'customSize', Number(e.target.value))}
                                style={{ width: '100%', fontSize: '0.7rem' }}
                              />
                            </div>

                            <div>
                              <span style={{ color: 'var(--text-muted)' }}>X</span>
                              <input
                                type="number"
                                value={posX}
                                onChange={(e) => handleUpdatePlacedMarker(pm.id, 'x', Number(e.target.value))}
                                style={{ width: '100%', fontSize: '0.7rem' }}
                              />
                            </div>

                            <div>
                              <span style={{ color: 'var(--text-muted)' }}>Y</span>
                              <input
                                type="number"
                                value={posY}
                                onChange={(e) => handleUpdatePlacedMarker(pm.id, 'y', Number(e.target.value))}
                                style={{ width: '100%', fontSize: '0.7rem' }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 6. TERRAIN COLOR GROUPS */}
            <div className="tint-card tint-card-aircraft">
              <h3 className="subsection-header">🏰 Terrain Color Groups</h3>

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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.75rem' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.4rem' }}>
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
                    onMouseDown={() => {
                      setIsMouseDown(true);
                    }}
                    onClick={handleSvgCanvasClick}
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

                      {/* INVERTED MASK FOR UNCOVERED NON-HEX SPACES (cuts out all hexes from full-canvas backdrop) */}
                      {mapData.coverUncoveredSpaces && (
                        <mask id="non-hex-backdrop-mask">
                          {/* White background: area to keep */}
                          <rect x="0" y="0" width={naturalWidth} height={naturalHeight} fill="#ffffff" />
                          {/* Black hex polygons: area to cut out (leave transparent for map image) */}
                          {hexes.map((h) => (
                            <polygon
                              key={`mask_${h.id}`}
                              points={getHexPoints(h.cx, h.cy, radius, orientation)}
                              fill="#000000"
                            />
                          ))}
                        </mask>
                      )}
                    </defs>

                    {/* BACKDROP COVER FOR UNCOVERED SPACES (only covers area outside hex grid) */}
                    {mapData.coverUncoveredSpaces && (
                      <rect
                        x="0"
                        y="0"
                        width={naturalWidth}
                        height={naturalHeight}
                        fill={mapData.uncoveredSpaceColor || mapData.fillColor || '#0284c7'}
                        fillOpacity={mapData.uncoveredSpaceOpacity ?? 0.1}
                        mask="url(#non-hex-backdrop-mask)"
                        style={{ pointerEvents: 'none' }}
                      />
                    )}

                    {/* LAYER 1: BASE GRID POLYGONS & OVERRIDES */}
                    {hexes.map((hex) => {
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

                      // Calculate inward border polygon geometry with separation offset
                      const borderInset = Number(mapData.borderInset) || 0;
                      const innerRadius = Math.max(1, radius - borderInset - hexStrokeWidth / 2);
                      const innerPointsStr = getHexPoints(hex.cx, hex.cy, innerRadius, orientation);

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
                          {/* Base Hex Polygon Fill */}
                          <polygon
                            points={pointsStr}
                            fill={isInaccessible ? 'url(#inaccessible-hatch-pattern)' : hexFillColor}
                            fillOpacity={isInaccessible ? 1.0 : hexFillOpacity}
                          />

                          {/* Inward Hex Border Line with Offset */}
                          <polygon
                            points={innerPointsStr}
                            fill="none"
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

                    {/* LAYER 1B: PER-SIDE CUSTOM BORDERS (Inaccessible edge lines, rivers, cliffs, custom borders) */}
                    {hexes.map((hex) => {
                      const override = hexOverrides[hex.id];
                      if (!override || !override.customBorders) return null;
                      if (override.isSolidMask) return null;

                      const hexStrokeWidth = mapData.strokeWidth || 2;
                      const borderInset = Number(mapData.borderInset) || 0;
                      const innerRadius = Math.max(1, radius - borderInset - hexStrokeWidth / 2);
                      const verts = getHexVertices(hex.cx, hex.cy, innerRadius, orientation);

                      return (
                        <g key={`side_borders_${hex.id}`}>
                          {Object.keys(override.customBorders).map((sideKey) => {
                            const sideIdx = Number(sideKey);
                            const borderDef = override.customBorders[sideIdx];
                            if (!borderDef) return null;

                            const p1 = verts[sideIdx];
                            const p2 = verts[(sideIdx + 1) % 6];
                            if (!p1 || !p2) return null;

                            const dx = p2.x - p1.x;
                            const dy = p2.y - p1.y;
                            const len = Math.hypot(dx, dy) || 1;
                            const nx = -dy / len;
                            const ny = dx / len;

                            const bType = borderDef.type;
                            const bWidth = Number(borderDef.width) || 4;
                            const bColor = borderDef.color || '#dc2626';

                            if (bType === 'inaccessible') {
                              return (
                                <g key={`sb_${hex.id}_${sideIdx}`}>
                                  <line
                                    x1={p1.x}
                                    y1={p1.y}
                                    x2={p2.x}
                                    y2={p2.y}
                                    stroke="#dc2626"
                                    strokeWidth={Math.max(4, bWidth)}
                                    strokeLinecap="round"
                                  />
                                  {[0.25, 0.5, 0.75].map((t, tIdx) => {
                                    const tx = p1.x + t * dx;
                                    const ty = p1.y + t * dy;
                                    return (
                                      <line
                                        key={`inacc_tick_${tIdx}`}
                                        x1={tx - 4 * nx}
                                        y1={ty - 4 * ny}
                                        x2={tx + 4 * nx}
                                        y2={ty + 4 * ny}
                                        stroke="#dc2626"
                                        strokeWidth={3}
                                      />
                                    );
                                  })}
                                </g>
                              );
                            } else if (bType === 'river') {
                              return (
                                <g key={`sb_${hex.id}_${sideIdx}`}>
                                  <line
                                    x1={p1.x}
                                    y1={p1.y}
                                    x2={p2.x}
                                    y2={p2.y}
                                    stroke="#0284c7"
                                    strokeWidth={Math.max(5, bWidth)}
                                    strokeLinecap="round"
                                  />
                                  <line
                                    x1={p1.x}
                                    y1={p1.y}
                                    x2={p2.x}
                                    y2={p2.y}
                                    stroke="#38bdf8"
                                    strokeWidth={2}
                                    strokeDasharray="5,3"
                                    strokeLinecap="round"
                                  />
                                </g>
                              );
                            } else if (bType === 'cliff') {
                              return (
                                <g key={`sb_${hex.id}_${sideIdx}`}>
                                  <line
                                    x1={p1.x}
                                    y1={p1.y}
                                    x2={p2.x}
                                    y2={p2.y}
                                    stroke="#b45309"
                                    strokeWidth={Math.max(5, bWidth)}
                                    strokeLinecap="round"
                                  />
                                  {[0.2, 0.4, 0.6, 0.8].map((t, tIdx) => {
                                    const tx = p1.x + t * dx;
                                    const ty = p1.y + t * dy;
                                    return (
                                      <line
                                        key={`cliff_tick_${tIdx}`}
                                        x1={tx}
                                        y1={ty}
                                        x2={tx + 6 * nx}
                                        y2={ty + 6 * ny}
                                        stroke="#b45309"
                                        strokeWidth={3}
                                      />
                                    );
                                  })}
                                </g>
                              );
                            } else {
                              // 'custom'
                              const dashArray =
                                borderDef.dash === 'dashed' ? '6,4' : borderDef.dash === 'dotted' ? '2,3' : 'none';
                              return (
                                <line
                                  key={`sb_${hex.id}_${sideIdx}`}
                                  x1={p1.x}
                                  y1={p1.y}
                                  x2={p2.x}
                                  y2={p2.y}
                                  stroke={bColor}
                                  strokeWidth={bWidth}
                                  strokeDasharray={dashArray}
                                  strokeLinecap="round"
                                />
                              );
                            }
                          })}
                        </g>
                      );
                    })}

                    {/* LAYER 1C: PLACED MARKERS (Renders on top of hex borders & side features, below solid mask/unavailable covers) */}
                    {placedMarkers.map((pm) => {
                      const hex = hexes.find((h) => h.id === pm.hexId);
                      const posX = pm.x !== undefined ? pm.x : (hex ? hex.cx : 0);
                      const posY = pm.y !== undefined ? pm.y : (hex ? hex.cy : 0);
                      const group = markerGroups.find((g) => g.id === pm.markerGroupId);
                      if (!group) return null;

                      const size = Number(pm.customSize || group.size) || 32;
                      const color = pm.customColor || group.color || '#000000';
                      const isActive = activeMarkerId === pm.id;

                      return (
                        <g
                          key={`placed_marker_${pm.id}`}
                          transform={`translate(${posX}, ${posY})`}
                          onMouseDown={(e) => handleMarkerMouseDown(pm, e)}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (wasDraggingRef.current) return;
                            setActiveMarkerId(pm.id);
                            markerPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                          }}
                          style={{ cursor: 'grab' }}
                        >
                          {renderMarkerIcon(group, size, color, size)}

                          {/* Active outline selection ring */}
                          {isActive && (
                            <circle
                              cx="0"
                              cy="0"
                              r={size / 2 + 4}
                              fill="none"
                              stroke="#00f0ff"
                              strokeWidth="2"
                              strokeDasharray="4,3"
                            />
                          )}

                          {/* Map-level delete button badge */}
                          {isActive && (
                            <g
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePlacedMarker(pm.id);
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <circle cx={size / 2 + 2} cy={-size / 2 - 2} r="8" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                              <text
                                x={size / 2 + 2}
                                y={-size / 2 - 2}
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="bold"
                                textAnchor="middle"
                                dominantBaseline="central"
                              >
                                ×
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}

                    {/* LAYER 2: TOP LAYER SOLID COVER / MASK HEXES & UNAVAILABLE HATCH COVERS (Renders over base grid & markers) */}
                    {hexes.map((hex) => {
                      const override = hexOverrides[hex.id];
                      if (!override) return null;
                      if (!override.isSolidMask && !override.isInaccessible) return null;

                      const pointsStr = getHexPoints(hex.cx, hex.cy, radius, orientation);
                      const isSelected = selectedHexIds.includes(hex.id);

                      if (override.isSolidMask) {
                        const maskColor = override.solidMaskColor || '#ffffff';
                        return (
                          <g
                            key={`top_solid_${hex.id}`}
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
                      }

                      if (override.isInaccessible) {
                        return (
                          <g
                            key={`top_inacc_${hex.id}`}
                            onClick={(e) => handleHexClick(hex, e)}
                            style={{ pointerEvents: 'none' }}
                          >
                            <polygon
                              points={pointsStr}
                              fill="url(#inaccessible-hatch-pattern)"
                              fillOpacity={0.85}
                            />
                          </g>
                        );
                      }

                      return null;
                    })}

                    {/* LAYER 3: CUSTOM MAP TEXT LABELS (Renders on top of all hex layers, markers & solid covers) */}
                    {customTexts.map((txt) => {
                      const isActive = activeTextId === txt.id;
                      const fontSz = txt.fontSize || 20;
                      const boxWidth = (txt.text || '').length * fontSz * 0.6 + 12;
                      const boxHeight = fontSz + 8;

                      return (
                        <g
                          key={`custom_text_${txt.id}`}
                          transform={`translate(${txt.x}, ${txt.y})`}
                          onMouseDown={(e) => handleTextMouseDown(txt, e)}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (wasDraggingRef.current) return;
                            setActiveTextId(txt.id);
                            textPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                          }}
                          style={{ cursor: 'grab' }}
                        >
                          <text
                            x="0"
                            y="0"
                            fill={txt.color || '#00f0ff'}
                            stroke={txt.strokeColor || '#000000'}
                            strokeWidth={txt.strokeWidth ?? 2}
                            fontSize={fontSz}
                            fontWeight={txt.isBold ? 'bold' : 'normal'}
                            fontStyle={txt.isItalic ? 'italic' : 'normal'}
                            fontFamily={txt.fontFamily || "'Share Tech Mono', monospace"}
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{ userSelect: 'none' }}
                          >
                            {txt.text}
                          </text>

                          {/* Active bounding box */}
                          {isActive && (
                            <rect
                              x={-boxWidth / 2}
                              y={-boxHeight / 2}
                              width={boxWidth}
                              height={boxHeight}
                              fill="none"
                              stroke="#00f0ff"
                              strokeWidth="1.5"
                              strokeDasharray="4,3"
                            />
                          )}

                          {/* Map-level delete button badge */}
                          {isActive && (
                            <g
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTextLabel(txt.id);
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <circle cx={boxWidth / 2 + 2} cy={-boxHeight / 2 - 2} r="8" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                              <text
                                x={boxWidth / 2 + 2}
                                y={-boxHeight / 2 - 2}
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="bold"
                                textAnchor="middle"
                                dominantBaseline="central"
                              >
                                ×
                              </text>
                            </g>
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
