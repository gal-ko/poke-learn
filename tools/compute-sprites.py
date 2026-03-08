#!/usr/bin/env python3
"""
Scan all sprites/*.png and compute the opaque bounding-box padding for each.
Outputs scripts/data/sprite-meta.js with SPRITE_PAD and SPRITE_SIZE constants.

Pure-Python, no dependencies (handles 4-bit and 8-bit indexed PNGs with tRNS).
"""

import struct, zlib, os, sys

SPRITES_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'sprites')
OUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'sprite-meta.js')


def opaque_bounds(path):
    with open(path, 'rb') as f:
        f.read(8)  # PNG signature
        chunks = {}
        while True:
            raw = f.read(8)
            if len(raw) < 8:
                break
            length, ctype = struct.unpack('>I4s', raw)
            data = f.read(length)
            f.read(4)  # CRC
            ctype = ctype.decode()
            if ctype == 'IHDR':
                w, h, bd, ct = struct.unpack('>IIBB', data[:10])
                chunks['IHDR'] = (w, h, bd, ct)
            elif ctype == 'PLTE':
                chunks['PLTE'] = data
            elif ctype == 'tRNS':
                chunks['tRNS'] = data
            elif ctype == 'IDAT':
                chunks.setdefault('IDAT', b'')
                chunks['IDAT'] += data
            elif ctype == 'IEND':
                break

    w, h, bd, ct = chunks['IHDR']
    raw_data = zlib.decompress(chunks['IDAT'])
    trns = chunks.get('tRNS', b'')

    if ct != 3:  # only indexed-color supported
        return None

    if bd == 4:
        stride = 1 + (w + 1) // 2
    elif bd == 8:
        stride = 1 + w
    else:
        return None

    top, bottom, left, right = h, 0, w, 0
    for y in range(h):
        row_start = y * stride
        row = raw_data[row_start + 1 : row_start + stride]
        for x in range(w):
            if bd == 4:
                byte_idx = x // 2
                if byte_idx >= len(row):
                    continue
                idx = (row[byte_idx] >> 4) & 0x0F if x % 2 == 0 else row[byte_idx] & 0x0F
            else:
                if x >= len(row):
                    continue
                idx = row[x]

            alpha = trns[idx] if idx < len(trns) else 255
            if alpha > 0:
                top = min(top, y)
                bottom = max(bottom, y)
                left = min(left, x)
                right = max(right, x)

    if bottom < top:
        return (w, h, 0, 0, 0, 0)
    return (w, h, top, w - 1 - right, h - 1 - bottom, left)


def main():
    entries = {}
    canvas_size = None

    for fname in sorted(os.listdir(SPRITES_DIR)):
        if not fname.endswith('.png'):
            continue
        pid = fname[:-4]
        if not pid.isdigit():
            continue
        pid = int(pid)

        result = opaque_bounds(os.path.join(SPRITES_DIR, fname))
        if result is None:
            print(f'  skipping {fname} (unsupported format)', file=sys.stderr)
            continue

        w, h, pt, pr, pb, pl = result
        if canvas_size is None:
            canvas_size = w
        entries[pid] = (pt, pr, pb, pl)

    lines = [f'export const SPRITE_SIZE = {canvas_size};', '', 'export const SPRITE_PAD = {']
    for pid in sorted(entries):
        t, r, b, l = entries[pid]
        lines.append(f'  {pid}: [{t},{r},{b},{l}],')
    lines.append('};')

    with open(OUT_PATH, 'w') as f:
        f.write('\n'.join(lines) + '\n')

    print(f'Wrote {len(entries)} entries to {OUT_PATH}')


if __name__ == '__main__':
    main()
