import React, { useState } from 'react';
import { TokenForm } from './components/TokenForm';
import { TokenPreview } from './components/TokenPreview';
import { downloadTokenAsPNG, generatePrintablePDF } from './utils/export';
import './App.css';

function App() {
  const [tokenData, setTokenData] = useState({
    category: 'land',
    bgColor: '#2b6cb0',
    stripeColor: '#ffffff',
    hexColor: '#7e8388',
    fontFamily: "'Trebuchet MS', 'Arial Bold', sans-serif",
    echelon: '••',
    affiliation: 'friendly',
    symbolType: 'infantry',
    modifiers: [],
    movementRange: 3,
    unitName: '1-1 CHARLIE',
    dice: [
      { type: 'red', bigValue: 10, smallValue: '4' },
      { type: 'red', bigValue: 12, smallValue: '9' }
    ]
  });

  const [exportFace, setExportFace] = useState('both');

  const handleDownloadPNG = () => {
    const name = tokenData.unitName || 'token';
    if (exportFace === 'front' || exportFace === 'both') {
      downloadTokenAsPNG('token-preview-front', `${name}-front.png`);
    }
    if (exportFace === 'back' || exportFace === 'both') {
      // Small delay if downloading both to allow separate downloads
      setTimeout(() => {
        downloadTokenAsPNG('token-preview-back', `${name}-back.png`);
      }, exportFace === 'both' ? 300 : 0);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Littoral Commander Token Generator</h1>
        <p>For rapid design of custom tokens</p>
      </header>

      <main className="app-main">
        <section className="form-section">
          <h2>Token Attributes</h2>
          <TokenForm tokenData={tokenData} onChange={setTokenData} />
        </section>

        <section className="preview-section">
          <TokenPreview
            tokenData={tokenData}
            onChange={setTokenData}
            exportFace={exportFace}
            onExportFaceChange={setExportFace}
            onDownloadPNG={handleDownloadPNG}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
