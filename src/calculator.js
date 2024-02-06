/**
 *  Register a DOMContentLoaded event listener so we run that code after
 *  the browser has finished parsing the document and constructing the DOM
 */

document.addEventListener("DOMContentLoaded", () => {
  const OPERATIONS = ["+", "-", "*", "/", "del", "reset", "="];
  const MAX_OPERATED_NUMBER = 999_999_999_999;

  const display = document.getElementById("display");
  const keypad = document.getElementById("keypad");

  /* State */
  let currentInput = 0;
  let currentOperator = null;
  let previousValue = null;

  keypad.addEventListener("click", (event) => handleKeypadInput(event));

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
