import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { VirtualFile, WallpaperPreset } from '../../types/os';
import { sound } from '../../utils/sound';

interface TerminalAppProps {
  files: VirtualFile[];
  onUpdateFiles: (files: VirtualFile[]) => void;
  onSetWallpaper: (theme: WallpaperPreset) => void;
  onToggleSound: (enabled: boolean) => void;
}

interface CommandOutput {
  command: string;
  output: React.ReactNode;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ 
  files, 
  onUpdateFiles, 
  onSetWallpaper, 
  onToggleSound 
}) => {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'neofetch',
      output: (
        <div className="flex gap-6 py-2">
          <pre className="text-sky-400 font-mono text-xs leading-none select-none">
{`    .---.      
   /     \\     
  | () () |    
   \\  ^  /     
    |||||      
    '---'      
  A E T H E R  `}
          </pre>
          <div className="space-y-1 text-xs">
            <p className="text-white font-semibold">aetheris@liquid-os</p>
            <p className="text-slate-500">------------------</p>
            <p><span className="text-sky-400">OS:</span> Aetheris Liquid OS x86_64</p>
            <p><span className="text-sky-400">Kernel:</span> Vitreous Mach 6.4.2</p>
            <p><span className="text-sky-400">Compositor:</span> Liquid Refraction 60FPS</p>
            <p><span className="text-sky-400">Uptime:</span> 4 hours, 28 mins</p>
            <p><span className="text-sky-400">Memory:</span> 4.2 GiB / 16.0 GiB (26%)</p>
            <p><span className="text-sky-400">Shell:</span> lsh (liquid-shell) v1.2</p>
          </div>
        </div>
      )
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandList, setCommandList] = useState<string[]>(['neofetch']);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    sound.playClick();
    const parts = trimmed.split(' ');
    const root = parts[0].toLowerCase();
    const args = parts.slice(1);

    setCommandList(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    let outputNode: React.ReactNode = null;

    switch (root) {
      case 'help':
        outputNode = (
          <div className="space-y-1 text-xs text-slate-300">
            <p className="text-sky-400 font-medium">Available Commands:</p>
            <p><span className="font-mono text-white">neofetch</span> - System specs & ASCII banner</p>
            <p><span className="font-mono text-white">ls</span> - List files and directories</p>
            <p><span className="font-mono text-white">cat &lt;file&gt;</span> - Print contents of a file</p>
            <p><span className="font-mono text-white">mkdir &lt;name&gt;</span> - Create a new directory</p>
            <p><span className="font-mono text-white">touch &lt;name&gt;</span> - Create a new text file</p>
            <p><span className="font-mono text-white">rm &lt;name&gt;</span> - Remove file or directory</p>
            <p><span className="font-mono text-white">theme &lt;opaline|obsidian|amber|emerald|pearl&gt;</span> - Switch system wallpaper</p>
            <p><span className="font-mono text-white">calc &lt;math&gt;</span> - Evaluate arithmetic (e.g. calc 48 * 12)</p>
            <p><span className="font-mono text-white">date</span> - Print current timestamp</p>
            <p><span className="font-mono text-white">whoami</span> - Display current user identity</p>
            <p><span className="font-mono text-white">clear</span> - Clear terminal buffer</p>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'ls':
        outputNode = (
          <div className="grid grid-cols-3 gap-2 py-1 text-xs">
            {files.map(f => (
              <span key={f.id} className={f.type === 'folder' ? 'text-sky-400 font-semibold' : 'text-slate-300'}>
                {f.name}{f.type === 'folder' ? '/' : ''}
              </span>
            ))}
          </div>
        );
        break;

      case 'cat':
        if (!args[0]) {
          outputNode = <span className="text-rose-400">Usage: cat &lt;filename&gt;</span>;
        } else {
          const file = files.find(f => f.name.toLowerCase() === args[0].toLowerCase());
          if (file) {
            outputNode = <pre className="text-xs text-slate-300 whitespace-pre-wrap">{file.content || '(Empty file or binary format)'}</pre>;
          } else {
            outputNode = <span className="text-rose-400">File not found: {args[0]}</span>;
          }
        }
        break;

      case 'mkdir':
        if (!args[0]) {
          outputNode = <span className="text-rose-400">Usage: mkdir &lt;folder-name&gt;</span>;
        } else {
          const newFolder: VirtualFile = {
            id: `folder-${Date.now()}`,
            name: args[0],
            type: 'folder',
            parentId: null,
            size: '0 items',
            updatedAt: 'Just now',
          };
          onUpdateFiles([...files, newFolder]);
          outputNode = <span className="text-emerald-400">Created directory: {args[0]}</span>;
        }
        break;

      case 'touch':
        if (!args[0]) {
          outputNode = <span className="text-rose-400">Usage: touch &lt;filename&gt;</span>;
        } else {
          const newDoc: VirtualFile = {
            id: `doc-${Date.now()}`,
            name: args[0],
            type: 'document',
            parentId: null,
            size: '0.1 KB',
            updatedAt: 'Just now',
            content: '',
          };
          onUpdateFiles([...files, newDoc]);
          outputNode = <span className="text-emerald-400">Created file: {args[0]}</span>;
        }
        break;

      case 'rm':
        if (!args[0]) {
          outputNode = <span className="text-rose-400">Usage: rm &lt;filename&gt;</span>;
        } else {
          const target = files.find(f => f.name.toLowerCase() === args[0].toLowerCase());
          if (target) {
            onUpdateFiles(files.filter(f => f.id !== target.id));
            outputNode = <span className="text-emerald-400">Removed: {target.name}</span>;
          } else {
            outputNode = <span className="text-rose-400">No such file or directory: {args[0]}</span>;
          }
        }
        break;

      case 'theme':
        const themeMap: Record<string, WallpaperPreset> = {
          opaline: 'fluid-opaline',
          obsidian: 'deep-obsidian',
          amber: 'solstice-amber',
          emerald: 'boreal-emerald',
          pearl: 'crystal-pearl',
        };
        const choice = themeMap[args[0]?.toLowerCase()];
        if (choice) {
          onSetWallpaper(choice);
          outputNode = <span className="text-sky-300">Switched wallpaper theme to: {choice}</span>;
        } else {
          outputNode = <span className="text-rose-400">Usage: theme &lt;opaline|obsidian|amber|emerald|pearl&gt;</span>;
        }
        break;

      case 'calc':
        try {
          const expr = args.join(' ');
          // Safe arithmetic evaluation
          if (/^[\d\s+\-*/().%^]+$/.test(expr)) {
            // eslint-disable-next-line no-eval
            const res = Function(`"use strict"; return (${expr})`)();
            outputNode = <span className="text-emerald-300 font-mono tabular-nums">{expr} = {res}</span>;
          } else {
            outputNode = <span className="text-rose-400">Invalid mathematical characters</span>;
          }
        } catch {
          outputNode = <span className="text-rose-400">Error evaluating calculation</span>;
        }
        break;

      case 'whoami':
        outputNode = <span className="text-slate-300">aetheris-guest (UID: 1000, GID: 1000)</span>;
        break;

      case 'date':
        outputNode = <span className="text-slate-300 font-mono">{new Date().toString()}</span>;
        break;

      case 'neofetch':
        outputNode = (
          <div className="flex gap-6 py-2">
            <pre className="text-sky-400 font-mono text-xs leading-none select-none">
{`    .---.      
   /     \\     
  | () () |    
   \\  ^  /     
    |||||      
    '---'      
  A E T H E R  `}
            </pre>
            <div className="space-y-1 text-xs">
              <p className="text-white font-semibold">aetheris@liquid-os</p>
              <p className="text-slate-500">------------------</p>
              <p><span className="text-sky-400">OS:</span> Aetheris Liquid OS x86_64</p>
              <p><span className="text-sky-400">Kernel:</span> Vitreous Mach 6.4.2</p>
              <p><span className="text-sky-400">Compositor:</span> Liquid Refraction 60FPS</p>
              <p><span className="text-sky-400">Memory:</span> 4.2 GiB / 16.0 GiB (26%)</p>
            </div>
          </div>
        );
        break;

      default:
        outputNode = <span className="text-rose-400">Command not recognized: {root}. Type &apos;help&apos; for list.</span>;
        break;
    }

    setHistory(prev => [...prev, { command: trimmed, output: outputNode }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandList.length > 0) {
        const nextIdx = historyIndex === -1 ? commandList.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(commandList[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= commandList.length) {
          setHistoryIndex(-1);
          setInputVal('');
        } else {
          setHistoryIndex(nextIdx);
          setInputVal(commandList[nextIdx]);
        }
      }
    }
  };

  return (
    <div 
      onClick={() => document.getElementById('terminal-input')?.focus()}
      className="flex flex-col h-full w-full bg-slate-950/85 backdrop-blur-2xl text-slate-100 font-mono text-xs select-text p-4 overflow-y-auto"
    >
      <div className="space-y-3 flex-1">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-sky-400 font-semibold">aetheris@liquid:~$</span>
              <span className="text-white font-medium">{item.command}</span>
            </div>
            {item.output && <div className="pl-4 text-slate-300">{item.output}</div>}
          </div>
        ))}

        <div className="flex items-center gap-2 pt-1">
          <span className="text-sky-400 font-semibold shrink-0">aetheris@liquid:~$</span>
          <input
            id="terminal-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs caret-sky-400"
            spellCheck={false}
          />
        </div>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
