from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

source = Path('/home/ubuntu/upload/1000019932.png')
out_dir = Path('/home/ubuntu/sultrakita-platform/next-app/public')
out_dir.mkdir(parents=True, exist_ok=True)

image = Image.open(source).convert('RGBA')
# Isolate the three-leaf mark from the supplied horizontal lockup.
mark = image.crop((0, 150, 820, 820))
alpha_bbox = mark.getchannel('A').getbbox()
if alpha_bbox is None:
    raise RuntimeError('Logo mark has no visible pixels')
mark = mark.crop(alpha_bbox)
mark = ImageOps.contain(mark, (448, 448), method=Image.Resampling.LANCZOS)

# Transparent mark for the responsive header.
header_canvas = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
header_canvas.alpha_composite(mark, ((512 - mark.width) // 2, (512 - mark.height) // 2))
header_canvas.save(out_dir / 'suki-logo-mark.png', optimize=True)

# Solid, high-contrast favicon background for reliable browser/tab legibility.
favicon = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
draw = ImageDraw.Draw(favicon)
draw.rounded_rectangle((12, 12, 500, 500), radius=116, fill='#0b5147')
favicon.alpha_composite(mark, ((512 - mark.width) // 2, (512 - mark.height) // 2))
favicon.resize((64, 64), Image.Resampling.LANCZOS).save(out_dir / 'icon.png', optimize=True)

print('created', out_dir / 'suki-logo-mark.png', out_dir / 'icon.png')
print('mark size', mark.size, 'source', image.size)
