import { EventInfo } from '../types';

export const YUVA_SANGAM_EVENT: EventInfo = {
  title: "युवा संगम : सोंडा (अंबाला)",
  organizer: "Yuva Sangam Ambala",
  date: "2026-08-23",
  formattedDate: "Sunday, 23 August 2026",
  time: "08:00 AM - 11:30 AM IST",
  venue: "Maharaja Agrasen Public School",
  address: "Sonda (Ambala)",
  landmark: "Near Main Chowk, Sonda",
  city: "Ambala",
  state: "Haryana",
};

export interface VillagePreset {
  village: string;
  subDivision: string;
}

export const AMBALA_VILLAGES_PRESETS: VillagePreset[] = [
  { village: "Mathedi", subDivision: "Ambala Sadar" },
  { village: "Sonda", subDivision: "Ambala Sadar" },
  { village: "Ambala Cantt", subDivision: "Ambala Sadar" },
  { village: "Ambala City", subDivision: "Ambala City" },
  { village: "Naggal", subDivision: "Ambala City" },
  { village: "Jansui", subDivision: "Ambala City" },
  { village: "Durana", subDivision: "Ambala City" },
  { village: "Barara", subDivision: "Barara" },
  { village: "Mullana", subDivision: "Barara" },
  { village: "Saha", subDivision: "Saha" },
  { village: "Naraingarh", subDivision: "Naraingarh" },
  { village: "Shahzadpur", subDivision: "Naraingarh" },
  { village: "Patreheri", subDivision: "Ambala Sadar" },
  { village: "Naneola", subDivision: "Ambala City" },
  { village: "Kardhan", subDivision: "Ambala Sadar" },
  { village: "Boh", subDivision: "Ambala Sadar" },
];

export const INITIAL_DEMO_REGISTRATIONS = [
  {
    ticketId: "YS2026-90412",
    name: "Aarav Sharma",
    dob: "2001-05-14",
    village: "Mathedi",
    subDivision: "Ambala Sadar",
    phone: "+91 98765 43210",
    otherInfo: "Youth Club Volunteer / Student",
    registeredAt: "2026-08-01T10:30:00.000Z",
    checkedIn: false,
  },
  {
    ticketId: "YS2026-88104",
    name: "Priya Verma",
    dob: "2002-11-20",
    village: "Sonda",
    subDivision: "Ambala Sadar",
    phone: "+91 98123 45678",
    otherInfo: "Cultural Team Lead",
    registeredAt: "2026-08-02T14:15:00.000Z",
    checkedIn: true,
    checkedInAt: "2026-08-23T08:05:12.000Z",
  },
  {
    ticketId: "YS2026-77319",
    name: "Vikram Saini",
    dob: "1999-08-03",
    village: "Barara",
    subDivision: "Barara",
    phone: "+91 94160 12345",
    otherInfo: "Sports Delegate",
    registeredAt: "2026-08-05T09:00:00.000Z",
    checkedIn: false,
  }
];
