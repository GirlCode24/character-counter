// import { countCharacters } from '../logic.js';
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
