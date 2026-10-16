"""Behave 只載入 steps/ 第一層的 .py；此檔遞迴載入子目錄（common_then/、member/、house/…）中的 step 定義。"""

import importlib.util
import sys
from pathlib import Path

_STEPS_DIR = Path(__file__).resolve().parent

# 讓 step 可以 `from helpers.xxx import ...`（helpers/ 位於 tests/features/）
if str(_STEPS_DIR.parent) not in sys.path:
    sys.path.insert(0, str(_STEPS_DIR.parent))

for _path in sorted(_STEPS_DIR.rglob("*.py")):
    if _path.parent == _STEPS_DIR or _path.name == "__init__.py":
        continue
    _module_name = "steps." + ".".join(_path.relative_to(_STEPS_DIR).with_suffix("").parts)
    _spec = importlib.util.spec_from_file_location(_module_name, _path)
    _module = importlib.util.module_from_spec(_spec)
    _spec.loader.exec_module(_module)
