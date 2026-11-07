"""Validate the static app support pages without network access."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
FOLDERS = ("done-and-dated", "spin-sprout", "walk-ledger", "note-porch")
errors = []


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
        self.title = False
        self.heading = False
        self.language = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.title |= tag == "title"
        self.heading |= tag == "h1"
        self.language |= tag == "html" and bool(attrs.get("lang"))
        if tag == "script":
            errors.append("Support pages must not introduce scripts")
        if attrs.get("id"):
            if attrs["id"] in self.ids:
                errors.append("Duplicate page id: " + attrs["id"])
            self.ids.add(attrs["id"])
        self.links.extend(attrs[k] for k in ("href", "src") if attrs.get(k))


pages = {}
for folder in FOLDERS:
    for path in (ROOT / folder).rglob("*.html"):
        page = Page()
        text = path.read_text(encoding="utf-8")
        page.feed(text)
        pages[path.resolve()] = page
        if not all((page.title, page.heading, page.language)):
            errors.append(f"{path.relative_to(ROOT)}: title, h1 or language missing")
        if "https://apportico.github.io/" in text:
            errors.append(f"{path.relative_to(ROOT)}: old hosting link remains")

if len(pages) != 21:
    errors.append(f"Expected 21 support/privacy/language pages, got {len(pages)}")

for path, page in pages.items():
    for reference in page.links:
        url = urlsplit(reference)
        if url.scheme or url.netloc:
            if url.netloc != "syymza.github.io":
                continue
            target = ROOT / unquote(url.path).lstrip("/")
        else:
            target = path.parent / unquote(url.path) if url.path else path
        target = target.resolve()
        if target.is_dir():
            target /= "index.html"
        if not target.is_relative_to(ROOT) or not target.exists():
            errors.append(f"{path.relative_to(ROOT)}: missing local target {reference}")
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f"{path.relative_to(ROOT)}: missing fragment {reference}")

if errors:
    raise SystemExit("\n".join(errors))
print(f"PASS: {len(pages)} static support pages; titles, languages, links and fragments")
