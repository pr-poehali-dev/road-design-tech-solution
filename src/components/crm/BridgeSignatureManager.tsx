import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { bridgeApi, BridgeSignature } from '@/lib/bridgeApi';
import { fileToDataUrl } from '@/lib/fileUtils';

interface BridgeSignatureManagerProps {
  open: boolean;
  onClose: () => void;
  partnerId?: number;
  onSaved?: () => void;
}

export const BridgeSignatureManager = ({ open, onClose, partnerId, onSaved }: BridgeSignatureManagerProps) => {
  const [signatures, setSignatures] = useState<BridgeSignature[]>([]);
  const [editing, setEditing] = useState<BridgeSignature | null>(null);
  const [name, setName] = useState('');
  const [html, setHtml] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const res = await bridgeApi.getSignatures(partnerId);
      setSignatures(res.signatures);
    } catch (error) {
      console.error('Error loading signatures:', error);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const startNew = () => {
    setEditing(null);
    setName('');
    setHtml('');
    setIsDefault(false);
  };

  const startEdit = (sig: BridgeSignature) => {
    setEditing(sig);
    setName(sig.name);
    setHtml(sig.html);
    setIsDefault(sig.is_default);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const dataUrl = await fileToDataUrl(file);
        const res = await bridgeApi.uploadSignatureImage({
          name: file.name,
          mime: file.type || 'image/png',
          data: dataUrl,
        });
        setHtml((prev) => `${prev}\n<img src="${res.url}" alt="${file.name}" style="max-width:280px" />`);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось загрузить картинку');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await bridgeApi.saveSignature(
        { id: editing?.id, name: name.trim(), html, is_default: isDefault },
        partnerId,
      );
      await load();
      startNew();
      onSaved?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось сохранить подпись');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#1F2833] rounded-lg border border-[#45A29E]/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#45A29E]/20 flex items-center justify-between">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="PenLine" size={16} className="text-[#66FCF1]" />
            Подписи к письмам
          </div>
          <button onClick={onClose} className="text-[#8B98A5] hover:text-white">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
          <div className="space-y-2">
            <Button
              onClick={startNew}
              size="sm"
              className="w-full bg-[#45A29E] hover:bg-[#3d8f8b] text-[#0B0C10] font-bold"
            >
              <Icon name="Plus" size={14} className="mr-1" />
              Новая подпись
            </Button>
            {signatures.map((sig) => (
              <button
                key={sig.id}
                onClick={() => startEdit(sig)}
                className={`w-full text-left p-2 rounded-md border text-xs transition-colors ${
                  editing?.id === sig.id
                    ? 'bg-[#45A29E]/15 border-[#45A29E]/50 text-white'
                    : 'bg-[#0B0C10]/40 border-[#45A29E]/20 text-[#8B98A5] hover:text-white'
                }`}
              >
                <div className="font-medium truncate">{sig.name}</div>
                {sig.is_default && <div className="text-[10px] text-[#66FCF1] mt-0.5">по умолчанию</div>}
              </button>
            ))}
            {signatures.length === 0 && (
              <div className="text-xs text-[#6B7684] text-center py-4">Подписей пока нет</div>
            )}
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Название подписи (например: Иван Петров, СППИ)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-sm bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684]"
            />
            <Textarea
              placeholder="Текст подписи. Можно использовать оформление: <b>жирный</b>, <br> перенос строки, ссылки."
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={8}
              className="text-sm bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684] font-mono"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={uploading}
                onClick={() => imageInputRef.current?.click()}
                className="text-[#66FCF1] hover:bg-[#45A29E]/10 text-xs"
              >
                <Icon name={uploading ? 'Loader2' : 'ImagePlus'} size={14} className={`mr-1 ${uploading ? 'animate-spin' : ''}`} />
                Добавить картинку
              </Button>
              <label className="flex items-center gap-1.5 text-xs text-[#8B98A5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="accent-[#45A29E]"
                />
                Использовать по умолчанию
              </label>
            </div>

            {html && (
              <div className="rounded-md border border-[#45A29E]/20 bg-[#0B0C10]/40 p-3">
                <div className="text-[10px] text-[#6B7684] mb-2 uppercase tracking-wide">Предпросмотр</div>
                <div className="text-sm text-[#C5C6C7] bridge-signature-preview" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            )}

            <Button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="bg-[#45A29E] hover:bg-[#3d8f8b] text-[#0B0C10] font-bold disabled:opacity-40"
            >
              <Icon name={saving ? 'Loader2' : 'Check'} size={15} className={`mr-1 ${saving ? 'animate-spin' : ''}`} />
              {editing ? 'Сохранить изменения' : 'Создать подпись'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridgeSignatureManager;