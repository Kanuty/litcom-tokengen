import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, HelpCircle, X, Check } from 'lucide-react';

export function CustomModal({
  isOpen,
  type = 'alert', // 'alert' or 'prompt'
  title = '',
  message = '',
  defaultValue = '',
  placeholder = '',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef(null);

  // Sync state when defaultValue or isOpen changes using prev prop tracking
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);

  if (isOpen !== prevIsOpen || defaultValue !== prevDefaultValue) {
    setPrevIsOpen(isOpen);
    setPrevDefaultValue(defaultValue);
    if (isOpen) {
      setInputValue(defaultValue);
    }
  }

  useEffect(() => {
    if (isOpen && type === 'prompt') {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (type === 'prompt') {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (onCancel) {
        onCancel();
      } else {
        onConfirm();
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        padding: '1rem'
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--panel-bg, #0d1527)',
          border: '2px solid var(--accent-cyan, #00f0ff)',
          borderRadius: '8px',
          boxShadow: '0 0 25px rgba(0,240,255,0.25)',
          color: 'var(--text-primary, #e2f1ff)',
          overflow: 'hidden'
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid var(--panel-border, #1b2a4a)',
            backgroundColor: 'rgba(0,240,255,0.05)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontWeight: 'bold',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontSize: '1rem',
              fontFamily: "'Teko', sans-serif",
              color: 'var(--accent-cyan, #00f0ff)'
            }}
          >
            {type === 'alert' ? (
              <AlertTriangle style={{ width: '20px', height: '20px', color: '#fbbf24', flexShrink: 0 }} />
            ) : (
              <HelpCircle style={{ width: '20px', height: '20px', color: 'var(--accent-cyan, #00f0ff)', flexShrink: 0 }} />
            )}
            <span>{title || (type === 'prompt' ? 'INPUT REQUIRED' : 'NOTIFICATION')}</span>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted, #94a3b8)',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}
              type="button"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          )}
        </div>

        {/* Content Body */}
        <form onSubmit={handleFormSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5, color: 'var(--text-primary, #ffffff)', whiteSpace: 'pre-wrap' }}>
            {message}
          </p>

          {type === 'prompt' && (
            <div>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: 'var(--input-bg, #060b14)',
                  border: '1px solid var(--panel-border, #1b2a4a)',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary, #ffffff)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.25rem' }}>
            {type === 'prompt' && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '0.45rem 1rem',
                  border: '1px solid var(--panel-border, #4b5563)',
                  backgroundColor: 'var(--input-bg, rgba(31, 41, 55, 0.6))',
                  color: 'var(--text-secondary, #d1d5db)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontFamily: "'Teko', sans-serif",
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                {cancelText}
              </button>
            )}
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 1.2rem',
                backgroundColor: 'var(--accent-cyan, #00f0ff)',
                color: 'var(--bg-dark, #000000)',
                border: 'none',
                fontWeight: 'bold',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontFamily: "'Teko', sans-serif",
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(0,240,255,0.3)'
              }}
            >
              <Check style={{ width: '16px', height: '16px', strokeWidth: 3 }} />
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
