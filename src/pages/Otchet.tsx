import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { exportElementToPdf } from "@/lib/exportPdf";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const DOC_NUM = "ТО-01/ТМХ-ПТР/2026";
const DOC_DATE = "09 апреля 2026 г.";

const shops = [
  {
    name: "Цех текущего ремонта с мастерскими",
    area: 6061.9,
    h: 10.68,
    gates: 144,
    heating: "Отсутствует (3 воздушно-отопительных агрегата на пар)",
    vol: 64741,
    wallsBrutto: 3524,
    windows: 176,
    wallsNetto: 3204,
    qWalls: 65682,
    qRoof: 99417,
    qWin: 14432,
    qGates: 9840,
    qSum: 189371,
    qFloor: 18937,
    qOgr: 208308,
    qOgrKw: 208.3,
    G: 6.474,
    qInf: 266800,
    qInfKw: 266.8,
    qTotal: 475.1,
  },
  {
    name: "Цех подъёмочного ремонта с мастерскими",
    area: 2132.1,
    h: 13.0,
    gates: 72,
    heating: "Отсутствует (2 воздушно-отопительных агрегата на пар)",
    vol: 27717,
    wallsBrutto: 2548,
    windows: 127,
    wallsNetto: 2349,
    qWalls: 48155,
    qRoof: 34965,
    qWin: 10414,
    qGates: 4920,
    qSum: 98454,
    qFloor: 9845,
    qOgr: 108299,
    qOgrKw: 108.3,
    G: 2.772,
    qInf: 114200,
    qInfKw: 114.2,
    qTotal: 222.5,
  },
  {
    name: "Тепловозный цех",
    area: 524.4,
    h: 7.4,
    gates: 48,
    heating: "Имеется, теплоноситель — пар",
    vol: 3881,
    wallsBrutto: 710,
    windows: 36,
    wallsNetto: 626,
    qWalls: 12833,
    qRoof: 8600,
    qWin: 2952,
    qGates: 3280,
    qSum: 27665,
    qFloor: 2767,
    qOgr: 30432,
    qOgrKw: 30.4,
    G: 0.388,
    qInf: 16000,
    qInfKw: 16.0,
    qTotal: 46.4,
  },
  {
    name: "Колёсный цех",
    area: 315.2,
    h: 9.0,
    gates: 24,
    heating: "Имеется, теплоноситель — пар",
    vol: 2837,
    wallsBrutto: 677,
    windows: 34,
    wallsNetto: 619,
    qWalls: 12690,
    qRoof: 5170,
    qWin: 2788,
    qGates: 1640,
    qSum: 22288,
    qFloor: 2229,
    qOgr: 24517,
    qOgrKw: 24.5,
    G: 0.284,
    qInf: 11700,
    qInfKw: 11.7,
    qTotal: 36.2,
  },
  {
    name: "Электромашинный цех",
    area: 524.0,
    h: 9.0,
    gates: 16,
    heating: "Имеется, теплоноситель — вода",
    vol: 4716,
    wallsBrutto: 871,
    windows: 44,
    wallsNetto: 811,
    qWalls: 16626,
    qRoof: 8594,
    qWin: 3608,
    qGates: 1093,
    qSum: 29921,
    qFloor: 2992,
    qOgr: 32913,
    qOgrKw: 32.9,
    G: 0.472,
    qInf: 19400,
    qInfKw: 19.4,
    qTotal: 52.3,
  },
];

const totalKw = 832.5;
const totalGcalH = 0.716;

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="mt-8 mb-3">
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-sm text-gray-800 uppercase tracking-wide">
          {num}. {title}
        </span>
      </div>
      <div className="h-[2px] bg-gray-800 mt-1" />
    </div>
  );
}

function SubTitle({ text }: { text: string }) {
  return (
    <p className="font-semibold text-sm text-gray-800 mt-5 mb-2 underline underline-offset-2">
      {text}
    </p>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-gray-200">
      <td className="py-1 pr-4 text-xs text-gray-600 align-top w-64">{label}</td>
      <td className="py-1 text-xs font-medium text-gray-900">{value}</td>
    </tr>
  );
}

export default function Otchet() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      await exportElementToPdf(
        reportRef.current,
        `ТехОтчет_ТМХ-ПТР_депо_Лобня_${DOC_NUM}.pdf`,
      );
    } catch (e) {
      console.error(e);
    }
    setExporting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Логотип" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Технический отчёт · {DOC_NUM}</div>
            </div>
          </div>
          <Button
            onClick={exportPDF}
            disabled={exporting}
            className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm gap-2"
          >
            <Icon name="FileDown" size={16} />
            {exporting ? "Экспорт..." : "Скачать PDF"}
          </Button>
        </div>
      </div>

      {/* Report */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div
          ref={reportRef}
          className="bg-white shadow-lg"
          style={{ fontFamily: "Times New Roman, serif", padding: "30mm 25mm 25mm 30mm" }}
        >
          {/* ── WATERMARK BANNER ── */}
          <div className="bg-yellow-50 border border-yellow-400 rounded px-4 py-2 mb-6 text-center">
            <p className="text-xs font-bold text-yellow-800 leading-snug">
              ВНИМАНИЕ! Данный документ является предварительным и не может быть использован для
              проектирования, экспертизы или строительства без заключения договора и полной оплаты.
              Все расчёты и данные являются интеллектуальной собственностью Исполнителя.
              Любое копирование, распространение или использование без письменного разрешения запрещено.
            </p>
          </div>

          {/* ── HEADER ── */}
          <div className="flex items-start justify-between mb-6 pb-5 border-b-2 border-gray-800">
            <div className="flex items-center gap-4">
              <img src={LOGO_URL} alt="Логотип" className="h-20 object-contain" />
              <div>
                <div className="font-bold text-base text-gray-900 leading-tight">
                  ООО «КАПСТРОЙ-ИНЖИНИРИНГ»
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  197341, г. Санкт-Петербург, Фермское шоссе, д. 12, лит. Ж, пом. 310-Н к3
                </div>
                <div className="text-xs text-gray-600">
                  ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-700">
              <div className="font-semibold text-indigo-700 text-sm">{DOC_NUM}</div>
              <div>Дата: {DOC_DATE}</div>
              <div className="mt-1">Статус: <span className="font-bold text-red-600">ПРЕДВАРИТЕЛЬНЫЙ</span></div>
              <div className="mt-1 text-gray-500">Основание: ТЗ №011 ред. №ТЗ.011.002.ПТР/2026</div>
            </div>
          </div>

          {/* ── TITLE BLOCK ── */}
          <div className="text-center mb-8">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">Технический отчёт</p>
            <h1 className="text-base font-bold text-gray-900 leading-snug uppercase">
              По определению расчётной тепловой нагрузки<br />
              на систему отопления производственных цехов
            </h1>
            <p className="text-sm text-gray-700 mt-2">
              ООО «ТМХ-ПТР» обособленное подразделение депо Лобня
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Московская область, г. Лобня, ул. Деповская, д. 1а
            </p>
            <div className="mt-4 inline-block border border-red-400 rounded px-4 py-1 bg-red-50">
              <span className="text-xs font-bold text-red-700">
                СТАТУС: ПРЕДВАРИТЕЛЬНЫЙ — Окончательные значения подлежат уточнению после натурного обследования
              </span>
            </div>
          </div>

          {/* ── SECTION 1. GENERAL ── */}
          <SectionTitle num="1" title="Общие положения" />
          <p className="text-xs text-gray-800 leading-relaxed mb-2 text-justify">
            Настоящий отчёт подготовлен на основании Технического задания №011, редакция №ТЗ.011.002.ПТР/2026,
            предоставленного Заказчиком. Целью работы является определение расчётной часовой тепловой нагрузки
            на систему отопления пяти производственных цехов и последующий анализ возможных источников тепловой энергии.
          </p>
          <p className="text-xs text-gray-800 leading-relaxed mb-2 text-justify">
            Расчёт выполнен в соответствии с требованиями следующих нормативных документов:
          </p>
          <ul className="list-none text-xs text-gray-800 space-y-1 mb-2 ml-4">
            {[
              "СП 50.13330.2012 «Тепловая защита зданий» (актуализированная редакция СНиП 23-02-2003)",
              "СП 60.13330.2012 «Отопление, вентиляция и кондиционирование воздуха» (актуализированная редакция СНиП 41-01-2003)",
              "СП 131.13330.2020 «Строительная климатология» (актуализированная редакция СНиП 23-01-99)",
              "Методические рекомендации по определению тепловых нагрузок на системы отопления промышленных зданий",
            ].map((d, i) => (
              <li key={i} className="flex gap-2">
                <span>—</span><span>{d}</span>
              </li>
            ))}
          </ul>

          {/* ── SECTION 2. SOURCE DATA ── */}
          <SectionTitle num="2" title="Исходные данные" />

          <SubTitle text="2.1. Объект обследования (данные предоставлены Заказчиком в п. 4 ТЗ)" />
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 border border-gray-400">
                  <th className="border border-gray-400 px-2 py-1 text-left font-bold">Наименование цеха</th>
                  <th className="border border-gray-400 px-2 py-1 font-bold">Площадь, м²</th>
                  <th className="border border-gray-400 px-2 py-1 font-bold">Высота, м</th>
                  <th className="border border-gray-400 px-2 py-1 font-bold">Ворота, м²</th>
                  <th className="border border-gray-400 px-2 py-1 text-left font-bold">Система отопления</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((s, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-300 px-2 py-1">{s.name}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{s.area.toLocaleString("ru-RU")}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{s.h.toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{s.gates}</td>
                    <td className="border border-gray-300 px-2 py-1">{s.heating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SubTitle text="2.2. Расчётные климатические параметры (по СП 131.13330.2020, г. Лобня)" />
          <table className="mb-4">
            <tbody>
              <Row label="Расчётная t наружного воздуха (обесп. 0,92):" value="минус 25 °C" />
              <Row label="Средняя t отопительного периода:" value="минус 3,1 °C" />
              <Row label="Продолжительность отопительного периода:" value="214 суток" />
              <Row label="Расчётная t внутри помещений (производственные цехи):" value="плюс 16 °C" />
              <Row label="Расчётный перепад Δt = tв − tн:" value="41 °C" />
            </tbody>
          </table>

          <SubTitle text="2.3. Теплотехнические характеристики ограждающих конструкций (принятые предварительно)" />
          <table className="mb-2">
            <tbody>
              <Row label="Наружные стены (сэндвич-панели / утеплённая кирпичная кладка), R:" value="2,0 м²·°C/Вт" />
              <Row label="Покрытие (утеплённая кровля с металлическим профилем), R:" value="2,5 м²·°C/Вт" />
              <Row label="Окна (двухкамерные стеклопакеты в ПВХ-переплётах), R:" value="0,5 м²·°C/Вт" />
              <Row label="Ворота (утеплённые металлические распашные), R:" value="0,6 м²·°C/Вт" />
              <Row label="Полы по грунту — добавка к основным потерям:" value="10 %" />
              <Row label="Кратность воздухообмена (инфильтрация), n:" value="0,3 ч⁻¹" />
            </tbody>
          </table>
          <p className="text-xs text-red-600 italic mt-1">
            * Все теплотехнические характеристики приняты на основании типовых решений для зданий депо и
            подлежат обязательному уточнению при натурном обследовании.
          </p>

          {/* ── SECTION 3. SCOPE OF WORK ── */}
          <SectionTitle num="3" title="Состав выполненных работ" />
          <p className="text-xs text-gray-800 leading-relaxed mb-2 text-justify">
            В рамках настоящего технического задания выполнены следующие этапы работ:
          </p>
          {[
            ["5.1", "Сбор исходных данных об объектах проведения работ: информация о количестве присутствующих людей, подробный план объекта, определение типа конструкции отопительной системы."],
            ["5.2", "Обследование объекта: определение типа отопительных приборов (при наличии), места их размещения, параметры подводящих труб и т.д."],
            ["5.3", "Расчёт теплопотерь по ограждающим конструкциям."],
            ["5.4", "Расчёт суммарной тепловой нагрузки отопления по объектам."],
            ["5.5", "Составление технического отчёта с информацией об исходных данных, методике расчёта и результатах с указанием нормативных документов."],
            ["5.6", "Анализ возможных источников тепловой энергии — как имеющихся, так и новых."],
            ["5.7", "Согласование технического отчёта с Заказчиком."],
          ].map(([num, text]) => (
            <div key={num} className="flex gap-2 mb-1">
              <span className="text-xs font-bold text-gray-700 w-8 shrink-0">{num}</span>
              <p className="text-xs text-gray-800 leading-relaxed">{text}</p>
            </div>
          ))}

          {/* ── SECTION 4. METHODOLOGY ── */}
          <SectionTitle num="4" title="Методика расчёта" />
          <p className="text-xs text-gray-800 leading-relaxed mb-2 text-justify">
            Расчёт тепловой нагрузки на отопление каждого цеха выполнен по формуле:
          </p>
          <div className="bg-gray-50 border border-gray-300 rounded px-4 py-2 mb-3 text-center text-xs font-mono">
            Q<sub>от</sub> = Q<sub>огр</sub> + Q<sub>инф</sub>
          </div>
          <p className="text-xs text-gray-800 mb-2">где:</p>
          <ul className="text-xs text-gray-800 space-y-1 mb-3 ml-4">
            <li>Q<sub>огр</sub> — теплопотери через ограждающие конструкции (стены, покрытие, окна, ворота, пол), Вт;</li>
            <li>Q<sub>инф</sub> — расход теплоты на нагрев инфильтрующегося наружного воздуха, Вт.</li>
          </ul>
          <p className="text-xs text-gray-800 leading-relaxed mb-2">
            Теплопотери через однородные ограждающие конструкции определены по формуле:
          </p>
          <div className="bg-gray-50 border border-gray-300 rounded px-4 py-2 mb-3 text-center text-xs font-mono">
            Q = (A / R) × (t<sub>в</sub> − t<sub>н</sub>)
          </div>
          <p className="text-xs text-gray-800 mb-2">где: A — площадь конструкции, м²; R — сопротивление теплопередаче, м²·°C/Вт.</p>
          <p className="text-xs text-gray-800 leading-relaxed mb-2">
            Теплопотери через пол по грунту рассчитаны упрощённо — добавкой 10% к сумме потерь через вертикальные ограждения и покрытие.
          </p>
          <p className="text-xs text-gray-800 leading-relaxed mb-2">
            Расход теплоты на инфильтрацию определён по формуле:
          </p>
          <div className="bg-gray-50 border border-gray-300 rounded px-4 py-2 mb-3 text-center text-xs font-mono">
            Q<sub>инф</sub> = G × c × (t<sub>в</sub> − t<sub>н</sub>)
          </div>
          <p className="text-xs text-gray-800 mb-2">
            где G = (V × ρ × n) / 3600 — массовый расход инфильтрующегося воздуха, кг/с;
            c = 1005 Дж/(кг·°C) — удельная теплоёмкость воздуха;
            ρ = 1,2 кг/м³ — плотность наружного воздуха при t<sub>н</sub>.
          </p>

          {/* ── SECTION 5. RESULTS PER SHOP ── */}
          <SectionTitle num="5" title="Результаты расчёта по каждому цеху" />
          {shops.map((s, idx) => (
            <div key={idx} className="mb-6">
              <p className="text-xs font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
                5.{idx + 1}. {s.name}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold w-2/3">Параметр</th>
                      <th className="border border-gray-300 px-2 py-1 font-semibold text-right">Значение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Площадь пола", `${s.area.toLocaleString("ru-RU")} м²`],
                      ["Высота потолков", `${s.h.toFixed(2)} м`],
                      ["Объём помещения", `${s.vol.toLocaleString("ru-RU")} м³`],
                      ["Площадь стен (брутто)", `${s.wallsBrutto.toLocaleString("ru-RU")} м²`],
                      ["Площадь окон (5% от стен брутто)", `${s.windows} м²`],
                      ["Площадь ворот", `${s.gates} м²`],
                      ["Площадь стен (нетто)", `${s.wallsNetto.toLocaleString("ru-RU")} м²`],
                      ["Теплопотери через стены", `${s.qWalls.toLocaleString("ru-RU")} Вт`],
                      ["Теплопотери через покрытие", `${s.qRoof.toLocaleString("ru-RU")} Вт`],
                      ["Теплопотери через окна", `${s.qWin.toLocaleString("ru-RU")} Вт`],
                      ["Теплопотери через ворота", `${s.qGates.toLocaleString("ru-RU")} Вт`],
                      ["Сумма основных потерь через ограждения", `${s.qSum.toLocaleString("ru-RU")} Вт`],
                      ["Добавка на пол (10%)", `${s.qFloor.toLocaleString("ru-RU")} Вт`],
                      ["ИТОГО потери через ограждения (с полом)", `${s.qOgr.toLocaleString("ru-RU")} Вт = ${s.qOgrKw} кВт`],
                      ["Массовый расход воздуха (инфильтрация), G", `${s.G} кг/с`],
                      ["Теплопотери на инфильтрацию", `${s.qInf.toLocaleString("ru-RU")} Вт = ${s.qInfKw} кВт`],
                    ].map(([label, val], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="border border-gray-200 px-2 py-0.5 text-gray-700">{label}</td>
                        <td className="border border-gray-200 px-2 py-0.5 text-right font-medium text-gray-900">{val}</td>
                      </tr>
                    ))}
                    <tr className="bg-indigo-100 font-bold">
                      <td className="border border-indigo-300 px-2 py-1 text-indigo-900">ОБЩАЯ РАСЧЁТНАЯ ТЕПЛОВАЯ НАГРУЗКА</td>
                      <td className="border border-indigo-300 px-2 py-1 text-right text-indigo-900">{s.qTotal} кВт</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* ── SECTION 6. SUMMARY ── */}
          <SectionTitle num="6" title="Суммарная расчётная тепловая нагрузка" />
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-600 px-2 py-1 text-left">№</th>
                  <th className="border border-gray-600 px-2 py-1 text-left">Наименование цеха</th>
                  <th className="border border-gray-600 px-2 py-1 text-right">Q<sub>огр</sub>, кВт</th>
                  <th className="border border-gray-600 px-2 py-1 text-right">Q<sub>инф</sub>, кВт</th>
                  <th className="border border-gray-600 px-2 py-1 text-right font-bold">Q<sub>total</sub>, кВт</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((s, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-300 px-2 py-1 text-center">{i + 1}</td>
                    <td className="border border-gray-300 px-2 py-1">{s.name}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{s.qOgrKw}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{s.qInfKw}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right font-bold">{s.qTotal}</td>
                  </tr>
                ))}
                <tr className="bg-indigo-700 text-white font-bold">
                  <td className="border border-indigo-500 px-2 py-2" colSpan={4}>ИТОГО по всем цехам</td>
                  <td className="border border-indigo-500 px-2 py-2 text-right text-base">{totalKw} кВт</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-indigo-50 border border-indigo-300 rounded p-3 text-xs text-indigo-900">
            <strong>Предварительная суммарная расчётная часовая тепловая нагрузка на отопление
              всех производственных цехов депо Лобня составляет:</strong>
            <div className="text-lg font-bold text-indigo-700 text-center mt-2">
              {totalKw} кВт &nbsp;/&nbsp; {totalGcalH} Гкал/ч
            </div>
            <div className="text-center text-xs text-indigo-600 mt-1">
              Пересчёт: {totalKw} кВт ÷ 1163 = {totalGcalH} Гкал/ч
            </div>
          </div>

          {/* ── SECTION 7. HEAT SOURCES ── */}
          <SectionTitle num="7" title="Анализ возможных источников тепловой энергии" />
          <p className="text-xs text-gray-800 mb-3 text-justify leading-relaxed">
            На основании полученной расчётной нагрузки {totalKw} кВт ({totalGcalH} Гкал/ч) рассмотрены следующие варианты источника теплоснабжения:
          </p>
          {[
            {
              num: "7.1",
              title: "Существующая котельная (газовая / мазутная)",
              text: "Требуется проверка остаточной мощности после подключения других потребителей. При наличии резерва не менее 0,8 Гкал/ч — наиболее экономичный вариант по капитальным затратам.",
            },
            {
              num: "7.2",
              title: "Подключение к централизованным тепловым сетям г. Лобни",
              text: "Плата за подключение ориентировочно 3–5 млн руб., плюс строительство теплового ввода. Эксплуатационные расходы низкие.",
            },
            {
              num: "7.3",
              title: "Новая автономная модульная газовая котельная мощностью 1,0 Гкал/ч",
              text: "Капитальные затраты ориентировочно 4–6 млн руб. Срок окупаемости 3–5 лет в зависимости от цены газа.",
            },
            {
              num: "7.4",
              title: "Крышная газовая котельная",
              text: "Возможна при наличии технических условий и усиления несущих конструкций. Стоимость выше модульной.",
            },
            {
              num: "7.5",
              title: "Тепловые насосы (воздух–вода)",
              text: "При расчётной температуре −25 °C коэффициент преобразования COP падает ниже 2,0, что делает данный вариант неэффективным для основного отопления.",
            },
          ].map((item) => (
            <div key={item.num} className="mb-3 flex gap-2">
              <span className="text-xs font-bold text-gray-700 w-8 shrink-0">{item.num}</span>
              <div>
                <span className="text-xs font-semibold text-gray-900">{item.title}. </span>
                <span className="text-xs text-gray-800">{item.text}</span>
              </div>
            </div>
          ))}
          <div className="bg-green-50 border border-green-400 rounded p-3 mt-3 text-xs text-green-900">
            <strong>Предварительный вывод:</strong> наиболее рациональным является модернизация существующей котельной
            либо установка новой газовой модульной котельной. Окончательное решение принимается после
            технико-экономического сравнения в рамках полного договора.
          </div>

          {/* ── SECTION 8. CONCLUSION ── */}
          <SectionTitle num="8" title="Заключение" />
          <p className="text-xs text-gray-800 leading-relaxed mb-2 text-justify">
            Предварительная расчётная тепловая нагрузка на систему отопления пяти производственных цехов
            депо Лобня (ООО «ТМХ-ПТР») составляет <strong>{totalKw} кВт ({totalGcalH} Гкал/ч)</strong>.
          </p>
          <p className="text-xs text-gray-800 leading-relaxed mb-2 text-justify">
            Для получения окончательных значений, пригодных для проектирования, необходимо:
          </p>
          <ul className="list-none text-xs text-gray-800 space-y-1 mb-3 ml-4">
            {[
              "выполнить натурное обследование с тепловизионной съёмкой;",
              "определить фактические сопротивления теплопередаче ограждающих конструкций;",
              "уточнить воздухообмен и тепловыделения от технологического оборудования.",
            ].map((t, i) => (
              <li key={i} className="flex gap-2"><span>—</span><span>{t}</span></li>
            ))}
          </ul>
          <p className="text-xs text-red-700 font-semibold text-justify">
            Данный отчёт не может быть использован для разработки проектной документации или проведения
            строительно-монтажных работ без письменного согласия Исполнителя.
          </p>

          {/* ── SIGNATURE + FOOTER block (keep together, no page break inside) ── */}
          <div style={{ pageBreakBefore: "always", breakBefore: "page" }}>
            <div className="border-t-2 border-gray-800 pt-6 mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-3">С уважением,</p>
                <p className="text-xs text-gray-700">Директор</p>
                <p className="text-xs font-bold text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
                <p className="text-xs text-gray-700 mt-2">Шумов Иван Викторович</p>
                <div className="mt-6 text-xs text-gray-400">
                  <div>________________</div>
                  <div className="mt-1">(подпись)</div>
                </div>
              </div>
              <div className="text-center">
                <img src={STAMP_URL} alt="Печать" className="h-32 w-32 object-contain opacity-90" />
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
              <span>ООО «КАПСТРОЙ-ИНЖИНИРИНГ» · ИНН 7814795454</span>
              <span>{DOC_NUM} · {DOC_DATE}</span>
            </div>

            {/* ── FINAL WARNING ── */}
            <div className="mt-4 bg-gray-100 border border-gray-300 rounded px-4 py-2 text-center">
              <p className="text-xs text-gray-600">
                <strong>Предупреждение:</strong> Настоящий документ является предварительным и защищён авторским правом.
                Любое использование результатов расчёта без заключения договора и полной оплаты является нарушением
                и будет оспорено в судебном порядке.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}