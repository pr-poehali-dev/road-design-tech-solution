const JITSI_DOMAIN = 'meet.jit.si';

// Генерация уникального имени комнаты для встречи DEOD
export function generateRoom(prefix = 'DEOD'): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const ts = Date.now().toString(36).slice(-4);
  return `${prefix}-${ts}${rand}`;
}

export function roomToUrl(room: string): string {
  return `https://${JITSI_DOMAIN}/${room}`;
}

// Известные домены видеовстреч
const MEET_HOSTS = [
  'meet.jit.si',
  'zoom.us',
  'meet.google.com',
  'teams.microsoft.com',
  'whereby.com',
  'telemost.yandex.ru',
  'app.contour.ru',
  'salutejazz.ru',
];

const URL_RE = /(https?:\/\/[^\s]+)/gi;

export interface MeetingLink {
  url: string;
  room: string | null; // если это Jitsi-комната — можно открыть встроенно
  label: string;
}

// Находит ссылку на видеовстречу в тексте сообщения
export function detectMeetingLink(text: string): MeetingLink | null {
  const matches = text.match(URL_RE);
  if (!matches) return null;
  for (const raw of matches) {
    let host = '';
    try {
      host = new URL(raw).host.toLowerCase();
    } catch {
      continue;
    }
    const known = MEET_HOSTS.find((h) => host.endsWith(h));
    if (known) {
      let room: string | null = null;
      if (host.endsWith('meet.jit.si')) {
        try {
          room = new URL(raw).pathname.replace(/^\//, '') || null;
        } catch {
          room = null;
        }
      }
      const label = host.replace(/^www\./, '');
      return { url: raw, room, label };
    }
  }
  return null;
}
