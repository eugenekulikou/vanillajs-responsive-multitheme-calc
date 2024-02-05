/**
 *  Register a DOMContentLoaded event listener so we run that code after
 *  the browser has finished parsing the document and constructing the DOM
 */

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  VIOLET: "violet",
};

const THEME_OWNER = document.documentElement;
const THEME_STORAGE_KEY = "theme";

function isCurrentTheme(targetTheme) {
  const currentTheme = THEME_OWNER.getAttribute("data-theme");

  return currentTheme === targetTheme;
}

function createThemeToggle() {
  // Create the main container div
  const themeToggleContainer = document.createElement("div");
  themeToggleContainer.className = "theme-toggle";

  // Create radio buttons
  const darkRadio = createRadioButton("dark", isCurrentTheme);
  const lightRadio = createRadioButton("light", isCurrentTheme);
  const violetRadio = createRadioButton("violet", isCurrentTheme);

  // Create labels for radio buttons
  const darkLabel = createLabel("dark", "1");
  const lightLabel = createLabel("light", "2");
  const violetLabel = createLabel("violet", "3");

  // Create a div for labels
  const labelContainer = document.createElement("div");
  labelContainer.className = "theme-toggle-label-container";

  const slider = document.createElement("span");
  slider.className = "slider";

  // Append labels to the div
  labelContainer.appendChild(darkLabel);
  labelContainer.appendChild(lightLabel);
  labelContainer.appendChild(violetLabel);

  // Append radio buttons and label container to the main container
  themeToggleContainer.appendChild(darkRadio);
  themeToggleContainer.appendChild(lightRadio);
  themeToggleContainer.appendChild(violetRadio);
  themeToggleContainer.appendChild(labelContainer);
  themeToggleContainer.appendChild(slider);

  return themeToggleContainer;
}

// Helper function to create radio buttons
function createRadioButton(id, checked = false) {
  const radio = document.createElement("input");
  radio.type = "radio";
  radio.id = id;
  radio.name = "theme";

  if (checked) {
    radio.checked = true;
  }

  return radio;
}

// Helper function to create labels
function createLabel(id, text) {
  const label = document.createElement("label");
  label.htmlFor = id;
  label.id = id;
  label.name = "theme";
  label.textContent = text;
  return label;
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementsByTagName("header")[0];
  const themeToggle = createThemeToggle();

  console.log(themeToggle);
  // Check if header exists before appending theme toggle
  if (header) {
    // Call the function to create the theme toggle structure

    // Append theme toggle to the end of header children
    header.appendChild(themeToggle);
  } else {
    console.error("Header element not found.");
  }

  themeToggle.addEventListener("click", (event) => {
    if (event.target.tagName !== "INPUT") return;

    const themeId = event.target.id;

    if (themeId) {
      setTheme(themeId);
    }
  });

  function setTheme(themeId) {
    THEME_OWNER.dataset[THEME_STORAGE_KEY] = themeId;
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  }

  const OPERATIONS = ["+", "-", "*", "/", "del", "reset", "="];
  const MAX_OPERATED_NUMBER = 999_999_999_999;

  const display = document.getElementById("display");
  const keypad = document.getElementById("keypad");

  keypad.addEventListener("click", (event) => handleKeypadInput(event));

  let currentInput = 0;
  let currentOperator = null;
  let previousValue = null;

  const updateDisplay = () => {
    display.innerText = formatNumberWithCommas(currentInput);
  };

  const isOperator = (value) => {
    return OPERATIONS.includes(value);
  };

  // Function to perform the final calculation
  function calculate() {
    if (!currentOperator || !previousValue) {
      reset();

      return;
    }

    try {
      const result = eval(
        `${Number(previousValue)} ${currentOperator} ${Number(currentInput)}`
      );

      if (result > MAX_OPERATED_NUMBER) {
        throw new Error(
          `Result exceeds the limit (${MAX_OPERATED_NUMBER}). Please enter smaller numbers.`
        );
      }

      currentInput = result.toFixed(5);
    } catch (error) {
      console.error("Error in calculation:", error);
    }

    previousValue = null;
    currentOperator = null;

    updateDisplay();
  }

  function reset() {
    currentInput = 0;
    currentOperator = null;
    previousValue = null;

    updateDisplay();
  }

  function deleteLastCharacter() {
    if (currentInput == 0) {
      return;
    } else if (currentInput.length == 1) {
      currentInput = 0;
    } else {
      currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
  }

  function formatNumberWithCommas(input) {
    let inputStr = String(input);

    let parts = inputStr.split(".");
    let integerPart = parts[0];

    // Remove decimal part if it is eq to 0
    let decimalPart =
      parts.length > 1 && parseInt(parts[1]) !== 0 ? "." + parts[1] : "";
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return formattedInteger + decimalPart;
  }

  function emulateButtonClick(key) {
    const targetButton = document.querySelector(`[data-id='${key}']`);

    targetButton.dispatchEvent(new MouseEvent("click"));
    debugger;
  }

  /**
   * Event listener for keypad buttons
   * Implements Event Delegation
   * https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation
   */

  function handleKeypadInput(event) {
    if (event.target.tagName !== "BUTTON") {
      return;
    }

    const button = event.target;
    const buttonValue = button.getAttribute("data-id");

    if (isOperator(buttonValue)) {
      if (buttonValue === "=") {
        calculate();
        return;
      } else if (buttonValue === "reset") {
        reset();
        return;
      } else if (buttonValue === "del") {
        deleteLastCharacter();
        return;
      }

      currentOperator = buttonValue;
      previousValue = currentInput;
      currentInput = 0;

      updateDisplay();
    }

    if (!isOperator(buttonValue)) {
      if (currentInput === 0) {
        // If the current input is 0 or there is a previous value, replace it
        currentInput = buttonValue;
      } else if (currentInput.length < 12) {
        currentInput += buttonValue;
      } else {
        return;
      }

      // Check if the current input already has a dot
      if (parseFloat(currentInput)) updateDisplay();
    }
  }
});
