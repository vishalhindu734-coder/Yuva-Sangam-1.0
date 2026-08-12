import { Registration } from '../types';
import { INITIAL_DEMO_REGISTRATIONS } from '../constants/eventDetails';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';

const STORAGE_KEY = 'yuva_sangam_registrations_v1';
const MY_PASSES_KEY = 'yuva_sangam_my_ticket_ids_v1';
const FIRESTORE_COLLECTION = 'registrations';

// Initialize real-time cloud Firestore synchronization
let firestoreUnsubscribe: (() => void) | null = null;

export function initFirestoreSync() {
  if (typeof window === 'undefined' || firestoreUnsubscribe) return;

  try {
    const colRef = collection(db, FIRESTORE_COLLECTION);
    
    firestoreUnsubscribe = onSnapshot(colRef, (snapshot) => {
      if (snapshot.empty) return;

      const remoteRegistrations: Registration[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Registration;
        if (data && data.ticketId) {
          remoteRegistrations.push(data);
        }
      });

      if (remoteRegistrations.length > 0) {
        // Merge with local storage to ensure no loss
        const local = getRegistrations();
        const map = new Map<string, Registration>();

        // Remote takes priority for checkedIn status
        local.forEach(r => map.set(r.ticketId, r));
        remoteRegistrations.forEach(r => map.set(r.ticketId, r));

        const merged = Array.from(map.values()).sort((a, b) => {
          return new Date(b.registeredAt || 0).getTime() - new Date(a.registeredAt || 0).getTime();
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        
        window.dispatchEvent(new Event('yuva_sangam_registration_added'));
      }
    }, (error) => {
      console.warn('Firestore real-time sync offline or pending rules configuration:', error);
    });
  } catch (err) {
    console.error('Error initializing Firestore sync:', err);
  }
}

// Auto-run init Firestore Sync
if (typeof window !== 'undefined') {
  setTimeout(() => {
    initFirestoreSync();
  }, 100);
}

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

export interface AgeCategory {
  id: string;
  code: string;
  warriorName: string;
  shortWarriorName: string;
  label: string;
  shortLabel: string;
  range: string;
  colorName: string;
  hexColor: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  fullBadgeClass: string;
  darkBadgeClass: string;
  dotClass: string;
  passAccentClass: string;
}

export function getAgeCategoryDetails(dobString?: string): AgeCategory | null {
  const age = getAgeNumber(dobString);
  if (age === null) return null;

  if (age >= 15 && age < 20) {
    return {
      id: 'cat_15_20',
      code: 'CAT 15–20',
      warriorName: 'Chhatrapati Shivaji Maharaj',
      shortWarriorName: 'Shivaji',
      label: 'Shivaji (15–20 Yrs)',
      shortLabel: 'Shivaji • 15–20 Yrs',
      range: '15 to 20 Years',
      colorName: 'Emerald Green',
      hexColor: '#10b981',
      bgClass: 'bg-emerald-100',
      textClass: 'text-emerald-900',
      borderClass: 'border-emerald-300',
      fullBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      darkBadgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/50',
      dotClass: 'bg-emerald-500',
      passAccentClass: 'from-emerald-600 to-teal-700'
    };
  }
  if (age >= 20 && age < 25) {
    return {
      id: 'cat_20_25',
      code: 'CAT 20–25',
      warriorName: 'Chandra Shekhar Azad',
      shortWarriorName: 'Azad',
      label: 'Azad (20–25 Yrs)',
      shortLabel: 'Azad • 20–25 Yrs',
      range: '20 to 25 Years',
      colorName: 'Sky Blue',
      hexColor: '#0284c7',
      bgClass: 'bg-sky-100',
      textClass: 'text-sky-900',
      borderClass: 'border-sky-300',
      fullBadgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
      darkBadgeClass: 'bg-sky-950/80 text-sky-300 border-sky-400/50',
      dotClass: 'bg-sky-500',
      passAccentClass: 'from-sky-600 to-blue-700'
    };
  }
  if (age >= 25 && age < 30) {
    return {
      id: 'cat_25_30',
      code: 'CAT 25–30',
      warriorName: 'Maharana Pratap',
      shortWarriorName: 'Pratap',
      label: 'Maharana Pratap (25–30 Yrs)',
      shortLabel: 'Pratap • 25–30 Yrs',
      range: '25 to 30 Years',
      colorName: 'Saffron Amber',
      hexColor: '#d97706',
      bgClass: 'bg-amber-100',
      textClass: 'text-amber-950',
      borderClass: 'border-amber-300',
      fullBadgeClass: 'bg-amber-100 text-amber-950 border-amber-300',
      darkBadgeClass: 'bg-amber-950/80 text-amber-300 border-amber-400/50',
      dotClass: 'bg-amber-500',
      passAccentClass: 'from-amber-600 to-orange-700'
    };
  }
  if (age >= 30 && age < 35) {
    return {
      id: 'cat_30_35',
      code: 'CAT 30–35',
      warriorName: 'Veer Savarkar',
      shortWarriorName: 'Savarkar',
      label: 'Veer Savarkar (30–35 Yrs)',
      shortLabel: 'Savarkar • 30–35 Yrs',
      range: '30 to 35 Years',
      colorName: 'Royal Purple',
      hexColor: '#9333ea',
      bgClass: 'bg-purple-100',
      textClass: 'text-purple-900',
      borderClass: 'border-purple-300',
      fullBadgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
      darkBadgeClass: 'bg-purple-950/80 text-purple-300 border-purple-400/50',
      dotClass: 'bg-purple-500',
      passAccentClass: 'from-purple-600 to-indigo-700'
    };
  }
  if (age >= 35 && age <= 40) {
    return {
      id: 'cat_35_40',
      code: 'CAT 35–40',
      warriorName: 'Banda Singh Bahadur',
      shortWarriorName: 'Banda Bahadur',
      label: 'Banda Bahadur (35–40 Yrs)',
      shortLabel: 'Banda Bahadur • 35–40 Yrs',
      range: '35 to 40 Years',
      colorName: 'Crimson Rose',
      hexColor: '#e11d48',
      bgClass: 'bg-rose-100',
      textClass: 'text-rose-900',
      borderClass: 'border-rose-300',
      fullBadgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
      darkBadgeClass: 'bg-rose-950/80 text-rose-300 border-rose-400/50',
      dotClass: 'bg-rose-500',
      passAccentClass: 'from-rose-600 to-red-700'
    };
  }

  return null;
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

  // Sync to Cloud Firestore
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, registration.ticketId);
    setDoc(docRef, registration).catch(err => console.warn('Firestore save warning:', err));
  } catch (err) {
    console.warn('Firestore save error:', err);
  }

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

  // Sync check-in to Firestore
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, updatedReg.ticketId);
    updateDoc(docRef, {
      checkedIn: true,
      checkedInAt: updatedReg.checkedInAt,
    }).catch(err => console.warn('Firestore check-in update warning:', err));
  } catch (err) {
    console.warn('Firestore check-in error:', err);
  }

  return {
    success: true,
    registration: updatedReg,
    message: `Check-in Successful! Welcome ${updatedReg.name}.`,
  };
}

export function toggleCheckIn(ticketId: string): Registration[] {
  const registrations = getRegistrations();
  let targetReg: Registration | undefined;

  const updated = registrations.map(r => {
    if (r.ticketId === ticketId) {
      targetReg = {
        ...r,
        checkedIn: !r.checkedIn,
        checkedInAt: !r.checkedIn ? new Date().toISOString() : undefined,
      };
      return targetReg;
    }
    return r;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (targetReg) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, ticketId);
      updateDoc(docRef, {
        checkedIn: targetReg.checkedIn,
        checkedInAt: targetReg.checkedInAt || null,
      }).catch(err => console.warn('Firestore toggle update warning:', err));
    } catch (err) {
      console.warn('Firestore toggle error:', err);
    }
  }

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
