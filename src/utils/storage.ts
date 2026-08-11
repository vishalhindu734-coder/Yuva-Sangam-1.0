import { Registration } from '../types';
import { INITIAL_DEMO_REGISTRATIONS } from '../constants/eventDetails';

const STORAGE_KEY = 'yuva_sangam_registrations_v1';
const MY_PASSES_KEY = 'yuva_sangam_my_ticket_ids_v1';

export function getAgeNumber(dobString?: string): number | null {
  if (!dobString) return null;

  let birthDate: Date;
  const cleanStr = dobString.trim();

  // Check if formatted as DD/MM/YYYY or DD-MM-YYYY
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(cleanStr)) {
    const parts = cleanStr.split(/[\/\-]/);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    birthDate = new Date(year, month, day);
    // Prevent JS rollover (e.g., Feb 31 -> March 3)
    if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month || birthDate.getDate() !== day) {
      return null;
    }
  } else if (/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(cleanStr)) {
    const parts = cleanStr.split(/[\/\-]/);
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    birthDate = new Date(year, month, day);
    // Prevent JS rollover
    if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month || birthDate.getDate() !== day) {
      return null;
    }
  } else {
    birthDate = new Date(cleanStr);
  }

  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 0 || age > 120) return null;
  return age;
}

export function calculateAgeYears(dobString?: string): string | null {
  const age = getAgeNumber(dobString);
  if (age === null) return null;
  return `${age} Y`;
}

export function formatIndianDob(dobString?: string): string {
  if (!dobString) return '';
  const cleanStr = dobString.trim();

  // If already DD-MM-YYYY or DD/MM/YYYY
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(cleanStr)) {
    const parts = cleanStr.split(/[\/\-]/);
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${day}-${month}-${year}`;
  }

  // If YYYY-MM-DD or YYYY/MM/DD
  if (/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(cleanStr)) {
    const parts = cleanStr.split(/[\/\-]/);
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  const d = new Date(cleanStr);
  if (!isNaN(d.getTime())) {
    // For ISO date strings (e.g. YYYY-MM-DD), use UTC date components to avoid timezone offset shifts
    if (/^\d{4}-\d{2}-\d{2}/.test(cleanStr)) {
      const day = String(d.getUTCDate()).padStart(2, '0');
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const year = d.getUTCFullYear();
      return `${day}-${month}-${year}`;
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return cleanStr;
}

export function formatDisplayPhone(phone?: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/^(\+?91[\s-]?)/, '').trim();
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return cleaned || phone;
}

export function getRegistrations(): Registration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial demo data so organizers can test scanning right away
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_REGISTRATIONS));
      return INITIAL_DEMO_REGISTRATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse registrations from storage', err);
    return INITIAL_DEMO_REGISTRATIONS;
  }
}

export function saveRegistration(newReg: Omit<Registration, 'ticketId' | 'registeredAt' | 'checkedIn'>): Registration {
  const registrations = getRegistrations();
  
  // Guarantee unique 5-digit numeric ticket ID
  let ticketId = '';
  let exists = true;
  while (exists) {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    ticketId = `YS2026-${randomId}`;
    exists = registrations.some(r => r.ticketId.toLowerCase() === ticketId.toLowerCase());
  }

  const registration: Registration = {
    ticketId,
    name: newReg.name.trim(),
    dob: newReg.dob ? newReg.dob.trim() : undefined,
    village: newReg.village ? newReg.village.trim() : undefined,
    subDivision: newReg.subDivision ? newReg.subDivision.trim() : undefined,
    phone: newReg.phone.trim(),
    otherInfo: newReg.otherInfo ? newReg.otherInfo.trim() : undefined,
    registeredAt: new Date().toISOString(),
    checkedIn: false,
  };

  const updated = [registration, ...registrations];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Save ticketId to local saved passes list
  saveMyPassId(ticketId);

  // Notify listeners that registration list updated
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('yuva_sangam_registration_added'));
  }

  return registration;
}

export function findRegistration(ticketIdOrPhone: string): Registration | undefined {
  const registrations = getRegistrations();
  const query = ticketIdOrPhone.trim().toLowerCase();
  
  // Clean phone digits for matching
  const queryDigits = query.replace(/\D/g, '');

  return registrations.find(r => {
    if (r.ticketId.toLowerCase() === query) return true;
    const cleanRPhone = r.phone.replace(/\D/g, '');
    if (queryDigits.length >= 10 && (cleanRPhone === queryDigits || cleanRPhone.endsWith(queryDigits))) return true;
    if (queryDigits.length >= 6 && queryDigits.length < 10 && (cleanRPhone === queryDigits || cleanRPhone.endsWith(queryDigits))) return true;
    return false;
  });
}

export function performCheckIn(ticketId: string): { success: boolean; registration?: Registration; message: string; alreadyCheckedIn?: boolean } {
  const registrations = getRegistrations();
  const index = registrations.findIndex(r => r.ticketId.toLowerCase() === ticketId.trim().toLowerCase());

  if (index === -1) {
    return {
      success: false,
      message: `No registration found matching Ticket ID "${ticketId}".`,
    };
  }

  const existing = registrations[index];

  if (existing.checkedIn) {
    const timeStr = existing.checkedInAt ? new Date(existing.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'earlier';
    return {
      success: false,
      registration: existing,
      alreadyCheckedIn: true,
      message: `Attendee "${existing.name}" was ALREADY checked in at ${timeStr}.`,
    };
  }

  // Update check-in status
  const updatedReg: Registration = {
    ...existing,
    checkedIn: true,
    checkedInAt: new Date().toISOString(),
  };

  registrations[index] = updatedReg;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));

  return {
    success: true,
    registration: updatedReg,
    message: `Check-in Successful! Welcome ${updatedReg.name}.`,
  };
}

export function toggleCheckIn(ticketId: string): Registration[] {
  const registrations = getRegistrations();
  const updated = registrations.map(r => {
    if (r.ticketId === ticketId) {
      return {
        ...r,
        checkedIn: !r.checkedIn,
        checkedInAt: !r.checkedIn ? new Date().toISOString() : undefined,
      };
    }
    return r;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function saveMyPassId(ticketId: string) {
  try {
    const raw = localStorage.getItem(MY_PASSES_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (!ids.includes(ticketId)) {
      ids.unshift(ticketId);
      localStorage.setItem(MY_PASSES_KEY, JSON.stringify(ids));
    }
  } catch (e) {
    console.error('Error saving pass id', e);
  }
}

export function getMyPassIds(): string[] {
  try {
    const raw = localStorage.getItem(MY_PASSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function exportToCSV(registrations: Registration[]) {
  const headers = ['Ticket ID', 'Name', 'DOB', 'Village Name', 'Sub Division', 'Mobile Number', 'Other Info', 'Registered At', 'Checked In', 'Check-In Time'];
  const rows = registrations.map(r => [
    r.ticketId,
    `"${(r.name || '').replace(/"/g, '""')}"`,
    `"${r.dob || ''}"`,
    `"${(r.village || '').replace(/"/g, '""')}"`,
    `"${(r.subDivision || '').replace(/"/g, '""')}"`,
    `"${r.phone}"`,
    `"${(r.otherInfo || '').replace(/"/g, '""')}"`,
    r.registeredAt ? new Date(r.registeredAt).toLocaleString() : '',
    r.checkedIn ? 'YES' : 'NO',
    r.checkedInAt ? new Date(r.checkedInAt).toLocaleString() : '',
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Yuva_Sangam_Registrations_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
