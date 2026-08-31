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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Token Category */}
      <div>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
          Token Category
        </label>
        <select
          value={tokenData.category || 'land'}
          onChange={(e) => handleChange('category', e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="land">Land Unit</option>
          <option value="naval">Naval Unit</option>
          <option value="misc">Misc Token</option>
        </select>
      </div>

      {/* Colors Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
            Background Color
          </label>
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <input
              type="color"
              value={tokenData.bgColor || '#2b6cb0'}
              onChange={(e) => handleChange('bgColor', e.target.value)}
              style={{ width: '36px', height: '32px', border: 'none', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={tokenData.bgColor || '#2b6cb0'}
              onChange={(e) => handleChange('bgColor', e.target.value)}
              style={{ flex: 1, padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
            <button
              type="button"
              onClick={() => handleChange('bgColor', '#2b6cb0')}
              style={{ background: '#2b6cb0', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}
            >
              Blue
            </button>
            <button
              type="button"
              onClick={() => handleChange('bgColor', '#c83232')}
              style={{ background: '#c83232', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}
            >
              Red
            </button>
          </div>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
            Bottom Stripe
          </label>
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <input
              type="color"
              value={tokenData.stripeColor || '#ffffff'}
              onChange={(e) => handleChange('stripeColor', e.target.value)}
              style={{ width: '36px', height: '32px', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={tokenData.stripeColor || '#ffffff'}
              onChange={(e) => handleChange('stripeColor', e.target.value)}
              style={{ flex: 1, padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
            <button
              type="button"
              onClick={() => handleChange('stripeColor', '#ffffff')}
              style={{ fontSize: '10px', padding: '2px 5px', background: '#1e293b', color: '#9ca3af', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
            >
              Default
            </button>
          </div>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
            Movement Hex Color
          </label>
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <input
              type="color"
              value={tokenData.hexColor || '#7e8388'}
              onChange={(e) => handleChange('hexColor', e.target.value)}
              style={{ width: '36px', height: '32px', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={tokenData.hexColor || '#7e8388'}
              onChange={(e) => handleChange('hexColor', e.target.value)}
              style={{ flex: 1, padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
            <button
              type="button"
              onClick={() => handleChange('hexColor', '#7e8388')}
              style={{ fontSize: '10px', padding: '2px 5px', background: '#1e293b', color: '#9ca3af', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
            >
              Default
            </button>
          </div>
        </div>
      </div>

      {/* Font Family Selector */}
      <div>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
          Token Text Font
        </label>
        <select
          value={tokenData.fontFamily || "'Trebuchet MS', 'Arial Bold', sans-serif"}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="'Trebuchet MS', 'Arial Bold', sans-serif">Trebuchet / Bold Sans</option>
          <option value="'Oswald', 'Arial Narrow', sans-serif">Oswald / Condensed</option>
          <option value="system-ui, -apple-system, sans-serif">Inter / System Sans</option>
          <option value="'Courier New', monospace">Monospace</option>
          <option value="'Georgia', 'Times New Roman', serif">Serif</option>
        </select>
      </div>

      {/* Unit Name & Movement (For Land and Naval Tokens) */}
      {tokenData.category !== 'misc' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
              Unit Name / Designation
            </label>
            <input
              type="text"
              value={tokenData.unitName ?? '1-1 CHARLIE'}
              onChange={(e) => handleChange('unitName', e.target.value)}
              placeholder="e.g. 1-1 CHARLIE"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
              Movement Range
            </label>
            <input
              type="number"
              value={tokenData.movementRange ?? 3}
              onChange={(e) => handleChange('movementRange', parseInt(e.target.value) || 0)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>
      )}

      {/* Misc Token Controls */}
      {tokenData.category === 'misc' && (
        <div style={{ borderTop: '1px solid #1f293d', paddingTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h4 style={{ margin: 0, color: '#00f0ff' }}>Misc Token Controls</h4>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
              Misc Token Sub-Type
            </label>
            <select
              value={tokenData.miscType || 'task_force'}
              onChange={(e) => handleChange('miscType', e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="task_force">1. Task Force (Banner + Name)</option>
              <option value="text_number">2. Top Text + Center Number</option>
              <option value="text_image">3. Top Text + Center Image</option>
              <option value="image_number">4. Center Image + Top-Right Number</option>
            </select>
          </div>

          {tokenData.miscType === 'task_force' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem' }}>
                  Banner Title
                </label>
                <input
                  type="text"
                  value={tokenData.miscBannerText ?? 'TASK FORCE'}
                  onChange={(e) => handleChange('miscBannerText', e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem' }}>
                  Task Force Name
                </label>
                <input
                  type="text"
                  value={tokenData.unitName ?? 'NEW YORK'}
                  onChange={(e) => handleChange('unitName', e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem' }}>
                  Banner Color
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={tokenData.miscBannerColor || '#ffffff'}
                    onChange={(e) => handleChange('miscBannerColor', e.target.value)}
                    style={{ width: '36px', height: '32px', border: 'none', cursor: 'pointer' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('miscBannerColor', '#ffffff')}
                    style={{ padding: '3px 8px', fontSize: '11px', background: '#ffffff', color: '#000', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    White
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('miscBannerColor', '#facc15')}
                    style={{ padding: '3px 8px', fontSize: '11px', background: '#facc15', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Yellow
                  </button>
                </div>
              </div>
            </div>
          )}

          {(tokenData.miscType === 'text_number' || tokenData.miscType === 'text_image') && (
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem' }}>
                Top Text Label
              </label>
              <input
                type="text"
                value={tokenData.miscTopText ?? (tokenData.miscType === 'text_number' ? 'ISR' : 'MILDEC')}
                onChange={(e) => handleChange('miscTopText', e.target.value)}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          )}

          {(tokenData.miscType === 'text_number' || tokenData.miscType === 'image_number') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  Number (0-9)
                </label>
                {tokenData.miscType === 'image_number' && (
                  <label style={{ fontSize: '0.8rem', color: '#00f0ff', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={tokenData.miscNumberShow !== false}
                      onChange={(e) => handleChange('miscNumberShow', e.target.checked)}
                      style={{ marginRight: '4px' }}
                    />
                    Show Number
                  </label>
                )}
              </div>
              <input
                type="number"
                min="0"
                max="9"
                value={tokenData.miscNumber ?? 4}
                onChange={(e) => handleChange('miscNumber', parseInt(e.target.value) || 0)}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          )}

          {(tokenData.miscType === 'text_image' || tokenData.miscType === 'image_number') && (
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', color: '#00f0ff' }}>
                Center Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('customMiscImage', e)}
                style={{ width: '100%', padding: '0.3rem', borderRadius: '4px', background: '#0d1322', color: '#9ca3af' }}
              />
            </div>
          )}
        </div>
      )}

      {/* Reverse Face Image / Flag Controls */}
      <div style={{ borderTop: '1px solid #1f293d', paddingTop: '0.8rem' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', color: '#00f0ff' }}>
          Reverse Face (Back) Image / Flag
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <select
            value={tokenData.backFlag || 'none'}
            onChange={(e) => handleChange('backFlag', e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
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

          {tokenData.backFlag === 'custom' && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('customBackImage', e)}
              style={{ width: '100%', padding: '0.3rem', borderRadius: '4px', background: '#0d1322', color: '#9ca3af' }}
            />
          )}
        </div>
      </div>

      {/* Naval Ship Silhouette Custom Upload Controls */}
      {tokenData.category === 'naval' && (
        <div style={{ borderTop: '1px solid #1f293d', paddingTop: '0.8rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', color: '#00f0ff' }}>
            Naval Ship Silhouette Image
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('customShipImage', e)}
              style={{ flex: 1, padding: '0.3rem', borderRadius: '4px', background: '#0d1322', color: '#9ca3af' }}
            />
            {tokenData.customShipImage && (
              <button
                type="button"
                onClick={() => handleChange('customShipImage', '')}
                style={{ padding: '0.4rem 0.8rem', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Reset Default
              </button>
            )}
          </div>
        </div>
      )}

      {/* NATO Symbology Controls (For Land Units) */}
      {tokenData.category === 'land' && (
      <div style={{ borderTop: '1px solid #eee', paddingTop: '0.8rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2b6cb0' }}>NATO Joint Military Symbology</h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
              Affiliation (Frame)
            </label>
            <select
              value={tokenData.affiliation || 'friendly'}
              onChange={(e) => handleChange('affiliation', e.target.value)}
              style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="friendly">Friendly (Rectangle)</option>
              <option value="hostile">Hostile / Enemy (Diamond)</option>
              <option value="neutral">Neutral (Square)</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
              Unit Branch / Arm
            </label>
            <select
              value={tokenData.symbolType || 'infantry'}
              onChange={(e) => handleChange('symbolType', e.target.value)}
              style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
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
          <div style={{ marginBottom: '0.8rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: '#00f0ff' }}>
              Upload Custom NATO Symbol Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('customNatoImage', e)}
              style={{ width: '100%', padding: '0.3rem', borderRadius: '4px', background: '#0d1322', color: '#9ca3af' }}
            />
          </div>
        )}

        {/* Stackable Modifiers */}
        <div style={{ marginBottom: '0.8rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
            Stackable Modifiers
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
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
                    fontSize: '0.78rem',
                    border: '1px solid #2b6cb0',
                    background: active ? '#2b6cb0' : '#ffffff',
                    color: active ? '#ffffff' : '#2b6cb0',
                    cursor: 'pointer'
                  }}
                >
                  {active ? `✓ ${mod.label}` : `+ ${mod.label}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Echelon / Size Selector */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
            Unit Size (Echelon Above Symbol)
          </label>
          <select
            value={tokenData.echelon || '••'}
            onChange={(e) => handleChange('echelon', e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
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
      </div>
      )}

      {/* Weapon Dice Config */}
      <div style={{ borderTop: '1px solid #1f293d', paddingTop: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#00f0ff' }}>Weapon Dice / Fields</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setDiceCount(1)}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid #2b6cb0',
                background: tokenData.dice?.length === 1 ? '#2b6cb0' : '#fff',
                color: tokenData.dice?.length === 1 ? '#fff' : '#2b6cb0',
                cursor: 'pointer'
              }}
            >
              1 Die
            </button>
            <button
              type="button"
              onClick={() => setDiceCount(2)}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid #2b6cb0',
                background: tokenData.dice?.length === 2 ? '#2b6cb0' : '#fff',
                color: tokenData.dice?.length === 2 ? '#fff' : '#2b6cb0',
                cursor: 'pointer'
              }}
            >
              2 Dice
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '0 0 0.8rem 0', lineHeight: 1.3 }}>
          💡 <i>Note: Thick colored borders indicate an attack that cannot be intercepted (e.g. mortar rounds, unguided artillery, or non-interceptable missiles).</i>
        </p>

        {tokenData.dice?.map((d, index) => (
          <div
            key={index}
            style={{
              padding: '0.8rem',
              background: '#0d1322',
              borderRadius: '6px',
              marginBottom: '0.5rem',
              border: '1px solid #1f293d'
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#00f0ff' }}>
              Die #{index + 1}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem', color: '#9ca3af' }}>Shape / Attack Type</label>
                <select
                  value={d.type || 'red'}
                  onChange={(e) => handleDiceChange(index, 'type', e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #1f293d' }}
                >
                  <option value="red">Range Attack (Square)</option>
                  <option value="green">Melee Attack (Cut Corner Square)</option>
                  <option value="purple">Anti-Air (Inverted Pentagon)</option>
                  <option value="blue">Logistics / Support (Circle)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem', color: '#9ca3af' }}>Big Value (1-20)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={d.bigValue ?? 10}
                  onChange={(e) => handleDiceChange(index, 'bigValue', parseInt(e.target.value) || 0)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #1f293d' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem', color: '#9ca3af' }}>
                  Small Value (0-50 or ∞)
                </label>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <input
                    type="text"
                    value={d.smallValue ?? '0'}
                    onChange={(e) => handleDiceChange(index, 'smallValue', e.target.value)}
                    style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', border: '1px solid #1f293d' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDiceChange(index, 'smallValue', '∞')}
                    title="Set to infinity"
                    style={{ padding: '0 8px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #1f293d', background: '#1e293b', color: '#00f0ff' }}
                  >
                    ∞
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Die Color & Thick Non-Interceptable Border */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', marginTop: '0.6rem', borderTop: '1px dashed #1f293d', paddingTop: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '0.2rem', color: '#9ca3af' }}>
                  Die Fill Color
                </label>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={d.color || (d.type === 'green' ? '#2e7d32' : d.type === 'purple' ? '#7b1fa2' : d.type === 'blue' ? '#1976d2' : '#c83232')}
                    onChange={(e) => handleDiceChange(index, 'color', e.target.value)}
                    style={{ width: '32px', height: '28px', border: 'none', cursor: 'pointer' }}
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
                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '0.2rem', color: '#00f0ff', fontWeight: 'bold' }}>
                  Non-Interceptable Indicator (Thick Border)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.8rem', color: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
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
                      style={{ width: '30px', height: '26px', border: 'none', cursor: 'pointer' }}
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
