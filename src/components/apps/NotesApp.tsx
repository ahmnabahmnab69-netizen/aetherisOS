import React, { useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Heading1, 
  Heading2, 
  Code, 
  Quote, 
  Download, 
  Plus, 
  Check, 
  Eye, 
  Edit3, 
  Trash2,
  FileText,
  Search,
  BookOpen,
  Share2,
  FileCode
} from 'lucide-react';
import { VirtualFile } from '../../types/os';
import { sound } from '../../utils/sound';

interface NotesAppProps {
  initialFile?: VirtualFile;
  files: VirtualFile[];
  onUpdateFiles: (files: VirtualFile[]) => void;
}

export const NotesApp: React.FC<NotesAppProps> = ({ initialFile, files, onUpdateFiles }) => {
  const noteFiles = files.filter(f => f.type === 'document');
  const [activeFileId, setActiveFileId] = useState<string>(
    initialFile?.id || noteFiles[0]?.id || 'doc-new'
  );
  const activeFile = files.find(f => f.id === activeFileId) || {
    id: 'doc-new',
    name: 'Untitled.md',
    type: 'document' as const,
    parentId: null,
    size: '0 KB',
    updatedAt: 'Just now',
    content: '# Welcome to Liquid Notes\n\n- [ ] Draft system documentation\n- [x] Refine liquid glass materials\n- [ ] Test drag and drop physics',
    tags: ['general']
  };

  const [title, setTitle] = useState(activeFile.name);
  const [content, setContent] = useState(activeFile.content || '');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [searchInNote, setSearchInNote] = useState('');

  // Sync when active file changes
  useEffect(() => {
    const f = files.find(item => item.id === activeFileId);
    if (f) {
      setTitle(f.name);
      setContent(f.content || '');
      setIsSaved(true);
    }
  }, [activeFileId, files]);

  const handleContentChange = (newVal: string) => {
    setContent(newVal);
    setIsSaved(false);

    const updated = files.map(f => {
      if (f.id === activeFileId) {
        return {
          ...f,
          content: newVal,
          size: `${(new Blob([newVal]).size / 1024).toFixed(1)} KB`,
          updatedAt: 'Just now',
        };
      }
      return f;
    });
    onUpdateFiles(updated);
    setTimeout(() => setIsSaved(true), 400);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const updated = files.map(f => {
      if (f.id === activeFileId) {
        return { ...f, name: newTitle.endsWith('.md') ? newTitle : `${newTitle}.md` };
      }
      return f;
    });
    onUpdateFiles(updated);
  };

  const handleCreateNew = () => {
    sound.playClick();
    const newDoc: VirtualFile = {
      id: `doc-${Date.now()}`,
      name: `Document ${noteFiles.length + 1}.md`,
      type: 'document',
      parentId: null,
      size: '0.1 KB',
      updatedAt: 'Just now',
      content: '# New Document\n\n- [ ] Task 1\n- [ ] Task 2',
      tags: ['notes'],
    };
    onUpdateFiles([...files, newDoc]);
    setActiveFileId(newDoc.id);
  };

  // Interactive Checklist Toggle in Markdown
  const toggleChecklistLine = (lineIndex: number) => {
    sound.playClick();
    const lines = content.split('\n');
    const target = lines[lineIndex];
    if (target.includes('- [ ] ')) {
      lines[lineIndex] = target.replace('- [ ] ', '- [x] ');
    } else if (target.includes('- [x] ')) {
      lines[lineIndex] = target.replace('- [x] ', '- [ ] ');
    }
    handleContentChange(lines.join('\n'));
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    sound.playClick();
    const textarea = document.getElementById('note-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selText = content.substring(start, end) || 'item';
    const replacement = `${prefix}${selText}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    
    handleContentChange(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selText.length);
    }, 10);
  };

  const handleExport = (format: 'md' | 'txt' | 'html') => {
    sound.playNotification();
    let exportContent = content;
    let mime = 'text/markdown';
    let ext = 'md';

    if (format === 'txt') {
      mime = 'text/plain';
      ext = 'txt';
    } else if (format === 'html') {
      mime = 'text/html';
      ext = 'html';
      exportContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:sans-serif;max-width:700px;margin:40px auto;line-height:1.6;color:#222;}</style></head><body><h1>${title}</h1><pre>${content}</pre></body></html>`;
    }

    const blob = new Blob([exportContent], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\.[^/.]+$/, '')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Metrics
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;
  const readingTime = Math.ceil(words / 200);

  return (
    <div className="flex h-full w-full bg-slate-950/75 backdrop-blur-xl text-slate-100 select-none overflow-hidden">
      {/* Sidebar List */}
      <aside className="w-56 border-r border-white/10 flex flex-col p-3 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold tracking-wide text-slate-300">Notes & Specs</span>
          <button
            onClick={handleCreateNew}
            className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Create New Note"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {noteFiles.map((note) => {
            const isSelected = note.id === activeFileId;
            return (
              <button
                key={note.id}
                onClick={() => { sound.playClick(); setActiveFileId(note.id); }}
                className={`w-full text-left p-2.5 rounded-lg transition-all flex flex-col gap-0.5 ${
                  isSelected
                    ? 'bg-white/15 text-white shadow-xs border border-white/15'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-medium truncate">{note.name.replace(/\.md$/, '')}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 px-5 font-mono tabular-nums">
                  <span>{note.updatedAt}</span>
                  <span>{note.size}</span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Editor Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <header className="h-12 border-b border-white/10 px-4 flex items-center justify-between gap-3 bg-white/[0.03]">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-white/20 px-1.5 py-0.5 rounded w-full truncate"
              placeholder="Document Title"
            />
          </div>

          {/* Practical Formatting tools */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => insertFormatting('# ', '')}
              className="p-1 rounded text-slate-300 hover:bg-white/10 hover:text-white"
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('## ', '')}
              className="p-1 rounded text-slate-300 hover:bg-white/10 hover:text-white"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-white/15 mx-0.5" />
            <button
              onClick={() => insertFormatting('**', '**')}
              className="p-1 rounded text-slate-300 hover:bg-white/10 hover:text-white"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('*', '*')}
              className="p-1 rounded text-slate-300 hover:bg-white/10 hover:text-white"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('- [ ] ', '')}
              className="p-1 rounded text-slate-300 hover:bg-white/10 hover:text-white"
              title="Interactive Checklist"
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-300" />
            </button>
            <button
              onClick={() => insertFormatting('- ', '')}
              className="p-1 rounded text-slate-300 hover:bg-white/10 hover:text-white"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('```\n', '\n```')}
              className="p-1 rounded text-slate-300 hover:bg-white/10 hover:text-white"
              title="Code Block"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('> ', '')}
              className="p-1 rounded text-slate-300 hover:bg-white/10 hover:text-white"
              title="Quote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { sound.playClick(); setIsPreview(!isPreview); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-colors ${
                isPreview 
                  ? 'bg-amber-500/20 border-amber-400/30 text-amber-200' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isPreview ? 'Edit Mode' : 'Interactive Preview'}</span>
            </button>

            {/* Export format buttons */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-md p-0.5">
              <button
                onClick={() => handleExport('md')}
                className="px-2 py-0.5 text-[11px] rounded text-slate-300 hover:text-white hover:bg-white/10"
                title="Export Markdown"
              >
                MD
              </button>
              <button
                onClick={() => handleExport('txt')}
                className="px-2 py-0.5 text-[11px] rounded text-slate-300 hover:text-white hover:bg-white/10"
                title="Export Plain Text"
              >
                TXT
              </button>
              <button
                onClick={() => handleExport('html')}
                className="px-2 py-0.5 text-[11px] rounded text-slate-300 hover:text-white hover:bg-white/10"
                title="Export HTML"
              >
                HTML
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          {isPreview ? (
            <article className="prose prose-invert max-w-2xl text-slate-200 space-y-3">
              {content.split('\n').map((line, idx) => {
                if (line.startsWith('# ')) {
                  return <h1 key={idx} className="text-2xl font-bold text-white tracking-tight">{line.replace('# ', '')}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={idx} className="text-xl font-semibold text-white tracking-tight mt-4">{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={idx} className="text-base font-semibold text-amber-300 mt-2">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('> ')) {
                  return <blockquote key={idx} className="pl-4 border-l-2 border-amber-400 text-slate-300 italic my-2">{line.replace('> ', '')}</blockquote>;
                }
                // Interactive Checklist item
                if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
                  const isChecked = line.startsWith('- [x] ');
                  const label = line.replace(/^- \[( |x)\] /, '');
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleChecklistLine(idx)}
                      className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleChecklistLine(idx)}
                        className="accent-amber-400 w-4 h-4 rounded cursor-pointer"
                      />
                      <span className={`text-sm ${isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {label}
                      </span>
                    </div>
                  );
                }
                if (line.startsWith('- ')) {
                  return <li key={idx} className="ml-4 list-disc text-slate-300 text-sm">{line.replace('- ', '')}</li>;
                }
                if (line.startsWith('```')) {
                  return null;
                }
                if (!line.trim()) {
                  return <div key={idx} className="h-2" />;
                }
                return <p key={idx} className="text-sm text-slate-300 leading-relaxed">{line}</p>;
              })}
            </article>
          ) : (
            <textarea
              id="note-textarea"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Begin typing prose, markdown, or checklists here..."
              className="w-full flex-1 bg-transparent text-slate-200 text-sm leading-relaxed resize-none focus:outline-none placeholder-slate-600 font-sans tracking-wide"
              spellCheck={false}
            />
          )}
        </div>

        {/* Word Count & Reading Time Footer */}
        <footer className="h-7 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-slate-400 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-400">
              {isSaved ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Auto-saved</span>
                </>
              ) : (
                <span>Writing...</span>
              )}
            </span>
            <span>·</span>
            <span className="font-mono tabular-nums">{words} words</span>
            <span>·</span>
            <span className="font-mono tabular-nums">{chars} characters</span>
            <span>·</span>
            <span className="font-mono tabular-nums">{readingTime} min read</span>
          </div>
          <span className="text-slate-500 font-mono">Prose Engine</span>
        </footer>
      </div>
    </div>
  );
};
