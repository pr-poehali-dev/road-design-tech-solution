import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ImgInfo {
  el: HTMLImageElement;
  src: string;
  rect: DOMRect;
  elRect: DOMRect;
}

function waitForImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function exportElementToPdf(
  el: HTMLElement,
  filename: string,
  windowWidth = 1123,
): Promise<void> {
  const elRect = el.getBoundingClientRect();

  // Собираем все <img> с их позициями ДО скрытия
  const imgs = Array.from(el.querySelectorAll("img")) as HTMLImageElement[];
  const imgInfos: ImgInfo[] = imgs.map((img) => ({
    el: img,
    src: img.getAttribute("src") || img.src,
    rect: img.getBoundingClientRect(),
    elRect,
  }));

  // Скрываем изображения — заменяем на прозрачный блок той же размерности
  imgInfos.forEach(({ el: img }) => {
    img.style.visibility = "hidden";
  });

  await new Promise((r) => setTimeout(r, 100));

  // Рендерим без изображений — canvas чистый, toDataURL работает
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: false,
    allowTaint: false,
    backgroundColor: "#ffffff",
    windowWidth,
    logging: false,
  });

  // Восстанавливаем видимость
  imgInfos.forEach(({ el: img }) => {
    img.style.visibility = "";
  });

  const pageW = 210;
  const pageH = 297;
  const imgW = pageW;
  const imgH = (canvas.height / canvas.width) * imgW;
  const scale = imgW / (canvas.width / 2); // mm per CSS px

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Добавляем фоновый рендер страниц
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

  // Накладываем изображения через jsPDF поверх нужных страниц
  await Promise.all(
    imgInfos.map(async ({ src, rect, elRect: containerRect }) => {
      if (!src || src.startsWith("data:") === false && src === "") return;

      // Координаты изображения относительно контейнера в CSS px
      const relTop = rect.top - containerRect.top;
      const relLeft = rect.left - containerRect.left;
      const relW = rect.width;
      const relH = rect.height;

      // Переводим в mm
      const xMm = relLeft * scale;
      const yMm = relTop * scale;
      const wMm = relW * scale;
      const hMm = relH * scale;

      // Определяем страницу
      const pageIndex = Math.floor(yMm / pageH);
      const yOnPage = yMm - pageIndex * pageH;

      try {
        // Загружаем изображение через HTMLImageElement (без CORS canvas — просто для jsPDF)
        await waitForImg(src);
        pdf.setPage(pageIndex + 1);
        pdf.addImage(src, "PNG", xMm, yOnPage, wMm, hMm, undefined, "FAST");
      } catch {
        // не удалось — пропускаем
      }
    }),
  );

  pdf.save(filename);
}
