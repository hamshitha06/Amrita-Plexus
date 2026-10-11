/**
 * Campus Canteen Dish Lexicon & Fuzzy Matcher
 * Normalizes OCR typos commonly found in photographs of Indian campus blackboard/printed menus.
 */

export interface KnownDish {
  canonicalName: string;
  category: 'Breakfast' | 'Meals' | 'Snacks' | 'Beverages' | 'Desserts';
  defaultPrice: number;
  aliases: string[];
}

export const CANTEEN_DISH_LEXICON: KnownDish[] = [
  // Breakfast & Dosas
  {
    canonicalName: 'Masala Dosa',
    category: 'Breakfast',
    defaultPrice: 50,
    aliases: ['masala dosa', 'masala dose', 'masala rogge', 'masala rog', 'masala duso', 'masala dos'],
  },
  {
    canonicalName: 'Plain Dosa',
    category: 'Breakfast',
    defaultPrice: 40,
    aliases: ['plain dosa', 'plain dose', 'plain duso', 'sada dosa', 'dosa plain'],
  },
  {
    canonicalName: 'Ghee Roast Dosa',
    category: 'Breakfast',
    defaultPrice: 55,
    aliases: ['ghee roast', 'ghee rogy', 'ghee rost', 'ghee roast dosa', 'ghee roste'],
  },
  {
    canonicalName: 'Ghee Uthappam',
    category: 'Breakfast',
    defaultPrice: 50,
    aliases: ['ghee uthappam', 'ghee uthappar', 'ghee oothappam', 'ghee uthappa', 'ghee uthapam'],
  },
  {
    canonicalName: 'Onion Uthappam',
    category: 'Breakfast',
    defaultPrice: 45,
    aliases: ['onion uthappam', 'onion ut', 'onion uthappar', 'onion oothappam', 'onion uthapam'],
  },
  {
    canonicalName: 'Parotta (2 Pcs)',
    category: 'Breakfast',
    defaultPrice: 40,
    aliases: ['parotta', 'parotta 1v', 'parotta 2', 'parotta 2 pcs', 'porotta', 'kerala parotta', 'parota'],
  },
  {
    canonicalName: 'Idli Vada Combo',
    category: 'Breakfast',
    defaultPrice: 45,
    aliases: ['idli vada', 'idli vada combo', 'idli wada', 'idly vada'],
  },
  {
    canonicalName: 'Poori Masala',
    category: 'Breakfast',
    defaultPrice: 45,
    aliases: ['poori masala', 'puri masala', 'poori bhaji', 'puri bhaji'],
  },
  {
    canonicalName: 'Aloo Paratha',
    category: 'Breakfast',
    defaultPrice: 40,
    aliases: ['aloo paratha', 'alu paratha', 'aloo parota'],
  },

  // Meals & Rice
  {
    canonicalName: 'Veg Fried Rice',
    category: 'Meals',
    defaultPrice: 60,
    aliases: ['veg fried rice', 'veg frieq py', 'veg fried py', 'veg frieq rice', 'fried rice veg', 'fried rice'],
  },
  {
    canonicalName: 'Masala Fried Rice',
    category: 'Meals',
    defaultPrice: 65,
    aliases: ['masala fried rice', 'masala frieq py', 'masala fried py', 'masala rice'],
  },
  {
    canonicalName: 'Egg Fried Rice',
    category: 'Meals',
    defaultPrice: 70,
    aliases: ['egg fried rice', 'egg frieq py', 'egg fried py'],
  },
  {
    canonicalName: 'Chicken Biryani',
    category: 'Meals',
    defaultPrice: 120,
    aliases: ['chicken biryani', 'chicken biriyani', 'chk biryani', 'chicken briyani'],
  },
  {
    canonicalName: 'Veg Biryani',
    category: 'Meals',
    defaultPrice: 75,
    aliases: ['veg biryani', 'veg biriyani', 'vegetable biryani'],
  },
  {
    canonicalName: 'Butter Paneer Masala',
    category: 'Meals',
    defaultPrice: 90,
    aliases: ['butter paneer masala', 'butter pp ala ro e', 'paneer butter masala', 'butter paneer', 'paneer butter'],
  },
  {
    canonicalName: 'Butter Plain Roast',
    category: 'Breakfast',
    defaultPrice: 50,
    aliases: ['butter plain roast', 'butter pela rous maite', 'butter roast plain', 'butter pela rous'],
  },
  {
    canonicalName: 'Butter Podi Roast',
    category: 'Breakfast',
    defaultPrice: 55,
    aliases: ['butter podi roast', 'butter pp ala ro e', 'butter podi', 'butter roast podi'],
  },
  {
    canonicalName: 'Gobi 65',
    category: 'Snacks',
    defaultPrice: 50,
    aliases: ['gobi 65', 'aie 65004', 'aie 65004 bourg', 'aie 65', 'cauliflower 65'],
  },
  {
    canonicalName: 'Veg Noodles',
    category: 'Meals',
    defaultPrice: 55,
    aliases: ['veg noodles', 'veg noodle', 'schezwan noodles', 'veg hakka noodles'],
  },

  // Snacks & Rolls
  {
    canonicalName: 'Samosa (2 Pcs)',
    category: 'Snacks',
    defaultPrice: 20,
    aliases: ['samosa', 'samosa 2 pcs', 'samose', 'samosa chaat'],
  },
  {
    canonicalName: 'Veg Roll',
    category: 'Snacks',
    defaultPrice: 40,
    aliases: ['veg roll', 'vegetable roll', 'veg frankie'],
  },
  {
    canonicalName: 'Paneer Roll',
    category: 'Snacks',
    defaultPrice: 50,
    aliases: ['paneer roll', 'paneer frankie'],
  },
  {
    canonicalName: 'Egg Roll',
    category: 'Snacks',
    defaultPrice: 45,
    aliases: ['egg roll', 'egg frankie'],
  },
  {
    canonicalName: 'Veg Burger',
    category: 'Snacks',
    defaultPrice: 45,
    aliases: ['veg burger', 'bourg', 'veg bourg', 'burger veg', 'burger'],
  },
  {
    canonicalName: 'Veg Sandwich',
    category: 'Snacks',
    defaultPrice: 35,
    aliases: ['veg sandwich', 'sandwich veg', 'vegetable sandwich'],
  },

  // Beverages & Shakes
  {
    canonicalName: 'Black Tea',
    category: 'Beverages',
    defaultPrice: 12,
    aliases: ['black tea', 'black ogg', 'black te', 'black chai', 'black'],
  },
  {
    canonicalName: 'Black Coffee',
    category: 'Beverages',
    defaultPrice: 15,
    aliases: ['black coffee', 'black coffe'],
  },
  {
    canonicalName: 'Lemon Tea',
    category: 'Beverages',
    defaultPrice: 15,
    aliases: ['lemon tea', 'lemon chai'],
  },
  {
    canonicalName: 'Filter Coffee',
    category: 'Beverages',
    defaultPrice: 20,
    aliases: ['coffee', 'filter coffee', 'hot coffee'],
  },
  {
    canonicalName: 'Hot Tea',
    category: 'Beverages',
    defaultPrice: 12,
    aliases: ['tea', 'hot tea', 'chai', 'milk tea'],
  },
  {
    canonicalName: 'Badam Milk',
    category: 'Beverages',
    defaultPrice: 25,
    aliases: ['badam milk', 'hot badam milk', 'cold badam milk', 'almond milk'],
  },
  {
    canonicalName: 'Boost',
    category: 'Beverages',
    defaultPrice: 20,
    aliases: ['boost', 'boy', 'hot boost'],
  },
  {
    canonicalName: 'Horlicks',
    category: 'Beverages',
    defaultPrice: 20,
    aliases: ['horlicks', 'horlicis', 'horliks', 'hot horlicks'],
  },
  {
    canonicalName: 'Chocolate Shake',
    category: 'Beverages',
    defaultPrice: 45,
    aliases: ['choco shake', 'chocolate shake', 'choco', '10005 choco'],
  },
  {
    canonicalName: 'Cold Coffee',
    category: 'Beverages',
    defaultPrice: 35,
    aliases: ['cold coffee', 'iced coffee', 'cold brew'],
  },
  {
    canonicalName: 'Cornflakes with Milk',
    category: 'Breakfast',
    defaultPrice: 35,
    aliases: ['cornflayes', 'cornflakes', 'corn flakes'],
  },
  {
    canonicalName: 'Fresh Lime Soda',
    category: 'Beverages',
    defaultPrice: 25,
    aliases: ['lime juice', 'lime soda', 'fresh lime soda', 'lemon juice'],
  },
];

/**
 * Calculates simple Levenshtein edit distance between two strings
 */
function levenshtein(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;

  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1      // deletion
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * Attempts to match noisy OCR text against the Campus Canteen Lexicon
 */
export function matchKnownDish(text: string): KnownDish | null {
  const normalized = text
    .toLowerCase()
    .replace(/^(\d+[\.\)\-\s]+)+/, '') // remove bullet numbers like 7. or 0.
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.length < 3) return null;

  // 1. Exact alias / substring match
  for (const dish of CANTEEN_DISH_LEXICON) {
    for (const alias of dish.aliases) {
      if (normalized === alias || normalized.includes(alias)) {
        return dish;
      }
    }
  }

  // 2. Fuzzy Levenshtein match on words
  let bestMatch: KnownDish | null = null;
  let minDistance = 999;

  for (const dish of CANTEEN_DISH_LEXICON) {
    for (const alias of dish.aliases) {
      const dist = levenshtein(normalized, alias);
      // Allow up to 3 edit errors for longer strings, 1-2 for short
      const maxAllowed = Math.min(4, Math.floor(alias.length * 0.4));
      if (dist <= maxAllowed && dist < minDistance) {
        minDistance = dist;
        bestMatch = dish;
      }
    }
  }

  return bestMatch;
}
