import os

filepath = 'e:/vac/VAC-Client/app/student/dashboard/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Update chart bar colors
content = content.replace(
    'bg-amber-400 transition-opacity duration-150',
    'bg-amber-500 transition-opacity duration-150'
)

content = content.replace(
    'bg-indigo-500 transition-opacity duration-150',
    'bg-indigo-600 transition-opacity duration-150'
)

content = content.replace(
    'bg-indigo-500 transition-all duration-200',
    'bg-indigo-600 transition-all duration-200'
)

content = content.replace(
    'bg-amber-400 transition-all duration-200',
    'bg-amber-500 transition-all duration-200'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated chart colors to exact hex match.')
