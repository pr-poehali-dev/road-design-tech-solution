import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { useNotificationSound } from './useNotificationSound';

interface ChatMsg {
  id: number;
  from: 'me' | string;
  author: string;
  text: string;
  time: string;
  channel: string;
}

const channels = [
  { id: 'general', name: 'Общий канал', icon: 'Hash', online: 9 },
  { id: 'deadspace', name: 'DEAD SPACE', icon: 'Rocket', online: 4 },
  { id: 'engineering', name: 'Инженерный отсек', icon: 'Wrench', online: 6 },
  { id: 'bridge', name: 'Капитанский мостик', icon: 'ShieldCheck', online: 2 },
];

const crew = ['Командор Волкова', 'Инженер Петров', 'Штурман Ким', 'Связист Орлов', 'Бортинженер Ли'];
const incomingSamples = [
  'Приём! Как слышно на орбите?',
  'Отчёт по DEAD SPACE готов, скидываю в депозитарий.',
  'Нужна помощь с дорожной картой по проекту.',
  'Кто на смене в инженерном отсеке?',
  'Груз пристыкован, всё штатно.',
  'Проверьте красное смещение — 2 задачи горят.',
  'Связь стабильна, продолжаем миссию.',
];

const now = () => new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

interface Props {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

const StarComWidget = ({ open, onClose, onUnreadChange }: Props) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeChannel, setActiveChannel] = useState('general');
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState(false);
  const [unread, setUnread] = useState(0);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 1, from: 'Командор Волкова', author: 'Командор Волкова', text: 'Экипаж, добро пожаловать в Межзвездную связь!', time: now(), channel: 'general' },
    { id: 2, from: 'Инженер Петров', author: 'Инженер Петров', text: 'Все системы связи в норме, командир.', time: now(), channel: 'general' },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(3);
  const playSound = useNotificationSound();

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    onUnreadChange?.(unread);
  }, [unread, onUnreadChange]);

  // симуляция входящих сообщений
  useEffect(() => {
    const timer = setInterval(() => {
      const author = crew[Math.floor(Math.random() * crew.length)];
      const text = incomingSamples[Math.floor(Math.random() * incomingSamples.length)];
      const ch = channels[Math.floor(Math.random() * channels.length)].id;
      const msg: ChatMsg = { id: idRef.current++, from: author, author, text, time: now(), channel: ch };
      setMessages((prev) => [...prev, msg]);
      playSound();
      setFlash(true);
      setTimeout(() => setFlash(false), 1600);
      if (!open || minimized) {
        setUnread((u) => u + 1);
      }
      if (open && !minimized && ch === activeChannel) scrollBottom();
    }, 14000);
    return () => clearInterval(timer);
  }, [open, minimized, activeChannel, playSound, scrollBottom]);

  useEffect(() => {
    if (open && !minimized) {
      setUnread(0);
      scrollBottom();
    }
  }, [open, minimized, activeChannel, scrollBottom]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: idRef.current++, from: 'me', author: 'Вы', text, time: now(), channel: activeChannel }]);
    setInput('');
    scrollBottom();
  };

  if (!open) return null;

  const channelMessages = messages.filter((m) => m.channel === activeChannel);
  const activeCh = channels.find((c) => c.id === activeChannel)!;

  const containerClass = fullscreen
    ? 'fixed inset-0 z-[60] w-screen h-screen rounded-none'
    : 'fixed z-[60] w-[380px] max-w-[calc(100vw-1.5rem)] h-[520px] max-h-[calc(100vh-6rem)] rounded-2xl';

  return (
    <motion.div
      drag={!fullscreen}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ left: -window.innerWidth + 400, right: 0, top: -20, bottom: window.innerHeight - 200 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={fullscreen ? {} : { right: 16, top: 96 }}
      className={`${containerClass} border ${flash ? 'border-[#FF6600] shadow-[0_0_40px_rgba(255,102,0,0.5)]' : 'border-[#45A29E]/40 shadow-[0_0_40px_rgba(0,0,0,0.6)]'} bg-[#0B0C10]/95 backdrop-blur-xl overflow-hidden flex flex-col transition-colors`}
    >
      {/* flashing overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.25, 0, 0.25, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="pointer-events-none absolute inset-0 bg-[#FF6600] z-20"
          />
        )}
      </AnimatePresence>

      {/* header — drag handle */}
      <div
        className={`relative flex items-center gap-2 px-3 py-2.5 border-b border-[#45A29E]/30 bg-gradient-to-r from-[#45A29E]/15 to-transparent shrink-0 ${fullscreen ? '' : 'cursor-move'}`}
      >
        <div className="w-8 h-8 rounded-lg bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center shrink-0">
          <Icon name="Radio" size={16} className="text-[#66FCF1]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-heading font-bold text-sm text-white truncate">Межзвездная связь</div>
          <div className="text-[10px] text-[#45A29E] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#45A29E] animate-pulse" /> экипаж на связи
          </div>
        </div>
        <button onClick={() => setMinimized((v) => !v)} title="Свернуть" className="text-[#6B7684] hover:text-[#66FCF1] transition-colors p-1">
          <Icon name={minimized ? 'ChevronUp' : 'Minus'} size={16} />
        </button>
        <button onClick={() => setFullscreen((v) => !v)} title="Во весь экран" className="text-[#6B7684] hover:text-[#66FCF1] transition-colors p-1">
          <Icon name={fullscreen ? 'Minimize2' : 'Maximize2'} size={15} />
        </button>
        <button onClick={onClose} title="Закрыть" className="text-[#6B7684] hover:text-[#FF4D4D] transition-colors p-1">
          <Icon name="X" size={16} />
        </button>
      </div>

      {!minimized && (
        <div className="flex flex-1 min-h-0">
          {/* channels sidebar — only in fullscreen or wide */}
          <div className={`${fullscreen ? 'w-56 flex' : 'hidden'} flex-col border-r border-[#45A29E]/20 bg-[#0B0C10]/60 shrink-0`}>
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#6B7684]">Каналы</div>
            {channels.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChannel(c.id)}
                className={`flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                  activeChannel === c.id ? 'bg-[#45A29E]/15 border-l-2 border-[#66FCF1]' : 'hover:bg-[#1F2833]/60 border-l-2 border-transparent'
                }`}
              >
                <Icon name={c.icon as any} size={15} className="text-[#45A29E] shrink-0" />
                <span className="text-sm text-[#C5C6C7] flex-1 truncate">{c.name}</span>
                <span className="text-[10px] text-[#45A29E]">{c.online}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            {/* compact channel tabs (non-fullscreen) */}
            {!fullscreen && (
              <div className="flex gap-1 px-2 py-1.5 border-b border-[#45A29E]/15 overflow-x-auto scrollbar-hide shrink-0">
                {channels.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveChannel(c.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                      activeChannel === c.id ? 'bg-[#45A29E]/20 text-[#66FCF1]' : 'text-[#8B98A5] hover:text-white'
                    }`}
                  >
                    <Icon name={c.icon as any} size={12} />
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            {fullscreen && (
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#45A29E]/15 shrink-0">
                <Icon name={activeCh.icon as any} size={16} className="text-[#66FCF1]" />
                <span className="font-heading font-semibold text-white">{activeCh.name}</span>
                <span className="text-[11px] text-[#45A29E] ml-2">{activeCh.online} онлайн</span>
              </div>
            )}

            {/* messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
              {channelMessages.map((m) => (
                <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${fullscreen ? 'max-w-[60%]' : 'max-w-[85%]'}`}>
                    {m.from !== 'me' && (
                      <div className="text-[10px] text-[#45A29E] mb-0.5 ml-1">{m.author}</div>
                    )}
                    <div
                      className={`rounded-xl px-3 py-2 text-sm ${
                        m.from === 'me'
                          ? 'bg-[#45A29E]/25 text-white rounded-br-none'
                          : 'bg-[#1F2833] text-[#C5C6C7] rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className={`text-[9px] text-[#6B7684] mt-0.5 ${m.from === 'me' ? 'text-right mr-1' : 'ml-1'}`}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* input */}
            <div className="p-2.5 border-t border-[#45A29E]/20 flex gap-2 shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={`Сообщение в «${activeCh.name}»...`}
                className="flex-1 bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#6B7684] focus:outline-none focus:border-[#66FCF1]/60"
              />
              <button onClick={send} className="w-9 h-9 rounded-lg bg-[#45A29E] hover:bg-[#3d8f8b] flex items-center justify-center shrink-0 transition-colors">
                <Icon name="Send" size={16} className="text-[#0B0C10]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StarComWidget;
