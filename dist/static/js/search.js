// static/js/search.js
class SearchEngine {
    constructor() {
        this.data = [];
        this.index = new Map();
        this.input = document.getElementById('search-input');
        this.results = document.getElementById('search-results');
        this.baseUrl = document.querySelector('base') ? document.querySelector('base').getAttribute('href') : '';

        this.init();
    }

    async init() {
        try {
            const searchPath = this.baseUrl ? `${this.baseUrl}static/search.json` : '/static/search.json';
            const response = await fetch(searchPath);
            this.data = await response.json();
            this.buildIndex();
            this.setupListeners();
        } catch (err) {
            console.error('Erreur chargement index:', err);
            if (this.results) {
                this.results.innerHTML = '<p class="search-hint">Erreur de chargement de la recherche</p>';
            }
        }
    }

    buildIndex() {
        this.data.forEach((post, idx) => {
            const text = `${post.title} ${post.description} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
            const words = text.split(/\W+/).filter(w => w.length > 2);

            words.forEach(word => {
                if (!this.index.has(word)) {
                    this.index.set(word, new Set());
                }
                this.index.get(word).add(idx);
            });
        });
    }

    setupListeners() {
        let timeout;
        if (this.input) {
            this.input.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => this.search(e.target.value), 150);
            });
            this.input.focus();
        }
    }

    search(query) {
        if (!query || query.length < 2) {
            if (this.results) {
                this.results.innerHTML = '<p class="search-hint">Commencez à taper pour rechercher...</p>';
            }
            return;
        }

        const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
        const scores = new Map();

        terms.forEach(term => {
            this.index.forEach((posts, word) => {
                if (word.includes(term) || term.includes(word)) {
                    posts.forEach(idx => {
                        scores.set(idx, (scores.get(idx) || 0) + 1);
                    });
                }
            });
        });

        const sorted = Array.from(scores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        this.displayResults(sorted.map(([idx]) => this.data[idx]));
    }

    displayResults(posts) {
        if (!this.results) return;
        
        if (posts.length === 0) {
            this.results.innerHTML = '<p class="search-hint">Aucun résultat trouvé</p>';
            return;
        }

        const baseUrl = this.baseUrl || '';
        this.results.innerHTML = posts.map(post => `
            <article class="search-result">
                <h3><a href="${baseUrl}/blog/${post.slug}/">${this.highlight(post.title)}</a></h3>
                <p>${this.truncate(post.content, 150)}</p>
                <div class="post-tags">
                    ${post.tags.map(t => `<span class="tag">#${t}</span>`).join('')}
                </div>
            </article>
        `).join('');
    }

    highlight(text) {
        const query = this.input ? this.input.value : '';
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    truncate(text, len) {
        return text.length > len ? text.substring(0, len) + '...' : text;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('search-input')) {
        new SearchEngine();
    }
});