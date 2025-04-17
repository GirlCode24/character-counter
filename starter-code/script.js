document.addEventListener("DOMContentLoaded", function () {
  const textInput = document.getElementById("text-input");
  const charCount = document.getElementById("char-count");
  const wordCount = document.getElementById("word-count");
  const sentenceCount = document.getElementById("sentence-count");
  const charLimitInput = document.getElementById("char-limit-input");
  const charLimitCheckbox = document.getElementById("char-limit-checkbox");
  const setLimit = document.getElementById("set-limit");
  const errorMessage = document.getElementById("error-message");
  const excludeSpacesCheckbox = document.getElementById("exclude-spaces");
  const themeToggle = document.getElementById("theme-toggle");
  const logo = document.querySelector(".logo");
  const moonIcon = document.querySelector(".moon-icon");
  const noCharMessage = document.querySelector(".letter-density p");
  // see more/see less button
  const MAX_INITIAL_BARS = 5;
  let isShowingAllBars = false;
  let allDensityItems = [];
  const seeMoreBtn = document.querySelector(".see-more-btn");
  const letterDensityContainer = document.querySelector(".letter-density-items");

  // Theme toogle variables
  let darkMode = false;

  moonIcon.addEventListener("click", function () {
    darkMode = !darkMode;

    if (darkMode) {
      // Dark mode
      document.documentElement.style.setProperty("--primary-bg", "#12131A");
      document.documentElement.style.setProperty("--text-color", "#FFFFFF");
      document.documentElement.style.setProperty("--textarea-bg", "#2A2B37");
      logo.setAttribute("src", "./assets/images/logo-dark-theme.svg");
      moonIcon.setAttribute("src", "./assets/images/icon-sun.svg");
      moonIcon.style.backgroundColor = "#2A2B37";
      moonIcon.style.padding = "0.5rem";
      moonIcon.style.borderRadius = "20%";
      moonIcon.style.border = "1px solid #3A3A4A"; 
      textInput.style.backgroundColor = "#2A2B37";
      textInput.style.color = "white";
    } else {
      // Light mode
      document.documentElement.style.setProperty("--primary-bg", "#FFFFFF");
      document.documentElement.style.setProperty("--text-color", "#12131A");
      document.documentElement.style.setProperty("--textarea-bg", "#F2F2F7");
      logo.setAttribute("src", "./assets/images/logo-light-theme.svg");
      moonIcon.setAttribute("src", "./assets/images/icon-moon.svg");
      moonIcon.style.backgroundColor = "#F2F2F7";
      moonIcon.style.padding = "0.5rem";
      moonIcon.style.borderRadius = "20%";
      moonIcon.style.border = "1px solid #D0D0D7"; 
      textInput.style.backgroundColor = "";
      textInput.style.color = "";
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
    validateTextArea(); 
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
    const textInputText = textInput.value;

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
    if (textInputText.length > 0) {
      noCharMessage.style.display = "none";
      updateLetterDensity(textInputText);
    } else {
      noCharMessage.style.display = "block";
      clearLetterDensity();
    }
  }

  function updateLetterDensity(text) {
    clearLetterDensity();
    allDensityItems = [];

    // Create frequency map
    const frequencyMap = new Map();
    for (const char of text.toLowerCase()) {
      if (/[a-z]/.test(char)) {
        frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
      }
    }

    const totalLetters = Array.from(frequencyMap.values()).reduce(
      (sum, count) => sum + count, 0
    );

    const sortedEntries = Array.from(frequencyMap.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    // Create all density items
    sortedEntries.forEach(([char, count]) => {
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
      allDensityItems.push(item);
    });

    // Show/hide logic
    if (allDensityItems.length > MAX_INITIAL_BARS) {
      seeMoreBtn.style.display = "block";
      seeMoreBtn.textContent = isShowingAllBars ? "See less" : "See more";
      
      const itemsToShow = isShowingAllBars 
        ? allDensityItems 
        : allDensityItems.slice(0, MAX_INITIAL_BARS);
      
      itemsToShow.forEach(item => letterDensityContainer.appendChild(item));
    } else {
      seeMoreBtn.style.display = "none";
      allDensityItems.forEach(item => letterDensityContainer.appendChild(item));
    }
  }

  function clearLetterDensity() {
    letterDensityContainer.innerHTML = "";
  }

  // Event listener for See More/Less button
  seeMoreBtn.addEventListener("click", function() {
    isShowingAllBars = !isShowingAllBars;
    updateLetterDensity(textInput.value);
  });
});