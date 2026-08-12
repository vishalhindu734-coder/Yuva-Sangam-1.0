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

export const INITIAL_DEMO_REGISTRATIONS: any[] = [];
