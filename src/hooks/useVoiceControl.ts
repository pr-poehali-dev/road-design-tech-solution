import { useState, useRef, useCallback, useEffect } from 'react';
import { evdenApi } from '@/lib/evden2Api';

interface UseVoiceControlOptions {
  onExecuted?: () => void;
}

export function useVoiceControl({ onExecuted }: UseVoiceControlOptions = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [lastReply, setLastReply] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const processTranscript = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setProcessing(true);
      try {
        const res = await evdenApi.voiceCommand(text);
        setLastReply(res.reply);
        speak(res.reply);
        if (res.action !== 'none') {
          onExecuted?.();
        }
      } catch (e: any) {
        const errReply = 'Не удалось выполнить команду: ' + e.message;
        setLastReply(errReply);
        speak('Произошла ошибка при обработке команды');
      } finally {
        setProcessing(false);
      }
    },
    [onExecuted, speak]
  );

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript('');
    setLastReply('');
    setListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      // already started
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
    setTranscript((current) => {
      if (current.trim()) {
        processTranscript(current);
      }
      return current;
    });
  }, [processTranscript]);

  return { listening, transcript, processing, lastReply, supported, start, stop };
}
