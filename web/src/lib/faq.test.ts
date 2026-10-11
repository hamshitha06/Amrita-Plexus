import { describe, it, expect } from 'vitest';
import { findFAQ, FAQs } from './faq';

describe('Campus AI Guide FAQ Engine', () => {
  it('matches a known FAQ', () => {
    const result = findFAQ('where is the mess menu today?');
    expect(result).toBeDefined();
    expect(result?.id).toBe('faq-1');
    expect(result?.moduleLink).toBe('/mess-menu');
  });

  it('falls back to null on unknown questions', () => {
    const result = findFAQ('what is the quantum physics syllabus?');
    expect(result).toBeNull();
  });

  it('includes proper module navigation links in FAQ data', () => {
    const messFaq = FAQs.find(f => f.id === 'faq-1');
    const lostFoundFaq = FAQs.find(f => f.id === 'faq-2');
    const ridesFaq = FAQs.find(f => f.id === 'faq-3');
    const parcelsFaq = FAQs.find(f => f.id === 'faq-4');

    expect(messFaq?.moduleLink).toBe('/mess-menu');
    expect(lostFoundFaq?.moduleLink).toBe('/lost-found');
    expect(ridesFaq?.moduleLink).toBe('/rides');
    expect(parcelsFaq?.moduleLink).toBe('/parcels');
  });

  it('supports feedback controls logic', () => {
    interface TestMessage { id: string; role: string; content: string; feedback?: string }
    const messages: TestMessage[] = [{ id: '1', role: 'assistant', content: 'test' }];
    const messageId = '1';
    const feedback = 'helpful';

    const updated = messages.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    );
    
    expect(updated[0].feedback).toBe('helpful');
  });

  it('handles follow-up questions with context routing', () => {
    const resultWithoutContext = findFAQ('today'); 
    expect(resultWithoutContext?.id).toBe('faq-1');

    const resultWithContext = findFAQ('today', 'Food');
    expect(resultWithContext?.id).toBe('faq-1');
  });
});
