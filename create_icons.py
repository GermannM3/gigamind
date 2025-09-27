#!/usr/bin/env python3
"""
Создание PNG иконок для PWA из SVG
"""
import os
from PIL import Image, ImageDraw, ImageFont
import colorsys

def create_gradient_icon(size, output_path):
    """Создает иконку с градиентом и символом AI"""
    # Создаем изображение
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Цвета градиента
    color1 = (102, 126, 234)  # #667eea
    color2 = (11, 31, 75)     # #0b1f4b
    
    # Рисуем градиентный фон
    for y in range(size):
        ratio = y / size
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
    
    # Закругленные углы
    corner_radius = max(10, size // 8)
    
    # Создаем маску для закругленных углов
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, size, size], corner_radius, fill=255)
    
    # Применяем маску
    img.putalpha(mask)
    
    # Рисуем символ AI/мозга
    center_x, center_y = size // 2, size // 2
    
    # Основной круг
    brain_size = size // 3
    draw.ellipse([
        center_x - brain_size, center_y - brain_size//2,
        center_x + brain_size, center_y + brain_size//2
    ], fill=(255, 255, 255, 180))
    
    # Нейронные узлы
    node_size = max(2, size // 50)
    nodes = [
        (center_x - brain_size//2, center_y - brain_size//4),
        (center_x + brain_size//2, center_y - brain_size//4),
        (center_x, center_y),
        (center_x - brain_size//3, center_y + brain_size//3),
        (center_x + brain_size//3, center_y + brain_size//3),
    ]
    
    for x, y in nodes:
        draw.ellipse([x-node_size, y-node_size, x+node_size, y+node_size], 
                    fill=(102, 126, 234, 255))
    
    # Соединительные линии
    connections = [
        (nodes[0], nodes[2]),
        (nodes[1], nodes[2]),
        (nodes[2], nodes[3]),
        (nodes[2], nodes[4]),
    ]
    
    line_width = max(1, size // 100)
    for start, end in connections:
        draw.line([start, end], fill=(102, 126, 234, 150), width=line_width)
    
    # Текст "G" или "AI"
    if size >= 128:
        try:
            font_size = size // 6
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        text = "G"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        text_x = center_x - text_width // 2
        text_y = center_y + brain_size//2 + 10
        
        draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)
    
    # Сохраняем
    img.save(output_path, 'PNG')
    print(f"✅ Создана иконка: {output_path} ({size}x{size})")

def main():
    """Создает все иконки для PWA"""
    static_dir = "/home/germannm/Документы/gigamind/static"
    os.makedirs(static_dir, exist_ok=True)
    
    # Размеры иконок для PWA
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    for size in sizes:
        output_path = os.path.join(static_dir, f"icon-{size}.png")
        create_gradient_icon(size, output_path)
    
    print("\n🎉 Все иконки созданы!")
    print("📱 Теперь можно запускать PWA приложение")

if __name__ == "__main__":
    main()
