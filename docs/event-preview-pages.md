# Event browser previews

Five isolated static pages use the accepted original concept illustrations and benefit-led titles. Existing portfolio, support and privacy content remains unchanged.

- [Done & Dated](../events/done-and-dated/index.html)
- [Dimensions Planner](../events/dimensions-planner/index.html)
- [Spin Sprout](../events/spin-sprout/index.html)
- [WalkLedger](../events/walk-ledger/index.html)
- [Note Porch](../events/note-porch/index.html)

Each page distinguishes its app's purpose from an event still in preparation. No release date, store availability, Duo compatibility or fold behavior is claimed. No download button or guessed app URL is included. Support and privacy links use the current published routes; Dimensions Planner retains its separate project-site routes.

## Deep-link boundary

These are browser information pages, not verified app deep links. They must not be entered into App Store Connect as functioning event destinations on the strength of this website change. Universal links still require a verified app identifier in an AASA file, associated-domain entitlement, relevant app routing, a released build, and cold/warm/first-install tests. No association file, app entitlement, scheme redirect, app code or App Store event is changed here. WalkLedger's submitted package remains untouched.

## Validation

Run from the repository root:

- `python3 scripts/check-site.py`
- `python3 scripts/check-app-support.py`
- `python3 scripts/check-event-pages.py`
- `node --check app.js`

All four checks pass locally. Source inspection confirms a responsive single-column breakpoint, visible focus and skip link, descriptive links, and no JavaScript or animation.

Browser QA is incomplete: headless Chromium cannot start in this execution environment because its process-singleton socket is not permitted; the WebKit runtime is absent. No desktop/phone screenshots, rendered-layout, keyboard-navigation or physical-device claims are made. Complete desktop/phone browser review and attach screenshots before approval. Reduced-motion presentation should be checked even though no motion is defined.

## Publication

This change remains draft until browser review and maintainer approval under [CONTRIBUTING.md](../CONTRIBUTING.md). CI is not approval. After an approved merge, verify the GitHub Pages deployment for the exact merged commit and HTTP responses for all five `/events/<app>/` routes. A branch or PR alone is not a live deployment.
