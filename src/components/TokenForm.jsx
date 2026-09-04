import React from 'react';

export function TokenForm({ tokenData, onChange }) {
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
      {/* 1. CATEGORY & FONT STYLING */}
      <div className="tint-card tint-card-attributes">
        <h3 className="subsection-header">🏷️ Token Category & Typography</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'start' }}>
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

          <div>
            <label className="field-label">Token Text Font</label>
            <select
              value={tokenData.fontFamily || "'Trebuchet MS', 'Arial Bold', sans-serif"}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="'Trebuchet MS', 'Arial Bold', sans-serif">Trebuchet / Bold Sans</option>
              <option value="'Oswald', 'Arial Narrow', sans-serif">Oswald / Condensed</option>
              <option value="system-ui, -apple-system, sans-serif">Inter / System Sans</option>
              <option value="'Courier New', monospace">Monospace</option>
              <option value="'Georgia', 'Times New Roman', serif">Serif</option>
            </select>
          </div>

          <div>
            <label className="field-label">Global Text Color</label>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <input
                type="color"
                value={tokenData.textColor || '#ffffff'}
                onChange={(e) => handleChange('textColor', e.target.value)}
                title="Choose Text Color"
              />
              <input
                type="text"
                value={tokenData.textColor || '#ffffff'}
                onChange={(e) => handleChange('textColor', e.target.value)}
                style={{ width: '75px' }}
              />
              <button
                type="button"
                onClick={() => handleChange('textColor', '#ffffff')}
                style={{ padding: '3px 8px', fontSize: '11px', background: '#ffffff', color: '#000000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                White
              </button>
              <button
                type="button"
                onClick={() => handleChange('textColor', '#facc15')}
                style={{ padding: '3px 8px', fontSize: '11px', background: '#facc15', color: '#000000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Yellow
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CARD BASE & ACCENT COLORS */}
      <div className="tint-card tint-card-colors">
        <h3 className="subsection-header">🎨 Colors & Background Styling</h3>

        <div className="color-picker-grid-3">
          <div className="color-cell">
            <span className="cell-label">Background Color</span>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
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
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
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
            </div>
          </div>

          <div className="color-cell">
            <span className="cell-label">Bottom Stripe</span>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
              <input
                type="color"
                value={tokenData.stripeColor || '#ffffff'}
                onChange={(e) => handleChange('stripeColor', e.target.value)}
              />
              <input
                type="text"
                value={tokenData.stripeColor || '#ffffff'}
                onChange={(e) => handleChange('stripeColor', e.target.value)}
                style={{ width: '70px', fontSize: '0.78rem' }}
              />
            </div>
            <button
              type="button"
              onClick={() => handleChange('stripeColor', '#ffffff')}
              style={{ fontSize: '10px', padding: '2px 6px', background: '#1e293b', color: '#9ca3af', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '0.3rem' }}
            >
              Default (White)
            </button>
          </div>

          <div className="color-cell">
            <span className="cell-label">Movement Hex Color</span>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
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
            <button
              type="button"
              onClick={() => handleChange('hexColor', '#7e8388')}
              style={{ fontSize: '10px', padding: '2px 6px', background: '#1e293b', color: '#9ca3af', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '0.3rem' }}
            >
              Default (Gray)
            </button>
          </div>
        </div>
      </div>

      {/* 3. UNIT NAME & MOVEMENT (Or MISC TOKEN CONTROLS) */}
      {tokenData.category !== 'misc' ? (
        <div className="tint-card tint-card-text">
          <h3 className="subsection-header">📝 Unit Identification & Movement</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
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
          </div>
        </div>
      ) : (
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('customMiscImage', e)}
                  style={{ width: '100%', fontSize: '0.8rem', color: 'var(--text-muted)' }}
                />
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
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('customNatoImage', e)}
                style={{ width: '100%', fontSize: '0.8rem', color: 'var(--text-muted)' }}
              />
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
                      background: active ? 'var(--accent-blue)' : '#0d1322',
                      color: active ? '#ffffff' : 'var(--accent-sky)',
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

      {/* 5. REVERSE FACE FLAG & NAVAL CUSTOMS */}
      <div className="tint-card tint-card-colors">
        <h3 className="subsection-header">🚩 Reverse Face Image & Flag</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <div>
            <label className="field-label">Backside Flag</label>
            <select
              value={tokenData.backFlag || 'none'}
              onChange={(e) => handleChange('backFlag', e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="none">None (Solid Background)</option>
              <option value="australia">Australia Flag</option>
              <option value="belarus">Belarus Flag</option>
              <option value="belgium">Belgium Flag</option>
              <option value="china">China Flag</option>
              <option value="belarus_democratic">Democratic Belarus Flag</option>
              <option value="denmark">Denmark Flag</option>
              <option value="estonia">Estonia Flag</option>
              <option value="ue">EU / UE Flag</option>
              <option value="finland">Finland Flag</option>
              <option value="france">France Flag</option>
              <option value="germany">Germany Flag</option>
              <option value="great_britain">Great Britain Flag</option>
              <option value="greece">Greece Flag</option>
              <option value="italy">Italy Flag</option>
              <option value="japan">Japan Flag</option>
              <option value="latvia">Latvia Flag</option>
              <option value="lithuania">Lithuania Flag</option>
              <option value="nato">NATO Flag</option>
              <option value="netherlands">Netherlands Flag</option>
              <option value="north_korea">North Korea Flag</option>
              <option value="norway">Norway Flag</option>
              <option value="poland">Poland Flag</option>
              <option value="russia">Russia Flag</option>
              <option value="south_korea">South Korea Flag</option>
              <option value="sweden">Sweden Flag</option>
              <option value="taiwan">Taiwan Flag</option>
              <option value="turkey">Turkey Flag</option>
              <option value="ukraine">Ukraine Flag</option>
              <option value="usa">USA Flag</option>
              <option value="vietnam">Vietnam Flag</option>
              <option value="custom">Custom Uploaded Image</option>
            </select>
          </div>

          {tokenData.backFlag === 'custom' && (
            <div>
              <label className="field-label">Custom Backside Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('customBackImage', e)}
                style={{ width: '100%', fontSize: '0.8rem', color: 'var(--text-muted)' }}
              />
            </div>
          )}

          {tokenData.category === 'naval' && (
            <div>
              <label className="field-label">Naval Ship Silhouette</label>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('customShipImage', e)}
                  style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text-muted)' }}
                />
                {tokenData.customShipImage && (
                  <button
                    type="button"
                    onClick={() => handleChange('customShipImage', '')}
                    style={{ padding: '0.35rem 0.6rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. WEAPON DICE CONFIG */}
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
                background: tokenData.dice?.length === 1 ? 'var(--accent-blue)' : '#0d1322',
                color: tokenData.dice?.length === 1 ? '#ffffff' : 'var(--accent-sky)',
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
                background: tokenData.dice?.length === 2 ? 'var(--accent-blue)' : '#0d1322',
                color: tokenData.dice?.length === 2 ? '#ffffff' : 'var(--accent-sky)',
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
              background: 'rgba(10, 14, 23, 0.7)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
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

            {/* Custom Die Color & Border Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', alignItems: 'center', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '0.4rem' }}>
              <div>
                <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>Fill Color</label>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={d.color || (d.type === 'green' ? '#2e7d32' : d.type === 'purple' ? '#7b1fa2' : d.type === 'blue' ? '#1976d2' : '#c83232')}
                    onChange={(e) => handleDiceChange(index, 'color', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDiceChange(index, 'color', '')}
                    style={{ fontSize: '10px', padding: '2px 5px', background: '#1e293b', color: '#9ca3af', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Default
                  </button>
                </div>
              </div>

              <div>
                <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                  Non-Interceptable Indicator
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.78rem', color: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <input
                      type="checkbox"
                      checked={d.hasThickBorder || false}
                      onChange={(e) => handleDiceChange(index, 'hasThickBorder', e.target.checked)}
                    />
                    Thick Border
                  </label>
                  {d.hasThickBorder && (
                    <input
                      type="color"
                      value={d.borderColor || '#ffcc00'}
                      onChange={(e) => handleDiceChange(index, 'borderColor', e.target.value)}
                      title="Border Color"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
