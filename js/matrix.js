import {
  GLYPH_GALLERY, Settings, StoreName, downloadBlob, getModalInputText,
  isEmbedded, setupModal, showModalDialog, sortIntegers,
} from './common.js';

/** Page Data. */
const FeatureMap = {
  Active: false,
  Clipboard: undefined,
  HasEdits: false,
  Key: undefined,
  Target: undefined,
  Title: undefined,
};
let TriggerSearch = false;

// Constants
const DIAGRAM_COUNT = 21;
const DIAGRAM_GROUPS = [3, 3, 5, 4, 6];
const EXPORT_FILENAME = 'Microsoft-365-Matrix-Export.xls';
const FEATURE_MAP_ORDER = ['highlight', 'glyph', 'link', 'notes'];

/** Toggle the Trigger Search variable when a Key Up event occurs. */
function searchKeyUp() {
  TriggerSearch = true;
}

/** Update the row visibility based on search text. */
function applySearch() {
  const search = document.getElementById('feature-search').value.toLowerCase();

  let inGroup = false;

  document.querySelectorAll('tr').forEach((row) => {
    // Detect header row by partial match of on of the sticky-row-x classes.
    const isHeaderRow = (row.className.indexOf('sticky-row') !== -1);
    if (isHeaderRow) {
      inGroup = false;
    } else {
      const cell = row.querySelector('td');
      if (cell) {
        // Find the end of the current group match
        if (inGroup && cell.className.indexOf('indent') === -1) {
          inGroup = false;
        }

        const featureName = cell.textContent || cell.innerText;
        if (featureName.toLowerCase().includes(search) || inGroup) {
          row.classList.remove('hidden');

          // If the match is on a group header keep the features under this
          // group visible
          if (cell.className.indexOf('group') !== -1) {
            inGroup = true;
          }
        } else {
          row.classList.add('hidden');
        }
      }
    }
  });
}

/** Timer periodically fires to update the row visibility in response to
 * search text changes. */
function searchTimer() {
  if (TriggerSearch) {
    TriggerSearch = false;
    applySearch();
  }
}

/** Set up the feature search box and action functions. */
function setupFeatureSearch() {
  document.getElementById('feature-search')
    .addEventListener('keyup', searchKeyUp);
}

/** Count the selected columns within the given group. This is used to
 * determine license type header visibility when filtering columns. */
function countInGroup(group, selected) {
  let count = 0;
  let start = 0;

  for (let i = 0; i < DIAGRAM_GROUPS.length; i += 1) {
    if (i === group) {
      const end = start + DIAGRAM_GROUPS[i];
      for (let selectedIndex = start; selectedIndex < end; selectedIndex += 1) {
        if (selected[selectedIndex] === '1') {
          count += 1;
        }
      }
      return count;
    }

    start += DIAGRAM_GROUPS[i];
  }

  return -1;
}

/** Get an array of booleans represented the state of each checkbox. */
function getCheckboxSelections() {
  const hash = [];

  document.querySelectorAll('input[type=checkbox]')
    .forEach((checkbox) => hash.push(checkbox.checked ? '1' : '0'));

  if (hash.every((value) => value === '1')) {
    return undefined;
  }

  return hash.join('');
}

/** Set the checked status of each checkbox based on an array of booleans. */
function setCheckboxSelections(selected) {
  let index = 0;
  document.querySelectorAll('input[type=checkbox]').forEach((checkbox) => {
    checkbox.checked = (selected[index] === '1');
    index += 1;
  });
}

/** Show only the selected feature columns based on the array of booleans.
 * Hide any rows that no longer have a visible feature. */
function showColumns(selected) {
  const rows = document.getElementsByTagName('tr');
  for (let row = 0; row < rows.length; row += 1) {
    const tr = rows[row];

    let emptyRow = false;
    let cells = null;

    if (row === 0) {
      cells = tr.getElementsByTagName('th');

      for (let col = 2; col < cells.length; col += 1) {
        const cell = cells[col];

        const count = countInGroup(col - 2, selected);
        if (count > 0) {
          cell.classList.remove('hidden');
        } else {
          cell.classList.add('hidden');
        }
        cell.setAttribute('colspan', count);
      }
    } else {
      const isGroupHeaderRow = (tr.className.indexOf('sticky-row-3') !== -1);

      if (row === 1 || isGroupHeaderRow) {
        cells = tr.getElementsByTagName('th');
      } else {
        cells = tr.getElementsByTagName('td');
        // Only look for empty feature rows (denoted by the use of TD tags).
        // If none selected then don't hide any rows.
        emptyRow = (selected.indexOf('1') !== -1);
      }

      if (isGroupHeaderRow) emptyRow = false;

      for (let col = 2; col < cells.length; col += 1) {
        const cell = cells[col];

        if (selected[col - 2] === '1') {
          cell.classList.remove('hidden');

          if (cell.textContent !== '') {
            emptyRow = false;
          }
        } else {
          cell.classList.add('hidden');
        }
      }

      if (emptyRow) {
        tr.classList.add('hidden');
      } else {
        tr.classList.remove('hidden');
      }
    }
  }

  if (document.getElementById('feature-search').value) {
    applySearch();
  }
}

/** Updates the page location hash with FeatureMap and Selected checkboxes. */
function updateHash(featureMap, selected) {
  const hash = [];

  if (featureMap) {
    hash.push(`$${featureMap}`);
  }

  if (selected) {
    hash.push(selected);
  }

  const newHash = hash.join('/');
  if (window.location.hash !== `#${newHash}`) {
    window.location.hash = newHash;
  }
}

/** Listen for checboxes changing state. */
function checkboxChanged() {
  updateHash(FeatureMap.Key, getCheckboxSelections());
}

/** Add event listeners to all checkboxes. */
function setupCheckboxes() {
  document.querySelectorAll('input[type=checkbox]')
    .forEach((checkbox) => checkbox.addEventListener('change', checkboxChanged));
}

/** Select all checkboxes. */
function selectAll() {
  updateHash(FeatureMap.Key, '1'.repeat(DIAGRAM_COUNT));
}

/** Remove all selected checkboxes. */
function selectNone() {
  updateHash(FeatureMap.Key, '0'.repeat(DIAGRAM_COUNT));
}

/** Save the current selection for default page load use. */
function selectSave() {
  const selected = getCheckboxSelections();
  if (selected) {
    localStorage.setItem(StoreName.MatrixSelection, selected);
  } else {
    localStorage.removeItem(StoreName.MatrixSelection);
  }

  showModalDialog(
    'Selection saved.<br/><br/>When you return your selection will be applied automatically.',
    false,
    undefined,
    'OK',
  );
}

/** Trigger the XLSX download. */
function downloadClick() {
  document.getElementById('download-xlsx').click();
}

/** Generates and downloads a spreadsheet from the current matrix view. */
function exportClick() {
  const table = document.getElementById('features-table').cloneNode(true);

  // Remove search text box from export
  const filter = table.querySelector('#feature-search');
  if (filter.value !== '') {
    filter.parentNode.innerText = `Feature filter: ${filter.value}`;
  } else {
    filter.remove();
  }

  // Remove all hidden cells
  table.querySelectorAll('.hidden').forEach((item) => item.remove());

  // Remove all buttons
  table.querySelectorAll('button').forEach((item) => item.remove());

  // Set the background colour of any row with a colour selector present,
  // and remove the colour selector
  table.querySelectorAll('input[data-item="highlight"]').forEach((item) => {
    item.parentNode.style.backgroundColor = item.value;
    item.remove();
  });

  // Replace drop down lists with their selected value
  table.querySelectorAll('select').forEach((item) => {
    if (item.selectedIndex !== -1) {
      const option = item.options[item.selectedIndex];
      const text = document.createTextNode(`Image: ${option.text}`);
      item.parentNode.appendChild(text);
      item.parentNode.appendChild(document.createElement('br'));
    }
    item.remove();
  });

  // Replace all inputs with data-item of link with a link
  table.querySelectorAll('input[data-item="link"]').forEach((item) => {
    if (item.value) {
      const aTag = document.createElement('a');
      aTag.href = item.value;
      aTag.innerText = 'Link';
      item.parentNode.appendChild(aTag);
    } else {
      const text = document.createTextNode('Empty link');
      item.parentNode.appendChild(text);
    }
    item.parentNode.appendChild(document.createElement('br'));
    item.remove();
  });

  // Replace all input elements with data-item of notes with the notes text
  table.querySelectorAll('input[data-item="notes"]').forEach((item) => {
    const text = document.createTextNode(item.value || 'No notes');
    item.parentNode.appendChild(text);
    item.parentNode.appendChild(document.createElement('br'));
    item.remove();
  });

  // Fix indents
  table.querySelectorAll('.indent1').forEach((item) => {
    item.insertAdjacentText('afterBegin', '> ');
  });
  table.querySelectorAll('.indent2').forEach((item) => {
    item.insertAdjacentText('afterBegin', '> > ');
  });

  // Centre align feature columns
  table.querySelectorAll('td:not(:first-of-type)').forEach((item) => {
    item.style.textAlign = 'center';
  });

  // Left align first column
  table.querySelectorAll('th:first-of-type, td:first-of-type').forEach((item) => {
    item.style.textAlign = 'left';
  });

  // Top align text in all table cells
  table.querySelectorAll('th, td').forEach((item) => {
    item.style.verticalAlign = 'top';
  });

  // Colour the office, ems, windows, and suite section headers
  table.querySelectorAll('.office>th, .office>td').forEach((item) => {
    item.style.backgroundColor = '#E82200';
    item.style.color = '#FFFFFF';
  });
  table.querySelectorAll('.ems>th, .ems>td').forEach((item) => {
    item.style.backgroundColor = '#2080A0';
    item.style.color = '#FFFFFF';
  });
  table.querySelectorAll('.windows>th, .windows>td').forEach((item) => {
    item.style.backgroundColor = '#006600';
    item.style.color = '#FFFFFF';
  });
  table.querySelectorAll('.suite>th, .suite>td').forEach((item) => {
    item.style.backgroundColor = '#7030A0';
    item.style.color = '#FFFFFF';
  });

  const html = [
    '<html><head><base href="https://m365maps.com/"></head><body>',
    table.outerHTML,
    '</body></html>',
  ].join('');

  const blob = new Blob(['\ufeff', html], {
    type: 'application/vnd.ms-excel',
  });

  downloadBlob(EXPORT_FILENAME, blob);
}

/** Sets the FeatureMap.HasEdits flag based on the state variable and updates
 * the document.title. */
function hasEdits(state) {
  if (!FeatureMap.HasEdits && state) {
    FeatureMap.HasEdits = true;

    document.title += ' *';
  } else if (FeatureMap.HasEdits && !state) {
    FeatureMap.HasEdits = false;

    if (document.title.endsWith(' *')) {
      document.title = document.title.slice(0, -2);
    }
  }
}

/** Updates the Feature Map Menu items based on whether the mode is Active. */
function updateFeatureMapMenu() {
  const mapNew = document.getElementById('map-new');
  const mapLoad = document.getElementById('map-load');
  const mapSave = document.getElementById('map-save');
  const mapClose = document.getElementById('map-close');

  if (FeatureMap.Active) {
    mapNew.disabled = true;
    mapLoad.disabled = true;
    mapSave.disabled = false;
    mapClose.disabled = false;
  } else {
    mapNew.disabled = false;
    // TODO: Don't enable the button if there are no saved feature maps
    mapLoad.disabled = false;
    mapSave.disabled = true;
    mapClose.disabled = true;
  }
}

/** Returns a Feature Map data entry from a given feature map table cell. */
function getDataFromCell(mapCell) {
  const data = {
    Feature: mapCell.parentNode.dataset.feature,
    Glyph: undefined,
    // Glyph: {
    //   Label: undefined,
    //   Align: undefined,
    // },
    Highlight: undefined,
    Link: undefined,
    Notes: undefined,
  };

  let hasData = false;

  const highlightItem = mapCell.querySelector('[data-item="highlight"]');
  if (highlightItem) {
    data.Highlight = highlightItem.value;
    hasData = true;
  }

  const linkItem = mapCell.querySelector('[data-item="link"]');
  if (linkItem) {
    data.Link = linkItem.value;
    hasData = true;
  }

  const notesItem = mapCell.querySelector('[data-item="notes"]');
  if (notesItem) {
    data.Notes = notesItem.value;
    hasData = true;
  }

  // TODO: Add Alignment selection
  const glyphItem = mapCell.querySelector('[data-item="glyph"]');
  if (glyphItem) {
    data.Glyph = { Label: glyphItem.value, Align: 'top left' };
    hasData = true;
  }

  return hasData ? data : undefined;
}

/** Save the current Feature Map. */
function saveFeatureMap() {
  const data = {
    Title: FeatureMap.Title,
    Features: [],
  };

  document.querySelectorAll('tbody>tr>td.map').forEach((cell) => {
    const entry = getDataFromCell(cell);
    if (entry) data.Features.push(entry);
  });

  const jsonData = JSON.stringify(data);
  localStorage.setItem(`$${FeatureMap.Key}`, jsonData);

  hasEdits(false);
  updateFeatureMapMenu();
  updateHash(FeatureMap.Key, getCheckboxSelections());
}

/** Handle the OK outcome on the Save Modal Prompt. */
function saveOK(callback) {
  let title = getModalInputText();
  if (title) title = title.trim();
  if (title) {
    FeatureMap.Key = Date.now().toString();
    FeatureMap.Title = title;
    saveFeatureMap();

    if (callback) {
      callback();
    }
  }
}

/** Handles the Yes outcome on the Overwrite Modal Confirm. */
function overwriteYes(callback) {
  saveFeatureMap();
  if (callback) callback();
}

/** Handles the No outcome on the Overwrite Modal Confirm. */
function overwriteNo(okCallback, cancelCallback) {
  showModalDialog(
    'Save feature map as',
    true,
    FeatureMap.Title,
    'OK',
    () => saveOK(okCallback),
    undefined,
    undefined,
    'Cancel',
    cancelCallback,
  );
}

/** Prompt the user to save the current Feature Map. */
function requestSave(yesCallback) {
  if (FeatureMap.Key) {
    showModalDialog(
      `Overwrite existing feature map "${FeatureMap.Title}"?`,
      false,
      undefined,
      'Yes',
      () => overwriteYes(yesCallback),
      'No',
      () => overwriteNo(yesCallback),
      'Cancel',
      undefined,
    );
  } else {
    showModalDialog(
      'Save feature map as',
      true,
      '',
      'OK',
      () => saveOK(yesCallback),
      undefined,
      undefined,
      'Cancel',
      undefined,
    );
  }
}

/** Shows the popup actions menu. */
function showPopup(popup, x, y) {
  // Move the popup off-screen and show it, this will allow us to get the dimensions
  popup.style.left = '-1000px';
  popup.style.top = '-1000px';
  popup.classList.remove('hidden');

  const maxX = document.documentElement.clientWidth - popup.offsetWidth;
  const maxY = document.documentElement.clientHeight - popup.offsetHeight;

  const xLoc = Math.max(0, Math.min(x + 4, maxX));
  const yLoc = Math.max(0, Math.min(y + 4, maxY));

  popup.style.left = `${xLoc}px`;
  popup.style.top = `${yLoc}px`;
}

/** Handles the Add All button click event. Shows the actions popup. */
function mapAddAllClick(event) {
  FeatureMap.Target = undefined;

  document.activeElement.blur();

  document.getElementById('action-paste').disabled = !FeatureMap.Clipboard;
  document.getElementById('extra-actions').classList
    .add('hidden');

  const mapPopup = document.getElementById('map-popup');

  mapPopup.querySelectorAll('button[data-item]').forEach((button) => {
    button.className = 'add';
    button.title = `Add ${button.dataset.item} to rows`;
    button.dataset.scope = 'all';
  });

  showPopup(mapPopup, event.clientX, event.clientY);
  mapPopup.children.item(0).focus();
}

/** Handles the Remove All button click event. Shows the actions popup. */
function mapRemoveAllClick(event) {
  FeatureMap.Target = undefined;

  document.activeElement.blur();

  document.getElementById('action-paste').disabled = !FeatureMap.Clipboard;
  document.getElementById('extra-actions').classList
    .add('hidden');

  const mapPopup = document.getElementById('map-popup');

  mapPopup.querySelectorAll('button[data-item]').forEach((button) => {
    button.className = 'remove';
    button.title = `Remove ${button.dataset.item} from rows`;
    button.dataset.scope = 'all';
  });

  showPopup(mapPopup, event.clientX, event.clientY);
  mapPopup.children.item(0).focus();
}

/** Handles the click of a Feature Map menu button. */
function mapMenuClick(event) {
  FeatureMap.Target = event.target.parentNode;

  document.activeElement.blur();

  document.getElementById('action-paste').disabled = !FeatureMap.Clipboard;
  document.getElementById('extra-actions').classList
    .remove('hidden');

  const mapPopup = document.getElementById('map-popup');

  mapPopup.querySelectorAll('button[data-item]').forEach((button) => {
    const existing = button.dataset.item === 'all' ?
      event.target.parentNode.querySelectorAll('[data-item]').length > 2 :
      event.target.parentNode.querySelector(`[data-item='${button.dataset.item}'`);
    button.className = existing ? 'remove' : 'add';
    button.title = `${existing ? 'Remove' : 'Add'} ${button.dataset.item}`;
    button.dataset.scope = 'one';
  });

  showPopup(mapPopup, event.clientX, event.clientY);
  mapPopup.children.item(0).focus();
}

/** Reset all Feature Map Row Controls based on the  */
function resetFeatureMapRowContols(visible) {
  document.querySelectorAll('thead>tr>.map').forEach((header) => {
    if (visible) {
      header.classList.remove('hidden');
    } else {
      header.classList.add('hidden');
    }
  });

  document.querySelectorAll('tbody>tr>.map').forEach((cell) => {
    if (visible) {
      cell.classList.remove('hidden');

      if (cell.tagName.toLowerCase() === 'td') {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('map-menu', 'menu-button');
        button.addEventListener('click', mapMenuClick);
        cell.appendChild(button);
      }
    } else {
      cell.classList.add('hidden');

      if (cell.tagName.toLowerCase() === 'td') {
        const button = cell.querySelector('button.map-menu');
        if (button) {
          button.remove();
        }
      }
    }

    cell.querySelectorAll('[data-item]').forEach((dataItem) => {
      dataItem.remove();
    });
  });
}

/** Applies a prset colour to the current highlight colour selector. */
function highlightKeyUp(event) {
  switch (event.key) {
    case '1': event.target.value = Settings.Highlight1; hasEdits(true); break;
    case '2': event.target.value = Settings.Highlight2; hasEdits(true); break;
    case '3': event.target.value = Settings.Highlight3; hasEdits(true); break;
    case '4': event.target.value = Settings.Highlight4; hasEdits(true); break;
    case '5': event.target.value = Settings.Highlight5; hasEdits(true); break;
    case '6': event.target.value = Settings.Highlight6; hasEdits(true); break;
    case '7': event.target.value = Settings.Highlight7; hasEdits(true); break;
    case '8': event.target.value = Settings.Highlight8; hasEdits(true); break;
    case '9': event.target.value = Settings.Highlight9; hasEdits(true); break;
    case '0': event.target.value = Settings.Highlight0; hasEdits(true); break;
    default: break;
  }
}

/** Handles value change events on Feature Map controls to set HasEdits true. */
function elementChanged() {
  hasEdits(true);
}

/** Creates a highlight input item. */
function createHighlightElement() {
  const element = document.createElement('input');
  element.dataset.item = 'highlight';
  element.type = 'color';
  element.title = 'Apply a highlight';
  element.value = Settings.Highlight1;
  element.addEventListener('keyup', highlightKeyUp);
  element.addEventListener('change', elementChanged);
  return element;
}

/** Creates an image select item. */
function createImageElement() {
  const element = document.createElement('select');
  element.dataset.item = 'glyph';
  element.title = 'Select an image';
  element.addEventListener('change', elementChanged);

  GLYPH_GALLERY.forEach((glyph) => {
    const option = document.createElement('option');
    option.value = glyph.label;
    option.text = glyph.label;
    element.appendChild(option);
  });

  // <select data-item="glyph-align" title="Image alignment">
  // <option>Top Left</option>
  // <option>Top Centre</option>
  // <option>Top Right</option>
  // <option>Middle Left</option>
  // <option>Middle Centre</option>
  // <option>Middle Right</option>
  // <option>Bottom Left</option>
  // <option>Bottom Centre</option>
  // <option>Bottom Right</option>
  // </select>

  return element;
}

/** Creates a link text input item. */
function createLinkElement() {
  const element = document.createElement('input');
  element.dataset.item = 'link';
  element.type = 'text';
  element.placeholder = 'Link';
  element.title = 'Update link URL';
  element.addEventListener('change', elementChanged);
  return element;
}

/** Creates a note text input item. */
function createNotesElement() {
  const element = document.createElement('input');
  element.dataset.item = 'notes';
  element.type = 'text';
  element.placeholder = 'Notes';
  element.title = 'Update notes';
  element.addEventListener('change', elementChanged);
  return element;
}

/** Insert the provided Feature Map control into the parent node, in the correct
 * position order based on the FEATURE_MAP_ORDER constant array. */
function insertFeatureMapControl(parent, element) {
  const position = FEATURE_MAP_ORDER
    .findIndex(x => x === element.dataset.item.toLowerCase());

  let inserted = false;
  for (let i = 0; i < parent.children.length; i += 1) {
    const sibling = parent.children[i];
    if (sibling.dataset.item) {
      const sibPos = FEATURE_MAP_ORDER
        .findIndex(x => x === sibling.dataset.item.toLowerCase());

      if (sibPos > position) {
        parent.insertBefore(element, sibling);
        inserted = true;
        break;
      }
    }
  }

  if (!inserted) {
    parent.appendChild(element);
  }
}

/** Removes a control based on the provided data item.  */
function removeControl(cell, dataItem) {
  const control = cell.querySelector(`[data-item="${dataItem}"]`);
  if (control) {
    control.remove();
  }
}

/** Sets the feature map elements for a given cell and feature. Clear flag
 * determines whether to clear existing elements. */
function setFeatureMapCell(cell, feature, clear) {
  if (feature && feature.Highlight !== undefined) {
    let control = cell.querySelector('[data-item="highlight"]');
    if (!control) {
      control = createHighlightElement();
      insertFeatureMapControl(cell, control);
    }
    control.value = feature.Highlight;
  } else if (clear) {
    removeControl(cell, 'highlight');
  }

  if (feature && feature.Link !== undefined) {
    let control = cell.querySelector('[data-item="link"]');
    if (!control) {
      control = createLinkElement();
      insertFeatureMapControl(cell, control);
    }
    control.value = feature.Link;
  } else if (clear) {
    removeControl(cell, 'link');
  }

  if (feature && feature.Notes !== undefined) {
    let control = cell.querySelector('[data-item="notes"]');
    if (!control) {
      control = createNotesElement();
      insertFeatureMapControl(cell, control);
    }
    control.value = feature.Notes;
  } else if (clear) {
    removeControl(cell, 'notes');
  }

  if (feature && feature.Glyph !== undefined) {
    let control = cell.querySelector('[data-item="glyph"]');
    if (!control) {
      control = createImageElement();
      insertFeatureMapControl(cell, control);
    }
    control.value = feature.Glyph.Label;
  } else if (clear) {
    removeControl(cell, 'glyph');
  }
}

/** Set the Feature Map controls on each feature row specified in the supplied
 * Feature Map data object. */
function setFeatureMapRows(features) {
  features.forEach((feature) => {
    const row = document
      .querySelector(`tbody>tr[data-feature='${feature.Feature}'`);
    if (row) {
      const cell = row.querySelector('td.map');
      setFeatureMapCell(cell, feature, false);
    }
  });
}

/** Start a new Feature Map. */
function newFeatureMap() {
  FeatureMap.Active = true;
  FeatureMap.Key = undefined;
  FeatureMap.Title = undefined;

  hasEdits(false);
  updateFeatureMapMenu();
  resetFeatureMapRowContols(true);
}

/** Enter Feature Map mode. */
function mapNewClick() {
  if (FeatureMap.HasEdits) {
    showModalDialog(
      'Would you like to save your changes before creating a new feature map?',
      false,
      undefined,
      'Yes',
      () => requestSave(newFeatureMap),
      'No',
      newFeatureMap,
      'Cancel',
      undefined,
    );
  } else {
    newFeatureMap();
  }
}

/** Load a Feature Map by the provided Key. */
function loadFeatureMap(key) {
  const json = localStorage.getItem(`$${key}`);
  if (!json) {
    showModalDialog(
      'Failed to locate saved feature map',
      false,
      undefined,
      'OK',
      undefined,
    );

    return;
  }

  const data = JSON.parse(json);
  if (!data) {
    showModalDialog(
      'Failed to process saved feature map',
      false,
      undefined,
      'OK',
      undefined,
    );

    return;
  }

  FeatureMap.Active = true;
  FeatureMap.Key = key;
  FeatureMap.Title = data.Title;
  updateFeatureMapMenu();
  resetFeatureMapRowContols(true);
  setFeatureMapRows(data.Features);
  hasEdits(false);
}

function loadFeatureMapCallback(event) {
  updateHash(event.currentTarget.dataset.id, getCheckboxSelections());
}

function selectFeatureMap() {
  const featureMaps = [];

  const keys = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key !== StoreName.Flags
      && key !== StoreName.Settings
      && key !== StoreName.MatrixSelection
      && key.startsWith('$')) {
      keys.push(key.substring(1));
    }
  }

  keys.sort(sortIntegers).forEach((key) => {
    const entryJSON = localStorage.getItem(`$${key}`);
    if (entryJSON) {
      const entry = JSON.parse(entryJSON);
      if (entry) {
        const createdDate = new Date(Number.parseInt(key, 10));
        featureMaps.push(
          {
            id: key,
            label: entry.Title,
            tooltip: `Created: ${createdDate.toLocaleString()}`,
          },
        );
      }
    }
  });

  if (featureMaps.length === 0) {
    showModalDialog(
      'No feature maps found',
      false,
      undefined,
      'OK',
      undefined,
    );
  } else {
    showModalDialog(
      'Select a feature map to load',
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      'Cancel',
      undefined,
      featureMaps,
      loadFeatureMapCallback,
    );
  }
}

/** Handles the Feature Map Load button click. */
function mapLoadClick() {
  if (FeatureMap.HasEdits) {
    showModalDialog(
      'Would you like to save your changes before loading a new feature map?',
      false,
      undefined,
      'Yes',
      () => requestSave(selectFeatureMap),
      'No',
      selectFeatureMap,
      'Cancel',
      undefined,
    );
  } else {
    selectFeatureMap();
  }
}

/** Close out the current Feature Map, reset page status . */
function closeFeatureMap() {
  FeatureMap.Active = false;
  FeatureMap.Key = undefined;
  FeatureMap.Title = undefined;

  hasEdits(false);
  updateFeatureMapMenu();
  resetFeatureMapRowContols(false);
  updateHash(FeatureMap.Key, getCheckboxSelections());
}

/** Save feature map click. */
function mapSaveClick() {
  requestSave();
}

/** Close feature map click. */
function mapCloseClick() {
  if (FeatureMap.HasEdits) {
    showModalDialog(
      'Would you like to save your changes before closing this feature map?',
      false,
      undefined,
      'Yes',
      () => requestSave(closeFeatureMap),
      'No',
      closeFeatureMap,
      'Cancel',
      undefined,
    );
  } else {
    closeFeatureMap();
  }
}

/** Add or Remove an element to the provided parent, using the given creation
 * function. Returns true if a change is made through this action. */
function addRemoveElement(parent, add, remove, focus, type, createFunc) {
  let changed = false;

  const existing = parent.querySelector(`[data-item="${type}"]`);
  if (add && !existing) {
    const element = createFunc();
    insertFeatureMapControl(parent, element);
    if (focus) {
      element.focus();
    }
    changed = true;
  } else if (remove && existing) {
    existing.remove();
    changed = true;
  }

  return changed;
}

/** Generic click event handler for Add/Remove buttons. Returns true if a
 * change is made through this action. */
function addRemoveClick(button, type, createFunc) {
  document.activeElement.blur();

  const add = button.classList.contains('add');
  const remove = button.classList.contains('remove');
  if ((add && remove) || (!add && !remove)) {
    throw new Error(`Invalid add/remove button state (${add}/${remove})`);
  }

  let changed = false;
  if (button.dataset.scope && button.dataset.scope.toLowerCase() === 'all') {
    document
      .querySelectorAll('#features-table>tbody>tr[data-feature]:not(.hidden)>td.map')
      .forEach((parent) => {
        if (Array.isArray(type)) {
          for (let i = 0; i < type.length; i += 1) {
            if (addRemoveElement(parent, add, remove, false, type[i], createFunc[i])) {
              changed = true;
            }
          }
        } else if (addRemoveElement(parent, add, remove, false, type, createFunc)) {
          changed = true;
        }
      });
  } else {
    if (Array.isArray(type)) {
      for (let i = 0; i < type.length; i += 1) {
        if (addRemoveElement(FeatureMap.Target, add, remove, true, type[i], createFunc[i])) {
          changed = true;
        }
      }
    } else if (addRemoveElement(FeatureMap.Target, add, remove, true, type, createFunc)) {
      changed = true;
    }
  }

  return changed;
}

/** Handles the Add / Remove Highlight button click event. */
function actionHighlightClick(event) {
  if (addRemoveClick(event.target, 'highlight', createHighlightElement)) {
    hasEdits(true);
  }
}

/** Handles the Add / Remove Image button click event. */
function actionImageClick(event) {
  if (addRemoveClick(event.target, 'glyph', createImageElement)) {
    hasEdits(true);
  }
}

/** Handles the Add / Remove Link button click event. */
function actionLinkClick(event) {
  if (addRemoveClick(event.target, 'link', createLinkElement)) {
    hasEdits(true);
  }
}

/** Handles the Add / Remove Notes button click event. */
function actionNotesClick(event) {
  if (addRemoveClick(event.target, 'notes', createNotesElement)) {
    hasEdits(true);
  }
}

/** Handles the Add / Remove All button click event. */
function actionAllClick(event) {
  if (addRemoveClick(
    event.target,
    FEATURE_MAP_ORDER,
    [
      createHighlightElement,
      createImageElement,
      createLinkElement,
      createNotesElement,
    ],
  )) {
    hasEdits(true);
  }
}

/** Triggers when the feature map popup loses focus to hide it. */
function mapPopupBlur(event) {
  const mapPopup = document.getElementById('map-popup');
  if (!mapPopup.contains(event.relatedTarget)) {
    mapPopup.classList.add('hidden');
  }
}

/** Redirect to the home page. */
function goHome() {
  window.location.href = '/';
}

/** Handles clicking the Home button. */
function homeClick() {
  if (FeatureMap.HasEdits) {
    showModalDialog(
      'Would you like to save your changes before leaving this page?',
      false,
      undefined,
      'Yes',
      () => requestSave(goHome),
      'No',
      goHome,
      'Cancel',
      undefined,
    );
  } else {
    goHome();
  }
}

/** Navigates to a link destination, adding the current Feature Map key. */
function navDiagramWithMap(link) {
  window.location.href = `${link.href}#$${FeatureMap.Key}`;
}

/** Intercepts a link click and after checking for unsaved changes navigates to
 * the destination, adding the Feature Map key. */
function diagramLinkClick(event) {
  if (FeatureMap.Active) {
    event.preventDefault();

    if (FeatureMap.HasEdits) {
      showModalDialog(
        'Would you like to save your changes before leaving this page?',
        false,
        undefined,
        'Yes',
        () => requestSave(() => navDiagramWithMap(event.target)),
        'No',
        () => navDiagramWithMap(event.target),
        'Cancel',
        undefined,
      );
    } else {
      navDiagramWithMap(event.target);
    }
  }
}

/** Handles the click event on the map copy button. */
function actionCopyClick() {
  document.activeElement.blur();

  FeatureMap.Clipboard = getDataFromCell(FeatureMap.Target);
}

/** Handles the click event on the map paste button. */
function actionPasteClick() {
  document.activeElement.blur();

  setFeatureMapCell(FeatureMap.Target, FeatureMap.Clipboard, false);
  hasEdits(true);
}

/** Handles the Fill Up action button click. */
function actionFillUpClick() {
  document.activeElement.blur();

  let changed = false;
  let above = true;

  const data = getDataFromCell(FeatureMap.Target);

  document
    .querySelectorAll('#features-table>tbody>tr[data-feature]:not(.hidden)>td.map')
    .forEach((cell) => {
      if (cell === FeatureMap.Target) {
        above = false;
      }

      if (above) {
        setFeatureMapCell(cell, data, true);
        changed = true;
      }
    });

  if (changed) {
    hasEdits(true);
  }
}

/** Handles the Fill All action button click. */
function actionFillAllClick() {
  document.activeElement.blur();

  let changed = false;

  const data = getDataFromCell(FeatureMap.Target);

  document
    .querySelectorAll('#features-table>tbody>tr[data-feature]:not(.hidden)>td.map')
    .forEach((cell) => {
      if (cell !== FeatureMap.Target) {
        setFeatureMapCell(cell, data, true);
        changed = true;
      }
    });

  if (changed) {
    hasEdits(true);
  }
}

/** Handles the Fill Down action button click. */
function actionFillDownClick() {
  document.activeElement.blur();

  let changed = false;
  let below = false;

  const data = getDataFromCell(FeatureMap.Target);

  document
    .querySelectorAll('#features-table>tbody>tr[data-feature]:not(.hidden)>td.map')
    .forEach((cell) => {
      if (below) {
        setFeatureMapCell(cell, data, true);
        changed = true;
      }

      if (cell === FeatureMap.Target) {
        below = true;
      }
    });

  if (changed) {
    hasEdits(true);
  }
}

/** Attach event listeners on buttons. */
function setupButtons() {
  document.getElementById('menu-home').addEventListener('click', homeClick);

  document
    .querySelectorAll('thead > tr > th > a')
    .forEach((link) => link.addEventListener('click', diagramLinkClick));

  document.getElementById('map-new').addEventListener('click', mapNewClick);
  document.getElementById('map-load').addEventListener('click', mapLoadClick);
  document.getElementById('map-save').addEventListener('click', mapSaveClick);
  document.getElementById('map-close').addEventListener('click', mapCloseClick);

  document.getElementById('button-all').addEventListener('click', selectAll);
  document.getElementById('button-none').addEventListener('click', selectNone);
  document.getElementById('button-save').addEventListener('click', selectSave);

  document.getElementById('button-download')
    .addEventListener('click', downloadClick);
  document.getElementById('button-export')
    .addEventListener('click', exportClick);

  document.getElementById('map-add-all')
    .addEventListener('click', mapAddAllClick);
  document.getElementById('map-remove-all')
    .addEventListener('click', mapRemoveAllClick);

  document.getElementById('action-highlight')
    .addEventListener('click', actionHighlightClick);
  document.getElementById('action-image')
    .addEventListener('click', actionImageClick);
  document.getElementById('action-link')
    .addEventListener('click', actionLinkClick);
  document.getElementById('action-notes')
    .addEventListener('click', actionNotesClick);
  document.getElementById('action-all')
    .addEventListener('click', actionAllClick);

  document.getElementById('action-copy')
    .addEventListener('click', actionCopyClick);
  document.getElementById('action-paste')
    .addEventListener('click', actionPasteClick);
  document.getElementById('action-fill-up')
    .addEventListener('click', actionFillUpClick);
  document.getElementById('action-fill-all')
    .addEventListener('click', actionFillAllClick);
  document.getElementById('action-fill-down')
    .addEventListener('click', actionFillDownClick);

  const mapPopup = document.getElementById('map-popup');
  mapPopup.addEventListener('blur', mapPopupBlur);
  mapPopup.querySelectorAll('*')
    .forEach((element) => element.addEventListener('blur', mapPopupBlur));
}

/** Extracts the feature map ($) and selected licenses from the location hash. */
function processHash() {
  let featureMap = undefined;
  let selected = undefined;

  if (window.location.hash) {
    const elements = window.location.hash.substring(1).split('/');
    elements.forEach((element) => {
      if (element.startsWith('$')) {
        featureMap = element.substring(1);
      } else {
        selected = element;
      }
    });
  }

  return { featureMap, selected };
}

/** Checks for the lack of a page hash and injects the saved hash. */
function applySavedSelectionHash() {
  const savedHash = localStorage.getItem(StoreName.MatrixSelection);
  if (savedHash && savedHash.indexOf('0') !== -1) {
    updateHash(FeatureMap.Key, savedHash);
  }
}

/** Updates feature map and selection of license types when hash changes. */
function hashChanged() {
  const { featureMap, selected } = processHash();

  if (featureMap !== FeatureMap.Key) {
    if (featureMap) {
      loadFeatureMap(featureMap);
    } else {
      closeFeatureMap();
    }
  }

  if (selected) {
    setCheckboxSelections(selected);
    showColumns(selected);
  }

  return !!selected;
}

/** DOM Content Loaded event handler. */
function DOMContentLoaded() {
  if (isEmbedded()) {
    document.getElementById('menu').style.display = 'none';
  }

  setupModal();
  setupButtons();
  setupFeatureSearch();
  setupCheckboxes();

  window.addEventListener('hashchange', hashChanged);

  let applySavedSelection = true;
  if (hashChanged()) {
    applySavedSelection = false;
  }

  if (applySavedSelection) {
    applySavedSelectionHash();
  }
}

/** Page Load event handler. */
function load() {
  document.getElementById('header')
    .style.width = `${document.body.scrollWidth}px`;

  setInterval(searchTimer, 500);
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded);
window.addEventListener('load', load);
