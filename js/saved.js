import {
  StoreName, exportPng, exportSvg, getModalInputText, isEmbedded, isIOS,
  setupModal, showModalDialog, sortIntegers,
} from './common.js';

/** Creates a visual divider for the item list. */
function newDivider() {
  const element = document.createElement('div');
  element.className = 'divider';
  return element;
}

/** Creates a diagram name link. */
function newDiagramLink(text, key) {
  const element = document.createElement('a');
  element.textContent = text;
  element.href = `/viewsvg.htm#*${key}`;

  const createdDate = new Date(Number.parseInt(key, 10));
  element.title = `Created: ${createdDate.toLocaleString()}`;
  return element;
}

/** Creates an 'Export PNG' button. */
function newPngButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'export';
  button.title = 'Export PNG';
  button.textContent = 'PNG';
  return button;
}

/** Creates an 'Export SVG' button. */
function newSvgButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'export';
  button.title = 'Export SVG';
  button.textContent = 'SVG';
  return button;
}

/** Creates a 'Delete' button. */
function newDeleteButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'delete';
  button.title = 'Delete';
  return button;
}

/** Creates a 'Rename' button. */
function newRenameButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'rename';
  button.title = 'Rename';
  return button;
}

/** Adds the message ot show there are no saved diagrams. */
function addEmptyMessage(container) {
  const message = document.createElement('span');
  message.innerText = 'There are no saved diagrams.';
  container.appendChild(message);
}

/** Adds a new row to the saved diagrams list. */
function addNewRow(container, key, entry) {
  const entryLink = newDiagramLink(entry.Title, key);
  container.appendChild(entryLink);

  const entryRename = newRenameButton();
  container.appendChild(entryRename);

  const entryDelete = newDeleteButton();
  container.appendChild(entryDelete);

  const entrySvgButton = newSvgButton();
  container.appendChild(entrySvgButton);

  const entryPngButton = newPngButton();
  container.appendChild(entryPngButton);

  const thisDivider = newDivider();
  container.appendChild(thisDivider);

  entryRename.addEventListener('click', () => {
    showModalDialog(
      'Rename saved diagram:',
      true,
      entryLink.textContent,
      'OK',
      () => {
        const newName = getModalInputText();
        if (!newName) return;

        entry.Title = newName;
        const entryJSON = JSON.stringify(entry);
        localStorage.setItem(key, entryJSON);
        entryLink.textContent = newName;
      },
      undefined,
      undefined,
      'Cancel',
      undefined,
    );
  });

  entryDelete.addEventListener('click', () => {
    showModalDialog(
      `Are you sure you want to delete "${entryLink.textContent}"?`,
      false,
      undefined,
      'Yes',
      () => {
        localStorage.removeItem(key);

        container.removeChild(entryLink);
        container.removeChild(entryRename);
        container.removeChild(entryDelete);
        container.removeChild(entrySvgButton);
        container.removeChild(entryPngButton);
        container.removeChild(thisDivider);

        if (!container.querySelector('a')) {
          container.innerHTML = '';
          container.appendChild(newDivider());
          addEmptyMessage(container);
          container.appendChild(newDivider());
        }
      },
      undefined,
      undefined,
      'No',
      undefined,
    );
  });

  entrySvgButton.addEventListener('click', () => {
    exportSvg(`${entry.Title}.svg`, entry.SvgXml);
  });

  entryPngButton.addEventListener('click', () => {
    exportPng(`${entry.Title}.png`, entry.SvgXml);
  });
}

/** Adds all the saved diagrams onto the page. */
function populateList() {
  const container = document.getElementById('collection');
  container.innerHTML = '';

  container.appendChild(newDivider());

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

  keys.sort(sortIntegers).forEach((key) => {
    const entryJSON = localStorage.getItem(key);
    if (entryJSON) {
      const entry = JSON.parse(entryJSON);
      if (entry) {
        addNewRow(container, key, entry);
      }
    }
  });

  if (keys.length === 0) {
    addEmptyMessage(container);
    container.appendChild(newDivider());
  }
}

/** Imports the file at index from the files list. */
function processImport(files, index) {
  const file = files[index];

  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    showModalDialog(
      files.length === 1
        ? 'Import diagram as:'
        : `Import diagram ${index + 1} of ${files.length} as:`,
      true,
      file.name,
      'OK',
      () => {
        const diagramTitle = getModalInputText();
        if (!diagramTitle) return;

        const storageKey = Date.now().toString();
        const svgObject = {
          Title: diagramTitle,
          SvgXml: event.target.result,
        };

        const jsonData = JSON.stringify(svgObject);
        localStorage.setItem(storageKey, jsonData);

        populateList();

        if (index !== files.length - 1) {
          processImport(files, index + 1);
        }
      },
      undefined,
      undefined,
      files.length === 1 ? 'Cancel' : 'Skip',
      () => {
        if (index !== files.length - 1) {
          processImport(files, index + 1);
        }
      },
    );
  });

  reader.readAsText(file);
}

/** Imports the selected files into the Saved Diagrams list. */
function filesSelected(event) {
  processImport(event.target.files, 0);
}

/** Clicks the export link corresponding with the supplied exportType for
 * all saved diagrams. */
function exportAllDiagrams(exportType) {
  document.querySelectorAll('.export').forEach((item) => {
    if (item.textContent === exportType) {
      item.click();
    }
  });
}

/** DOM Content Loaded event handler. */
function DOMContentLoaded() {
  if (isEmbedded()) {
    document.getElementById('menu').style.display = 'none';
  }

  setupModal();
  populateList();

  if (isIOS) {
    document.getElementById('export-all-png').style.display = 'none';
  } else {
    document.getElementById('export-all-png')
      .addEventListener('click', () => exportAllDiagrams('PNG'));
  }

  if (isIOS) {
    document.getElementById('export-all-svg').style.display = 'none';
  } else {
    document.getElementById('export-all-svg')
      .addEventListener('click', () => exportAllDiagrams('SVG'));
  }

  document.getElementById('import')
    .addEventListener('click', () => document
      .getElementById('file-selector').click());

  document.getElementById('file-selector')
    .addEventListener('change', filesSelected);
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded);
