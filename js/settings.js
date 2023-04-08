import {
  Settings, backOrHome, defaultSettings, isEmbedded, saveSettings,
  showModalDialog, setTheme, setupModal,
} from './common.js';

/** Save click event to commit changes. */
function saveClick() {
  Settings.Highlight1 = document.getElementById('highlight1').value;
  Settings.Highlight2 = document.getElementById('highlight2').value;
  Settings.Highlight3 = document.getElementById('highlight3').value;
  Settings.Highlight4 = document.getElementById('highlight4').value;
  Settings.Highlight5 = document.getElementById('highlight5').value;
  Settings.Highlight6 = document.getElementById('highlight6').value;
  Settings.Highlight7 = document.getElementById('highlight7').value;
  Settings.Highlight8 = document.getElementById('highlight8').value;
  Settings.Highlight9 = document.getElementById('highlight9').value;
  Settings.Highlight0 = document.getElementById('highlight0').value;
  Settings.Menu = document.getElementById('menu-state').value;
  Settings.Theme = document.getElementById('theme').value;
  Settings.Zoom = document.getElementById('zoom').value;

  saveSettings();

  if (isEmbedded()) {
    showModalDialog('Settings saved.', false, undefined, 'OK');
  } else {
    backOrHome();
  }
}

/** Set the selected option by the supplied label
 *  @returns true if option found and selected, otherwise false. */
function selectByLabel(select, label) {
  for (let index = 0; index < select.options.length; index += 1) {
    const option = select.options[index];
    if (option.label === label) {
      option.selected = true;
      return true;
    }
  }

  return false;
}

/** Applies the Settings values to the controls on the page. */
function setControlValues() {
  document.getElementById('highlight1').value = Settings.Highlight1;
  document.getElementById('highlight2').value = Settings.Highlight2;
  document.getElementById('highlight3').value = Settings.Highlight3;
  document.getElementById('highlight4').value = Settings.Highlight4;
  document.getElementById('highlight5').value = Settings.Highlight5;
  document.getElementById('highlight6').value = Settings.Highlight6;
  document.getElementById('highlight7').value = Settings.Highlight7;
  document.getElementById('highlight8').value = Settings.Highlight8;
  document.getElementById('highlight9').value = Settings.Highlight9;
  document.getElementById('highlight0').value = Settings.Highlight0;

  selectByLabel(document.getElementById('menu-state'), Settings.Menu);
  selectByLabel(document.getElementById('zoom'), Settings.Zoom);
  selectByLabel(document.getElementById('theme'), Settings.Theme);
}

/** Defaults click event to apply the default settings. */
function defaultsClick() {
  defaultSettings();
  setControlValues();
  setTheme(document.getElementById('theme').value);
}

/** Attaches event listeners to the settings controls. */
function setupEventListeners() {
  document.getElementById('defaults').addEventListener('click', defaultsClick);
  document.getElementById('save').addEventListener('click', saveClick);
  document.getElementById('cancel').addEventListener('click', backOrHome);
  document.getElementById('theme')
    .addEventListener('change', (event) => setTheme(event.target.value));
}

/** DOM Content Loaded event handler. */
function DOMContentLoaded() {
  if (isEmbedded()) {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('cancel').style.display = 'none';
  }

  setupModal();
  setControlValues();
  setupEventListeners();
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded);
