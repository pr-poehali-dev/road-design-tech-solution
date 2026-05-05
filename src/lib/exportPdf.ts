import jsPDF from "jspdf";
import html2canvas from "html2canvas";

async function urlToDataUrl(src: string): Promise<string | null> {
  try {
    const res = await fetch(src, { mode: "cors", cache: "force-cache" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function waitImgLoad(img: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    if (img.complete && img.naturalWidth > 0) { resolve(); return; }
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

export async function exportElementToPdf(
  el: HTMLElement,
  filename: string,
  windowWidth = 1123,
): Promise<void> {
  const imgs = Array.from(el.querySelectorAll("img")) as HTMLImageElement[];

  // Сохраняем оригинальные src и заменяем на base64
  const origSrcs: string[] = [];
  await Promise.all(
    imgs.map(async (img, i) => {
      const src = img.getAttribute("src") || img.src;
      origSrcs[i] = src;
      if (src.startsWith("data:")) return;
      const dataUrl = await urlToDataUrl(src);
      if (dataUrl) {
        img.setAttribute("src", dataUrl);
        await waitImgLoad(img);
      } else {
        // если fetch не сработал — скрываем картинку чтобы не tainting canvas
        img.style.display = "none";
      }
    }),
  );

  // Небольшая пауза для перерисовки
  await new Promise((r) => setTimeout(r, 80));

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: false,
    allowTaint: false,
    backgroundColor: "#ffffff",
    windowWidth,
    logging: false,
  });

  // Восстанавливаем оригинальные src
  imgs.forEach((img, i) => {
    img.setAttribute("src", origSrcs[i]);
    img.style.display = "";
  });

  const pageW = 210;
  const pageH = 297;
  const imgW = pageW;
  const imgH = (canvas.height / canvas.width) * imgW;

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const bgData = canvas.toDataURL("image/jpeg", 0.95);
  let remaining = imgH;
  let page = 0;

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
