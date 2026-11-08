# App support and privacy pages

These static pages reuse the existing published app support and privacy content. This migration changes hosting, not the apps' privacy practices, feature scope or review status. Existing URLs must remain available until replacements are deployed and verified.

Note Porch is a separate addition, documented below. Its pages are new English support and privacy content, not part of the earlier migration.

| App | Support | Privacy |
| --- | --- | --- |
| Done & Dated | [Support](../done-and-dated/index.html) | [Privacy](../done-and-dated/privacy.html) |
| Spin Sprout | [Support](../spin-sprout/support.html) and [47-language index](../spin-sprout/index.html) | [Privacy](../spin-sprout/privacy.html) |
| WalkLedger | [Support](../walk-ledger/support.html) | [Privacy](../walk-ledger/privacy.html) |
| Note Porch | [Support](../note-porch/support.html) | [Privacy](../note-porch/privacy.html) |
| Dimensions Planner | [Existing personal-host support](https://syymza.github.io/dimensions-planner-support/) | [Existing personal-host privacy](https://syymza.github.io/dimensions-planner-support/privacy.html) |

Dimensions Planner already uses `syymza.github.io`; its website-only repository and existing paths remain unchanged. No source app code, unfinished translations, marketing videos, account details or private release evidence are published here.

## Verification

Run the normal site checks and the focused support-page check:

```sh
python3 scripts/check-site.py
python3 scripts/check-app-support.py
node --check app.js
```

The focused check covers all 103 HTML pages (97 Spin Sprout pages, four other migrated pages and two Note Porch pages), page language/title/heading, local and same-host links, fragment targets, and the absence of scripts or old-host links in the pages. It does not verify live deployment or external service availability. Check the deployed URLs before changing App Store fields or app links.

Keep the current language scope and privacy meaning unchanged during URL migration. App Store fields may be locked while a version is in review; preserve the pending submission and record any URL update that must wait. Updating a source link does not change an already distributed binary.

## Earlier migration browser preview

The migrated pages were checked locally in Chrome at 1280 × 900 and 390 × 844 viewport settings. All 19 pages had no horizontal overflow and their images loaded. The three main support pages accepted keyboard focus on their first navigation link. The copied pages contain no animation, transition or smooth-scrolling rules, so there is no new motion to suppress. Safari, physical phones and screen readers were not tested in this hosting-only change.

| App | Desktop capture | Phone-width capture |
| --- | --- | --- |
| Done & Dated | [Desktop](app-support-preview/done-and-dated-desktop.png) | [Phone](app-support-preview/done-and-dated-mobile.png) |
| Spin Sprout | [Desktop](app-support-preview/spin-sprout-desktop.png) | [Phone](app-support-preview/spin-sprout-mobile.png) |
| WalkLedger | [Desktop](app-support-preview/walk-ledger-desktop.png) | [Phone](app-support-preview/walk-ledger-mobile.png) |

These are local previews, not evidence that the public URLs have deployed. The existing source language attributes and Arabic right-to-left markup are preserved. Browser translation can alter displayed text and is not a translation-quality check.

## Note Porch addition

The two English pages describe local note storage and shared widget access, manual Home Screen and Lock Screen setup, One note and Daily plan modes, four color presets, text sizes and alignment, system-controlled updates, and backup/recovery operations. The privacy text covers user-selected Files/cloud-provider exports, readable unencrypted backup files, previous snapshots and recovery retention, deletion limits, visible widget text and cached configuration titles. It makes no App Store availability or release-approval claim. The publisher and support address match the current WalkLedger pages.

The pages reuse the sibling support pages' system typography, colors, reading width and responsive spacing. Styles are isolated in `note-porch/style.css`; no other app page or portfolio asset is changed. The pages have a skip link, visible keyboard-focus rules and no scripts, animation, transitions or smooth scrolling. The app source and private release evidence are not included.

Publication requires maintainer review and approval under [CONTRIBUTING.md](../CONTRIBUTING.md). Before approval, check desktop and phone layouts, keyboard navigation, reduced motion and links in a browser, and attach screenshots or a short recording to the PR. Those browser checks have not yet been completed for Note Porch. The earlier migration screenshots above are not evidence for these new pages. Static checks do not establish browser accessibility or physical-device behavior.

After an approved merge and Pages deployment, verify these exact URLs before changing store fields:

- https://syymza.github.io/note-porch/support.html
- https://syymza.github.io/note-porch/privacy.html

## Spin Sprout language expansion

The47-language support/privacy content was AI authored and contextually reviewed, without human review. It includes47 support/privacy pairs, a language index and English root aliases. The owner explicitly approved public publication on November8,2026 and confirmed `syymza.github.io` as the destination. Existing apportico URLs are retained for already distributed binaries and the pending App Store submission. This website update does not alter that submission or claim version1.1 is live.
