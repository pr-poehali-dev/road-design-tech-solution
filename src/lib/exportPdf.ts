import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Предзагружаем все <img> внутри элемента с crossOrigin="anonymous",
 * чтобы html2canvas мог читать их пиксели без CORS-блокировки.
 */
async function preloadImages(el: HTMLElement): Promise<void> {
  const imgs = Array.from(el.querySelectorAll("img")) as HTMLImageElement[];
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const fresh = new Image();
          fresh.crossOrigin = "anonymous";
          fresh.onload = () => resolve();
          fresh.onerror = () => resolve();
          // добавляем cache-bust чтобы браузер переспросил с CORS-заголовком
          const sep = img.src.includes("?") ? "&" : "?";
          fresh.src = img.src + sep + "_cors=1";
          img.crossOrigin = "anonymous";
          img.src = fresh.src;
        }),
    ),
  );
  // даём браузеру перерисовать
  await new Promise((r) => setTimeout(r, 150));
}

export async function exportElementToPdf(
  el: HTMLElement,
  filename: string,
  windowWidth = 1123,
): Promise<void> {
  await preloadImages(el);

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    windowWidth,
    logging: false,
  });

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