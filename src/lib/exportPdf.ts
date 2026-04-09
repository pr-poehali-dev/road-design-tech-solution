import jsPDF from "jspdf";
import html2canvas from "html2canvas";

async function toDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

/**
 * Replaces all <img> src with base64 versions, runs html2canvas, then restores original srcs.
 * Returns the generated jsPDF instance (already saved).
 */
export async function exportElementToPdf(
  el: HTMLElement,
  filename: string,
  windowWidth = 1123,
): Promise<void> {
  // Collect all images and convert to base64
  const imgs = Array.from(el.querySelectorAll("img")) as HTMLImageElement[];
  const origSrcs = imgs.map((img) => img.src);

  await Promise.all(
    imgs.map(async (img) => {
      try {
        img.src = await toDataUrl(img.src);
      } catch {
        // leave original if fetch fails
      }
    }),
  );

  // Small pause for paint
  await new Promise((r) => setTimeout(r, 200));

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    windowWidth,
  });

  // Restore original srcs
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
