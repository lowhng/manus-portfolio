"""Copy the movable furniture out of the Ayanna model into a furniture-only model.

The Golden Leaf page reuses Ayanna's furniture but has its own walls, so it loads this
smaller file instead of the whole Ayanna apartment. Mesh data and materials are copied
byte for byte; nothing is re-encoded. Re-run after re-exporting the Ayanna model:

    python3 scripts/extract_furniture.py

Both files are base64-encoded GLB, the format ayanna/index.html already loads.
"""
import base64
import json
import re
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/ayanna/ayanna_model.txt"
OUT = ROOT / "public/shared/furniture.txt"

# Same list as MOVABLE in public/goldenleaf/index.html and public/ayanna/index.html
MOVABLE = re.compile(
    r"^(Armchair|Balcony_Chair_\d|Balcony_Plant_\d|Balcony_SideTable|Bed\d_Bed|Bed\d_Bedside(_[AB])?|Bed\d_Wardrobe"
    r"|Bed2_Plant|Coffee_Table|Dining_Chair_\w+|Dining_Table|Living_Plant_[LR]"
    r"|Master_(Bed|Bedside_[LR]|Desk|DeskChair|Dresser|Plant|Wardrobe)|Rug_\w+|Shoe_Cabinet|Sofa|TV_Unit)$"
)


def read_glb(data):
    magic, version, _ = struct.unpack_from("<III", data, 0)
    assert magic == 0x46546C67 and version == 2, "not a glTF 2.0 binary"
    jlen, _ = struct.unpack_from("<II", data, 12)
    gltf = json.loads(data[20:20 + jlen])
    blen, _ = struct.unpack_from("<II", data, 20 + jlen)
    start = 28 + jlen
    return gltf, data[start:start + blen]


def write_glb(gltf, bin_data):
    js = json.dumps(gltf, separators=(",", ":")).encode()
    js += b" " * (-len(js) % 4)
    bin_data += b"\0" * (-len(bin_data) % 4)
    total = 12 + 8 + len(js) + 8 + len(bin_data)
    return (struct.pack("<III", 0x46546C67, 2, total)
            + struct.pack("<II", len(js), 0x4E4F534A) + js
            + struct.pack("<II", len(bin_data), 0x004E4942) + bin_data)


def main():
    src, bin_data = read_glb(base64.b64decode(SRC.read_text().strip()))
    assert not src.get("images") and not src.get("textures"), "textures aren't handled; extend this script"

    roots = [n for n in src["scenes"][src.get("scene", 0)]["nodes"] if MOVABLE.match(src["nodes"][n].get("name", ""))]

    # Old index -> new index, in first-use order
    def remapper():
        table = {}
        return table, lambda i: table.setdefault(i, len(table))
    node_map, new_node = remapper()
    mesh_map, new_mesh = remapper()
    mat_map, new_mat = remapper()
    acc_map, new_acc = remapper()

    def walk(n):
        new_node(n)
        for c in src["nodes"][n].get("children", []):
            walk(c)
    for r in roots:
        walk(r)

    nodes = [None] * len(node_map)
    for old, new in node_map.items():
        node = dict(src["nodes"][old])
        if "children" in node:
            node["children"] = [node_map[c] for c in node["children"]]
        if "mesh" in node:
            node["mesh"] = new_mesh(node["mesh"])
        nodes[new] = node

    meshes = [None] * len(mesh_map)
    for old, new in mesh_map.items():
        mesh = json.loads(json.dumps(src["meshes"][old]))
        for p in mesh["primitives"]:
            p["attributes"] = {k: new_acc(a) for k, a in p["attributes"].items()}
            if "indices" in p:
                p["indices"] = new_acc(p["indices"])
            if "material" in p:
                p["material"] = new_mat(p["material"])
            for t in p.get("targets", []):
                for k in t:
                    t[k] = new_acc(t[k])
        meshes[new] = mesh

    materials = [None] * len(mat_map)
    for old, new in mat_map.items():
        materials[new] = src["materials"][old]

    # Each accessor gets its own copy of its buffer view, packed into a fresh buffer
    accessors, views, out = [None] * len(acc_map), [], bytearray()
    for old, new in sorted(acc_map.items(), key=lambda kv: kv[1]):
        acc = dict(src["accessors"][old])
        assert "sparse" not in acc, "sparse accessors aren't handled; extend this script"
        view = dict(src["bufferViews"][acc["bufferView"]])
        chunk = bin_data[view.get("byteOffset", 0):view.get("byteOffset", 0) + view["byteLength"]]
        out += b"\0" * (-len(out) % 4)
        view["byteOffset"] = len(out)
        view["buffer"] = 0
        out += chunk
        acc["bufferView"] = len(views)
        views.append(view)
        accessors[new] = acc

    used_ext = sorted({e for m in materials for e in m.get("extensions", {})})
    gltf = {
        "asset": {**src["asset"], "extras": {"source": "public/ayanna/ayanna_model.txt", "by": "scripts/extract_furniture.py"}},
        "scene": 0,
        "scenes": [{"name": "Furniture", "nodes": [node_map[r] for r in roots]}],
        "nodes": nodes, "meshes": meshes, "materials": materials,
        "accessors": accessors, "bufferViews": views, "buffers": [{"byteLength": len(out)}],
    }
    if used_ext:
        gltf["extensionsUsed"] = used_ext

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(base64.b64encode(write_glb(gltf, bytes(out))).decode())
    print(f"{len(roots)} pieces, {len(meshes)} meshes, {len(materials)} materials -> {OUT.relative_to(ROOT)} "
          f"({OUT.stat().st_size / 1e6:.2f} MB, was {SRC.stat().st_size / 1e6:.2f} MB)")


if __name__ == "__main__":
    main()
