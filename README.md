# AntoninPoche.github.io

Personal academic website built with Jekyll and deployed on GitHub Pages.

## Stack

- Jekyll 4.3 with plain Liquid templates
- YAML data files under `_data/`
- Hand-written HTML includes under `_includes/`
- Custom CSS in `assets/css/main.css`
- Small vanilla JavaScript enhancements in `assets/js/main.js`

The site intentionally avoids Jekyll plugins so it stays compatible with GitHub Pages.

## Architecture

The site is a single-page static website.

1. `index.html` is the page entry point.
2. `_layouts/default.html` provides the document shell, shared metadata, CSS, and JavaScript.
3. `index.html` renders:
   - the left sidebar from `_includes/sidebar.html`
   - the sticky section navigation from `_includes/topnav.html`
   - each content block by iterating over `_data/sections.yml`
4. Each section is resolved through `_includes/section.html`, which delegates to `_includes/sections/<id>.html`.

That means the section order and labels are controlled in one place: [`_data/sections.yml`](_data/sections.yml).

## Content Model

Most content is data-driven:

- [`_data/sidebar.yml`](_data/sidebar.yml): profile, affiliations, contact links
- [`_data/intro.yml`](_data/intro.yml): homepage overview hero
- [`_data/research.yml`](_data/research.yml): research summary and focus cards
- [`_data/teaching.yml`](_data/teaching.yml): teaching timeline
- [`_data/news/index.yml`](_data/news/index.yml): news feed
- [`_data/publications/index.yml`](_data/publications/index.yml): ordered list of publication ids
- [`_data/publications/`](./_data/publications): publication entries
- [`_data/softwares/index.yml`](_data/softwares/index.yml): ordered list of software ids
- [`_data/softwares/`](./_data/softwares): software entries
- [`_data/posters.yml`](_data/posters.yml): poster gallery

Reusable content cards for publications and software are rendered through [`_includes/contribution.html`](_includes/contribution.html).

## Frontend Behavior

- [`assets/css/main.css`](assets/css/main.css) defines the full visual system and responsive layout.
- [`assets/js/main.js`](assets/js/main.js) adds:
  - sticky navigation active-state tracking
  - expandable descriptions for long contribution cards
  - expandable news history
  - a lightbox for publication illustrations and posters

## Local Development

Prerequisites:

- Ruby
- Bundler

Install dependencies:

```bash
bundle install
```

Run locally:

```bash
make local
```

Build the static site:

```bash
make build
```

## Update Workflow

- To reorder sections, edit [`_data/sections.yml`](_data/sections.yml).
- To update profile information or contact links, edit [`_data/sidebar.yml`](_data/sidebar.yml).
- To add a publication:
  1. Create a new YAML file in [`_data/publications/`](./_data/publications).
  2. Add its id to [`_data/publications/index.yml`](_data/publications/index.yml).
  3. Add any illustration under [`assets/img/`](./assets/img).
- To add a software project, follow the same pattern in [`_data/softwares/`](./_data/softwares).
- To add a news item, prepend it to [`_data/news/index.yml`](_data/news/index.yml).
- To add a poster, append an entry to [`_data/posters.yml`](_data/posters.yml) and place the image in [`assets/posters/`](./assets/posters).

## Deployment

The repository is GitHub Pages friendly:

- no custom plugins
- static assets only
- standard Jekyll layout/data/include structure

Pushing to the repository is enough for GitHub Pages to rebuild the site.
