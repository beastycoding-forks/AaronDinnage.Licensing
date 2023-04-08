import {
  StoreName, isEmbedded, setupModal, showModalDialog, sortIntegers,
} from './common.js';

/** Get the values of the selected checkboxes. */
function getSelectedCheckboxes() {
  const values = [];

  document.querySelectorAll('input[type="checkbox"]:checked')
    .forEach((checkbox) => values.push(checkbox.value));

  return values;
}

/** Click event handler for Compare button. */
function compareClick() {
  const checkboxes = getSelectedCheckboxes();
  if (checkboxes.length === 2) {
    window.location.href = `/comparing.htm#${checkboxes.join('/')}`;
  } else {
    showModalDialog(
      'You must select two diagrams to compare.',
      false,
      undefined,
      'OK',
    );
  }
}

/** Disable all the checkboxes that are not currently checked. */
function disableUncheckedBoxes() {
  document.querySelectorAll('input[type="checkbox"]:not(:checked):not(:disabled)')
    .forEach((checkbox) => {
      checkbox.disabled = true;
      checkbox.parentElement.classList.add('disabled');
    });
}

/** Enable all the checkboxes that are not currently checked. */
function enableUncheckedBoxes() {
  document.querySelectorAll('input[type="checkbox"]:not(:checked):disabled')
    .forEach((checkbox) => {
      checkbox.disabled = false;
      checkbox.parentElement.classList.remove('disabled');
    });
}

/** Event handled for checkbox state changes. */
function checkboxChanged() {
  const checkboxes = getSelectedCheckboxes();
  if (checkboxes.length === 2) {
    disableUncheckedBoxes();
  } else {
    enableUncheckedBoxes();
  }
}

/** Add a saved diagram to the list. */
function addDiagram(container, key, entry) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = `*${key}`;

  const label = document.createElement('label');
  label.appendChild(checkbox);
  label.append(entry.Title);

  const createdDate = new Date(Number.parseInt(key, 10));
  label.title = `Created: ${createdDate.toLocaleString()}`;

  container.appendChild(label);
}

/** Adds the saved diagrams to the bottom of the diagram list. */
function addSavedDiagrams() {
  const container = document.getElementById('saved-diagrams');

  const keys = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key !== StoreName.Flags
      && key !== StoreName.Settings
      && key !== StoreName.MatrixSelection
      && !key.startsWith('$')) {
      keys.push(key);
    }
  }

  if (keys.length === 0) {
    container.append('There are no saved diagrams.');
  } else {
    keys.sort(sortIntegers).forEach((key) => {
      const entryJSON = localStorage.getItem(key);
      if (entryJSON) {
        const entry = JSON.parse(entryJSON);
        if (entry) {
          addDiagram(container, key, entry);
        }
      }
    });
  }
}

/** Attaches event listeners to all checkboxes. */
function setupCheckboxes() {
  document.querySelectorAll('input[type="checkbox"]')
    .forEach((checkbox) => checkbox.addEventListener('change', checkboxChanged));
}

/** DOM Content Loaded event handler. */
function DOMContentLoaded() {
  if (isEmbedded()) {
    document.getElementById('menu').style.display = 'none';
  }

  setupModal();
  addSavedDiagrams();
  setupCheckboxes();

  document.getElementById('button-compare')
    .addEventListener('click', compareClick);
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded);
