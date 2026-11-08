import React from 'react';

const FLAG_OPTIONS = [
  { value: 'none', label: 'None (Solid Background)' },
  { value: 'abkhazia', label: 'Abkhazia Flag' },
  { value: 'argentina', label: 'Argentina Flag' },
  { value: 'armenia', label: 'Armenia Flag' },
  { value: 'australia', label: 'Australia Flag' },
  { value: 'azerbaijan', label: 'Azerbaijan Flag' },
  { value: 'belarus', label: 'Belarus Flag' },
  { value: 'belgium', label: 'Belgium Flag' },
  { value: 'brazil', label: 'Brazil Flag' },
  { value: 'canada', label: 'Canada Flag' },
  { value: 'china', label: 'China Flag' },
  { value: 'colombia', label: 'Colombia Flag' },
  { value: 'belarus_democratic', label: 'Democratic Belarus Flag' },
  { value: 'denmark', label: 'Denmark Flag' },
  { value: 'donetsk_peoples_republic', label: "Donetsk People's Republic Flag" },
  { value: 'estonia', label: 'Estonia Flag' },
  { value: 'ue', label: 'EU / UE Flag' },
  { value: 'finland', label: 'Finland Flag' },
  { value: 'france', label: 'France Flag' },
  { value: 'georgia', label: 'Georgia Flag' },
  { value: 'germany', label: 'Germany Flag' },
  { value: 'great_britain', label: 'Great Britain Flag' },
  { value: 'greece', label: 'Greece Flag' },
  { value: 'india', label: 'India Flag' },
  { value: 'isis', label: 'ISIS Flag' },
  { value: 'italy', label: 'Italy Flag' },
  { value: 'japan', label: 'Japan Flag' },
  { value: 'latvia', label: 'Latvia Flag' },
  { value: 'lithuania', label: 'Lithuania Flag' },
  { value: 'mexico', label: 'Mexico Flag' },
  { value: 'moldova', label: 'Moldova Flag' },
  { value: 'nato', label: 'NATO Flag' },
  { value: 'netherlands', label: 'Netherlands Flag' },
  { value: 'north_korea', label: 'North Korea Flag' },
  { value: 'norway', label: 'Norway Flag' },
  { value: 'pakistan', label: 'Pakistan Flag' },
  { value: 'poland', label: 'Poland Flag' },
  { value: 'russia', label: 'Russia Flag' },
  { value: 'serbia', label: 'Serbia Flag' },
  { value: 'south_korea', label: 'South Korea Flag' },
  { value: 'south_ossetia', label: 'South Ossetia Flag' },
  { value: 'sweden', label: 'Sweden Flag' },
  { value: 'switzerland', label: 'Switzerland Flag' },
  { value: 'taiwan', label: 'Taiwan Flag' },
  { value: 'taliban', label: 'Taliban Flag' },
  { value: 'transnistria', label: 'Transnistria Flag' },
  { value: 'turkey', label: 'Turkey Flag' },
  { value: 'ukraine', label: 'Ukraine Flag' },
  { value: 'usa', label: 'USA Flag' },
  { value: 'venezuela', label: 'Venezuela Flag' },
  { value: 'vietnam', label: 'Vietnam Flag' },
  { value: 'custom', label: 'Custom Uploaded Image' }
];

export function TokenForm({ tokenData, onChange }) {
  const [flagSearchQuery, setFlagSearchQuery] = React.useState('');
  const bgFileInputRef = React.useRef(null);

  const handleBgImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({
          ...tokenData,
          customBgImage: e.target?.result,
          customBgOpacity: tokenData.customBgOpacity ?? 0.35,
          customBgFit: tokenData.customBgFit || 'cover'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearBgImage = () => {
    if (bgFileInputRef.current) {
      bgFileInputRef.current.value = '';
    }
    onChange({
      ...tokenData,
      customBgImage: ''
    });
  };

  const handleChange = (field, value) => {
    onChange({
      ...tokenData,
      [field]: value
    });
  };

  const handleModifierToggle = (mod) => {
    const currentMods = tokenData.modifiers || [];
    if (currentMods.includes(mod)) {
      handleChange(
        'modifiers',
        currentMods.filter((m) => m !== mod)
      );
    } else {
      handleChange('modifiers', [...currentMods, mod]);
    }
  };

  const handleDiceChange = (index, field, value) => {
    const updatedDice = [...(tokenData.dice || [])];
    updatedDice[index] = {
      ...updatedDice[index],
      [field]: value
    };
    onChange({
      ...tokenData,
      dice: updatedDice
    });
  };

  const setDiceCount = (count) => {
    let currentDice = [...(tokenData.dice || [])];
    if (count === 1) {
      currentDice = [currentDice[0] || { type: 'red', bigValue: 10, smallValue: '4' }];
    } else if (count === 2) {
      if (currentDice.length < 2) {
        currentDice.push({ type: 'red', bigValue: 12, smallValue: '9' });
      }
    }
    onChange({
      ...tokenData,
      dice: currentDice
    });
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange(field, e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
      {/* 1. CATEGORY & UNIT IDENTIFICATION */}
      <div className="tint-card tint-card-attributes">
        <h3 className="subsection-header">🏷️ Token Category & Unit Designation</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
          <div>
            <label className="field-label">Token Category</label>
            <select
              value={tokenData.category || 'land'}
              onChange={(e) => handleChange('category', e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="land">Land Unit</option>
              <option value="naval">Naval Unit</option>
              <option value="misc">Misc Token</option>
            </select>
          </div>

          {tokenData.category !== 'misc' && (
            <>
              <div>
                <label className="field-label">Unit Name / Designation</label>
                <input
                  type="text"
                  value={tokenData.unitName ?? '1-1 CHARLIE'}
                  onChange={(e) => handleChange('unitName', e.target.value)}
                  placeholder="e.g. 1-1 CHARLIE"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="field-label">Movement Range</label>
                <input
                  type="number"
                  value={tokenData.movementRange ?? 3}
                  onChange={(e) => handleChange('movementRange', parseInt(e.target.value) || 0)}
                  style={{ width: '100%' }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. COLORS & BACKGROUND STYLING */}
      <div className="tint-card tint-card-colors">
        <h3 className="subsection-header">🎨 Colors & Background Styling</h3>

        <div className="color-picker-grid-3">
          <div className="color-cell" style={{ minWidth: '170px' }}>
            <span className="cell-label" style={{ textAlign: 'center', width: '100%', display: 'block', margin: '0 0 0.35rem 0', minHeight: 'auto' }}>
              Base Card Color
            </span>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '0.45rem', width: '100%' }}>
              <button
                type="button"
                onClick={() => handleChange('useBgGradient', false)}
                style={{
                  fontSize: '9px',
                  padding: '2px 8px',
                  background: !tokenData.useBgGradient ? 'var(--accent-cyan)' : 'var(--input-bg)',
                  color: !tokenData.useBgGradient ? '#000' : 'var(--text-secondary)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: !tokenData.useBgGradient ? 'bold' : 'normal'
                }}
              >
                Solid
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange({
                    ...tokenData,
                    useBgGradient: true,
                    bgGradientTop: tokenData.bgGradientTop || tokenData.bgColor || '#2b6cb0',
                    bgGradientBottom: tokenData.bgGradientBottom || '#102a43'
                  });
                }}
                style={{
                  fontSize: '9px',
                  padding: '2px 8px',
                  background: tokenData.useBgGradient ? 'var(--accent-cyan)' : 'var(--input-bg)',
                  color: tokenData.useBgGradient ? '#000' : 'var(--text-secondary)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: tokenData.useBgGradient ? 'bold' : 'normal'
                }}
              >
                Gradient
              </button>
            </div>

            {!tokenData.useBgGradient ? (
              <>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'center' }}>
                  <input
                    type="color"
                    value={tokenData.bgColor || '#2b6cb0'}
                    onChange={(e) => handleChange('bgColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={tokenData.bgColor || '#2b6cb0'}
                    onChange={(e) => handleChange('bgColor', e.target.value)}
                    style={{ width: '70px', fontSize: '0.78rem' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleChange('bgColor', '#2b6cb0')}
                    style={{ background: '#2b6cb0', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}
                  >
                    Blue
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('bgColor', '#c83232')}
                    style={{ background: '#c83232', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}
                  >
                    Red
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('bgColor', '#2e7d32')}
                    style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}
                  >
                    Green
                  </button>
                </div>
              </>
            ) : (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '3px',
                    background: `linear-gradient(180deg, ${tokenData.bgGradientTop || tokenData.bgColor || '#2b6cb0'} 0%, ${tokenData.bgGradientBottom || '#102a43'} 100%)`,
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                />

                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Top:</span>
                  <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={tokenData.bgGradientTop || tokenData.bgColor || '#2b6cb0'}
                      onChange={(e) => handleChange('bgGradientTop', e.target.value)}
                    />
                    <input
                      type="text"
                      value={tokenData.bgGradientTop || tokenData.bgColor || '#2b6cb0'}
                      onChange={(e) => handleChange('bgGradientTop', e.target.value)}
                      style={{ width: '60px', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Bottom:</span>
                  <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={tokenData.bgGradientBottom || '#102a43'}
                      onChange={(e) => handleChange('bgGradientBottom', e.target.value)}
                    />
                    <input
                      type="text"
                      value={tokenData.bgGradientBottom || '#102a43'}
                      onChange={(e) => handleChange('bgGradientBottom', e.target.value)}
                      style={{ width: '60px', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.1rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        ...tokenData,
                        useBgGradient: true,
                        bgGradientTop: '#2b6cb0',
                        bgGradientBottom: '#0d1b2a'
                      });
                    }}
                    style={{ background: 'linear-gradient(180deg, #2b6cb0 0%, #0d1b2a 100%)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer', fontSize: '9px' }}
                  >
                    Blue Grad
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        ...tokenData,
                        useBgGradient: true,
                        bgGradientTop: '#c83232',
                        bgGradientBottom: '#4a0e0e'
                      });
                    }}
                    style={{ background: 'linear-gradient(180deg, #c83232 0%, #4a0e0e 100%)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer', fontSize: '9px' }}
                  >
                    Red Grad
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        ...tokenData,
                        useBgGradient: true,
                        bgGradientTop: '#3d5a40',
                        bgGradientBottom: '#142016'
                      });
                    }}
                    style={{ background: 'linear-gradient(180deg, #3d5a40 0%, #142016 100%)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer', fontSize: '9px' }}
                  >
                    Green Grad
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        ...tokenData,
                        useBgGradient: true,
                        bgGradientTop: '#475569',
                        bgGradientBottom: '#0f172a'
                      });
                    }}
                    style={{ background: 'linear-gradient(180deg, #475569 0%, #0f172a 100%)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer', fontSize: '9px' }}
                  >
                    Slate Grad
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="color-cell">
            <span className="cell-label">Token Outer Border</span>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <input
                type="color"
                value={tokenData.tokenBorderColor || '#70b5ff'}
                onChange={(e) => handleChange('tokenBorderColor', e.target.value)}
                disabled={!tokenData.showTokenBorder}
              />
              <input
                type="text"
                value={tokenData.tokenBorderColor || '#70b5ff'}
                onChange={(e) => handleChange('tokenBorderColor', e.target.value)}
                disabled={!tokenData.showTokenBorder}
                style={{ width: '65px', fontSize: '0.78rem' }}
              />
              <label style={{ fontSize: '0.78rem', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <input
                  type="checkbox"
                  checked={Boolean(tokenData.showTokenBorder)}
                  onChange={(e) => handleChange('showTokenBorder', e.target.checked)}
                />
                Show
              </label>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Width:</span>
              <input
                type="number"
                min="1"
                max="30"
                value={tokenData.tokenBorderWidth ?? 4}
                onChange={(e) => handleChange('tokenBorderWidth', Math.max(1, parseInt(e.target.value) || 1))}
                disabled={!tokenData.showTokenBorder}
                style={{ width: '45px', fontSize: '0.78rem', padding: '2px 4px', textAlign: 'center' }}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>px</span>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  onChange({
                    ...tokenData,
                    showTokenBorder: true,
                    tokenBorderColor: '#70b5ff'
                  });
                }}
                style={{ fontSize: '10px', padding: '2px 6px', background: '#70b5ff', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cyan
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange({
                    ...tokenData,
                    showTokenBorder: true,
                    tokenBorderColor: '#ffffff'
                  });
                }}
                style={{ fontSize: '10px', padding: '2px 6px', background: '#ffffff', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                White
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange({
                    ...tokenData,
                    showTokenBorder: true,
                    tokenBorderColor: '#c83232'
                  });
                }}
                style={{ fontSize: '10px', padding: '2px 6px', background: '#c83232', color: '#ffffff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Red
              </button>
            </div>
          </div>

          <div className="color-cell">
            <span className="cell-label">Bottom Stripe Color</span>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="color"
                value={tokenData.stripeColor === 'transparent' ? '#ffffff' : (tokenData.stripeColor || '#ffffff')}
                onChange={(e) => handleChange('stripeColor', e.target.value)}
                disabled={tokenData.stripeColor === 'transparent'}
              />
              <input
                type="text"
                value={tokenData.stripeColor || '#ffffff'}
                onChange={(e) => handleChange('stripeColor', e.target.value)}
                style={{ width: '70px', fontSize: '0.78rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleChange('stripeColor', '#ffffff')}
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  background: tokenData.stripeColor === '#ffffff' || !tokenData.stripeColor ? 'var(--accent-cyan)' : '#1e293b',
                  color: tokenData.stripeColor === '#ffffff' || !tokenData.stripeColor ? '#000' : '#9ca3af',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: tokenData.stripeColor === '#ffffff' || !tokenData.stripeColor ? 'bold' : 'normal'
                }}
              >
                White
              </button>
              <button
                type="button"
                onClick={() => handleChange('stripeColor', 'transparent')}
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  background: tokenData.stripeColor === 'transparent' ? 'var(--accent-cyan)' : '#1e293b',
                  color: tokenData.stripeColor === 'transparent' ? '#000' : '#9ca3af',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: tokenData.stripeColor === 'transparent' ? 'bold' : 'normal'
                }}
              >
                Transparent
              </button>
            </div>
          </div>

          <div className="color-cell">
            <span className="cell-label">Movement Hex Color</span>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="color"
                value={tokenData.hexColor || '#7e8388'}
                onChange={(e) => handleChange('hexColor', e.target.value)}
              />
              <input
                type="text"
                value={tokenData.hexColor || '#7e8388'}
                onChange={(e) => handleChange('hexColor', e.target.value)}
                style={{ width: '70px', fontSize: '0.78rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => handleChange('hexColor', '#7e8388')}
                style={{ fontSize: '10px', padding: '2px 6px', background: '#1e293b', color: '#9ca3af', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              >
                Default (Gray)
              </button>
            </div>
          </div>

          <div className="color-cell">
            <span className="cell-label">Movement Hex Border</span>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="color"
                value={tokenData.hexBorderColor || '#ffffff'}
                onChange={(e) => handleChange('hexBorderColor', e.target.value)}
                disabled={!tokenData.hexBorderColor}
              />
              <label style={{ fontSize: '0.78rem', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <input
                  type="checkbox"
                  checked={Boolean(tokenData.hexBorderColor)}
                  onChange={(e) => handleChange('hexBorderColor', e.target.checked ? '#ffffff' : '')}
                />
                Show
              </label>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => handleChange('hexBorderColor', '#ffffff')}
                style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '3px', cursor: 'pointer' }}
              >
                White
              </button>
              <button
                type="button"
                onClick={() => handleChange('hexBorderColor', '')}
                style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--input-bg)', color: 'var(--text-muted)', border: '1px solid var(--panel-border)', borderRadius: '3px', cursor: 'pointer' }}
              >
                None
              </button>
            </div>
          </div>

          <div className="color-cell">
            <span className="cell-label">NATO Frame & Symbol</span>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="color"
                value={tokenData.natoSymbolColor || tokenData.textColor || '#ffffff'}
                onChange={(e) => handleChange('natoSymbolColor', e.target.value)}
                disabled={tokenData.category !== 'land'}
              />
              <input
                type="text"
                value={tokenData.natoSymbolColor || tokenData.textColor || '#ffffff'}
                onChange={(e) => handleChange('natoSymbolColor', e.target.value)}
                disabled={tokenData.category !== 'land'}
                style={{ width: '70px', fontSize: '0.78rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => handleChange('natoSymbolColor', '#ffffff')}
                disabled={tokenData.category !== 'land'}
                style={{ fontSize: '10px', padding: '2px 6px', background: '#ffffff', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                White
              </button>
              <button
                type="button"
                onClick={() => handleChange('natoSymbolColor', '#facc15')}
                disabled={tokenData.category !== 'land'}
                style={{ fontSize: '10px', padding: '2px 6px', background: '#facc15', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Yellow
              </button>
            </div>
          </div>

          <div className="color-cell">
            <span className="cell-label">Global Text Color</span>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="color"
                value={tokenData.textColor || '#ffffff'}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
              <input
                type="text"
                value={tokenData.textColor || '#ffffff'}
                onChange={(e) => handleChange('textColor', e.target.value)}
                style={{ width: '70px', fontSize: '0.78rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => handleChange('textColor', '#ffffff')}
                style={{ fontSize: '10px', padding: '2px 6px', background: '#ffffff', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                White
              </button>
              <button
                type="button"
                onClick={() => handleChange('textColor', '#facc15')}
                style={{ fontSize: '10px', padding: '2px 6px', background: '#facc15', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Yellow
              </button>
            </div>
          </div>
        </div>

        {/* Font & Backside Flag Grouped Below Color Cell Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '0.6rem', marginTop: '0.6rem' }}>
          <div>
            <label className="field-label">Token Text Font</label>
            <select
              value={tokenData.fontFamily || "'Trebuchet MS', 'Arial Bold', sans-serif"}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="'Trebuchet MS', 'Arial Bold', sans-serif">Trebuchet / Bold Sans</option>
              <option value="'Chakra Petch', sans-serif">Chakra Petch</option>
              <option value="'Manrope', sans-serif">Manrope</option>
              <option value="'Special Elite', cursive">Special Elite</option>
              <option value="'Josefin Sans', sans-serif">Josefin Sans</option>
              <option value="'Oswald', 'Arial Narrow', sans-serif">Oswald / Condensed</option>
              <option value="system-ui, -apple-system, sans-serif">Inter / System Sans</option>
              <option value="'Courier New', monospace">Monospace</option>
              <option value="'Georgia', 'Times New Roman', serif">Serif</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <label className="field-label" style={{ marginBottom: 0 }}>Backside Flag / Picture</label>
            </div>
            <input
              type="text"
              placeholder="🔍 Search flags (e.g. Ca...)"
              value={flagSearchQuery}
              onChange={(e) => setFlagSearchQuery(e.target.value)}
              style={{ width: '100%', marginBottom: '0.35rem', fontSize: '0.8rem' }}
            />
            <select
              value={tokenData.backFlag || 'none'}
              onChange={(e) => handleChange('backFlag', e.target.value)}
              style={{ width: '100%' }}
            >
              {FLAG_OPTIONS.filter((opt) => {
                if (!flagSearchQuery.trim()) return true;
                const q = flagSearchQuery.toLowerCase().trim();
                const matches = opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q);
                const isSelected = (tokenData.backFlag || 'none') === opt.value;
                return matches || isSelected;
              }).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {tokenData.backFlag === 'custom' && (
          <div style={{ marginTop: '0.4rem' }}>
            <label className="field-label">Custom Backside Image Upload</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '4px 10px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--accent-cyan)',
                  borderRadius: '4px',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('customBackImage', e)}
                  style={{ display: 'none' }}
                />
                <span>📁 Browse Backside Image...</span>
              </label>
              <span style={{ fontSize: '0.75rem', color: tokenData.customBackImage ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {tokenData.customBackImage ? 'Custom image loaded' : 'No file chosen'}
              </span>
              {tokenData.customBackImage && (
                <button
                  type="button"
                  onClick={() => handleChange('customBackImage', '')}
                  style={{ padding: '2px 7px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 'bold' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {tokenData.category === 'naval' && (
          <div style={{ marginTop: '0.4rem' }}>
            <label className="field-label">Naval Ship Silhouette Upload</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '4px 10px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--accent-cyan)',
                  borderRadius: '4px',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('customShipImage', e)}
                  style={{ display: 'none' }}
                />
                <span>📁 Browse Silhouette Image...</span>
              </label>
              <span style={{ fontSize: '0.75rem', color: tokenData.customShipImage ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {tokenData.customShipImage ? 'Silhouette loaded' : 'No file chosen'}
              </span>
              {tokenData.customShipImage && (
                <button
                  type="button"
                  onClick={() => handleChange('customShipImage', '')}
                  style={{ padding: '2px 7px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 'bold' }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}

        {/* Custom Background Image Overlay */}
        <div
          style={{
            marginTop: '0.8rem',
            paddingTop: '0.8rem',
            borderTop: '1px dashed var(--panel-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              🖼️ Custom Token Background Image
            </span>
            {tokenData.customBgImage && (
              <button
                type="button"
                onClick={handleClearBgImage}
                style={{
                  padding: '2px 8px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 'bold'
                }}
              >
                Clear Image
              </button>
            )}
          </div>

          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.35' }}>
            Place a custom image or watermark above the token background color. Dice, movement range hex, NATO symbology, unit designation, and borders will never be covered.
          </p>

          {/* Upload input with mini preview */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap' }}>
            {tokenData.customBgImage && (
              <div
                title="Current Background Overlay Preview"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '5px',
                  border: '1px solid var(--accent-cyan)',
                  background: tokenData.useBgGradient
                    ? `linear-gradient(180deg, ${tokenData.bgGradientTop || tokenData.bgColor || '#2b6cb0'} 0%, ${tokenData.bgGradientBottom || '#102a43'} 100%)`
                    : (tokenData.bgColor || '#2b6cb0'),
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={tokenData.customBgImage}
                  alt="Thumb"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: tokenData.customBgFit || 'cover',
                    opacity: tokenData.customBgOpacity ?? 0.35
                  }}
                />
              </div>
            )}
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '5px 12px',
                background: 'var(--input-bg)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: '4px',
                color: 'var(--accent-cyan)',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <input
                ref={bgFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBgImageUpload}
                style={{ display: 'none' }}
              />
              <span>📁 Browse Custom Image...</span>
            </label>
            <span style={{ fontSize: '0.78rem', color: tokenData.customBgImage ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {tokenData.customBgImage ? 'Custom image loaded' : 'No image chosen'}
            </span>
          </div>

          {/* Controls when an image/texture is active */}
          {tokenData.customBgImage && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', background: 'var(--color-cell-bg)', padding: '0.6rem', borderRadius: '5px', border: '1px solid var(--color-cell-border)', marginTop: '0.2rem' }}>
              {/* Opacity Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                    Overlay Opacity (Transparency):
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                    {Math.round(((tokenData.customBgOpacity ?? 0.35) * 100))}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={tokenData.customBgOpacity ?? 0.35}
                  onChange={(e) => handleChange('customBgOpacity', parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.35rem', justifyContent: 'center' }}>
                  {[
                    { label: '15% Ghost', val: 0.15 },
                    { label: '35% Subtle', val: 0.35 },
                    { label: '60% Bold', val: 0.60 },
                    { label: '100% Solid', val: 1.0 }
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => handleChange('customBgOpacity', preset.val)}
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        background: Math.abs((tokenData.customBgOpacity ?? 0.35) - preset.val) < 0.01 ? 'var(--accent-cyan)' : 'var(--input-bg)',
                        color: Math.abs((tokenData.customBgOpacity ?? 0.35) - preset.val) < 0.01 ? '#000' : 'var(--text-secondary)',
                        border: '1px solid var(--panel-border)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontWeight: Math.abs((tokenData.customBgOpacity ?? 0.35) - preset.val) < 0.01 ? 'bold' : 'normal'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scaling / Fit Mode */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.2rem', borderTop: '1px solid var(--panel-border)' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Image Fit:</span>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {[
                    { id: 'cover', label: 'Cover (Fill)' },
                    { id: 'contain', label: 'Contain' },
                    { id: 'fill', label: 'Stretch' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleChange('customBgFit', mode.id)}
                      style={{
                        fontSize: '10px',
                        padding: '2px 7px',
                        background: (tokenData.customBgFit || 'cover') === mode.id ? 'var(--accent-cyan)' : 'var(--input-bg)',
                        color: (tokenData.customBgFit || 'cover') === mode.id ? '#000' : 'var(--text-secondary)',
                        border: '1px solid var(--panel-border)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontWeight: (tokenData.customBgFit || 'cover') === mode.id ? 'bold' : 'normal'
                      }}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingTop: '0.25rem', borderTop: '1px solid var(--panel-border)' }}>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(tokenData.showCustomBgOnBack)}
                    onChange={(e) => handleChange('showCustomBgOnBack', e.target.checked)}
                  />
                  <span>Also apply background overlay to reverse (back) side</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. MISC TOKEN CONTROLS (IF MISC) */}
      {tokenData.category === 'misc' && (
        <div className="tint-card tint-card-text">
          <h3 className="subsection-header">🎯 Misc Token Controls</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div>
              <label className="field-label">Misc Token Sub-Type</label>
              <select
                value={tokenData.miscType || 'task_force'}
                onChange={(e) => handleChange('miscType', e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="task_force">1. Task Force (Banner + Name)</option>
                <option value="text_number">2. Top Text + Center Number</option>
                <option value="text_image">3. Top Text + Center Image</option>
                <option value="image_number">4. Center Image + Top-Right Number</option>
              </select>
            </div>

            {tokenData.miscType === 'task_force' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', alignItems: 'end' }}>
                <div>
                  <label className="field-label">Banner Title</label>
                  <input
                    type="text"
                    value={tokenData.miscBannerText ?? 'TASK FORCE'}
                    onChange={(e) => handleChange('miscBannerText', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="field-label">Task Force Name</label>
                  <input
                    type="text"
                    value={tokenData.unitName ?? 'NEW YORK'}
                    onChange={(e) => handleChange('unitName', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="field-label">Banner Color</label>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={tokenData.miscBannerColor || '#ffffff'}
                      onChange={(e) => handleChange('miscBannerColor', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleChange('miscBannerColor', '#ffffff')}
                      style={{ padding: '3px 6px', fontSize: '10px', background: '#ffffff', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      White
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('miscBannerColor', '#facc15')}
                      style={{ padding: '3px 6px', fontSize: '10px', background: '#facc15', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      Yellow
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(tokenData.miscType === 'text_number' || tokenData.miscType === 'text_image') && (
              <div>
                <label className="field-label">Top Text Label</label>
                <input
                  type="text"
                  value={tokenData.miscTopText ?? (tokenData.miscType === 'text_number' ? 'ISR' : 'MILDEC')}
                  onChange={(e) => handleChange('miscTopText', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {(tokenData.miscType === 'text_number' || tokenData.miscType === 'image_number') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', alignItems: 'end' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="field-label">Number (0-9)</label>
                    {tokenData.miscType === 'image_number' && (
                      <label style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={tokenData.miscNumberShow !== false}
                          onChange={(e) => handleChange('miscNumberShow', e.target.checked)}
                          style={{ marginRight: '4px' }}
                        />
                        Show
                      </label>
                    )}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={tokenData.miscNumber ?? 4}
                    onChange={(e) => handleChange('miscNumber', parseInt(e.target.value) || 0)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="field-label">Number Color</label>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={tokenData.miscNumberColor || '#ffffff'}
                      onChange={(e) => handleChange('miscNumberColor', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleChange('miscNumberColor', '#ffffff')}
                      style={{ padding: '3px 6px', fontSize: '10px', background: '#ffffff', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      White
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('miscNumberColor', '#facc15')}
                      style={{ padding: '3px 6px', fontSize: '10px', background: '#facc15', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      Yellow
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(tokenData.miscType === 'text_image' || tokenData.miscType === 'image_number') && (
              <div>
                <label className="field-label">Center Image Upload</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '4px 10px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--accent-cyan)',
                      borderRadius: '4px',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.78rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('customMiscImage', e)}
                      style={{ display: 'none' }}
                    />
                    <span>📁 Browse Center Image...</span>
                  </label>
                  <span style={{ fontSize: '0.75rem', color: tokenData.customMiscImage ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {tokenData.customMiscImage ? 'Center image loaded' : 'No file chosen'}
                  </span>
                  {tokenData.customMiscImage && (
                    <button
                      type="button"
                      onClick={() => handleChange('customMiscImage', '')}
                      style={{ padding: '2px 7px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 'bold' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. NATO SYMBOLOGY & MODIFIERS (Land Units) */}
      {tokenData.category === 'land' && (
        <div className="tint-card tint-card-attributes">
          <h3 className="subsection-header">🛡️ NATO Joint Military Symbology</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div>
              <label className="field-label">Affiliation (Frame)</label>
              <select
                value={tokenData.affiliation || 'friendly'}
                onChange={(e) => handleChange('affiliation', e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="friendly">Friendly (Rectangle)</option>
                <option value="hostile">Hostile / Enemy (Diamond)</option>
                <option value="neutral">Neutral (Square)</option>
              </select>
            </div>

            <div>
              <label className="field-label">Unit Branch / Arm</label>
              <select
                value={tokenData.symbolType || 'infantry'}
                onChange={(e) => handleChange('symbolType', e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="air_defense">Air Defense (Arc Curve)</option>
                <option value="anti_tank">Anti-Tank / Anti-Armor (Chevron)</option>
                <option value="armor">Armor / Tank (Oval)</option>
                <option value="artillery">Artillery (Dot)</option>
                <option value="engineer">Engineer (Bridge)</option>
                <option value="infantry">Infantry (X)</option>
                <option value="mechanized_artillery">Mechanized Artillery (Oval + Dot)</option>
                <option value="recon">Reconnaissance (Slash)</option>
                <option value="rocket_artillery">Rocket Artillery (Dot + Arrow)</option>
                <option value="sof">Special Operation Forces (SOF)</option>
                <option value="supply">Supply (Horizontal Bar)</option>
                <option value="custom">Custom Image (Uploaded)</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          {tokenData.symbolType === 'custom' && (
            <div style={{ marginBottom: '0.5rem' }}>
              <label className="field-label">Upload Custom NATO Symbol Image</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '4px 10px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--accent-cyan)',
                    borderRadius: '4px',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('customNatoImage', e)}
                    style={{ display: 'none' }}
                  />
                  <span>📁 Browse NATO Symbol...</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: tokenData.customNatoImage ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {tokenData.customNatoImage ? 'Symbol image loaded' : 'No file chosen'}
                </span>
                {tokenData.customNatoImage && (
                  <button
                    type="button"
                    onClick={() => handleChange('customNatoImage', '')}
                    style={{ padding: '2px 7px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 'bold' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Echelon Selector */}
          <div style={{ marginBottom: '0.5rem' }}>
            <label className="field-label">Unit Size (Echelon Above Symbol)</label>
            <select
              value={tokenData.echelon || '••'}
              onChange={(e) => handleChange('echelon', e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="Ø">Fireteam ( Ø )</option>
              <option value="•">Squad / Sub-section ( • )</option>
              <option value="••">Section / Crew ( •• )</option>
              <option value="•••">Platoon / Troop ( ••• )</option>
              <option value="••••">Staffel / Echelon Group ( •••• )</option>
              <option value="I">Company / Battery / Flight ( I )</option>
              <option value="II">Battalion / Squadron ( II )</option>
              <option value="III">Regiment / Group ( III )</option>
              <option value="X">Brigade ( X )</option>
              <option value="XX">Division ( XX )</option>
              <option value="XXX">Corps ( XXX )</option>
              <option value="XXXX">Army ( XXXX )</option>
            </select>
          </div>

          {/* Stackable Modifiers */}
          <div>
            <label className="field-label">Stackable Modifiers</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {[
                { id: 'mountain', label: 'Mountain' },
                { id: 'airborne', label: 'Airborne' },
                { id: 'airmobile', label: 'Airmobile' },
                { id: 'tracked', label: 'Tracked' },
                { id: 'wheeled', label: 'Wheeled' },
                { id: 'amphibious', label: 'Amphibious' },
                { id: 'motorized', label: 'Motorized' },
                { id: 'ew', label: 'EW (Electronic Warfare)' },
                { id: 'light', label: 'Light (L)' }
              ].map((mod) => {
                const active = (tokenData.modifiers || []).includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleModifierToggle(mod.id)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      border: '1px solid var(--accent-blue)',
                      background: active ? 'var(--accent-blue)' : 'var(--input-bg)',
                      color: active ? '#ffffff' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {active ? `✓ ${mod.label}` : `+ ${mod.label}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. WEAPON DICE CONFIG */}
      <div className="tint-card tint-card-dice">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
          <h3 className="subsection-header">🎲 Weapon Dice & Attack Fields</h3>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setDiceCount(1)}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid var(--accent-blue)',
                background: tokenData.dice?.length === 1 ? 'var(--accent-blue)' : 'var(--input-bg)',
                color: tokenData.dice?.length === 1 ? '#ffffff' : 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.78rem'
              }}
            >
              1 Die
            </button>
            <button
              type="button"
              onClick={() => setDiceCount(2)}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid var(--accent-blue)',
                background: tokenData.dice?.length === 2 ? 'var(--accent-blue)' : 'var(--input-bg)',
                color: tokenData.dice?.length === 2 ? '#ffffff' : 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.78rem'
              }}
            >
              2 Dice
            </button>
          </div>
        </div>

        <p className="field-help-text">
          💡 Thick colored borders indicate un-interceptable attacks (e.g. unguided artillery, mortar rounds).
        </p>

        {tokenData.dice?.map((d, index) => (
          <div
            key={index}
            style={{
              padding: '0.65rem 0.8rem',
              background: 'var(--color-cell-bg)',
              borderRadius: '6px',
              border: '1px solid var(--color-cell-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '0.82rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ background: 'var(--accent-blue)', color: '#fff', padding: '1px 6px', borderRadius: '3px', fontSize: '0.72rem' }}>
                DIE #{index + 1}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              <div>
                <label className="field-label" style={{ fontSize: '0.75rem' }}>Shape / Attack Type</label>
                <select
                  value={d.type || 'red'}
                  onChange={(e) => handleDiceChange(index, 'type', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="red">Range Attack (Square)</option>
                  <option value="green">Melee Attack (Cut Corner)</option>
                  <option value="purple">Anti-Air (Inverted Pentagon)</option>
                  <option value="blue">Logistics / Support (Circle)</option>
                </select>
              </div>

              <div>
                <label className="field-label" style={{ fontSize: '0.75rem' }}>Big Value (1-20)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={d.bigValue ?? 10}
                  onChange={(e) => handleDiceChange(index, 'bigValue', parseInt(e.target.value) || 0)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="field-label" style={{ fontSize: '0.75rem' }}>Small Value (0-50 or ∞)</label>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <input
                    type="text"
                    value={d.smallValue ?? '0'}
                    onChange={(e) => handleDiceChange(index, 'smallValue', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDiceChange(index, 'smallValue', '∞')}
                    title="Set to infinity"
                    style={{ padding: '0 8px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #1e293b', background: '#1e293b', color: 'var(--accent-cyan)', fontWeight: 'bold' }}
                  >
                    ∞
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Die Color, Border & Number Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', alignItems: 'end', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '0.4rem' }}>
              <div>
                <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>Fill Color</label>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={d.color || (d.type === 'green' ? '#2e7d32' : d.type === 'purple' ? '#7b1fa2' : d.type === 'blue' ? '#1976d2' : '#c83232')}
                    onChange={(e) => handleDiceChange(index, 'color', e.target.value)}
                  />
                  <input
                    type="text"
                    value={d.color || (d.type === 'green' ? '#2e7d32' : d.type === 'purple' ? '#7b1fa2' : d.type === 'blue' ? '#1976d2' : '#c83232')}
                    onChange={(e) => handleDiceChange(index, 'color', e.target.value)}
                    style={{ width: '65px', fontSize: '0.75rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>Number / Text Color</label>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={d.numberColor || '#ffffff'}
                    onChange={(e) => handleDiceChange(index, 'numberColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={d.numberColor || '#ffffff'}
                    onChange={(e) => handleDiceChange(index, 'numberColor', e.target.value)}
                    style={{ width: '65px', fontSize: '0.75rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>Border Color</label>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={d.borderColor || (d.hasThickBorder ? '#ffcc00' : '#ffffff')}
                    onChange={(e) => handleDiceChange(index, 'borderColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={d.borderColor || (d.hasThickBorder ? '#ffcc00' : '#ffffff')}
                    onChange={(e) => handleDiceChange(index, 'borderColor', e.target.value)}
                    style={{ width: '65px', fontSize: '0.75rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', height: '32px' }}>
                  <input
                    type="checkbox"
                    checked={d.hasThickBorder || false}
                    onChange={(e) => handleDiceChange(index, 'hasThickBorder', e.target.checked)}
                  />
                  Thick Border (Non-Interceptable)
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
