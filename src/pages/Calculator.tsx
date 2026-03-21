import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';

export const Calculator: React.FC = () => {
  const buttonValues = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['C']
  ];
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (value: string) => {
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '=') {
      try {
        // eslint-disable-next-line no-eval
        const evalResult = eval(input);
        setResult(evalResult.toString());
      } catch {
        setResult('Error');
      }
    } else {
      setInput(input + value);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement && (document.activeElement as HTMLElement).tagName === 'INPUT') return;
      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        setInput((prev) => prev + key);
      } else if (["+", "-", "*", "/", "."].includes(key)) {
        setInput((prev) => prev + key);
      } else if (key === 'Enter' || key === '=') {
        handleClick('=');
      } else if (key === 'Backspace') {
        setInput((prev) => prev.slice(0, -1));
      } else if (key.toLowerCase() === 'c') {
        handleClick('C');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  return (
    <Layout backNavigation="/" icon="🧮" title="Calculator">
      <div
        className="calculator-container"
        ref={containerRef}
        tabIndex={0}
        style={{ maxWidth: 320, margin: '2rem auto', padding: 24, borderRadius: 16, background: '#23272f', boxShadow: '0 4px 24px #0002' }}
      >
        <div style={{ marginBottom: 12, background: '#181a20', borderRadius: 8, padding: 12, color: '#fff', fontSize: 24, minHeight: 40 }}>
          {input || '0'}
          {/* Hidden input for mobile number keyboard */}
          <input
            type="number"
            inputMode="numeric"
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
            tabIndex={-1}
          />
        </div>
        <div style={{ marginBottom: 12, color: '#7fffd4', fontSize: 20, minHeight: 24 }}>
          {result}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {buttonValues.flat().map((val, idx) => (
            <button
              key={idx}
              style={{
                padding: '18px 0',
                fontSize: 18,
                borderRadius: 8,
                border: 'none',
                background: val === 'C' ? '#ff4d4f' : val === '=' ? '#52c41a' : '#2c2f36',
                color: '#fff',
                gridColumn: val === 'C' ? 'span 4' : undefined,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onClick={() => handleClick(val)}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Calculator;
