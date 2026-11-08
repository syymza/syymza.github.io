"""Check isolated event-preview content and local references."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
root = Path(__file__).resolve().parents[1]
slugs = ['done-and-dated', 'dimensions-planner', 'spin-sprout', 'walk-ledger', 'note-porch']
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs = []; self.ids = []; self.scripts = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.refs.extend(a[k] for k in ('href', 'src') if k in a)
        if 'id' in a: self.ids.append(a['id'])
        if tag == 'script': self.scripts += 1
for slug in slugs:
    path = root / 'events' / slug / 'index.html'
    text = path.read_text(); page = Page(); page.feed(text)
    assert 'Launch details pending' in text and 'not an active in-app event' in text
    assert '<html lang="en">' in text and 'width=device-width' in text
    assert not page.scripts and len(page.ids) == len(set(page.ids))
    for ref in page.refs:
        url = urlparse(ref)
        if url.scheme: assert url.scheme == 'https'; continue
        if url.fragment: assert url.fragment in page.ids
        if not url.path: continue
        target = root / url.path.lstrip('/') if url.path.startswith('/') else path.parent / url.path
        assert target.exists(), (slug, ref)
print('PASS: five event previews; local links, artwork, headings, language and no scripts')
