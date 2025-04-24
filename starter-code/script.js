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

  // Theme state
  let darkMode = false;

  // Theme toggle handler
  moonIcon.addEventListener("click", function () {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode", darkMode);

    if (darkMode) {
      // Dark mode
      logo.setAttribute("src", "./assets/images/logo-dark-theme.svg");
      moonIcon.setAttribute("src", "./assets/images/icon-sun.svg");
    } else {
      // Light mode
      logo.setAttribute("src", "./assets/images/logo-light-theme.svg");
      moonIcon.setAttribute("src", "./assets/images/icon-moon.svg");
    }
  });

  // Update textarea visual states
  function updateTextareaState() {
    textInput.classList.remove("textarea-glow", "error");
    
    const hasActiveCheckbox = excludeSpacesCheckbox.checked || charLimitCheckbox.checked;
    
    if (hasActiveCheckbox) {
      textInput.classList.add("textarea-glow");
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
    let effectiveLimit = userSetLimit;
    let effectiveLength = textInputText.length;
    
    if (excludeSpacesCheckbox.checked && charLimitCheckbox.checked && !isNaN(userSetLimit)) {
        // When excluding spaces, increase effective limit by space count
        effectiveLimit = userSetLimit + spaceCount;
        effectiveLength = processedText.length; // Count without spaces against increased limit
    }

    // Update word
    const wordArray = textInputText.split(/[\s.:;!?(){}\[\]]+/);
    wordCount.innerText = String(wordArray.filter(w => w.trim()).length).padStart(2, "0");
    // sentence counts
    const sentenceArray = textInputText.split(/[.?!]+/).filter(s => s.trim());
    sentenceCount.innerText = String(sentenceArray.length).padStart(2, "0");

    // Apply error state if over limit 
    if (charLimitCheckbox.checked && !isNaN(userSetLimit)) {
        if (effectiveLength > effectiveLimit) {
            textInput.classList.add("error");
            errorMessage.style.display = "inline-block";
              textInput.classList.add("error");
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

  // Event listeners
  textInput.addEventListener("input", validateTextArea);
  excludeSpacesCheckbox.addEventListener("change", validateTextArea);
  charLimitCheckbox.addEventListener("change", function() {
    charLimitInput.style.display = this.checked ? "block" : "none";
    if (!this.checked) charLimitInput.value = "";
    validateTextArea();
  });
  charLimitInput.addEventListener("input", validateTextArea);
  seeMoreBtn.addEventListener("click", function() {
    isShowingAllBars = !isShowingAllBars;
    updateLetterDensity(textInput.value);
  });

  // Initialize
  validateTextArea();
});