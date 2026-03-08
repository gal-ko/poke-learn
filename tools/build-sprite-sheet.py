#!/usr/bin/env python3
"""
Stitch all sprites/*.png into a single sprite sheet and generate
src/data/sprite-positions.js with column/row lookup for each Pokemon ID.
"""

import os, math
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..')
SPRITES_DIR = os.path.join(ROOT, 'sprites')
OUT_IMG = os.path.join(ROOT, 'sprites', 'sheet.png')
OUT_JS = os.path.join(ROOT, 'src', 'data', 'sprite-positions.js')

CELL = 96
COLS = 16

def main():
    ids = []
    for fname in os.listdir(SPRITES_DIR):
        if fname.endswith('.png') and fname[:-4].isdigit():
            ids.append(int(fname[:-4]))
    ids.sort()

    rows = math.ceil(len(ids) / COLS)
    sheet = Image.new('RGBA', (COLS * CELL, rows * CELL), (0, 0, 0, 0))

    positions = {}
    for i, pid in enumerate(ids):
        col = i % COLS
        row = i // COLS
        img = Image.open(os.path.join(SPRITES_DIR, f'{pid}.png')).convert('RGBA')
        sheet.paste(img, (col * CELL, row * CELL))
        positions[pid] = (col, row)

    sheet.save(OUT_IMG, optimize=True)
    print(f'Wrote {OUT_IMG} ({COLS}x{rows} = {len(ids)} sprites)')

    lines = [f'var SPRITE_SHEET_COLS = {COLS};', f'var SPRITE_SHEET_ROWS = {rows};', f'var SPRITE_SHEET_CELL = {CELL};', '', 'var SPRITE_POS = {']
    for pid in sorted(positions):
        c, r = positions[pid]
        lines.append(f'  {pid}: [{c},{r}],')
    lines.append('};')

    with open(OUT_JS, 'w') as f:
        f.write('\n'.join(lines) + '\n')
    print(f'Wrote {len(positions)} entries to {OUT_JS}')

if __name__ == '__main__':
    main()
