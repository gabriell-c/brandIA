with open(r'd:\OmniRoute\design_system\Arquitetura_Design_System.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

p4_start = None
p5_start = None

for i, line in enumerate(lines):
    if '### 🟣 P4' in line:
        p4_start = i
    if p4_start and '### 🟠 P5' in line:
        p5_start = i
        break

if p4_start and p5_start:
    content = ''.join(lines[p4_start:p5_start])
    # Remove emojis
    content = content.replace('🟣', '').replace('🟠', '').replace('🟤', '').replace('🔵', '').replace('🔴', '').replace('⚫', '').replace('🔘', '').replace('🔷', '').replace('🔶', '')
    with open(r'd:\OmniRoute\design_system\p4_extracted.md', 'w', encoding='utf-8') as out:
        out.write(content)
    print(f"Extracted {len(content)} chars")
else:
    print(f"P4 start: {p4_start}, P5 start: {p5_start}")