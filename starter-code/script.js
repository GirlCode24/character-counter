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
  const letterDensityContainer = document.querySelector(
    ".letter-density-items"
  );

  // Theme state
  let darkMode = false;

  // Theme toggle handler
  moonIcon.addEventListener("click", function () {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode", darkMode);

    if (darkMode) {
      // Dark mode
      document.documentElement.style.setProperty("--primary-bg", "#12131A");
      document.documentElement.style.setProperty("--text-color", "#FFFFFF");
      document.documentElement.style.setProperty("--textarea-bg", "#2A2B37");
      document.documentElement.style.setProperty(
        "--checkbox-border",
        "#FFFFFF"
      );
      logo.setAttribute("src", "./assets/images/logo-dark-theme.svg");
      moonIcon.setAttribute("src", "./assets/images/icon-sun.svg");
      moonIcon.style.backgroundColor = "#2A2B37";
      moonIcon.style.padding = "0.5rem";
      moonIcon.style.borderRadius = "20%";
      moonIcon.style.border = "1px solid #3A3A4A";
      textInput.style.backgroundColor = "#2A2B37";
      textInput.style.color = "white";

      // Ensure See More button is visible in dark mode
      seeMoreBtn.style.color = "#FFFFFF";
    } else {
      // Light mode
      document.documentElement.style.setProperty("--primary-bg", "#F2F2F7");
      document.documentElement.style.setProperty("--text-color", "#12131A");
      document.documentElement.style.setProperty("--textarea-bg", "#E4E4EF");
      document.documentElement.style.setProperty(
        "--checkbox-border",
        "#12131A"
      );
      logo.setAttribute("src", "./assets/images/logo-light-theme.svg");
      moonIcon.setAttribute("src", "./assets/images/icon-moon.svg");
      moonIcon.style.backgroundColor = "#E4E4EF";
      moonIcon.style.padding = "0.5rem";
      moonIcon.style.borderRadius = "20%";
      moonIcon.style.border = "1px solid #D0D0D7";
      textInput.style.backgroundColor = "";
      textInput.style.color = "";

      // Revert See More button to dark text
      seeMoreBtn.style.color = "#12131A";
    }
  });

  // Update textarea visual states
  function updateTextareaState() {
    textInput.classList.remove("textarea-glow", "error");

    const hasActiveCheckbox =
      excludeSpacesCheckbox.checked || charLimitCheckbox.checked;
    const userSetLimit = parseInt(charLimitInput.value);
    const isOverLimit =
      charLimitCheckbox.checked &&
      !isNaN(userSetLimit) &&
      textInput.value.length > userSetLimit;

    if (isOverLimit) {
      textInput.classList.add("error");
    } else if (hasActiveCheckbox) {
      textInput.classList.add("textarea-glow");
    }
  }

  // Main validation function
  function validateTextArea() {
    const textInputText = textInput.value;
    const processedText = excludeSpacesCheckbox.checked
      ? textInputText.replace(/\s+/g, "")
      : textInputText;

    // Update counts
    charCount.innerText = String(processedText.length).padStart(2, "0");
    const wordArray = textInputText.split(/[\s.:;!?(){}\[\]]+/);
    wordCount.innerText = String(
      wordArray.filter((word) => word.trim() !== "").length
    ).padStart(2, "0");
    sentenceCount.innerText = String(
      textInputText.split(/[.?!]+/).filter((s) => s.trim() !== "").length
    ).padStart(2, "0");
    // Character limit validation
    const userSetLimit = parseInt(charLimitInput.value);
    if (charLimitCheckbox.checked && !isNaN(userSetLimit)) {
      if (textInputText.length > userSetLimit) {
        errorMessage.style.display = "inline-block";
        setLimit.innerText = userSetLimit;
        textInput.addEventListener("keydown", handleLimitKeydown);
      } else {
        errorMessage.style.display = "none";
        textInput.removeEventListener("keydown", handleLimitKeydown);
      }
    } else {
      errorMessage.style.display = "none";
      textInput.removeEventListener("keydown", handleLimitKeydown);
    }

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
    if (
      ![
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      e.preventDefault();
    }
  }

  // Letter density functions
  function updateLetterDensity(text) {
    clearLetterDensity();
    allDensityItems = [];

    const frequencyMap = new Map();
    for (const char of text.toLowerCase()) {
      if (/[a-z]/.test(char))
        frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    }

    const totalLetters = Array.from(frequencyMap.values()).reduce(
      (sum, count) => sum + count,
      0
    );
    const sortedEntries = Array.from(frequencyMap.entries()).sort(
      (a, b) => b[1] - a[1]
    );

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

    if (allDensityItems.length > MAX_INITIAL_BARS) {
      seeMoreBtn.style.display = "block";
      seeMoreBtn.textContent = isShowingAllBars ? "See less" : "See more";
      const itemsToShow = isShowingAllBars
        ? allDensityItems
        : allDensityItems.slice(0, MAX_INITIAL_BARS);
      itemsToShow.forEach((item) => letterDensityContainer.appendChild(item));
    } else {
      seeMoreBtn.style.display = "none";
      allDensityItems.forEach((item) =>
        letterDensityContainer.appendChild(item)
      );
    }
  }

  function clearLetterDensity() {
    letterDensityContainer.innerHTML = "";
  }

  // Event listeners
  textInput.addEventListener("input", validateTextArea);
  excludeSpacesCheckbox.addEventListener("change", validateTextArea);
  charLimitCheckbox.addEventListener("change", function () {
    charLimitInput.style.display = this.checked ? "block" : "none";
    if (!this.checked) charLimitInput.value = "";
    validateTextArea();
  });
  charLimitInput.addEventListener("input", validateTextArea);
  seeMoreBtn.addEventListener("click", function () {
    isShowingAllBars = !isShowingAllBars;
    updateLetterDensity(textInput.value);
  });

  // Initialize
  validateTextArea();
});
