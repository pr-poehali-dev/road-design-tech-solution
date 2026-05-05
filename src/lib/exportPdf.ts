import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Загружаем изображение через fetch и конвертируем в data URL (base64).
 * Это обходит CORS-ограничения canvas — браузер сам делает запрос,
 * а мы подставляем src уже как data: URI до рендера html2canvas.
 */
async function toDataUrl(src: string): Promise<string> {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return src; // fallback — оставляем как есть
  }
}

/**
 * Заменяет src всех <img> внутри элемента на base64 data URL,
 * возвращает функцию восстановления оригинальных src.
 */
async function inlineImages(el: HTMLElement): Promise<() => void> {
  const imgs = Array.from(el.querySelectorAll("img")) as HTMLImageElement[];
  const originals: { img: HTMLImageElement; src: string }[] = [];

  await Promise.all(
    imgs.map(async (img) => {
      const originalSrc = img.getAttribute("data-original-src") || img.src;
      // пропускаем уже инлайновые
      if (originalSrc.startsWith("data:")) return;
      const dataUrl = await toDataUrl(originalSrc);
      originals.push({ img, src: img.src });
      img.src = dataUrl;
    }),
  );

  // ждём перерисовки
  await new Promise((r) => setTimeout(r, 100));

  return () => {
    originals.forEach(({ img, src }) => {
      img.src = src;
    });
  };
}

export async function exportElementToPdf(
  el: HTMLElement,
  filename: string,
  windowWidth = 1123,
): Promise<void> {
  // Инлайним все внешние картинки → base64
  const restore = await inlineImages(el);

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: false,
    allowTaint: true,
    backgroundColor: "#ffffff",
    windowWidth,
    logging: false,
  });

  // Возвращаем оригинальные src
  restore();

  const pageW = 210;
  const pageH = 297;
  const imgW = pageW;
  const imgH = (canvas.height / canvas.width) * imgW;

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let remaining = imgH;
  let page = 0;
  const bgData = canvas.toDataURL("image/jpeg", 0.95);

  while (remaining > 0) {
    if (page > 0) pdf.addPage();
    pdf.addImage(bgData, "JPEG", 0, -page * pageH, imgW, imgH, undefined, "FAST");
    if (remaining > pageH) {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, pageH, pageW, imgH + 10, "F");
    }
    remaining -= pageH;
    page++;
  }

  pdf.save(filename);
}
