document.addEventListener("DOMContentLoaded", function () {
  // Element references
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

  // Letter density variables
  const MAX_INITIAL_BARS = 5;
  let isShowingAllBars = false;
  let allDensityItems = [];
  const seeMoreBtn = document.querySelector(".see-more-btn");
  const letterDensityContainer = document.querySelector(".letter-density-items");

  // Reading time element reference
  const readTimeElement = document.getElementById("read-time-text");

  // Theme state
  let darkMode = false;

 
  // Theme toggle handler
  moonIcon.addEventListener("click", function () {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode", darkMode);

    if (darkMode) {
      logo.setAttribute("src", "./assets/images/logo-dark-theme.svg");
      moonIcon.setAttribute("src", "./assets/images/icon-sun.svg");
    } else {
      logo.setAttribute("src", "./assets/images/logo-light-theme.svg");
      moonIcon.setAttribute("src", "./assets/images/icon-moon.svg");
    }
  });

  // Update textarea visual states
  function updateTextareaState() {
    if (!textInput.classList.contains("error")) {
      textInput.classList.remove("textarea-glow");
      
      const hasActiveCheckbox = excludeSpacesCheckbox.checked || charLimitCheckbox.checked;
      
      if (hasActiveCheckbox) {
        textInput.classList.add("textarea-glow");
      }
    }
  }

  // Main validation function
  function validateTextArea() {
    const textInputText = textInput.value;

    // Count spaces in original text
    const spaceCount = (textInputText.match(/\s/g) || []).length;

    // Process text based on checkbox
    const processedText = excludeSpacesCheckbox.checked 
        ? textInputText.replace(/\s+/g, "") 
        : textInputText;

    // Update displayed character count
    charCount.innerText = String(processedText.length).padStart(2, "0");

    // Calculate limits
    const userSetLimit = parseInt(charLimitInput.value);
    const effectiveLength = processedText.length;

    // Calculate Word Count
    const wordArray = textInputText.split(/[\s.:;!?(){}\[\]]+/);
    wordCount.innerText = String(wordArray.filter(w => w.trim()).length).padStart(2, "0");

    // Calculate Sentence count
    const sentenceArray = textInputText.split(/[.?!]+/).filter(s => s.trim());
    sentenceCount.innerText = String(sentenceArray.length).padStart(2, "0");

    // Update reading time
    const readingTime = calculateReadingTime(textInputText);
    readTimeElement.textContent = readingTime < 1
      ? "0 minutes"
      : `${readingTime} minute${readingTime !== 1 ? "s" : ""}`;

    // Apply error state if over limit 
    if (charLimitCheckbox.checked && !isNaN(userSetLimit)) {
        if (effectiveLength > userSetLimit) {
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

    // Update checkbox glow state
    updateTextareaState();

    // Letter density display
    if (textInputText.length > 0) {
        noCharMessage.style.display = "none";
        updateLetterDensity(textInputText);
    } else {
        noCharMessage.style.display = "block";
        clearLetterDensity();
    }
  }

  // Calculate reading time function
  function calculateReadingTime(text) {
    if (!text.trim()) return 0;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(wordCount / 200);
  }

  // Keydown handler for character limit
  function handleLimitKeydown(e) {
    if (!["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
      e.preventDefault();
    }
  }

  // Letter density functions
  function updateLetterDensity(text) {
    clearLetterDensity();
    allDensityItems = [];

    if (!text.trim()) {
      seeMoreBtn.style.display = "none";
      return;
    }

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

    // Sort by frequency
    const sortedEntries = Array.from(frequencyMap.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    // Create density items
    sortedEntries.forEach(([char, count]) => {
      const percentage = Math.round((count / totalLetters) * 100);
      const item = document.createElement("div");
      item.className = "letter-density-item";

      item.innerHTML = `
        <span class="letter">${char.toUpperCase()}</span>
        <div class="bar-container"><div class="bar" style="width: ${percentage}%"></div></div>
        <span class="percentage">${count} (${percentage}%)</span>
      `;

      allDensityItems.push(item);
    });

    // Update button visibility and state
    if (allDensityItems.length > MAX_INITIAL_BARS) {
      seeMoreBtn.style.display = "flex";
      
      if (isShowingAllBars) {
        seeMoreBtn.classList.add("active");
        seeMoreBtn.querySelector(".btn-text").textContent = "See less";
        letterDensityContainer.append(...allDensityItems);
      } else {
        seeMoreBtn.classList.remove("active");
        seeMoreBtn.querySelector(".btn-text").textContent = "See more";
        letterDensityContainer.append(...allDensityItems.slice(0, MAX_INITIAL_BARS));
      }
    } else {
      seeMoreBtn.style.display = "none";
      letterDensityContainer.append(...allDensityItems);
    }
  }

  function clearLetterDensity() {
    letterDensityContainer.innerHTML = "";
    allDensityItems = [];
    // isShowingAllBars = false;
    seeMoreBtn.style.display = "none";
    seeMoreBtn.classList.remove("active");
    seeMoreBtn.querySelector(".btn-text").textContent = "See more";
  }
  
   // Initialize button
   seeMoreBtn.style.display = "none";
   seeMoreBtn.innerHTML = `
     <span class="btn-text">See more</span>
     <svg class="btn-icon" width="12" height="7" viewBox="0 0 12 7" fill="currentColor">
       <path d="M5.71875 6.375L1.09375 1.78125C0.9375 1.65625 0.9375 1.40625 1.09375 1.25L1.71875 0.65625C1.875 0.5 2.09375 0.5 2.25 0.65625L6 4.34375L9.71875 0.65625C9.875 0.5 10.125 0.5 10.25 0.65625L10.875 1.25C11.0312 1.40625 11.0312 1.65625 10.875 1.78125L6.25 6.375C6.09375 6.53125 5.875 6.53125 5.71875 6.375Z"/>
     </svg>
   `;
 

  // Event listeners
  textInput.addEventListener("input", validateTextArea);
  excludeSpacesCheckbox.addEventListener("change", validateTextArea);
  charLimitCheckbox.addEventListener("change", function() {
    charLimitInput.style.display = this.checked ? "block" : "none";
    if (!this.checked) charLimitInput.value = "";
    validateTextArea();
  });
  charLimitInput.addEventListener("input", validateTextArea);
  
  // Robust click handler with error handling
  seeMoreBtn.addEventListener("click", function(e) {
    try {
      e.stopPropagation();
      isShowingAllBars = !isShowingAllBars;
      updateLetterDensity(textInput.value);
    } catch (error) {
      console.error("See More button error:", error);
    }
  });

  // Initialize
  validateTextArea();
});