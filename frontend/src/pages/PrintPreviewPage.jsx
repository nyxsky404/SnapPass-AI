import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import QuantityInput from '../components/QuantityInput';
import PrintButton from '../components/PrintButton';
import './PrintPreviewPage.css';
import EmptyState from '../components/EmptyState';
import { calculatePasswordStrength } from '../utils/passwordStrength';

/**
 * PrintPreviewPage — Step 3 & 4.
 * Shows the processed photo in a simulated A4 sheet grid.
 * User picks quantity, then downloads or prints the sheet.
 */
function PrintPreviewPage() {
  const { state } = useLocation();

  const [quantity, setQuantity] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');

  useEffect(() => {
  const timer = setTimeout(() => {
    const result =
      calculatePasswordStrength(password);

    setStrength(result.score);
    setStrengthLabel(result.label);
  }, 100);

  return () => clearTimeout(timer);
}, [password]);

  const handleGenerateSheet = async () => {
    setIsGenerating(true);

    // TODO: POST /api/print/generate-sheet { filename, quantity, photoSizePreset }
    // const res = await fetch('/api/print/generate-sheet', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ filename: state.filename, quantity, photoSizePreset: state.sizePreset }),
    // });
    // const blob = await res.blob();
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a'); a.href = url; a.download = 'snappass_sheet.png'; a.click();

    await new Promise((r) => setTimeout(r, 1200));
    setIsGenerating(false);
    alert('Sheet generation coming soon! Connect python-ai-service to complete this step.');
  };

  // Build grid of photo slots
  const slots = Array.from({ length: quantity });

  // If user lands here directly without uploading, redirect

  if (!state?.processedUrl) {
  return (
    <EmptyState
      title="No processed photo available"
      description="Upload and process a photo before accessing print preview."
      buttonText="Upload Photo"
    />
  );
}

  return (
    <div className="print-page page-content">
      <div className="print-page__header">
        <h1 className="section-title">Print Preview</h1>
        <p className="section-subtitle">
          Adjust quantity and generate your printable A4 sheet.
        </p>
      </div>

      <div className="print-page__layout">
        {/* A4 Sheet Preview */}
        <section className="print-page__sheet card" aria-label="A4 sheet preview">
          <p className="print-page__sheet-label">A4 Sheet Preview</p>
          <div className="sheet-grid" style={{ '--cols': Math.ceil(Math.sqrt(quantity)) }}>
            {slots.map((_, i) => (
              <div key={i} className="sheet-slot">
                <img
                  src={state.processedUrl}
                  alt={`Sheet slot ${i + 1}`}
                  className="sheet-slot__img"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Controls */}
        <aside className="print-page__controls card" aria-label="Print settings">
          <div>
            <p className="print-info-label">Selected Preset</p>
            <p className="print-info-value">{state.sizePreset || '35x45 mm'}</p>
          </div>
          <div>
            <p className="print-info-label">Background</p>
            <p className="print-info-value" style={{ textTransform: 'capitalize' }}>
              {state.background || 'White'}
            </p>
          </div>

          <hr className="divider" />

          <QuantityInput value={quantity} onChange={setQuantity} />

          <hr className="divider" />

          <div className="password-section">
  <label className="print-info-label">
    Secure Access Password
  </label>

  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter secure password"
    className="password-input"
  />

  <div className="password-meter">
    <div
      className={`password-meter__fill ${
        strength <= 1
          ? 'password-meter__fill--weak'
          : strength === 2
          ? 'password-meter__fill--medium'
          : strength === 3
          ? 'password-meter__fill--strong'
          : 'password-meter__fill--excellent'
      }`}
      style={{
        width: `${(strength / 4) * 100}%`,
      }}
    />
  </div>

  <span
    aria-live="polite"
    className={`password-feedback ${
      strength <= 1
        ? 'password-feedback--weak'
        : strength === 2
        ? 'password-feedback--medium'
        : strength === 3
        ? 'password-feedback--strong'
        : 'password-feedback--excellent'
    }`}
  >
    {strengthLabel}
  </span>
</div>

          <PrintButton
            onClick={handleGenerateSheet}
            isLoading={isGenerating}
            disabled={isGenerating || strength === 0}
          />

          <Link to="/editor" className="btn btn-ghost print-page__back-btn">
            ← Back to Editor
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default PrintPreviewPage;
