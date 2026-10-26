import { fetchJSON, renderProjects, showProjectError } from './global.js';

// Keep the complete heading in the HTML for no-JavaScript and reduced-motion views.
// A hidden full-text layer reserves its final height while the visible text types.
function initializeTypedHeader() {
  const heading = document.querySelector('.hero-heading');
  const lines = [...heading.querySelectorAll('.hero-line')];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionPreference.matches) return;

  const text = lines.map(line => [...line.textContent]);
  const outputs = lines.map(line => {
    const reserve = document.createElement('span');
    reserve.className = 'typewriter-reserve';
    reserve.textContent = line.textContent;
    reserve.setAttribute('aria-hidden', 'true');
    const output = document.createElement('span');
    output.className = 'typewriter-output';
    output.setAttribute('aria-hidden', 'true');
    line.replaceChildren(reserve, output);
    return output;
  });

  let lineIndex = 0;
  let characterIndex = 0;
  let timer;
  heading.dataset.typing = 'active';
  outputs[0].classList.add('is-current');

  function showCompleteHeading() {
    window.clearTimeout(timer);
    outputs.forEach((output, index) => {
      output.textContent = text[index].join('');
      output.classList.remove('is-current');
    });
    if (!motionPreference.matches) outputs.at(-1).classList.add('is-current');
    heading.dataset.typing = 'complete';
  }

  function typeNextCharacter() {
    if (motionPreference.matches || document.hidden) {
      showCompleteHeading();
      return;
    }
    const output = outputs[lineIndex];
    output.classList.add('is-current');
    characterIndex += 1;
    output.textContent = text[lineIndex].slice(0, characterIndex).join('');

    if (characterIndex === text[lineIndex].length) {
      if (lineIndex === outputs.length - 1) {
        // Keep the final cursor blinking after both lines have finished typing.
        heading.dataset.typing = 'complete';
        return;
      }
      timer = window.setTimeout(() => {
        output.classList.remove('is-current');
        lineIndex += 1;
        characterIndex = 0;
        typeNextCharacter();
      }, 420);
      return;
    }

    const character = text[lineIndex][characterIndex - 1];
    const delay = /[,!?\.]/.test(character) ? 150 : character === ' ' ? 32 : 46;
    timer = window.setTimeout(typeNextCharacter, delay);
  }

  motionPreference.addEventListener('change', showCompleteHeading);
  window.addEventListener('pagehide', showCompleteHeading, { once: true });
  timer = window.setTimeout(typeNextCharacter, 280);
}

initializeTypedHeader();

const container = document.querySelector('.home-projects');
try {
  const projects = await fetchJSON(new URL('./lib/projects.json', import.meta.url));
  renderProjects(projects.slice(0, 3), container, 'h3');
} catch (error) {
  showProjectError(container);
  console.error('Could not load recent projects.', error);
} finally {
  container.setAttribute('aria-busy', 'false');
}
