import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const GENERATE_KP_URL = 'https://functions.poehali.dev/f595b8a7-903c-4870-b1f7-d0aac554463f';
const KP_STORAGE_URL = 'https://functions.poehali.dev/0af926d6-1696-45cc-acd3-a20ae910f578';

interface KPItem {
  code: string;
  name: string;
  unit: string;
  volume: number;
  price_per_unit: number;
  total: number;
  notes?: string;
}

interface KPSection {
  name: string;
  items: KPItem[];
}

interface KPPhase {
  phase: string;
  duration: string;
  description: string;
}

interface KPData {
  title: string;
  client: string;
  date: string;
  summary: string;
  sections: KPSection[];
  total_sum: number;
  timeline: KPPhase[];
  conditions?: string[];
  payment_conditions?: string[];
  special_conditions?: string[];
  validity: string;
}

interface RoadmapPhase {
  id: number;
  name: string;
  duration: string;
  start_month: number;
  end_month: number;
  tasks: string[];
  deliverables: string[];
  responsible: string;
}

interface RoadmapMilestone {
  month: number;
  week?: number;
  name: string;
  criteria: string;
}

interface RoadmapRisk {
  risk: string;
  probability: string;
  impact: string;
  mitigation: string;
}

interface RoadmapTeam {
  role: string;
  count: number;
  tasks: string;
}

interface RoadmapData {
  project_name: string;
  total_duration: string;
  overview: string;
  phases: RoadmapPhase[];
  milestones: RoadmapMilestone[];
  risks: RoadmapRisk[];
  team: RoadmapTeam[];
  critical_path: string[];
}

interface UploadedFile {
  name: string;
  text: string;
  size: number;
  b64?: string;
}

interface SavedKPMeta {
  id: string;
  created_at: string;
  roadmap_id?: string | null;
}

const formatMoney = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

const riskColor = (level: string) => {
  if (level === 'высокая' || level === 'высокий') return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (level === 'средняя' || level === 'средний') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-green-500/20 text-green-400 border-green-500/30';
};

interface KPGeneratorProps {
  onSendToProduction?: (kpData: KPData, roadmapData: RoadmapData | null, filesText: string, kpId: string) => void;
  onKpReady?: (kpData: Record<string, unknown>, filesText: string, kpId: string) => void;
  onRoadmapReady?: (roadmapData: Record<string, unknown>, kpData: Record<string, unknown> | null, filesText: string, kpId: string | null) => void;
  savedKpContext?: {
    kpData: Record<string, unknown> | null;
    roadmapData: Record<string, unknown> | null;
    filesText: string;
    kpId: string | null;
  };
}

export const KPGenerator = ({ onSendToProduction, onKpReady, onRoadmapReady, savedKpContext }: KPGeneratorProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [extraPrompt, setExtraPrompt] = useState('');
  const [loadingKP, setLoadingKP] = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [kpData, setKpData] = useState<KPData | null>(() => savedKpContext?.kpData as KPData | null ?? null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(() => savedKpContext?.roadmapData as RoadmapData | null ?? null);
  const [activeResult, setActiveResult] = useState<'kp' | 'roadmap'>(() => savedKpContext?.roadmapData ? 'roadmap' : 'kp');
  const [savedMeta, setSavedMeta] = useState<SavedKPMeta | null>(() => savedKpContext?.kpId ? { id: savedKpContext.kpId, created_at: '' } : null);
  const [sendingToProduction, setSendingToProduction] = useState(false);

  // Восстанавливаем данные из родительского контекста при переключении на вкладку
  useEffect(() => {
    if (savedKpContext?.kpData && !kpData) {
      setKpData(savedKpContext.kpData as unknown as KPData);
    }
    if (savedKpContext?.roadmapData && !roadmapData) {
      setRoadmapData(savedKpContext.roadmapData as unknown as RoadmapData);
      setActiveResult('roadmap');
    }
    if (savedKpContext?.kpId && !savedMeta) {
      setSavedMeta({ id: savedKpContext.kpId, created_at: '' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedKpContext]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = Array.from(e.target.files || []);
    const results: UploadedFile[] = [];

    for (const file of uploaded) {
      const { text, b64 } = await readFile(file);
      results.push({ name: file.name, text, size: file.size, b64 });
    }

    setFiles(prev => [...prev, ...results]);
    toast({ title: `Загружено файлов: ${results.length}`, description: results.map(f => f.name).join(', ') });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const readFile = (file: File): Promise<{ text: string; b64?: string }> => {
    return new Promise((resolve) => {
      const isText = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.csv') || file.name.endsWith('.json');
      const isBinary = file.name.endsWith('.pdf') || file.name.endsWith('.docx') || file.name.endsWith('.doc');

      if (isText) {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ text: (e.target?.result as string) || '' });
        reader.onerror = () => resolve({ text: `[Ошибка чтения: ${file.name}]` });
        reader.readAsText(file, 'utf-8');
      } else if (isBinary) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const b64 = (e.target?.result as string).split(',')[1] || '';
          resolve({ text: `[${file.name}]`, b64 });
        };
        reader.onerror = () => resolve({ text: `[Ошибка чтения: ${file.name}]` });
        reader.readAsDataURL(file);
      } else {
        resolve({ text: `[Файл: ${file.name}, размер: ${(file.size / 1024).toFixed(1)} KB]` });
      }
    });
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const getFilesText = () =>
    files.filter(f => !f.b64).map(f => `=== ФАЙЛ: ${f.name} ===\n${f.text}`).join('\n\n');

  const getFilesB64 = () =>
    files.filter(f => f.b64).map(f => ({ name: f.name, data: f.b64! }));

  const saveKP = async (kp: KPData): Promise<string | null> => {
    try {
      const res = await fetch(KP_STORAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_kp', kp_data: kp, files_text: getFilesText(), extra_prompt: extraPrompt }),
      });
      const data = await res.json();
      return data.id || null;
    } catch {
      return null;
    }
  };

  const saveRoadmap = async (roadmap: RoadmapData, kpId: string | null): Promise<string | null> => {
    try {
      const res = await fetch(KP_STORAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_roadmap', roadmap_data: roadmap, kp_id: kpId }),
      });
      const data = await res.json();
      return data.id || null;
    } catch {
      return null;
    }
  };

  const handleSendToProduction = async () => {
    if (!kpData || !savedMeta) return;
    setSendingToProduction(true);
    try {
      await fetch(KP_STORAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_to_production', kp_id: savedMeta.id }),
      });
      onSendToProduction?.(kpData, roadmapData, getFilesText(), savedMeta.id);
      toast({ title: 'Передано в производство', description: 'КП и дорожная карта направлены в раздел Производство' });
    } finally {
      setSendingToProduction(false);
    }
  };

  const pollJob = async (jobId: string, maxWaitMs = 180000): Promise<Record<string, unknown>> => {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      await new Promise(r => setTimeout(r, 3000));
      const res = await fetch(GENERATE_KP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_job', job_id: jobId }),
      });
      const data = await res.json();
      if (data.status === 'done') return data.data;
      if (data.status === 'error') throw new Error(data.error || 'Ошибка генерации');
    }
    throw new Error('Превышено время ожидания (3 мин)');
  };

  const generateKP = async () => {
    if (files.length === 0) {
      toast({ title: 'Загрузите файлы', description: 'Необходимо загрузить хотя бы один файл с ТЗ', variant: 'destructive' });
      return;
    }
    setLoadingKP(true);
    try {
      toast({ title: 'Анализирую ТЗ...', description: 'DeepSeek читает документ и составляет КП (~1 мин)' });
      const startRes = await fetch(GENERATE_KP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_kp', files_text: getFilesText(), files_b64: getFilesB64(), extra_prompt: extraPrompt }),
      });
      const startData = await startRes.json();
      if (!startData.job_id) throw new Error(startData.error || 'Не удалось запустить задачу');

      const result = await pollJob(startData.job_id);
      if (result.kp) {
        const kp = result.kp as KPData;
        setKpData(kp);
        setActiveResult('kp');
        const kpId = await saveKP(kp);
        if (kpId) {
          setSavedMeta(prev => ({ ...(prev || {}), id: kpId, created_at: new Date().toISOString() }));
          onKpReady?.(kp as unknown as Record<string, unknown>, getFilesText(), kpId);
          toast({ title: 'КП сформировано и сохранено', description: 'Коммерческое предложение готово к скачиванию' });
        } else {
          toast({ title: 'КП сформировано', description: 'Готово к скачиванию (сохранение не удалось)' });
        }
      } else {
        throw new Error('Неверный формат ответа');
      }
    } catch (e) {
      toast({ title: 'Ошибка генерации', description: e instanceof Error ? e.message : String(e), variant: 'destructive' });
    } finally {
      setLoadingKP(false);
    }
  };

  const generateRoadmap = async () => {
    if (files.length === 0) {
      toast({ title: 'Загрузите файлы', description: 'Необходимо загрузить хотя бы один файл', variant: 'destructive' });
      return;
    }
    setLoadingRoadmap(true);
    try {
      toast({ title: 'Составляю дорожную карту...', description: 'DeepSeek анализирует проект (~1 мин)' });
      const startRes = await fetch(GENERATE_KP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_roadmap', files_text: getFilesText(), files_b64: getFilesB64(), extra_prompt: extraPrompt, kp_data: kpData }),
      });
      const startData = await startRes.json();
      if (!startData.job_id) throw new Error(startData.error || 'Не удалось запустить задачу');

      const result = await pollJob(startData.job_id);
      if (result.roadmap) {
        const roadmap = result.roadmap as RoadmapData;
        setRoadmapData(roadmap);
        setActiveResult('roadmap');
        const rmId = await saveRoadmap(roadmap, savedMeta?.id || null);
        if (rmId) {
          setSavedMeta(prev => prev ? { ...prev, roadmap_id: rmId } : null);
          toast({ title: 'Дорожная карта готова и сохранена', description: 'Карта реализации проекта сформирована' });
        } else {
          toast({ title: 'Дорожная карта готова', description: 'Карта сформирована (сохранение не удалось)' });
        }
        // Сразу сообщаем Admin — productionContext обновится без нажатия "В производство"
        onRoadmapReady?.(
          roadmap as unknown as Record<string, unknown>,
          kpData as unknown as Record<string, unknown> | null,
          getFilesText(),
          savedMeta?.id || null
        );
      } else {
        throw new Error('Неверный формат ответа');
      }
    } catch (e) {
      toast({ title: 'Ошибка генерации', description: e instanceof Error ? e.message : String(e), variant: 'destructive' });
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const exportToPDF = (type: 'kp' | 'roadmap') => {
    const content = type === 'kp' ? buildKPHtml() : buildRoadmapHtml();
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(content);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const exportToWord = (type: 'kp' | 'roadmap') => {
    const content = type === 'kp' ? buildKPHtml() : buildRoadmapHtml();
    const blob = new Blob(['\ufeff' + content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'kp' ? 'commercial_proposal.doc' : 'roadmap.doc';
    a.click();
    URL.revokeObjectURL(url);
  };

  const buildKPHtml = () => {
    if (!kpData) return '';
    const tableRows = kpData.sections.flatMap(s =>
      s.items.map(item => `
        <tr>
          <td style="border:1px solid #ddd;padding:6px;font-size:11px">${item.code}</td>
          <td style="border:1px solid #ddd;padding:6px;font-size:11px">${item.name}</td>
          <td style="border:1px solid #ddd;padding:6px;text-align:center;font-size:11px">${item.unit}</td>
          <td style="border:1px solid #ddd;padding:6px;text-align:right;font-size:11px">${item.volume}</td>
          <td style="border:1px solid #ddd;padding:6px;text-align:right;font-size:11px">${formatMoney(item.price_per_unit)}</td>
          <td style="border:1px solid #ddd;padding:6px;text-align:right;font-size:11px;font-weight:bold">${formatMoney(item.total)}</td>
        </tr>
      `)
    ).join('');

    return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>Коммерческое предложение</title>
    <style>body{font-family:Arial,sans-serif;margin:40px;color:#1a1a1a}h1{color:#1a3a6c;font-size:22px}h2{color:#1a3a6c;font-size:16px;border-bottom:2px solid #1a3a6c;padding-bottom:4px}table{width:100%;border-collapse:collapse;margin:12px 0}th{background:#1a3a6c;color:#fff;padding:8px;text-align:left;font-size:12px}p{font-size:12px;line-height:1.6}.total{font-size:16px;font-weight:bold;color:#1a3a6c;text-align:right;margin-top:16px}</style>
    </head><body>
    <h1>КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</h1>
    <p><b>Дата:</b> ${kpData.date}</p>
    ${kpData.client ? `<p><b>Клиент:</b> ${kpData.client}</p>` : ''}
    <h2>Краткое резюме</h2><p>${kpData.summary}</p>
    <h2>Расчёт стоимости</h2>
    <table><thead><tr><th>Код</th><th>Наименование</th><th>Ед.</th><th>Объём</th><th>Цена за ед.</th><th>Итого</th></tr></thead>
    <tbody>${tableRows}</tbody></table>
    <div class="total">ИТОГО: ${formatMoney(kpData.total_sum)}</div>
    <h2>Сроки реализации</h2>
    ${(kpData.timeline || []).map(t => `<p><b>${t.phase}</b> (${t.duration}): ${t.description}</p>`).join('')}
    <h2>Условия работы</h2>
    ${(kpData.payment_conditions || kpData.conditions || []).map((c: string) => `<p>• ${c}</p>`).join('')}
    ${(kpData.special_conditions || []).map((c: string) => `<p>• ${c}</p>`).join('')}
    <p><b>Срок действия КП:</b> ${kpData.validity}</p>
    </body></html>`;
  };

  const buildRoadmapHtml = () => {
    if (!roadmapData) return '';
    return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>Дорожная карта</title>
    <style>body{font-family:Arial,sans-serif;margin:40px;color:#1a1a1a}h1{color:#1a3a6c;font-size:22px}h2{color:#1a3a6c;font-size:16px;border-bottom:2px solid #1a3a6c;padding-bottom:4px}table{width:100%;border-collapse:collapse;margin:12px 0}th{background:#1a3a6c;color:#fff;padding:8px;text-align:left;font-size:12px}td{border:1px solid #ddd;padding:7px;font-size:11px}p{font-size:12px;line-height:1.6}.risk-high{color:#dc2626}.risk-mid{color:#d97706}.risk-low{color:#16a34a}</style>
    </head><body>
    <h1>ДОРОЖНАЯ КАРТА РЕАЛИЗАЦИИ ПРОЕКТА</h1>
    <p><b>Проект:</b> ${roadmapData.project_name}</p>
    <p><b>Общая продолжительность:</b> ${roadmapData.total_duration}</p>
    <h2>Обзор</h2><p>${roadmapData.overview}</p>
    <h2>Этапы реализации</h2>
    <table><thead><tr><th>#</th><th>Этап</th><th>Срок</th><th>Задачи</th><th>Результаты</th><th>Ответственный</th></tr></thead>
    <tbody>${roadmapData.phases.map(p => `<tr>
      <td>${p.id}</td><td><b>${p.name}</b></td><td>${p.duration}</td>
      <td>${p.tasks.join('<br>')}</td><td>${p.deliverables.join('<br>')}</td><td>${p.responsible}</td>
    </tr>`).join('')}</tbody></table>
    <h2>Ключевые вехи</h2>
    <table><thead><tr><th>Неделя</th><th>Веха</th><th>Критерий приёмки</th></tr></thead>
    <tbody>${roadmapData.milestones.map(m => `<tr><td>${m.week}</td><td>${m.name}</td><td>${m.criteria}</td></tr>`).join('')}</tbody></table>
    <h2>Риски проекта</h2>
    <table><thead><tr><th>Риск</th><th>Вероятность</th><th>Влияние</th><th>Митигация</th></tr></thead>
    <tbody>${roadmapData.risks.map(r => `<tr><td>${r.risk}</td><td>${r.probability}</td><td>${r.impact}</td><td>${r.mitigation}</td></tr>`).join('')}</tbody></table>
    <h2>Команда</h2>
    <table><thead><tr><th>Роль</th><th>Кол-во</th><th>Задачи</th></tr></thead>
    <tbody>${roadmapData.team.map(t => `<tr><td>${t.role}</td><td>${t.count}</td><td>${t.tasks}</td></tr>`).join('')}</tbody></table>
    <h2>Критический путь</h2>
    ${roadmapData.critical_path.map((c, i) => `<p>${i + 1}. ${c}</p>`).join('')}
    </body></html>`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
          <Icon name="Sparkles" size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Генерация КП через ИИ</h2>
          <p className="text-sm text-slate-400">Загрузите ТЗ и любые файлы — ИИ сформирует КП и дорожную карту</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-slate-900/60 border-violet-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Icon name="Upload" size={16} className="text-violet-400" />
                Загрузка файлов
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-violet-500/40 rounded-lg p-6 text-center cursor-pointer hover:border-violet-400/60 hover:bg-violet-500/5 transition-all"
              >
                <Icon name="FileUp" size={28} className="text-violet-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300">Нажмите для загрузки файлов</p>
                <p className="text-xs text-slate-500 mt-1">TXT, PDF, DOCX, XLSX, CSV, MD и другие</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".txt,.md,.csv,.json,.pdf,.doc,.docx,.xls,.xlsx,.rtf"
              />

              {files.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                      <Icon name="FileText" size={14} className="text-violet-400 shrink-0" />
                      <span className="text-xs text-slate-300 truncate flex-1">{f.name}</span>
                      <span className="text-xs text-slate-500">{(f.size / 1024).toFixed(0)}KB</span>
                      <button onClick={() => removeFile(i)} className="text-slate-500 hover:text-red-400 transition-colors">
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-violet-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Icon name="MessageSquare" size={16} className="text-violet-400" />
                Дополнительные требования
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={extraPrompt}
                onChange={e => setExtraPrompt(e.target.value)}
                placeholder="Укажите особые условия, пожелания клиента или уточнения к расчёту..."
                className="bg-slate-800/50 border-slate-600/50 text-slate-200 placeholder-slate-500 text-sm min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button
              onClick={generateKP}
              disabled={loadingKP || files.length === 0}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            >
              {loadingKP ? (
                <><Icon name="Loader2" size={16} className="mr-2 animate-spin" />Генерирую КП...</>
              ) : (
                <><Icon name="Sparkles" size={16} className="mr-2" />Сгенерировать КП</>
              )}
            </Button>
            <Button
              onClick={generateRoadmap}
              disabled={loadingRoadmap || files.length === 0}
              variant="outline"
              className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              {loadingRoadmap ? (
                <><Icon name="Loader2" size={16} className="mr-2 animate-spin" />Генерирую карту...</>
              ) : (
                <><Icon name="Map" size={16} className="mr-2" />Сгенерировать дорожную карту</>
              )}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!kpData && !roadmapData ? (
            <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-slate-700/50 rounded-xl">
              <div className="text-center text-slate-500">
                <Icon name="FileSearch" size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Загрузите файлы и нажмите кнопку генерации</p>
                <p className="text-xs mt-1">Результат появится здесь</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {(kpData || roadmapData) && (
                <div className="flex items-center gap-2">
                  {kpData && (
                    <button
                      onClick={() => setActiveResult('kp')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeResult === 'kp' ? 'bg-violet-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
                    >
                      <Icon name="FileText" size={14} className="inline mr-1" />КП
                    </button>
                  )}
                  {roadmapData && (
                    <button
                      onClick={() => setActiveResult('roadmap')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeResult === 'roadmap' ? 'bg-cyan-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
                    >
                      <Icon name="Map" size={14} className="inline mr-1" />Дорожная карта
                    </button>
                  )}
                  <div className="ml-auto flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportToPDF(activeResult)}
                      className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 text-xs"
                    >
                      <Icon name="FileDown" size={14} className="mr-1" />PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportToWord(activeResult)}
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-xs"
                    >
                      <Icon name="FileDown" size={14} className="mr-1" />Word
                    </Button>
                    {kpData && onSendToProduction && (
                      <Button
                        size="sm"
                        onClick={handleSendToProduction}
                        disabled={sendingToProduction}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                      >
                        {sendingToProduction ? (
                          <><Icon name="Loader2" size={14} className="mr-1 animate-spin" />Отправляю...</>
                        ) : (
                          <><Icon name="Factory" size={14} className="mr-1" />В производство</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {activeResult === 'kp' && kpData && (
                <Card className="bg-slate-900/60 border-violet-500/30 max-h-[600px] overflow-y-auto">
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{kpData.title}</h3>
                      {kpData.client && <p className="text-sm text-slate-400">Клиент: {kpData.client}</p>}
                      <p className="text-xs text-slate-500">Дата: {kpData.date} · Действительно: {kpData.validity}</p>
                    </div>
                    <p className="text-sm text-slate-300 bg-slate-800/40 rounded-lg p-3">{kpData.summary}</p>

                    {kpData.sections.map((section, si) => (
                      <div key={si}>
                        <h4 className="text-sm font-semibold text-violet-400 mb-2">{section.name}</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-slate-700/50">
                                <th className="text-left py-2 px-2 text-slate-500 font-medium">Код</th>
                                <th className="text-left py-2 px-2 text-slate-500 font-medium">Наименование</th>
                                <th className="text-right py-2 px-2 text-slate-500 font-medium">Ед.</th>
                                <th className="text-right py-2 px-2 text-slate-500 font-medium">Объём</th>
                                <th className="text-right py-2 px-2 text-slate-500 font-medium">Цена</th>
                                <th className="text-right py-2 px-2 text-slate-500 font-medium">Итого</th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.items.map((item, ii) => (
                                <tr key={ii} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                  <td className="py-2 px-2 text-slate-400 font-mono">{item.code}</td>
                                  <td className="py-2 px-2 text-slate-300">{item.name}{item.notes && <span className="text-slate-500 ml-1">({item.notes})</span>}</td>
                                  <td className="py-2 px-2 text-right text-slate-400">{item.unit}</td>
                                  <td className="py-2 px-2 text-right text-slate-300">{item.volume}</td>
                                  <td className="py-2 px-2 text-right text-slate-400">{formatMoney(item.price_per_unit)}</td>
                                  <td className="py-2 px-2 text-right text-white font-semibold">{formatMoney(item.total)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between items-center bg-gradient-to-r from-violet-900/30 to-purple-900/30 rounded-lg p-4 border border-violet-500/30">
                      <span className="text-slate-300 font-medium">ИТОГО по проекту:</span>
                      <span className="text-2xl font-bold text-white">{formatMoney(kpData.total_sum)}</span>
                    </div>

                    {kpData.timeline.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-violet-400 mb-2">Сроки реализации</h4>
                        <div className="space-y-2">
                          {kpData.timeline.map((t, ti) => (
                            <div key={ti} className="flex gap-3 bg-slate-800/30 rounded-lg p-3">
                              <Badge className="bg-violet-600/30 text-violet-300 border-violet-500/30 text-xs shrink-0">{t.duration}</Badge>
                              <div>
                                <p className="text-sm text-white font-medium">{t.phase}</p>
                                <p className="text-xs text-slate-400">{t.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeResult === 'roadmap' && roadmapData && (
                <Card className="bg-slate-900/60 border-cyan-500/30 max-h-[600px] overflow-y-auto">
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{roadmapData.project_name}</h3>
                      <p className="text-xs text-slate-400">Общая продолжительность: {roadmapData.total_duration}</p>
                    </div>
                    <p className="text-sm text-slate-300 bg-slate-800/40 rounded-lg p-3">{roadmapData.overview}</p>

                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">Этапы реализации</h4>
                      <div className="space-y-3">
                        {roadmapData.phases.map((phase) => (
                          <div key={phase.id} className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-xs font-bold text-cyan-400">{phase.id}</div>
                              <span className="text-sm font-semibold text-white">{phase.name}</span>
                              <Badge className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30 text-xs ml-auto">{phase.duration}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                              <div>
                                <p className="text-slate-500 mb-1">Задачи:</p>
                                {phase.tasks.map((t, ti) => <p key={ti} className="text-slate-300">• {t}</p>)}
                              </div>
                              <div>
                                <p className="text-slate-500 mb-1">Результаты:</p>
                                {phase.deliverables.map((d, di) => <p key={di} className="text-slate-300">• {d}</p>)}
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Ответственный: <span className="text-slate-400">{phase.responsible}</span></p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {roadmapData.milestones.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-cyan-400 mb-2">Ключевые вехи</h4>
                        <div className="space-y-2">
                          {roadmapData.milestones.map((m, mi) => (
                            <div key={mi} className="flex gap-3 items-start bg-slate-800/30 rounded-lg p-2">
                              <Badge className="bg-slate-700 text-slate-300 text-xs shrink-0">Мес. {m.month ?? m.week}</Badge>
                              <div>
                                <p className="text-sm text-white font-medium">{m.name}</p>
                                <p className="text-xs text-slate-400">{m.criteria}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {roadmapData.risks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-cyan-400 mb-2">Риски</h4>
                        <div className="space-y-2">
                          {roadmapData.risks.map((r, ri) => (
                            <div key={ri} className="bg-slate-800/30 rounded-lg p-3">
                              <div className="flex gap-2 mb-1">
                                <span className="text-sm text-white">{r.risk}</span>
                                <Badge className={`text-xs border ml-auto ${riskColor(r.probability)}`}>{r.probability}</Badge>
                              </div>
                              <p className="text-xs text-slate-400">Митигация: {r.mitigation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {roadmapData.team.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-cyan-400 mb-2">Команда</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {roadmapData.team.map((t, ti) => (
                            <div key={ti} className="bg-slate-800/30 rounded-lg p-2 text-xs">
                              <p className="text-white font-medium">{t.role} <span className="text-slate-400">×{t.count}</span></p>
                              <p className="text-slate-400 mt-0.5">{t.tasks}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};