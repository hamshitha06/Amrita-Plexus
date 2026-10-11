export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  moduleLink?: string;
}

export const FAQs: FAQ[] = [
  {
    id: "faq-1",
    question: "Where is today's mess menu?",
    answer: "You can find today's mess menu in the Mess Menu module. Please note this is demo data and actual menus may vary.",
    category: "Food",
    keywords: ["mess", "menu", "food", "eat", "today", "dining"],
    moduleLink: "/mess-menu"
  },
  {
    id: "faq-2",
    question: "How do I report a lost ID card?",
    answer: "To report a lost ID card, navigate to the Lost & Found module and submit a lost item report. (Demo Campus Info: Ensure you check with the main security desk first).",
    category: "Campus Services",
    keywords: ["lost", "id", "card", "report", "missing", "found"],
    moduleLink: "/lost-found"
  },
  {
    id: "faq-3",
    question: "Are there rides to the station tomorrow?",
    answer: "You can check upcoming scheduled rides and carpools to the station in the Rides module. (Demo Campus Info: Shuttles usually run every 2 hours).",
    category: "Transportation",
    keywords: ["rides", "station", "tomorrow", "shuttle", "transport", "cab", "bus"],
    moduleLink: "/rides"
  },
  {
    id: "faq-4",
    question: "How do I track my parcel?",
    answer: "You can track your Amazon and other courier parcels in the Parcel Management dashboard.",
    category: "Services",
    keywords: ["track", "parcel", "package", "delivery", "amazon", "courier"],
    moduleLink: "/parcels"
  }
];

export function findFAQ(query: string, context?: string): FAQ | null {
  const lowerQuery = query.toLowerCase();
  
  // Very simplistic NLP simulation
  // 1. Direct match on keywords
  let bestMatch: FAQ | null = null;
  let maxScore = 0;

  for (const faq of FAQs) {
    let score = 0;
    for (const kw of faq.keywords) {
      // Split query by non-word characters and check if the exact keyword exists
      const words = lowerQuery.split(/\W+/);
      if (words.includes(kw.toLowerCase())) {
        score++;
      }
    }
    
    // Add bonus if the current query relies on context (follow-up)
    if (context && faq.category.toLowerCase() === context.toLowerCase()) {
      score += 0.5;
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = faq;
    }
  }

  // Need at least one keyword to match, unless it's a follow-up and we have context
  if (maxScore >= 1 || (maxScore > 0 && context)) {
    return bestMatch;
  }
  
  return null;
}
