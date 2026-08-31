import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Downloads an HTML element as PNG image.
 * @param {string} elementId - DOM ID of element to export
 * @param {string} filename - Output PNG filename
 */
export async function downloadTokenAsPNG(elementId, filename = 'littoral-token.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    const dataUrl = await toPng(element, { pixelRatio: 3, cacheBust: true });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Error generating token image:', err);
  }
}

/**
 * Downloads the Unit Tracker as PNG image in 9.5 : 13.5 aspect ratio.
 * @param {string} elementId - DOM ID of unit tracker container
 * @param {string} filename - Output PNG filename
 */
export async function downloadUnitTrackerAsPNG(elementId = 'unit-tracker-export', filename = 'unit-tracker.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Unit Tracker element with id ${elementId} not found`);
    return;
  }

  try {
    const dataUrl = await toPng(element, { pixelRatio: 4, cacheBust: true });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Error generating unit tracker image:', err);
  }
}

/**
 * Generates and downloads a printable PDF containing front and back side tokens formatted on A4 page.
 * @param {string} frontElementId - DOM ID of front token element
 * @param {string} backElementId - DOM ID of back token element
 * @param {string} unitName - Name of the unit for PDF title
 */
export async function generatePrintablePDF(frontElementId, backElementId, unitName = 'token') {
  const frontEl = document.getElementById(frontElementId);
  const backEl = document.getElementById(backElementId);

  if (!frontEl || !backEl) {
    console.error('Front or back token element not found');
    return;
  }

  try {
    const frontDataUrl = await toPng(frontEl, { pixelRatio: 3, cacheBust: true });
    const backDataUrl = await toPng(backEl, { pixelRatio: 3, cacheBust: true });

    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Title
    pdf.setFontSize(16);
    pdf.text('Littoral Commander - Printable Tokens', 15, 20);

    pdf.setFontSize(10);
    pdf.text(`Unit Designation: ${unitName}`, 15, 27);
    pdf.text('Token Size: 25mm x 25mm standard scale (shown enlarged below for precise cutting)', 15, 33);

    // Standard game token physical print size: 25mm x 25mm or 40mm x 40mm
    const tokenMM = 40;

    // Row 1: Front and Back side
    pdf.setFontSize(12);
    pdf.text('Front Side', 25, 45);
    pdf.addImage(frontDataUrl, 'PNG', 20, 50, tokenMM, tokenMM);

    pdf.text('Back Side', 85, 45);
    pdf.addImage(backDataUrl, 'PNG', 80, 50, tokenMM, tokenMM);

    // Grid of multiple printable tokens
    pdf.text('Print Grid (10 Front Tokens)', 15, 105);
    let startY = 112;
    let startX = 15;
    const padding = 5;

    for (let i = 0; i < 10; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = startX + col * (tokenMM + padding);
      const y = startY + row * (tokenMM + padding);

      pdf.addImage(frontDataUrl, 'PNG', x, y, tokenMM, tokenMM);
    }

    pdf.save(`${unitName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-tokens.pdf`);
  } catch (err) {
    console.error('Error generating printable PDF:', err);
  }
}
