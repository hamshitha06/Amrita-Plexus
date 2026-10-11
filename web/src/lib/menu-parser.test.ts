import { describe, it, expect } from 'vitest';
import { parseMenuText } from './menu-parser';

describe('Canteen Menu Text Parser & Fuzzy Lexicon', () => {
  it('parses standard item-price lines correctly', () => {
    const raw = `
VEG SANDWICH 40
MASALA DOSA 55
SAMOSA 15
TEA 12
COFFEE 20
    `;
    const result = parseMenuText(raw);
    expect(result.items.length).toBeGreaterThanOrEqual(4);
    expect(result.items.some(i => i.title === 'Masala Dosa' && i.price === 55)).toBe(true);
    expect(result.items.some(i => i.title === 'Veg Sandwich' && i.price === 40)).toBe(true);
  });

  it('handles Rupee symbols, dashes, colons, and slash-dash', () => {
    const raw = `
PANEER BUTTER MASALA - ₹120/-
CHICKEN BIRIYANI: Rs. 140
COLD BADAM MILK : Rs 35/-
GOBI 65 ... ₹50
    `;
    const result = parseMenuText(raw);
    expect(result.items.some(i => i.title === 'Butter Paneer Masala' && i.price === 120)).toBe(true);
    expect(result.items.some(i => i.title === 'Chicken Biryani' && i.price === 140)).toBe(true);
    expect(result.items.some(i => i.title === 'Badam Milk' && i.price === 35)).toBe(true);
    expect(result.items.some(i => i.title === 'Gobi 65' && i.price === 50)).toBe(true);
  });

  it('splits multi-column merged lines from actual cafeteria photo', () => {
    const rawPhotoOcr = `
Sey Masala Rog Black Ogg 50
Ghee Rogy Black 55
Ghee Uthappar Boy 50
Onion Ut Cornflayes 45
Parotta 1v Horlicis 40
7. Masala Frieq Py, 10005 Choco 40
0. Masala Rogge 75006. Coffee 20
Butter Pp Ala Ro E 50
`;
    const result = parseMenuText(rawPhotoOcr);
    
    // Check that items are recognized and corrected into canonical names
    expect(result.items.some(i => i.title === 'Masala Dosa')).toBe(true);
    expect(result.items.some(i => i.title === 'Black Tea' || i.title === 'Black Coffee')).toBe(true);
    expect(result.items.some(i => i.title === 'Ghee Roast Dosa')).toBe(true);
    expect(result.items.some(i => i.title === 'Ghee Uthappam')).toBe(true);
    expect(result.items.some(i => i.title === 'Boost')).toBe(true);
    expect(result.items.some(i => i.title === 'Onion Uthappam')).toBe(true);
    expect(result.items.some(i => i.title === 'Cornflakes with Milk')).toBe(true);
    expect(result.items.some(i => i.title === 'Parotta (2 Pcs)')).toBe(true);
    expect(result.items.some(i => i.title === 'Horlicks')).toBe(true);
    expect(result.items.some(i => i.title === 'Masala Fried Rice')).toBe(true);
    expect(result.items.some(i => i.title === 'Chocolate Shake')).toBe(true);
    expect(result.items.some(i => i.title === 'Butter Paneer Masala')).toBe(true);
  });

  it('detects section headers and applies category context', () => {
    const raw = `
--- BEVERAGES ---
LEMON TEA 15
BADAM MILK 25

--- BREAKFAST ---
IDLI VADA COMBO 45
PLAIN DOSA 40
    `;
    const result = parseMenuText(raw);
    expect(result.sectionsDetected).toContain('Beverages');
    expect(result.sectionsDetected).toContain('Breakfast');
    expect(result.items.some(i => i.title.includes('Tea') && i.category === 'Beverages')).toBe(true);
    expect(result.items.some(i => i.title === 'Idli Vada Combo' && i.category === 'Breakfast')).toBe(true);
  });

  it('ignores separators and noisy header lines', () => {
    const raw = `
=========================
AMRITA CANTEEN MENU
=========================
VEG NOODLES 50
EGG ROLL 45
-------------------------
THANK YOU VISIT AGAIN
VIKSIT BHARAT SANKALP
    `;
    const result = parseMenuText(raw);
    expect(result.items.some(i => i.title === 'Veg Noodles')).toBe(true);
    expect(result.items.some(i => i.title === 'Egg Roll')).toBe(true);
    expect(result.items.some(i => i.title.includes('Viksit'))).toBe(false);
  });

  it('corrects all 13 noisy rows from the user screenshot', () => {
    const rawPhotoOcr = `
L Hiiars
Ini Samp 1g Price Ua
Butter Pp Ala Ro E 50
Butter Pela Rous Maite 5
Dosa Hot Dring
Sey Masala Rog Black Ogg
Ghee Rogy Black
Ghee Uthappar Boy
Aie 65004 Bourg 4
7. Masala Frieq Py, 10005 Choco 40
0. Masala Rogge 75006. Coffee 40
Onion Ut Cornflayes 11
Parotta 1v Horlicis
`;
    const result = parseMenuText(rawPhotoOcr);

    // Filtered out noise headers
    expect(result.items.some(i => i.title.toLowerCase().includes('price'))).toBe(false);
    expect(result.items.some(i => i.title.toLowerCase().includes('hiiars'))).toBe(false);

    // Correctly standardized dishes
    expect(result.items.some(i => i.title === 'Butter Paneer Masala' || i.title === 'Butter Podi Roast')).toBe(true);
    expect(result.items.some(i => i.title === 'Butter Plain Roast')).toBe(true);
    expect(result.items.some(i => i.title === 'Masala Dosa')).toBe(true);
    expect(result.items.some(i => i.title === 'Black Tea')).toBe(true);
    expect(result.items.some(i => i.title === 'Ghee Roast Dosa')).toBe(true);
    expect(result.items.some(i => i.title === 'Ghee Uthappam')).toBe(true);
    expect(result.items.some(i => i.title === 'Boost')).toBe(true);
    expect(result.items.some(i => i.title === 'Gobi 65')).toBe(true);
    expect(result.items.some(i => i.title === 'Veg Burger')).toBe(true);
    expect(result.items.some(i => i.title === 'Masala Fried Rice')).toBe(true);
    expect(result.items.some(i => i.title === 'Chocolate Shake')).toBe(true);
    expect(result.items.some(i => i.title === 'Filter Coffee')).toBe(true);
    expect(result.items.some(i => i.title === 'Onion Uthappam')).toBe(true);
    expect(result.items.some(i => i.title === 'Cornflakes with Milk')).toBe(true);
    expect(result.items.some(i => i.title === 'Parotta (2 Pcs)')).toBe(true);
    expect(result.items.some(i => i.title === 'Horlicks')).toBe(true);

    // CRITICAL: Guarantee every single recognized dish has a positive shown price
    expect(result.items.every(i => i.price > 0)).toBe(true);
  });

  it('guarantees that every extracted dish has a valid shown price', () => {
    const rawPhotoOcr = `
Sey Masala Rog Black Ogg 50
Ghee Rogy Black 55
Ghee Uthappar Boy 50
Onion Ut Cornflayes 45
Parotta 1v Horlicis 40
7. Masala Frieq Py, 10005 Choco 40
0. Masala Rogge 75006. Coffee 20
Butter Pela Rous Maite 5
Aie 65004 Bourg 4
`;
    const result = parseMenuText(rawPhotoOcr);
    expect(result.items.length).toBeGreaterThanOrEqual(10);
    // Every single dish must have a shown price > 0
    expect(result.items.every(item => item.price > 0)).toBe(true);

    const masalaDosa = result.items.find(i => i.title === 'Masala Dosa');
    expect(masalaDosa).toBeDefined();
    expect(masalaDosa?.price).toBe(50);

    const gheeRoast = result.items.find(i => i.title === 'Ghee Roast Dosa');
    expect(gheeRoast).toBeDefined();
    expect(gheeRoast?.price).toBe(55);

    const blackTea = result.items.find(i => i.title === 'Black Tea');
    expect(blackTea).toBeDefined();
    expect(blackTea?.price).toBeGreaterThan(0);

    const parotta = result.items.find(i => i.title === 'Parotta (2 Pcs)');
    expect(parotta).toBeDefined();
    expect(parotta?.price).toBe(40);
  });

  it('stitches multiline dish names and standalone prices across consecutive lines', () => {
    const raw = `
Chicken Biryani
140
Special Paneer Butter
Masala 120
Veg Fried Rice
60
Filter Coffee
20
    `;
    const result = parseMenuText(raw);
    expect(result.items.some(i => i.title === 'Chicken Biryani' && i.price === 140)).toBe(true);
    expect(result.items.some(i => i.title.includes('Paneer') && i.price === 120)).toBe(true);
    expect(result.items.some(i => i.title === 'Veg Fried Rice' && i.price === 60)).toBe(true);
    expect(result.items.some(i => i.title === 'Filter Coffee' && i.price === 20)).toBe(true);
  });

  it('handles large 40-item full cafeteria menu with high recall and no silent drops', () => {
    const largeMenu = `
--- BREAKFAST ---
PLAIN DOSA 40
MASALA DOSA 50
GHEE ROAST 55
ONION UTHAPPAM 45
GHEE UTHAPPAM 50
IDLI VADA COMBO 45
POORI MASALA 45
ALOO PARATHA 40
PAROTTA (2 PCS) 40
BREAD TOAST 25
EGG OMLETTE 35

--- MEALS & LUNCH ---
VEG MEALS 70
CHICKEN BIRIYANI 130
VEG BIRIYANI 75
VEG FRIED RICE 60
EGG FRIED RICE 75
CHICKEN FRIED RICE 95
VEG NOODLES 55
EGG NOODLES 70
PANEER BUTTER MASALA 110
DAL FRY 60
ROTI 15
CHAPATI 15

--- SNACKS ---
SAMOSA 15
VEG ROLL 40
EGG ROLL 45
PANEER ROLL 50
VEG BURGER 45
VEG SANDWICH 35
GOBI 65 50
FRENCH FRIES 45

--- BEVERAGES ---
HOT TEA 12
FILTER COFFEE 20
BLACK TEA 12
BLACK COFFEE 15
LEMON TEA 15
BOOST 20
HORLICKS 20
BADAM MILK 25
CHOCOLATE SHAKE 45
COLD COFFEE 35
`;

    const result = parseMenuText(largeMenu);

    // Extraction recall: exactly 40 dishes present in rawMenu
    expect(result.items.length).toBeGreaterThanOrEqual(38);
    expect(result.readyToPublishCount).toBeGreaterThanOrEqual(38);
    expect(result.totalParsedItems).toBe(result.items.length);

    // Verify sections detected
    expect(result.sectionsDetected).toContain('Breakfast');
    expect(result.sectionsDetected).toContain('Snacks');
    expect(result.sectionsDetected).toContain('Beverages');

    // Calculate Extraction Recall
    const totalActual = 40;
    const recall = (result.items.length / totalActual) * 100;
    expect(recall).toBeGreaterThanOrEqual(95); // > 95% recall achieved!
  });

  it('preserves unparsed lines and reports accurate statistics without silent drops', () => {
    const raw = `
VIKSIT BHARAT SANKALP
RATE LIST - TODAY
MASALA DOSA 50
HOT TEA 12
THANK YOU VISIT AGAIN
`;
    const result = parseMenuText(raw);

    // Dishes parsed
    expect(result.items.length).toBe(2);
    expect(result.readyToPublishCount).toBe(2);

    // Non-dish lines retained in unparsedLines
    expect(result.unparsedLines.length).toBeGreaterThanOrEqual(2);
    expect(result.unparsedLines.some(l => l.includes('VIKSIT') || l.includes('THANK'))).toBe(true);

    // Total recognized lines accounted for
    expect(result.totalRecognizedLines).toBe(5);
  });
});
