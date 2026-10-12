"""Find quarter-circle door swings hinged on a unit's walls.

Reads a floor-plan image and wall centrelines. Prints a JSON list of
{x, y, r, score} in plan metres. A hit is a thin dark arc (solid or dashed)
of door radius whose centre sits on a wall. Tan badges and orange shower
marks are ignored (they are not low-chroma ink).

    python3 scripts/find_door_arcs.py plan.png ox oy mx my < walls.json

walls.json is [[x0, y0, x1, y1], ...]. ox, oy are the image pixel of world
(0, 0); mx, my are metres per pixel. Image +y is down.
"""
import json
import sys

import numpy as np
from PIL import Image


def strokes(path):
    im = Image.open(path).convert('RGB')
    arr = np.asarray(im).astype(np.int16)
    lum = arr.mean(axis=2)
    chroma = arr.max(axis=2) - arr.min(axis=2)
    dark = (lum < 120) & (chroma < 45)
    height, width = dark.shape
    ii = np.pad(dark.astype(np.int32), 1).cumsum(0).cumsum(1)
    k = 9
    count = ii[k:, k:] - ii[:-k, k:] - ii[k:, :-k] + ii[:-k, :-k]
    stroke = np.zeros_like(dark)
    body = dark[4:4 + count.shape[0], 4:4 + count.shape[1]]
    stroke[4:4 + count.shape[0], 4:4 + count.shape[1]] = body & (count >= 4) & (count <= 16)
    return stroke, height, width


def find_arcs(path, ox, oy, mx, my, walls):
    stroke, height, width = strokes(path)
    radii = [0.70, 0.80, 0.90, 1.00, 1.10, 1.20]
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
        s = 0.25
        while s < length - 0.2:
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
                        if ok >= 16 and inner <= 5:
                            hits.append((ok, hx, hy, radius))
            s += 0.12
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
