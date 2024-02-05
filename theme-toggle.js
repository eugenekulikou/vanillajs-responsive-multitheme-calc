(function () {
  const THEMES = {
    LIGHT: "light",
    DARK: "dark",
    VIOLET: "violet",
  };

  var THEME_OWNER = document.documentElement;
  var THEME_STORAGE_KEY = "theme";

  const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (cachedTheme) {
    THEME_OWNER.dataset[THEME_STORAGE_KEY] = cachedTheme;
  }

  let darkThemeSystemPreference;

  document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementsByTagName("header")[0];
    const themeToggle = createThemeToggle();

    if (!header || !themeToggle) return;

    header.appendChild(themeToggle);

    if (!cachedTheme) {
      darkThemeSystemPreference = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      darkThemeSystemPreference.addEventListener?.(
        "change",
        handleSystemDarkThemePreferenceChange
      );

      handleSystemDarkThemePreferenceChange(darkThemeSystemPreference);
    }

    themeToggle.addEventListener("click", handleThemeToggle);
  });

  function handleSystemDarkThemePreferenceChange({
    matches: isDarkThemePreferred,
  }) {
    const theme =
      cachedTheme === THEMES.DARK || !!darkThemeSystemPreference?.matches
        ? THEMES.DARK
        : THEMES.LIGHT;

    THEME_OWNER.dataset[THEME_STORAGE_KEY] = theme;
  }

  function handleThemeToggle(event) {
    if (event.target.tagName !== "INPUT") return;

    const theme = event.target.id;
    if (theme) setTheme(theme);

    if (darkThemeSystemPreference !== undefined) {
      darkThemeSystemPreference?.removeEventListener?.(
        "change",
        handleSystemDarkThemePreferenceChange
      );
    }
  }

  function setTheme(themeId) {
    THEME_OWNER.dataset[THEME_STORAGE_KEY] = themeId;
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  }

  function createThemeToggle() {
    // Create the main container div
    const themeToggleContainer = document.createElement("div");
    themeToggleContainer.className = "theme-toggle";

    // Create radio buttons
    const darkRadio = createRadioButton(THEMES.DARK);
    const lightRadio = createRadioButton(THEMES.LIGHT);
    const violetRadio = createRadioButton(THEMES.VIOLET);

    // Create labels for radio buttons
    const darkLabel = createLabel(THEMES.DARK, "1");
    const lightLabel = createLabel(THEMES.LIGHT, "2");
    const violetLabel = createLabel(THEMES.VIOLET, "3");

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
  function createRadioButton(id) {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = id;
    radio.name = "theme";

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
})();
