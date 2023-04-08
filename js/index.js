import { StoreName, isEmbedded } from './common.js';

/** Sets the display properties and attaches event listeners to flags. */
function setupFlags() {
  const flagsJSON = localStorage.getItem(StoreName.Flags);
  if (!flagsJSON) return;

  const flags = JSON.parse(flagsJSON);

  document.querySelectorAll('.diagram-link').forEach((link) => {
    const filename = link.pathname.slice(
      link.pathname.lastIndexOf('/') + 1,
      link.pathname.lastIndexOf('.'),
    );

    if (flags.includes(filename)) {
      link.classList.add('flagged');
    }

    // TODO: Hover preview?
    // const preview = document.createElement('img');
    // preview.src = '/' + filename + '.svg';
    // preview.height = "200";
    // button.nextSibling.appendChild(preview);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (isEmbedded()) {
    document.getElementById('footer').style.display = 'none';
  }

  setupFlags();
});
