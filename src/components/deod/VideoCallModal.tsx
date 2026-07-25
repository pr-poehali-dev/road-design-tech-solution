import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';

const JITSI_DOMAIN = 'meet.jit.si';

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

let scriptPromise: Promise<void> | null = null;
const loadJitsiScript = () => {
  if (window.JitsiMeetExternalAPI) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://${JITSI_DOMAIN}/external_api.js`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Не удалось загрузить видеосвязь'));
    document.body.appendChild(s);
  });
  return scriptPromise;
};

interface Props {
  room: string | null;
  displayName: string;
  onClose: () => void;
}

const VideoCallModal = ({ room, displayName, onClose }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!room) return;
    let disposed = false;
    setLoading(true);
    setError('');

    loadJitsiScript()
      .then(() => {
        if (disposed || !containerRef.current) return;
        apiRef.current = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
          roomName: room,
          parentNode: containerRef.current,
          width: '100%',
          height: '100%',
          userInfo: { displayName },
          configOverwrite: {
            prejoinPageEnabled: false,
            startWithAudioMuted: false,
            disableDeepLinking: true,
          },
          interfaceConfigOverwrite: {
            MOBILE_APP_PROMO: false,
            SHOW_JITSI_WATERMARK: false,
            SHOW_CHROME_EXTENSION_BANNER: false,
          },
        });
        apiRef.current.addEventListener('videoConferenceJoined', () => setLoading(false));
        apiRef.current.addEventListener('readyToClose', () => onClose());
      })
      .catch((e) => { if (!disposed) { setError(e.message); setLoading(false); } });

    return () => {
      disposed = true;
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  return (
    <AnimatePresence>
      {room && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-[#0B0C10] flex flex-col"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#45A29E]/30 bg-[#0B0C10]/90 backdrop-blur-lg shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center">
              <Icon name="Video" size={16} className="text-[#66FCF1]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-heading font-bold text-sm text-white">Видеосвязь · Межзвездная связь</div>
              <div className="text-[10px] text-[#45A29E] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D] animate-pulse" /> прямой эфир
              </div>
            </div>
            <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF4D4D] text-white text-sm font-bold hover:opacity-90">
              <Icon name="PhoneOff" size={15} /> Завершить
            </button>
          </div>

          <div className="relative flex-1 min-h-0">
            {loading && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3 z-10">
                <Icon name="Loader2" size={32} className="animate-spin text-[#66FCF1]" />
                <span className="text-sm text-[#8B98A5]">Устанавливаем видеосвязь с орбитой...</span>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3 z-10 px-6">
                <Icon name="AlertTriangle" size={32} className="text-[#FF4D4D]" />
                <span className="text-sm text-[#FF9B9B]">{error}</span>
                <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold">Закрыть</button>
              </div>
            )}
            <div ref={containerRef} className="w-full h-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoCallModal;
