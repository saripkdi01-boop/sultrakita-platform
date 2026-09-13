from pathlib import Path

path = Path('/home/ubuntu/work/sultrakita-platform/next-app/app/ajak-teman/page.tsx')
text = path.read_text()

import_line = "import { AppLayout } from '@/components/layout/AppLayout';\n"
if import_line not in text:
    marker = "import QRCode from 'qrcode';\n"
    if marker not in text:
        raise SystemExit('import marker not found')
    text = text.replace(marker, marker + import_line, 1)

old_start = '<main className="campaign-hub"><header className="campaign-top"><Link className="campaign-brand" href="/"><span>S</span>KI</Link><div className="campaign-top-links"><Link href="/promo">Promo Hub</Link><Link href="/">Kembali ke SultraKita</Link></div></header><div className="campaign-shell">'
# The source currently spells the brand as S U KI through nested markup; use the exact live prefix instead.
if old_start not in text:
    old_start = '<main className="campaign-hub"><header className="campaign-top"><Link className="campaign-brand" href="/"><span>U</span>KI</Link><div className="campaign-top-links"><Link href="/promo">Promo Hub</Link><Link href="/">Kembali ke SultraKita</Link></div></header><div className="campaign-shell">'
if old_start not in text:
    prefix = '<main className="campaign-hub"><header className="campaign-top">'
    start = text.find(prefix)
    if start < 0:
        raise SystemExit('campaign header prefix not found')
    shell = text.find('<div className="campaign-shell">', start)
    if shell < 0:
        raise SystemExit('campaign shell not found')
    text = text[:start] + '<AppLayout active="home"><main className="campaign-hub"><div className="campaign-shell">' + text[shell + len('<div className="campaign-shell">'):]
else:
    text = text.replace(old_start, '<AppLayout active="home"><main className="campaign-hub"><div className="campaign-shell">', 1)

ending = '</section></div></main>;\n}'
if ending not in text:
    raise SystemExit('page ending not found')
text = text.replace(ending, '</section></div></main></AppLayout>;\n}', 1)
path.write_text(text)
print('wrapped Ajak Teman in AppLayout')
