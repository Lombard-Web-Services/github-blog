// static/js/admin/editor.js
// Version complète fusionnée avec support multilingue et BBCode

let currentSlug = null;
let isPreviewMode = false;
let currentFieldTarget = null;
let availableLanguages = [];
let currentPostLang = '';
let currentParentSlug = null;

// ============================================
// FONCTIONS D'ÉDITION BBCode
// ============================================

function insertBBCode(tag) {
    const textarea = document.getElementById('bbcode-editor');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let insertText = '';
    
    switch(tag) {
        case 'b':
        case 'i':
        case 'u':
        case 's':
            insertText = `[${tag}]${selectedText || 'texte'}[/${tag}]`;
            break;
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            insertText = `[${tag}]${selectedText || 'Titre'}[/${tag}]\n\n`;
            break;
        case 'left':
        case 'center':
        case 'right':
        case 'justify':
            insertText = `[align=${tag}]${selectedText || 'Texte aligné'}[/align]`;
            break;
        case 'quote':
            insertText = `[quote]${selectedText || 'Citation...'}[/quote]\n\n`;
            break;
        case 'code':
            const lang = prompt('Langage (python, javascript, etc.) :') || '';
            insertText = `[code${lang ? '=' + lang : ''}]\n${selectedText || 'code ici'}\n[/code]\n\n`;
            break;
        case 'url':
            const url = prompt('URL :') || 'https://';
            const linkText = prompt('Texte du lien :') || url;
            insertText = `[url=${url}]${linkText}[/url]`;
            break;
        case 'img':
            const imgUrl = prompt('URL de l\'image :') || '';
            insertText = `[img]${imgUrl}[/img]\n\n`;
            break;
        case 'anchor':
            const anchorId = prompt('ID de l\'ancre :') || '';
            insertText = `[anchor=${anchorId}][/anchor]`;
            break;
        case 'latex':
            const formula = prompt('Formule LaTeX (ex: E = mc^2) :') || 'E = mc^2';
            insertText = `[latex]${formula}[/latex]`;
            break;
        case 'html':
            const htmlContent = prompt('Code HTML brut :') || '';
            insertText = `[html]${htmlContent}[/html]`;
            break;
        default:
            return;
    }
    
    textarea.setRangeText(insertText, start, end, 'end');
    textarea.focus();
    updatePreview();
}

function insertHTML(html) {
    document.execCommand('insertHTML', false, html);
    const editor = document.getElementById('editor');
    if (editor) editor.focus();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function slugify(text) {
    if (!text) return '';
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
}

// ============================================
// FONCTIONS DE PRÉVISUALISATION
// ============================================

function bbcodeToHtml(bbcode) {
    if (!bbcode) return '';
    
    return bbcode
        .replace(/\[b\](.*?)\[\/b\]/gs, '<strong>$1</strong>')
        .replace(/\[i\](.*?)\[\/i\]/gs, '<em>$1</em>')
        .replace(/\[u\](.*?)\[\/u\]/gs, '<u>$1</u>')
        .replace(/\[s\](.*?)\[\/s\]/gs, '<s>$1</s>')
        .replace(/\[h1\](.*?)\[\/h1\]/gs, '<h1>$1</h1>')
        .replace(/\[h2\](.*?)\[\/h2\]/gs, '<h2>$1</h2>')
        .replace(/\[h3\](.*?)\[\/h3\]/gs, '<h3>$1</h3>')
        .replace(/\[h4\](.*?)\[\/h4\]/gs, '<h4>$1</h4>')
        .replace(/\[h5\](.*?)\[\/h5\]/gs, '<h5>$1</h5>')
        .replace(/\[h6\](.*?)\[\/h6\]/gs, '<h6>$1</h6>')
        .replace(/\[align=left\](.*?)\[\/align\]/gs, '<div style="text-align: left;">$1</div>')
        .replace(/\[align=center\](.*?)\[\/align\]/gs, '<div style="text-align: center;">$1</div>')
        .replace(/\[align=right\](.*?)\[\/align\]/gs, '<div style="text-align: right;">$1</div>')
        .replace(/\[align=justify\](.*?)\[\/align\]/gs, '<div style="text-align: justify;">$1</div>')
        .replace(/\[quote\](.*?)\[\/quote\]/gs, '<blockquote><span class="quote-mark">"</span>$1<span class="quote-mark">"</span></blockquote>')
        .replace(/\[code(?:=(\w+))?\]([\s\S]*?)\[\/code\]/gs, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/\[url=(.*?)\](.*?)\[\/url\]/gs, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>')
        .replace(/\[url\](.*?)\[\/url\]/gs, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/\[img\](.*?)\[\/img\]/gs, '<img src="$1" alt="" style="max-width: 100%; border-radius: 8px;" loading="lazy">')
        .replace(/\[anchor=(.*?)\]\[\/anchor\]/gs, '<a id="$1" class="anchor"></a>')
        .replace(/\[latex\](.*?)\[\/latex\]/gs, '<span class="latex-math">$$$1$$</span>')
        .replace(/\[html\]([\s\S]*?)\[\/html\]/gs, '$1')
        .replace(/\n/g, '<br>');
}

function updatePreview() {
    const bbcodeEditor = document.getElementById('bbcode-editor');
    const previewContent = document.getElementById('preview-content');
    
    if (bbcodeEditor && previewContent) {
        const bbcode = bbcodeEditor.value;
        const html = bbcodeToHtml(bbcode);
        previewContent.innerHTML = html || '<p class="preview-placeholder">L\'aperçu apparaîtra ici...</p>';
    }
}

let previewMode = false;

function togglePreview() {
    previewMode = !previewMode;
    const btn = document.getElementById('preview-btn');
    const editorContainer = document.getElementById('editor-container');
    const previewContainer = document.getElementById('preview-container');
    
    if (!editorContainer || !previewContainer) return;
    
    if (previewMode) {
        updatePreview();
        editorContainer.style.flex = '0 0 40px';
        previewContainer.style.flex = '2';
        if (btn) btn.innerHTML = '✏️ <span class="btn-text">Éditer</span>';
    } else {
        editorContainer.style.flex = '2';
        previewContainer.style.flex = '0 0 40px';
        if (btn) btn.innerHTML = '👁️ <span class="btn-text">Aperçu</span>';
    }
}

// ============================================
// FONCTIONS DE SAUVEGARDE ET CHARGEMENT
// ============================================

async function savePost(asDraft = true) {
    const title = document.getElementById('post-title').value.trim();
    if (!title) {
        showNotification('Veuillez entrer un titre', 'error');
        document.getElementById('post-title').focus();
        return;
    }

    const bbcode = document.getElementById('bbcode-editor').value;
    const status = document.getElementById('post-status')?.value;
    const isDraft = asDraft || status === 'draft';
    const postLang = document.getElementById('post-language')?.value || '';

    const data = {
        title: title,
        content: bbcode,
        date: document.getElementById('post-date')?.value || new Date().toISOString().split('T')[0],
        category: document.getElementById('post-category')?.value || 'Non-classé',
        tags: (document.getElementById('post-tags')?.value || '').split(',').map(t => t.trim()).filter(t => t),
        description: document.getElementById('post-description')?.value || '',
        image: document.getElementById('post-image')?.value || '',
        draft: isDraft,
        hide_from_home: document.getElementById('hide-from-home')?.checked || false,
        language: postLang,
        parent_slug: currentParentSlug,
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

    const customSlug = document.getElementById('post-slug')?.value.trim();
    if (customSlug) data.slug = customSlug;

    try {
        if (currentSlug) {
            data.new_slug = data.slug || currentSlug;
            const res = await api.post(`/api/posts/${currentSlug}`, data);
            currentSlug = res.slug;
        } else {
            const res = await api.post('/api/posts', data);
            currentSlug = res.slug;
            window.history.replaceState({}, '', `/admin/editor?slug=${currentSlug}`);
        }
        showNotification(asDraft ? 'Brouillon sauvegardé !' : 'Article publié !', 'success');
    } catch (err) {
        showNotification('Erreur : ' + err.message, 'error');
    }
}

async function loadPost(slug) {
    try {
        const post = await api.get(`/api/posts/${slug}`);
        currentSlug = slug;
        
        document.getElementById('post-title').value = post.title || '';
        document.getElementById('post-date').value = post.date || new Date().toISOString().split('T')[0];
        document.getElementById('post-category').value = post.category || 'Non-classé';
        document.getElementById('post-tags').value = (post.tags || []).join(', ');
        document.getElementById('post-description').value = post.description || '';
        document.getElementById('post-image').value = post.image || '';
        
        if (document.getElementById('post-status')) {
            document.getElementById('post-status').value = post.draft ? 'draft' : 'published';
        }
        if (document.getElementById('post-slug')) {
            document.getElementById('post-slug').value = post.slug || '';
        }
        if (document.getElementById('hide-from-home')) {
            document.getElementById('hide-from-home').checked = post.hide_from_home || false;
        }
        
        // Charger la langue de l'article
        if (post.language && document.getElementById('post-language')) {
            const langSelect = document.getElementById('post-language');
            langSelect.value = post.language;
            updateLanguageBadge();
        }
        
        // Charger les métadonnées SEO
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
        
        // Charger le contenu BBCode
        if (document.getElementById('bbcode-editor')) {
            document.getElementById('bbcode-editor').value = post.content || '';
            updatePreview();
        }
    } catch (err) {
        showNotification('Erreur chargement : ' + err.message, 'error');
    }
}

// ============================================
// FONCTIONS DE GESTION DES LANGUES
// ============================================

async function loadLanguages() {
    try {
        const perso = await api.get('/api/personalization');
        availableLanguages = perso.languages || [];
        const langSelect = document.getElementById('post-language');
        
        if (langSelect) {
            langSelect.innerHTML = '<option value="">-- Sélectionner une langue --</option>';
            availableLanguages.forEach(lang => {
                if (lang.enabled !== false) {
                    langSelect.innerHTML += `<option value="${lang.code}" data-flag="${lang.flag || '🌐'}" data-name="${lang.name}">${lang.flag || '🌐'} ${lang.name}</option>`;
                }
            });
        }
    } catch (err) {
        console.error('Erreur chargement langues:', err);
    }
}

function updateLanguageBadge() {
    const langSelect = document.getElementById('post-language');
    const badge = document.getElementById('lang-badge');
    
    if (langSelect && badge) {
        const selectedLang = langSelect.value;
        if (selectedLang) {
            const option = langSelect.options[langSelect.selectedIndex];
            const flag = option.dataset.flag || '🌐';
            const name = option.dataset.name || '';
            badge.innerHTML = `${flag} ${name}`;
            badge.style.display = 'inline-flex';
            currentPostLang = selectedLang;
        } else {
            badge.style.display = 'none';
            currentPostLang = '';
        }
    }
}

// ============================================
// FONCTIONS MÉDIAS
// ============================================

function openMediaPickerForField(fieldId) {
    currentFieldTarget = fieldId;
    window.open('/admin/media', 'media-picker', 'width=900,height=700');
    window.addEventListener('message', receiveMediaUrl);
}

function openMediaPicker() {
    window.open('/admin/media', 'media-picker', 'width=800,height=600');
}

function receiveMediaUrl(event) {
    if (event.data && event.data.type === 'media-selected' && currentFieldTarget) {
        const targetField = document.getElementById(currentFieldTarget);
        if (targetField) {
            targetField.value = event.data.url;
            if (currentFieldTarget === 'post-image' || currentFieldTarget === 'og-image' || currentFieldTarget === 'twitter-image') {
                generateMetaFromImage();
            }
        }
        currentFieldTarget = null;
        window.removeEventListener('message', receiveMediaUrl);
    }
}

function generateMetaFromImage() {
    const imageUrl = document.getElementById('post-image')?.value;
    const title = document.getElementById('post-title')?.value;
    const description = document.getElementById('post-description')?.value;
    
    if (!imageUrl) {
        showNotification('Veuillez d\'abord sélectionner une image de couverture', 'error');
        return;
    }
    
    const ogTitleField = document.getElementById('og-title');
    const twitterTitleField = document.getElementById('twitter-title');
    const ogDescField = document.getElementById('og-description');
    const twitterDescField = document.getElementById('twitter-description');
    const ogImageField = document.getElementById('og-image');
    const twitterImageField = document.getElementById('twitter-image');
    
    if (ogTitleField && !ogTitleField.value && title) ogTitleField.value = title;
    if (twitterTitleField && !twitterTitleField.value && title) twitterTitleField.value = title;
    if (ogDescField && !ogDescField.value && description) ogDescField.value = description;
    if (twitterDescField && !twitterDescField.value && description) twitterDescField.value = description;
    if (ogImageField && !ogImageField.value) ogImageField.value = imageUrl;
    if (twitterImageField && !twitterImageField.value) twitterImageField.value = imageUrl;
    
    showNotification('Méta suggérées depuis l\'image de couverture', 'success');
}

// ============================================
// FONCTIONS UI (Sidebar, Theme, Modals)
// ============================================

function toggleSidebar() {
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed'));
}

function toggleMobileMenu() {
    document.querySelector('.admin-sidebar')?.classList.toggle('mobile-open');
}

function toggleEditorPane() {
    const container = document.getElementById('editor-container');
    if (!container) return;
    
    const isCollapsed = container.style.flex === '0 0 40px';
    const toggle = container.querySelector('.pane-toggle');
    const contentWrapper = container.querySelector('.editor-content-wrapper');
    
    if (isCollapsed) {
        container.style.flex = '2';
        if (contentWrapper) contentWrapper.style.display = 'block';
        if (toggle) toggle.textContent = '−';
    } else {
        container.style.flex = '0 0 40px';
        if (contentWrapper) contentWrapper.style.display = 'none';
        if (toggle) toggle.textContent = '+';
    }
}

function togglePreviewPane() {
    const container = document.getElementById('preview-container');
    if (!container) return;
    
    const isCollapsed = container.style.flex === '0 0 40px';
    const toggle = container.querySelector('.pane-toggle');
    const contentWrapper = container.querySelector('.preview-content-wrapper');
    
    if (isCollapsed) {
        container.style.flex = '2';
        if (contentWrapper) contentWrapper.style.display = 'block';
        if (toggle) toggle.textContent = '−';
    } else {
        container.style.flex = '0 0 40px';
        if (contentWrapper) contentWrapper.style.display = 'none';
        if (toggle) toggle.textContent = '+';
    }
}

function toggleSettingsSidebar() {
    document.body.classList.toggle('settings-collapsed');
    localStorage.setItem('settingsCollapsed', document.body.classList.contains('settings-collapsed'));
    const icon = document.querySelector('.settings-toggle .toggle-icon');
    if (icon) icon.textContent = document.body.classList.contains('settings-collapsed') ? '◀' : '▶';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

function logout() {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location = '/admin/login';
}

// ============================================
// FONCTIONS DE NOTIFICATION
// ============================================

function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? 'var(--admin-success)' : type === 'warning' ? 'var(--admin-warning)' : 'var(--admin-danger)'};
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ============================================
// THÈME
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcons(next);
}

function updateThemeIcons(theme) {
    document.querySelectorAll('.theme-icon-light, .theme-icon-dark').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll(`.theme-icon-${theme}`).forEach(el => {
        if (el) el.style.display = 'inline';
    });
}

// ============================================
// INITIALISATION
// ============================================

function init() {
    // Charger les langues
    loadLanguages();
    
    // Initialiser la date
    const dateInput = document.getElementById('post-date');
    if (dateInput && !dateInput.value) {
        dateInput.valueAsDate = new Date();
    }
    
    // Vérifier si on édite un article existant
    const params = new URLSearchParams(window.location.search);
    const editingSlug = params.get('slug');
    if (editingSlug) {
        loadPost(editingSlug);
    }
    
    // Écouter les changements dans l'éditeur BBCode
    const bbcodeEditor = document.getElementById('bbcode-editor');
    if (bbcodeEditor) {
        bbcodeEditor.addEventListener('input', () => {
            if (previewMode) updatePreview();
        });
    }
    
    // Raccourcis clavier
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            savePost(true);
        }
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
        }
    });
    
    // Fermer les modals en cliquant à l'extérieur
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Restaurer l'état de la sidebar
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        document.body.classList.add('sidebar-collapsed');
    }
    
    // Restaurer l'état des paramètres
    if (localStorage.getItem('settingsCollapsed') === 'true') {
        document.body.classList.add('settings-collapsed');
        const icon = document.querySelector('.settings-toggle .toggle-icon');
        if (icon) icon.textContent = '◀';
    }
    
    // Initialiser le thème
    initTheme();
}

// Démarrer l'initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}