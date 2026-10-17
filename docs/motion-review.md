# Swiss workshop motion review

The existing native-scroll scene renderer is retained. The change replaces instant chapter/city jumps with native smooth scrolling, cancels a pending navigation on wheel, touch, pointer or scroll-key input, and moves keyboard focus to the destination only after it arrives. Direct hash loads remain immediate. Resizing preserves the visual progress instead of snapping the renderer to the sampled scroll target. Reduced motion still selects the static document.

The six-section story, public links, map coordinates and illustration geometry are unchanged. The selected Archivo treatment has more open headline tracking and width than the exploration. Its self-hosted variable WOFF2 is 89,232 bytes versus the 658,596-byte source TTF, with the original OFL licence preserved. Preload plus optional font display avoids a late typeface swap on a slow first visit.

## Checks

- Repository local-reference check, JavaScript syntax check and whitespace/diff check pass.
- All six scenes and six city selections pass in installed Chrome and macOS Playwright WebKit at 1440×900, 390×844, 320×668, 768×1024 and 844×390. Headings use one upright colour treatment; no SVG black-fill regression or horizontal overflow was recorded.
- Chapter navigation is visibly intermediate after 120 ms, rather than an instant destination jump. Rapid destination changes settle on the latest chapter, with focus moved after arrival. Wheel interruption stops the pending destination. Static view, keyboard skip navigation and a reduced-motion preference change during a transition pass.
- Forward and reverse CDP touch swipes pass in Chrome phone emulation. Orientation changes during a transition preserve normalized scroll position within 0.001 of a chapter unit.
- Slow wheel, fast wheel, continuous synthetic wheel, reversals, navigation and interruption were profiled before/after in separate runs. Recordings and intermediate frames were inspected. No console errors were recorded in the functional checks.
- Delaying the font by 1.2 seconds recorded Chrome CLS 0. Font-unavailable fallback layouts fit all six scenes at 320×668. WebKit lacks the layout-shift observer, so no WebKit CLS value is claimed.

## Measured frame timing

These are local headless browser rAF samples during synthetic input and settling, not physical display frame-rate or hardware-trackpad measurements.

| Engine | Baseline p95 interval | Candidate p95 interval | Candidate p95 renderer work |
| --- | --- | --- | --- |
| Chrome | 16.7–16.8 ms | 16.7–16.8 ms | at most 0.2 ms |
| WebKit | 18 ms | 17–18 ms | at most 1 ms, coarse timer resolution |

The reviewed candidate run had one 33.3 ms interval among 1,892 Chrome samples and none above 25 ms among 1,615 WebKit samples. No Chrome long task was recorded. The benefit is smoother, interruptible navigation and resize continuity; these measurements do not establish a general frame-rate improvement over the already steady baseline.

An initial WebKit desktop profiling run reported impossible distances and was discarded. A focused fresh run with dimension logging confirmed the expected 900 px stage, 9,594 px track and correct scroll destinations. The invalid run was retained outside the implementation branch for review rather than used in the table.

## Limits

WebKit phone scrolling used sampled native scroll positions because its automation API does not support native mobile wheel/swipe injection. It was also checked through its chapter and city controls. Chrome's swipe input is emulated. A physical iPhone, physical trackpad, low-power device, thermal stress and real Safari browser were not tested. Native smooth-scroll timing can differ between browser engines.

This PR remains a draft. Maintainer approval is required before merge or publication.
