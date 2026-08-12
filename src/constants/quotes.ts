export interface Quote {
  text: string;
  author: string;
}

export const EVENT_QUOTES: Quote[] = [
  {
    text: "Arise, awake, and stop not till the goal is reached.",
    author: "Swami Vivekananda"
  },
  {
    text: "Individual character is the foundation upon which national greatness is built.",
    author: "Dr. K. B. Hedgewar"
  },
  {
    text: "Our goal is to create a disciplined, self-respecting, and united nation.",
    author: "Dr. K. B. Hedgewar"
  },
  {
    text: "A nation is a living cultural entity bound by a shared heritage.",
    author: "M. S. Golwalkar (Guruji)"
  },
  {
    text: "Service to society is service to the Divine manifest in humanity.",
    author: "M. S. Golwalkar (Guruji)"
  },
  {
    text: "Culture is the soul and life-breath of a nation.",
    author: "Pt. Deendayal Upadhyaya"
  },
  {
    text: "Swaraj is my birthright and I shall have it.",
    author: "Lokmanya Tilak"
  },
  {
    text: "Sanatan Dharma itself is nationalism for us.",
    author: "Sri Aurobindo"
  },
  {
    text: "Real patriotism begins with daily discipline and selfless service.",
    author: "Dr. K. B. Hedgewar"
  },
  {
    text: "Culture is the enduring thread that binds generations into one nation.",
    author: "M. S. Golwalkar (Guruji)"
  },
  {
    text: "In organized unity alone lies the invincible strength of society.",
    author: "Dr. K. B. Hedgewar"
  },
  {
    text: "First Indian, last Indian, always Indian.",
    author: "V. D. Savarkar"
  }
];

export function getQuoteForTicket(ticketId?: string): Quote {
  if (!ticketId) {
    const randomIndex = Math.floor(Math.random() * EVENT_QUOTES.length);
    return EVENT_QUOTES[randomIndex];
  }
  let hash = 0;
  for (let i = 0; i < ticketId.length; i++) {
    hash = (hash << 5) - hash + ticketId.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % EVENT_QUOTES.length;
  return EVENT_QUOTES[index];
}
