from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path('/home/ubuntu/sultrakita-platform')
frames = [
    Path('/home/ubuntu/screenshots/127_0_0_1_2026-09-04_00-04-18_2421.webp'),
    Path('/home/ubuntu/screenshots/127_0_0_1_2026-09-04_00-04-27_9827.webp'),
    Path('/home/ubuntu/screenshots/127_0_0_1_2026-09-04_00-04-18_2421.webp'),
]
output = root / 'docs' / 'suki-slider-demo.gif'
processed = []
for index, path in enumerate(frames):
    image = Image.open(path).convert('RGB')
    crop = image.crop((8, 82, 560, 710)).resize((662, 754))
    canvas = Image.new('RGB', (662, 790), '#f7f6f1')
    canvas.paste(crop, (0, 36))
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, 662, 36), fill='#0b2622')
    draw.text((18, 10), f'SUKI SUITS  ·  PHOTO CAROUSEL  ·  FRAME {index + 1}', fill='#f7f6f1')
    processed.append(canvas)
processed[0].save(output, save_all=True, append_images=processed[1:], duration=[1400, 1800, 1400], loop=0, optimize=True)
print(output)
