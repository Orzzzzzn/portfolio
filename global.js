// Resolve from this module so links work at / and a GitHub Pages /portfolio/ path.
const siteRoot = new URL('./', import.meta.url);
const siteURL = (path = '') => new URL(path, siteRoot);
const currentPath = location.pathname.replace(/index\.html$/, '');

const navigation = document.createElement('nav');
navigation.className = 'site-nav';
navigation.setAttribute('aria-label', 'Main navigation');
const pages = [
  { path: '', label: 'Home' },
  { path: 'projects/', label: 'Projects' },
  { path: 'about/', label: 'About Me' },
  { path: 'cv/', label: 'CV' },
  { path: 'https://github.com/kyxz1813', label: 'GitHub', external: true },
];
for (const page of pages) {
  const link = document.createElement('a');
  link.href = siteURL(page.path).href;
  link.textContent = page.label;
  if (page.external) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'GitHub (opens in a new tab)');
  } else if (page.path === ''
    ? currentPath === siteRoot.pathname
    : currentPath.startsWith(siteURL(page.path).pathname)) {
    link.classList.add('current');
    link.setAttribute('aria-current', 'page');
  }
  navigation.append(link);
}
let skipLink = document.querySelector('.skip-link');
const mainContent = document.querySelector('main[id]');
if (!skipLink && mainContent) {
  skipLink = document.createElement('a');
  skipLink.className = 'skip-link';
  skipLink.href = `#${mainContent.id}`;
  skipLink.textContent = 'Skip to content';
  document.body.prepend(skipLink);
}
if (skipLink) skipLink.after(navigation);
else document.body.prepend(navigation);

const footer = document.querySelector('.site-footer');
if (footer) {
  const name = document.createElement('a');
  name.href = siteRoot.href;
  name.className = 'footer-name';
  name.textContent = 'Yuxuan (Kate) Zhou';
  const links = document.createElement('div');
  links.className = 'footer-links';
  for (const [label, path] of [['Get in touch', 'contact/'], ['Back to top ↑', '#']]) {
    const link = document.createElement('a');
    link.textContent = label;
    link.href = path === '#' ? '#' : siteURL(path).href;
    links.append(link);
  }
  footer.append(name, links);
}
document.querySelectorAll('[data-print]').forEach(button => {
  button.addEventListener('click', () => window.print());
});

export async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed (${response.status}).`);
  return response.json();
}

export function renderProjects(projects, container, headingLevel = 'h2') {
  if (!container) throw new Error('A project container is required.');
  if (!/^h[1-6]$/.test(headingLevel)) throw new Error('Invalid heading level.');
  const fragment = document.createDocumentFragment();
  for (const project of projects) {
    const article = document.createElement('article');
    article.className = 'project-card';
    const destination = siteURL(project.url);
    const external = destination.origin !== location.origin;
    const mediaLink = document.createElement('a');
    mediaLink.className = 'project-image-link';
    mediaLink.href = destination.href;
    mediaLink.tabIndex = -1;
    mediaLink.setAttribute('aria-hidden', 'true');
    const image = document.createElement('img');
    image.src = siteURL(project.image).href;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 720;
    image.height = 480;
    mediaLink.append(image);

    const content = document.createElement('div');
    content.className = 'project-card-content';
    const heading = document.createElement(headingLevel);
    const titleLink = document.createElement('a');
    titleLink.href = destination.href;
    titleLink.textContent = project.displayTitle || project.title;
    titleLink.title = project.title;
    if (external) {
      for (const link of [mediaLink, titleLink]) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      const hint = document.createElement('span');
      hint.className = 'sr-only';
      hint.textContent = ' (opens in a new tab)';
      titleLink.append(hint);
    }
    heading.append(titleLink);
    const description = document.createElement('p');
    description.textContent = project.summary || project.description;
    const meta = document.createElement('div');
    meta.className = 'project-meta';
    const year = document.createElement('span');
    year.textContent = `Year: ${project.year}`;
    const arrow = document.createElement('span');
    arrow.className = 'project-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = external ? '↗' : '→';
    meta.append(year, arrow);
    content.append(heading, description);
    if (project.websiteUrl) {
      const websiteLink = document.createElement('a');
      websiteLink.className = 'project-poster-link';
      websiteLink.href = project.websiteUrl;
      websiteLink.target = '_blank';
      websiteLink.rel = 'noopener noreferrer';
      websiteLink.textContent = 'Visit project website ↗';
      content.append(websiteLink);
    }
    if (project.posterUrl) {
      const posterLink = document.createElement('a');
      posterLink.className = 'project-poster-link';
      posterLink.href = siteURL(project.posterUrl).href;
      posterLink.textContent = project.posterLabel || 'View poster and details →';
      posterLink.target = '_blank';
      posterLink.rel = 'noopener noreferrer';
      posterLink.setAttribute('aria-label', `${project.posterLabel || 'View poster and details'} for ${project.displayTitle || project.title} (opens in a new tab)`);
      content.append(posterLink);
    }
    content.append(meta);
    article.append(mediaLink, content);
    fragment.append(article);
  }
  container.replaceChildren(fragment);
}

export function showProjectError(container) {
  const message = document.createElement('p');
  message.className = 'empty-state';
  message.textContent = 'The projects could not be loaded. Please refresh the page to try again.';
  container.replaceChildren(message);
}

// Retained for existing pages that use this helper.
export function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${encodeURIComponent(username)}`);
}
