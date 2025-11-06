from PIL import Image, ImageDraw
import os

base_path = os.path.join(os.path.dirname(__file__), 'assets', 'images')

# Imagen jugador
img = Image.new('RGBA', (50, 50), (0, 128, 255, 255))
draw = ImageDraw.Draw(img)
draw.ellipse((10, 10, 40, 40), fill=(255,255,255,255))
img.save(os.path.join(base_path, 'player.png'))

# Imagen enemigo
img = Image.new('RGBA', (50, 50), (255, 0, 0, 255))
draw = ImageDraw.Draw(img)
draw.rectangle((15, 15, 35, 35), fill=(0,0,0,255))
img.save(os.path.join(base_path, 'enemy.png'))

# Imágenes de explosión
explosion_path = os.path.join(base_path, 'explosions')
os.makedirs(explosion_path, exist_ok=True)

for i in range(1, 6):
    img = Image.new('RGBA', (60, 60), (255, 255, 0, 0))
    draw = ImageDraw.Draw(img)
    x0 = 5 * i
    y0 = 5 * i
    x1 = 60 - 5 * i
    y1 = 60 - 5 * i
    if x1 > x0 and y1 > y0:
        color = (255, max(0, 255 - i * 40), 0, 255)
        draw.ellipse((x0, y0, x1, y1), fill=color)
    img.save(os.path.join(explosion_path, f'explosion{i}.png'))
