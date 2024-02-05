const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  VIOLET: "violet",
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementsByTagName("header")[0];
  const themeToggle = createThemeToggle();
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
});

function setTheme(themeId) {
  THEME_OWNER.dataset[THEME_STORAGE_KEY] = themeId;
  localStorage.setItem(THEME_STORAGE_KEY, themeId);
}

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
