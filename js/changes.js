import { isEmbedded } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  if (isEmbedded()) {
    document.getElementById('menu').style.display = 'none';
  }
});
