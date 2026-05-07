import { useState, useEffect, useRef } from "react";

const QUOTES = [
  "Морти, забудь про строительные нормы — в этой вселенной гравитация работает в обратную сторону!",
  "Я превратил весь проект в нейтрино. Технически всё по ГОСТу.",
  "Эй, Морти, я изобрёл расчёт несущих конструкций, который разрушает саму концепцию несущих конструкций!",
  "Wubba lubba dub dub — это на инженерном значит «сдай проект до пятницы».",
  "В мультивселенной существует хотя бы одна реальность, где заказчик принял проект с первого раза.",
  "Морти, ты слышал про принцип неопределённости? Именно поэтому смета всегда неточная.",
];

const STAGES = [
  {
    id: 0,
    emoji: "🛸",
    title: "СТОП. СИСТЕМА АКТИВИРОВАНА.",
    text: "Обнаружен именинник. Запускаю протокол «Жёсткое поздравление v8.05»...",
    btn: "Принять сигнал",
    color: "from-gray-900 to-green-950",
    accent: "#00ff88",
  },
  {
    id: 1,
    emoji: "🧬",
    title: "ЕВГЕНИЙ КОЗЛОВ",
    text: "Инженер. Человек. Легенда. По данным межгалактического реестра — один из немногих существ во вселенной, способных читать ТЗ и сохранять рассудок одновременно. Это статистически невозможно, но ты справляешься.",
    btn: "Это правда? →",
    color: "from-gray-900 to-blue-950",
    accent: "#00aaff",
  },
  {
    id: 2,
    emoji: "⚙️",
    title: "ИНЖЕНЕРНЫЙ ГЕНИЙ",
    text: "Пока Рик изобретал порталы между измерениями, ты научился находить решения там, где другие видят только стену из требований, противоречий и звонков в 23:59. Это круче любого портального пистолета.",
    btn: "Ладно, продолжай →",
    color: "from-gray-900 to-purple-950",
    accent: "#aa44ff",
  },
  {
    id: 3,
    emoji: "🌍",
    title: "ПЛАН «ЗАХВАТ МИРА»",
    text: "Ты Евгений, я Денис. ЕвДен или ДенЕв — поебать. Платформа для проектирования. Это не просто бизнес — это первый шаг к полному доминированию над строительной отраслью на трёх планетах. Четвёртая планета пока не знает, что ей не повезло.",
    btn: "Рассказывай про миллиард →",
    color: "from-gray-900 to-red-950",
    accent: "#ff4444",
  },
  {
    id: 4,
    emoji: "🏝️",
    title: "ОСТРОВ + МИЛЛИАРД + ДРУГАЯ ВСЕЛЕННАЯ",
    text: "Сценарий такой: зарабатываем миллиард, покупаем остров, ставим на него реактор, разгоняемся до 88 mph, открываем портал в параллельную вселенную где нет НДС и согласований — и летим туда на острове. Буквально. Весь остров летит.",
    btn: "Звучит реалистично →",
    color: "from-gray-900 to-yellow-950",
    accent: "#ffaa00",
  },
  {
    id: 5,
    emoji: "🎂",
    title: "С ДНЁМ РОЖДЕНИЯ, ЖЕНЯ!",
    text: null,
    btn: null,
    color: "from-gray-900 to-green-950",
    accent: "#00ff88",
  },
];

const Particle = ({ accent }: { accent: string }) => {
  const style = {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
    backgroundColor: accent,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`,
  };
  return <div className="absolute rounded-full opacity-60 animate-pulse" style={style} />;
};

export default function EvgenKozlov() {
  const [stage, setStage] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [counter, setCounter] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = STAGES[stage];

  useEffect(() => {
    setTyped("");
    setTyping(true);
    const text = current.text || "";
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) {
        setTyped(text.slice(0, i + 1));
        i++;
      } else {
        setTyping(false);
        clearInterval(t);
      }
    }, 18);
    return () => clearInterval(t);
  }, [stage]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setQuoteIdx((q) => (q + 1) % QUOTES.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (stage === 5) {
      setShowConfetti(true);
      let speed = 50;
      let current = 0;
      const tick = () => {
        current += 1;
        setCounter(current);
        if (current < 1000) {
          speed = Math.max(5, 50 - current * 0.04);
          setTimeout(tick, speed);
        } else {
          setCounter(-1); // -1 = infinity mode
        }
      };
      setTimeout(tick, speed);
    }
  }, [stage]);

  const handleNext = () => {
    if (stage < STAGES.length - 1) setStage((s) => s + 1);
  };

  const handleEmojiClick = () => {
    const nc = clickCount + 1;
    setClickCount(nc);
    if (nc >= 7) setEasterEgg(true);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${current.color} flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000 font-mono`}
    >
      {/* Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Particle key={i} accent={current.accent} />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${current.accent} 1px, transparent 1px), linear-gradient(90deg, ${current.accent} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ricky quote ticker */}
      <div className="fixed top-0 left-0 right-0 z-50 overflow-hidden py-1.5" style={{ backgroundColor: current.accent + "22", borderBottom: `1px solid ${current.accent}44` }}>
        <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap text-xs" style={{ color: current.accent }}>
          ★ {QUOTES[quoteIdx]} ★ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ★ {QUOTES[(quoteIdx + 1) % QUOTES.length]} ★
        </div>
      </div>

      {/* Stage indicator */}
      <div className="fixed top-8 right-4 flex gap-1.5 z-40">
        {STAGES.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-500"
            style={{ backgroundColor: i <= stage ? current.accent : "#ffffff22" }}
          />
        ))}
      </div>

      {/* Main card */}
      <div className="relative z-10 max-w-xl w-full mx-4 text-center">
        {/* Big emoji */}
        <div
          className="text-8xl mb-6 cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 drop-shadow-2xl"
          onClick={handleEmojiClick}
          title="Нажми несколько раз..."
        >
          {current.emoji}
        </div>

        {/* Title */}
        <h1
          className="text-2xl md:text-4xl font-black mb-4 tracking-widest uppercase"
          style={{ color: current.accent, textShadow: `0 0 30px ${current.accent}88` }}
        >
          {current.title}
        </h1>

        {/* Text with typewriter */}
        {current.text && (
          <div className="text-gray-200 text-sm md:text-base leading-relaxed mb-8 min-h-[80px] px-2">
            {typed}
            {typing && (
              <span className="inline-block w-2 h-4 ml-1 align-middle animate-pulse" style={{ backgroundColor: current.accent }} />
            )}
          </div>
        )}

        {/* Final stage */}
        {stage === 5 && (
          <div className="space-y-4">
            <p className="text-gray-200 text-sm leading-relaxed px-2">{typed}</p>

            <div
              className="text-6xl font-black py-4 transition-all duration-300"
              style={{ color: current.accent, textShadow: `0 0 40px ${current.accent}` }}
            >
              {counter === -1 ? (
                <div className="space-y-1">
                  <div className="text-7xl">∞ 💸</div>
                  <div className="text-lg font-normal text-gray-400 tracking-widest">да похуй сколько лет</div>
                </div>
              ) : counter > 0 ? `+${counter.toLocaleString()} 💸` : ""}
            </div>

            <div className="border rounded-xl p-5 text-left space-y-3" style={{ borderColor: current.accent + "55", backgroundColor: current.accent + "11" }}>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Официальное поздравление от Дениса</p>
              <p className="text-gray-100 text-sm leading-relaxed">
                Женя, ты реально крутой инженер и человек. Без тебя вся наша инженерная часть была бы просто красивыми словами. Ты тот, кто превращает идеи в реальные действия — в том числе мотивируя меня — а это, как сказал бы Рик, «буквально единственное, что имеет значение во вселенной».
              </p>
              <p className="text-gray-100 text-sm leading-relaxed">
                Пусть в этом году клиенты сами знают чего хотят — а если не знают, пусть идут нахуй. ТЗ с ПД сходится с первого раза, согласования проходят за один звонок. Да пусть просто никто не ебёт мозги! Мы сделаем всё с одного нажатия. Это невозможно? Только мы знаем, что это возможно.
              </p>
              <p className="text-gray-100 text-sm leading-relaxed">
                Ты лучший муж, человек, партнёр, отец, друг. Просто хороший человек. Ничего не меняй в себе. Желаю только гармонии.
              </p>
              <p className="font-bold text-sm" style={{ color: current.accent }}>
                С Днём Рождения! 🛸
              </p>
              <p className="text-xs text-gray-500">— Денис</p>
            </div>

            <button
              onClick={() => { setStage(0); setCounter(0); setShowConfetti(false); setClickCount(0); setEasterEgg(false); }}
              className="mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors underline"
            >
              Пересмотреть с начала
            </button>
          </div>
        )}

        {/* Next button */}
        {current.btn && !typing && (
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-2xl"
            style={{
              backgroundColor: current.accent,
              color: "#000",
              boxShadow: `0 0 30px ${current.accent}66`,
            }}
          >
            {current.btn}
          </button>
        )}

        {current.btn && typing && (
          <div className="text-xs text-gray-600 animate-pulse">загрузка данных...</div>
        )}
      </div>

      {/* Easter egg */}
      {easterEgg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setEasterEgg(false)}>
          <div className="bg-gray-900 border-2 rounded-2xl p-8 max-w-sm text-center mx-4" style={{ borderColor: current.accent }}>
            <div className="text-5xl mb-4">🧪</div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Секретный файл разблокирован</p>
            <p className="text-gray-200 text-sm leading-relaxed">
              «Морти, настоящий инженер — это тот, кто может объяснить, почему проект не готов, так убедительно, что заказчик сам извинится за то, что спросил.»
            </p>
            <p className="text-xs mt-4" style={{ color: current.accent }}>— Рик Санчес, C-137</p>
            <p className="text-xs text-gray-600 mt-4">нажми чтобы закрыть</p>
          </div>
        </div>
      )}

      {/* Confetti emoji rain */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${-10 - Math.random() * 30}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                fontSize: `${20 + Math.random() * 20}px`,
              }}
            >
              {["🎂", "🛸", "💸", "🏝️", "⚙️", "🎉", "🌌"][i % 7]}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}