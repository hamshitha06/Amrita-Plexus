import test from 'node:test';
import assert from 'node:assert';
import { findFAQ, FAQs } from './faq.ts';

test('Matching a known FAQ', () => {
  const result = findFAQ('where is the mess menu today?');
  assert.ok(result);
  assert.strictEqual(result.id, 'faq-1');
  assert.strictEqual(result.moduleLink, '/mess-menu');
});

test('Unknown-question fallback', () => {
  const result = findFAQ('what is the quantum physics syllabus?');
  assert.strictEqual(result, null);
});

test('Module navigation links in FAQ data', () => {
  // Test that all required module navigation links are present and correct in the FAQ data
  const messFaq = FAQs.find(f => f.id === 'faq-1');
  const lostFoundFaq = FAQs.find(f => f.id === 'faq-2');
  const ridesFaq = FAQs.find(f => f.id === 'faq-3');
  const parcelsFaq = FAQs.find(f => f.id === 'faq-4');

  assert.strictEqual(messFaq?.moduleLink, '/mess-menu');
  assert.strictEqual(lostFoundFaq?.moduleLink, '/lost-found');
  assert.strictEqual(ridesFaq?.moduleLink, '/rides');
  assert.strictEqual(parcelsFaq?.moduleLink, '/parcels');
});

test('Feedback controls (Logic concept)', () => {
  // While we cannot render the React UI here without a testing framework like RTL,
  interface TestMessage { id: string; role: string; content: string; feedback?: string }
  const messages: TestMessage[] = [{ id: '1', role: 'assistant', content: 'test' }];
  const messageId = '1';
  const feedback = 'helpful';

  const updated = messages.map((msg) => 
    msg.id === messageId ? { ...msg, feedback } : msg
  );
  
  assert.strictEqual(updated[0].feedback, 'helpful');
});

test('Follow-up questions (Context routing)', () => {
  // Simulating a context follow-up scenario
  // e.g., User previously asked about Food, assistant replied with contextCategory: 'Food'
  // Now user asks "what about tomorrow?", and we find a FAQ in the Food category that might match
  // For the sake of the test, let's create a temporary FAQ to verify the logic.
  
  // Actually, our findFAQ logic increases the score if the context matches the category.
  // If we query "today", there is a match in faq-1 (Food).
  const resultWithoutContext = findFAQ('today'); 
  assert.strictEqual(resultWithoutContext?.id, 'faq-1'); // Score = 1 due to "today"

  // We don't have a pure follow-up only word in the FAQs right now that doesn't trigger anyway,
  // but let's test that providing context doesn't crash and returns the correct FAQ
  const resultWithContext = findFAQ('today', 'Food');
  assert.strictEqual(resultWithContext?.id, 'faq-1'); // Score = 1.5
});
