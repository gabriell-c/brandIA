import subprocess
import sys

result = subprocess.run(
    [sys.executable, '-m', 'pytest', 'tests/test_api.py::test_health_check', '-v', '--tb=long'],
    capture_output=True,
    text=True,
    cwd='d:/OmniRoute/design_system/backend'
)
print('STDOUT:', result.stdout)
print('STDERR:', result.stderr)
print('EXIT CODE:', result.returncode)