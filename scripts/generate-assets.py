#!/usr/bin/env python3
"""
Generate OG Image and Favicon for PIXIU Honeypot Demo
Design Philosophy: Gilded Entrapment
Second Pass: Refined for museum-quality craftsmanship
"""

import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
PUBLIC_DIR = PROJECT_ROOT / "public"
FONTS_DIR = Path.home() / ".claude/skills/canvas-design/canvas-fonts"

# Color Palette - Gilded Entrapment (refined)
COLORS = {
    "sand": "#f8f4e9",
    "sand_light": "#fdfbf7",
    "sand_dark": "#e8e0d0",
    "mint": "#5ef3d0",
    "mint_dark": "#3dd4b2",
    "mint_pale": "#d4f7ed",
    "ink": "#0f172a",
    "ink_light": "#1e293b",
    "ink_muted": "#475569",
    "amber": "#f59e0b",
    "amber_dark": "#d97706",
    "cream": "#fefdf8",
}

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_hexagon(draw, center_x, center_y, size, fill=None, outline=None, width=1):
    """Draw a hexagon at the specified center point"""
    points = []
    for i in range(6):
        angle = math.pi / 3 * i - math.pi / 6
        x = center_x + size * math.cos(angle)
        y = center_y + size * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, fill=fill, outline=outline, width=width)
    return points

def draw_honeycomb_pattern(draw, width, height, hex_size, offset_x=0, offset_y=0):
    """Draw a refined honeycomb pattern with depth variation"""
    hex_width = hex_size * math.sqrt(3)
    hex_height = hex_size * 2

    rows = int(height / (hex_height * 0.75)) + 3
    cols = int(width / hex_width) + 3

    ink_rgb = hex_to_rgb(COLORS["ink"])

    for row in range(-1, rows):
        for col in range(-1, cols):
            x = col * hex_width + offset_x
            if row % 2 == 1:
                x += hex_width / 2
            y = row * hex_height * 0.75 + offset_y

            # Create depth through varied opacity - stronger near edges
            distance_from_center = math.sqrt((x - width * 0.35)**2 + (y - height/2)**2)
            max_distance = math.sqrt((width * 0.7)**2 + (height/2)**2)
            opacity = max(0.02, 0.12 - (distance_from_center / max_distance) * 0.10)

            outline_color = (*ink_rgb, int(255 * opacity))
            draw_hexagon(draw, x, y, hex_size, outline=outline_color, width=1)

def create_og_image():
    """Create the OG image (1200x630) - Museum quality refinement"""
    width, height = 1200, 630

    # Create base image with sand background
    img = Image.new('RGBA', (width, height), hex_to_rgb(COLORS["sand"]) + (255,))
    draw = ImageDraw.Draw(img, 'RGBA')

    # Subtle gradient layers for depth
    mint_rgb = hex_to_rgb(COLORS["mint_pale"])
    for i in range(400):
        alpha = int(25 * (1 - i / 400))
        if alpha > 0:
            draw.ellipse([
                -100 - i, -200 - i,
                -100 + i * 2.5, -200 + i * 2.5
            ], fill=(*mint_rgb, alpha))

    # Secondary gradient (bottom right warmth)
    sand_dark = hex_to_rgb(COLORS["sand_dark"])
    for i in range(300):
        alpha = int(15 * (1 - i / 300))
        if alpha > 0:
            draw.ellipse([
                width - 100 - i, height + 100 - i,
                width - 100 + i * 2, height + 100 + i * 2
            ], fill=(*sand_dark, alpha))

    # Draw refined honeycomb pattern
    draw_honeycomb_pattern(draw, width, height, 40, offset_x=15, offset_y=8)

    # === Right side: Geometric trap composition ===
    center_x, center_y = width * 0.76, height * 0.48
    ink_rgb = hex_to_rgb(COLORS["ink"])
    mint_rgb = hex_to_rgb(COLORS["mint"])

    # Outer ethereal rings - the inescapable system
    for i, radius in enumerate([200, 165, 130, 95, 60]):
        opacity = 0.04 + i * 0.025
        width_line = 1 if i < 3 else 2
        draw.ellipse([
            center_x - radius, center_y - radius,
            center_x + radius, center_y + radius
        ], outline=(*ink_rgb, int(255 * opacity)), width=width_line)

    # Radial lines suggesting flow direction (in but not out)
    for angle in range(0, 360, 30):
        rad = math.radians(angle)
        inner_r, outer_r = 70, 200
        x1 = center_x + inner_r * math.cos(rad)
        y1 = center_y + inner_r * math.sin(rad)
        x2 = center_x + outer_r * math.cos(rad)
        y2 = center_y + outer_r * math.sin(rad)
        draw.line([(x1, y1), (x2, y2)], fill=(*ink_rgb, 15), width=1)

    # Central hexagon cluster - the honeypot core
    hex_positions = [(0, 0)]  # Center
    for i in range(6):  # Surrounding hexagons
        angle = math.pi / 3 * i
        hex_positions.append((math.cos(angle) * 52, math.sin(angle) * 52))

    for i, (ox, oy) in enumerate(hex_positions):
        hx, hy = center_x + ox, center_y + oy
        if i == 0:  # Center hexagon - the trap
            draw_hexagon(draw, hx, hy, 28,
                        fill=(*mint_rgb, 220),
                        outline=(*hex_to_rgb(COLORS["mint_dark"]), 255), width=2)
        else:
            opacity = 120 + (i * 15)
            draw_hexagon(draw, hx, hy, 24,
                        fill=(*mint_rgb, opacity),
                        outline=(*ink_rgb, 40), width=1)

    # Inner warning indicator
    amber_rgb = hex_to_rgb(COLORS["amber"])
    draw.ellipse([center_x - 12, center_y - 12, center_x + 12, center_y + 12],
                fill=(*hex_to_rgb(COLORS["ink"]), 255))
    draw.ellipse([center_x - 7, center_y - 7, center_x + 7, center_y + 7],
                fill=(*amber_rgb, 255))

    # === Left side: Typography composition ===
    # System fonts for Chinese support
    CHINESE_FONT = "/System/Library/Fonts/STHeiti Medium.ttc"
    CHINESE_FONT_ALT = "/System/Library/Fonts/Hiragino Sans GB.ttc"

    try:
        font_title = ImageFont.truetype(str(FONTS_DIR / "BricolageGrotesque-Bold.ttf"), 64)
        font_subtitle = ImageFont.truetype(str(FONTS_DIR / "InstrumentSans-Regular.ttf"), 24)
        # Use system font for Chinese characters
        try:
            font_chinese = ImageFont.truetype(CHINESE_FONT, 18)
            font_chinese_tag = ImageFont.truetype(CHINESE_FONT, 13)
        except:
            font_chinese = ImageFont.truetype(CHINESE_FONT_ALT, 18)
            font_chinese_tag = ImageFont.truetype(CHINESE_FONT_ALT, 13)
        font_tag = ImageFont.truetype(str(FONTS_DIR / "GeistMono-Regular.ttf"), 13)
        font_code = ImageFont.truetype(str(FONTS_DIR / "GeistMono-Regular.ttf"), 11)
    except Exception as e:
        print(f"Font loading note: {e}")
        font_title = ImageFont.load_default()
        font_subtitle = font_chinese = font_tag = font_code = font_chinese_tag = font_title

    ink_color = hex_to_rgb(COLORS["ink"])
    ink_muted = hex_to_rgb(COLORS["ink_muted"])
    mint_dark = hex_to_rgb(COLORS["mint_dark"])

    # Decorative top label
    draw.text((72, 85), "WEB3 SECURITY EDUCATION", font=font_tag, fill=(*ink_muted, 180))
    draw.line([(72, 105), (280, 105)], fill=(*ink_color, 40), width=1)

    # Main title - PIXIU
    title_y = 140
    draw.text((70, title_y), "PIXIU", font=font_title, fill=ink_color)

    # Honeypot subtitle
    subtitle_y = title_y + 78
    draw.text((72, subtitle_y), "Honeypot Demo", font=font_subtitle, fill=(*ink_color, 220))

    # Chinese tagline
    chinese_y = subtitle_y + 38
    draw.text((72, chinese_y), "貔貅盤 · ERC-20 互動教學", font=font_chinese, fill=(*ink_muted, 200))

    # Code snippet - subtle, like a watermark
    code_snippet = [
        "if (blacklist[from])",
        "  revert(\"blocked\");"
    ]
    code_y = chinese_y + 55
    for i, line in enumerate(code_snippet):
        draw.text((74, code_y + i * 16), line, font=font_code, fill=(*ink_color, 50))

    # Bottom accent (Chinese)
    draw.text((72, height - 65), "買得進 · 賣不掉", font=font_chinese_tag, fill=mint_dark)

    # Thin separator line
    draw.line([(72, height - 40), (250, height - 40)], fill=(*ink_color, 35), width=1)

    # Decorative dots (design detail)
    for i in range(5):
        dot_x = 260 + i * 12
        draw.ellipse([dot_x, height - 43, dot_x + 3, height - 40], fill=(*ink_color, 25 + i * 10))

    # === Final composition: thin border frame ===
    margin = 20
    draw.rectangle([margin, margin, width - margin, height - margin],
                  outline=(*ink_color, 20), width=1)

    # Save as high-quality PNG
    output_path = PUBLIC_DIR / "og-image.png"
    img_rgb = Image.new('RGB', img.size, hex_to_rgb(COLORS["sand"]))
    img_rgb.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
    img_rgb.save(output_path, quality=95, optimize=True)
    print(f"Created: {output_path}")

    return img

def create_favicon():
    """Create favicon and icons - refined geometric design"""
    sizes = {
        "favicon.ico": 32,
        "icon-192.png": 192,
        "icon-512.png": 512,
        "apple-touch-icon.png": 180,
    }

    for filename, size in sizes.items():
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img, 'RGBA')

        # Circular background with subtle gradient effect
        center = size / 2
        padding = size * 0.06

        # Outer ring (sand color)
        sand_rgb = hex_to_rgb(COLORS["sand"])
        draw.ellipse([padding, padding, size - padding, size - padding],
                    fill=sand_rgb + (255,))

        # Subtle inner shadow
        ink_rgb = hex_to_rgb(COLORS["ink"])
        shadow_padding = padding + size * 0.02
        for i in range(3):
            opacity = 8 - i * 2
            draw.ellipse([shadow_padding + i, shadow_padding + i,
                         size - shadow_padding - i, size - shadow_padding - i],
                        outline=(*ink_rgb, opacity), width=1)

        # Central hexagon - the honeypot
        hex_size = size * 0.30
        mint_rgb = hex_to_rgb(COLORS["mint"])
        draw_hexagon(draw, center, center, hex_size,
                    fill=mint_rgb + (255,),
                    outline=hex_to_rgb(COLORS["mint_dark"]) + (255,), width=max(1, size // 80))

        # Inner circle (the trap)
        inner_r = size * 0.11
        draw.ellipse([
            center - inner_r, center - inner_r,
            center + inner_r, center + inner_r
        ], fill=ink_rgb + (255,))

        # Warning dot
        dot_r = size * 0.045
        amber_rgb = hex_to_rgb(COLORS["amber"])
        draw.ellipse([
            center - dot_r, center - dot_r,
            center + dot_r, center + dot_r
        ], fill=amber_rgb + (255,))

        # Save
        output_path = PUBLIC_DIR / filename
        if filename.endswith('.ico'):
            # Create multiple sizes for ICO
            img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
            img_16 = img.resize((16, 16), Image.Resampling.LANCZOS)
            img_32.save(output_path, format='ICO', sizes=[(16, 16), (32, 32)])
        else:
            img.save(output_path, optimize=True)
        print(f"Created: {output_path}")

def create_svg_icon():
    """Create refined SVG icon"""
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fdfbf7"/>
      <stop offset="100%" style="stop-color:#e8e0d0"/>
    </linearGradient>
    <linearGradient id="hexGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#5ef3d0"/>
      <stop offset="100%" style="stop-color:#3dd4b2"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.1"/>
    </filter>
  </defs>
  <!-- Background circle -->
  <circle cx="50" cy="50" r="46" fill="url(#bgGrad)" filter="url(#shadow)"/>
  <!-- Hexagon honeypot -->
  <polygon points="50,20 74,35 74,65 50,80 26,65 26,35"
           fill="url(#hexGrad)" stroke="#3dd4b2" stroke-width="1.5"/>
  <!-- Inner trap circle -->
  <circle cx="50" cy="50" r="12" fill="#0f172a"/>
  <!-- Warning indicator -->
  <circle cx="50" cy="50" r="5" fill="#f59e0b"/>
</svg>'''

    output_path = PUBLIC_DIR / "icon.svg"
    output_path.write_text(svg_content)
    print(f"Created: {output_path}")

if __name__ == "__main__":
    PUBLIC_DIR.mkdir(exist_ok=True)
    print("=" * 50)
    print("Generating assets: Gilded Entrapment Philosophy")
    print("Second pass: Museum-quality refinement")
    print("=" * 50 + "\n")

    create_og_image()
    create_favicon()
    create_svg_icon()

    print("\n" + "=" * 50)
    print("All assets generated with meticulous craftsmanship!")
    print("=" * 50)
