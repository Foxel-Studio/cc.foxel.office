#!/usr/bin/env python3
"""Pack this plugin into a .foxpkg and check it against Foxel's manifest rules."""

import json
import os
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[1]
VENV_PYTHON = REPO / ".venv" / "bin" / "python"
if VENV_PYTHON.exists() and Path(sys.prefix).resolve() != (REPO / ".venv").resolve():
    os.execv(VENV_PYTHON, [str(VENV_PYTHON), __file__, *sys.argv[1:]])

sys.path.insert(0, str(REPO))

from domain.plugins.loader import PluginLoader  # noqa: E402
from domain.plugins.types import PluginManifest  # noqa: E402

REQUIRED = [
    "manifest.json",
    "README.md",
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "pack.py",
    "frontend/index.js",
    "frontend/player.css",
    "frontend/icon.svg",
]


def main() -> None:
    missing = [name for name in REQUIRED if not (ROOT / name).is_file()]
    if missing:
        raise SystemExit(f"缺少文件：{', '.join(missing)}。先运行 bun run build。")

    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    ok, errors = PluginLoader.validate_manifest(manifest)
    if not ok:
        raise SystemExit("manifest 验证失败: " + "; ".join(errors))

    out = ROOT / "dist" / "cc.foxel.office.foxpkg"
    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for name in REQUIRED:
            archive.write(ROOT / name, name)
        for path in sorted((ROOT / "src").rglob("*")):
            if path.is_file() and path.suffix != ".map":
                archive.write(path, path.relative_to(ROOT).as_posix())
    with zipfile.ZipFile(out) as archive:
        PluginLoader._validate_package_files(archive, PluginManifest.model_validate(manifest))
    print(out)


if __name__ == "__main__":
    main()
