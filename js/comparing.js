import { backOrHome, setupModal, showModalDialog } from './common.js';

/** Move the slider between the two diagrams. */
function moveSlider() {
  document.getElementById('compare-overlay')
    .style.width = `${document.getElementById('compare-slider').value}%`;
}

/** DOM Content Loaded event handler. */
function DOMContentLoaded() {
  setupModal();

  const elements = window.location.hash.substring(1).split('/');
  if (elements.length === 2) {
    const [element1, element2] = elements;

    const compare1 = document.getElementById('compare1');
    if (element1.startsWith('*')) {
      compare1.src = `/viewsvg.htm#${element1}/compare`;
    } else {
      compare1.src = `/files/${element1}.htm#/compare`;
    }

    const compare2 = document.getElementById('compare2');
    if (element2.startsWith('*')) {
      compare2.src = `/viewsvg.htm#${element2}/compare`;
    } else {
      compare2.src = `/files/${element2}.htm#/compare`;
    }

    document.getElementById('compare-slider')
      .addEventListener('input', moveSlider);
  } else {
    document.getElementById('compare1').style.display = 'none';
    document.getElementById('compare-overlay').style.display = 'none';
    document.getElementById('compare-slider').style.display = 'none';

    showModalDialog(
      'Page loaded with invalid parameters.',
      false,
      undefined,
      'OK',
      backOrHome,
    );
  }
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded);
