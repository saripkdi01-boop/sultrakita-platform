from pathlib import Path
from PIL import Image, ImageOps

source = Path('/home/ubuntu/upload/1000019932.png')
out_dir = Path('/home/ubuntu/sultrakita-platform/next-app/public')
out_dir.mkdir(parents=True, exist_ok=True)

image = Image.open(source).convert('RGBA')
# The supplied lockup has the standalone leaf mark on the left. Preserve its
# transparency and crop only that mark for responsive header/favicon use.
mark = image.crop((0, 150, 820, 820))
alpha_bbox = mark.getchannel('A').getbbox()
if alpha_bbox is None:
    raise RuntimeError('Logo mark has no visible pixels')
mark = mark.crop(alpha_bbox)
mark = ImageOps.contain(mark, (512, 512), method=Image.Resampling.LANCZOS)
canvas = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
canvas.alpha_composite(mark, ((512 - mark.width) // 2, (512 - mark.height) // 2))
canvas.save(out_dir / 'suki-logo-mark.png', optimize=True)

# A compact PNG favicon is more broadly supported than a large source image.
favicon = canvas.resize((64, 64), Image.Resampling.LANCZOS)
favicon.save(out_dir / 'icon.png', optimize=True)
print('created', out_dir / 'suki-logo-mark.png', out_dir / 'icon.png')
print('mark size', mark.size, 'source', image.size)
