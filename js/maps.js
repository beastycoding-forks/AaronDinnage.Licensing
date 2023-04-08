import {
  StoreName, exportFM, getModalInputText, isEmbedded, isIOS, setupModal,
  showModalDialog, sortIntegers,
} from './common.js';

/** Creates a visual divider for the item list. */
function newDivider() {
  const element = document.createElement('div');
  element.className = 'divider';
  return element;
}

/** Creates a map name link. */
function newMapLink(text, key) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = `/matrix.htm#$${key}`;

  const created = new Date(Number.parseInt(key, 10));
  link.title = `Created: ${created.toLocaleString()}`;
  return link;
}

/** Creates an 'Export' button. */
function newExportButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'export';
  button.title = 'Export';
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

/** Adds the message ot show there are no feature maps. */
function addEmptyMessage(container) {
  const message = document.createElement('span');
  message.innerText = 'There are no saved feature maps.';
  container.appendChild(message);
}

/** Adds a new row to the feature maps list. */
function addNewRow(container, key, entry) {
  const entryLink = newMapLink(entry.Title, key);
  container.appendChild(entryLink);

  const entryRename = newRenameButton();
  container.appendChild(entryRename);

  const entryDelete = newDeleteButton();
  container.appendChild(entryDelete);

  const entryExportButton = newExportButton();
  container.appendChild(entryExportButton);

  const thisDivider = newDivider();
  container.appendChild(thisDivider);

  entryRename.addEventListener('click', () => {
    showModalDialog(
      'Rename feature map:',
      true,
      entryLink.textContent,
      'OK',
      () => {
        const newName = getModalInputText();
        if (!newName) return;

        entry.Title = newName;
        const entryJSON = JSON.stringify(entry);
        localStorage.setItem(`$${key}`, entryJSON);
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
        localStorage.removeItem(`$${key}`);

        container.removeChild(entryLink);
        container.removeChild(entryRename);
        container.removeChild(entryDelete);
        container.removeChild(entryExportButton);
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

  entryExportButton.addEventListener('click', () => {
    exportFM(`${entry.Title}.json`, entry.Features);
  });
}

/** Adds all the feature maps onto the page. */
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
      && key.startsWith('$')) {
      keys.push(key.substring(1));
    }
  }

  keys.sort(sortIntegers).forEach((key) => {
    const entryJSON = localStorage.getItem(`$${key}`);
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
      files.length === 0
        ? 'Import feature map as:'
        : `Import feature map ${index + 1} of ${files.length} as:`,
      true,
      file.name,
      'OK',
      () => {
        const diagramTitle = getModalInputText();
        if (!diagramTitle) return;

        const key = Date.now().toString();
        const jsonObject = {
          Title: diagramTitle,
          Features: JSON.parse(event.target.result),
        };

        const jsonData = JSON.stringify(jsonObject);
        localStorage.setItem(`$${key}`, jsonData);

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

/** Imports the selected files into the Feature Maps list. */
function filesSelected(event) {
  processImport(event.target.files, 0);
}

/** Clicks the export link for all feature maps. */
function exportAll() {
  document.querySelectorAll('.export').forEach((exportLink) => exportLink.click());
}

/** DOM Content Loaded event handler. */
function DOMContentLoaded() {
  if (isEmbedded()) {
    document.getElementById('menu').style.display = 'none';
  }

  setupModal();
  populateList();

  if (isIOS) {
    document.getElementById('export-all').style.display = 'none';
  } else {
    document.getElementById('export-all').addEventListener('click', exportAll);
  }

  document.getElementById('import')
    .addEventListener('click', () => document
      .getElementById('file-selector').click());

  document.getElementById('file-selector')
    .addEventListener('change', filesSelected);
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded);
