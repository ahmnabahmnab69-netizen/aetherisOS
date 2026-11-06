import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Download, 
  Printer, 
  Save, 
  Table as TableIcon, 
  Highlighter, 
  Type, 
  Check, 
  FileText,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const WordApp: React.FC = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [docTitle, setDocTitle] = useState('Executive Strategy Document.docx');
  const [fontFamily, setFontFamily] = useState('Georgia, serif');
  const [fontSize, setFontSize] = useState('14pt');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isSaved, setIsSaved] = useState(true);
  const [wordCount, setWordCount] = useState(248);

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    sound.playClick();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    updateWordCount();
  };

  const updateWordCount = () => {
    setIsSaved(false);
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
      setTimeout(() => setIsSaved(true), 600);
    }
  };

  const handleInsertTable = () => {
    sound.playClick();
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Objective</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Timeline</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Liquid Compositor Deployment</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Q1 2026</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">High (60 FPS Optics)</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">GNOME Shell Integration</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Q2 2026</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Enterprise Standard</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, tableHtml);
    updateWordCount();
  };

  const handlePrint = () => {
    sound.playNotification();
    window.print();
  };

  const handleDownload = (format: 'html' | 'txt') => {
    sound.playNotification();
    if (!editorRef.current) return;
    const content = format === 'html' ? editorRef.current.innerHTML : editorRef.current.innerText;
    const mime = format === 'html' ? 'text/html' : 'text/plain';
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = docTitle.replace(/\.[^/.]+$/, `.${format}`);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900/90 text-slate-900 select-none overflow-hidden">
      {/* Office Ribbon Header */}
      <header className="bg-slate-950/70 border-b border-white/10 p-2 text-slate-100 flex flex-col gap-2 shrink-0">
        {/* Top File Title & Primary Actions */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              W
            </div>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="bg-transparent border-none text-white font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 px-1 py-0.5 rounded w-64"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleDownload('html')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-white/10 hover:bg-white/15 border border-white/15 rounded-md text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded-md text-white transition-colors font-medium shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Ribbon Tools Strip */}
        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-xl overflow-x-auto text-xs">
          {/* Font Family selector */}
          <select
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              executeCommand('fontName', e.target.value);
            }}
            className="bg-slate-800 border border-white/15 text-white text-xs rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="Georgia, serif">Georgia Serif</option>
            <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
            <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
            <option value="Times New Roman, serif">Times New Roman</option>
            <option value="Arial, sans-serif">Arial Standard</option>
          </select>

          {/* Font Size selector */}
          <select
            value={fontSize}
            onChange={(e) => {
              setFontSize(e.target.value);
              executeCommand('fontSize', e.target.value === '12pt' ? '3' : e.target.value === '18pt' ? '5' : '6');
            }}
            className="bg-slate-800 border border-white/15 text-white text-xs rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="12pt">12 pt</option>
            <option value="14pt">14 pt</option>
            <option value="18pt">18 pt</option>
            <option value="24pt">24 pt</option>
            <option value="32pt">32 pt</option>
          </select>

          <div className="w-[1px] h-5 bg-white/15 mx-1" />

          {/* Text Styling */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => executeCommand('bold')}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('italic')}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('underline')}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
              title="Underline"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('hiliteColor', '#fef08a')}
              className="p-1 rounded text-amber-300 hover:bg-white/10"
              title="Highlight"
            >
              <Highlighter className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-[1px] h-5 bg-white/15 mx-1" />

          {/* Alignment */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => executeCommand('justifyLeft')}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('justifyCenter')}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('justifyRight')}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('justifyFull')}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
              title="Justify"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-[1px] h-5 bg-white/15 mx-1" />

          {/* Insert Items */}
          <button
            onClick={handleInsertTable}
            className="flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
            title="Insert Table"
          >
            <TableIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Table</span>
          </button>
        </div>
      </header>

      {/* Main Document Workspace with Paper Canvas */}
      <div className="flex-1 bg-slate-900/60 overflow-y-auto p-8 flex justify-center">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            fontFamily,
          }}
          className="w-full max-w-[780px] min-h-[960px] bg-white text-slate-900 p-16 rounded-xl shadow-2xl transition-transform border border-slate-200 focus:outline-none select-text leading-relaxed"
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={updateWordCount}
            spellCheck={false}
            className="focus:outline-none min-h-[800px]"
            dangerouslySetInnerHTML={{
              __html: `
                <h1 style="font-size: 26pt; font-weight: bold; margin-bottom: 8px; color: #0f172a;">Executive Brief: Liquid Operating System Architecture</h1>
                <p style="color: #64748b; font-size: 11pt; margin-bottom: 24px;">CONFIDENTIAL · AETHERIS LABS · NOVEMBER 2026</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
                <h2 style="font-size: 16pt; font-weight: 600; color: #1e293b; margin-top: 16px;">1. Strategic Overview</h2>
                <p style="font-size: 11pt; line-height: 1.7; color: #334155; margin-bottom: 16px;">
                  The Aetheris Desktop Environment redefines virtual workstation ergonomics. By uniting an organic fluid physics canvas with optical glass materials and the GNOME Shell paradigm, users experience zero-latency multitasking without the cognitive fatigue of cluttered legacy interfaces.
                </p>
                <h2 style="font-size: 16pt; font-weight: 600; color: #1e293b; margin-top: 20px;">2. Architectural Milestones</h2>
                <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;">
                  <thead>
                    <tr style="background: #f8fafc;">
                      <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 10pt;">System Component</th>
                      <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 10pt;">Target Specification</th>
                      <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 10pt;">Readiness</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 10pt;">Liquid Compositor</td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 10pt;">60 FPS Real-time Refraction</td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 10pt; color: #16a34a; font-weight: 600;">Operational</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 10pt;">Touch & Pointer Physics</td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 10pt;">Universal 8-way Boundary Engine</td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 10pt; color: #16a34a; font-weight: 600;">Operational</td>
                    </tr>
                  </tbody>
                </table>
                <p style="font-size: 11pt; line-height: 1.7; color: #334155; margin-top: 16px;">
                  Begin typing anywhere on this page to edit your document, insert tables, and format rich prose...
                </p>
              `
            }}
          />
        </div>
      </div>

      {/* Word Status Bar */}
      <footer className="h-7 bg-slate-950/80 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <span>Page 1 of 1</span>
          <span>·</span>
          <span className="font-mono tabular-nums">{wordCount} words</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-slate-300">
            {isSaved ? <Check className="w-3 h-3 text-emerald-400" /> : null}
            <span>{isSaved ? 'Auto-saved' : 'Editing...'}</span>
          </span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(z => Math.max(70, z - 10))}
            className="hover:text-white"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="font-mono tabular-nums w-10 text-center">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel(z => Math.min(140, z + 10))}
            className="hover:text-white"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </footer>
    </div>
  );
};
