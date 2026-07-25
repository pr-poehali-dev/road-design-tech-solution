export function formatSize(bytes?: number | null): string {
  if (!bytes) return '';
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

const EXT_ICON: Record<string, string> = {
  pdf: 'FileText',
  doc: 'FileText', docx: 'FileText', txt: 'FileText', md: 'FileText', rtf: 'FileText',
  xls: 'FileSpreadsheet', xlsx: 'FileSpreadsheet', csv: 'FileSpreadsheet',
  ppt: 'FileImage', pptx: 'FileImage',
  jpg: 'Image', jpeg: 'Image', png: 'Image', gif: 'Image', svg: 'Image', webp: 'Image', bmp: 'Image',
  mp4: 'Video', avi: 'Video', mov: 'Video', mkv: 'Video', webm: 'Video',
  mp3: 'Music', wav: 'Music', ogg: 'Music', flac: 'Music',
  zip: 'FileArchive', rar: 'FileArchive', '7z': 'FileArchive', tar: 'FileArchive', gz: 'FileArchive',
  json: 'FileCode', xml: 'FileCode', html: 'FileCode', js: 'FileCode', ts: 'FileCode', py: 'FileCode',
  dwg: 'Box', dxf: 'Box', stl: 'Box', obj: 'Box',
};

export function fileIcon(name?: string | null, mime?: string | null): string {
  if (mime) {
    if (mime.startsWith('image/')) return 'Image';
    if (mime.startsWith('video/')) return 'Video';
    if (mime.startsWith('audio/')) return 'Music';
    if (mime === 'application/pdf') return 'FileText';
  }
  const ext = (name || '').split('.').pop()?.toLowerCase() || '';
  return EXT_ICON[ext] || 'File';
}

export function isImage(name?: string | null, mime?: string | null): boolean {
  if (mime?.startsWith('image/')) return true;
  const ext = (name || '').split('.').pop()?.toLowerCase() || '';
  return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext);
}

export function isVideo(name?: string | null, mime?: string | null): boolean {
  if (mime?.startsWith('video/')) return true;
  const ext = (name || '').split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext);
}

export function isPdf(name?: string | null, mime?: string | null): boolean {
  if (mime === 'application/pdf') return true;
  return (name || '').toLowerCase().endsWith('.pdf');
}

export function isAudio(name?: string | null, mime?: string | null): boolean {
  if (mime?.startsWith('audio/')) return true;
  const ext = (name || '').split('.').pop()?.toLowerCase() || '';
  return ['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext);
}
