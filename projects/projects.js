import { fetchJSON, renderProjects, showProjectError } from '../global.js';

const container = document.querySelector('.all-projects');
const filters = document.querySelector('.year-filters');
const search = document.querySelector('.searchBar');
const count = document.querySelector('.project-count');
const emptyState = document.querySelector('#no-projects');
let selectedYear = 'All';

try {
  const projects = await fetchJSON(new URL('../lib/projects.json', import.meta.url));
  const years = ['All', ...new Set(projects.map(project => project.year).sort((a, b) => Number(b) - Number(a)))];
  function updateProjects() {
    const query = search.value.trim().toLowerCase();
    const visible = projects.filter(project => {
      const matchesYear = selectedYear === 'All' || project.year === selectedYear;
      const text = [project.title, project.displayTitle, project.description, project.summary, project.year].join(' ').toLowerCase();
      return matchesYear && text.includes(query);
    });
    renderProjects(visible, container);
    count.textContent = `${visible.length} ${visible.length === 1 ? 'project' : 'projects'}${selectedYear === 'All' ? '' : ` from ${selectedYear}`}`;
    emptyState.hidden = visible.length > 0;
    for (const button of filters.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button.dataset.year === selectedYear));
    }
  }
  for (const year of years) {
    const button = document.createElement('button');
    button.className = 'filter-button';
    button.type = 'button';
    button.dataset.year = year;
    button.textContent = year === 'All' ? 'All work' : year;
    button.addEventListener('click', () => {
      selectedYear = year;
      updateProjects();
    });
    filters.append(button);
  }
  search.addEventListener('input', updateProjects);
  document.querySelector('#reset-filters').addEventListener('click', () => {
    selectedYear = 'All';
    search.value = '';
    updateProjects();
    search.focus();
  });
  updateProjects();
} catch (error) {
  count.textContent = '';
  showProjectError(container);
  console.error('Could not load projects.', error);
} finally {
  container.setAttribute('aria-busy', 'false');
}
