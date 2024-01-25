const bodyElement = document.body;
const displayEl = document.querySelector(".display > span");
const themeToggle = document.querySelector(".theme-toggle");

const operations = ["+", "-", "*", "/", "del", "reset", "="];

themeToggle.addEventListener("click", (e) => {
  if (e.target.tagName !== "INPUT") return;

  bodyElement.className = "";
  bodyElement.classList.add(e.target.id);
});

document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById("display");
  const keypad = document.getElementById("keypad");

  let currentInput = "0";
  let currentOperator = null;
  let previousValue = null;

  const updateDisplay = () => {
    display.innerText = currentInput;
  };

  const isOperator = (value) => {
    return operations.includes(value);
  };

  updateDisplay();

  /**
   * Event listener for keypad buttons
   * Implements Event Delegation
   * https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation
   */

  keypad.addEventListener("click", (event) => {
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
      currentInput = "0";

      updateDisplay();
    }

    if (!isOperator(buttonValue)) {
      if (currentInput === "0") {
        // If the current input is 0 or there is a previous value, replace it
        currentInput = buttonValue;
      } else {
        currentInput += buttonValue;
      }

      // Check if the current input already has a dot
      const hasDot = currentInput.includes(".");

      console.log(hasDot);
      if (buttonValue === "." && hasDot) {
        // If the button value is a dot and there's already a dot, do nothing
        return;
      }

      // Update the display
      updateDisplay();
    }
  });

  // Function to perform the final calculation
  const calculate = () => {
    if (!currentOperator || !previousValue) {
      console.log("currentOperator or previousValue is missing");

      reset();

      return;
    }

    try {
      currentInput = eval(
        `${Number(previousValue)} ${currentOperator} ${Number(currentInput)}`
      );
    } catch (error) {
      console.error("Error in calculation:", error);
      reset();
    }

    previousValue = null;
    currentOperator = null;

    updateDisplay();
  };

  const reset = () => {
    currentInput = "0";
    currentOperator = null;
    previousValue = null;

    updateDisplay();
  };

  const deleteLastCharacter = () => {
    if (currentInput == 0) {
      return;
    } else if (currentInput.length == 1) {
      currentInput = 0;
    } else {
      currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
  };
});
