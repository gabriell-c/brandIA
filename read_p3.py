import re

with open(r'd:\OmniRoute\design_system\Arquitetura_Design_System.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Find P3 section
p3_start = content.find('### 🔵 P3 — Frontend Core')
if p3_start == -1:
    print("P3 not found")
else:
    # Find next P section (P4)
    p4_start = content.find('### 🟣 P4', p3_start)
    if p4_start == -1:
        p4_start = len(content)
    
    p3_content = content[p3_start:p4_start]
    # Replace emojis
    p3_content = p3_content.replace('🔵', '[P3]').replace('🟣', '[P4]').replace('🟠', '[P5]').replace('🟤', '[P6]').replace('🔴', '[P7]').replace('⚫', '[P8]').replace('🔘', '[P9]').replace('🔷', '[P10]').replace('🔶', '[P11]')
    print(p3_content)