import React from 'react';

// Render NATO Symbol according to frame affiliation, symbol type, and stackable modifiers
export function NatoSymbol({
  affiliation = 'friendly', // 'friendly' | 'hostile' | 'neutral'
  symbolType = 'infantry',  // 'infantry' | 'armor' | 'recon' | 'artillery' | 'rocket_artillery' | 'mechanized_artillery' | 'air_defense' | 'anti_tank' | 'sof' | 'engineer' | 'supply' | 'custom' | 'none'
  modifiers = [],           // ['mountain', 'airborne', 'airmobile', 'tracked', 'wheeled', 'amphibious', 'motorized', 'ew', 'light']
  size = 240,
  customNatoImage = ''
}) {
  const width = size * 0.44;
  const height = size * 0.36;

  // Frame path and clip path definitions based on affiliation
  let frame = null;
  let clipPathShape = null;
  const clipId = `nato-clip-${affiliation}-${Math.random().toString(36).substr(2, 5)}`;

  if (affiliation === 'friendly') {
    frame = <rect x="5" y="10" width="90" height="60" rx="3" fill="none" stroke="#ffffff" strokeWidth="5" />;
    clipPathShape = <rect x="5" y="10" width="90" height="60" rx="3" />;
  } else if (affiliation === 'hostile') {
    // Squarish Diamond (45 deg rotated square)
    frame = <polygon points="50,5 90,40 50,75 10,40" fill="none" stroke="#ffffff" strokeWidth="5" />;
    clipPathShape = <polygon points="50,5 90,40 50,75 10,40" />;
  } else if (affiliation === 'neutral') {
    frame = <rect x="20" y="10" width="60" height="60" rx="3" fill="none" stroke="#ffffff" strokeWidth="5" />;
    clipPathShape = <rect x="20" y="10" width="60" height="60" rx="3" />;
  }

  let symbolContent = [];

  // Main Branch Symbols
  if (symbolType === 'infantry') {
    if (affiliation === 'friendly') {
      symbolContent.push(
        <g key="inf">
          <line x1="5" y1="10" x2="95" y2="70" stroke="#ffffff" strokeWidth="4.5" />
          <line x1="5" y1="70" x2="95" y2="10" stroke="#ffffff" strokeWidth="4.5" />
        </g>
      );
    } else if (affiliation === 'hostile') {
      // Hostile infantry: two diagonals connecting the diamond's opposite sides
      symbolContent.push(
        <g key="inf">
          <line x1="30" y1="22.5" x2="70" y2="57.5" stroke="#ffffff" strokeWidth="4.5" />
          <line x1="30" y1="57.5" x2="70" y2="22.5" stroke="#ffffff" strokeWidth="4.5" />
        </g>
      );
    } else {
      symbolContent.push(
        <g key="inf">
          <line x1="20" y1="10" x2="80" y2="70" stroke="#ffffff" strokeWidth="4.5" />
          <line x1="20" y1="70" x2="80" y2="10" stroke="#ffffff" strokeWidth="4.5" />
        </g>
      );
    }
  } else if (symbolType === 'armor') {
    symbolContent.push(
      <rect key="armor" x="25" y="25" width="50" height="30" rx="15" fill="none" stroke="#ffffff" strokeWidth="4.5" />
    );
  } else if (symbolType === 'recon') {
    // Reconnaissance slash (bottom-left to top-right diagonal)
    if (affiliation === 'friendly') {
      symbolContent.push(
        <line key="recon" x1="5" y1="70" x2="95" y2="10" stroke="#ffffff" strokeWidth="4.5" />
      );
    } else if (affiliation === 'hostile') {
      symbolContent.push(
        <line key="recon" x1="10" y1="40" x2="90" y2="40" stroke="#ffffff" strokeWidth="4.5" transform="rotate(-45 50 40)" />
      );
    } else {
      symbolContent.push(
        <line key="recon" x1="20" y1="70" x2="80" y2="10" stroke="#ffffff" strokeWidth="4.5" />
      );
    }
  } else if (symbolType === 'artillery') {
    symbolContent.push(
      <circle key="artillery" cx="50" cy="40" r="9" fill="#ffffff" />
    );
  } else if (symbolType === 'rocket_artillery') {
    symbolContent.push(
      <g key="rocket_artillery">
        <circle cx="50" cy="45" r="8" fill="#ffffff" />
        <path d="M 35 28 L 50 16 L 65 28" fill="none" stroke="#ffffff" strokeWidth="4" />
      </g>
    );
  } else if (symbolType === 'mechanized_artillery') {
    symbolContent.push(
      <g key="mech_artillery">
        <rect x="22" y="22" width="56" height="36" rx="18" fill="none" stroke="#ffffff" strokeWidth="4" />
        <circle cx="50" cy="40" r="8" fill="#ffffff" />
      </g>
    );
  } else if (symbolType === 'air_defense') {
    // Arc curve arches upward (dome shape in lower part of frame)
    if (affiliation === 'friendly') {
      symbolContent.push(
        <path key="air_def" d="M 5 70 Q 50 40 95 70" fill="none" stroke="#ffffff" strokeWidth="4.5" />
      );
    } else if (affiliation === 'hostile') {
      symbolContent.push(
        <path key="air_def" d="M 10 40 Q 50 15 90 40" fill="none" stroke="#ffffff" strokeWidth="4.5" />
      );
    } else {
      symbolContent.push(
        <path key="air_def" d="M 20 70 Q 50 40 80 70" fill="none" stroke="#ffffff" strokeWidth="4.5" />
      );
    }
  } else if (symbolType === 'anti_tank') {
    symbolContent.push(
      <path key="anti_tank" d="M 25 55 L 50 25 L 75 55" fill="none" stroke="#ffffff" strokeWidth="4.5" />
    );
  } else if (symbolType === 'sof') {
    symbolContent.push(
      <text key="sof" x="50" y="48" fill="#ffffff" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        SOF
      </text>
    );
  } else if (symbolType === 'engineer') {
    symbolContent.push(
      <path key="engineer" d="M 28 55 L 28 32 L 50 32 L 50 55 M 50 32 L 72 32 L 72 55" fill="none" stroke="#ffffff" strokeWidth="4" />
    );
  } else if (symbolType === 'supply') {
    // Supply: horizontal line on the lower half of symbol
    symbolContent.push(
      <line key="supply" x1="10" y1="50" x2="90" y2="50" stroke="#ffffff" strokeWidth="5" />
    );
  } else if (symbolType === 'custom') {
    if (customNatoImage) {
      symbolContent.push(
        <image
          key="custom"
          href={customNatoImage}
          x="10"
          y="10"
          width="80"
          height="60"
          preserveAspectRatio="xMidYMid meet"
        />
      );
    }
  }

  // Modifiers inside/outside frame
  if (modifiers.includes('mountain')) {
    // Triangle at bottom of symbol, smaller size, black colored
    symbolContent.push(
      <polygon key="mod-mountain" points="50,48 35,72 65,72" fill="#000000" stroke="#ffffff" strokeWidth="1" />
    );
  }

  if (modifiers.includes('airborne')) {
    // Airborne: two small bird wings at the bottom
    symbolContent.push(
      <path key="mod-airborne" d="M 20 64 Q 35 52 50 64 Q 65 52 80 64" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
    );
  }

  if (modifiers.includes('airmobile')) {
    // Airmobile: shorter arms attached directly to the top edge of the frame
    const topY = affiliation === 'hostile' ? 5 : 10;
    symbolContent.push(
      <path key="mod-airmobile" d={`M 30 ${topY} L 50 ${topY + 16} L 70 ${topY}`} fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    );
  }

  if (modifiers.includes('tracked')) {
    symbolContent.push(
      <rect key="mod-tracked" x="22" y="22" width="56" height="36" rx="18" fill="none" stroke="#ffffff" strokeWidth="4" />
    );
  }

  if (modifiers.includes('wheeled')) {
    // Wheeled: 3 circles placed properly on hostile or friendly frame
    const circleY = affiliation === 'hostile' ? 54 : 62;
    symbolContent.push(
      <g key="mod-wheeled">
        <circle cx="34" cy={circleY} r="4" fill="#ffffff" />
        <circle cx="50" cy={circleY} r="4" fill="#ffffff" />
        <circle cx="66" cy={circleY} r="4" fill="#ffffff" />
      </g>
    );
  }

  if (modifiers.includes('amphibious')) {
    // Amphibious: multi-cycle sine wave across middle of unit
    symbolContent.push(
      <path key="mod-amphibious" d="M 5 40 Q 16.25 28 27.5 40 T 50 40 T 72.5 40 T 95 40" fill="none" stroke="#ffffff" strokeWidth="3.5" />
    );
  }

  if (modifiers.includes('motorized')) {
    symbolContent.push(
      <line key="mod-motorized" x1="50" y1="10" x2="50" y2="70" stroke="#ffffff" strokeWidth="4" />
    );
  }

  if (modifiers.includes('ew')) {
    // Electronic Warfare 'EW' text
    symbolContent.push(
      <text key="mod-ew" x="50" y="28" fill="#ffffff" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        EW
      </text>
    );
  }

  if (modifiers.includes('light')) {
    // Light modifier: small L letter placed at the bottom side of frame, horizontally centered
    const lightY = affiliation === 'hostile' ? 68 : 66;
    symbolContent.push(
      <text key="mod-light" x="50" y={lightY} fill="#ffffff" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        L
      </text>
    );
  }

  return (
    <svg width={width} height={height} viewBox="0 0 100 80" style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id={clipId}>
          {clipPathShape}
        </clipPath>
      </defs>
      {/* Layer 1: Content clipped to interior */}
      <g clipPath={`url(#${clipId})`}>
        {symbolContent}
      </g>
      {/* Layer 2: Frame stroke rendered OVER content & modifiers */}
      {frame}
    </svg>
  );
}

// LandToken component renders Front or Back of Land Token
// Helper SVG Flag rendering for Reverse face
function RenderFlag({ flagKey, customUrl }) {
  if (flagKey === 'custom' && customUrl) {
    return (
      <img
        src={customUrl}
        alt="Custom Back"
        style={{ width: '80%', height: '80%', objectFit: 'contain' }}
      />
    );
  }

  if (flagKey === 'nato') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#004990" />
        <circle cx="50" cy="30" r="18" fill="none" stroke="#ffffff" strokeWidth="2" />
        <polygon points="50,4 53,27 76,30 53,33 50,56 47,33 24,30 47,27" fill="#ffffff" />
      </svg>
    );
  }

  if (flagKey === 'usa') {
    const stars = [];
    const rows = [6, 5, 6, 5, 6, 5, 6, 5, 6];
    const cantonW = 40;
    const cantonH = 32.3;

    rows.forEach((count, rIdx) => {
      const y = (rIdx + 1) * (cantonH / 10);
      const colW = cantonW / 7;
      const xOffset = count === 6 ? colW : colW * 1.5;
      for (let c = 0; c < count; c++) {
        const x = xOffset + c * colW;
        stars.push(
          <circle key={`${rIdx}-${c}`} cx={x} cy={y} r="0.8" fill="#ffffff" />
        );
      }
    });

    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#bb133e" />
        {[1, 3, 5, 7, 9, 11].map((i) => (
          <rect key={i} y={i * (60 / 13)} width="100" height={60 / 13} fill="#ffffff" />
        ))}
        <rect width={cantonW} height={cantonH} fill="#002147" />
        <g>{stars}</g>
      </svg>
    );
  }

  if (flagKey === 'russia') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="20" fill="#ffffff" />
        <rect y="20" width="100" height="20" fill="#0039a6" />
        <rect y="40" width="100" height="20" fill="#d52b1e" />
      </svg>
    );
  }

  if (flagKey === 'china') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#ee1c25" />
        {/* Main large star */}
        <polygon points="15,4 18,15 28,15 20,21 23,32 15,25 7,32 10,21 2,15 12,15" fill="#ffde00" />
        {/* 4 small surrounding stars */}
        <polygon points="30,5 31,8 34,8 32,10 33,13 30,11 27,13 28,10 26,8 29,8" fill="#ffde00" />
        <polygon points="36,12 37,15 40,15 38,17 39,20 36,18 33,20 34,17 32,15 35,15" fill="#ffde00" />
        <polygon points="36,22 37,25 40,25 38,27 39,30 36,28 33,30 34,27 32,25 35,25" fill="#ffde00" />
        <polygon points="30,29 31,32 34,32 32,34 33,37 30,35 27,37 28,34 26,32 29,32" fill="#ffde00" />
      </svg>
    );
  }

  if (flagKey === 'poland') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="30" fill="#ffffff" />
        <rect y="30" width="100" height="30" fill="#dc143c" />
      </svg>
    );
  }

  if (flagKey === 'ukraine') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="30" fill="#0057b7" />
        <rect y="30" width="100" height="30" fill="#ffd700" />
      </svg>
    );
  }

  if (flagKey === 'sweden') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#006aa7" />
        <rect x="30" y="0" width="12" height="60" fill="#fecc02" />
        <rect x="0" y="24" width="100" height="12" fill="#fecc02" />
      </svg>
    );
  }

  if (flagKey === 'finland') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#ffffff" />
        <rect x="30" y="0" width="12" height="60" fill="#002f6c" />
        <rect x="0" y="24" width="100" height="12" fill="#002f6c" />
      </svg>
    );
  }

  if (flagKey === 'lithuania') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="20" fill="#fdb913" />
        <rect y="20" width="100" height="20" fill="#006a44" />
        <rect y="40" width="100" height="20" fill="#c1272d" />
      </svg>
    );
  }

  if (flagKey === 'latvia') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="24" fill="#9e1b32" />
        <rect y="24" width="100" height="12" fill="#ffffff" />
        <rect y="36" width="100" height="24" fill="#9e1b32" />
      </svg>
    );
  }

  if (flagKey === 'estonia') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="20" fill="#0072ce" />
        <rect y="20" width="100" height="20" fill="#000000" />
        <rect y="40" width="100" height="20" fill="#ffffff" />
      </svg>
    );
  }

  if (flagKey === 'france') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="33.33" height="60" fill="#00209f" />
        <rect x="33.33" width="33.34" height="60" fill="#ffffff" />
        <rect x="66.67" width="33.33" height="60" fill="#ed2939" />
      </svg>
    );
  }

  if (flagKey === 'great_britain' || flagKey === 'uk') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <clipPath id="gb-flag-clip">
          <rect width="100" height="60" />
        </clipPath>
        <g clipPath="url(#gb-flag-clip)">
          <rect width="100" height="60" fill="#012169" />
          <line x1="0" y1="0" x2="100" y2="60" stroke="#ffffff" strokeWidth="12" />
          <line x1="100" y1="0" x2="0" y2="60" stroke="#ffffff" strokeWidth="12" />
          <line x1="0" y1="0" x2="50" y2="30" stroke="#c8102e" strokeWidth="4" transform="translate(-2, 2)" />
          <line x1="50" y1="30" x2="100" y2="60" stroke="#c8102e" strokeWidth="4" transform="translate(2, -2)" />
          <line x1="100" y1="0" x2="50" y2="30" stroke="#c8102e" strokeWidth="4" transform="translate(2, 2)" />
          <line x1="50" y1="30" x2="0" y2="60" stroke="#c8102e" strokeWidth="4" transform="translate(-2, -2)" />
          <rect x="40" y="0" width="20" height="60" fill="#ffffff" />
          <rect x="0" y="20" width="100" height="20" fill="#ffffff" />
          <rect x="44" y="0" width="12" height="60" fill="#c8102e" />
          <rect x="0" y="24" width="100" height="12" fill="#c8102e" />
        </g>
      </svg>
    );
  }

  if (flagKey === 'australia') {
    const star7 = (cx, cy, rOuter, rInner) => {
      let pts = [];
      for (let i = 0; i < 14; i++) {
        const angle = (i * Math.PI) / 7 - Math.PI / 2;
        const r = i % 2 === 0 ? rOuter : rInner;
        pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return pts.join(' ');
    };
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#012169" />
        <g>
          <clipPath id="aus-gb-clip">
            <rect width="50" height="30" />
          </clipPath>
          <g clipPath="url(#aus-gb-clip)">
            <rect width="50" height="30" fill="#012169" />
            <line x1="0" y1="0" x2="50" y2="30" stroke="#ffffff" strokeWidth="6" />
            <line x1="50" y1="0" x2="0" y2="30" stroke="#ffffff" strokeWidth="6" />
            <line x1="0" y1="0" x2="25" y2="15" stroke="#c8102e" strokeWidth="2" transform="translate(-1, 1)" />
            <line x1="25" y1="15" x2="50" y2="30" stroke="#c8102e" strokeWidth="2" transform="translate(1, -1)" />
            <line x1="50" y1="0" x2="25" y2="15" stroke="#c8102e" strokeWidth="2" transform="translate(1, 1)" />
            <line x1="25" y1="15" x2="0" y2="30" stroke="#c8102e" strokeWidth="2" transform="translate(-1, -1)" />
            <rect x="20" y="0" width="10" height="30" fill="#ffffff" />
            <rect x="0" y="10" width="50" height="10" fill="#ffffff" />
            <rect x="22" y="0" width="6" height="30" fill="#c8102e" />
            <rect x="0" y="12" width="50" height="6" fill="#c8102e" />
          </g>
        </g>
        <polygon points={star7(25, 45, 7, 3.2)} fill="#ffffff" />
        <polygon points={star7(75, 12, 4.5, 2)} fill="#ffffff" />
        <polygon points={star7(88, 26, 4.5, 2)} fill="#ffffff" />
        <polygon points={star7(75, 48, 4.5, 2)} fill="#ffffff" />
        <polygon points={star7(62, 30, 4.5, 2)} fill="#ffffff" />
        <polygon points="80,35 81,37.5 83.5,37.5 81.5,39 82.2,41.5 80,40 77.8,41.5 78.5,39 76.5,37.5 79,37.5" fill="#ffffff" />
      </svg>
    );
  }

  if (flagKey === 'japan') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#ffffff" />
        <circle cx="50" cy="30" r="18" fill="#bc002d" />
      </svg>
    );
  }

  if (flagKey === 'germany') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="20" fill="#000000" />
        <rect y="20" width="100" height="20" fill="#dd0000" />
        <rect y="40" width="100" height="20" fill="#ffce00" />
      </svg>
    );
  }

  if (flagKey === 'italy') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="33.33" height="60" fill="#009246" />
        <rect x="33.33" width="33.34" height="60" fill="#ffffff" />
        <rect x="66.67" width="33.33" height="60" fill="#ce2b37" />
      </svg>
    );
  }

  if (flagKey === 'ue' || flagKey === 'eu') {
    const stars = [];
    const cx = 50;
    const cy = 30;
    const radius = 17;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2;
      const sx = cx + radius * Math.cos(angle);
      const sy = cy + radius * Math.sin(angle);
      const rOuter = 3;
      const rInner = 1.3;
      let pts = [];
      for (let j = 0; j < 10; j++) {
        const a = (j * Math.PI) / 5 - Math.PI / 2;
        const r = j % 2 === 0 ? rOuter : rInner;
        pts.push(`${sx + r * Math.cos(a)},${sy + r * Math.sin(a)}`);
      }
      stars.push(<polygon key={i} points={pts.join(' ')} fill="#ffcc00" />);
    }
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#003399" />
        <g>{stars}</g>
      </svg>
    );
  }

  if (flagKey === 'belarus') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect x="12" y="0" width="88" height="40" fill="#c8312b" />
        <rect x="12" y="40" width="88" height="20" fill="#48974d" />
        <rect x="0" y="0" width="12" height="60" fill="#ffffff" />
        <path
          d="M 6 0 L 12 6 L 6 12 L 0 6 Z M 6 12 L 12 18 L 6 24 L 0 18 Z M 6 24 L 12 30 L 6 36 L 0 30 Z M 6 36 L 12 42 L 6 48 L 0 42 Z M 6 48 L 12 54 L 6 60 L 0 54 Z"
          fill="#c8312b"
        />
      </svg>
    );
  }

  if (flagKey === 'belarus_democratic') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="20" fill="#ffffff" />
        <rect y="20" width="100" height="20" fill="#d62612" />
        <rect y="40" width="100" height="20" fill="#ffffff" />
      </svg>
    );
  }

  if (flagKey === 'south_korea') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#ffffff" />
        <g transform="translate(50,30) rotate(-33)">
          <path d="M 0 -15 A 15 15 0 0 1 0 15 A 7.5 7.5 0 0 1 0 0 A 7.5 7.5 0 0 0 0 -15" fill="#cd2e3a" />
          <path d="M 0 15 A 15 15 0 0 1 0 -15 A 7.5 7.5 0 0 1 0 0 A 7.5 7.5 0 0 0 0 15" fill="#0047a0" />
        </g>
        <rect x="18" y="10" width="3" height="12" fill="#000" transform="rotate(-33 19.5 16)" />
        <rect x="23" y="10" width="3" height="12" fill="#000" transform="rotate(-33 24.5 16)" />
        <rect x="28" y="10" width="3" height="12" fill="#000" transform="rotate(-33 29.5 16)" />
        <rect x="68" y="38" width="3" height="12" fill="#000" transform="rotate(-33 69.5 44)" />
        <rect x="73" y="38" width="3" height="12" fill="#000" transform="rotate(-33 74.5 44)" />
        <rect x="78" y="38" width="3" height="12" fill="#000" transform="rotate(-33 79.5 44)" />
      </svg>
    );
  }

  if (flagKey === 'north_korea') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#024fa2" />
        <rect y="10" width="100" height="40" fill="#ffffff" />
        <rect y="12" width="100" height="36" fill="#ed1c24" />
        <circle cx="35" cy="30" r="13" fill="#ffffff" />
        <polygon points="35,18 38.5,27 48,27 40,32.5 43,42 35,36 27,42 30,32.5 22,27 31.5,27" fill="#ed1c24" />
      </svg>
    );
  }

  if (flagKey === 'taiwan') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#fe0000" />
        <rect width="50" height="30" fill="#000095" />
        <circle cx="25" cy="15" r="8" fill="#ffffff" />
        <circle cx="25" cy="15" r="9.5" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="2,2" />
      </svg>
    );
  }

  if (flagKey === 'vietnam') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#da251d" />
        <polygon points="50,14 53.6,25.1 65.2,25.1 55.8,31.9 59.4,43.0 50,36.1 40.6,43.0 44.2,31.9 34.8,25.1 46.4,25.1" fill="#ffff00" />
      </svg>
    );
  }

  if (flagKey === 'greece') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#0d5eaf" />
        {[1, 3, 5, 7].map((i) => (
          <rect key={i} y={i * (60 / 9)} width="100" height={60 / 9} fill="#ffffff" />
        ))}
        <rect width="33.3" height="33.3" fill="#0d5eaf" />
        <rect x="13.3" y="0" width="6.7" height="33.3" fill="#ffffff" />
        <rect x="0" y="13.3" width="33.3" height="6.7" fill="#ffffff" />
      </svg>
    );
  }

  if (flagKey === 'turkey') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#e30a17" />
        <circle cx="38" cy="30" r="15" fill="#ffffff" />
        <circle cx="42" cy="30" r="12" fill="#e30a17" />
        <polygon
          points="58,30 52.5,27.8 48,33 49.2,26.5 44,22.5 50.5,22.5 53,16.5 55.5,22.5 62,22.5 56.8,26.5"
          fill="#ffffff"
        />
      </svg>
    );
  }

  if (flagKey === 'norway') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#ba0c2f" />
        <rect x="24" y="0" width="16" height="60" fill="#ffffff" />
        <rect x="0" y="22" width="100" height="16" fill="#ffffff" />
        <rect x="28" y="0" width="8" height="60" fill="#00205b" />
        <rect x="0" y="26" width="100" height="8" fill="#00205b" />
      </svg>
    );
  }

  if (flagKey === 'denmark') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#c8102e" />
        <rect x="30" y="0" width="10" height="60" fill="#ffffff" />
        <rect x="0" y="25" width="100" height="10" fill="#ffffff" />
      </svg>
    );
  }

  if (flagKey === 'belgium') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="33.33" height="60" fill="#000000" />
        <rect x="33.33" width="33.34" height="60" fill="#fdae17" />
        <rect x="66.67" width="33.33" height="60" fill="#ef3340" />
      </svg>
    );
  }

  if (flagKey === 'netherlands') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="20" fill="#ae1c28" />
        <rect y="20" width="100" height="20" fill="#ffffff" />
        <rect y="40" width="100" height="20" fill="#21468b" />
      </svg>
    );
  }

  if (flagKey === 'un') {
    return (
      <svg viewBox="0 0 100 60" style={{ width: '85%', height: '85%' }}>
        <rect width="100" height="60" fill="#4b92db" />
        <circle cx="50" cy="30" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="50" cy="30" r="12" fill="none" stroke="#ffffff" strokeWidth="1" />
        <circle cx="50" cy="30" r="6" fill="none" stroke="#ffffff" strokeWidth="1" />
        <line x1="50" y1="12" x2="50" y2="48" stroke="#ffffff" strokeWidth="1" />
        <line x1="32" y1="30" x2="68" y2="30" stroke="#ffffff" strokeWidth="1" />
        <path d="M 32 40 Q 50 50 68 40" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return null;
}

// Default Missile Truck SVG for Misc MILDEC token
function DefaultMissileTruckSilhouette({ color = '#ffffff' }) {
  return (
    <svg viewBox="0 0 120 60" style={{ width: '85%', height: '85%' }}>
      <rect x="10" y="32" width="75" height="18" rx="3" fill={color} />
      <rect x="85" y="24" width="25" height="26" rx="4" fill={color} />
      <rect x="92" y="27" width="12" height="10" fill="#090d16" />
      <circle cx="25" cy="50" r="7" fill={color} />
      <circle cx="25" cy="50" r="3" fill="#090d16" />
      <circle cx="45" cy="50" r="7" fill={color} />
      <circle cx="45" cy="50" r="3" fill="#090d16" />
      <circle cx="65" cy="50" r="7" fill={color} />
      <circle cx="65" cy="50" r="3" fill="#090d16" />
      <circle cx="98" cy="50" r="7" fill={color} />
      <circle cx="98" cy="50" r="3" fill="#090d16" />
      <polygon points="15,28 75,10 80,16 20,34" fill={color} />
      <line x1="20" y1="32" x2="60" y2="28" stroke="#090d16" strokeWidth="2" />
    </svg>
  );
}

// Default Soldiers Silhouette for Misc Infantry/Dismount token
function DefaultSoldiersSilhouette({ color = '#facc15' }) {
  return (
    <svg viewBox="0 0 100 80" style={{ width: '85%', height: '85%' }}>
      <circle cx="68" cy="22" r="6" fill={color} />
      <path d="M 60 28 L 78 28 L 75 52 L 68 52 L 72 70 L 64 70 L 62 48 L 56 48 Z" fill={color} />
      <polygon points="68,34 88,30 86,26 66,30" fill={color} />
      <circle cx="35" cy="38" r="6" fill={color} />
      <path d="M 28 44 L 44 44 L 40 60 L 52 70 L 42 72 L 32 60 L 22 70 L 15 68 L 26 56 Z" fill={color} />
      <polygon points="32,46 10,42 12,38 34,42" fill={color} />
    </svg>
  );
}

// Default Warship Silhouette SVG
function DefaultShipSilhouette({ color = '#000000' }) {
  return (
    <svg viewBox="0 0 200 60" style={{ width: '100%', height: '100%' }}>
      <path
        d="M 5 42 L 30 42 L 45 32 L 70 32 L 75 22 L 85 22 L 90 16 L 108 16 L 112 24 L 128 24 L 132 32 L 165 32 L 195 42 L 182 52 L 20 52 Z"
        fill={color}
      />
      <rect x="94" y="8" width="3" height="10" fill={color} />
      <polygon points="120,24 125,16 130,24" fill={color} />
    </svg>
  );
}

// Main Token component renders Front or Back of Land or Naval Token
export function LandToken({
  tokenData,
  side = 'front', // 'front' | 'back'
  size: sizeProp, // pixel dimensions for square display
  id
}) {
  const {
    category = 'land',
    bgColor = '#2b6cb0',
    stripeColor = '#ffffff',
    hexColor = '#7e8388',
    fontFamily = "'Trebuchet MS', 'Arial Bold', sans-serif",
    echelon = '••',
    affiliation = 'friendly',
    symbolType = 'infantry',
    modifiers = [],
    movementRange = 3,
    unitName = category === 'naval' ? 'DDG-93' : '1-1 CHARLIE',
    tokenSize = 240,
    backFlag = 'none',
    customBackImage = '',
    customShipImage = '',
    customNatoImage = '',
    dice = [
      { type: 'red', bigValue: 10, smallValue: '4' },
      { type: 'red', bigValue: 12, smallValue: '9' }
    ]
  } = tokenData || {};

  const size = sizeProp || tokenSize || 240;

  if (side === 'back') {
    return (
      <div
        id={id}
        style={{
          width: size,
          height: size,
          backgroundColor: bgColor,
          borderRadius: size * 0.08,
          border: '3px solid rgba(0,0,0,0.7)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Solid single background color, no white strip */}
        <RenderFlag flagKey={backFlag} customUrl={customBackImage} />
      </div>
    );
  }

  // Render Misc Tokens Front Side
  if (category === 'misc' && side === 'front') {
    const miscType = tokenData.miscType || 'task_force';
    const miscBannerText = tokenData.miscBannerText ?? 'TASK FORCE';
    const miscBannerColor = tokenData.miscBannerColor || '#ffffff';
    const miscTopText = tokenData.miscTopText ?? (miscType === 'text_number' ? 'ISR' : 'MILDEC');
    const miscNumber = tokenData.miscNumber ?? 4;
    const miscNumberShow = tokenData.miscNumberShow !== false;
    const customMiscImage = tokenData.customMiscImage || '';

    return (
      <div
        id={id}
        style={{
          width: size,
          height: size,
          backgroundColor: bgColor,
          borderRadius: size * 0.08,
          border: '3px solid rgba(0,0,0,0.7)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fontFamily,
          userSelect: 'none',
          padding: size * 0.05
        }}
      >
        {miscType === 'task_force' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.04, width: '100%' }}>
            <div
              style={{
                backgroundColor: miscBannerColor,
                color: '#000000',
                padding: `${size * 0.02}px ${size * 0.06}px`,
                borderRadius: '3px',
                fontWeight: 900,
                fontSize: size * 0.11,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {miscBannerText}
            </div>
            <div
              style={{
                color: '#ffffff',
                fontWeight: 900,
                fontSize: size * 0.12,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {unitName || 'NEW YORK'}
            </div>
          </div>
        )}

        {miscType === 'text_number' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div
              style={{
                color: '#ffffff',
                fontWeight: 900,
                fontSize: size * 0.14,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                marginBottom: size * 0.02
              }}
            >
              {miscTopText}
            </div>
            <div
              style={{
                color: '#ffffff',
                fontWeight: 900,
                fontSize: size * 0.44,
                lineHeight: 0.9,
                textShadow: '2px 2px 6px rgba(0,0,0,0.8)'
              }}
            >
              {miscNumber}
            </div>
          </div>
        )}

        {miscType === 'text_image' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '90%' }}>
            <div
              style={{
                color: '#ffffff',
                fontWeight: 900,
                fontSize: size * 0.14,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                marginTop: size * 0.02
              }}
            >
              {miscTopText}
            </div>
            <div style={{ width: '85%', height: '65%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {customMiscImage ? (
                <img src={customMiscImage} alt="Misc Center" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <DefaultMissileTruckSilhouette color="#ffffff" />
              )}
            </div>
          </div>
        )}

        {miscType === 'image_number' && (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {miscNumberShow && (
              <div
                style={{
                  position: 'absolute',
                  top: size * 0.03,
                  right: size * 0.05,
                  color: '#facc15',
                  fontWeight: 900,
                  fontSize: size * 0.22,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                  zIndex: 2
                }}
              >
                {miscNumber}
              </div>
            )}
            <div style={{ width: '85%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              {customMiscImage ? (
                <img src={customMiscImage} alt="Misc Center" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <DefaultSoldiersSilhouette color="#facc15" />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Front side for Land and Naval
  // Helper for Dice rendering
  const renderDice = (d, index) => {
    const diceType = d.type || 'red';
    const bigVal = d.bigValue ?? 10;
    const smallVal = d.smallValue ?? '0';

    // Custom background color if specified, else default type background
    let defaultBg = '#c83232';
    if (diceType === 'green') defaultBg = '#2e7d32';
    if (diceType === 'purple') defaultBg = '#7b1fa2';
    if (diceType === 'blue') defaultBg = '#1976d2';

    const diceBg = d.color || defaultBg;
    const borderThick = d.hasThickBorder ? true : false;
    const borderColor = d.borderColor || '#ffcc00';
    const strokeW = borderThick ? 7 : 3;
    const strokeC = borderThick ? borderColor : '#ffffff';

    // Shape styling / SVG paths
    const diceWidth = size * 0.36;
    const diceHeight = size * 0.36;

    return (
      <div
        key={index}
        style={{
          width: diceWidth,
          height: diceHeight,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 'bold',
          fontFamily: fontFamily
        }}
      >
        {/* SVG background shape */}
        <svg
          width={diceWidth}
          height={diceHeight}
          viewBox="0 0 100 100"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          {diceType === 'red' && (
            // Square
            <rect x="5" y="5" width="90" height="90" rx="6" fill={diceBg} stroke={strokeC} strokeWidth={strokeW} />
          )}
          {diceType === 'green' && (
            // Cut-corner square
            <path
              d="M 5 11 C 5 7.7 7.7 5 11 5 L 89 5 C 92.3 5 95 7.7 95 11 L 95 65 L 65 95 L 11 95 C 7.7 95 5 92.3 5 89 Z"
              fill={diceBg}
              stroke={strokeC}
              strokeWidth={strokeW}
            />
          )}
          {diceType === 'purple' && (
            // Inverted Pentagon: side corners placed at ~1/3 height from bottom (y=65 in 0-100 viewBox)
            <polygon
              points="20,5 80,5 96,65 50,95 4,65"
              fill={diceBg}
              stroke={strokeC}
              strokeWidth={strokeW}
            />
          )}
          {diceType === 'blue' && (
            // Circle
            <circle cx="50" cy="50" r="45" fill={diceBg} stroke={strokeC} strokeWidth={strokeW} />
          )}
        </svg>

        {/* Text inside die */}
        <div
          style={{
            zIndex: 1,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            lineHeight: 1,
            marginTop: '-2px'
          }}
        >
          <span style={{ fontSize: size * 0.16, fontWeight: 900, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            {bigVal}
          </span>
          <span
            style={{
              fontSize: size * 0.08,
              fontWeight: 800,
              verticalAlign: 'top',
              alignSelf: 'flex-start',
              marginTop: size * 0.01,
              marginLeft: size * 0.01,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {smallVal}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      id={id}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        borderRadius: size * 0.08,
        border: '3px solid rgba(0,0,0,0.7)',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: fontFamily,
        userSelect: 'none'
      }}
    >
      {/* Top Section */}
      {category === 'naval' ? (
        // Naval Token Top: Unit Name on top-left, Movement Hex on top-right
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${size * 0.04}px ${size * 0.05}px 0 ${size * 0.05}px`,
            zIndex: 3
          }}
        >
          <div
            style={{
              color: '#ffffff',
              fontSize: size * 0.11,
              fontWeight: '900',
              letterSpacing: '1px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
              fontFamily: fontFamily
            }}
          >
            {unitName || 'DDG-93'}
          </div>

          {/* Movement Range Hexagon */}
          <div
            style={{
              position: 'relative',
              width: size * 0.3,
              height: size * 0.3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg
              width={size * 0.3}
              height={size * 0.3}
              viewBox="0 0 100 100"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <polygon points="50,2 94,26 94,74 50,98 6,74 6,26" fill={hexColor} />
            </svg>
            <span
              style={{
                zIndex: 1,
                color: '#ffffff',
                fontSize: size * 0.16,
                fontWeight: '900',
                fontFamily: fontFamily
              }}
            >
              {movementRange}
            </span>
          </div>
        </div>
      ) : (
        // Land Token Top: Left NATO designation & Echelon, Right Movement Hex
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: `${size * 0.03}px ${size * 0.04}px 0 ${size * 0.04}px`,
            zIndex: 3
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                color: '#ffffff',
                fontSize: size * 0.08,
                fontWeight: 'bold',
                lineHeight: 1,
                minHeight: size * 0.08,
                letterSpacing: '1px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                marginBottom: size * 0.01,
                fontFamily: fontFamily
              }}
            >
              {echelon}
            </div>

            <NatoSymbol
              affiliation={affiliation}
              symbolType={symbolType}
              modifiers={modifiers}
              size={size}
              customNatoImage={customNatoImage}
            />
          </div>

          <div
            style={{
              position: 'relative',
              width: size * 0.32,
              height: size * 0.32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: size * 0.01
            }}
          >
            <svg
              width={size * 0.32}
              height={size * 0.32}
              viewBox="0 0 100 100"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <polygon points="50,2 94,26 94,74 50,98 6,74 6,26" fill={hexColor} />
            </svg>
            <span
              style={{
                zIndex: 1,
                color: '#ffffff',
                fontSize: size * 0.17,
                fontWeight: '900',
                fontFamily: fontFamily
              }}
            >
              {movementRange}
            </span>
          </div>
        </div>
      )}

      {/* Middle Section */}
      {category === 'naval' ? (
        // Naval Token Middle: Wide ship silhouette positioned behind top-left name and hex
        <div
          style={{
            position: 'absolute',
            top: '22%',
            left: '3%',
            width: '94%',
            height: '42%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          {customShipImage ? (
            <img
              src={customShipImage}
              alt="Ship Silhouette"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <DefaultShipSilhouette color="#000000" />
          )}
        </div>
      ) : (
        // Land Token Middle: Unit Name
        <div
          style={{
            textAlign: 'center',
            color: '#ffffff',
            fontWeight: '900',
            fontSize: size * 0.085,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
            margin: `${size * 0.005}px 0`,
            fontFamily: fontFamily,
            zIndex: 3
          }}
        >
          {unitName}
        </div>
      )}

      {/* Lower Section: Weapon Dice */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: size * 0.03,
          paddingBottom: size * 0.02,
          zIndex: 3
        }}
      >
        {dice.map((d, i) => renderDice(d, i))}
      </div>

      {/* Bottom White/Custom Stripe */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '20%',
          backgroundColor: stripeColor,
          borderTop: '1px solid rgba(0,0,0,0.15)',
          zIndex: 2
        }}
      />
    </div>
  );
}
