import { useCallback, useRef } from 'react';

// Короткий двухтоновый сигнал уведомления через WebAudio (без внешних файлов)
export function useNotificationSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        ctxRef.current = new AC();
      }
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const notes = [880, 1320];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = now + i * 0.12;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.18);
      });
    } catch {
      // звук недоступен — не критично
    }
  }, []);

  return play;
}
