# App support and privacy pages

These static pages reuse the existing published app support and privacy content. This migration changes hosting, not the apps' privacy practices, feature scope or review status. Existing URLs must remain available until replacements are deployed and verified.

| App | Support | Privacy |
| --- | --- | --- |
| Done & Dated | [Support](../done-and-dated/index.html) | [Privacy](../done-and-dated/privacy.html) |
| Spin Sprout | [Support](../spin-sprout/support.html) and [existing six-language index](../spin-sprout/index.html) | [Privacy](../spin-sprout/privacy.html) |
| WalkLedger | [Support](../walk-ledger/support.html) | [Privacy](../walk-ledger/privacy.html) |
| Dimensions Planner | [Existing personal-host support](https://syymza.github.io/dimensions-planner-support/) | [Existing personal-host privacy](https://syymza.github.io/dimensions-planner-support/privacy.html) |

Dimensions Planner already uses `syymza.github.io`; its website-only repository and existing paths remain unchanged. No source app code, unfinished translations, marketing videos, account details or private release evidence are published here.

## Verification

Run the normal site checks and the focused support-page check:

```sh
python3 scripts/check-site.py
python3 scripts/check-app-support.py
node --check app.js
```

The focused check covers all 19 migrated HTML pages, page language/title/heading, local and same-host links, fragment targets, and the absence of scripts or old-host links in the new pages. It does not verify live deployment or external service availability. Check the deployed URLs before changing App Store fields or app links.

Keep the current language scope and privacy meaning unchanged during URL migration. App Store fields may be locked while a version is in review; preserve the pending submission and record any URL update that must wait. Updating a source link does not change an already distributed binary.

## Browser preview

The migrated pages were checked locally in Chrome at 1280 × 900 and 390 × 844 viewport settings. All 19 pages had no horizontal overflow and their images loaded. The three main support pages accepted keyboard focus on their first navigation link. The copied pages contain no animation, transition or smooth-scrolling rules, so there is no new motion to suppress. Safari, physical phones and screen readers were not tested in this hosting-only change.

| App | Desktop capture | Phone-width capture |
| --- | --- | --- |
| Done & Dated | [Desktop](app-support-preview/done-and-dated-desktop.png) | [Phone](app-support-preview/done-and-dated-mobile.png) |
| Spin Sprout | [Desktop](app-support-preview/spin-sprout-desktop.png) | [Phone](app-support-preview/spin-sprout-mobile.png) |
| WalkLedger | [Desktop](app-support-preview/walk-ledger-desktop.png) | [Phone](app-support-preview/walk-ledger-mobile.png) |

These are local previews, not evidence that the public URLs have deployed. The existing source language attributes and Arabic right-to-left markup are preserved. Browser translation can alter displayed text and is not a translation-quality check.
