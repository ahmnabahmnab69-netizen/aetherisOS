import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  Bold, 
  DollarSign, 
  Percent, 
  Sigma, 
  Plus, 
  Trash2, 
  RotateCcw,
  Check,
  Search
} from 'lucide-react';
import { sound } from '../../utils/sound';

const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ROW_COUNT = 30;

interface CellData {
  value: string;
  formula?: string;
  bold?: boolean;
  align?: 'left' | 'center' | 'right';
  format?: 'standard' | 'currency' | 'percent';
}

export const ExcelApp: React.FC = () => {
  const [sheetTitle, setSheetTitle] = useState('Q4 Financial Ledger.xlsx');
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [formulaInput, setFormulaInput] = useState('');

  // Initial financial seed data
  const [cells, setCells] = useState<Record<string, CellData>>({
    'A1': { value: 'Department', bold: true },
    'B1': { value: 'Allocated Budget', bold: true, align: 'right' },
    'C1': { value: 'Q1 Spend', bold: true, align: 'right' },
    'D1': { value: 'Q2 Spend', bold: true, align: 'right' },
    'E1': { value: 'Q3 Spend', bold: true, align: 'right' },
    'F1': { value: 'Total Spend', bold: true, align: 'right' },

    'A2': { value: 'Liquid Compositor' },
    'B2': { value: '450000', format: 'currency', align: 'right' },
    'C2': { value: '110000', format: 'currency', align: 'right' },
    'D2': { value: '125000', format: 'currency', align: 'right' },
    'E2': { value: '140000', format: 'currency', align: 'right' },
    'F2': { value: '375000', formula: '=SUM(C2:E2)', format: 'currency', align: 'right', bold: true },

    'A3': { value: 'Optics & Shaders' },
    'B3': { value: '320000', format: 'currency', align: 'right' },
    'C3': { value: '75000', format: 'currency', align: 'right' },
    'D3': { value: '88000', format: 'currency', align: 'right' },
    'E3': { value: '92000', format: 'currency', align: 'right' },
    'F3': { value: '255000', formula: '=SUM(C3:E3)', format: 'currency', align: 'right', bold: true },

    'A4': { value: 'GNOME Shell Core' },
    'B4': { value: '280000', format: 'currency', align: 'right' },
    'C4': { value: '62000', format: 'currency', align: 'right' },
    'D4': { value: '71000', format: 'currency', align: 'right' },
    'E4': { value: '84000', format: 'currency', align: 'right' },
    'F4': { value: '217000', formula: '=SUM(C4:E4)', format: 'currency', align: 'right', bold: true },

    'A5': { value: 'Total Architecture', bold: true },
    'B5': { value: '1050000', formula: '=SUM(B2:B4)', format: 'currency', align: 'right', bold: true },
    'C5': { value: '247000', formula: '=SUM(C2:C4)', format: 'currency', align: 'right', bold: true },
    'D5': { value: '284000', formula: '=SUM(D2:D4)', format: 'currency', align: 'right', bold: true },
    'E5': { value: '316000', formula: '=SUM(E2:E4)', format: 'currency', align: 'right', bold: true },
    'F5': { value: '847000', formula: '=SUM(F2:F4)', format: 'currency', align: 'right', bold: true },
  });

  // Evaluate formula helper
  const evaluateCell = (cellId: string, visited = new Set<string>()): string => {
    const data = cells[cellId];
    if (!data) return '';
    if (!data.formula) return data.value || '';
    if (visited.has(cellId)) return '#CIRCULAR!';
    visited.add(cellId);

    const form = data.formula.trim().toUpperCase();

    // =SUM(A1:A5)
    const sumMatch = form.match(/^=SUM\(([A-H]\d+):([A-H]\d+)\)$/);
    if (sumMatch) {
      const startCol = sumMatch[1][0];
      const startRow = parseInt(sumMatch[1].slice(1), 10);
      const endCol = sumMatch[2][0];
      const endRow = parseInt(sumMatch[2].slice(1), 10);

      let sum = 0;
      const colStartIdx = COLUMNS.indexOf(startCol);
      const colEndIdx = COLUMNS.indexOf(endCol);

      for (let c = colStartIdx; c <= colEndIdx; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const cid = `${COLUMNS[c]}${r}`;
          const val = parseFloat(evaluateCell(cid, new Set(visited))) || 0;
          sum += val;
        }
      }
      return String(sum);
    }

    // =AVERAGE(A1:A5)
    const avgMatch = form.match(/^=AVERAGE\(([A-H]\d+):([A-H]\d+)\)$/);
    if (avgMatch) {
      const startCol = avgMatch[1][0];
      const startRow = parseInt(avgMatch[1].slice(1), 10);
      const endCol = avgMatch[2][0];
      const endRow = parseInt(avgMatch[2].slice(1), 10);

      let sum = 0;
      let count = 0;
      const colStartIdx = COLUMNS.indexOf(startCol);
      const colEndIdx = COLUMNS.indexOf(endCol);

      for (let c = colStartIdx; c <= colEndIdx; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const cid = `${COLUMNS[c]}${r}`;
          const val = parseFloat(evaluateCell(cid, new Set(visited)));
          if (!isNaN(val)) {
            sum += val;
            count++;
          }
        }
      }
      return count > 0 ? String(Math.round((sum / count) * 100) / 100) : '0';
    }

    // Direct arithmetic e.g. =A1+B1
    try {
      let expr = form.slice(1);
      // Replace cell IDs with values
      expr = expr.replace(/[A-H]\d+/g, (id) => {
        return evaluateCell(id, new Set(visited)) || '0';
      });
      if (/^[\d\s+\-*/().%]+$/.test(expr)) {
        // eslint-disable-next-line no-eval
        const res = Function(`"use strict"; return (${expr})`)();
        return String(res);
      }
    } catch {}

    return data.value || '';
  };

  const handleCellClick = (cellId: string) => {
    sound.playClick();
    setSelectedCell(cellId);
    const data = cells[cellId];
    setFormulaInput(data?.formula || data?.value || '');
  };

  const handleCellChange = (cellId: string, val: string) => {
    const isFormula = val.startsWith('=');
    setCells(prev => ({
      ...prev,
      [cellId]: {
        ...prev[cellId],
        formula: isFormula ? val : undefined,
        value: isFormula ? evaluateCell(cellId) : val,
      }
    }));
  };

  const handleFormulaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCellChange(selectedCell, formulaInput);
  };

  const toggleBold = () => {
    sound.playClick();
    setCells(prev => ({
      ...prev,
      [selectedCell]: {
        ...prev[selectedCell],
        bold: !prev[selectedCell]?.bold
      }
    }));
  };

  const setFormat = (fmt: 'currency' | 'percent' | 'standard') => {
    sound.playClick();
    setCells(prev => ({
      ...prev,
      [selectedCell]: {
        ...prev[selectedCell],
        format: fmt,
        align: 'right'
      }
    }));
  };

  const formatDisplay = (data?: CellData, rawVal?: string): string => {
    if (!data) return rawVal || '';
    const num = parseFloat(rawVal || data.value);
    if (isNaN(num)) return rawVal || data.value || '';

    if (data.format === 'currency') {
      return `$${num.toLocaleString()}`;
    }
    if (data.format === 'percent') {
      return `${(num * 100).toFixed(1)}%`;
    }
    return rawVal || data.value || '';
  };

  const handleExportCSV = () => {
    sound.playNotification();
    let csv = '';
    for (let r = 1; r <= 10; r++) {
      const row = COLUMNS.map(c => `"${evaluateCell(`${c}${r}`)}"`).join(',');
      csv += row + '\n';
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = sheetTitle.replace(/\.[^/.]+$/, '.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900/95 text-slate-100 select-none overflow-hidden">
      {/* Office Header Toolbar */}
      <header className="bg-slate-950/80 border-b border-white/10 p-2 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              X
            </div>
            <input
              type="text"
              value={sheetTitle}
              onChange={(e) => setSheetTitle(e.target.value)}
              className="bg-transparent border-none text-white font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 px-1 py-0.5 rounded w-60"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 rounded-md text-emerald-200 transition-colors font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Toolbar formatting */}
        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-xl text-xs overflow-x-auto">
          <button
            onClick={toggleBold}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setFormat('currency')}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
            title="Format as Currency ($)"
          >
            <DollarSign className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setFormat('percent')}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
            title="Format as Percentage (%)"
          >
            <Percent className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-white/15 mx-1" />
          <button
            onClick={() => {
              setFormulaInput(`=SUM(B2:B5)`);
              handleCellChange(selectedCell, `=SUM(B2:B5)`);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
          >
            <Sigma className="w-3.5 h-3.5" />
            <span>AutoSum</span>
          </button>
        </div>

        {/* Formula Bar */}
        <form onSubmit={handleFormulaSubmit} className="flex items-center gap-2 px-2">
          <div className="w-12 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center font-mono text-xs font-semibold text-emerald-300">
            {selectedCell}
          </div>
          <div className="text-slate-500 font-mono text-xs">fx</div>
          <input
            type="text"
            value={formulaInput}
            onChange={(e) => setFormulaInput(e.target.value)}
            onBlur={() => handleCellChange(selectedCell, formulaInput)}
            placeholder="Enter value or formula e.g. =SUM(A1:A5)"
            className="flex-1 h-7 rounded-lg bg-black/40 border border-white/15 px-3 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
          />
        </form>
      </header>

      {/* Grid Canvas */}
      <div className="flex-1 overflow-auto bg-slate-950 p-1">
        <table className="border-collapse w-full text-xs font-sans">
          <thead>
            <tr className="bg-slate-900 text-slate-400 sticky top-0 z-10">
              <th className="w-10 p-1.5 border border-white/10 text-center font-mono">#</th>
              {COLUMNS.map(col => (
                <th key={col} className="min-w-[110px] p-1.5 border border-white/10 text-center font-mono font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROW_COUNT }, (_, rIdx) => {
              const rowNum = rIdx + 1;
              return (
                <tr key={rowNum} className="hover:bg-white/[0.02]">
                  <td className="p-1 border border-white/10 text-center bg-slate-900/80 font-mono text-slate-500 text-[10px]">
                    {rowNum}
                  </td>
                  {COLUMNS.map(col => {
                    const cid = `${col}${rowNum}`;
                    const isSelected = selectedCell === cid;
                    const data = cells[cid];
                    const evaluated = evaluateCell(cid);
                    const formatted = formatDisplay(data, evaluated);

                    return (
                      <td
                        key={cid}
                        onClick={() => handleCellClick(cid)}
                        className={`p-1.5 border border-white/10 cursor-cell transition-colors min-w-[110px] truncate ${
                          isSelected
                            ? 'bg-emerald-500/20 ring-2 ring-emerald-400 text-white z-0'
                            : 'hover:bg-white/5 text-slate-200'
                        } ${data?.bold ? 'font-bold' : ''} ${
                          data?.align === 'right' ? 'text-right' : data?.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        <span className="font-mono tabular-nums">{formatted}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Spreadsheet Status Bar */}
      <footer className="h-7 bg-slate-950/80 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono tabular-nums">
        <div className="flex items-center gap-3">
          <span>Ready</span>
          <span>·</span>
          <span>Cell: {selectedCell}</span>
          <span>·</span>
          <span>Sheet 1</span>
        </div>
        <div className="text-emerald-400 font-medium">
          Aetheris Liquid Formula Engine
        </div>
      </footer>
    </div>
  );
};
