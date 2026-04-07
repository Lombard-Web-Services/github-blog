// static/js/admin/editor.js
let currentSlug = null;
let isPreviewMode = false;

// Editor functions
function format(command) {
    document.execCommand(command, false, null);
    document.getElementById('editor').focus();
}

function insertCode() {
    const lang = prompt('Langage (python, javascript, etc.) :') || '';
    const code = prompt('Code :') || '';
    insertHTML(`<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`);
}

function insertLatex() {
    document.getElementById('latex-modal').classList.add('active');
}

function confirmLatex() {
    const formula = document.getElementById('latex-input').value;
    if (formula) {
        insertHTML(`<span class="latex">$$${formula}$$</span>`);
    }
    closeModal('latex-modal');
}

function insertHTML() {
    document.getElementById('html-modal').classList.add('active');
}

function confirmHTML() {
    const html = document.getElementById('html-input').value;
    if (html) {
        insertHTML(html);
    }
    closeModal('html-modal');
}

function insertAnchor() {
    const id = prompt('ID de l\'ancre (ex: introduction) :');
    const text = prompt('Texte du lien :');
    if (id && text) {
        insertHTML(`<a href="#${id}">${text}</a>`);
    }
}

function insertHeadingWithAnchor() {
    const level = prompt('Niveau (2 pour H2, 3 pour H3) :') || '2';
    const text = prompt('Texte du titre :');
    const anchor = prompt('ID de l\'ancre (laisser vide pour auto) :') || slugify(text);
    
    if (text) {
        insertHTML(`<h${level} id="${anchor}">${text}</h${level}>`);
    }
}

function insertImage() {
    const url = prompt('URL de l\'image :');
    if (url) {
        insertHTML(`<img src="${url}" alt="" loading="lazy">`);
    }
}

function insertLink() {
    const url = prompt('URL :');
    const text = prompt('Texte du lien :');
    if (url) {
        insertHTML(`<a href="${url}">${text || url}</a>`);
    }
}

function insertHTML(html) {
    document.execCommand('insertHTML', false, html);
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function slugify(text) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
}

// Preview
async function togglePreview() {
    const editorPane = document.getElementById('editor-pane');
    const previewPane = document.getElementById('preview-pane');
    const content = document.getElementById('editor').innerHTML;
    
    isPreviewMode = !isPreviewMode;
    
    if (isPreviewMode) {
        const md = htmlToMarkdown(content);
        const res = await api.post('/api/preview', { content: md });
        document.getElementById('preview-content').innerHTML = res.html;
        editorPane.style.display = 'none';
        previewPane.style.display = 'block';
    } else {
        editorPane.style.display = 'block';
        previewPane.style.display = 'none';
    }
}

function htmlToMarkdown(html) {
    let md = html
        .replace(/<b>(.*?)<\/b>/g, '**$1**')
        .replace(/<i>(.*?)<\/i>/g, '*$1*')
        .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
        .replace(/<h1 id="([^"]*)">(.*?)<\/h1>/g, '# $2 {#$1}')
        .replace(/<h2 id="([^"]*)">(.*?)<\/h2>/g, '## $2 {#$1}')
        .replace(/<h3 id="([^"]*)">(.*?)<\/h3>/g, '### $2 {#$1}')
        .replace(/<h1>(.*?)<\/h1>/g, '# $1')
        .replace(/<h2>(.*?)<\/h2>/g, '## $1')
        .replace(/<h3>(.*?)<\/h3>/g, '### $1')
        .replace(/<h4>(.*?)<\/h4>/g, '#### $1')
        .replace(/<h5>(.*?)<\/h5>/g, '##### $1')
        .replace(/<h6>(.*?)<\/h6>/g, '###### $1')
        .replace(/<pre><code class="language-([^"]*)">([\s\S]*?)<\/code><\/pre>/g, '```$1\n$2\n```')
        .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```')
        .replace(/<code>(.*?)<\/code>/g, '`$1`')
        .replace(/<a href="([^"]*)">(.*?)<\/a>/g, '[$2]($1)')
        .replace(/<img src="([^"]*)"[^>]*>/g, '![]($1)')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<\/p>/g, '\n\n')
        .replace(/<[^>]+>/g, '');
    
    return md;
}

// Save
async function savePost(asDraft = true) {
    const data = {
        title: document.getElementById('post-title').value,
        content: htmlToMarkdown(document.getElementById('editor').innerHTML),
        date: document.getElementById('post-date').value,
        category: document.getElementById('post-category').value,
        tags: document.getElementById('post-tags').value.split(',').map(t => t.trim()).filter(t => t),
        description: document.getElementById('post-description').value,
        image: document.getElementById('post-image').value,
        draft: asDraft,
        hide_from_home: document.getElementById('hide-from-home')?.checked || false,
        seo_title: document.getElementById('seo-title')?.value || '',
        seo_description: document.getElementById('seo-description')?.value || '',
        og_title: document.getElementById('og-title')?.value || '',
        og_description: document.getElementById('og-description')?.value || '',
        og_image: document.getElementById('og-image')?.value || '',
        twitter_title: document.getElementById('twitter-title')?.value || '',
        twitter_description: document.getElementById('twitter-description')?.value || '',
        twitter_image: document.getElementById('twitter-image')?.value || '',
        canonical_url: document.getElementById('canonical-url')?.value || ''
    };
    
    if (!data.title) {
        alert('Veuillez entrer un titre');
        return;
    }
    
    try {
        if (currentSlug) {
            data.new_slug = data.slug || currentSlug;
            await api.post(`/api/posts/${currentSlug}`, data);
        } else {
            const res = await api.post('/api/posts', data);
            currentSlug = res.slug;
            window.history.replaceState({}, '', `/admin/editor?slug=${currentSlug}`);
        }
        
        alert(asDraft ? 'Brouillon sauvegardé !' : 'Article publié !');
    } catch (err) {
        alert('Erreur : ' + err.message);
    }
}

// Load post
async function loadPost(slug) {
    try {
        const post = await api.get(`/api/posts/${slug}`);
        currentSlug = slug;
        
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-date').value = post.date;
        document.getElementById('post-category').value = post.category;
        document.getElementById('post-tags').value = post.tags.join(', ');
        document.getElementById('post-description').value = post.description;
        document.getElementById('post-image').value = post.image;
        if (document.getElementById('hide-from-home')) {
            document.getElementById('hide-from-home').checked = post.hide_from_home || false;
        }
        if (document.getElementById('seo-title')) {
            document.getElementById('seo-title').value = post.seo_title || '';
            document.getElementById('seo-description').value = post.seo_description || '';
            document.getElementById('og-title').value = post.og_title || '';
            document.getElementById('og-description').value = post.og_description || '';
            document.getElementById('og-image').value = post.og_image || '';
            document.getElementById('twitter-title').value = post.twitter_title || '';
            document.getElementById('twitter-description').value = post.twitter_description || '';
            document.getElementById('twitter-image').value = post.twitter_image || '';
            document.getElementById('canonical-url').value = post.canonical_url || '';
        }
        
        document.getElementById('editor').innerHTML = markdownToHtml(post.content);
    } catch (err) {
        alert('Erreur chargement : ' + err.message);
    }
}

function markdownToHtml(md) {
    // Support des ancres {#id}
    return md
        .replace(/^###### (.*?)(?:\s*\{#([^}]+)\})?$/gim, '<h6 id="$2">$1</h6>')
        .replace(/^##### (.*?)(?:\s*\{#([^}]+)\})?$/gim, '<h5 id="$2">$1</h5>')
        .replace(/^#### (.*?)(?:\s*\{#([^}]+)\})?$/gim, '<h4 id="$2">$1</h4>')
        .replace(/^### (.*?)(?:\s*\{#([^}]+)\})?$/gim, '<h3 id="$2">$1</h3>')
        .replace(/^## (.*?)(?:\s*\{#([^}]+)\})?$/gim, '<h2 id="$2">$1</h2>')
        .replace(/^# (.*?)(?:\s*\{#([^}]+)\})?$/gim, '<h1 id="$2">$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/\$\$(.*?)\$\$/g, '<span class="latex">$$$1$$</span>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" loading="lazy">')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        .replace(/\n/g, '<br>');
}

function openMediaPickerForField(fieldId) {
    window.open('/admin/media', 'media-picker', 'width=900,height=700');
    window.addEventListener('message', function receiveMediaUrl(event) {
        if (event.data && event.data.type === 'media-selected') {
            document.getElementById(fieldId).value = event.data.url;
            window.removeEventListener('message', receiveMediaUrl);
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
            e.preventDefault();
            savePost(true);
        }
    }
});