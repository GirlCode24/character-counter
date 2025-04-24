// Character Count
function countCharacters(text) {
    return text.length;
}
// Word Count
function countWords(text){
    return text.trim().split(/\s+/).filter(Boolean).length;
}
// Sentence Count
function countSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim() !== "").length;
  }

  //DOM Elements Mocking
  function updateCounts(textarea, charCountEl, wordCountEl, sentenceCountEl) {
    const text = textarea.value;
    charCountEl.textContent = countCharacters(text);
    wordCountEl.textContent = countWords(text);
    sentenceCountEl.textContent = countSentences(text);
  }

  module.exports = {
    countCharacters,
    countWords,
    countSentences,
    updateCounts
  };
