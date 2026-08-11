import { Registration } from '../types';
import { generatePassJpegFile, downloadPassAsJpeg } from './downloadPass';

export function formatWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return '91' + digits.slice(1);
  }
  if (digits.length === 10) {
    return '91' + digits;
  }
  if (digits.length > 12 && digits.startsWith('91')) {
    return digits.slice(0, 12);
  }
  if (digits.length >= 10) {
    return '91' + digits.slice(-10);
  }
  return digits.startsWith('91') ? digits : '91' + digits;
}

export async function shareWhatsAppWithPassImage(
  registration: Registration,
  elementId?: string
): Promise<{ success: boolean; imageAttached: boolean; message: string }> {
  const cleanPhone = formatWhatsAppPhone(registration.phone);
  const text = `*YUVA SANGAM 2026 - OFFICIAL EVENT PASS*\n\n` +
    `Namaste *${registration.name}* ji,\n` +
    `Here is your official verified entry pass for Yuva Sangam 2026.\n\n` +
    `📋 *Pass Details:*\n` +
    `• *Ticket ID:* ${registration.ticketId}\n` +
    `• *Name:* ${registration.name}\n` +
    `• *Mobile:* ${registration.phone}\n` +
    (registration.village ? `• *Village:* ${registration.village}\n` : '') +
    (registration.subDivision ? `• *Sub Division:* ${registration.subDivision}\n` : '') +
    `\n📅 *Date & Time:* Sunday, 23 August 2026 at 8:00 AM IST\n` +
    `📍 *Venue:* Maharaja Agrasen Public School, Sonda (Ambala)\n\n` +
    `Please present this pass at the entrance gate for instant QR verification.`;

  const filename = `Yuva_Sangam_Pass_${registration.name.replace(/\s+/g, '_')}_${registration.ticketId.replace('#', '')}`;

  // 1. Primary: Use Web Share API to attach Pass Image directly to WhatsApp/Share sheet without downloading
  if (elementId && typeof navigator !== 'undefined' && navigator.canShare) {
    try {
      const imageFile = await generatePassJpegFile(elementId, filename);
      if (imageFile && navigator.canShare({ files: [imageFile] })) {
        await navigator.share({
          title: `Yuva Sangam Pass - ${registration.name}`,
          text: text,
          files: [imageFile],
        });
        return {
          success: true,
          imageAttached: true,
          message: 'Pass image & details shared to WhatsApp!',
        };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, imageAttached: false, message: 'Share canceled.' };
      }
      console.warn('Native Web Share with file failed, using fallback:', err);
    }
  }

  // 2. Desktop Fallback: Copy image to clipboard if possible so user can Ctrl+V in WhatsApp Web
  let copiedToClipboard = false;
  if (elementId && typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
    try {
      const imageFile = await generatePassJpegFile(elementId, filename);
      if (imageFile) {
        await navigator.clipboard.write([
          new ClipboardItem({ [imageFile.type]: imageFile })
        ]);
        copiedToClipboard = true;
      }
    } catch (clipErr) {
      console.warn('Could not copy image to clipboard:', clipErr);
    }
  }

  // 3. Download image backup if not shared natively
  let downloaded = false;
  if (elementId) {
    downloaded = await downloadPassAsJpeg(elementId, filename);
  }

  // 4. Open WhatsApp chat directly targeted at recipient phone number
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  const link = document.createElement('a');
  link.href = waUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return {
    success: true,
    imageAttached: downloaded || copiedToClipboard,
    message: copiedToClipboard
      ? `Pass image copied to clipboard! Paste (Ctrl+V) in WhatsApp for +${cleanPhone}`
      : `Opening WhatsApp chat for +${cleanPhone}...`,
  };
}

