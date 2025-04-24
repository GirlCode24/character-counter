/**
 * @jest-environment jsdom
 */
// Character Counter Testing
const { countCharacters } = require('../characterCounter.js');

describe('Character Counter', () => {
  test('counts characters in a normal sentence', () => {
    expect(countCharacters('Hello world')).toBe(11);
  });

  test('counts characters in an empty string', () => {
    expect(countCharacters('')).toBe(0);
  });

  test('counts characters with special symbols', () => {
    expect(countCharacters('@#%&*!')).toBe(6);
  });
  
  test('counts characters with whitespace', () => {
    expect(countCharacters('   spaced out    ')).toBe(17);
  });
});


// Word Count Testing
const { countWords } = require('../characterCounter.js');
describe('Word Counter', () => {
  test('counts words in a normal sentence', () => {
    expect(countWords('I Love You')).toBe(3);
  });
  test('counts words in an empty string', () => {
    expect(countWords('')).toBe(0);
  });
  test('counts words with special symbols', () => {
    expect(countWords('@#%&*!')).toBe(1);
  });
  test('counts words with whitespace', () => {
    expect(countWords('   spaced out    ')).toBe(2);
  });
  test('counts words with punctuation', () => {
    expect(countWords('Hello, world!')).toBe(2);
  });
  test('counts words with multiple spaces', () => {
    expect(countWords('Hello   world')).toBe(2);
  });
  test('counts words with new lines', () => {
    expect(countWords('Hello\nworld')).toBe(2);
  });
});

// Sentence Count Testing
const { countSentences } = require('../characterCounter.js');
  describe('Sentence Counter', () => {
  test('counts sentences in a normal paragraph', () => {
    expect(countSentences('Hello world. How are you?')).toBe(2);
  });
  test('counts sentences in an empty string', () => {
    expect(countSentences('')).toBe(0);
  });
  test('counts sentences with special symbols', () => {
    expect(countSentences('@#%&*!')).toBe(1);
  });
  test('counts sentences with whitespace', () => {
    expect(countSentences('   spaced out    ')).toBe(1);
  });
  test('counts sentences with punctuation', () => {
    expect(countSentences('I Love You!')).toBe(1);
  });
  test('counts sentences with multiple spaces', () => {
    expect(countSentences('Hello   world')).toBe(1);
  });
  test('counts sentences with commas', () => {
    expect(countSentences('Hello, Babe. How are you?')).toBe(2);
  });
});


 // DOM Elements Testing

 const { updateCounts } = require('../characterCounter.js');

describe('DOM Updates with updateCounts()', () => {
  let textarea, charCountEl, wordCountEl, sentenceCountEl, warningEl;

  beforeEach(() => {
    // Mock the DOM elements
    textarea = document.createElement('textarea');
    charCountEl = document.createElement('span');
    wordCountEl = document.createElement('span');
    sentenceCountEl = document.createElement('span');
    warningEl = document.createElement('span');
  });

  test('updates character, word, and sentence counts correctly', () => {
    // Simulate typing in the textarea
    textarea.value = 'Hello world. This is great!';

    // Call the function like a user typed
    updateCounts(textarea, charCountEl, wordCountEl, sentenceCountEl, warningEl);

    // DOM updates
    expect(charCountEl.textContent).toBe('27'); // 'Hello world. This is great!'
    expect(wordCountEl.textContent).toBe('5');  // 5 words
    expect(sentenceCountEl.textContent).toBe('2'); // 2 sentences
  });

  // Warning Test
  test('shows warning if character count exceeds limit', () => {
    textarea.value = 'a'.repeat(301); // 301 characters

    updateCounts(textarea, charCountEl, wordCountEl, sentenceCountEl, warningEl);

    expect(warningEl.textContent).toBe('⚠️ Character limit exceeded!');
  });

  test('does not show warning when under limit', () => {
    textarea.value = 'short text';

    updateCounts(textarea, charCountEl, wordCountEl, sentenceCountEl, warningEl);

    expect(warningEl.textContent).toBe('');
  });
});
