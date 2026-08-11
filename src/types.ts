export interface Registration {
  ticketId: string;
  name: string;
  dob?: string;
  village?: string;
  subDivision?: string;
  phone: string;
  otherInfo?: string;
  registeredAt: string; // ISO string
  checkedIn: boolean;
  checkedInAt?: string; // ISO string
}

export interface EventInfo {
  title: string;
  organizer: string;
  date: string;
  formattedDate: string;
  time: string;
  venue: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
}

export type ActiveTab = 'register' | 'passes';

export interface QRData {
  ticketId: string;
  name: string;
  dob?: string;
  village?: string;
  subDivision?: string;
  phone: string;
  event: string;
  date: string;
  v: number; // version/hash
}
