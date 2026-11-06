import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft, Calculator as CalcIcon } from 'lucide-react';
import { sound } from '../../utils/sound';

export const CalculatorApp: React.FC = () => {
  const [tab, setTab] = useState<'calc' | 'converter'>('calc');
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldReset, setShouldReset] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isScientific, setIsScientific] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Converter state
  const [convCategory, setConvCategory] = useState<'length' | 'weight' | 'temp' | 'data'>('data');
  const [convInput, setConvInput] = useState('1024');
  const [convFrom, setConvFrom] = useState('MB');
  const [convTo, setConvTo] = useState('GB');

  const handleNumber = (n: string) => {
    sound.playClick();
    if (display === '0' || shouldReset) {
      setDisplay(n);
      setShouldReset(false);
    } else {
      if (display.length < 12) setDisplay(display + n);
    }
  };

  const handleDecimal = () => {
    sound.playClick();
    if (shouldReset) {
      setDisplay('0.');
      setShouldReset(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOp = (op: string) => {
    sound.playClick();
    const curr = parseFloat(display);
    if (prevVal !== null && operation && !shouldReset) {
      const res = calculate(prevVal, curr, operation);
      setPrevVal(res);
      setDisplay(String(res));
      setHistory(h => [`${prevVal} ${operation} ${curr} = ${res}`, ...h.slice(0, 4)]);
    } else {
      setPrevVal(curr);
    }
    setOperation(op);
    setShouldReset(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      case '%': return (a * b) / 100;
      default: return b;
    }
  };

  const handleEqual = () => {
    sound.playClick();
    if (prevVal !== null && operation) {
      const curr = parseFloat(display);
      const res = calculate(prevVal, curr, operation);
      setHistory(h => [`${prevVal} ${operation} ${curr} = ${res}`, ...h.slice(0, 4)]);
      setDisplay(String(res));
      setPrevVal(null);
      setOperation(null);
      setShouldReset(true);
    }
  };

  const handleClear = () => {
    sound.playClick();
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
    setShouldReset(false);
  };

  const handleSciOp = (fn: string) => {
    sound.playClick();
    const curr = parseFloat(display);
    let res = 0;
    switch (fn) {
      case 'sin': res = Math.sin((curr * Math.PI) / 180); break;
      case 'cos': res = Math.cos((curr * Math.PI) / 180); break;
      case 'tan': res = Math.tan((curr * Math.PI) / 180); break;
      case 'sqrt': res = Math.sqrt(curr); break;
      case 'sq': res = curr * curr; break;
      case 'pi': res = Math.PI; break;
      default: break;
    }
    const cleanRes = Number(res.toFixed(6));
    setHistory(h => [`${fn}(${curr}) = ${cleanRes}`, ...h.slice(0, 4)]);
    setDisplay(String(cleanRes));
    setShouldReset(true);
  };

  // Memory keys
  const handleMemory = (mAction: 'MC' | 'MR' | 'M+' | 'M-') => {
    sound.playClick();
    const curr = parseFloat(display);
    switch (mAction) {
      case 'MC': setMemory(0); break;
      case 'MR': setDisplay(String(memory)); setShouldReset(true); break;
      case 'M+': setMemory(m => m + curr); setShouldReset(true); break;
      case 'M-': setMemory(m => m - curr); setShouldReset(true); break;
    }
  };

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Convert unit calculation
  const getConvertedVal = () => {
    const val = parseFloat(convInput) || 0;
    if (convCategory === 'data') {
      const units: Record<string, number> = { KB: 1, MB: 1024, GB: 1024 * 1024, TB: 1024 * 1024 * 1024 };
      const inKB = val * (units[convFrom] || 1);
      return (inKB / (units[convTo] || 1)).toFixed(3);
    }
    if (convCategory === 'temp') {
      if (convFrom === 'C' && convTo === 'F') return ((val * 9) / 5 + 32).toFixed(1);
      if (convFrom === 'F' && convTo === 'C') return (((val - 32) * 5) / 9).toFixed(1);
      return val.toFixed(1);
    }
    if (convCategory === 'length') {
      const units: Record<string, number> = { cm: 0.01, m: 1, km: 1000, inch: 0.0254, ft: 0.3048 };
      const inM = val * (units[convFrom] || 1);
      return (inM / (units[convTo] || 1)).toFixed(3);
    }
    return '0';
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950/80 backdrop-blur-xl text-slate-100 select-none p-4 justify-between">
      {/* Top Tab Switcher */}
      <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5 mb-2.5">
        <button
          onClick={() => { sound.playClick(); setTab('calc'); }}
          className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            tab === 'calc' ? 'bg-white/15 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CalcIcon className="w-3.5 h-3.5 text-sky-400" />
          <span>Calculator</span>
        </button>
        <button
          onClick={() => { sound.playClick(); setTab('converter'); }}
          className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            tab === 'converter' ? 'bg-white/15 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-300" />
          <span>Unit Converter</span>
        </button>
      </div>

      {tab === 'calc' ? (
        <>
          {/* Display Header */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-end text-right min-h-[95px] shadow-inner mb-2 relative group">
            <button
              onClick={handleCopy}
              className="absolute top-2 left-2 p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-opacity"
              title="Copy Result"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
            {memory !== 0 && (
              <span className="absolute top-2 right-2 text-[10px] font-mono text-amber-300 px-1 bg-amber-400/10 rounded">
                M
              </span>
            )}
            <div className="text-[11px] text-slate-400 font-mono space-y-0.5 overflow-hidden max-h-8">
              {history.map((h, i) => (
                <div key={i} className="truncate">{h}</div>
              ))}
            </div>
            <div className="text-3xl font-mono tabular-nums font-semibold tracking-tight text-white mt-1 overflow-x-auto whitespace-nowrap">
              {display}
            </div>
          </div>

          {/* Memory Bar */}
          <div className="grid grid-cols-4 gap-1.5 mb-1.5">
            {['MC', 'MR', 'M+', 'M-'].map((m) => (
              <button
                key={m}
                onClick={() => handleMemory(m as any)}
                className="py-1 text-[11px] font-mono bg-white/[0.04] hover:bg-white/10 border border-white/8 rounded-lg text-slate-300 transition-colors"
              >
                {m}
              </button>
            ))}
          </div>

          {/* Mode switch */}
          <div className="flex items-center justify-between mb-2 text-xs">
            <button
              onClick={() => { sound.playClick(); setIsScientific(!isScientific); }}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                isScientific ? 'bg-sky-500/20 border-sky-400/30 text-sky-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {isScientific ? 'Scientific' : 'Standard'}
            </button>
            <button onClick={() => { sound.playClick(); setHistory([]); }} className="text-slate-500 hover:text-slate-300 text-[10px]">
              Clear Tape
            </button>
          </div>

          {isScientific && (
            <div className="grid grid-cols-5 gap-1 mb-2">
              {['sin', 'cos', 'tan', 'sqrt', 'pi'].map((fn) => (
                <button
                  key={fn}
                  onClick={() => handleSciOp(fn)}
                  className="py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg text-sky-300 font-mono transition-colors"
                >
                  {fn}
                </button>
              ))}
            </div>
          )}

          {/* Main Keypad */}
          <div className="grid grid-cols-4 gap-2 flex-1">
            <button onClick={handleClear} className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-rose-300 font-medium text-sm transition-all active:scale-95">
              AC
            </button>
            <button onClick={() => { sound.playClick(); setDisplay(String(-parseFloat(display))); }} className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300 font-medium text-sm transition-all active:scale-95">
              ±
            </button>
            <button onClick={() => handleOp('%')} className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300 font-medium text-sm transition-all active:scale-95">
              %
            </button>
            <button onClick={() => handleOp('÷')} className={`rounded-xl border font-semibold text-base transition-all active:scale-95 ${operation === '÷' ? 'bg-sky-500 text-white border-sky-400' : 'bg-sky-500/20 hover:bg-sky-500/30 border-sky-400/30 text-sky-300'}`}>
              ÷
            </button>

            {['7', '8', '9'].map(n => (
              <button key={n} onClick={() => handleNumber(n)} className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white font-mono text-base transition-all active:scale-95">
                {n}
              </button>
            ))}
            <button onClick={() => handleOp('×')} className={`rounded-xl border font-semibold text-base transition-all active:scale-95 ${operation === '×' ? 'bg-sky-500 text-white border-sky-400' : 'bg-sky-500/20 hover:bg-sky-500/30 border-sky-400/30 text-sky-300'}`}>
              ×
            </button>

            {['4', '5', '6'].map(n => (
              <button key={n} onClick={() => handleNumber(n)} className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white font-mono text-base transition-all active:scale-95">
                {n}
              </button>
            ))}
            <button onClick={() => handleOp('-')} className={`rounded-xl border font-semibold text-base transition-all active:scale-95 ${operation === '-' ? 'bg-sky-500 text-white border-sky-400' : 'bg-sky-500/20 hover:bg-sky-500/30 border-sky-400/30 text-sky-300'}`}>
              −
            </button>

            {['1', '2', '3'].map(n => (
              <button key={n} onClick={() => handleNumber(n)} className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white font-mono text-base transition-all active:scale-95">
                {n}
              </button>
            ))}
            <button onClick={() => handleOp('+')} className={`rounded-xl border font-semibold text-base transition-all active:scale-95 ${operation === '+' ? 'bg-sky-500 text-white border-sky-400' : 'bg-sky-500/20 hover:bg-sky-500/30 border-sky-400/30 text-sky-300'}`}>
              +
            </button>

            <button onClick={() => handleNumber('0')} className="col-span-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white font-mono text-base transition-all active:scale-95">
              0
            </button>
            <button onClick={handleDecimal} className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white font-mono text-base transition-all active:scale-95">
              .
            </button>
            <button onClick={handleEqual} className="rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-base shadow-lg transition-all active:scale-95 border border-sky-300/30">
              =
            </button>
          </div>
        </>
      ) : (
        /* Practical Unit Converter */
        <div className="flex-1 flex flex-col space-y-4 pt-2">
          {/* Category Selector */}
          <div className="grid grid-cols-3 gap-1 text-xs">
            {[
              { id: 'data', label: 'Storage' },
              { id: 'length', label: 'Length' },
              { id: 'temp', label: 'Temperature' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setConvCategory(cat.id as any);
                  if (cat.id === 'data') { setConvFrom('MB'); setConvTo('GB'); }
                  if (cat.id === 'length') { setConvFrom('m'); setConvTo('ft'); }
                  if (cat.id === 'temp') { setConvFrom('C'); setConvTo('F'); }
                }}
                className={`py-1.5 rounded-lg border text-center transition-colors ${
                  convCategory === cat.id
                    ? 'bg-amber-500/20 border-amber-400/30 text-amber-200 font-medium'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Input & Unit selection */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Convert From</span>
            <div className="flex gap-2">
              <input
                type="number"
                value={convInput}
                onChange={(e) => setConvInput(e.target.value)}
                className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-base focus:outline-none focus:border-amber-400"
              />
              <select
                value={convFrom}
                onChange={(e) => setConvFrom(e.target.value)}
                className="bg-black/60 border border-white/15 rounded-xl px-2 text-white text-xs"
              >
                {convCategory === 'data' && ['KB', 'MB', 'GB', 'TB'].map(u => <option key={u} value={u}>{u}</option>)}
                {convCategory === 'length' && ['cm', 'm', 'km', 'inch', 'ft'].map(u => <option key={u} value={u}>{u}</option>)}
                {convCategory === 'temp' && ['C', 'F'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Converted Result</span>
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-amber-300 font-mono text-xl font-semibold overflow-x-auto">
                {getConvertedVal()}
              </div>
              <select
                value={convTo}
                onChange={(e) => setConvTo(e.target.value)}
                className="bg-black/60 border border-white/15 rounded-xl px-2 py-2 text-white text-xs"
              >
                {convCategory === 'data' && ['KB', 'MB', 'GB', 'TB'].map(u => <option key={u} value={u}>{u}</option>)}
                {convCategory === 'length' && ['cm', 'm', 'km', 'inch', 'ft'].map(u => <option key={u} value={u}>{u}</option>)}
                {convCategory === 'temp' && ['C', 'F'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
