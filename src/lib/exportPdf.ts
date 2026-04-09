import jsPDF from "jspdf";
import html2canvas from "html2canvas";

async function imgToDataUrl(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      try {
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src + (src.includes("?") ? "&" : "?") + "_cb=" + Date.now();
  });
}

export async function exportElementToPdf(
  el: HTMLElement,
  filename: string,
  windowWidth = 1123,
): Promise<void> {
  const imgs = Array.from(el.querySelectorAll("img")) as HTMLImageElement[];
  const origSrcs = imgs.map((img) => img.getAttribute("src") || "");

  await Promise.all(
    imgs.map(async (img) => {
      const dataUrl = await imgToDataUrl(img.src);
      img.src = dataUrl;
    }),
  );

  await new Promise((r) => setTimeout(r, 300));

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    windowWidth,
  });

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
