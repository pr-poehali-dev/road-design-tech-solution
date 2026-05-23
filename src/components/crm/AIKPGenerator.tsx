import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import func2url from '../../../backend/func2url.json';

const API_URL = func2url['generate-kp'];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface KpStage {
  n: number;
  title: string;
  sum: number;
}

interface KpResult {
  what: string;
  fmt: string;
  qty: string;
}

interface KpData {
  client?: string;
  project?: string;
  stages?: KpStage[];
  results?: KpResult[];
  timeline?: string;
  notes?: string;
}

interface AttachedFile {
  name: string;
  type: string;
  size: number;
  b64: string;         // только для изображений
  text?: string;       // извлечённый текст (для PDF/Word/Excel/CSV)
  parsed: boolean;     // уже обработан на backend
  parsing?: boolean;   // идёт парсинг
  error?: boolean;
}

const NAVY = '#1e3a5f';
const GOLD = '#b8860b';

function formatMoney(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' Б';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
  return (bytes / 1024 / 1024).toFixed(1) + ' МБ';
}

function fileIcon(type: string) {
  if (type.includes('pdf')) return 'FileText';
  if (type.includes('word') || type.includes('document')) return 'FileType2';
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return 'Table2';
  if (type.includes('image')) return 'Image';
  return 'Paperclip';
}

function fileColor(type: string) {
  if (type.includes('pdf')) return 'text-red-400';
  if (type.includes('word') || type.includes('document')) return 'text-blue-400';
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return 'text-green-400';
  if (type.includes('image')) return 'text-purple-400';
  return 'text-gray-400';
}

function KPPreview({ kp }: { kp: KpData }) {
  const total = (kp.stages || []).reduce((s, st) => s + st.sum, 0);
  const vat = Math.round(total * 20 / 120);
  const exVat = total - vat;
  const p30 = Math.round(total * 0.3);
  const p70 = total - p30;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden text-sm font-sans">
      <div className="px-6 py-4" style={{ background: NAVY }}>
        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Коммерческое предложение</p>
        <h2 className="text-white text-lg font-bold leading-tight">{kp.project || 'Проект'}</h2>
        {kp.client && <p className="text-cyan-300 text-xs mt-1">{kp.client}</p>}
      </div>

      <div className="px-6 py-4 space-y-4">
        {(kp.stages || []).length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Состав работ</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 text-gray-400 font-medium w-6">№</th>
                  <th className="text-left py-1 text-gray-400 font-medium">Наименование</th>
                  <th className="text-right py-1 text-gray-400 font-medium">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {kp.stages!.map((st) => (
                  <tr key={st.n} className="border-b border-gray-100">
                    <td className="py-1.5 text-gray-400">{st.n}</td>
                    <td className="py-1.5 text-gray-700">{st.title}</td>
                    <td className="py-1.5 text-right font-semibold" style={{ color: NAVY }}>{formatMoney(st.sum)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 0 && (
          <div className="rounded-xl p-3 space-y-1" style={{ background: '#f0f4f8' }}>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Без НДС</span><span>{formatMoney(exVat)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>НДС 20%</span><span>{formatMoney(vat)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-gray-300">
              <span style={{ color: NAVY }}>Итого</span>
              <span style={{ color: NAVY }}>{formatMoney(total)}</span>
            </div>
          </div>
        )}

        {total > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: '#f0f4f8' }}>
              <div className="w-10 h-10 rounded-full mx-auto mb-1.5 flex items-center justify-center text-white text-xs font-bold" style={{ background: NAVY }}>30%</div>
              <p className="text-xs font-semibold text-gray-700">Предоплата</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: NAVY }}>{formatMoney(p30)}</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: '#f0f4f8' }}>
              <div className="w-10 h-10 rounded-full mx-auto mb-1.5 flex items-center justify-center text-white text-xs font-bold" style={{ background: GOLD }}>70%</div>
              <p className="text-xs font-semibold text-gray-700">По факту</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: GOLD }}>{formatMoney(p70)}</p>
            </div>
          </div>
        )}

        {(kp.results || []).length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Результаты</p>
            <ul className="space-y-1">
              {kp.results!.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="mt-0.5 text-green-500 flex-shrink-0">✓</span>
                  <span>{r.what} <span className="text-gray-400">{r.fmt}</span> — {r.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          {kp.timeline && (
            <div className="rounded-lg p-2.5" style={{ background: '#f0f4f8' }}>
              <p className="text-gray-400 mb-0.5">Срок</p>
              <p className="font-semibold text-gray-700">{kp.timeline}</p>
            </div>
          )}
          {kp.notes && (
            <div className="rounded-lg p-2.5" style={{ background: '#f0f4f8' }}>
              <p className="text-gray-400 mb-0.5">Примечания</p>
              <p className="text-gray-600">{kp.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const LS_MESSAGES = 'aikp_messages';
const LS_KPDATA = 'aikp_kpdata';

export function AIKPGenerator() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_MESSAGES) || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [kpData, setKpData] = useState<KpData | null>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KPDATA) || 'null'); } catch { return null; }
  });
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Сохраняем messages и kpData в localStorage при каждом изменении
  useEffect(() => {
    try { localStorage.setItem(LS_MESSAGES, JSON.stringify(messages)); } catch (e) { void e; }
  }, [messages]);

  useEffect(() => {
    try { localStorage.setItem(LS_KPDATA, JSON.stringify(kpData)); } catch (e) { void e; }
  }, [kpData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Лимиты размеров файлов перед отправкой на backend
  const MAX_FILE_BYTES = 4 * 1024 * 1024;   // 4 MB для документов
  const MAX_IMG_BYTES  = 2 * 1024 * 1024;   // 2 MB для изображений (OCR)

  const processFiles = async (files: File[]) => {
    if (!files.length) return;
    setUploadingFiles(true);

    const pending: AttachedFile[] = [];
    for (const file of files) {
      const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|tiff)$/i.test(file.name || '');
      const limit = isImage ? MAX_IMG_BYTES : MAX_FILE_BYTES;
      const truncated = file.size > limit;

      let b64 = '';
      try {
        b64 = await new Promise<string>((resolve, reject) => {
          const slice = truncated ? file.slice(0, limit) : file;
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const idx = result.indexOf(',');
            resolve(idx !== -1 ? result.slice(idx + 1) : '');
          };
          reader.onerror = () => reject(new Error('Ошибка чтения файла'));
          reader.readAsDataURL(slice);
        });
      } catch (e) { void e; }

      if (!b64 || b64.length < 10) continue;

      const name = file.name || `скриншот_${Date.now()}.png`;
      const mime = file.type || (isImage ? 'image/png' : 'application/octet-stream');
      pending.push({
        name: name + (truncated ? ` (сжато до ${formatSize(limit)})` : ''),
        type: mime,
        size: file.size,
        b64,
        parsed: false,
        parsing: true,
      });
    }
    setAttachedFiles(prev => [...prev, ...pending]);

    // Парсим текстовые файлы на backend по одному
    for (const f of pending) {
      if (f.parsed) continue;
      try {
        const resp = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'parse_files',
            files_b64: [{ name: f.name, type: f.type, data: f.b64 }],
          }),
        });
        if (!resp.ok) {
          const errBody = await resp.text().catch(() => '');
          throw new Error(`HTTP ${resp.status}: ${errBody.slice(0, 150)}`);
        }
        const data = await resp.json();
        const parsed = data.files?.[0];
        const hasText = parsed?.text && !parsed.text.startsWith('[OCR ошибка') && !parsed.text.startsWith('[Ошибка');
        setAttachedFiles(prev => prev.map(af =>
          af.name === f.name && af.parsing
            ? {
                ...af,
                text: parsed?.text || '[Не удалось извлечь текст]',
                parsed: true,
                parsing: false,
                error: !hasText,
              }
            : af
        ));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'неизвестная ошибка';
        setAttachedFiles(prev => prev.map(af =>
          af.name === f.name && af.parsing
            ? { ...af, text: `[Ошибка: ${msg}]`, parsed: true, parsing: false, error: true }
            : af
        ));
      }
    }

    setUploadingFiles(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (idx: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const sendMessage = async () => {
    const text = input.trim();
    const stillParsing = attachedFiles.some(f => f.parsing);
    if ((!text && attachedFiles.length === 0) || loading || stillParsing) return;

    const fileNames = attachedFiles.map(f => f.name).join(', ');
    const userText = text
      ? (attachedFiles.length > 0 ? `${text}\n\n📎 Прикреплены файлы: ${fileNames}` : text)
      : `📎 Загружены файлы для анализа: ${fileNames}`;

    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    const filesToSend = [...attachedFiles];
    setAttachedFiles([]);
    setLoading(true);

    // Собираем извлечённый текст (без base64!) и изображения отдельно
    const extractedTexts: string[] = [];

    for (const f of filesToSend) {
      if (f.text) {
        // Для изображений — OCR текст уже получен при парсинге
        const label = f.type.startsWith('image/') ? `ИЗОБРАЖЕНИЕ (OCR): ${f.name}` : f.name;
        extractedTexts.push(`=== ${label} ===\n${f.text}`);
      }
    }

    // Запускаем таймер
    setLoadingSeconds(0);
    timerRef.current = setInterval(() => setLoadingSeconds(s => s + 1), 1000);

    // AbortController — отмена по таймауту 50 сек
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deepseek_chat',
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          files_text: extractedTexts.join('\n\n'),
        }),
      });

      clearTimeout(timeoutId);

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(`HTTP ${resp.status}: ${errText.slice(0, 200)}`);
      }

      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.message || 'Готово.' }]);
      if (data.kp_json) setKpData(data.kp_json);
    } catch (err) {
      clearTimeout(timeoutId);
      const isAbort = err instanceof DOMException && err.name === 'AbortError';
      const msg = isAbort
        ? 'Превышено время ожидания (50 сек). Попробуйте упростить запрос или уменьшить файлы.'
        : `Ошибка: ${err instanceof Error ? err.message : 'неизвестная ошибка'}`;
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setLoadingSeconds(0);
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    // Останавливаем всплытие чтобы Tabs не перехватил событие
    if (e.key === 'Enter' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.stopPropagation();
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setKpData(null);
    setInput('');
    setAttachedFiles([]);
    try { localStorage.removeItem(LS_MESSAGES); localStorage.removeItem(LS_KPDATA); } catch (e) { void e; }
  };

  // Обработка вставки из буфера (Ctrl+V / скриншоты)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const fileItems = items.filter(it => it.kind === 'file');
    if (!fileItems.length) return;
    e.preventDefault();
    const files = fileItems.map(it => it.getAsFile()).filter(Boolean) as File[];
    processFiles(files);
  };

  // Drag-and-drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes('Files')) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) processFiles(files);
  };

  const ACCEPTED = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp';

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Левая панель — чат */}
      <div
        className={`flex flex-col flex-1 bg-slate-900/60 border rounded-2xl overflow-hidden relative transition-colors ${
          isDragging ? 'border-cyan-400 bg-cyan-950/40' : 'border-cyan-500/20'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl pointer-events-none">
            <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 border-2 border-dashed border-cyan-400 flex items-center justify-center mb-3">
              <Icon name="Upload" size={32} className="text-cyan-400" />
            </div>
            <p className="text-lg font-bold text-cyan-300">Отпустите файлы</p>
            <p className="text-sm text-cyan-500 mt-1">PDF, Word, Excel, изображения</p>
          </div>
        )}
        {/* Хедер */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-cyan-500/20 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-cyan-300">DeepSeek R1</span>
            <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">AI-КП</Badge>
            <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400">
              <Icon name="Paperclip" size={10} className="mr-1" />
              PDF · Word · Excel · Фото
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-gray-400 hover:text-white">
            <Icon name="Trash2" size={14} className="mr-1" />
            Очистить
          </Button>
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center border border-cyan-500/20">
                <Icon name="BrainCircuit" size={28} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Опишите проект или загрузите файлы</p>
                <p className="text-xs text-gray-600 mt-1">DeepSeek проанализирует ТЗ, чертежи, таблицы<br />и автоматически сформирует КП с суммами</p>
              </div>
              {/* Подсказки */}
              <div className="grid grid-cols-1 gap-2 mt-2 w-full max-w-sm">
                {[
                  'Нужно КП на транспортное обследование перекрёстка',
                  'КП на проектирование склада 5000 м²',
                  'Инженерные изыскания для жилого дома',
                ].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setInput(hint)}
                    className="text-left text-xs px-3 py-2 rounded-lg border border-cyan-500/20 text-cyan-400/70 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
                  >
                    {hint}
                  </button>
                ))}
              </div>
              {/* Drag-and-drop зона */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-sm mt-1 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 p-4 flex flex-col items-center gap-1.5 transition-all group"
              >
                <Icon name="Upload" size={20} className="text-slate-600 group-hover:text-cyan-500 transition-colors" />
                <p className="text-xs text-slate-600 group-hover:text-cyan-400 transition-colors">Загрузить ТЗ, PDF, Word, Excel, фото</p>
                <p className="text-[10px] text-slate-700">pdf · doc · docx · xls · xlsx · csv · jpg · png</p>
              </button>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-br-sm'
                    : 'bg-slate-800 text-gray-200 border border-slate-700 rounded-bl-sm'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-2 text-cyan-400 text-xs font-medium">
                    <Icon name="Sparkles" size={12} />
                    DeepSeek R1
                  </div>
                )}
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 min-w-[200px]">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs">
                    <Icon name="Sparkles" size={12} />
                    DeepSeek думает...
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 tabular-nums">{loadingSeconds}с</span>
                    <button
                      onClick={() => abortRef.current?.abort()}
                      className="text-[10px] text-slate-600 hover:text-red-400 transition-colors border border-slate-700 rounded px-1.5 py-0.5"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                {loadingSeconds > 15 && (
                  <p className="text-[10px] text-slate-600 mt-1">Анализирую документы, чуть подождите...</p>
                )}
                {loadingSeconds > 30 && (
                  <p className="text-[10px] text-amber-600 mt-0.5">Запрос сложный, ещё немного...</p>
                )}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Прикреплённые файлы */}
        {attachedFiles.length > 0 && (
          <div className="px-4 py-2 border-t border-cyan-500/10 bg-slate-900/60">
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((f, i) => (
                <div key={i} className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 text-xs max-w-[220px] transition-colors ${
                  f.error ? 'bg-red-900/30 border-red-700/50' :
                  f.parsing ? 'bg-slate-800 border-cyan-700/50 animate-pulse' :
                  'bg-slate-800 border-slate-700'
                }`}>
                  {f.parsing
                    ? <Icon name="Loader2" size={12} className="text-cyan-400 animate-spin shrink-0" />
                    : <Icon name={fileIcon(f.type)} size={12} className={f.error ? 'text-red-400' : fileColor(f.type)} />
                  }
                  <span className="text-gray-300 truncate flex-1">{f.name}</span>
                  {f.parsing
                    ? <span className="text-cyan-600 shrink-0 text-[9px]">
                        {f.type.startsWith('image/') ? 'OCR...' : 'читаю...'}
                      </span>
                    : f.error
                      ? <span className="text-red-500 shrink-0 text-[9px]" title={f.text}>ошибка</span>
                      : f.text
                        ? <span className="text-green-600 shrink-0 text-[9px]">
                            {f.type.startsWith('image/') ? '✓OCR' : ''}
                            {(f.text.length / 1000).toFixed(0)}к
                          </span>
                        : <span className="text-gray-600 shrink-0">{formatSize(f.size)}</span>
                  }
                  <button onClick={() => removeFile(i)} className="text-gray-600 hover:text-red-400 transition-colors shrink-0 ml-0.5">
                    <Icon name="X" size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Инпут */}
        <div className="px-4 py-3 border-t border-cyan-500/20 bg-slate-900/80">
          <div className="flex gap-2 items-end">
            {/* Кнопка прикрепить файл */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFiles || loading}
              className="text-gray-400 hover:text-cyan-300 hover:bg-slate-800 h-[60px] px-3 border border-slate-700 rounded-xl relative"
              title="Прикрепить файл (PDF, Word, Excel, изображение)"
            >
              {uploadingFiles
                ? <Icon name="Loader2" size={18} className="animate-spin" />
                : <Icon name="Paperclip" size={18} />
              }
              {attachedFiles.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[9px] text-white font-bold flex items-center justify-center">
                  {attachedFiles.length}
                </span>
              )}
            </Button>

            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              onPaste={handlePaste}
              placeholder="Опишите проект… или перетащите / вставьте файлы (Ctrl+V)"
              className="flex-1 resize-none bg-slate-800/80 border-slate-700 text-gray-200 placeholder:text-gray-600 focus:border-cyan-500/50 min-h-[60px] max-h-[120px]"
              rows={2}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || (!input.trim() && attachedFiles.length === 0) || attachedFiles.some(f => f.parsing)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white h-[60px] px-4 disabled:opacity-40"
              title={attachedFiles.some(f => f.parsing) ? 'Подождите — файлы ещё обрабатываются...' : 'Отправить'}
            >
              <Icon name={loading ? 'Loader2' : 'Send'} size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-2">
            {attachedFiles.some(f => f.parsing) ? (
              <span className="text-cyan-600 flex items-center gap-1">
                <Icon name="Loader2" size={10} className="animate-spin" />
                Извлекаю текст из файлов, подождите...
              </span>
            ) : (
              <>
                <span>Ctrl+Enter — отправить</span>
                <span className="text-slate-700">·</span>
                <span className="flex items-center gap-1">
                  <Icon name="Upload" size={10} className="text-slate-600" />
                  Перетащи или вставь Ctrl+V
                </span>
                <span className="text-slate-700">·</span>
                <span className="text-slate-600">PDF · Word · Excel · Фото</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Правая панель — превью КП */}
      <div className="w-[380px] flex-shrink-0 overflow-y-auto">
        {kpData ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                <Icon name="CheckCircle" size={12} className="mr-1" />
                КП сформировано
              </Badge>
            </div>
            <KPPreview kp={kpData} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 p-8">
            <Icon name="FileText" size={40} className="text-slate-600" />
            <div>
              <p className="text-sm font-medium text-slate-500">Превью КП</p>
              <p className="text-xs text-slate-600 mt-1">Появится автоматически<br />когда DeepSeek соберёт данные</p>
            </div>
            <div className="mt-2 space-y-1.5 text-left w-full">
              {[
                { icon: 'FileText', color: 'text-red-400', label: 'PDF — техзадания, договоры' },
                { icon: 'FileType2', color: 'text-blue-400', label: 'Word — описания, ТЗ' },
                { icon: 'Table2', color: 'text-green-400', label: 'Excel — сметы, объёмы' },
                { icon: 'Image', color: 'text-purple-400', label: 'Фото — чертежи, планы' },
              ].map(({ icon, color, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-slate-600">
                  <Icon name={icon} size={12} className={color} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}