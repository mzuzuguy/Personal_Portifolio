const params = new URLSearchParams(window.location.search);
const articleParam = params.get('article') || params.get('file') || 'mphanvu-hackathon';

function resolveArticlePath(value) {
  if (!value) return 'articles/mphanvu-hackathon.json';

  if (/\.json$/i.test(value)) {
    return value.startsWith('./') ? value.slice(2) : value;
  }

  const clean = value.replace(/^\.\//, '').replace(/^articles\//, '');
  return `articles/${clean}.json`;
}

function toggleTheme() {
  document.body.classList.toggle('light');
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.className = document.body.classList.contains('light')
      ? 'fa-solid fa-sun'
      : 'fa-solid fa-moon';
  }
}

function toggleNav() {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('open');
}

async function loadArticle() {
  const articlePath = resolveArticlePath(articleParam);

  try {
    const response = await fetch(`./${articlePath}?v=${Date.now()}`);
    if (!response.ok) throw new Error(`Failed to load article: ${response.status}`);

    const article = await response.json();
    const titleEl = document.getElementById('article-title');
    const dateEl = document.getElementById('article-date');
    const authorEl = document.getElementById('article-author');
    const tagsEl = document.getElementById('article-tags');
    const summaryEl = document.getElementById('article-summary');
    const contentEl = document.getElementById('article-content');

    document.title = `${article.title} | Precious Musole`;
    titleEl.textContent = article.title;
    dateEl.textContent = new Date(article.date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    authorEl.textContent = article.author ? `By ${article.author}` : 'By Precious Musole';

    tagsEl.innerHTML = (article.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');
    summaryEl.textContent = article.summary || '';

    contentEl.innerHTML = (article.content || [])
      .map(section => {
        if (!section || !section.text) return '';

        if (section.type === 'heading') {
          return `<h2>${section.text}</h2>`;
        }

        return `<p>${section.text}</p>`;
      })
      .join('');
  } catch (error) {
    document.getElementById('article-title').textContent = 'Article unavailable';
    document.getElementById('article-content').innerHTML = `
      <p>We couldn't load this article right now.</p>
      <p>Please return to the <a href="index.html#articles">articles section</a>.</p>
    `;
    console.error(error);
  }
}

loadArticle();
