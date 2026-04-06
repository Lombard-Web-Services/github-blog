# GitHub Blog - Version Statique

Un générateur de blog statique complet, multilingue et hautement personnalisable, optimisé pour GitHub Pages.

---

## Table des matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Architecture technique](#architecture-technique)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Déploiement sur GitHub Pages](#déploiement-sur-github-pages)
- [Structure du projet](#structure-du-projet)
- [Intégration PostgreSQL](#intégration-postgresql)
- [Support multilingue](#support-multilingue)
- [Dépannage](#dépannage)
- [Licence](#licence)

---

## Présentation

GitHub Blog est un générateur de blog statique conçu pour créer et gérer un blog professionnel avec une interface d'administration intuitive, sans base de données ni serveur dynamique.

### Version Statique

Cette version est spécialement optimisée pour être hébergée dans un sous-dossier d'un dépôt GitHub (ex: `/github-blog/dist/`). Tous les liens sont générés de manière relative ou absolue selon votre configuration, permettant un fonctionnement parfait sur GitHub Pages.

**Lien de téléchargement :** [github-blog-static.zip](https://github.com/Lombard-Web-Services/github-blog/raw/refs/heads/main/github-blog-static.zip)

---

## Fonctionnalités

### Gestion de contenu

- Création, modification et suppression d'articles au format Markdown avec frontmatter
- Éditeur BBCode riche avec aperçu en temps réel
- Gestion des catégories et tags avec comptage automatique
- Brouillons et articles planifiés
- Masquage d'articles de la page d'accueil
- URLs personnalisables (slugs)
- Articles masqués (accessibles par URL mais non listés)

### Support multilingue

**7 langues intégrées :**

| Code | Langue | Drapeau | Direction |
|------|--------|---------|-----------|
| fr | Français | 🇫🇷 | LTR |
| en | English | 🇬🇧 | LTR |
| ar | العربية | 🇸🇦 | RTL |
| hi | हिन्दी | 🇮🇳 | LTR |
| zh | 中文 | 🇨🇳 | LTR |
| ary | الدارجة | 🇲🇦 | RTL |
| ber | ⵜⴰⵎⴰⵣⵉⵖⵜ | ⵣ | LTR |

- Détection automatique de la langue du navigateur
- Sélecteur de langue dans l'interface
- Traductions complètement personnalisables
- Support des langues RTL (Arabe, Darija)

### SEO et métadonnées

- Configuration globale des métadonnées SEO
- Balises Open Graph pour les réseaux sociaux
- Twitter Cards
- Sitemap XML multilingue automatique
- Flux RSS par langue
- URLs canoniques
- Meta robots personnalisables
- Génération automatique des métadonnées depuis les images
- Meta tags personnalisables par article
- Image SEO par article avec redimensionnement automatique (1200x630 pour Open Graph)

### Interface d'administration

- Tableau de bord avec statistiques
- Éditeur BBCode avec barre d'outils complète
- Gestionnaire de médias avec upload et génération automatique de variantes (thumb, medium, large)
- Configuration du menu de navigation
- Personnalisation des couleurs et du hero section
- Gestion des langues disponibles
- Configuration du footer
- Mode sombre/clair

### Performance et optimisation

- Génération statique complète pour un chargement ultra-rapide
- Optimisation automatique des images avec génération de variantes WebP
- Cache des assets statiques
- Fichier `.nojekyll` pour compatibilité GitHub Pages
- Structure de dossiers optimisée pour le SEO

### Intégration PostgreSQL (optionnel)

- Support optionnel de PostgreSQL pour la journalisation
- Historique des versions des articles
- Compteurs de catégories et tags
- Sauvegardes automatiques
- Logs d'administration

---

## Architecture technique

### Technologies utilisées

| Technologie | Version | Usage |
|-------------|---------|-------|
| Python | 3.11+ | Langage principal |
| Jinja2 | 3.1.2 | Moteur de templates |
| Markdown | 3.5.1 | Contenu des articles |
| Pillow | 10.1.0 | Traitement d'images |
| PyYAML | 6.0.1 | Configurations |
| BBCode | Personnalisé | Formatage riche |
| CSS3 | - | Styles avec variables CSS |
| JavaScript | Vanilla | Interactivité |

### Structure des URLs en mode statique

```
https://votre-user.github.io/mon-repo/dist/
├── fr/                          # Page d'accueil française
│   ├── index.html
│   ├── blog/
│   │   └── article-slug/
│   │       └── index.html
│   ├── articles/                # Archive
│   │   └── index.html
│   └── static/                  # Assets par langue
├── en/                          # Version anglaise
├── ar/                          # Version arabe (RTL)
├── static/                      # Assets globaux
│   ├── css/
│   ├── js/
│   └── uploads/                 # Images optimisées
├── sitemap.xml                  # Sitemap multilingue
└── 404.html                     # Page d'erreur
```

---

## Installation

### Pré-requis

- Python 3.11 ou supérieur
- pip (gestionnaire de paquets Python)
- Git (optionnel, pour cloner le dépôt)

### Étapes d'installation

#### 1. Téléchargement

**Depuis le dépôt GitHub :**

```bash
git clone https://github.com/Lombard-Web-Services/github-blog.git
cd github-blog
```

**Ou téléchargez l'archive ZIP :**

```bash
wget https://github.com/Lombard-Web-Services/github-blog/raw/refs/heads/main/github-blog-static.zip
unzip github-blog-static.zip
cd github-blog
```

#### 2. Installation des dépendances

```bash
pip install -r requirements.txt
```

**Dépendances installées :**

| Package | Version | Description |
|---------|---------|-------------|
| markdown | 3.5.1 | Conversion Markdown vers HTML |
| PyYAML | 6.0.1 | Gestion des fichiers de configuration |
| Jinja2 | 3.1.2 | Moteur de templates |
| Pillow | 10.1.0 | Traitement et optimisation d'images |
| python-frontmatter | 1.0.0 | Gestion du frontmatter YAML |
| watchdog | 3.0.0 | Surveillance des fichiers (optionnel) |
| psycopg2-binary | 2.9.9 | Support PostgreSQL (optionnel) |

#### 3. Vérification de l'installation

```bash
python3 --version
pip list | grep -E "markdown|PyYAML|Jinja2|Pillow"
```

---

## Configuration

### Configuration de base

#### Site configuration (`content/config/site.yaml`)

```yaml
site:
  title: "Mon Blog Multilingue"
  description: "Blog technique et créatif multilingue"
  url: "https://votre-username.github.io/votre-repo/"
  language: "fr"
  author: "Votre Nom"
  email: "contact@example.com"

pagination:
  posts_per_page: 10
```

#### Configuration statique (`content/config/static_config.yaml`)

```yaml
enabled: true
base_url: /votre-repo/dist
output_dir: dist
auto_build_on_publish: false
```

**Notes :**
- `base_url` : URL de base pour la version statique (ex: `/mon-repo/dist`)
- Laissez vide pour des chemins relatifs

#### Menu de navigation (`content/config/menu.yaml`)

```yaml
menu:
  logo:
    enabled: false
    url: ''
    text: Mon Blog
  language_switcher:
    enabled: true
    position: right
    default: fr
  items:
    - title: Accueil
      url: /
      type: page
```

### Personnalisation avancée

#### Langues (`content/config/personalization.yaml`)

```yaml
languages:
  - code: fr
    name: Français
    flag: "🇫🇷"
    direction: ltr
    enabled: true
    default: true
  - code: en
    name: English
    flag: "🇬🇧"
    direction: ltr
    enabled: true
```

#### Hero Section

```yaml
hero:
  enabled: true
  image: /static/uploads/hero.jpg
  title: "Bienvenue sur mon blog"
  subtitle: "Partage de connaissances"
  title_color: "#ffffff"
  subtitle_color: "rgba(255,255,255,0.9)"
  gradient_start: "#3b82f6"
  gradient_end: "#1d4ed8"
  gradient_angle: 135
  overlay_opacity: 40
  resize_mode: cover
```

#### SEO global

```yaml
seo:
  global:
    robots: "index, follow, max-snippet:-1, max-image-preview:large"
    theme_color: "#000000"
    author: "Votre Nom"
  twitter:
    card: "summary_large_image"
    site: "@votrecompte"
  og:
    type: "website"
    locale: "fr_FR"
    site_name: "Mon Blog"
  images:
    default_og: "/static/images/og-default.jpg"
    default_twitter: "/static/images/twitter-default.jpg"
```

---

## Utilisation

### Génération de la version statique

**Génération simple (chemins relatifs) :**

```bash
python3 build.py --static
```

**Génération avec URL de base personnalisée :**

```bash
python3 build.py --static --base-url "/votre-repo/dist"
```

**Génération pour GitHub Pages :**

```bash
python3 build.py --static --base-url "/mon-repo/dist"
```

### Création d'articles

**Via ligne de commande :**

```bash
python3 new_post.py "Titre de mon article"
```

**Via l'interface d'administration :**

1. Lancez le serveur : `python3 serve.py`
2. Accédez à http://localhost:8000/admin
3. Mot de passe par défaut : `admin123`
4. Cliquez sur "Nouvel article"

### Structure d'un article Markdown

```markdown
---
title: "Titre de l'article"
date: "2024-01-15"
description: "Description pour le SEO"
tags: ["python", "web", "tutoriel"]
category: "Programmation"
draft: false
image: "/static/uploads/image-couverture.jpg"
language: "fr"
hide_from_home: false
hidden: false
seo_title: "Titre SEO personnalisé"
seo_description: "Description SEO personnalisée"
seo_image: "/static/uploads/seo-image.jpg"
---

Contenu de l'article en BBCode...

[b]Texte en gras[/b]
[i]Texte en italique[/i]
[h1]Titre principal[/h1]
[code python]
print("Hello World")
[/code]
```

**Champs disponibles :**

| Champ | Type | Description |
|-------|------|-------------|
| `title` | string | Titre de l'article |
| `date` | string | Date de publication (YYYY-MM-DD) |
| `description` | string | Description pour le SEO |
| `tags` | array | Liste des tags |
| `category` | string | Catégorie de l'article |
| `draft` | boolean | Brouillon (true/false) |
| `image` | string | Image de couverture |
| `language` | string | Code langue (fr, en, etc.) |
| `hide_from_home` | boolean | Masquer de la page d'accueil |
| `hidden` | boolean | Article masqué (accessible par URL uniquement) |
| `seo_title` | string | Titre SEO personnalisé |
| `seo_description` | string | Description SEO personnalisée |
| `seo_image` | string | Image SEO spécifique (1200x630 recommandé) |

### Commandes disponibles

| Commande | Description |
|----------|-------------|
| `python3 build.py` | Build standard (mode développement) |
| `python3 build.py --static` | Build statique pour GitHub Pages |
| `python3 build.py --static --base-url "/chemin"` | Build statique avec URL de base |
| `python3 serve.py` | Lance le serveur de développement |
| `python3 new_post.py "Titre"` | Crée un nouvel article |

---

## Déploiement sur GitHub Pages

### Méthode 1 : Dossier /dist (recommandée)

#### 1. Générez la version statique

```bash
python3 build.py --static --base-url "/votre-repo/dist"
```

#### 2. Configurez GitHub Pages

1. Allez dans **Settings > Pages** de votre dépôt
2. **Source** : "Deploy from a branch"
3. **Branche** : main (ou master)
4. **Dossier** : /dist
5. Cliquez sur **Save**

#### 3. Accédez à votre blog

Votre blog sera accessible à :
```
https://votre-username.github.io/votre-repo/dist/
```

### Méthode 2 : Branche gh-pages

#### 1. Créez la branche gh-pages

```bash
git checkout --orphan gh-pages
git rm -rf .
```

#### 2. Copiez les fichiers générés

```bash
cp -r dist/* .
git add .
git commit -m "Deploy static blog"
git push origin gh-pages
```

#### 3. Configurez GitHub Pages

- **Source** : "Deploy from a branch"
- **Branche** : gh-pages
- **Dossier** : / (root)

### Structure de déploiement recommandée

```
votre-depot/
├── .gitignore
├── README.md
├── build.py              # Script de build
├── serve.py              # Serveur de dev
├── requirements.txt      # Dépendances Python
├── content/              # Sources (non déployé)
│   ├── posts/
│   ├── pages/
│   ├── images/
│   └── config/
├── templates/            # Templates Jinja2
├── static/               # Assets sources
└── dist/                 # VERSION STATIQUE (déployée)
    ├── index.html
    ├── fr/
    ├── en/
    ├── static/
    └── sitemap.xml
```

---

## Structure du projet

```
github-blog/
├── build.py                 # Script principal de génération
├── serve.py                 # Serveur de développement
├── database.py              # Gestionnaire PostgreSQL (optionnel)
├── new_post.py              # Utilitaire de création d'articles
├── requirements.txt         # Dépendances Python
│
├── content/                 # Contenu source
│   ├── posts/               # Articles Markdown
│   │   └── *.md
│   ├── pages/               # Pages statiques
│   │   └── *.md
│   ├── images/              # Images source
│   │   └── *.jpg,*.png
│   └── config/              # Fichiers de configuration
│       ├── site.yaml        # Configuration du site
│       ├── menu.yaml        # Menu de navigation
│       ├── footer.yaml      # Pied de page
│       ├── personalization.yaml  # Personnalisation
│       ├── settings.yaml    # Paramètres généraux
│       ├── static_config.yaml    # Configuration statique
│       └── i18n/            # Traductions
│           ├── fr.yaml
│           ├── en.yaml
│           ├── ar.yaml
│           ├── hi.yaml
│           ├── zh.yaml
│           ├── ary.yaml
│           └── ber.yaml
│
├── templates/               # Templates Jinja2
│   ├── base.html            # Template de base
│   ├── index.html           # Page d'accueil
│   ├── post.html            # Page article
│   ├── page.html            # Page statique
│   ├── search.html          # Page de recherche
│   ├── 404.html             # Page d'erreur
│   ├── rss.xml              # Flux RSS
│   ├── sitemap.xml          # Sitemap
│   └── partials/            # Fragments réutilisables
│       ├── head.html
│       ├── header.html
│       ├── footer.html
│       └── post_card.html
│
├── static/                  # Assets statiques
│   ├── css/                 # Styles
│   │   ├── main.css         # Styles principaux
│   │   ├── dark.css         # Mode sombre
│   │   ├── code.css         # Coloration syntaxique
│   │   ├── admin.css        # Styles admin
│   │   └── admin_additions.css
│   ├── js/                  # JavaScript
│   │   ├── main.js          # Fonctionnalités principales
│   │   ├── search.js        # Moteur de recherche
│   │   ├── bbcode-parser.js # Parseur BBCode frontend
│   │   └── admin/           # Administration
│   │       ├── api.js
│   │       ├── editor.js
│   │       └── media.js
│   └── images/              # Images par défaut
│
└── dist/                    # OUTPUT STATIQUE (à déployer)
    ├── index.html
    ├── 404.html
    ├── sitemap.xml
    ├── fr/
    ├── en/
    ├── ar/
    ├── hi/
    ├── zh/
    ├── ary/
    ├── ber/
    └── static/
        ├── css/
        ├── js/
        └── uploads/         # Images optimisées
```

---

## Intégration PostgreSQL

### Configuration

#### 1. Activez PostgreSQL dans les paramètres

```yaml
# content/config/settings.yaml
postgresql:
  enabled: true
  host: localhost
  port: 5432
  database: blog
  user: postgres
  password: votre_mot_de_passe
  sslmode: prefer
```

#### 2. Créez la base de données

```sql
CREATE DATABASE blog;
CREATE USER blog_user WITH PASSWORD 'mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE blog TO blog_user;
```

#### 3. Créez les tables

Depuis l'interface d'administration : **Settings > PostgreSQL > "Créer les tables"**

### Fonctionnalités avec PostgreSQL

| Fonctionnalité | Description |
|----------------|-------------|
| Journalisation | Toutes les actions administrateur sont loguées |
| Historique | Chaque modification d'article est versionnée |
| Statistiques | Compteurs de catégories et tags |
| Sauvegardes | Export SQL automatique |
| Recherche | Indexation avancée (optionnel) |

### Commandes PostgreSQL utiles

**Sauvegarde manuelle :**

```bash
python3 -c "from database import db_manager; db_manager.load_config(); db_manager.create_backup()"
```

**Consultation des logs :**

```bash
psql -d blog -c "SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 10;"
```

**Statistiques :**

```bash
psql -d blog -c "SELECT * FROM categories ORDER BY post_count DESC;"
```

---

## Support multilingue

### Ajouter une nouvelle langue

#### 1. Ajoutez la langue dans `personalization.yaml`

```yaml
languages:
  - code: es
    name: Español
    flag: "🇪🇸"
    direction: ltr
    enabled: true
```

#### 2. Créez le fichier de traduction

```bash
cp content/config/i18n/fr.yaml content/config/i18n/es.yaml
```

#### 3. Traduisez le contenu du fichier

#### 4. Activez le sélecteur de langue dans `menu.yaml`

```yaml
language_switcher:
  enabled: true
  position: right
  default: fr
```

### Structure des fichiers de traduction

```yaml
# content/config/i18n/fr.yaml
lang: fr
direction: ltr
name: Français
flag: "🇫🇷"

nav:
  home: "Accueil"
  articles: "Articles"
  about: "À propos"
  search: "Recherche"

blog:
  read_more: "Lire la suite"
  published_on: "Publié le"
  comments: "Commentaires"

error:
  title: "Page non trouvée"
  message: "Désolé, la page n'existe pas."
  back_home: "Retour à l'accueil"
```

---

## Dépannage

### Problèmes courants

#### Erreur : "TemplateNotFound: 404.html"

**Solution :** Vérifiez que le fichier `templates/404.html` existe.

```bash
ls -la templates/404.html
```

#### Les images ne s'affichent pas en mode statique

**Solution :** Vérifiez votre configuration `base_url`

```bash
python3 build.py --static --base-url "/votre-chemin/dist"
```

#### Les liens des articles sont cassés

**Solution :** Assurez-vous que les URLs incluent la langue

```html
<!-- Dans vos templates, utilisez toujours make_url() -->
<a href="{{ make_url('/' + current_lang + '/blog/' + post.slug + '/') }}">
```

#### Erreur YAML dans les fichiers de traduction

**Solution :** Validez la syntaxe YAML

```bash
python3 -c "import yaml; yaml.safe_load(open('content/config/i18n/fr.yaml'))"
```

#### Le build statique échoue

**Solution :** Nettoyez et relancez

```bash
rm -rf dist/
python3 build.py --static --base-url "/votre-chemin/dist"
```

### Logs et debug

**Activez les logs verbose :**

```python
# Dans build.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Consultez les logs du serveur :**

```bash
python3 serve.py 2>&1 | tee server.log
```

---

## Licence

MIT License - Copyright (c) 2026 Lombard Web Services

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## Support et contact

- **Documentation** : https://github.com/Lombard-Web-Services/github-blog
- **Issues** : https://github.com/Lombard-Web-Services/github-blog/issues
- **Email** : contact@lombard-web-services.com

---

## Remerciements

- Python Software Foundation
- Jinja2 contributors
- Markdown project
- Pillow developers
- Toute la communauté open source et Kimi et DeepSeek

---

<p align="center">
  <strong>Star ce projet si vous le trouvez utile !</strong>
</p>
