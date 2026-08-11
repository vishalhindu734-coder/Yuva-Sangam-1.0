import { toJpeg } from 'html-to-image';

export async function generatePassJpegDataUrl(elementId: string): Promise<string | null> {
  const node = document.getElementById(elementId);
  if (!node) {
    console.error(`Element with id ${elementId} not found.`);
    return null;
  }

  try {
    const dataUrl = await toJpeg(node, {
      quality: 0.95,
      pixelRatio: 2.5, // High resolution for sharp text and QR code
      backgroundColor: '#ffffff',
      fontEmbedCSS: '', // Suppress remote CSS rule parsing to avoid CORS SecurityError
      cacheBust: false,
      filter: (domNode) => {
        if (domNode instanceof HTMLElement && domNode.classList.contains('download-exclude')) {
          return false;
        }
        return true;
      }
    });
    return dataUrl;
  } catch (error) {
    console.error('Failed to generate pass JPEG data URL', error);
    return null;
  }
}

export async function generatePassJpegFile(elementId: string, filename: string): Promise<File | null> {
  const dataUrl = await generatePassJpegDataUrl(elementId);
  if (!dataUrl) return null;

  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const safeFilename = filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? filename : `${filename}.jpg`;
    return new File([blob], safeFilename, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Failed to convert pass data URL to File', error);
    return null;
  }
}

export async function downloadPassAsJpeg(elementId: string, filename: string): Promise<boolean> {
  const dataUrl = await generatePassJpegDataUrl(elementId);
  if (!dataUrl) return false;

  try {
    const link = document.createElement('a');
    link.download = filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? filename : `${filename}.jpg`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Failed to export pass as JPEG', error);
    return false;
  }
}

