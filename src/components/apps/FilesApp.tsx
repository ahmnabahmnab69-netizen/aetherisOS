import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Code as CodeIcon, 
  Trash2, 
  Search, 
  LayoutGrid, 
  List, 
  Plus, 
  ChevronRight, 
  Upload, 
  RotateCcw,
  HardDrive,
  Edit2,
  Check,
  X,
  FileCode,
  FilePlus,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { VirtualFile, FileType } from '../../types/os';
import { sound } from '../../utils/sound';

interface FilesAppProps {
  files: VirtualFile[];
  onUpdateFiles: (files: VirtualFile[]) => void;
  onOpenFile: (file: VirtualFile) => void;
}

export const FilesApp: React.FC<FilesAppProps> = ({ files, onUpdateFiles, onOpenFile }) => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [isTrashView, setIsTrashView] = useState(false);
  const [trashFiles, setTrashFiles] = useState<VirtualFile[]>([]);
  
  // Drag and drop states
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null);
  const [dragOverTargetId, setDragOverTargetId] = useState<string | null>(null);
  const [isExternalDragOver, setIsExternalDragOver] = useState(false);

  // Inline rename state
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameInputVal, setRenameInputVal] = useState('');

  // Inspector Preview Pane
  const [showInspector, setShowInspector] = useState(true);

  // Navigation path breadcrumbs
  const getBreadcrumbs = () => {
    if (isTrashView) return [{ id: 'trash', name: 'Trash' }];
    if (!currentFolderId) return [{ id: null, name: 'Desktop' }];

    const crumbs: { id: string | null; name: string }[] = [];
    let curr: string | null = currentFolderId;
    while (curr) {
      const folder = files.find(f => f.id === curr);
      if (folder) {
        crumbs.unshift({ id: folder.id, name: folder.name });
        curr = folder.parentId;
      } else {
        break;
      }
    }
    crumbs.unshift({ id: null, name: 'Desktop' });
    return crumbs;
  };

  const currentItems = isTrashView
    ? trashFiles
    : files
        .filter(f => f.parentId === currentFolderId)
        .filter(f => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const selectedFile = files.find(f => f.id === selectedFileIds[0]) || 
                       trashFiles.find(f => f.id === selectedFileIds[0]);

  // Handle Drag & Drop Internal
  const handleDragStart = (e: React.DragEvent, file: VirtualFile) => {
    setDraggedFileId(file.id);
    e.dataTransfer.setData('text/plain', file.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedFileId && draggedFileId !== targetFolderId) {
      setDragOverTargetId(targetFolderId);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDropOnFolder = (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedFileId;
    if (sourceId && sourceId !== targetFolderId) {
      sound.playClick();
      // Move file into targetFolderId
      onUpdateFiles(
        files.map(f => (f.id === sourceId ? { ...f, parentId: targetFolderId, updatedAt: 'Just now' } : f))
      );
    }
    setDraggedFileId(null);
    setDragOverTargetId(null);
  };

  const handleDropOnTrash = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedFileId;
    if (sourceId) {
      const target = files.find(f => f.id === sourceId);
      if (target) {
        sound.playWindowClose();
        setTrashFiles(prev => [...prev, target]);
        onUpdateFiles(files.filter(f => f.id !== sourceId));
        setSelectedFileIds([]);
      }
    }
    setDraggedFileId(null);
    setDragOverTargetId(null);
  };

  // External Drag & Drop from Computer
  const handleExternalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExternalDragOver(true);
  };

  const handleExternalDragLeave = () => {
    setIsExternalDragOver(false);
  };

  const handleExternalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExternalDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;

    sound.playNotification();
    Array.from(droppedFiles).forEach(file => {
      const reader = new FileReader();
      const isImg = file.type.startsWith('image/');
      reader.onload = () => {
        const result = reader.result as string;
        const newFile: VirtualFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          type: isImg ? 'image' : file.name.endsWith('.ts') || file.name.endsWith('.js') || file.name.endsWith('.json') ? 'code' : 'document',
          parentId: currentFolderId,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          updatedAt: 'Just now',
          content: !isImg ? result : undefined,
          previewUrl: isImg ? result : undefined,
        };
        onUpdateFiles([...files, newFile]);
      };

      if (isImg) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  // Creation helpers
  const handleCreateFolder = () => {
    sound.playClick();
    const folderCount = files.filter(f => f.parentId === currentFolderId && f.type === 'folder').length;
    const newFolder: VirtualFile = {
      id: `folder-${Date.now()}`,
      name: `New Folder ${folderCount > 0 ? folderCount + 1 : ''}`.trim(),
      type: 'folder',
      parentId: currentFolderId,
      size: '0 items',
      updatedAt: 'Just now',
    };
    onUpdateFiles([...files, newFolder]);
    setRenamingFileId(newFolder.id);
    setRenameInputVal(newFolder.name);
  };

  const handleCreateDocument = () => {
    sound.playClick();
    const docCount = files.filter(f => f.parentId === currentFolderId && f.type === 'document').length;
    const newDoc: VirtualFile = {
      id: `doc-${Date.now()}`,
      name: `Document ${docCount > 0 ? docCount + 1 : ''}.md`.trim(),
      type: 'document',
      parentId: currentFolderId,
      size: '0.1 KB',
      updatedAt: 'Just now',
      content: '# New Document\n\nBegin drafting here...',
      tags: ['draft'],
    };
    onUpdateFiles([...files, newDoc]);
    onOpenFile(newDoc);
  };

  // Inline rename submit
  const submitRename = (fileId: string) => {
    if (!renameInputVal.trim()) {
      setRenamingFileId(null);
      return;
    }
    sound.playClick();
    onUpdateFiles(
      files.map(f => (f.id === fileId ? { ...f, name: renameInputVal.trim() } : f))
    );
    setRenamingFileId(null);
  };

  const handleDeleteItem = (file: VirtualFile) => {
    sound.playClick();
    if (isTrashView) {
      setTrashFiles(trashFiles.filter(f => f.id !== file.id));
      setSelectedFileIds(selectedFileIds.filter(id => id !== file.id));
    } else {
      setTrashFiles([...trashFiles, file]);
      onUpdateFiles(files.filter(f => f.id !== file.id));
      setSelectedFileIds(selectedFileIds.filter(id => id !== file.id));
    }
  };

  const getFileIcon = (type: FileType, className = "w-5 h-5") => {
    switch (type) {
      case 'folder': return <Folder className={`${className} text-sky-400 fill-sky-400/20`} />;
      case 'image': return <ImageIcon className={`${className} text-rose-400`} />;
      case 'code': return <CodeIcon className={`${className} text-emerald-400`} />;
      case 'document': default: return <FileText className={`${className} text-slate-300`} />;
    }
  };

  return (
    <div 
      onDragOver={handleExternalDragOver}
      onDragLeave={handleExternalDragLeave}
      onDrop={handleExternalDrop}
      className="flex h-full w-full bg-slate-950/75 backdrop-blur-xl text-slate-100 select-none overflow-hidden relative"
    >
      {/* External Drag Overlay indicator */}
      {isExternalDragOver && (
        <div className="absolute inset-0 z-50 bg-sky-500/20 backdrop-blur-md border-2 border-dashed border-sky-400 flex flex-col items-center justify-center pointer-events-none animate-in fade-in">
          <Upload className="w-12 h-12 text-sky-300 mb-2 animate-bounce" />
          <p className="text-sm font-semibold text-white">Drop files to import into Aetheris</p>
          <p className="text-xs text-sky-200 mt-1">Supports Markdown, Text, Code, Images</p>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="w-52 border-r border-white/10 flex flex-col p-3 bg-white/[0.02]">
        <div className="text-[11px] font-medium tracking-wider text-slate-400 uppercase px-2 py-1.5 mb-1">
          Locations
        </div>
        <nav className="space-y-0.5 text-xs">
          <button
            onClick={() => { sound.playClick(); setCurrentFolderId(null); setIsTrashView(false); }}
            onDragOver={(e) => handleDragOver(e, null)}
            onDrop={(e) => handleDropOnFolder(e, null)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
              !isTrashView && currentFolderId === null
                ? 'bg-white/15 text-white font-medium shadow-xs'
                : 'text-slate-300 hover:bg-white/8 hover:text-white'
            } ${dragOverTargetId === null ? 'ring-2 ring-sky-400' : ''}`}
          >
            <Folder className="w-4 h-4 text-sky-400" />
            <span>Desktop</span>
          </button>

          {files.filter(f => f.parentId === null && f.type === 'folder').map(folder => {
            const isHovered = dragOverTargetId === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => { sound.playClick(); setCurrentFolderId(folder.id); setIsTrashView(false); }}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDrop={(e) => handleDropOnFolder(e, folder.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                  !isTrashView && currentFolderId === folder.id
                    ? 'bg-white/15 text-white font-medium shadow-xs'
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                } ${isHovered ? 'ring-2 ring-sky-400 bg-sky-500/20' : ''}`}
              >
                <Folder className="w-4 h-4 text-sky-400" />
                <span className="truncate">{folder.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Trash Receptacle (Valid Drop Target!) */}
        <div className="text-[11px] font-medium tracking-wider text-slate-400 uppercase px-2 py-1.5 mt-5 mb-1">
          Receptacle
        </div>
        <button
          onClick={() => { sound.playClick(); setIsTrashView(true); }}
          onDragOver={(e) => handleDragOver(e, 'trash')}
          onDrop={handleDropOnTrash}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-all ${
            isTrashView
              ? 'bg-white/15 text-white font-medium'
              : 'text-slate-400 hover:bg-white/8 hover:text-white'
          } ${dragOverTargetId === 'trash' ? 'ring-2 ring-rose-400 bg-rose-500/25' : ''}`}
        >
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Trash</span>
          </div>
          {trashFiles.length > 0 && (
            <span className="text-[10px] tabular-nums font-mono px-1.5 py-0.2 bg-white/10 rounded-sm text-slate-300">
              {trashFiles.length}
            </span>
          )}
        </button>

        {/* Disk Meter */}
        <div className="mt-auto pt-3 border-t border-white/10 px-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              Liquid Drive
            </span>
            <span className="font-mono tabular-nums">42.8 GB free</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full w-[34%]" />
          </div>
        </div>
      </aside>

      {/* Center Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Action Header */}
        <header className="h-12 border-b border-white/10 px-4 flex items-center justify-between gap-3 bg-white/[0.03]">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 overflow-hidden">
            {getBreadcrumbs().map((crumb, idx, arr) => (
              <React.Fragment key={crumb.name}>
                <button
                  onClick={() => {
                    sound.playClick();
                    if (crumb.id === 'trash') {
                      setIsTrashView(true);
                    } else {
                      setIsTrashView(false);
                      setCurrentFolderId(crumb.id);
                    }
                  }}
                  className={`hover:text-white transition-colors truncate max-w-[120px] ${
                    idx === arr.length - 1 ? 'text-white font-semibold' : ''
                  }`}
                >
                  {crumb.name}
                </button>
                {idx < arr.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
              </React.Fragment>
            ))}
          </div>

          {/* Tools */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 focus:w-44 transition-all h-7 pl-8 pr-2.5 text-xs bg-white/5 border border-white/10 rounded-md placeholder-slate-500 text-slate-100 focus:outline-none focus:border-white/30"
              />
            </div>

            {/* View Grid/List */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-md p-0.5">
              <button
                onClick={() => { sound.playClick(); setViewMode('grid'); }}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { sound.playClick(); setViewMode('list'); }}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {!isTrashView && (
              <>
                <button
                  onClick={handleCreateFolder}
                  className="flex items-center gap-1 h-7 px-2.5 text-xs bg-white/10 hover:bg-white/15 border border-white/15 rounded-md text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Folder</span>
                </button>
                <button
                  onClick={handleCreateDocument}
                  className="flex items-center gap-1 h-7 px-2.5 text-xs bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-200 rounded-md transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Document</span>
                </button>
              </>
            )}

            <button
              onClick={() => setShowInspector(!showInspector)}
              className={`p-1.5 rounded-md text-xs border transition-colors ${
                showInspector ? 'bg-sky-500/20 border-sky-400/30 text-sky-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Toggle File Inspector"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <div 
          onDragOver={(e) => handleDragOver(e, currentFolderId)}
          onDrop={(e) => handleDropOnFolder(e, currentFolderId)}
          className="flex-1 overflow-y-auto p-4"
        >
          {currentItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
              <Folder className="w-12 h-12 text-slate-700 stroke-1 mb-2" />
              <p className="text-sm font-medium text-slate-400">Empty directory</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Drag and drop files here from your computer, or create folders and notes.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {currentItems.map((item) => {
                const isSelected = selectedFileIds.includes(item.id);
                const isRenaming = renamingFileId === item.id;
                const isFolderDropTarget = dragOverTargetId === item.id && item.type === 'folder';

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragOver={(e) => item.type === 'folder' ? handleDragOver(e, item.id) : undefined}
                    onDrop={(e) => item.type === 'folder' ? handleDropOnFolder(e, item.id) : undefined}
                    onClick={() => { sound.playClick(); setSelectedFileIds([item.id]); }}
                    onDoubleClick={() => {
                      if (item.type === 'folder') {
                        sound.playClick();
                        setCurrentFolderId(item.id);
                      } else {
                        onOpenFile(item);
                      }
                    }}
                    className={`group relative p-3 rounded-xl border transition-all flex flex-col items-center text-center cursor-pointer ${
                      isSelected
                        ? 'bg-white/15 border-white/30 shadow-md ring-1 ring-sky-400/40'
                        : 'bg-white/[0.03] border-white/8 hover:bg-white/[0.07] hover:border-white/15'
                    } ${isFolderDropTarget ? 'ring-2 ring-sky-400 bg-sky-500/25 scale-105' : ''}`}
                  >
                    {/* Icon or Image preview */}
                    <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2 overflow-hidden shadow-inner">
                      {item.previewUrl ? (
                        <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        getFileIcon(item.type, "w-8 h-8")
                      )}
                    </div>

                    {/* Inline Rename or Name */}
                    {isRenaming ? (
                      <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={renameInputVal}
                          onChange={(e) => setRenameInputVal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitRename(item.id);
                            if (e.key === 'Escape') setRenamingFileId(null);
                          }}
                          autoFocus
                          className="w-full text-xs bg-slate-900 border border-sky-400 rounded px-1 py-0.5 text-white"
                        />
                        <button onClick={() => submitRename(item.id)} className="text-emerald-400 p-0.5">
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-200 truncate w-full group-hover:text-white">
                        {item.name}
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 tabular-nums">
                      {item.size}
                    </span>

                    {/* Hover action strip */}
                    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingFileId(item.id);
                          setRenameInputVal(item.name);
                        }}
                        title="Rename"
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteItem(item); }}
                        title="Delete"
                        className="p-1 rounded bg-white/10 hover:bg-rose-500/20 text-rose-300"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List Mode */
            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-medium">
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Size</th>
                    <th className="py-2.5 px-3">Modified</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentItems.map((item) => {
                    const isSelected = selectedFileIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragOver={(e) => item.type === 'folder' ? handleDragOver(e, item.id) : undefined}
                        onDrop={(e) => item.type === 'folder' ? handleDropOnFolder(e, item.id) : undefined}
                        onClick={() => { sound.playClick(); setSelectedFileIds([item.id]); }}
                        onDoubleClick={() => {
                          if (item.type === 'folder') {
                            setCurrentFolderId(item.id);
                          } else {
                            onOpenFile(item);
                          }
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-white/15' : 'hover:bg-white/5'
                        }`}
                      >
                        <td className="py-2 px-3 flex items-center gap-2.5 font-medium text-slate-200">
                          {getFileIcon(item.type, "w-4 h-4")}
                          <span className="truncate max-w-[200px]">{item.name}</span>
                        </td>
                        <td className="py-2 px-3 text-slate-400 capitalize">{item.type}</td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-400">{item.size}</td>
                        <td className="py-2 px-3 text-slate-400 font-mono tabular-nums">{item.updatedAt}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteItem(item); }}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="h-7 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-slate-400 bg-white/[0.02]">
          <span>{currentItems.length} items · Drag files to folders or trash</span>
          <span className="font-mono text-slate-500">Aetheris FS v2</span>
        </footer>
      </div>

      {/* Right Inspector Drawer */}
      {showInspector && selectedFile && (
        <aside className="w-64 border-l border-white/10 p-4 bg-white/[0.02] flex flex-col space-y-4 text-xs overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-semibold text-white">File Inspector</span>
            <button onClick={() => setShowInspector(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-2 overflow-hidden">
              {selectedFile.previewUrl ? (
                <img src={selectedFile.previewUrl} alt={selectedFile.name} className="w-full h-full object-cover" />
              ) : (
                getFileIcon(selectedFile.type, "w-10 h-10")
              )}
            </div>
            <h4 className="font-semibold text-white text-xs truncate max-w-full">{selectedFile.name}</h4>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedFile.size}</span>
          </div>

          <div className="space-y-2 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Location</span>
              <span className="text-xs text-slate-200">
                {selectedFile.parentId ? files.find(f => f.id === selectedFile.parentId)?.name : 'Desktop Root'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Kind</span>
              <span className="text-xs text-slate-200 capitalize">{selectedFile.type} document</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Last Modified</span>
              <span className="text-xs text-slate-200 font-mono">{selectedFile.updatedAt}</span>
            </div>
          </div>

          {selectedFile.content && (
            <div className="flex-1 flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-1">Quick Preview</span>
              <pre className="p-2 rounded-lg bg-black/40 border border-white/10 text-[10px] font-mono text-slate-300 overflow-y-auto max-h-36 whitespace-pre-wrap">
                {selectedFile.content.slice(0, 300)}...
              </pre>
            </div>
          )}

          <button
            onClick={() => onOpenFile(selectedFile)}
            className="w-full py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 rounded-xl text-sky-200 font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open in Editor</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </div>
  );
};
