# Archivo web font

Copyright 2020 The Archivo Project Authors. Distributed under the [SIL Open Font License 1.1](OFL.txt).

Source: [Archivo in Google Fonts](https://github.com/google/fonts/tree/main/ofl/archivo), upright `Archivo[wdth,wght].ttf`. The 34,468-byte self-hosted WOFF2 retains weight 400–720 and width 86–100. Its character set covers printable ASCII, a nonbreaking space, curly quotes, en dash and available arrow glyphs. The existing English copy is covered; expand the subset before adding other characters.

The font is embedded as a data URL in the existing render-blocking stylesheet. It arrives with the CSS rather than through a second request. `font-display: block` allows the already-local data to decode before text paints; it does not wait for another network fetch. This avoids the previous optional-font policy retaining a wider system fallback on a first visit. A corrupt or unsupported font still falls back to readable system text. A future Content Security Policy must allow `data:` fonts.

The canonical WOFF2 remains here with its licence. Regenerate the CSS after replacing it:

```sh
python3 scripts/embedded_font.py
```

The standard site check verifies that the embedded bytes match this file, so the two cannot silently drift.

Generated with FontTools 4.67.0 and Brotli 1.2.0:

```sh
fonttools varLib.instancer 'Archivo[wdth,wght].ttf' wght=400:720 wdth=86:100 --output=archivo-limited.ttf
pyftsubset archivo-limited.ttf --output-file=archivo-latin-variable.woff2 --flavor=woff2 --unicodes='U+0020-007E,U+00A0,U+2013,U+2018-2019,U+201C-201D,U+2190-2199' --layout-features='*'
python3 scripts/embedded_font.py
```

There is no third-party font request, runtime font loader or JavaScript visibility gate. Normal content edits require no build step.
