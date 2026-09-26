import os
import re

files = [
    'e:/vac/VAC-Client/app/faculty/dashboard/page.tsx',
    'e:/vac/VAC-Client/app/faculty/course/page.tsx',
    'e:/vac/VAC-Client/app/faculty/course/[id]/page.tsx',
    'e:/vac/VAC-Client/app/faculty/my-event/page.tsx',
    'e:/vac/VAC-Client/app/faculty/create/page.tsx'
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Outer wrapper
    content = content.replace(
        '<div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">',
        '<div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">'
    )
    content = content.replace(
        '<div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">',
        '<div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">'
    )

    # 2. Add the inner wrapper and spacer before main
    new_main_start = '''      {/* 2. MAIN CONTENT FLEX WRAPPER */}
      <div className="flex pt-16 w-full min-h-screen">
        {/* Sidebar Desktop Spacer */}
        <div className="hidden lg:block w-64 shrink-0" />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 min-w-0 space-y-6">'''

    content = re.sub(
        r'\{\/\*\s*2\.\s*MAIN CONTENT AREA\s*\*\/.*?\<main className=\"flex-1.*?\>',
        new_main_start,
        content,
        flags=re.DOTALL
    )

    # 3. Add closing </div> at the end, right before the last </div>
    # We will replace the last </main> with </main>\n      </div>
    content = re.sub(r'(\s*)\</main\>', r'\1</main>\1</div>', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Updated layout across faculty pages.')
