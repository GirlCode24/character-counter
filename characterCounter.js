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
  function updateCounts(textarea, charCountEl, wordCountEl, sentenceCountEl, warningEl) {
    const text = textarea.value;
    charCountEl.textContent = countCharacters(text);
    wordCountEl.textContent = countWords(text);
    sentenceCountEl.textContent = countSentences(text);

    // Warning if character limit is exceeded
    if (text.length > 300) {
      warningEl.textContent = '⚠️ Character limit exceeded!';
    } else {
      warningEl.textContent = '';
    }
  }

  module.exports = {
    countCharacters,
    countWords,
    countSentences,
    updateCounts
  };
