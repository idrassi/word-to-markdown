import JSZip from 'jszip';
import { ConversionResult } from '../types';

export async function generateZipBundle(result: ConversionResult): Promise<Blob> {
  const zip = new JSZip();

  zip.file(`${result.filename}.md`, result.markdown);

  if (result.images.length > 0) {
    const imagesFolder = zip.folder('images');
    if (imagesFolder) {
      for (const image of result.images) {
        imagesFolder.file(image.name, image.data);
      }
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadZipFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
