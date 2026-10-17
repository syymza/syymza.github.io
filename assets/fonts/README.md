# Archivo web font

Copyright 2020 The Archivo Project Authors. Distributed under the [SIL Open Font License 1.1](OFL.txt).

Source: [Archivo in Google Fonts](https://github.com/google/fonts/tree/main/ofl/archivo), upright `Archivo[wdth,wght].ttf`. The self-hosted WOFF2 retains weight 400–720 and width 86–100, with Latin, extended Latin, punctuation and arrow characters used by the site. There is no third-party font request.

Generated with FontTools 4.67.0 and Brotli 1.2.0:

```sh
fonttools varLib.instancer 'Archivo[wdth,wght].ttf' wght=400:720 wdth=86:100 --output=archivo-limited.ttf
pyftsubset archivo-limited.ttf --output-file=archivo-latin-variable.woff2 --flavor=woff2 --unicodes='U+0000-024F,U+1E00-1EFF,U+2000-206F,U+2190-21FF,U+2212' --layout-features='*'
```

The font is preloaded. `font-display: optional` avoids a late typeface swap and its possible layout shift on a slow first visit. A system sans-serif fallback remains usable when the font is unavailable.
