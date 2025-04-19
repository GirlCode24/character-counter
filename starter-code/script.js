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

  // Theme toggle variables
  let darkMode = false;

  // Theme toggle handler
  moonIcon.addEventListener("click", function () {
    darkMode = !darkMode;

    if (darkMode) {
      // Dark mode
      document.documentElement.style.setProperty("--primary-bg", "#12131A");
      document.documentElement.style.setProperty("--text-color", "#FFFFFF");
      document.documentElement.style.setProperty("--textarea-bg", "#2A2B37");
      document.documentElement.style.setProperty("--checkbox-border", "#FFFFFF");
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
      document.documentElement.style.setProperty("--primary-bg", "#F2F2F7");
      document.documentElement.style.setProperty("--text-color", "#12131A");
      document.documentElement.style.setProperty("--textarea-bg", "#E4E4EF");
      document.documentElement.style.setProperty("--checkbox-border", "#12131A"); 
      logo.setAttribute("src", "./assets/images/logo-light-theme.svg");
      moonIcon.setAttribute("src", "./assets/images/icon-moon.svg");
      moonIcon.style.backgroundColor = "#E4E4EF";
      moonIcon.style.padding = "0.5rem";
      moonIcon.style.borderRadius = "20%";
      moonIcon.style.border = "1px solid #D0D0D7"; 
      textInput.style.backgroundColor = "";
      textInput.style.color = "";
    }
  });

  // Character limit checkbox handler
  charLimitCheckbox.addEventListener("change", function() {
    if (!this.checked) {
      // When unchecking, clear all limit-related restrictions
      charLimitInput.style.display = "none";
      textInput.classList.remove("error");
      errorMessage.style.display = "none";
      textInput.removeEventListener("keydown", handleLimitKeydown);
      charLimitInput.value = "";
    } else {
      charLimitInput.style.display = "block";
    }
    validateTextArea();
  });

  // Character limit input handler
  charLimitInput.addEventListener("input", function () {
    let userSetLimit = parseInt(charLimitInput.value);
    if (!isNaN(userSetLimit) && userSetLimit > 0) {
      setLimit.innerText = userSetLimit;
    } else {
      setLimit.innerText = "00";
    }
    validateTextArea();
  });

  // Keydown handler for character limit
  function handleLimitKeydown(e) {
    if (!["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
      e.preventDefault();
    }
  }

  // Text input handler
  textInput.addEventListener("input", validateTextArea);

  // Main validation function
  function validateTextArea() {
    const textInputText = textInput.value;
    
    // Check whether spaces should be excluded
    let processedText = excludeSpacesCheckbox.checked 
      ? textInputText.replace(/\s+/g, "") 
      : textInputText;

    // Update character count
    const textInputTextLength = processedText.length;
    charCount.innerText = String(textInputTextLength).padStart(2, "0");

    // Update word count
    let wordArray = textInputText.split(/[\s.:;!?(){}\[\]]+/);
    let validWordCount = wordArray.filter(word => word.trim() !== "").length;
    wordCount.innerText = String(validWordCount).padStart(2, "0");

    // Update sentence count
    let sentenceArray = textInputText.split(/[.?!]+/).filter(sentence => sentence.trim() !== "");
    sentenceCount.innerText = String(sentenceArray.length).padStart(2, "0");

    // Character limit validation
    let userSetLimit = parseInt(charLimitInput.value);
    if (charLimitCheckbox.checked && !isNaN(userSetLimit)){
      if (textInputTextLength > userSetLimit) {
        textInput.classList.add("error");
        errorMessage.style.display = "inline-block";
        setLimit.innerText = userSetLimit;
        textInput.addEventListener("keydown", handleLimitKeydown);
      } else {
        textInput.classList.remove("error");
        errorMessage.style.display = "none";
        textInput.removeEventListener("keydown", handleLimitKeydown);
      }
    } else {
      textInput.classList.remove("error");
      errorMessage.style.display = "none";
      textInput.removeEventListener("keydown", handleLimitKeydown);
    }

    // Check if any checkbox is checked and apply glow
    if (excludeSpacesCheckbox.checked || charLimitCheckbox.checked) {
      textInput.classList.add("textarea-glow");
    } else {
      textInput.classList.remove("textarea-glow");
    }

    // Letter density display
    if (textInputText.length > 0) {
      noCharMessage.style.display = "none";
      updateLetterDensity(textInputText);
    } else {
      noCharMessage.style.display = "block";
      clearLetterDensity();
    }
}

  // Letter density functions
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

  // See more/less button handler
  seeMoreBtn.addEventListener("click", function() {
    isShowingAllBars = !isShowingAllBars;
    updateLetterDensity(textInput.value);
  });
});