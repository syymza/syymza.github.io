"""Regenerate or verify the CSS font from its canonical, licensed WOFF2 file."""
import argparse
import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PATTERN = r"(@font-face\{font-family:Archivo;src:url\(')([^']+)('\) format\('woff2'\);[^}]+\})"


def font_errors(root=ROOT):
    css = (root / "style.css").read_text()
    match = re.search(PATTERN, css)
    if not match:
        return ["Archivo font-face declaration is missing"]
    expected = "data:font/woff2;base64," + base64.b64encode(
        (root / "assets/fonts/archivo-latin-variable.woff2").read_bytes()
    ).decode("ascii")
    errors = []
    if match[2] != expected:
        errors.append("embedded Archivo differs from the canonical WOFF2; run scripts/embedded_font.py")
    if "font-display:block" not in match[3]:
        errors.append("embedded Archivo must block text only while its local data is decoded")
    return errors


def embed(root=ROOT):
    css_path = root / "style.css"
    css = css_path.read_text()
    match = re.search(PATTERN, css)
    if not match:
        raise ValueError("Archivo font-face declaration is missing")
    data = "data:font/woff2;base64," + base64.b64encode(
        (root / "assets/fonts/archivo-latin-variable.woff2").read_bytes()
    ).decode("ascii")
    declaration = match[3].replace("font-display:optional", "font-display:block")
    css_path.write_text(css[:match.start()] + match[1] + data + declaration + css[match.end():])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if not args.check:
        embed()
    errors = font_errors()
    if errors:
        raise SystemExit("\n".join(errors))
    print("PASS: embedded Archivo matches the canonical WOFF2")
