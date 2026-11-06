import React, { useState } from 'react';
import { 
  Kanban, 
  FileText, 
  CheckSquare, 
  Plus, 
  MoreHorizontal, 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  Sparkles,
  Trash2,
  Tag,
  Calendar,
  Layers
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface KanbanCard {
  id: string;
  title: string;
  tag: string;
  priority: 'High' | 'Med' | 'Low';
  column: 'backlog' | 'progress' | 'done';
}

interface WorkspacePage {
  id: string;
  title: string;
  icon: string;
  type: 'doc' | 'kanban';
  content?: string;
}

export const NotionApp: React.FC = () => {
  const [activePageId, setActivePageId] = useState<string>('page-roadmap');

  const [pages, setPages] = useState<WorkspacePage[]>([
    { id: 'page-roadmap', title: 'Sprint Roadmap', icon: '⚡', type: 'kanban' },
    { id: 'page-wiki', title: 'Engineering Constitution', icon: '📖', type: 'doc', content: `# Aetheris Engineering Constitution

### High Principles
- **Optical Authenticity**: Materials are rendered with multi-stage Gaussian diffusion and specular gradients.
- **Strict Anti-Slop**: No pill badge sandwiches, no fake terminal ping logs, no roleplay button jargon.
- **Ergonomics**: Full touch, stylus, and pointer physics across desktop window compositing.
` },
    { id: 'page-specs', title: 'Liquid Compositor Spec', icon: '💎', type: 'doc', content: `# Liquid Compositor v2.4

- Sub-pixel velocity integration
- Multi-point harmonic metaball potential field
- Dynamic caustic light dispersion
` },
    { id: 'page-meeting', title: 'All-Hands Notes', icon: '📝', type: 'doc', content: `# Executive All-Hands Notes

- [x] Integrate full GNOME shell paradigm
- [x] Add touch and finger window dragging
- [x] Ship Word, Excel, PowerPoint, and Notion suites
` },
  ]);

  // Kanban task cards
  const [cards, setCards] = useState<KanbanCard[]>([
    { id: 'c1', title: 'Deploy Liquid Compositor 60 FPS', tag: 'Core', priority: 'High', column: 'done' },
    { id: 'c2', title: 'GNOME Activities Overview Integration', tag: 'Shell', priority: 'High', column: 'done' },
    { id: 'c3', title: 'Universal Touch & Finger Dragging', tag: 'Input', priority: 'High', column: 'done' },
    { id: 'c4', title: 'Excel Dynamic Formula Engine', tag: 'Office', priority: 'Med', column: 'progress' },
    { id: 'c5', title: 'Keynote Fullscreen Presentation Engine', tag: 'Office', priority: 'Med', column: 'progress' },
    { id: 'c6', title: 'Cross-App Spatial Clipboard Drag & Drop', tag: 'UX', priority: 'Low', column: 'backlog' },
  ]);

  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [addingToCol, setAddingToCol] = useState<'backlog' | 'progress' | 'done' | null>(null);

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  // Drag and drop cards between Kanban columns
  const handleCardDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleCardDrop = (e: React.DragEvent, targetCol: 'backlog' | 'progress' | 'done') => {
    e.preventDefault();
    const cid = e.dataTransfer.getData('text/plain') || draggedCardId;
    if (cid) {
      sound.playClick();
      setCards(prev => prev.map(c => c.id === cid ? { ...c, column: targetCol } : c));
    }
    setDraggedCardId(null);
  };

  const handleAddCard = (col: 'backlog' | 'progress' | 'done') => {
    if (!newCardTitle.trim()) {
      setAddingToCol(null);
      return;
    }
    sound.playClick();
    const newCard: KanbanCard = {
      id: `c-${Date.now()}`,
      title: newCardTitle.trim(),
      tag: 'Task',
      priority: 'Med',
      column: col,
    };
    setCards(prev => [...prev, newCard]);
    setNewCardTitle('');
    setAddingToCol(null);
  };

  const handleCreatePage = (type: 'doc' | 'kanban') => {
    sound.playClick();
    const newPage: WorkspacePage = {
      id: `page-${Date.now()}`,
      title: type === 'kanban' ? 'Project Board' : 'Untitled Document',
      icon: type === 'kanban' ? '⚡' : '📄',
      type,
      content: type === 'doc' ? '# New Workspace Page\n\nBegin typing thoughts...' : undefined,
    };
    setPages(prev => [...prev, newPage]);
    setActivePageId(newPage.id);
  };

  return (
    <div className="flex h-full w-full bg-slate-950/90 text-slate-100 select-none overflow-hidden">
      {/* Notion Sidebar */}
      <aside className="w-56 border-r border-white/10 p-3 bg-white/[0.02] flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Aetheris Workspace</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCreatePage('doc')}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                title="New Document"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider px-2 mb-1.5">
            Pages & Boards
          </div>

          <div className="space-y-0.5">
            {pages.map(page => {
              const isSelected = page.id === activePageId;
              return (
                <button
                  key={page.id}
                  onClick={() => { sound.playClick(); setActivePageId(page.id); }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-white/15 text-white font-medium shadow-xs border border-white/10'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{page.icon}</span>
                    <span className="truncate">{page.title}</span>
                  </div>
                  {page.type === 'kanban' && (
                    <Kanban className="w-3 h-3 text-amber-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
          <span>Notion Workspace</span>
          <span className="font-mono">{pages.length} pages</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900/40">
        {/* Header */}
        <header className="h-12 border-b border-white/10 px-6 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="text-lg">{activePage.icon}</span>
            <h2 className="text-sm font-bold text-white tracking-tight">{activePage.title}</h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {activePage.type === 'kanban' ? (
              <span className="text-amber-300 font-medium bg-amber-500/10 border border-amber-400/20 px-2 py-0.5 rounded-full text-[11px]">
                Kanban Mode
              </span>
            ) : (
              <span className="text-sky-300 font-medium bg-sky-500/10 border border-sky-400/20 px-2 py-0.5 rounded-full text-[11px]">
                Modular Doc Mode
              </span>
            )}
          </div>
        </header>

        {/* Body Viewport */}
        <div className="flex-1 overflow-y-auto p-6">
          {activePage.type === 'kanban' ? (
            /* Kanban Board 3-column view */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full items-start">
              {[
                { id: 'backlog', title: 'To Do', color: 'border-slate-500/40 text-slate-300' },
                { id: 'progress', title: 'In Progress', color: 'border-amber-500/40 text-amber-300' },
                { id: 'done', title: 'Completed', color: 'border-emerald-500/40 text-emerald-300' },
              ].map(col => {
                const colCards = cards.filter(c => c.column === col.id);
                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleCardDrop(e, col.id as any)}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col min-h-[360px]"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                          {col.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-white/10 px-1.5 py-0.5 rounded-full">
                          {colCards.length}
                        </span>
                      </div>
                      <button
                        onClick={() => setAddingToCol(col.id as any)}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                        title="Add Task"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Cards list */}
                    <div className="space-y-2.5 flex-1">
                      {colCards.map(card => (
                        <div
                          key={card.id}
                          draggable
                          onDragStart={(e) => handleCardDragStart(e, card.id)}
                          className="p-3 rounded-xl bg-slate-900/90 border border-white/15 hover:border-white/30 shadow-md transition-all cursor-grab active:cursor-grabbing hover:-translate-y-0.5"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                            <span className="px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-mono">
                              {card.tag}
                            </span>
                            <span className={`font-semibold ${
                              card.priority === 'High' ? 'text-rose-400' : card.priority === 'Med' ? 'text-amber-400' : 'text-slate-400'
                            }`}>
                              {card.priority}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-100 leading-snug">
                            {card.title}
                          </p>
                        </div>
                      ))}

                      {/* Add new card inline form */}
                      {addingToCol === col.id && (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-400/40 shadow-lg space-y-2">
                          <input
                            type="text"
                            placeholder="Enter task title..."
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddCard(col.id as any);
                              if (e.key === 'Escape') setAddingToCol(null);
                            }}
                            autoFocus
                            className="w-full bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setAddingToCol(null)}
                              className="px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAddCard(col.id as any)}
                              className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-semibold text-[10px]"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Document View */
            <div className="max-w-2xl mx-auto space-y-4">
              <textarea
                value={activePage.content || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setPages(prev => prev.map(p => p.id === activePageId ? { ...p, content: val } : p));
                }}
                rows={18}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-sm text-slate-200 leading-relaxed font-sans focus:outline-none focus:border-white/25 resize-none shadow-inner"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
