import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement('div');
  // console.log("<> ", fragment, fragment.firstElementChild, footer);
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const classes = ['brand', 'nav', 'disc'];
  let f = footer.firstElementChild;
  while (f && classes.length) {
    f.classList.add(classes.shift());
    f = f.nextElementSibling;
  }
  block.append(footer);
}
