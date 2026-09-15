import subprocess
import sys

result = subprocess.run(
    [sys.executable, '-m', 'pytest', 'tests/', '-v', '--tb=short'],
    capture_output=True,
    text=True,
    cwd='d:/OmniRoute/design_system/backend'
)
print('STDOUT:', result.stdout[-5000:])
print('STDERR:', result.stderr[-1000:])
print('EXIT CODE:', result.returncode)