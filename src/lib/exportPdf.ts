import jsPDF from "jspdf";
import html2canvas from "html2canvas";

async function imgSrcToDataUrl(src: string): Promise<string> {
  // Если уже blob: или data: — рисуем напрямую
  if (src.startsWith("blob:") || src.startsWith("data:")) {
    return drawImgToDataUrl(src);
  }
  // Для внешних URL: fetch → blob → objectURL → canvas (same-origin, без taint)
  try {
    const res = await fetch(src, { mode: "cors" });
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const dataUrl = await drawImgToDataUrl(objectUrl);
    URL.revokeObjectURL(objectUrl);
    return dataUrl;
  } catch {
    // cors не сработал — пробуем no-cors через blob URL
    try {
      const res = await fetch(src, { mode: "no-cors" });
      const blob = await res.blob();
      if (blob.size === 0) return src;
      const objectUrl = URL.createObjectURL(blob);
      const dataUrl = await drawImgToDataUrl(objectUrl);
      URL.revokeObjectURL(objectUrl);
      return dataUrl;
    } catch {
      return src;
    }
  }
}

function drawImgToDataUrl(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width || 200;
      canvas.height = img.naturalHeight || img.height || 200;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      try {
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export async function exportElementToPdf(
  el: HTMLElement,
  filename: string,
  windowWidth = 1123,
): Promise<void> {
  const imgs = Array.from(el.querySelectorAll("img")) as HTMLImageElement[];
  const origSrcs = imgs.map((img) => img.getAttribute("src") || "");

  // Конвертируем все картинки в data URL
  await Promise.all(
    imgs.map(async (img) => {
      const dataUrl = await imgSrcToDataUrl(img.src);
      img.src = dataUrl;
    }),
  );

  // Ждём перерисовки
  await new Promise((r) => setTimeout(r, 400));

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: false,
    allowTaint: true,
    backgroundColor: "#ffffff",
    windowWidth,
    logging: false,
  });

  // Восстанавливаем оригинальные src
  imgs.forEach((img, i) => {
    img.src = origSrcs[i];
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = 210;
  const pageH = 297;
  const imgW = pageW;
  const imgH = (canvas.height / canvas.width) * imgW;
  let remaining = imgH;
  let page = 0;

  while (remaining > 0) {
    if (page > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, -page * pageH, imgW, imgH, undefined, "FAST");
    if (remaining > pageH) {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, pageH, pageW, imgH + 10, "F");
    }
    remaining -= pageH;
    page++;
  }

  pdf.save(filename);
}
