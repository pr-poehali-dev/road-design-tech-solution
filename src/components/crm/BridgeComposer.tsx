import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import {
  bridgeApi,
  BridgeChannel,
  BridgeMessage,
  BridgeSignature,
  BridgeDepoFileInput,
} from '@/lib/bridgeApi';
import { fileToDataUrl, fileIcon } from '@/lib/fileUtils';
import BridgeDepoPicker from './BridgeDepoPicker';
import BridgeSignatureManager from './BridgeSignatureManager';

const CHANNEL_ICON: Record<BridgeChannel, string> = {
  email: 'Mail',
  telegram: 'Send',
  max: 'MessageCircle',
};

const CHANNEL_LABEL: Record<BridgeChannel, string> = {
  email: 'Почта',
  telegram: 'Telegram',
  max: 'MAX',
};

export interface PendingAttachment {
  name: string;
  mime: string;
  size: number;
  dataUrl: string;
}

interface BridgeComposerProps {
  clientId?: number | null;
  clientEmail?: string | null;
  mailboxes: string[];
  partnerId?: number;
  replyTo?: BridgeMessage | null;
  onCancelReply?: () => void;
  onSent: (newClientId?: number | null) => void;
  allowNewLead?: boolean;
  compact?: boolean;
}

export const BridgeComposer = ({
  clientId,
  clientEmail,
  mailboxes,
  partnerId,
  replyTo,
  onCancelReply,
  onSent,
  allowNewLead = true,
  compact = false,
}: BridgeComposerProps) => {
  const [channel, setChannel] = useState<BridgeChannel>('email');
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [mailbox, setMailbox] = useState(mailboxes[0] || '');
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [depoFiles, setDepoFiles] = useState<BridgeDepoFileInput[]>([]);
  const [signatures, setSignatures] = useState<BridgeSignature[]>([]);
  const [signatureId, setSignatureId] = useState<number | null>(null);
  const [createLead, setCreateLead] = useState(false);
  const [sending, setSending] = useState(false);
  const [depoOpen, setDepoOpen] = useState(false);
  const [signaturesOpen, setSignaturesOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSignatures = async () => {
    try {
      const res = await bridgeApi.getSignatures(partnerId);
      setSignatures(res.signatures);
      const def = res.signatures.find((s) => s.is_default);
      if (def) setSignatureId((prev) => prev ?? def.id);
    } catch (error) {
      console.error('Error loading signatures:', error);
    }
  };

  useEffect(() => {
    loadSignatures();
  }, [partnerId]);

  useEffect(() => {
    if (mailboxes.length && !mailbox) setMailbox(mailboxes[0]);
  }, [mailboxes, mailbox]);

  // Подготовка ответа: подставляем адресатов и тему из исходного письма
  useEffect(() => {
    if (!replyTo) return;
    setChannel('email');
    const base = replyTo.subject || '';
    setSubject(base.toLowerCase().startsWith('re:') ? base : base ? `Re: ${base}` : '');
    setTo(replyTo.direction === 'in' ? replyTo.email_from || '' : replyTo.email_to || '');
    if (replyTo.mailbox && mailboxes.includes(replyTo.mailbox)) setMailbox(replyTo.mailbox);
  }, [replyTo, mailboxes]);

  const replyAll = () => {
    if (!replyTo) return;
    const own = new Set(mailboxes.map((m) => m.toLowerCase()));
    const parse = (v?: string | null) =>
      (v || '')
        .split(/[,;]\s*/)
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.includes('@') && !own.has(s));

    const sender = replyTo.direction === 'in' ? replyTo.email_from : replyTo.email_to;
    const primary = (sender || '').toLowerCase();
    const others = [...parse(replyTo.email_to_all), ...parse(replyTo.email_cc)].filter((a) => a !== primary);

    setTo(primary);
    setCc(Array.from(new Set(others)).join(', '));
    setShowCc(true);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const added: PendingAttachment[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 25 * 1024 * 1024) {
        alert(`Файл "${file.name}" превышает 25 МБ и не будет прикреплён`);
        continue;
      }
      const dataUrl = await fileToDataUrl(file);
      added.push({ name: file.name, mime: file.type || 'application/octet-stream', size: file.size, dataUrl });
    }
    setAttachments((prev) => [...prev, ...added]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const reset = () => {
    setText('');
    setSubject('');
    setCc('');
    setShowCc(false);
    setAttachments([]);
    setDepoFiles([]);
    setCreateLead(false);
    if (!clientId) setTo('');
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      if (channel === 'email') {
        const recipients = to.trim() || clientEmail || '';
        if (!recipients) {
          alert('Укажите получателя письма');
          setSending(false);
          return;
        }
        const res = await bridgeApi.sendEmail(
          {
            client_id: clientId || undefined,
            subject: subject || undefined,
            body: text.trim(),
            to: recipients,
            cc: cc.trim() || undefined,
            mailbox: mailbox || undefined,
            attachments: attachments.map((a) => ({ name: a.name, mime: a.mime, data: a.dataUrl })),
            depo_files: depoFiles.length ? depoFiles : undefined,
            reply_to_message_id: replyTo?.id,
            signature_id: signatureId,
            create_lead: createLead,
          },
          partnerId,
        );
        reset();
        onCancelReply?.();
        onSent(res.client_id);
      } else if (channel === 'telegram') {
        if (!clientId) {
          alert('Telegram доступен только в диалоге с клиентом');
          setSending(false);
          return;
        }
        await bridgeApi.sendTelegram({ client_id: clientId, body: text.trim() }, partnerId);
        reset();
        onSent();
      } else {
        alert('Канал MAX пока не подключён');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const totalFiles = attachments.length + depoFiles.length;

  return (
    <div className="p-3 border-t border-[#45A29E]/20 space-y-2">
      {replyTo && (
        <div className="flex items-center gap-2 text-[11px] px-2 py-1.5 rounded-md bg-[#45A29E]/10 border border-[#45A29E]/30">
          <Icon name="CornerUpLeft" size={12} className="text-[#66FCF1] shrink-0" />
          <span className="text-[#8B98A5] truncate flex-1">
            Ответ на: <span className="text-white">{replyTo.subject || 'без темы'}</span>
          </span>
          <button onClick={replyAll} className="text-[#66FCF1] hover:underline shrink-0" title="Ответить всем участникам">
            Ответить всем
          </button>
          <button onClick={onCancelReply} className="text-[#8B98A5] hover:text-white shrink-0">
            <Icon name="X" size={12} />
          </button>
        </div>
      )}

      <div className="flex gap-1 items-center flex-wrap">
        {(['email', 'telegram', 'max'] as const).map((ch) => (
          <button
            key={ch}
            onClick={() => setChannel(ch)}
            disabled={ch === 'max'}
            className={`text-[10px] px-2 py-1 rounded-md flex items-center gap-1 disabled:opacity-30 ${
              channel === ch ? 'bg-[#45A29E] text-[#0B0C10] font-bold' : 'bg-[#0B0C10]/40 text-[#8B98A5]'
            }`}
          >
            <Icon name={CHANNEL_ICON[ch]} size={10} />
            {CHANNEL_LABEL[ch]}
          </button>
        ))}
        {channel === 'email' && mailboxes.length > 1 && (
          <select
            value={mailbox}
            onChange={(e) => setMailbox(e.target.value)}
            className="text-[10px] h-6 rounded-md bg-[#0B0C10]/40 border border-[#45A29E]/30 text-white px-1.5 ml-auto"
            title="С какой почты отправить"
          >
            {mailboxes.map((mb) => (
              <option key={mb} value={mb}>{mb}</option>
            ))}
          </select>
        )}
      </div>

      {channel === 'email' && (
        <>
          <div className="flex gap-2">
            <Input
              placeholder={clientEmail ? `Кому (по умолчанию ${clientEmail})` : 'Кому: адреса через запятую'}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-8 text-xs bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684]"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowCc((v) => !v)}
              className={`h-8 px-2 text-[10px] shrink-0 ${showCc ? 'text-[#66FCF1]' : 'text-[#8B98A5]'} hover:bg-[#45A29E]/10`}
              title="Добавить копию"
            >
              Копия
            </Button>
          </div>

          {showCc && (
            <Input
              placeholder="Копия: адреса через запятую"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="h-8 text-xs bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684]"
            />
          )}

          <Input
            placeholder="Тема письма"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-8 text-xs bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684]"
          />
        </>
      )}

      {totalFiles > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {attachments.map((a, idx) => (
            <span
              key={`a-${idx}`}
              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-[#0B0C10]/50 border border-[#45A29E]/30 text-[#8B98A5] max-w-[180px]"
            >
              <Icon name={fileIcon(a.name, a.mime)} size={11} className="shrink-0" />
              <span className="truncate">{a.name}</span>
              <button
                onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                className="shrink-0 hover:text-[#FF6600]"
              >
                <Icon name="X" size={11} />
              </button>
            </span>
          ))}
          {depoFiles.map((f, idx) => (
            <span
              key={`d-${idx}`}
              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-[#45A29E]/10 border border-[#45A29E]/40 text-[#66FCF1] max-w-[180px]"
            >
              <Icon name="FolderOpen" size={11} className="shrink-0" />
              <span className="truncate">{f.name}</span>
              <button
                onClick={() => setDepoFiles((prev) => prev.filter((_, i) => i !== idx))}
                className="shrink-0 hover:text-[#FF6600]"
              >
                <Icon name="X" size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      {channel === 'email' && (
        <div className="flex items-center gap-2 flex-wrap text-[10px]">
          <select
            value={signatureId ?? ''}
            onChange={(e) => setSignatureId(e.target.value ? Number(e.target.value) : null)}
            className="h-6 rounded-md bg-[#0B0C10]/40 border border-[#45A29E]/30 text-white px-1.5"
            title="Подпись к письму"
          >
            <option value="">Без подписи</option>
            {signatures.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button
            onClick={() => setSignaturesOpen(true)}
            className="text-[#66FCF1] hover:underline"
          >
            Настроить подписи
          </button>
          {allowNewLead && !clientId && (
            <label className="flex items-center gap-1.5 text-[#8B98A5] cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={createLead}
                onChange={(e) => setCreateLead(e.target.checked)}
                className="accent-[#45A29E]"
              />
              Создать новый лид
            </label>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Textarea
          placeholder="Сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={compact ? 2 : 3}
          className="text-sm bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684] resize-none"
        />
        {channel === 'email' && (
          <>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="h-auto px-3 text-[#8B98A5] hover:text-[#66FCF1] shrink-0"
              title="Прикрепить файл с компьютера"
            >
              <Icon name="Paperclip" size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDepoOpen(true)}
              className="h-auto px-3 text-[#8B98A5] hover:text-[#66FCF1] shrink-0"
              title="Прикрепить файл из депозитария"
            >
              <Icon name="FolderOpen" size={16} />
            </Button>
          </>
        )}
        <Button
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className="h-auto px-4 bg-[#45A29E] hover:bg-[#3d8f8b] text-[#0B0C10] font-bold shrink-0 disabled:opacity-40"
        >
          <Icon name={sending ? 'Loader2' : 'Send'} size={16} className={sending ? 'animate-spin' : ''} />
        </Button>
      </div>

      <BridgeDepoPicker
        open={depoOpen}
        onClose={() => setDepoOpen(false)}
        onPick={(picked) => setDepoFiles((prev) => [...prev, ...picked])}
      />
      <BridgeSignatureManager
        open={signaturesOpen}
        onClose={() => setSignaturesOpen(false)}
        partnerId={partnerId}
        onSaved={loadSignatures}
      />
    </div>
  );
};

export default BridgeComposer;
