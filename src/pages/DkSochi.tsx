import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const API_URL = "https://functions.poehali.dev/48de52d9-7a27-4110-b87b-d00e64ff6c66";

async function imgToBase64(url: string): Promise<string> {
  const res = await fetch(`${API_URL}?action=image-proxy&url=${encodeURIComponent(url)}`);
  const data = await res.json();
  if (data.dataUrl) return data.dataUrl;
  throw new Error("image-proxy: no dataUrl");
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="mt-7 mb-3">
      <div className="flex items-center gap-2">
        <div className="bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded">{num}</div>
        <span className="font-bold text-sm text-gray-800 uppercase tracking-wide">{title}</span>
      </div>
      <div className="h-[2px] bg-gray-800 mt-1.5" />
    </div>
  );
}

const CONTRADICTIONS = [
  {
    n: 1,
    problem: "«Перепрофилирование» vs реконструкция",
    detail: "Термин не предусмотрен ГрК РФ. Изменение функционального назначения – это реконструкция (ст.1 ГрК РФ).",
    fix: "Все работы квалифицированы как реконструкция; разрабатывается раздел ПОС, меняются ТЭП.",
  },
  {
    n: 2,
    problem: "Экспертиза «при необходимости»",
    detail: "Неопределённость: разрешение на строительство требует обязательной экспертизы.",
    fix: "Обязательная негосударственная экспертиза включена в состав работ (этап 4).",
  },
  {
    n: 3,
    problem: "Отсутствие раздела ПОС",
    detail: "Без ПОС невозможно получить разрешение на строительство при реконструкции.",
    fix: "Раздел «Проект организации строительства» (ПОС) добавлен в этап 3.",
  },
  {
    n: 4,
    problem: "Изменение ВРИ – обязанность проектировщика",
    detail: "Административная процедура, не входящая в функции проектировщика.",
    fix: "Исключено из работ. Раздел ВРИ — бесплатно выполним мы. Заказчик меняет ВРИ самостоятельно (при необходимости).",
  },
  {
    n: 5,
    problem: "Отдельное согласование с Госпожнадзором",
    detail: "Противоречит 123-ФЗ: проверка ПБ проводится внутри экспертизы.",
    fix: "Убрано отдельное согласование. Пожарные требования верифицируются при экспертизе.",
  },
  {
    n: 6,
    problem: "Целевая вместимость 150 детей",
    detail: "При площади 2063 м² и нормах СанПиН достижимо только 80–110 детей.",
    fix: "Рекомендуемая вместимость 100 детей (гарантия экспертизы); допустима до 120 с рисками.",
  },
  {
    n: 7,
    problem: "Проверка материалов специалистом по охране труда",
    detail: "Специалист по охране труда некомпетентен в проверке СанПиН.",
    fix: "Исключено. Контроль – силами профильных экспертов команды.",
  },
];

const STAGE1 = [
  { n: "1.1", name: "Сбор исходных данных, анализ техпаспортов БТИ", days: "1–3", result: "Реестр предоставленных документов" },
  { n: "1.2", name: "Инженерно-геодезические изыскания (топосъёмка М 1:500)", days: "4–12", result: "План участка в цифровом виде (DWG)" },
  { n: "1.3", name: "Инженерно-геологические изыскания (6 скважин по 10 м)", days: "4–20", result: "Геологический разрез, отчёт с рекомендациями" },
  { n: "1.4", name: "Техническое обследование строительных конструкций (ГОСТ 31937-2024)", days: "10–25", result: "Акт/отчёт с категориями техсостояния, дефектная ведомость" },
  { n: "1.5", name: "Техническое обследование инженерных систем (водоснабжение, канализация, эл/снабжение, вентиляция)", days: "15–28", result: "Отчёт о возможности использования/модернизации" },
  { n: "1.6", name: "Сводный отчёт по этапу 1, передача Заказчику", days: "29–30", result: "Электронная версия + 2 экз. на бумаге" },
];

const STAGE2 = [
  { n: "2.1", name: "Разработка функционального зонирования (2 здания, 5–6 групп)", days: "31–35", result: "Схемы зонирования 1:200" },
  { n: "2.2", name: "Варианты планировочных решений (не менее 2-х)", days: "36–42", result: "2 варианта поэтажных планов" },
  { n: "2.3", name: "Согласование варианта с Заказчиком (онлайн-презентация)", days: "43–44", result: "Протокол выбора финальной концепции" },
  { n: "2.4", name: "Эскизные фасады, разрезы, 3D-визуализация", days: "45–48", result: "4 ракурса фасадов + теневые навесы" },
  { n: "2.5", name: "Предварительный расчёт вместимости (100 детей) и соответствия нормам", days: "49–50", result: "Справка-обоснование, подписанная архитектором" },
];

const STAGE3 = [
  { code: "3.1", name: "Пояснительная записка (ПЗ) с обоснованием реконструкции и сравнением ТЭП", days: "51–57", sheets: "25–30" },
  { code: "3.2", name: "Схема планировочной организации земельного участка (ПОЗУ)", days: "58–65", sheets: "8–10" },
  { code: "3.3", name: "Архитектурные решения (АР) – планы, фасады, разрезы, экспликации", days: "66–80", sheets: "12–15" },
  { code: "3.4", name: "Конструктивные решения (КР) – усиление проёмов, замена перекрытий, огнезащита", days: "81–88", sheets: "10–12" },
  { code: "3.5", name: "Инженерное оборудование (ИОС1-6): отопление, вентиляция, водоснабжение, канализация, электроснабжение, слаботочные системы", days: "89–102", sheets: "25–30" },
  { code: "3.6", name: "Мероприятия по обеспечению пожарной безопасности (ПБ)", days: "95–100", sheets: "8–10" },
  { code: "3.7", name: "Проект организации строительства (ПОС) — добавлен взамен отсутствовавшего в ТЗ", days: "100–105", sheets: "10–12" },
  { code: "3.8", name: "Перечень мероприятий по охране окружающей среды (ООС)", days: "100–105", sheets: "6–8" },
  { code: "3.9", name: "Мероприятия по обеспечению доступа маломобильных групп (МГН)", days: "103–106", sheets: "5–7" },
  { code: "3.10", name: "Сметная документация (базисный и текущий уровень цен) — отдельный том", days: "106–110", sheets: "15–20" },
];

const STAGE4 = [
  { n: "4.1", name: "Подача документов в экспертную организацию (аккредитованную)", days: "111–112", result: "Регистрация заявки" },
  { n: "4.2", name: "Проверка комплектности, предварительное рецензирование", days: "113–114", result: "Протокол замечаний (при наличии)" },
  { n: "4.3", name: "Устранение замечаний (без увеличения срока, работа в режиме 24/7)", days: "115–117", result: "Скорректированные тома ПД" },
  { n: "4.4", name: "Повторная проверка, выдача положительного заключения на ПД и результаты изысканий", days: "118–120", result: "Оригинал заключения (с печатями)" },
];

const STAGE5 = [
  { n: "5.1", name: "Формирование бумажного комплекта: ПД (4 экз.), заключение экспертизы, СЭЗ", result: "Готово к передаче" },
  { n: "5.2", name: "Передача электронной версии (PDF, DWG, DOCX, XLSX) на диске или по ссылке", result: "Подтверждение получения" },
  { n: "5.3", name: "Подписание итогового акта сдачи-приёмки выполненных работ (форма КС-2, КС-3)", result: "Акт, счёт-фактура" },
  { n: "5.4", name: "Выставление окончательного платежа (40% от цены)", result: "Платёж в течение 10 банковских дней" },
];

const PAYMENTS = [
  { n: "1 (аванс)", pct: "30%", sum: 1_390_800, deadline: "В течение 5 дней после подписания договора", basis: "Подписанный договор, счёт" },
  { n: "2", pct: "30%", sum: 1_390_800, deadline: "После подписания акта этапов 1+2 (день ~50)", basis: "Акт приёмки изысканий и концепции" },
  { n: "3", pct: "40%", sum: 1_854_400, deadline: "После подписания итогового акта (день 120)", basis: "Готовый комплект ПД, экспертиза, СЭЗ" },
];

const KT = [
  { code: "КТ1", desc: "Завершены изыскания и техобследование", day: "30", quality: "Отчёты переданы, нет возражений Заказчика" },
  { code: "КТ2", desc: "Утверждена концепция и эскиз", day: "50", quality: "Протокол выбора планировки, подпись Заказчика" },
  { code: "КТ3", desc: "Комплект ПД полностью передан в экспертизу", day: "110", quality: "Полнота разделов по №87 (включая ПОС, ООС, сметы)" },
  { code: "КТ4", desc: "Получено положительное заключение экспертизы", day: "120", quality: "Оригинал на бумаге, без замечаний по существу" },
  { code: "КТ5", desc: "Итоговый акт приёмки", day: "120 + 10 дней на оплату", quality: "Подписаны КС-2, КС-3, выставлен счёт-фактура" },
];

const RISKS = [
  { risk: "Задержка исходных данных от Заказчика", prob: "Низкая", impact: "Среднее", reserve: "В договоре фиксируется 10 дней на предоставление документов; простой – перенос сроков" },
  { risk: "Отказ в экспертизе по несоответствию СанПиН", prob: "Низкая", impact: "Высокое", reserve: "Предварительная проверка ПД внутренним экспертом; вместимость 100 детей заложена с запасом" },
  { risk: "Необходимость увеличения вместимости до 120", prob: "Средняя", impact: "Среднее", reserve: "Дополнительное соглашение на обоснование отступлений (+15% к цене, +20 дней)" },
  { risk: "Рост стоимости субподрядных изысканий", prob: "Низкая", impact: "Низкое", reserve: "Цена фиксирована, риск на Исполнителе" },
];

const TZ_CORRECTIONS = [
  { old: "П.3 Цель: «перепрофилирование»", fixed: "Реконструкция, изменение ТЭП (вместимость до 100 детей)" },
  { old: "П.5 Согласования – Госпожнадзор", fixed: "Исключён; ПБ проверяется в экспертизе (этап 4)" },
  { old: "П.5 – изменение ВРИ (администрация)", fixed: "Исключён; Заказчик выполняет самостоятельно" },
  { old: "П.4 Состав ПД – отсутствовал ПОС", fixed: "Добавлен подэтап 3.7" },
  { old: "П.7 – экспертиза «при необходимости»", fixed: "Обязательная негосударственная экспертиза (этап 4)" },
  { old: "П.3 – вместимость 150 детей", fixed: "Рекомендуемая 100 детей (с возможностью увеличения до 120 с рисками)" },
  { old: "П.12 – проверка специалистом по охране труда", fixed: "Исключён; экспертиза и внутренний контроль команды бюро" },
];

// Gantt bars: each item [label, startDay, endDay]
const GANTT = [
  { label: "Этап 1 — Изыскания и техобследование", start: 1, end: 30, color: "#1e3a5f" },
  { label: "Этап 2 — Концепция и эскиз", start: 31, end: 50, color: "#2563eb" },
  { label: "Этап 3 — Разработка разделов ПД", start: 51, end: 110, color: "#0f766e" },
  { label: "Подэтапы 3.7–3.9 (ПОС, ООС, МГН)", start: 100, end: 110, color: "#7c3aed" },
  { label: "Этап 4 — Экспертиза", start: 111, end: 120, color: "#b45309" },
  { label: "Этап 5 — Передача документации", start: 120, end: 120, color: "#be123c" },
];

function GanttBar({ label, start, end, color }: { label: string; start: number; end: number; color: string }) {
  const total = 120;
  const leftPct = ((start - 1) / total) * 100;
  const widthPct = Math.max(((end - start + 1) / total) * 100, 0.8);
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <div className="text-xs text-gray-600 w-64 flex-shrink-0 text-right pr-2 leading-tight">{label}</div>
      <div className="flex-1 relative h-5">
        <div
          className="absolute h-full rounded text-white text-xs flex items-center pl-1.5 font-medium overflow-hidden"
          style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: color, minWidth: 4 }}
        >
          {widthPct > 5 ? `${start}–${end}` : ""}
        </div>
      </div>
    </div>
  );
}

export default function DkSochi() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [logoB64, setLogoB64] = useState<string>(LOGO_URL);
  const [stampB64, setStampB64] = useState<string>(STAMP_URL);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const [logo, stamp] = await Promise.all([imgToBase64(LOGO_URL), imgToBase64(STAMP_URL)]);
      setLogoB64(logo);
      setStampB64(stamp);
      await new Promise((r) => setTimeout(r, 200));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: false,
        allowTaint: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
        logging: false,
      });

      const pageW = 210;
      const pageH = 297;
      const imgW = pageW;
      const imgH = (canvas.height / canvas.width) * imgW;
      const bgData = canvas.toDataURL("image/jpeg", 0.95);

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      let remaining = imgH;
      let page = 0;
      while (remaining > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(bgData, "JPEG", 0, -page * pageH, imgW, imgH, undefined, "FAST");
        if (remaining > pageH) {
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, pageH, pageW, imgH + 10, "F");
        }
        remaining -= pageH;
        page++;
      }
      pdf.save("ДорожнаяКарта_КапстройИнжиниринг_Сочи.pdf");
    } catch (e) {
      console.error(e);
    } finally {
      setLogoB64(LOGO_URL);
      setStampB64(STAMP_URL);
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-[960px] mx-auto mb-4 flex justify-end">
        <Button onClick={handleExport} disabled={exporting} className="gap-2">
          <Icon name="Download" size={16} />
          {exporting ? "Формируется PDF..." : "Скачать дорожную карту в PDF"}
        </Button>
      </div>

      <div
        ref={reportRef}
        className="max-w-[960px] mx-auto bg-white text-gray-900 p-10 shadow-lg"
        style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", lineHeight: "1.5" }}
      >
        {/* ШАПКА */}
        <div className="flex justify-between items-start mb-5">
          <img src={logoB64} alt="Логотип" style={{ height: 60, objectFit: "contain" }} />
          <div className="text-right">
            <div className="font-bold text-lg text-gray-800 uppercase tracking-wide">Дорожная карта проекта</div>
            <div className="text-sm text-gray-600">ООО «Капстрой Инжиниринг»</div>
          </div>
        </div>
        <div className="h-[2px] bg-gray-800 mb-4" />

        {/* РЕКВИЗИТЫ */}
        <div className="mb-4 border border-gray-200 rounded p-3 bg-gray-50 text-xs">
          <div className="font-bold text-sm text-gray-800 mb-2">Реквизиты исполнителя</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
            <div><span className="text-gray-500">Полное наименование:</span> ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
            <div><span className="text-gray-500">ОГРН:</span> 1217800122649</div>
            <div><span className="text-gray-500">ИНН:</span> 7814795454</div>
            <div><span className="text-gray-500">КПП:</span> 781401001</div>
            <div className="col-span-2"><span className="text-gray-500">Юридический адрес:</span> 197341, г. Санкт-Петербург, Фермское шоссе, д. 12, лит. Ж, пом. 310-Н к3</div>
            <div><span className="text-gray-500">Банк:</span> ПАО «Сбербанк»</div>
            <div><span className="text-gray-500">БИК:</span> 044030653</div>
            <div><span className="text-gray-500">Расч. счёт:</span> 40702810655040010501</div>
            <div><span className="text-gray-500">Корр. счёт:</span> 30101810500000000653</div>
          </div>
        </div>

        {/* ЗАГОЛОВОК */}
        <div className="bg-gray-800 text-white p-4 rounded mb-4">
          <div className="font-bold text-sm text-center leading-snug">
            Разработка проектной документации для реконструкции двух зданий под детский сад
          </div>
          <div className="text-xs text-center mt-1 text-gray-300">
            г. Сочи, Адлерский район, с. Эстосадок, Набережная лаванда, д. 8
          </div>
        </div>

        {/* ОБЩИЕ ПАРАМЕТРЫ */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="border border-gray-200 rounded p-3 bg-gray-50">
            <div className="text-xs text-gray-500 mb-0.5">Объект</div>
            <div className="text-xs font-medium">Здание «Урал» (677 м²) + Здание «Москва» (1386 м²)</div>
          </div>
          <div className="border border-gray-200 rounded p-3 bg-gray-50">
            <div className="text-xs text-gray-500 mb-0.5">Цель</div>
            <div className="text-xs font-medium">ПД для реконструкции под детский сад на 100 детей с экспертизой</div>
          </div>
          <div className="border border-gray-200 rounded p-3 bg-gray-50">
            <div className="text-xs text-gray-500 mb-0.5">Срок</div>
            <div className="text-xs font-medium">120 календарных дней с даты подписания договора и аванса</div>
          </div>
          <div className="border border-gray-200 rounded p-3 bg-gray-50">
            <div className="text-xs text-gray-500 mb-0.5">Оплата</div>
            <div className="text-xs font-medium">30% / 30% / 40% · Общая цена: {fmt(4_636_000)} (вкл. НДС 22%)</div>
          </div>
        </div>

        {/* 1. КОРРЕКТИРОВКИ ТЗ */}
        <SectionTitle num="1" title="Корректировка исходного ТЗ: устранение 7 ключевых противоречий" />
        <table className="w-full text-xs border-collapse mb-2">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-1.5 text-center border border-gray-300 w-6">№</th>
              <th className="p-1.5 text-left border border-gray-300 w-[28%]">Проблема исходного ТЗ</th>
              <th className="p-1.5 text-left border border-gray-300 w-[35%]">Суть противоречия</th>
              <th className="p-1.5 text-left border border-gray-300">Исправление</th>
            </tr>
          </thead>
          <tbody>
            {CONTRADICTIONS.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-1.5 border border-gray-200 text-center font-bold">{r.n}</td>
                <td className="p-1.5 border border-gray-200 font-medium">{r.problem}</td>
                <td className="p-1.5 border border-gray-200 text-gray-600">{r.detail}</td>
                <td className="p-1.5 border border-gray-200 text-gray-700">{r.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 2. ДИАГРАММА ГАНТА */}
        <SectionTitle num="2" title="Диаграмма Ганта (120 календарных дней)" />
        <div className="border border-gray-200 rounded p-3 bg-gray-50 mb-2">
          {/* Шкала */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-64 flex-shrink-0" />
            <div className="flex-1 relative h-4">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map((d) => (
                <span
                  key={d}
                  className="absolute text-xs text-gray-400 transform -translate-x-1/2"
                  style={{ left: `${(d / 120) * 100}%` }}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
          {/* Шкала-линия */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-64 flex-shrink-0" />
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          {GANTT.map((g, i) => (
            <GanttBar key={i} {...g} />
          ))}
          {/* КТ */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-64 flex-shrink-0 text-right pr-2 text-xs text-gray-400">Контрольные точки</div>
            <div className="flex-1 relative h-5">
              {[30, 50, 110, 120].map((d) => (
                <div
                  key={d}
                  className="absolute h-5 flex items-center"
                  style={{ left: `${((d - 1) / 120) * 100}%` }}
                >
                  <div className="w-0.5 h-5 bg-red-500" />
                  <span className="text-red-500 text-xs ml-0.5 whitespace-nowrap">КТ</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. ЭТАП 1 */}
        <SectionTitle num="3" title="Этап 1 — Инженерные изыскания и техническое обследование (дни 1–30)" />
        <div className="text-xs text-gray-500 mb-1">Ответственный: главный инженер проекта + геологическая группа</div>
        <table className="w-full text-xs border-collapse mb-1">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="p-1.5 text-center border border-gray-300 w-8">№</th>
              <th className="p-1.5 text-left border border-gray-300">Подэтап</th>
              <th className="p-1.5 text-center border border-gray-300 w-16">Дни</th>
              <th className="p-1.5 text-left border border-gray-300">Результат</th>
            </tr>
          </thead>
          <tbody>
            {STAGE1.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-1.5 border border-gray-200 text-center font-mono text-gray-500">{r.n}</td>
                <td className="p-1.5 border border-gray-200">{r.name}</td>
                <td className="p-1.5 border border-gray-200 text-center font-medium">{r.days}</td>
                <td className="p-1.5 border border-gray-200 text-gray-600">{r.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-blue-50 border-l-4 border-blue-500 px-3 py-1.5 text-xs mb-2">
          <span className="font-bold">КТ1: день 30</span> — подписание акта приёмки этапа 1, основание для оплаты 2-го платежа (30%).
        </div>

        {/* 4. ЭТАП 2 */}
        <SectionTitle num="4" title="Этап 2 — Концепция и эскизный проект (дни 31–50)" />
        <div className="text-xs text-gray-500 mb-1">Зависит от: этапа 1 (все отчёты)</div>
        <table className="w-full text-xs border-collapse mb-1">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-1.5 text-center border border-gray-300 w-8">№</th>
              <th className="p-1.5 text-left border border-gray-300">Подэтап</th>
              <th className="p-1.5 text-center border border-gray-300 w-16">Дни</th>
              <th className="p-1.5 text-left border border-gray-300">Результат</th>
            </tr>
          </thead>
          <tbody>
            {STAGE2.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-1.5 border border-gray-200 text-center font-mono text-gray-500">{r.n}</td>
                <td className="p-1.5 border border-gray-200">{r.name}</td>
                <td className="p-1.5 border border-gray-200 text-center font-medium">{r.days}</td>
                <td className="p-1.5 border border-gray-200 text-gray-600">{r.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-blue-50 border-l-4 border-blue-500 px-3 py-1.5 text-xs mb-2">
          <span className="font-bold">КТ2: день 50</span> — утверждённая концепция. Переход ко 2-му платежу (этапы 1+2 → оплата 30%).
        </div>

        {/* 5. ЭТАП 3 */}
        <SectionTitle num="5" title="Этап 3 — Разработка разделов проектной документации (дни 51–110)" />
        <div className="text-xs text-gray-500 mb-1">Полный состав по Постановлению №87 + скорректированный состав (ПОС, ООС, сметы)</div>
        <table className="w-full text-xs border-collapse mb-1">
          <thead>
            <tr className="bg-teal-700 text-white">
              <th className="p-1.5 text-center border border-gray-300 w-12">Код</th>
              <th className="p-1.5 text-left border border-gray-300">Раздел</th>
              <th className="p-1.5 text-center border border-gray-300 w-16">Дни</th>
              <th className="p-1.5 text-center border border-gray-300 w-20">Листов А1</th>
            </tr>
          </thead>
          <tbody>
            {STAGE3.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-1.5 border border-gray-200 text-center font-mono font-bold text-gray-600">{r.code}</td>
                <td className="p-1.5 border border-gray-200">{r.name}</td>
                <td className="p-1.5 border border-gray-200 text-center font-medium">{r.days}</td>
                <td className="p-1.5 border border-gray-200 text-center text-gray-600">{r.sheets}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-blue-50 border-l-4 border-blue-500 px-3 py-1.5 text-xs mb-2">
          <span className="font-bold">КТ3: день 110</span> — полный комплект ПД передан в экспертную организацию. Подписан акт внутренней приёмки.
        </div>

        {/* 6. ЭТАП 4 */}
        <SectionTitle num="6" title="Этап 4 — Негосударственная экспертиза и корректировка ПД (дни 111–120)" />
        <table className="w-full text-xs border-collapse mb-1">
          <thead>
            <tr className="bg-amber-700 text-white">
              <th className="p-1.5 text-center border border-gray-300 w-8">№</th>
              <th className="p-1.5 text-left border border-gray-300">Подэтап</th>
              <th className="p-1.5 text-center border border-gray-300 w-16">Дни</th>
              <th className="p-1.5 text-left border border-gray-300">Результат</th>
            </tr>
          </thead>
          <tbody>
            {STAGE4.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-1.5 border border-gray-200 text-center font-mono text-gray-500">{r.n}</td>
                <td className="p-1.5 border border-gray-200">{r.name}</td>
                <td className="p-1.5 border border-gray-200 text-center font-medium">{r.days}</td>
                <td className="p-1.5 border border-gray-200 text-gray-600">{r.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-blue-50 border-l-4 border-blue-500 px-3 py-1.5 text-xs mb-2">
          <span className="font-bold">КТ4: день 120</span> — положительное заключение негосударственной экспертизы. СЭЗ Роспотребнадзора — параллельный процесс (до 20 рабочих дней).
        </div>

        {/* 7. ЭТАП 5 */}
        <SectionTitle num="7" title="Этап 5 — Передача итоговой документации Заказчику (день 120)" />
        <table className="w-full text-xs border-collapse mb-2">
          <thead>
            <tr className="bg-rose-700 text-white">
              <th className="p-1.5 text-center border border-gray-300 w-8">№</th>
              <th className="p-1.5 text-left border border-gray-300">Действие</th>
              <th className="p-1.5 text-left border border-gray-300">Результат</th>
            </tr>
          </thead>
          <tbody>
            {STAGE5.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-1.5 border border-gray-200 text-center font-mono text-gray-500">{r.n}</td>
                <td className="p-1.5 border border-gray-200">{r.name}</td>
                <td className="p-1.5 border border-gray-200 text-gray-600">{r.result}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 8. ФИНАНСОВАЯ ДОРОЖНАЯ КАРТА */}
        <SectionTitle num="8" title="Финансовая дорожная карта (график платежей 30 / 30 / 40)" />
        <table className="w-full text-xs border-collapse mb-2">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-1.5 text-center border border-gray-300 w-12">Платёж</th>
              <th className="p-1.5 text-center border border-gray-300 w-10">%</th>
              <th className="p-1.5 text-center border border-gray-300 w-28">Сумма с НДС 22%</th>
              <th className="p-1.5 text-left border border-gray-300">Срок</th>
              <th className="p-1.5 text-left border border-gray-300">Основание</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-1.5 border border-gray-200 text-center font-medium">{r.n}</td>
                <td className="p-1.5 border border-gray-200 text-center font-bold">{r.pct}</td>
                <td className="p-1.5 border border-gray-200 text-center font-bold text-gray-800">{fmt(r.sum)}</td>
                <td className="p-1.5 border border-gray-200 text-gray-700">{r.deadline}</td>
                <td className="p-1.5 border border-gray-200 text-gray-600">{r.basis}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="p-1.5 border border-gray-300" colSpan={2}>Итого:</td>
              <td className="p-1.5 border border-gray-300 text-center">{fmt(4_636_000)}</td>
              <td className="p-1.5 border border-gray-300 text-gray-500 text-xs" colSpan={2}>в т.ч. НДС 22% — {fmt(836_000)}</td>
            </tr>
          </tfoot>
        </table>

        {/* 9. КОНТРОЛЬНЫЕ ТОЧКИ */}
        <SectionTitle num="9" title="Контрольные точки (КТ) для мониторинга" />
        <table className="w-full text-xs border-collapse mb-2">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-1.5 text-center border border-gray-300 w-12">Код</th>
              <th className="p-1.5 text-left border border-gray-300">Описание</th>
              <th className="p-1.5 text-center border border-gray-300 w-20">День</th>
              <th className="p-1.5 text-left border border-gray-300">Критерий качества</th>
            </tr>
          </thead>
          <tbody>
            {KT.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-1.5 border border-gray-200 text-center font-bold text-blue-700">{r.code}</td>
                <td className="p-1.5 border border-gray-200 font-medium">{r.desc}</td>
                <td className="p-1.5 border border-gray-200 text-center">{r.day}</td>
                <td className="p-1.5 border border-gray-200 text-gray-600">{r.quality}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 10. РЕЕСТР СКОРРЕКТИРОВАННЫХ РАЗДЕЛОВ ТЗ */}
        <SectionTitle num="10" title="Реестр скорректированных разделов ТЗ" />
        <table className="w-full text-xs border-collapse mb-2">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-1.5 text-left border border-gray-300 w-[45%]">Раздел ТЗ (исходный)</th>
              <th className="p-1.5 text-left border border-gray-300">Исправленная версия (дорожная карта)</th>
            </tr>
          </thead>
          <tbody>
            {TZ_CORRECTIONS.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-1.5 border border-gray-200 text-gray-600 italic">{r.old}</td>
                <td className="p-1.5 border border-gray-200">{r.fixed}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 11. РИСКИ */}
        <SectionTitle num="11" title="Риски и резервные мероприятия" />
        <table className="w-full text-xs border-collapse mb-4">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-1.5 text-left border border-gray-300 w-[30%]">Риск</th>
              <th className="p-1.5 text-center border border-gray-300 w-16">Вероятность</th>
              <th className="p-1.5 text-center border border-gray-300 w-16">Влияние</th>
              <th className="p-1.5 text-left border border-gray-300">Резерв</th>
            </tr>
          </thead>
          <tbody>
            {RISKS.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-1.5 border border-gray-200 font-medium">{r.risk}</td>
                <td className="p-1.5 border border-gray-200 text-center">{r.prob}</td>
                <td className="p-1.5 border border-gray-200 text-center">{r.impact}</td>
                <td className="p-1.5 border border-gray-200 text-gray-600">{r.reserve}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ЗАКЛЮЧЕНИЕ */}
        <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
          <div className="font-bold text-sm text-gray-800 mb-2">Заключение</div>
          <div className="text-xs text-gray-700 space-y-1">
            <div>• Устраняет 7 выявленных противоречий исходного ТЗ;</div>
            <div>• Чётко делит проект на 5 этапов с 120-дневным горизонтом;</div>
            <div>• Включает обязательный раздел ПОС и негосударственную экспертизу;</div>
            <div>• Фиксирует 3 платежа 30/30/40, обеспечивая баланс интересов;</div>
            <div>• Содержит диаграмму Ганта и контрольные точки для прозрачного мониторинга.</div>
          </div>
          <div className="mt-3 text-xs text-gray-600 font-medium italic">
            Просим Заказчика утвердить дорожную карту как приложение к договору.
          </div>
        </div>

        {/* ПОДПИСЬ */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-end">
            <div className="text-xs">
              <div className="font-bold mb-2">ООО «Капстрой Инжиниринг»</div>
              <div className="text-gray-600">Разработал: Главный инженер проекта</div>
              <div className="text-gray-600 mt-1">__________________________________ / ______________</div>
              <div className="text-gray-500 mt-2">Дата: _______________ 2026 г.</div>
              <div className="text-gray-400 mt-1">М.П.</div>
            </div>
            <img src={stampB64} alt="Печать" style={{ height: 85, width: 85, objectFit: "contain", opacity: 0.85 }} />
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-gray-100 text-center text-xs text-gray-400">
          ООО «Капстрой Инжиниринг» · Дорожная карта · г. Сочи, Эстосадок, Набережная лаванда, 8 · 2026
        </div>
      </div>
    </div>
  );
}