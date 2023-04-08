/** Image gallery of clip art for inserting an image. */
const GLYPH_GALLERY = [
  { label: 'Tick', image: '/media/glyphs/tick.svg' },
  { label: 'Cross', image: '/media/glyphs/cross.svg' },
  { label: 'Blocked', image: '/media/glyphs/blocked.svg' },
  { label: 'Star', image: '/media/glyphs/star.svg' },
  { label: 'Heart', image: '/media/glyphs/heart.svg' },
  { label: 'Priority: High', image: '/media/glyphs/label-priority-high.svg' },
  { label: 'Priority: Medium', image: '/media/glyphs/label-priority-medium.svg' },
  { label: 'Priority: Low', image: '/media/glyphs/label-priority-low.svg' },
  { label: 'Priority: Must Have', image: '/media/glyphs/label-mscw-m.svg' },
  { label: 'Priority: Should Have', image: '/media/glyphs/label-mscw-s.svg' },
  { label: 'Priority: Could Have', image: '/media/glyphs/label-mscw-c.svg' },
  { label: 'Priority: Won\'t Have', image: '/media/glyphs/label-mscw-w.svg' },
  { label: 'Label: Will', image: '/media/glyphs/label-will.svg' },
  { label: 'Label: In progress', image: '/media/glyphs/label-in-progress.svg' },
  { label: 'Label: Testing', image: '/media/glyphs/label-testing.svg' },
  { label: 'Label: Purchasing', image: '/media/glyphs/label-purchasing.svg' },
  { label: 'Label: Purchased', image: '/media/glyphs/label-purchased.svg' },
  { label: 'Label: On hold', image: '/media/glyphs/label-on-hold.svg' },
  { label: 'Label: Not yet', image: '/media/glyphs/label-not-yet.svg' },
  { label: 'Label: Done', image: '/media/glyphs/label-done.svg' },
  { label: 'Label: Future', image: '/media/glyphs/label-future.svg' },
  { label: 'Completion: 0%', image: '/media/glyphs/percent-0.svg' },
  { label: 'Completion: 25%', image: '/media/glyphs/percent-1.svg' },
  { label: 'Completion: 50%', image: '/media/glyphs/percent-2.svg' },
  { label: 'Completion: 75%', image: '/media/glyphs/percent-3.svg' },
  { label: 'Completion: 100%', image: '/media/glyphs/percent-4.svg' },
  { label: 'Phase: 1', image: '/media/glyphs/label-phase-1.svg' },
  { label: 'Phase: 2', image: '/media/glyphs/label-phase-2.svg' },
  { label: 'Phase: 3', image: '/media/glyphs/label-phase-3.svg' },
  { label: 'Status: Green', image: '/media/glyphs/status-green.svg' },
  { label: 'Status: Yellow', image: '/media/glyphs/status-yellow.svg' },
  { label: 'Status: Red', image: '/media/glyphs/status-red.svg' },
  { label: 'Traffic Light: Green', image: '/media/glyphs/light-green.svg' },
  { label: 'Traffic Light: Yellow', image: '/media/glyphs/light-yellow.svg' },
  { label: 'Traffic Light: Red', image: '/media/glyphs/light-red.svg' },
  { label: 'Arrow: Up', image: '/media/glyphs/arrow-up.svg' },
  { label: 'Arrow: Down', image: '/media/glyphs/arrow-down.svg' },
  { label: 'Arrow: Left', image: '/media/glyphs/arrow-left.svg' },
  { label: 'Arrow: Right', image: '/media/glyphs/arrow-right.svg' },
];

/** Mouse button constants. */
const Mouse = {
  Button: {
    Left: 0,
    Middle: 1,
    Right: 2,
    Back: 3,
    Forward: 4,
  },
  Buttons: {
    Left: 1,
    Right: 2,
    Middle: 4,
    Back: 8,
    Forward: 16,
  },
  Which: {
    Left: 1,
    Middle: 2,
    Right: 3,
  },
};

/** User settings. */
const Settings = {
  Filters: {
    Brightness: 10,
    Contrast: 10,
    Hue: 0,
    Saturation: 10,
  },
  Highlight1: '',
  Highlight2: '',
  Highlight3: '',
  Highlight4: '',
  Highlight5: '',
  Highlight6: '',
  Highlight7: '',
  Highlight8: '',
  Highlight9: '',
  Highlight0: '',
  Menu: '',
  Theme: '',
  Zoom: '',
};

/** Storage name constants. */
const StoreName = {
  Flags: 'flags',
  Settings: 'settings',
  MatrixSelection: 'matrix-selection',
};

/** Is this running in Chrome on iOS? */
// const isIOSChrome = navigator.userAgent.includes('CriOS');

/** Is this running in Edge on iOS? */
// const isIOSEdge = navigator.userAgent.includes('EdgiOS');

/** Is this running on an iOS device? */
const isIOS = window.navigator.userAgent.includes('iPhone')
  || window.navigator.userAgent.includes('iPad')
  || window.navigator.userAgent.includes('iPod');

/** Callback to execute after Modal list item click. */
let modalListItemCallback;

/** Callback to execute after Modal button 1 press. */
let modalOption1Callback;

/** Callback to execute after Modal button 2 press. */
let modalOption2Callback;

/** Callback to execute after Modal button 3 press. */
let modalOption3Callback;

/** Is the modal dialog visible? */
let modalVisible = false;

/** Returns true if the modal dialog is currently visible. */
function isModalVisible() {
  return modalVisible;
}

/** Handle the modal button 1 click. */
function modalOption1Click(event) {
  document.getElementById('modal').style.display = 'none';
  modalVisible = false;
  if (modalOption1Callback) modalOption1Callback(event);
}

/** Handle the modal button 2 click. */
function modalOption2Click(event) {
  document.getElementById('modal').style.display = 'none';
  modalVisible = false;
  if (modalOption2Callback) modalOption2Callback(event);
}

/** Handle the modal button 3 click. */
function modalOption3Click(event) {
  document.getElementById('modal').style.display = 'none';
  modalVisible = false;
  if (modalOption3Callback) modalOption3Callback(event);
}

/** Handles clicking a modal dialog list item. */
function modalListItemClick(event) {
  document.getElementById('modal').style.display = 'none';
  modalVisible = false;
  if (modalListItemCallback) modalListItemCallback(event);
}

/** Handles pressing Enter inside the modal prompt text box. */
function modalInputKeyUpEvent(event) {
  if (event.key === 'Enter') {
    const button1 = document.getElementById('modal-button1');

    if (!button1 || button1.style.display === 'none') return;

    event.preventDefault();

    button1.click();
  } else if (event.key === 'Escape' || event.key === 'Esc') {
    const button3 = document.getElementById('modal-button3');

    if (!button3 || button3.style.display === 'none') return;

    event.preventDefault();

    button3.click();
  }
}

/** Set up the modal popup box. */
function setupModal() {
  const modal = document.createElement('div');
  modal.id = 'modal';
  document.body.appendChild(modal);

  const modalContent = document.createElement('div');
  modalContent.id = 'modal-content';
  modal.appendChild(modalContent);

  const modalText = document.createElement('p');
  modalText.id = 'modal-text';
  modalContent.appendChild(modalText);

  const modalInput = document.createElement('input');
  modalInput.id = 'modal-input';
  modalInput.type = 'text';
  modalInput.placeholder = 'Enter text here';
  modalContent.appendChild(modalInput);
  modalInput.addEventListener('keyup', modalInputKeyUpEvent);

  // const modalSelect = document.createElement('select');
  // modalSelect.id = 'modal-select';
  // modalContent.appendChild(modalSelect);

  const modalColourLabel = document.createElement('label');
  modalColourLabel.id = 'modal-colour-label';
  modalColourLabel.for = 'modal-colour';
  modalContent.appendChild(modalColourLabel);

  const modalColour = document.createElement('input');
  modalColour.type = 'color';
  modalColour.id = 'modal-colour';
  modalColour.title = 'Select colour';
  modalContent.appendChild(modalColour);

  const modalList = document.createElement('fieldset');
  modalList.id = 'modal-list';
  modalContent.appendChild(modalList);

  const modalButtons = document.createElement('div');
  modalButtons.id = 'modal-buttons';
  modalContent.appendChild(modalButtons);

  const modalButton1 = document.createElement('button');
  modalButton1.id = 'modal-button1';
  modalButton1.type = 'button';
  modalButton1.textContent = 'ERROR';
  modalButton1.addEventListener('click', modalOption1Click);
  modalButtons.appendChild(modalButton1);

  const modalButton2 = document.createElement('button');
  modalButton2.id = 'modal-button2';
  modalButton2.type = 'button';
  modalButton2.textContent = 'ERROR';
  modalButton2.addEventListener('click', modalOption2Click);
  modalButtons.appendChild(modalButton2);

  const modalButton3 = document.createElement('button');
  modalButton3.id = 'modal-button3';
  modalButton3.type = 'button';
  modalButton3.textContent = 'ERROR';
  modalButton3.addEventListener('click', modalOption3Click);
  modalButtons.appendChild(modalButton3);
}

/** Registers the service worker. */
function registerServiceWorker() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .addEventListener('controllerchange', () => window.location.reload());

    navigator.serviceWorker.register('/sw.min.js');
  }
}

/** Loads the default settings. */
function defaultSettings() {
  Settings.Highlight1 = '#CCCC00';
  Settings.Highlight2 = '#AA00CC';
  Settings.Highlight3 = '#00CCBB';
  Settings.Highlight4 = '#222222';

  Settings.Highlight5 = '#3BAF53';
  Settings.Highlight6 = '#4F73C2';
  Settings.Highlight7 = '#F20F19';
  Settings.Highlight8 = '#F79ACC';
  Settings.Highlight9 = '#808080';
  Settings.Highlight0 = '#F8C026';

  Settings.Menu = 'Open';
  Settings.Theme = 'System';
  Settings.Zoom = 'Fit';
}

/** Loads the settings from local storage. */
function loadSettings() {
  defaultSettings();

  const settingsJSON = localStorage.getItem(StoreName.Settings);
  if (settingsJSON) {
    const newSettings = JSON.parse(settingsJSON);
    if (newSettings) {
      if (newSettings.Filters) {
        if (newSettings.Filters.Brightness) {
          Settings.Filters.Brightness = newSettings.Filters.Brightness;
        }

        if (newSettings.Filters.Contrast) {
          Settings.Filters.Contrast = newSettings.Filters.Contrast;
        }

        if (newSettings.Filters.Hue) {
          Settings.Filters.Hue = newSettings.Filters.Hue;
        }

        if (newSettings.Filters.Saturation) {
          Settings.Filters.Saturation = newSettings.Filters.Saturation;
        }
      }

      if (newSettings.Highlight1) Settings.Highlight1 = newSettings.Highlight1;
      if (newSettings.Highlight2) Settings.Highlight2 = newSettings.Highlight2;
      if (newSettings.Highlight3) Settings.Highlight3 = newSettings.Highlight3;
      if (newSettings.Highlight4) Settings.Highlight4 = newSettings.Highlight4;
      if (newSettings.Highlight5) Settings.Highlight5 = newSettings.Highlight5;
      if (newSettings.Highlight6) Settings.Highlight6 = newSettings.Highlight6;
      if (newSettings.Highlight7) Settings.Highlight7 = newSettings.Highlight7;
      if (newSettings.Highlight8) Settings.Highlight8 = newSettings.Highlight8;
      if (newSettings.Highlight9) Settings.Highlight9 = newSettings.Highlight9;
      if (newSettings.Highlight0) Settings.Highlight0 = newSettings.Highlight0;

      if (newSettings.Menu) {
        Settings.Menu = newSettings.Menu;
      }

      if (newSettings.Theme) {
        Settings.Theme = newSettings.Theme;
      }

      if (newSettings.Zoom) {
        Settings.Zoom = newSettings.Zoom;
      }
    }
  }
}

/** Saves the settings to local storage. */
function saveSettings() {
  const settingsJSON = JSON.stringify(Settings);
  localStorage.setItem(StoreName.Settings, settingsJSON);
}

/** Sets the theme to Light, Dark, or follows the System. */
function setTheme(theme) {
  switch (theme.toLowerCase()) {
    case 'light': document.documentElement.className = 'theme-light'; break;
    case 'dark': document.documentElement.className = 'theme-dark'; break;
    case 'system':
    default:
      document.documentElement.className = window
        .matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'theme-dark' : 'theme-light';
      break;
  }
}

/** Theme Change event to track the System theme. */
function themeChange(event) {
  if (Settings.Theme.toLowerCase() === 'system') {
    document.documentElement.className = event.matches
      ? 'theme-dark' : 'theme-light';
  }
}

/** Adds the specified theme change listener. */
function addThemeListener(listener) {
  const matchMediaDark = window.matchMedia('(prefers-color-scheme: dark)');
  if ('addEventListener' in matchMediaDark) {
    matchMediaDark.addEventListener('change', listener);
  }
}

/** Downloads a given blob using the anchor tag click method. */
function downloadBlob(filename, blob) {
  const anchor = document.createElement('a');
  anchor.rel = 'noopener';
  anchor.download = filename;
  anchor.href = URL.createObjectURL(blob);

  setTimeout(() => URL.revokeObjectURL(anchor.href), 45000);

  anchor.click();
}

/** Converts SVG XML into a Data URL. */
function svgToDataUrl(svgXml) {
  // return `data:image/svg+xml;base64,${btoa(svgXml)}`;
  // return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgXml)}`;

  const data = svgXml
    .replace(/%/g, '%25') // Must be first or it will mangle subsequent %'s
    .replace(/"/g, '%22')
    .replace(/#/g, '%23')
    .replace(/'/g, '%27')
    .replace(/\n/g, '');

  return `data:image/svg+xml;charset=utf-8,${data}`;
}

/** Exports SVG XML as a PNG file download. */
function exportPng(filename, svgXml, width, height) {
  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d');

  const image = new Image();
  image.onload = function onload() {
    let exportWidth = (width ?? this.width) * 2;
    let exportHeight = (height ?? this.height) * 2;

    // Scale to an 8,192 x 8,192 maximum image size.
    if (exportWidth > 8192 || exportHeight > 8192) {
      const ratio = exportWidth / exportHeight;
      if (ratio > 1) {
        exportWidth = 8192;
        exportHeight = Math.round(8192 / ratio);
      } else {
        exportWidth = Math.round(8192 * ratio);
        exportHeight = 8192;
      }
    }

    canvas.width = exportWidth;
    canvas.height = exportHeight;

    if ('imageSmoothingQuality' in canvasContext) {
      canvasContext.imageSmoothingQuality = 'high';
    }

    if (isIOS) {
      // https://bugs.webkit.org/show_bug.cgi?id=39059
      setTimeout(() => {
        canvasContext.drawImage(this, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => downloadBlob(filename, blob));
      }, 100);
    } else {
      canvasContext.drawImage(this, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => downloadBlob(filename, blob));
    }
  };

  image.src = svgToDataUrl(svgXml);
}

/** Exports an SVG XML as an SVG file download. */
function exportSvg(filename, svgXml) {
  const blob = new Blob([svgXml], { type: 'image/svg+xml' });
  downloadBlob(filename, blob);
}

/** Exports a Feature Map as a JSON file download. */
function exportFM(filename, features) {
  const json = JSON.stringify(features);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(filename, blob);
}

/** Returns a new HTML Element created from the provided HTML. */
function createElementFromHtml(innerHtml) {
  const newElementParent = document.createElement('div');
  newElementParent.innerHTML = innerHtml;
  return newElementParent.firstChild;
}

/** Find the string between two other strings. */
function getStringBetween(source, from, open, close) {
  if (!source) return undefined;
  if (from === -1) return undefined;

  const start = source.indexOf(open, from);
  if (start === -1) return undefined;

  const end = source.indexOf(close, start);
  if (end === -1) return undefined;

  return source.substring(start + 1, end);
}

/** Get the filter CSS for the specified filter values. */
function getFiltersCss(brightness, contrast, hue, saturation) {
  const b = (brightness / 10.0).toFixed(1);
  const c = (contrast / 10.0).toFixed(1);
  const h = `${hue}deg`;
  const s = (saturation / 10.0).toFixed(1);

  return `brightness(${b}) contrast(${c}) hue-rotate(${h}) saturate(${s})`;
}

/** Takes the browser back one page or if there is no history, to home. */
function backOrHome() {
  if (window.history.length <= 1 || !document.referrer) {
    window.location.href = '/';
  } else {
    window.history.back();
  }
}

/** A custom modal diaglog with configurable input, 3 option buttons, and
 *  callbacks. */
function showModalDialog(
  messageHtml = 'ERROR',
  showInput = false,
  defaultInput = '',
  option1Name = '',
  option1Callback = undefined,
  option2Name = '',
  option2Callback = undefined,
  option3Name = '',
  option3Callback = undefined,
  listItems = undefined,
  listCallback = undefined,
  showColourPicker = false,
  colourPickerLabel = '',
  defaultColour = undefined,
) {
  // showDropDown = false,
  // dropDownItems = [],
  // selectedDropDownItem = undefined,

  modalOption1Callback = option1Callback;
  modalOption2Callback = option2Callback;
  modalOption3Callback = option3Callback;
  modalListItemCallback = listCallback;

  document.getElementById('modal-text').innerHTML = messageHtml;

  const modalInput = document.getElementById('modal-input');
  modalInput.value = defaultInput;
  modalInput.style.display = showInput ? 'inline-block' : 'none';

  const modalList = document.getElementById('modal-list');
  while (modalList.lastChild) {
    modalList.removeChild(modalList.lastChild);
  }

  if (listItems) {
    listItems.forEach((item) => {
      const listItem = document.createElement('div');
      listItem.className = 'modal-list-item';
      modalList.appendChild(listItem);
      listItem.addEventListener('click', modalListItemClick);

      if (item.id) {
        listItem.dataset.id = item.id;
      }

      if (item.image) {
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.label;
        listItem.appendChild(image);
        listItem.dataset.image = item.image;
      }

      const label = document.createElement('span');
      label.textContent = item.label;
      listItem.appendChild(label);

      if (item.tooltip) {
        label.title = item.tooltip;
      }
    });
    modalList.style.display = '';
  } else {
    modalList.style.display = 'none';
  }

  // const modalSelect = document.getElementById('modal-select');
  // while (modalSelect.lastChild)
  //   modalSelect.removeChild(modalSelect.lastChild);

  // if (showDropDown) {
  //   for (const item of dropDownItems) {
  //     const option = document.createElement('option');
  //     option.value = item;
  //     option.textContent = item;
  //     if (item.toUpperCase() === selectedDropDownItem.toUpperCase()) {
  //       option.selected = true;
  //     }
  //     modalSelect.appendChild(option);
  //   }
  // }
  // modalSelect.style.display = showDropDown ? 'inline-block' : 'none';

  const modalColourLabel = document.getElementById('modal-colour-label');
  const modalColour = document.getElementById('modal-colour');
  if (showColourPicker) {
    modalColourLabel.textContent = colourPickerLabel;
    modalColour.value = defaultColour || 'Red';
  }
  modalColourLabel.style.display = showColourPicker ? 'inline-block' : 'none';
  modalColour.style.display = showColourPicker ? 'inline-block' : 'none';

  const modalOption1 = document.getElementById('modal-button1');
  modalOption1.textContent = option1Name;
  modalOption1.style.display = option1Name ? 'inline-block' : 'none';

  const modalOption2 = document.getElementById('modal-button2');
  modalOption2.textContent = option2Name;
  modalOption2.style.display = option2Name ? 'inline-block' : 'none';

  const modalOption3 = document.getElementById('modal-button3');
  modalOption3.textContent = option3Name;
  modalOption3.style.display = option3Name ? 'inline-block' : 'none';

  document.getElementById('modal').style.display = 'block';
  modalVisible = true;

  if (!showInput && option1Name && !option2Name && !option3Name) {
    document.activeElement.blur();
    modalOption1.focus();
  }

  if (showInput) {
    document.activeElement.blur();
    modalInput.focus();
  }
}

/** Get the Modal dialog's input field text. */
function getModalInputText() {
  return document.getElementById('modal-input').value;
}

/** Get the Modal dialog's drop down select value. */
// function getModalOptionValue() {
//   const modalSelect = document.getElementById('modal-select');
//   if (modalSelect.selectedIndex !== -1) {
//     const selected = modalSelect.options[modalSelect.selectedIndex];
//     return selected.value;
//   }

//   return undefined;
// }

/** Get the Modal dialog's selected colour. */
function getModalColourValue() {
  return document.getElementById('modal-colour').value;
}

/** Returns the hex string value for any colour by hex, rgb, rgba, or name. */
function getHexForColour(colour) {
  const canvasContext = document.createElement('canvas').getContext('2d');
  canvasContext.fillStyle = colour;
  return canvasContext.fillStyle;
}

/** Used by Array.sort to sort integers. */
function sortIntegers(a, b) {
  return parseInt(a, 10) - parseInt(b, 10);
}

/** Detect if the site is embedded in a frame, such as Microsoft Teams App. */
function isEmbedded() {
  try {
    return (window.self !== window.top);
  } catch {
    return true;
  }
}

/** Common initialisation actions for every page of the site. */
registerServiceWorker();
loadSettings();
setTheme(Settings.Theme);
addThemeListener(themeChange);

export {
  GLYPH_GALLERY, isIOS, Mouse, Settings, StoreName,
  backOrHome, createElementFromHtml, defaultSettings, downloadBlob, exportFM,
  exportPng, exportSvg, getFiltersCss, getHexForColour, getModalColourValue,
  getModalInputText, getStringBetween, isEmbedded, isModalVisible, saveSettings,
  setTheme, setupModal, showModalDialog, sortIntegers, svgToDataUrl,
};
