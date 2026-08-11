export interface VillageEntry {
  gram: string;
  mandal: string;
  formatted: string; // "Gram - Mandal"
}

export const MANDAL_VILLAGE_DATA: VillageEntry[] = [
  // Matedi Mandal (मटेडी)
  { gram: 'Matedi Shekhan', mandal: 'Matedi', formatted: 'Matedi Shekhan - Matedi' },
  { gram: 'Muzaffara', mandal: 'Matedi', formatted: 'Muzaffara - Matedi' },
  { gram: 'Humayunpur', mandal: 'Matedi', formatted: 'Humayunpur - Matedi' },
  { gram: 'Chour Mastpur', mandal: 'Matedi', formatted: 'Chour Mastpur - Matedi' },
  { gram: 'Amipur', mandal: 'Matedi', formatted: 'Amipur - Matedi' },
  { gram: 'Nadiyali', mandal: 'Matedi', formatted: 'Nadiyali - Matedi' },
  { gram: 'Khaira', mandal: 'Matedi', formatted: 'Khaira - Matedi' },
  { gram: 'Sakraon', mandal: 'Matedi', formatted: 'Sakraon - Matedi' },
  { gram: 'Naggal', mandal: 'Matedi', formatted: 'Naggal - Matedi' },
  { gram: 'Segta', mandal: 'Matedi', formatted: 'Segta - Matedi' },
  { gram: 'Bishangarh', mandal: 'Matedi', formatted: 'Bishangarh - Matedi' },
  { gram: 'Addo Majra', mandal: 'Matedi', formatted: 'Addo Majra - Matedi' },

  // Bhanokhedi Mandal (भानोखेडी)
  { gram: 'Bhanokhedi', mandal: 'Bhanokhedi', formatted: 'Bhanokhedi - Bhanokhedi' },
  { gram: 'Mardo Sahib', mandal: 'Bhanokhedi', formatted: 'Mardo Sahib - Bhanokhedi' },
  { gram: 'Lakhnor Sahib', mandal: 'Bhanokhedi', formatted: 'Lakhnor Sahib - Bhanokhedi' },
  { gram: 'Gobindgarh', mandal: 'Bhanokhedi', formatted: 'Gobindgarh - Bhanokhedi' },
  { gram: 'Mirzapur', mandal: 'Bhanokhedi', formatted: 'Mirzapur - Bhanokhedi' },
  { gram: 'Majri', mandal: 'Bhanokhedi', formatted: 'Majri - Bhanokhedi' },
  { gram: 'Bichpari', mandal: 'Bhanokhedi', formatted: 'Bichpari - Bhanokhedi' },
  { gram: 'Lalana', mandal: 'Bhanokhedi', formatted: 'Lalana - Bhanokhedi' },
  { gram: 'Bhedsa', mandal: 'Bhanokhedi', formatted: 'Bhedsa - Bhanokhedi' },
  { gram: 'Mauri', mandal: 'Bhanokhedi', formatted: 'Mauri - Bhanokhedi' },
  { gram: 'Tejan', mandal: 'Bhanokhedi', formatted: 'Tejan - Bhanokhedi' },

  // Jalbera Mandal (जलबेड़ा)
  { gram: 'Jalbera', mandal: 'Jalbera', formatted: 'Jalbera - Jalbera' },
  { gram: 'Matedi Jattan', mandal: 'Jalbera', formatted: 'Matedi Jattan - Jalbera' },
  { gram: 'Mokha Majra', mandal: 'Jalbera', formatted: 'Mokha Majra - Jalbera' },
  { gram: 'Mota Majra', mandal: 'Jalbera', formatted: 'Mota Majra - Jalbera' },
  { gram: 'Dhurala', mandal: 'Jalbera', formatted: 'Dhurala - Jalbera' },
  { gram: 'Rawalon', mandal: 'Jalbera', formatted: 'Rawalon - Jalbera' },
  { gram: 'Ladana', mandal: 'Jalbera', formatted: 'Ladana - Jalbera' },
  { gram: 'Behbalpur', mandal: 'Jalbera', formatted: 'Behbalpur - Jalbera' },
  { gram: 'Begu Majra', mandal: 'Jalbera', formatted: 'Begu Majra - Jalbera' },

  // Balana Mandal (बलाणा)
  { gram: 'Balana', mandal: 'Balana', formatted: 'Balana - Balana' },
  { gram: 'Dhurkhada', mandal: 'Balana', formatted: 'Dhurkhada - Balana' },
  { gram: 'Rappu Majra', mandal: 'Balana', formatted: 'Rappu Majra - Balana' },
  { gram: 'Sarangpur', mandal: 'Balana', formatted: 'Sarangpur - Balana' },
  { gram: 'Sullar', mandal: 'Balana', formatted: 'Sullar - Balana' },
  { gram: 'Kaula', mandal: 'Balana', formatted: 'Kaula - Balana' },

  // Ghel Mandal (घेल)
  { gram: 'Ghel', mandal: 'Ghel', formatted: 'Ghel - Ghel' },
  { gram: 'Chhoti Ghel', mandal: 'Ghel', formatted: 'Chhoti Ghel - Ghel' },
  { gram: 'Nijampur', mandal: 'Ghel', formatted: 'Nijampur - Ghel' },
  { gram: 'Devi Nagar', mandal: 'Ghel', formatted: 'Devi Nagar - Ghel' },
  { gram: 'Dadyana', mandal: 'Ghel', formatted: 'Dadyana - Ghel' },
  { gram: 'Lohgarh', mandal: 'Ghel', formatted: 'Lohgarh - Ghel' },
  { gram: 'Manakpur', mandal: 'Ghel', formatted: 'Manakpur - Ghel' },
  { gram: 'Dangdehri', mandal: 'Ghel', formatted: 'Dangdehri - Ghel' },
  { gram: 'Liharsa', mandal: 'Ghel', formatted: 'Liharsa - Ghel' },
  { gram: 'Kalu Majra', mandal: 'Ghel', formatted: 'Kalu Majra - Ghel' },
  { gram: 'Ram Das Nagar', mandal: 'Ghel', formatted: 'Ram Das Nagar - Ghel' },

  // Panjokhada Mandal (पंजोखडा)
  { gram: 'Panjokhada', mandal: 'Panjokhada', formatted: 'Panjokhada - Panjokhada' },
  { gram: 'Janetpur', mandal: 'Panjokhada', formatted: 'Janetpur - Panjokhada' },
  { gram: 'Dhankaur', mandal: 'Panjokhada', formatted: 'Dhankaur - Panjokhada' },
  { gram: 'Garnala', mandal: 'Panjokhada', formatted: 'Garnala - Panjokhada' },
  { gram: 'Khatauli', mandal: 'Panjokhada', formatted: 'Khatauli - Panjokhada' },
  { gram: 'Saddopur', mandal: 'Panjokhada', formatted: 'Saddopur - Panjokhada' },

  // Ismailpur Mandal (इस्माइलपुर)
  { gram: 'Ismailpur', mandal: 'Ismailpur', formatted: 'Ismailpur - Ismailpur' },
  { gram: 'Saini Majra', mandal: 'Ismailpur', formatted: 'Saini Majra - Ismailpur' },
  { gram: 'Bhadinga', mandal: 'Ismailpur', formatted: 'Bhadinga - Ismailpur' },
  { gram: 'Dangdairiyan', mandal: 'Ismailpur', formatted: 'Dangdairiyan - Ismailpur' },
  { gram: 'Kurbanpur', mandal: 'Ismailpur', formatted: 'Kurbanpur - Ismailpur' },
  { gram: 'Ahmayon', mandal: 'Ismailpur', formatted: 'Ahmayon - Ismailpur' },
  { gram: 'Bhadi', mandal: 'Ismailpur', formatted: 'Bhadi - Ismailpur' },
  { gram: 'Malaur', mandal: 'Ismailpur', formatted: 'Malaur - Ismailpur' },
  { gram: 'Ghagru', mandal: 'Ismailpur', formatted: 'Ghagru - Ismailpur' },
  { gram: 'Bhudangpur', mandal: 'Ismailpur', formatted: 'Bhudangpur - Ismailpur' },
  { gram: 'Daudpur', mandal: 'Ismailpur', formatted: 'Daudpur - Ismailpur' },

  // Nanyola Mandal (नन्योला)
  { gram: 'Nanyola', mandal: 'Nanyola', formatted: 'Nanyola - Nanyola' },
  { gram: 'Delu Majra', mandal: 'Nanyola', formatted: 'Delu Majra - Nanyola' },
  { gram: 'Lauta', mandal: 'Nanyola', formatted: 'Lauta - Nanyola' },
  { gram: 'Khurchanpur', mandal: 'Nanyola', formatted: 'Khurchanpur - Nanyola' },
  { gram: 'Panjoula', mandal: 'Nanyola', formatted: 'Panjoula - Nanyola' },
  { gram: 'Batrohan', mandal: 'Nanyola', formatted: 'Batrohan - Nanyola' },
  { gram: 'Nakatpur', mandal: 'Nanyola', formatted: 'Nakatpur - Nanyola' },
  { gram: 'Udaipur', mandal: 'Nanyola', formatted: 'Udaipur - Nanyola' },
  { gram: 'Rasulpur', mandal: 'Nanyola', formatted: 'Rasulpur - Nanyola' },
  { gram: 'Shekhupura', mandal: 'Nanyola', formatted: 'Shekhupura - Nanyola' },
  { gram: 'Jagauli', mandal: 'Nanyola', formatted: 'Jagauli - Nanyola' },

  // Bakanaur Mandal (बकनौर)
  { gram: 'Bakanaur', mandal: 'Bakanaur', formatted: 'Bakanaur - Bakanaur' },
  { gram: 'Khaira', mandal: 'Bakanaur', formatted: 'Khaira - Bakanaur' },
  { gram: 'Mahmudpur', mandal: 'Bakanaur', formatted: 'Mahmudpur - Bakanaur' },
  { gram: 'Bamba', mandal: 'Bakanaur', formatted: 'Bamba - Bakanaur' },
  { gram: 'Miyan Majra', mandal: 'Bakanaur', formatted: 'Miyan Majra - Bakanaur' },
  { gram: 'Khanna Majra', mandal: 'Bakanaur', formatted: 'Khanna Majra - Bakanaur' },
  { gram: 'Niharsa', mandal: 'Bakanaur', formatted: 'Niharsa - Bakanaur' },
  { gram: 'Alaudin Majra', mandal: 'Bakanaur', formatted: 'Alaudin Majra - Bakanaur' },
  { gram: 'Chugna', mandal: 'Bakanaur', formatted: 'Chugna - Bakanaur' },
  { gram: 'Metla', mandal: 'Bakanaur', formatted: 'Metla - Bakanaur' },

  // Jansui Mandal (जनसुई)
  { gram: 'Jansui', mandal: 'Jansui', formatted: 'Jansui - Jansui' },
  { gram: 'Jansua', mandal: 'Jansui', formatted: 'Jansua - Jansui' },
  { gram: 'Niharsi', mandal: 'Jansui', formatted: 'Niharsi - Jansui' },
  { gram: 'Gaursiyan', mandal: 'Jansui', formatted: 'Gaursiyan - Jansui' },
  { gram: 'Saini Majra', mandal: 'Jansui', formatted: 'Saini Majra - Jansui' },
  { gram: 'Saunta', mandal: 'Jansui', formatted: 'Saunta - Jansui' },
  { gram: 'Saunti', mandal: 'Jansui', formatted: 'Saunti - Jansui' },
  { gram: 'Mahela', mandal: 'Jansui', formatted: 'Mahela - Jansui' },
  { gram: 'Bhuni', mandal: 'Jansui', formatted: 'Bhuni - Jansui' },
  { gram: 'Jalalpur', mandal: 'Jansui', formatted: 'Jalalpur - Jansui' },
  { gram: 'Segti', mandal: 'Jansui', formatted: 'Segti - Jansui' },
  { gram: 'Kalera', mandal: 'Jansui', formatted: 'Kalera - Jansui' }
];

export const MANDALS_LIST: string[] = Array.from(
  new Set(MANDAL_VILLAGE_DATA.map((item) => item.mandal))
);
