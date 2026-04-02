/* ============================================================
   main.js — Reads data.json and renders all dynamic sections
   To add content: edit data.json only. Never touch this file
   unless you want to change how things look structurally.
   ============================================================ */

/* ── Load data and kick everything off ── */
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    renderSkills(data.skills);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderArticles(data.articles);
  })
  .catch(err => console.error('Could not load data.json:', err));


/* ══════════════════════════════════════════
   SKILLS
══════════════════════════════════════════ */
function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  grid.innerHTML = skills.map(skill => `
    <div class="skill-item">
      <div class="skill-icon" ${skill.color ? `style="color:${skill.color}"` : ''}>
        ${skill.icon}
      </div>
      <div class="skill-name">${skill.name}</div>
    </div>
  `).join('');
}


/* ══════════════════════════════════════════
   EXPERIENCE
══════════════════════════════════════════ */
function renderExperience(experience) {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  timeline.innerHTML = experience.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot ${item.active ? 'active' : ''}"></div>
      <div class="timeline-card">
        <div class="timeline-year">${item.year}</div>
        <div class="timeline-date">${item.date}</div>
        <div class="timeline-role">${item.role}</div>
        <div class="timeline-company">${item.company}</div>
        <div class="timeline-desc">${item.description}</div>
        <div class="tag-list">
          ${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}


/* ══════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════ */
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projects.map(project => {
    const isLive = project.status === 'live';

    return `
      <div class="project-card">
        ${buildProjectPreview(project)}
        <div class="project-info">
          <div class="project-title">${project.title}</div>
          <div class="project-desc">${project.description}</div>
          <div class="tag-list" style="margin-bottom:16px;">
            ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
          ${isLive ? `
          <div class="project-links">
            ${project.codeUrl ? `<a href="${project.codeUrl}" target="_blank"><i class="fa-brands fa-github"></i> Code</a>` : ''}
            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live</a>` : ''}
          </div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function buildProjectPreview(project) {
  if (project.status === 'coming-soon') {
    const previewContent = {
      code:     `<span style="color:var(--green);font-size:0.8rem;">Loading...</span>`,
      database: `<span style="color:var(--green);font-size:0.8rem;">SELECT * FROM projects;</span>`,
    }[project.preview] || `<span style="color:var(--green);font-size:0.8rem;">// work in progress</span>`;

    return `
      <div class="project-preview" style="filter:blur(2px);">
        <div class="mock-header">
          <div class="mock-nav-dots"><span></span><span></span><span></span></div>
          <span>${project.preview}.js</span>
        </div>
        ${previewContent}
      </div>
      <div style="position:relative;margin-top:-200px;height:200px;display:flex;align-items:center;justify-content:center;z-index:2;">
        <div class="coming-soon-badge">Coming Soon</div>
      </div>
    `;
  }

  /* default live preview */
  return `
    <div class="project-preview">
      <div class="mock-header">
        <div class="mock-nav-dots"><span></span><span></span><span></span></div>
        <span>&gt;_ ${project.title}</span>
      </div>
      <div style="color:var(--green);font-size:0.75rem;margin-top:20px;text-align:center;padding:0 20px;line-height:1.6;">
        <div style="color:var(--purple);">const</div>
        <div style="font-size:1.2rem;font-weight:700;color:var(--text);">${project.title}</div>
        <div style="color:var(--green);">$ status: live</div>
      </div>
    </div>
  `;
}


/* ══════════════════════════════════════════
   ARTICLES
══════════════════════════════════════════ */
function renderArticles(articles) {
  const grid = document.getElementById('articles-grid');
  const section = document.getElementById('articles');
  if (!grid || !section) return;

  /* hide section if no articles */
  if (!articles || articles.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = '';

  grid.innerHTML = articles.map(article => `
    <a class="article-card" href="${article.url}" target="_blank">
      <div class="article-date">${formatDate(article.date)}</div>
      <div class="article-title">${article.title}</div>
      <div class="article-summary">${article.summary}</div>
      <div class="tag-list" style="margin-top:12px;">
        ${article.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="article-read-more">Read more <i class="fa-solid fa-arrow-right"></i></div>
    </a>
  `).join('');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}


/* ══════════════════════════════════════════
   UI INTERACTIONS (theme, nav, typewriter,
   scroll observer — kept here so index.html
   stays free of inline scripts)
══════════════════════════════════════════ */

/* Typewriter */
const typeLines = [
  'Learning by building, not just watching.',
  'CS Student @ UNIMA 🇲🇼',
  'Currently: C++ • SQL • Web Dev'
];
let tl = 0, tc = 0, tDeleting = false;

function type() {
  const taglineEl = document.getElementById('tagline');
  if (!taglineEl) return;
  const line = typeLines[tl];
  if (!tDeleting) {
    taglineEl.innerHTML = line.slice(0, tc + 1) + '<span class="cursor">|</span>';
    tc++;
    if (tc === line.length) { tDeleting = true; setTimeout(type, 1800); return; }
  } else {
    taglineEl.innerHTML = line.slice(0, tc - 1) + '<span class="cursor">|</span>';
    tc--;
    if (tc === 0) { tDeleting = false; tl = (tl + 1) % typeLines.length; }
  }
  setTimeout(type, tDeleting ? 40 : 75);
}

/* About "Run Code" toggle */
function runCode() {
  document.getElementById('about-output').classList.toggle('visible');
}

/* Theme toggle */
function toggleTheme() {
  document.body.classList.toggle('light');
  document.getElementById('theme-icon').className =
    document.body.classList.contains('light') ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/* Mobile nav */
function toggleNav() {
  document.getElementById('nav').classList.toggle('open');
}

/* Scroll fade-in */
function initScrollObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  type();
  initScrollObserver();
});
