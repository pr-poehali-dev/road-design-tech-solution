import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { depoApi, DepoFolder, DepoFile } from '@/lib/crewApi';
import { fileToDataUrl, fileIcon, formatSize, isImage } from '@/lib/fileUtils';
import FilePreviewModal, { PreviewFile } from './FilePreviewModal';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Crumb { id: number | null; name: string; }

const FOLDER_ICON: Record<string, string> = { department: 'Building2', project: 'FolderKanban', folder: 'Folder' };

const DepositoryPanel = ({ open, onClose }: Props) => {
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ id: null, name: 'Хранилище' }]);
  const [folders, setFolders] = useState<DepoFolder[]>([]);
  const [files, setFiles] = useState<DepoFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<PreviewFile | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // search
  const [query, setQuery] = useState('');
  const [aiMode, setAiMode] = useState(false);
  const [searchResults, setSearchResults] = useState<DepoFile[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [interpreted, setInterpreted] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const current = crumbs[crumbs.length - 1];

  const load = useCallback(async (parentId: number | null) => {
    setLoading(true);
    try {
      const [fl, fi] = await Promise.all([depoApi.folders(parentId), depoApi.files(parentId)]);
      setFolders(fl.folders);
      setFiles(fi.files);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setCrumbs([{ id: null, name: 'Хранилище' }]);
      setSearchResults(null);
      setQuery('');
      load(null);
    }
  }, [open, load]);

  const enterFolder = (f: DepoFolder) => {
    setCrumbs((c) => [...c, { id: f.id, name: f.name }]);
    load(f.id);
  };
  const goCrumb = (idx: number) => {
    setCrumbs((c) => c.slice(0, idx + 1));
    load(crumbs[idx].id);
  };

  const doUpload = async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    setUploading(true);
    try {
      for (const file of arr) {
        if (file.size > 30 * 1024 * 1024) { alert(`«${file.name}» превышает 30 МБ`); continue; }
        const data = await fileToDataUrl(file);
        await depoApi.upload({ name: file.name, folder_id: current.id, data, mime: file.type || 'application/octet-stream' });
      }
      await load(current.id);
    } finally {
      setUploading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const kind = current.id === null ? 'department' : 'folder';
    await depoApi.createFolder(newFolderName.trim(), current.id, kind);
    setNewFolderName('');
    setNewFolderOpen(false);
    await load(current.id);
  };

  const runSearch = async () => {
    if (!query.trim()) { setSearchResults(null); return; }
    setSearching(true);
    setInterpreted('');
    try {
      const r = aiMode ? await depoApi.aiSearch(query.trim()) : await depoApi.search(query.trim());
      setSearchResults(r.files);
      if (r.interpreted) setInterpreted(r.interpreted);
    } finally {
      setSearching(false);
    }
  };

  const openFile = (f: DepoFile) => setPreview({ url: f.url, name: f.name, mime: f.mime, size: f.size_bytes, path: f.path });

  const trashFile = async (f: DepoFile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Удалить «${f.name}» в корзину?`)) return;
    await depoApi.trashFile(f.id);
    if (searchResults) setSearchResults((s) => s?.filter((x) => x.id !== f.id) || null);
    else await load(current.id);
  };

  if (!open) return null;

  const shownFiles = searchResults !== null ? searchResults : files;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-[#0B0C10]/97 backdrop-blur-xl flex flex-col">
        {/* header */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-[#45A29E]/20 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center">
            <Icon name="FolderLock" size={20} className="text-[#66FCF1]" />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading font-extrabold text-lg sm:text-xl text-white truncate">Голографический депозитарий</h1>
            <p className="text-[10px] text-[#6B7684] uppercase tracking-widest">супер-хранилище файлов</p>
          </div>
          <button onClick={onClose} className="ml-auto text-[#6B7684] hover:text-white p-2"><Icon name="X" size={22} /></button>
        </div>

        {/* search bar */}
        <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 py-3 border-b border-[#45A29E]/15 shrink-0">
          <div className="flex items-center gap-2 bg-[#1F2833]/60 border border-[#45A29E]/30 rounded-lg px-3 flex-1 min-w-[220px]">
            <Icon name={aiMode ? 'Sparkles' : 'Search'} size={16} className="text-[#45A29E]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              placeholder={aiMode ? 'Смысловой поиск: «договоры на двигатели»...' : 'Поиск по имени, тегам, содержимому...'}
              className="flex-1 bg-transparent py-2 text-sm text-white placeholder:text-[#6B7684] focus:outline-none" />
            {query && <button onClick={() => { setQuery(''); setSearchResults(null); }} className="text-[#6B7684] hover:text-white"><Icon name="X" size={14} /></button>}
          </div>
          <button onClick={() => setAiMode((v) => !v)} title="Умный поиск ИИ"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${aiMode ? 'bg-[#45A29E] text-[#0B0C10] border-[#45A29E] font-bold' : 'border-[#45A29E]/30 text-[#66FCF1] hover:bg-[#45A29E]/10'}`}>
            <Icon name="Sparkles" size={15} /> ИИ
          </button>
          <button onClick={runSearch} disabled={searching}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold text-sm hover:opacity-90 disabled:opacity-50">
            {searching ? <Icon name="Loader2" size={15} className="animate-spin" /> : <Icon name="Search" size={15} />} Найти
          </button>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* left: departments tree */}
          <div className="hidden md:flex flex-col w-60 border-r border-[#45A29E]/15 overflow-y-auto shrink-0 p-2">
            <button onClick={() => { setCrumbs([{ id: null, name: 'Хранилище' }]); setSearchResults(null); load(null); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left ${current.id === null ? 'bg-[#45A29E]/15 text-[#66FCF1]' : 'text-[#C5C6C7] hover:bg-[#1F2833]/60'}`}>
              <Icon name="HardDrive" size={16} /> <span className="text-sm font-medium">Все отделы</span>
            </button>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6B7684] px-3 py-2">Разделы</div>
            <DeptTree onEnter={(f) => { setCrumbs([{ id: null, name: 'Хранилище' }, { id: f.id, name: f.name }]); setSearchResults(null); load(f.id); }} activeId={current.id} />
          </div>

          {/* center */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* breadcrumbs + actions */}
            <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 border-b border-[#45A29E]/10 shrink-0 flex-wrap">
              {searchResults !== null ? (
                <div className="flex items-center gap-2 text-sm text-[#66FCF1]">
                  <Icon name="Search" size={15} />
                  Результаты поиска ({shownFiles.length})
                  {interpreted && aiMode && <span className="text-[11px] text-[#8B98A5]">· ИИ понял: «{interpreted}»</span>}
                  <button onClick={() => setSearchResults(null)} className="text-[#8B98A5] hover:text-white ml-1 text-xs underline">сбросить</button>
                </div>
              ) : (
                <div className="flex items-center gap-1 flex-wrap text-sm flex-1">
                  {crumbs.map((c, i) => (
                    <span key={i} className="flex items-center gap-1">
                      {i > 0 && <Icon name="ChevronRight" size={13} className="text-[#6B7684]" />}
                      <button onClick={() => goCrumb(i)} className={i === crumbs.length - 1 ? 'text-white font-semibold' : 'text-[#8B98A5] hover:text-white'}>{c.name}</button>
                    </span>
                  ))}
                </div>
              )}
              {searchResults === null && (
                <div className="flex gap-2 ml-auto">
                  <button onClick={() => setNewFolderOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#45A29E]/30 text-[#66FCF1] text-sm hover:bg-[#45A29E]/10">
                    <Icon name="FolderPlus" size={15} /> Папка
                  </button>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => { if (e.target.files) doUpload(e.target.files); e.target.value = ''; }} />
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold text-sm hover:opacity-90 disabled:opacity-50">
                    <Icon name={uploading ? 'Loader2' : 'Upload'} size={15} className={uploading ? 'animate-spin' : ''} /> Загрузить
                  </button>
                </div>
              )}
            </div>

            {/* content with drag&drop */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length && searchResults === null) doUpload(e.dataTransfer.files); }}
              className={`flex-1 overflow-y-auto p-4 sm:p-6 ${dragOver ? 'bg-[#45A29E]/10' : ''}`}
            >
              {dragOver && (
                <div className="pointer-events-none border-2 border-dashed border-[#66FCF1] rounded-2xl p-8 text-center mb-4 text-[#66FCF1]">
                  <Icon name="Upload" size={28} className="mx-auto mb-2" /> Отпустите файлы для загрузки
                </div>
              )}

              {loading ? (
                <div className="py-16 text-center"><Icon name="Loader2" size={28} className="animate-spin text-[#66FCF1] mx-auto" /></div>
              ) : (
                <>
                  {/* folders grid */}
                  {searchResults === null && folders.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
                      {folders.map((f) => (
                        <button key={f.id} onClick={() => enterFolder(f)}
                          className="flex items-center gap-2 rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/40 p-3 hover:border-[#66FCF1]/50 text-left transition-colors">
                          <Icon name={FOLDER_ICON[f.kind] as any || 'Folder'} size={20} className="text-[#66FCF1] shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-white truncate">{f.name}</div>
                            <div className="text-[10px] text-[#6B7684]">{f.sub_count || 0} папок · {f.file_count || 0} файлов</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* files */}
                  {shownFiles.length === 0 && folders.length === 0 && (
                    <div className="py-16 text-center text-[#6B7684]">
                      <Icon name="FolderOpen" size={36} className="mx-auto mb-3 opacity-50" />
                      {searchResults !== null ? 'Ничего не найдено' : 'Папка пуста. Загрузите файлы или перетащите их сюда.'}
                    </div>
                  )}

                  {shownFiles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {shownFiles.map((f) => (
                        <div key={f.id} onClick={() => openFile(f)}
                          className="group flex flex-col rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/40 overflow-hidden hover:border-[#66FCF1]/50 transition-colors cursor-pointer">
                          <div className="h-28 bg-[#050608] flex items-center justify-center overflow-hidden">
                            {isImage(f.name, f.mime) ? (
                              <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                            ) : (
                              <Icon name={fileIcon(f.name, f.mime) as any} size={36} className="text-[#45A29E]" />
                            )}
                          </div>
                          <div className="p-2.5 flex-1 flex flex-col">
                            <div className="text-sm font-medium text-white truncate">{f.name}</div>
                            <div className="text-[10px] text-[#6B7684] mb-1">{formatSize(f.size_bytes)}{searchResults !== null && f.path ? ` · ${f.path}` : ''}</div>
                            {f.ai_summary && <div className="text-[10px] text-[#8B98A5] line-clamp-2 mb-1">{f.ai_summary}</div>}
                            {f.tags && f.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-auto">
                                {f.tags.slice(0, 4).map((t, i) => (
                                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#45A29E]/15 text-[#45A29E]">#{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex border-t border-[#45A29E]/15 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href={f.url} download={f.name} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] text-[#66FCF1] hover:bg-[#45A29E]/10">
                              <Icon name="Download" size={12} /> Скачать
                            </a>
                            <button onClick={(e) => trashFile(f, e)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] text-[#FF9B9B] hover:bg-[#FF4D4D]/10">
                              <Icon name="Trash2" size={12} /> Удалить
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* new folder modal */}
        <AnimatePresence>
          {newFolderOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70" onClick={() => setNewFolderOpen(false)}>
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-[#45A29E]/40 bg-[#0B0C10]/95 p-5">
                <h3 className="font-heading font-bold text-white mb-3">Новая папка в «{current.name}»</h3>
                <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createFolder()}
                  autoFocus placeholder="Название папки"
                  className="w-full bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#66FCF1]/60 mb-3" />
                <div className="flex gap-2">
                  <button onClick={() => setNewFolderOpen(false)} className="flex-1 py-2 rounded-lg border border-[#45A29E]/30 text-[#8B98A5] hover:text-white">Отмена</button>
                  <button onClick={createFolder} className="flex-1 py-2 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold hover:opacity-90">Создать</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
      </motion.div>
    </AnimatePresence>
  );
};

// Дерево отделов (корневые папки) в левой панели
const DeptTree = ({ onEnter, activeId }: { onEnter: (f: DepoFolder) => void; activeId: number | null }) => {
  const [depts, setDepts] = useState<DepoFolder[]>([]);
  useEffect(() => { depoApi.folders(null).then((r) => setDepts(r.folders)).catch(() => {}); }, []);
  return (
    <>
      {depts.map((d) => (
        <button key={d.id} onClick={() => onEnter(d)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left ${activeId === d.id ? 'bg-[#45A29E]/15 text-[#66FCF1]' : 'text-[#C5C6C7] hover:bg-[#1F2833]/60'}`}>
          <Icon name="Building2" size={15} className="shrink-0" />
          <span className="text-sm truncate flex-1">{d.name}</span>
          <span className="text-[10px] text-[#6B7684]">{d.file_count || 0}</span>
        </button>
      ))}
    </>
  );
};

export default DepositoryPanel;
