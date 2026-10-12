"""Find quarter-circle door swings hinged on a unit's walls.

Reads a floor-plan image and wall centrelines. Prints a JSON list of
{x, y, r, score} in plan metres. A hit is a thin arc of door radius whose centre sits on a wall: dark
ink, or a grey line only a little darker than the floor. Tan badges and
orange shower marks are ignored (they are not low-chroma ink). A larger
circle that only grazes a smaller arc is dropped.

    python3 scripts/find_door_arcs.py plan.png ox oy mx my < walls.json

walls.json is [[x0, y0, x1, y1], ...]. ox, oy are the image pixel of world
(0, 0); mx, my are metres per pixel. Image +y is down.
"""
import json
import sys

import numpy as np
from PIL import Image


def local_mean(img, radius):
    padded = np.pad(img, radius, mode='edge')
    integral = np.cumsum(np.cumsum(padded, 0), 1)
    integral = np.pad(integral, ((1, 0), (1, 0)))
    span = 2 * radius + 1
    total = integral[span:, span:] - integral[:-span, span:] - integral[span:, :-span] + integral[:-span, :-span]
    return total[:img.shape[0], :img.shape[1]] / (span * span)


def thin_mask(mask, low, high):
    """Keep pixels whose 9×9 neighbourhood is a stroke, not a blob or a speckle."""
    ii = np.pad(mask.astype(np.int32), 1).cumsum(0).cumsum(1)
    k = 9
    count = ii[k:, k:] - ii[:-k, k:] - ii[k:, :-k] + ii[:-k, :-k]
    kept = np.zeros_like(mask)
    body = mask[4:4 + count.shape[0], 4:4 + count.shape[1]]
    kept[4:4 + count.shape[0], 4:4 + count.shape[1]] = body & (count >= low) & (count <= high)
    return kept


def linked(mask):
    """Drop isolated specks. A drawn line has neighbours along itself."""
    padded = np.pad(mask.astype(np.uint8), 1)
    neighbours = np.zeros(mask.shape, np.int16)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dx == 0 and dy == 0:
                continue
            neighbours += padded[1 + dy:1 + dy + mask.shape[0], 1 + dx:1 + dx + mask.shape[1]]
    return mask & (neighbours >= 2)


def long_strokes(mask, minimum=36):
    """Keep connected runs long enough to be a swing. Floor speckle is shorter."""
    ys, xs = np.nonzero(mask)
    count = len(ys)
    if count == 0:
        return mask
    height, width = mask.shape
    index = -np.ones((height, width), np.int32)
    index[ys, xs] = np.arange(count)
    parent = np.arange(count)

    def find(node):
        while parent[node] != node:
            parent[node] = parent[parent[node]]
            node = parent[node]
        return node

    for i, (y, x) in enumerate(zip(ys, xs)):
        for dy, dx in ((0, 1), (1, -1), (1, 0), (1, 1)):
            yy, xx = y + dy, x + dx
            if 0 <= yy < height and 0 <= xx < width and index[yy, xx] >= 0:
                root_a, root_b = find(i), find(index[yy, xx])
                if root_a != root_b:
                    parent[root_b] = root_a
    roots = np.fromiter((find(i) for i in range(count)), np.int32, count=count)
    sizes = np.bincount(roots)
    kept = sizes[roots] >= minimum
    out = np.zeros_like(mask)
    out[ys[kept], xs[kept]] = True
    return out


def close_mask(mask):
    """Bridge a one-pixel gap so a thin grey arc stays one stroke."""
    padded = np.pad(mask, 1)
    height, width = mask.shape
    dilated = np.zeros_like(mask)
    for dy in range(3):
        for dx in range(3):
            dilated |= padded[dy:dy + height, dx:dx + width]
    padded = np.pad(dilated, 1)
    closed = np.ones_like(mask)
    for dy in range(3):
        for dx in range(3):
            closed &= padded[dy:dy + height, dx:dx + width]
    return closed


def strokes(path):
    im = Image.open(path).convert('RGB')
    arr = np.asarray(im).astype(np.float32)
    lum = arr.mean(axis=2)
    chroma = arr.max(axis=2) - arr.min(axis=2)
    # Brochure ink: black or dark grey, nearly neutral. Dashed swings live here.
    dark = (lum < 130) & (chroma < 50)
    ink = linked(thin_mask(dark, 4, 18))
    # Rendered plans draw the swing as a thin grey line, only a little darker
    # than the wood floor, and the line breaks over the grain. Keep the thin
    # pixels, join one-pixel gaps to decide which run is long enough to be a
    # swing, then sample the thin pixels only so the inside of the quadrant
    # stays empty.
    delta = local_mean(lum, 5) - lum
    faint = (delta >= 8) & (lum >= 100) & (lum <= 230)
    core = linked(thin_mask(faint, 3, 14))
    grey = core & long_strokes(close_mask(core), minimum=24)
    return ink | grey, lum.shape[0], lum.shape[1]


def find_arcs(path, ox, oy, mx, my, walls):
    stroke, height, width = strokes(path)
    # 5 cm through the usual leaf sizes. A 10 cm step misses a grey arc whose
    # radius falls between the samples: the hit window is only a couple of pixels.
    radii = [0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00, 1.10, 1.20]
    # Twenty samples. A real swing, solid or dashed, lands on the stroke
    # most of the way around. Furniture that the template merely crosses
    # does not.
    angles = np.linspace(0.15, 0.92, 20)
    hits = []
    for x0, y0, x1, y1 in walls:
        dx, dy = x1 - x0, y1 - y0
        length = float(np.hypot(dx, dy))
        if length < 0.4:
            continue
        ux, uy = dx / length, dy / length
        nx, ny = -uy, ux
        # 3 cm. A grey swing only scores when the sample sits on its hinge.
        s = 0.18
        while s < length - 0.12:
            hx, hy = x0 + ux * s, y0 + uy * s
            for sign in (1, -1):
                for nsign in (1, -1):
                    ax, ay = sign * ux, sign * uy
                    bx, by = nsign * nx, nsign * ny
                    for radius in radii:
                        ok = 0
                        inner = 0
                        for t in angles:
                            ang = t * np.pi / 2
                            cang, sang = np.cos(ang), np.sin(ang)
                            def on_stroke(rad):
                                px = hx + rad * (cang * ax + sang * bx)
                                py = hy + rad * (cang * ay + sang * by)
                                ix = int(round(ox + px / mx))
                                iy = int(round(oy - py / my))
                                for oy_ in range(-2, 3):
                                    for ox_ in range(-2, 3):
                                        yy, xx = iy + oy_, ix + ox_
                                        if 0 <= yy < height and 0 <= xx < width and stroke[yy, xx]:
                                            return True
                                return False
                            if on_stroke(radius):
                                ok += 1
                            # A swing is empty inside. Wardrobe louvres fill the quadrant.
                            if on_stroke(radius * 0.45):
                                inner += 1
                        # A real swing is empty inside. A larger circle that only
                        # grazes a smaller arc picks that arc up in the interior,
                        # so the inside has to stay nearly clear.
                        if ok >= 16 and inner <= 3:
                            hits.append((ok, hx, hy, radius))
            s += 0.03
    hits.sort(reverse=True)
    kept = []
    for score, x, y, radius in hits:
        if any(abs(x - kx) < 0.35 and abs(y - ky) < 0.35 for _, kx, ky, _ in kept):
            continue
        kept.append((score, x, y, radius))
    return [{'x': round(x, 3), 'y': round(y, 3), 'r': radius, 'score': score} for score, x, y, radius in kept]


def main():
    path, ox, oy, mx, my = sys.argv[1:]
    walls = json.load(sys.stdin)
    arcs = find_arcs(path, float(ox), float(oy), float(mx), float(my), walls)
    json.dump(arcs, sys.stdout)


if __name__ == '__main__':
    main()
