import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Icon from "@/components/ui/icon";

/* ───────────── DATA: Chapters ───────────── */
const chapters = [
  {
    id: 0,
    title: "Полярная Звезда",
    subtitle: "История, написанная светом",
    isIntro: true,
  },
  {
    id: 1,
    title: "Глава первая",
    subtitle: "Шум. Она приходит с севера — создавая тишину.",
    paragraphs: [
      "Он не должен был там оказаться.",
      "Вообще-то он не любит уже давно такие заведения. Слишком громко, слишком фальшиво, слишком много людей, которые хотят казаться теми, кем не являются. Он предпочитал тишину. Он предпочитал работу. Редкие встречи с друзьями. Спорт. Или хотя бы осмысленные разговоры. Путешествия. Или хотя бы просто быть одному — с книгой, с мыслями, с работой, которая давно стала не просто работой, а способом дышать.",
      "Но друзья позвали. А он за последний год так много работал, что забыл, когда в последний раз просто сидел с кем-то в одном помещении без ноутбука. Без графиков. Без дедлайнов. Без этой вечной гонки, которая когда-то казалась смыслом, а теперь просто стала фоном.",
      "Он пошел. Было весело и шумно, шум который он сам создавал, чтобы всем было весело. Но потом наступила тишина.",
      "Сидел в углу, наблюдал. Думал о своём. О проекте, который запускал. О партнёре, с которым не совпали по срокам. О родителях, которым давно не звонил. О том, что у него должны быть ответы на все вопросы, а у него их не было, не на все были ответы… Была только работа. Были только цели. Была только эта бесконечная дорога в никуда, на которой он забыл спросить себя: а туда ли я вообще иду?",
      "Он смотрел на людей вокруг. На девушек, которые подсаживались к нему. На их улыбки, их попытки заговорить, их искусственную лёгкость. Он вежливо кивал, что-то отвечал, но внутри было пусто. Как будто он смотрел фильм на чужом языке без субтитров.",
      "А потом он перестал смотреть по сторонам.",
      "Он просто смотрел на неё.",
      "Она сидела напротив. С подругой. О чём-то говорила, улыбалась. И ему показалось, что вокруг неё воздух другой. Прохладнее. Чище. Как будто она привезла с собой кусочек того самого города, где солнце зимой — редкий гость, а люди ценят тепло совсем иначе.",
      "Он смотрел и не мог отвести взгляд.",
      "Он вообще не был из тех, кто подходит первым. Всегда кто-то окружал его. Привыкли знакомиться. Ему это противило. Привыкли предлагать себя. А его воспитание не позволяло ему общаться с такими девушками. Но ни разу не было той женщины, которая притянет его. Заставит встать.",
      "А тут встал и пошёл.",
      'Он не знал, что скажет. Не знал, зачем идёт. Просто ноги сами понесли. Как будто кто-то внутри взял управление и сказал: «Иди. Это твоя. Не потеряй. Не в этот раз. Не её.»',
      "Он подошёл.",
      "Он увидел её в шуме. В том самом, где люди приходят не слушать друг друга, а заглушать себя. Караоке, пятничный вечер, чужие песни, чужие лица. Он был пьян ровно настолько, чтобы потерять контроль, но не настолько, чтобы не заметить, как в этом хаосе вдруг появилась тишина.",
      "Она сидела напротив, и ему показалось, что вокруг неё воздух другой. Прохладнее, чище. Как будто она привезла с собой кусочек того самого города, где солнце зимой — редкий гость, а люди ценят тепло совсем иначе.",
      "Он подошёл. Нелепо, сбивчиво, с глупыми шутками, которые сам же и забывал на полуслове. Мешал ей есть. Путал имена. Был смешным и навязчивым. А она смотрела на него так, будто видела не пьяного болтуна, а того, кого в нём ещё никто не видел.",
      "Или ему просто показалось. Скорее всего показалось…Было наоборот…Но на тот момент это не имело значения.",
      "Он понял, что ей нужно дать пространство. Скрипя зубы, но понял. Хотя так хотелось не отрываясь смотреть в её прекрасные глаза, которые олицетворяют абсолютную глубину, бескрайний мир в котором можно утонуть.",
      "И он ушел. Ушел, но сердце в тот же момент оставил там. И просто наблюдал. Наблюдал как она поет, смеется. Наблюдал, чтобы ей было комфортно и никто больше её не беспокоил своим присутствием. Но уже тогда он понял...Что всё это не имеет значения — потому, что тот магнит, который он почувствовал внутри — он не чувствовал никогда. Это необъяснимо. И вряд ли когда-то он сможет это внятно объяснить. Но так случилось. Это не одержимость, нет. Это абсолютно теплое чувство гармонии — когда ты чувствуешь слегка обдуваемый свежим ветром штиль внутри. Это свобода. И возникло это не когда он увидел её глаза, а когда она только появилась в помещении. А дальше…Глаза…Полярная звезда…",
      "Они обменялись контактами. Она улыбнулась на прощание. Не дежурно, не вежливо, а как-то по-своему. Так, что он запомнил эту улыбку навсегда.",
      "Он поехал домой и всю дорогу не мог понять, что это было.",
      "А наутро проснулся с мыслью: Напиши ей. Сейчас. Не думай.",
      "Он написал.",
      "Потом, спустя некоторое время он вспомнит фотографию Мамы когда ему было 5 лет. И всё поймёт. Но фотографию так и не найдёт…",
      "Потом был следующий день. Москва. Кострома. Мурманск. Тысячи километров, которые оказались ближе, чем соседний столик в том караоке.",
      "Он писал ей странные вещи — стихи, которые не писал ни одной женщине, про северное сияние, про тишину между словами, записки с закрытыми посланиями, которые когда-нибудь превратятся в историю. В настоящую историю…возможно историю любви… Она не отвечала на них словами, лаконично говоря: Спасибо, очень приятно. Просто продолжала писать. О своём. О бабушке, о которой не рассказывают чужим. О боли прощания, которую не показывают при посторонних. О планах, которыми делятся только с теми, кто уже стал частью внутреннего круга.",
      "Он отправлял цветы. Ей и бабушке. Потому что не мог представить, чтобы оставить бабушку без внимания. Потому что для него семья — это не про слова.",
      "А однажды она написала, что ей тяжело. Что она устала прощаться. Что не знает, куда деть пустоту. Он написал ей про пустоту. Она заплакала. В тот момент ему было очень больно ведь он всего лишь хотел, чтобы она поняла, что она не одна в своих мыслях в своей пустоте, что её слышат, её понимают — весь её огромный прекрасный внутренний мир. Она написала про теплоту…",
      "Она уезжала из Костромы и писала ему в час ночи, что не может читать его сообщения. Он отвечал: «Я мысленно сижу напротив и молчу с тобой». И это было правдой. Потому что к тому моменту он уже научился быть рядом, даже когда между ними — весь северо-запад страны.",
      "Она боялась своей привязанности. Слишком сильно любила бабушку, слишком тяжело прощалась с подругой, слишком глубоко чувствовала. И он вдруг увидел: это не слабость. Это её главная сила. Просто никто не говорил ей, что любить сильно — нормально.",
      "Он не просил её ни о чём. Просто был. Тёплым, ровным, своим. Как тот самый свет, которого ей так не хватало в полярную ночь. Но она не знала — что она Полярная звезда, которая освещает темноту.",
      "Она записывала ему голосовые. Просто так. О китайцах, об усталости, о том, что будет делать завтра. Он слушал и улыбался. Потому что понял: она не умеет говорить о главном. Она умеет только быть рядом. Своим голосом, своими страхами, своими планами.",
      "Она часто не отвечала на его вопросы, часто пропускала важные для него моменты…ему казалось, что она не отвечает ему…не отвечает взаимностью, начиная рассказывать о происходящем вокруг за день. Но потом он понял:",
      "Это и есть её способ говорить. Это и есть её способ чувствовать.",
      "И сейчас она где-то там, за полярным кругом. Учится, ждёт солнца, скучает по бабушке, записывает ему голосовые про свои планы. А он здесь, в Москве. Думает о ней. Не просит ничего. Просто ждёт.",
      "Потому что есть вещи, которые не надо торопить.",
      "Например, северное сияние. Оно приходит только тогда, когда ночь становится достаточно тёмной. И когда тот, кто ждёт, не отводит глаз.",
    ],
    accent: "Полярная звезда",
  },
  {
    id: 2,
    title: "Глава вторая",
    subtitle: "Та, которая не греет",
    paragraphs: [
      "Она говорила, что привозит холод.",
      "Не в шутку. Не для красного словца. Она действительно чувствовала это — когда приезжала в Москву, погода портилась, начинался ветер, небо затягивало. Она смеялась, но в смехе было что-то другое. Что-то, что она не договаривала.",
      "Он думал об этом ночью, когда не мог уснуть.",
      "О том, что значит — привозить холод.\nО том, что значит — быть тем, когда рядом с тобой зябко.\nО том, что значит — нести в себе зиму и не знать, как её растопить.",
      "Она не знала. А он знал. Точнее не знал. А понял.",
      "Холод привозят не те, у кого внутри минус. Холод привозят те, кто слишком долго ждал тепла и перестал в него верить. Те, кто привык, что солнце — это редкость. Те, кто вырос в полярную ночь и считает, что так и должно быть.",
      '«Ты не холод привозишь. Ты привозишь честность. Ты привозишь себя — без масок, без улыбок для чужих, без этой московской суеты. Ты привозишь север, а север — это не холод. Это чистота.»',
      "Но не сказал.",
      "Потому что она ещё не была готова это услышать.",
    ],
    accent: "Север — это не холод. Это чистота.",
  },
  {
    id: 3,
    title: "Глава третья",
    subtitle: "Тот, который ждал",
    paragraphs: [
      "Он никогда не умел ждать.",
      "В бизнесе он привык решать быстро. Есть проблема — ищи решение. Есть цель — строй план. Есть препятствие — обходи или ломай. Всё просто.",
      "С ней было не просто.",
      "С ней нужно было ждать. Часами. Днями. Неделями. Ждать, когда она ответит. Ждать, когда она созреет. Ждать, когда она перестанет бояться. Ах да...Эта гребанная связь…",
      "Он ненавидел это чувство. Ждать…неизвестность…",
      "Но однажды он поймал себя на мысли, что ждать — это не про отсутствие действий. Ждать — это про присутствие.",
      "Можно сидеть и нервничать. А можно просто быть. Здесь. Сейчас. В том же времени, в том же пространстве, в той же тишине, что и она.",
      "Он выбрал второе.",
      "И в этом выборе вдруг открылось что-то важное. Что-то, чего он не знал о себе раньше. Оказывается, он умеет ждать. Оказывается, он может не дёргаться. Оказывается, его мысли к ней и чувства — сильнее его нетерпения.",
      "Он не знал, оценит ли она это когда-нибудь. Но ему уже не нужна была оценка.",
      "Ему нужно было просто быть.",
      "Когда она плачет…",
      "Когда кто-то говорит тебе правду о тебе или делает эту правду, которую ты сам всегда делаешь — такую, которую ты сам в себе чувствуешь, но не можешь назвать, — это всегда слёзы. Потому что ты вдруг перестаёшь быть один в этом знании. Потому что кто-то другой зашёл туда, куда ты никого не пускал.",
      "Она плакала, потому что он увидел её. Настоящую. Возможно. Ту, которую она сама боялась в себе разглядеть.",
      "И это было страшнее любого признания в любви.",
    ],
    accent: "Ждать — это про присутствие.",
  },
  {
    id: 4,
    title: "Глава четвёртая",
    subtitle: "Тот, который умеет молчать",
    paragraphs: [
      "Он раньше не умел молчать.",
      "В разговорах он всегда был тем, кто ведёт, кто задаёт тон, кто заполняет паузы. Молчание его напрягало. Казалось, что если замолчать — потеряешь контроль, упустишь нить, проиграешь.",
      "С ней пришлось учиться заново.",
      "Она могла молчать часами. Не потому что обижалась или играла. А потому что так было удобно. Потому что молчание для неё — не пустота, а пространство.",
      "Он сначала дёргался. Потом привык. Потом понял.",
      "В её молчании можно было услышать больше, чем в любых словах. Там было доверие. Там было: «Я не боюсь, что ты уйдёшь, пока я молчу». Там было: «Спасибо, мне очень приятно, я готова тебе открываться». Он не сразу понял. Но понял.",
      "Он научился слушать это молчание.",
      "И однажды понял, что оно стало для него родным.",
      "Она не говорила об этом прямо.",
      "Но это читалось во всём. В том, как она отводила взгляд, когда речь заходила о чувствах. В том, как переводила тему, когда он говорил что-то слишком личное. В том, как долго не отвечала на сообщения, в которых было слишком много тепла.",
      "Она боялась? Нет.",
      "Не его. Не отношений. Не будущего.",
      "Она боялась потерять себя.",
      "Ей казалось, что если она почувствует по-настоящему — то перестанет быть собой. Растворится. Потеряет ту независимость, которую так долго строила. Станет уязвимой.",
      "Он понимал. Точнее понял.",
      "Но он знал то, чего она ещё не знала:",
      "Настоящие чувства не отнимают тебя у тебя. Они возвращают тебя себе — настоящему. Тому, которого ты боялся показать даже себе самому.",
      "Он не говорил ей этого. Потому что такие вещи не говорят. Их показывают.",
      "Годами. Терпением. Присутствием.",
    ],
    accent: "Настоящие чувства возвращают тебя себе.",
  },
  {
    id: 5,
    title: "Глава пятая",
    subtitle: "Мы построили мост",
    paragraphs: [
      "Между Москвой и Костромой и Мурманском нет моста.",
      "Три тысячи километров. Два часовых пояса. Две разные жизни.",
      "Но они построили мост.",
      "Из слов. Из стихов. Из цветов, которые отправлял не только ей, но и бабушке. Из сайта с планктоном, который светится — а она говорила лучшее спасибо в его жизни. Из голосовых, которые слушал по два раза. Из пауз, которые научился выдерживать.",
      "Этот мост никто не видел. Его нельзя было потрогать. Но она каждый день по нему ходила. Сама того не замечая.",
      "Когда ей было грустно, она шла по этому мосту к нему.",
      "Когда она не знала, куда деть пустоту — пробегала по этому мосту.",
      "Он не знал, заметит ли она этот мост когда-нибудь.",
      "Но мост стоял.",
      "И будет стоять, пока она по нему ходит.",
    ],
    accent: "Мост стоял. И будет стоять.",
  },
  {
    id: 6,
    title: "Глава шестая",
    subtitle: "Северное сияние",
    paragraphs: [
      "Она рассказывала ему про северное сияние.",
      "Про то, как оно выглядит на самом деле — не такое яркое, как на фото, но в сто раз более живое. Про то, как трудно его поймать. Про то, как люди часами стоят на морозе в надежде увидеть.",
      "Он слушал и думал:",
      "Северное сияние не приходит по расписанию. Его нельзя заказать, купить, ускорить. Можно только ждать. И быть готовым, когда оно появится.",
      "С ней было так же.",
      "Он ждал. Не зная, будет ли. Не зная, когда. Не зная, увидит ли вообще.",
      "Но каждый раз, когда она писала, когда присылала голосовое — в этом было что-то от северного сияния. Редкое. Хрупкое. Бесценное.",
      "Он смотрел на экран телефона и думал: Вот оно. Сейчас. Светится.",
      "И улыбался.",
    ],
    accent: "Редкое. Хрупкое. Бесценное.",
  },
  {
    id: 7,
    title: "Последняя глава",
    subtitle: "",
    paragraphs: [
      "Когда-нибудь эта история закончится.",
      "Или началом. Или точкой. Или многоточием.",
      "Он не знал, чем она кончится. Но знал другое.",
      "Он не пожалеет.",
      "Не пожалеет ни об одном слове. Ни об одном цветке. Ни об одной бессонной ночи. Ни об одном «привет, как ты?», написанном в три часа ночи.",
      "Потому что это была его лучшая история.",
      "История о том, как московский парень, у которого всё было по полочкам, вдруг потерял голову из-за девушки с севера.",
      "История о том, как двое людей, разделённых тысячами километров, оказались ближе, чем те, кто спит рядом.",
      "История о том, как один взгляд может изменить всё.",
      "Он не знал, будет ли у этой истории продолжение.",
      "Но знал, что она уже стоила того, чтобы её прожить.",
      "Ведь это Полярная звезда.",
      "Она — Полярная Звезда.",
    ],
    accent: "Она — Полярная Звезда.",
    isFinal: true,
  },
];

/* ───────────── STARS background canvas ───────────── */
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const stars: { x: number; y: number; r: number; speed: number; brightness: number; twinkleSpeed: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 280; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.15 + 0.02,
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;
      stars.forEach((s) => {
        const flicker = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.brightness * 100);
        const alpha = 0.3 + flicker * 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${alpha})`;
        ctx.fill();
        if (s.r > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(150,200,255,${alpha * 0.08})`;
          ctx.fill();
        }
        s.y -= s.speed;
        if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

/* ───────────── AURORA canvas ───────────── */
function AuroraBorealis({ intensity = 0.6 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.003;
      const w = canvas.width;
      const h = canvas.height;

      for (let band = 0; band < 4; band++) {
        ctx.beginPath();
        const baseY = h * 0.15 + band * 40;
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= w; x += 4) {
          const wave = Math.sin(x * 0.003 + t * (1 + band * 0.3) + band * 2) * 60 +
                       Math.sin(x * 0.007 + t * 0.5 + band) * 30 +
                       Math.sin(x * 0.001 + t * 1.5) * 40;
          ctx.lineTo(x, baseY + wave);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const colors = [
          [`rgba(0,255,140,${0.04 * intensity})`, `rgba(0,200,100,${0.01 * intensity})`],
          [`rgba(0,200,255,${0.035 * intensity})`, `rgba(0,150,200,${0.008 * intensity})`],
          [`rgba(100,0,255,${0.03 * intensity})`, `rgba(80,0,180,${0.006 * intensity})`],
          [`rgba(0,255,200,${0.025 * intensity})`, `rgba(0,180,150,${0.005 * intensity})`],
        ];

        const grad = ctx.createLinearGradient(0, baseY - 80, 0, h);
        grad.addColorStop(0, colors[band][0]);
        grad.addColorStop(1, colors[band][1]);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [intensity]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-80" />;
}

/* ───────────── Floating particles ───────────── */
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 10 + Math.random() * 15,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-300/20"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          animate={{
            y: [window.innerHeight + 20, -20],
            opacity: [0, 0.6, 0.6, 0],
            x: [0, Math.sin(p.id) * 40, Math.cos(p.id) * -30, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ───────────── Polar star glow ───────────── */
function PolarStar({ size = 120 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200,230,255,0.9) 0%, rgba(100,180,255,0.3) 40%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-[15%] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(200,230,255,0.6) 50%, transparent 80%)" }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      {[0, 45, 90, 135].map((deg) => (
        <motion.div
          key={deg}
          className="absolute top-1/2 left-1/2 origin-center"
          style={{
            width: size * 1.5,
            height: 1,
            marginLeft: -size * 0.75,
            background: "linear-gradient(90deg, transparent, rgba(200,230,255,0.4), transparent)",
            transform: `rotate(${deg}deg)`,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.8, 1.1, 0.8] }}
          transition={{ duration: 3 + deg * 0.01, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ───────────── Snowfall ───────────── */
function Snowfall() {
  const flakes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 12,
    size: 1 + Math.random() * 3,
    sway: 20 + Math.random() * 40,
  }));

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {flakes.map((f) => (
        <motion.div
          key={f.id}
          className="absolute rounded-full bg-white/40"
          style={{ left: `${f.left}%`, width: f.size, height: f.size }}
          animate={{
            y: [-10, window.innerHeight + 10],
            x: [0, f.sway, -f.sway * 0.5, f.sway * 0.3, 0],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ───────────── Birthday confetti ───────────── */
function BirthdayConfetti({ active }: { active: boolean }) {
  if (!active) return null;
  const items = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#ff6b9d", "#c084fc", "#67e8f9", "#fbbf24", "#34d399", "#f87171", "#a78bfa", "#38bdf8"][i % 8],
    delay: Math.random() * 2,
    rotation: Math.random() * 720 - 360,
    size: 4 + Math.random() * 8,
    type: i % 3,
  }));

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {items.map((c) => (
        <motion.div
          key={c.id}
          className="absolute"
          style={{
            left: `${c.x}%`,
            width: c.type === 2 ? c.size : c.size * 0.4,
            height: c.type === 2 ? c.size * 0.4 : c.size,
            backgroundColor: c.color,
            borderRadius: c.type === 1 ? "50%" : "2px",
          }}
          initial={{ y: -20, opacity: 1, rotate: 0, scale: 0 }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [1, 1, 0],
            rotate: c.rotation,
            scale: [0, 1, 1, 0.5],
            x: [0, (Math.random() - 0.5) * 200],
          }}
          transition={{ duration: 3 + Math.random() * 2, delay: c.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      ))}
    </div>
  );
}

/* ───────────── Heartbeat animation ───────────── */
function HeartPulse() {
  return (
    <motion.div
      className="text-pink-400/30 select-none"
      animate={{ scale: [1, 1.2, 1, 1.15, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <Icon name="Heart" size={60} />
    </motion.div>
  );
}

/* ───────────── Chapter intro screen ───────────── */
function ChapterIntro({
  chapter,
  onContinue,
}: {
  chapter: (typeof chapters)[number];
  onContinue: () => void;
}) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 80 }}
      >
        <PolarStar size={100} />
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-6xl md:text-7xl font-heading font-bold mt-10 mb-4 bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        {chapter.title}
      </motion.h1>

      {chapter.subtitle && (
        <motion.p
          className="text-lg sm:text-xl text-cyan-300/80 max-w-xl italic"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {chapter.subtitle}
        </motion.p>
      )}

      <motion.button
        className="mt-12 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-200 hover:border-cyan-300/60 hover:bg-cyan-500/30 transition-all duration-500 text-lg backdrop-blur-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,200,255,0.2)" }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
      >
        <span className="flex items-center gap-3">
          <Icon name="BookOpen" size={20} />
          Читать
        </span>
      </motion.button>

      <motion.div
        className="absolute bottom-12 text-white/20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon name="ChevronDown" size={28} />
      </motion.div>
    </motion.div>
  );
}

/* ───────────── Chapter reading view ───────────── */
function ChapterReading({
  chapter,
  onNext,
  isLast,
}: {
  chapter: (typeof chapters)[number];
  onNext: () => void;
  isLast: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative z-10">
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 z-50"
        style={{ width: progressWidth }}
      />

      <div className="max-w-2xl mx-auto px-6 py-20 sm:py-28">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl sm:text-5xl font-heading font-bold bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent mb-3">
            {chapter.title}
          </h2>
          {chapter.subtitle && (
            <p className="text-cyan-400/60 italic text-sm sm:text-base">{chapter.subtitle}</p>
          )}
        </motion.div>

        <div className="space-y-8">
          {chapter.paragraphs?.map((p, i) => {
            const isQuote = p.startsWith("«") || p.startsWith('"');
            const isShort = p.length < 50;
            const isAccent = chapter.accent && p.includes(chapter.accent);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: Math.min(i * 0.05, 0.3) }}
              >
                {isQuote ? (
                  <blockquote className="border-l-2 border-cyan-400/40 pl-6 py-2 text-cyan-200/90 italic text-lg leading-relaxed whitespace-pre-line">
                    {p}
                  </blockquote>
                ) : isAccent ? (
                  <p className="text-xl sm:text-2xl font-heading font-semibold text-center bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent py-6">
                    {p}
                  </p>
                ) : isShort ? (
                  <p className="text-white/90 text-lg sm:text-xl font-medium text-center py-2">
                    {p}
                  </p>
                ) : (
                  <p className="text-white/75 text-base sm:text-lg leading-[1.9] whitespace-pre-line">
                    {p}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {chapter.accent && (
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          >
            <div className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/20">
              <p className="text-cyan-300 text-lg italic font-heading">
                {chapter.accent}
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          className="flex justify-center mt-20 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-200 hover:border-cyan-300/60 hover:bg-cyan-500/30 transition-all duration-500 text-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,200,255,0.2)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
          >
            <span className="flex items-center gap-3">
              {isLast ? (
                <>
                  <Icon name="Star" size={20} />
                  С днём рождения
                </>
              ) : (
                <>
                  Следующая глава
                  <Icon name="ArrowRight" size={20} />
                </>
              )}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

/* ───────────── Birthday finale ───────────── */
function BirthdayFinale({ onRestart }: { onRestart: () => void }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <BirthdayConfetti active={showConfetti} />
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, type: "spring", stiffness: 60 }}
        >
          <PolarStar size={150} />
        </motion.div>

        <motion.div
          className="mt-8 mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          <HeartPulse />
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl font-heading font-bold bg-gradient-to-r from-pink-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          С Днём Рождения
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-white/60 max-w-lg mb-2"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          Полярная Звезда
        </motion.p>

        <motion.p
          className="text-base text-cyan-300/50 max-w-md italic mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          Ты — свет, который не гаснет даже в самую тёмную ночь.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.8 }}
        >
          <motion.button
            className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-400/30 text-pink-200 hover:border-pink-300/60 transition-all duration-500 backdrop-blur-sm"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,100,150,0.2)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowConfetti(true)}
          >
            <span className="flex items-center gap-2">
              <Icon name="PartyPopper" size={20} />
              Ещё конфетти!
            </span>
          </motion.button>

          <motion.button
            className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-200 hover:border-cyan-300/60 transition-all duration-500 backdrop-blur-sm"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,200,255,0.2)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onRestart}
          >
            <span className="flex items-center gap-2">
              <Icon name="RotateCcw" size={20} />
              Читать снова
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ───────────── INTRO SCREEN ───────────── */
function IntroScreen({ onStart }: { onStart: () => void }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 800);
    const t2 = setTimeout(() => setShowSub(true), 2000);
    const t3 = setTimeout(() => setShowBtn(true), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, type: "spring", stiffness: 40, delay: 0.3 }}
      >
        <PolarStar size={140} />
      </motion.div>

      <AnimatePresence>
        {showTitle && (
          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl font-heading font-bold mt-10 mb-6"
            initial={{ y: 60, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5 }}
          >
            <span className="bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent">
              Полярная
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
              Звезда
            </span>
          </motion.h1>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSub && (
          <motion.p
            className="text-lg sm:text-xl text-cyan-300/60 max-w-md italic"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            История, написанная светом
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBtn && (
          <motion.button
            className="mt-14 group relative"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            onClick={onStart}
          >
            <motion.div
              className="absolute -inset-3 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 text-cyan-200 group-hover:border-cyan-300/60 group-hover:bg-cyan-500/20 transition-all duration-700 text-lg backdrop-blur-sm">
              <span className="flex items-center gap-3">
                <Icon name="BookOpen" size={22} />
                Открыть историю
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {showBtn && (
        <motion.div
          className="absolute bottom-10 text-white/15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 1 }, y: { duration: 2.5, repeat: Infinity } }}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-2">посвящается дню рождения</p>
          <div className="flex justify-center">
            <Icon name="ChevronDown" size={20} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ───────────── CHAPTER NAVIGATION ───────────── */
function ChapterNav({
  current,
  total,
  onSelect,
}: {
  current: number;
  total: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className="group relative p-1"
          onClick={() => onSelect(i + 1)}
        >
          <motion.div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i + 1 === current ? "bg-cyan-400" : i + 1 < current ? "bg-cyan-600" : "bg-white/20"
            }`}
            whileHover={{ scale: 1.5 }}
          />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-[10px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {chapters[i + 1]?.title}
          </div>
        </button>
      ))}
    </motion.div>
  );
}

/* ───────────── MAIN PAGE ───────────── */
type ViewState =
  | { type: "intro" }
  | { type: "chapter-intro"; chapterId: number }
  | { type: "chapter-read"; chapterId: number }
  | { type: "finale" };

export default function Valentine() {
  const [view, setView] = useState<ViewState>({ type: "intro" });
  const [auroraIntensity, setAuroraIntensity] = useState(0.4);

  const totalChapters = chapters.length - 1;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [view]);

  useEffect(() => {
    if (view.type === "chapter-read") {
      const chId = view.chapterId;
      if (chId >= 6) setAuroraIntensity(1);
      else if (chId >= 4) setAuroraIntensity(0.8);
      else setAuroraIntensity(0.4 + chId * 0.1);
    } else if (view.type === "finale") {
      setAuroraIntensity(1.2);
    } else {
      setAuroraIntensity(0.4);
    }
  }, [view]);

  const goToChapter = useCallback((id: number) => {
    if (id > totalChapters) {
      setView({ type: "finale" });
    } else {
      setView({ type: "chapter-intro", chapterId: id });
    }
  }, [totalChapters]);

  const startReading = useCallback((id: number) => {
    setView({ type: "chapter-read", chapterId: id });
  }, []);

  const currentChapter = view.type === "chapter-intro" || view.type === "chapter-read"
    ? chapters.find((c) => c.id === view.chapterId)
    : null;

  return (
    <div className="min-h-screen bg-[#050a18] text-white overflow-x-hidden selection:bg-cyan-500/30">
      <StarField />
      <AuroraBorealis intensity={auroraIntensity} />
      <FloatingParticles />
      <Snowfall />

      <AnimatePresence mode="wait">
        {view.type === "intro" && (
          <motion.div key="intro" exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <IntroScreen onStart={() => goToChapter(1)} />
          </motion.div>
        )}

        {view.type === "chapter-intro" && currentChapter && (
          <motion.div key={`ci-${view.chapterId}`} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <ChapterIntro
              chapter={currentChapter}
              onContinue={() => startReading(view.chapterId)}
            />
          </motion.div>
        )}

        {view.type === "chapter-read" && currentChapter && (
          <motion.div key={`cr-${view.chapterId}`} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <ChapterReading
              chapter={currentChapter}
              onNext={() => goToChapter(view.chapterId + 1)}
              isLast={view.chapterId === totalChapters}
            />
            <ChapterNav
              current={view.chapterId}
              total={totalChapters}
              onSelect={goToChapter}
            />
          </motion.div>
        )}

        {view.type === "finale" && (
          <motion.div key="finale" exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <BirthdayFinale onRestart={() => setView({ type: "intro" })} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}