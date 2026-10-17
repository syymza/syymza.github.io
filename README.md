# Daniele Zanni

A personal portfolio about software, engineering leadership and curiosity, told through six illustrated chapters and an interactive map of the places I have called home.

**[Visit the portfolio](https://syymza.github.io/)** · [Report an issue](https://github.com/syymza/syymza.github.io/issues) · [Contributing](CONTRIBUTING.md)

![Portfolio introduction](docs/preview.jpg)

## Explore

Scroll through the story or use the chapter navigation. In Places, choose Milan, Oulu, London, Sydney, Dubai or Abu Dhabi to follow the journey. Use **Motion on** to switch to a static page; the system's reduced-motion preference also selects that view. Keyboard navigation and a skip link provide another way through the story.

The site uses plain HTML, CSS, JavaScript and inline SVG. There is no build step, dependency install, backend, analytics or runtime API. Research, patent, LinkedIn and GitHub links open external sites when followed.

## Run locally

From the repository root, with Python 3 installed:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://localhost:8000). Stop the server with Ctrl+C. Any static web server works; use one rather than opening `index.html` directly.

## Check a change

Python 3.9+ and Node.js 24 run the same checks as CI:

```sh
python3 scripts/check-site.py
node --check app.js
```

The link check validates local HTML assets, fragment targets, unique HTML IDs and local Markdown file links. It does not validate external sites or browser behavior.

For changes to the site, check all six chapters and city selections at desktop and phone widths, keyboard navigation, static view and reduced motion. Verify that the map, labels and inline SVG illustrations remain visible in Chrome and Safari/WebKit. Responsive emulation is useful; state separately whether a physical phone was tested.

## Source guide

| File | Responsibility |
| --- | --- |
| `index.html` | Story content, city details, inline illustrations and map geometry |
| `style.css` | Responsive layouts, typography, motion and static view |
| `app.js` | Scroll transitions, navigation, city selection and accessibility state |
| `favicon.svg` | Site icon |
| `scripts/check-site.py` | Offline local-reference checks |

The map uses clipped [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/) 1:110m land data, which is public domain. City markers and coastlines share an equirectangular projection. Connecting lines show residence order, not flight routes. The patent illustration is a redrawing of Figure 1 from [US11301538B1](https://patents.google.com/patent/US11301538B1/en).

## Contributing and publication

**All changes require a PR; do not push directly to `main`.** See [CONTRIBUTING.md](CONTRIBUTING.md). GitHub Pages publishes `main` from `/ (root)` at the link above. The validation workflow runs on PRs and `main`; it does not deploy. Merging requires maintainer approval and can publish changes.

No license has been selected for this project. The map data's public-domain status does not license the rest of the repository.
