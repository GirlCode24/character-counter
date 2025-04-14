document.addEventListener("DOMContentLoaded", function () {
  const textInput = document.getElementById("text-input");
  const totalCharac = document.getElementById("total-charac");
  const wordCount = document.getElementById("word-count");
  const sentenceCount = document.getElementById("sentence-count");
  const charLimit = document.getElementById("char-limit");
  const charLimitCheckbox = document.getElementById("char-limit"); // corrected ID

  charLimitCheckbox.addEventListener("click", function () {
    // your click logic here (currently empty)
  });

  // Event Listener to text area - Trigger
  textInput.addEventListener("input", function () {
    const textInputString = textInput.value;
    const textInputStringLength = textInputString.length;

    totalCharac.innerHTML = textInputStringLength;

    // Count number of words
    let wordArray = textInputString.split(" ");
    wordCount.innerText = wordArray.length;

    // Count number of sentences
    let sentenceArray = textInputString.split(/[.!?]+/);
    sentenceCount.innerText = sentenceArray.length;
  });
});
