document.addEventListener("DOMContentLoaded", function () {
  const textInput = document.getElementById("text-input");
  const charCount = document.getElementById("char-count");
  const wordCount = document.getElementById("word-count");
  const sentenceCount = document.getElementById("sentence-count");
  const charLimitInput = document.getElementById("char-limit-input");
  const charLimitCheckbox = document.getElementById("char-limit-checkbox");
  // for the error number limit
  const setLimit = document.getElementById("set-limit");
  // the entire error message tag
  const errorMessage = document.getElementById("error-message");
  // To excludeSpaces from the text area
  const excludeSpacesCheckbox = document.getElementById("exclude-spaces");
  //Theme toggle button for both light and dark mode
  const themeToggle = document.getElementById("theme-toggle");
  // the logo tag
  const logo = document.querySelector(".logo");
  const moonIcon = document.querySelector(".moon-icon");
  // for the letter density message
  const noCharMessage = document.querySelector(".letter-density p");

  // Theme toogle variables
  let darkMode = false;

  // Theme toggle functionality
  moonIcon.addEventListener("click", function () {
    darkMode = !darkMode; // dynamically change the theme
    if (darkMode) {
      // for dark mode
      document.documentElement.style.setProperty("--primary-bg", "#12131A");
      document.documentElement.style.setProperty("--text-color", "#FFFFFF");
      document.documentElement.style.setProperty("--textarea-bg", "#2A2B37");
      logo.setAttribute("src", "./assets/images/logo-dark-theme.svg");
      moonIcon.setAttribute("src", "./assets/images/icon-sun.svg");
      moonIcon.style.backgroundColor = "#2A2B37";
      moonIcon.style.padding = "0.5rem";
      moonIcon.style.borderRadius = "20%";
      textInput.style.backgroundColor = "#2A2B37";
      textInput.style.border = "2px solid gray";
      textInput.style.color = "white";

      // change focus color for textInput
      // textInput.addEventListener("focus", function () {
      //   textInput.style.border = "0 0 5px 5px purple";
      // });
    } else {
      // for light mode
      document.documentElement.style.setProperty("--primary-bg", "#FFFFFF");
      document.documentElement.style.setProperty("--text-color", "#12131A");
      document.documentElement.style.setProperty("--textarea-bg", "#F2F2F7");
      logo.setAttribute("src", "./assets/images/logo-light-theme.svg");
      moonIcon.setAttribute("src", "./assets/images/icon-moon.svg");
      moonIcon.style.backgroundColor = "#F2F2F7";
      moonIcon.style.padding = "0.5rem";
      textInput.style.backgroundColor = "#FFFFFF";
    }
  });

  // toggle display of the character limit input when checkbox is clicked
  charLimitCheckbox.addEventListener("click", function () {
    if (charLimitInput.style.display === "block") {
      charLimitInput.style.display = "none"; // hide the input that receives the character limit number
    } else {
      charLimitInput.style.display = "block";
    }
  });

  // update counts when the excludeSpaces checkbox is toggled
  excludeSpacesCheckbox.addEventListener("change", function () {
    validateTextArea(); // re-run validation with new space setting
  });

  // update the displayed limit value and re-validate text area on every change in limit input
  charLimitInput.addEventListener("input", function () {
    let userSetLimit = parseInt(charLimitInput.value); // extract the number from the limit input tag
    if (!isNaN(userSetLimit) && userSetLimit > 0) {
      setLimit.innerText = userSetLimit;
    } else {
      setLimit.innerText = "00";
    }
    validateTextArea(); // re-validate whenever limit changes
  });

  // validate textarea on every input
  textInput.addEventListener("input", validateTextArea);

  // this function handles all textarea validation and updates
  function validateTextArea() {
    // to extract the textArea input
    const textInputText = textInput.value; // this is a big string

    // check whether spaces should be excluded
    let processedText = null;
    if (excludeSpacesCheckbox.checked) {
      processedText = textInputText.replace(/\s+/g, "");
    } else {
      processedText = textInputText;
    }

    // to update the number of characters
    const textInputTextLength = processedText.length;
    charCount.innerText = String(textInputTextLength).padStart(2, "0");

    let wordArray = textInputText.split(/[\s.:;!?(){}\[\]]+/);
    let validWordCount = 0;
    for (let word of wordArray) {
      if (word.trim() !== "") {
        validWordCount++;
      }
    }
    wordCount.innerText = String(validWordCount).padStart(2, "0");

    // to update the number of sentences
    let sentenceArray = textInputText
      .split(/[.?!]+/)
      .filter((sentence) => sentence.trim() != ""); // to convert the string into an array, and trim every sentence to remove the empty spaces because deleting all the textArea content leaves one space which is counted as one length
    sentenceCount.innerText = String(sentenceArray.length).padStart(2, "0");

    // to set the character limit
    let userSetLimit = parseInt(charLimitInput.value); // extract the number from the limit input tag
    if (!isNaN(userSetLimit) && textInputTextLength > userSetLimit) {
      textInput.style.border = "2px solid #FE8159";
      textInput.style.boxShadow = "0 0 5px 5px var(--faded-purple)";
      textInput.setAttribute("readonly", "true"); // to make it reject any input after exceeding the character limit
      errorMessage.style.display = "inline-block";
      setLimit.innerText = userSetLimit;
    } else {
      textInput.style.border = "";
      textInput.style.boxShadow = "";
      textInput.removeAttribute("readonly");
      errorMessage.style.display = "none";
    }
    //letters density display

    // Update letter density display
    if (textInputText.length > 0) {
      noCharMessage.style.display = "none";
      updateLetterDensity(textInputText);
    } else {
      noCharMessage.style.display = "block";
      clearLetterDensity();
    }
  }

  function updateLetterDensity(text) {
    // Clear previous letter density display
    clearLetterDensity();

    // Create frequency map
    const frequencyMap = new Map();
    for (const char of text.toLowerCase()) {
      if (/[a-z]/.test(char)) {
        // Only count letters
        frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
      }
    }

    // Calculate total letters
    const totalLetters = Array.from(frequencyMap.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    // Sort by frequency (descending)
    const sortedEntries = Array.from(frequencyMap.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    // Get the letter density container
    const letterDensityContainer = document.querySelector(".letter-density");

    // Create and append letter density items
    for (const [char, count] of sortedEntries) {
      const percentage = Math.round((count / totalLetters) * 100);

      const item = document.createElement("div");
      item.className = "letter-density-item";

      const charSpan = document.createElement("span");
      charSpan.className = "letter";
      charSpan.textContent = char.toUpperCase();

      const barContainer = document.createElement("div");
      barContainer.className = "bar-container";

      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.width = `${percentage}%`;

      const percentageSpan = document.createElement("span");
      percentageSpan.className = "percentage";
      percentageSpan.textContent = `${count} (${percentage}%)`;

      barContainer.appendChild(bar);
      item.append(charSpan, barContainer, percentageSpan);
      letterDensityContainer.appendChild(item);
    }
  }

  function clearLetterDensity() {
    const letterDensityContainer = document.querySelector(".letter-density");
    const items = letterDensityContainer.querySelectorAll(
      ".letter-density-item"
    );
    items.forEach((item) => item.remove());
  }
});
