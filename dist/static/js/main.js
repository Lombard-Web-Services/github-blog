// ============================================
// MAIN.JS - Fonctionnalités du blog avec BBCode Parser
// ============================================

// ============================================
// BBCODE PARSER INTÉGRÉ
// ============================================

class BBCodeParser {
    constructor() {
        this.bbcodeRegex = {
            'b': { pattern: /\[b\](.*?)\[\/b\]/gs, replacement: '<strong>$1</strong>' },
            'i': { pattern: /\[i\](.*?)\[\/i\]/gs, replacement: '<em>$1</em>' },
            'u': { pattern: /\[u\](.*?)\[\/u\]/gs, replacement: '<u>$1</u>' },
            's': { pattern: /\[s\](.*?)\[\/s\]/gs, replacement: '<s>$1</s>' },
            'h1': { pattern: /\[h1\](.*?)\[\/h1\]/gs, replacement: '<h1>$1</h1>' },
            'h2': { pattern: /\[h2\](.*?)\[\/h2\]/gs, replacement: '<h2>$1</h2>' },
            'h3': { pattern: /\[h3\](.*?)\[\/h3\]/gs, replacement: '<h3>$1</h3>' },
            'h4': { pattern: /\[h4\](.*?)\[\/h4\]/gs, replacement: '<h4>$1</h4>' },
            'h5': { pattern: /\[h5\](.*?)\[\/h5\]/gs, replacement: '<h5>$1</h5>' },
            'h6': { pattern: /\[h6\](.*?)\[\/h6\]/gs, replacement: '<h6>$1</h6>' },
            'align': { 
                pattern: /\[align=(left|center|right|justify)\](.*?)\[\/align\]/gs, 
                replacement: '<div style="text-align: $1;">$2</div>' 
            },
            'quote': { 
                pattern: /\[quote(?:=(.*?))?\](.*?)\[\/quote\]/gs, 
                replacement: '<blockquote><cite>$1</cite><p>$2</p></blockquote>' 
            },
            'code': { 
                pattern: /\[code(?:=(\w+))?\](.*?)\[\/code\]/gs, 
                replacement: '<pre><code class="language-$1">$2</code></pre>' 
            },
            'url': { 
                pattern: /\[url=(.*?)\](.*?)\[\/url\]/gs, 
                replacement: '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>' 
            },
            'url_simple': { 
                pattern: /\[url\](.*?)\[\/url\]/gs, 
                replacement: '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>' 
            },
            'img': { 
                pattern: /\[img\](.*?)\[\/img\]/gs, 
                replacement: '<img src="$1" alt="" class="post-inline-image" loading="lazy">' 
            },
            'anchor': { 
                pattern: /\[anchor=(.*?)\](.*?)\[\/anchor\]/gs, 
                replacement: '<a id="$1" class="anchor">$2</a>' 
            },
            'latex': { 
                pattern: /\[latex\](.*?)\[\/latex\]/gs, 
                replacement: '<span class="latex-math">$$$$1$$</span>' 
            },
            'html': { 
                pattern: /\[html\](.*?)\[\/html\]/gs, 
                replacement: '$1' 
            }
        };
    }

    parse(bbcode) {
        if (!bbcode) return '';

        let html = bbcode;
        html = this.escapeHtmlExceptInHtmlTag(html);
        html = html.replace(/\n/g, '___NEWLINE___');

        const order = ['html', 'code', 'latex', 'quote', 'anchor', 'img', 'url', 'url_simple', 
                       'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'align'];

        for (const tag of order) {
            if (this.bbcodeRegex[tag]) {
                html = html.replace(this.bbcodeRegex[tag].pattern, this.bbcodeRegex[tag].replacement);
            }
        }

        html = html.replace(/class=""/g, '');
        html = html.replace(/class="language-"/g, '');
        html = html.replace(/style="text-align: ;"/g, '');
        html = html.replace(/<cite><\/cite>/g, '');
        html = html.replace(/___NEWLINE___/g, '<br>');
        html = html.replace(/(<br>){3,}/g, '<br><br>');

        return html;
    }

    escapeHtmlExceptInHtmlTag(text) {
        const htmlBlocks = [];
        text = text.replace(/\[html\](.*?)\[\/html\]/gs, (match, content) => {
            htmlBlocks.push(content);
            return `___HTML_BLOCK_${htmlBlocks.length - 1}___`;
        });

        text = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        htmlBlocks.forEach((block, index) => {
            text = text.replace(`___HTML_BLOCK_${index}___`, `[html]${block}[/html]`);
        });

        return text;
    }
}

const bbcodeParser = new BBCodeParser();

function renderBBCode(element, bbcode) {
    if (!element || !bbcode) return;
    const html = bbcodeParser.parse(bbcode);
    requestAnimationFrame(() => {
        element.style.opacity = '0';
        element.innerHTML = html;
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.3s ease';
            element.style.opacity = '1';
        });
    });
}

window.parseBBCode = function(bbcode) {
    return bbcodeParser.parse(bbcode);
};

// ============================================
// FONCTIONNALITÉS DU BLOG
// ============================================

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (navMenu && menuToggle) {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
        metaColorScheme.content = isDark ? 'dark' : 'light';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.documentElement.classList.add('dark');
    }
}

function initBBCodeRendering() {
    const postContent = document.getElementById('post-content');
    if (postContent) {
        const bbcodeContent = postContent.getAttribute('data-bbcode-content');
        if (bbcodeContent) {
            const contentMatch = bbcodeContent.match(/---[\s\S]*?---\s*([\s\S]*)/);
            const actualContent = contentMatch ? contentMatch[1] : bbcodeContent;
            renderBBCode(postContent, actualContent);
        }
    }

    const postDescription = document.querySelector('.post-description');
    if (postDescription) {
        const bbcodeDesc = postDescription.getAttribute('data-bbcode-description');
        if (bbcodeDesc) {
            renderBBCode(postDescription, bbcodeDesc);
        }
    }

    const imageCaption = document.querySelector('.post-image-caption');
    if (imageCaption) {
        const bbcodeCaption = imageCaption.getAttribute('data-bbcode-caption');
        if (bbcodeCaption) {
            renderBBCode(imageCaption, bbcodeCaption);
        }
    }

    document.querySelectorAll('[data-bbcode-excerpt]').forEach(el => {
        const bbcode = el.getAttribute('data-bbcode-excerpt');
        if (bbcode) {
            const excerpt = bbcode.substring(0, 255);
            renderBBCode(el, excerpt + (bbcode.length > 255 ? '...' : ''));
        }
    });
}

function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

function init() {
    loadTheme();
    initBBCodeRendering();
    if ('IntersectionObserver' in window) {
        setupScrollAnimations();
    }
    
    // Gestion du menu mobile au clic extérieur
    document.addEventListener('click', function(e) {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            menuToggle && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BBCodeParser, bbcodeParser, renderBBCode };
}