import os
import re

files_with_tables = [
    'e:/vac/VAC-Client/app/student/my-course/page.tsx',
    'e:/vac/VAC-Client/app/student/course-complete/page.tsx',
    'e:/vac/VAC-Client/app/student/course/page.tsx',
    'e:/vac/VAC-Client/app/faculty/course/[id]/page.tsx',
    'e:/vac/VAC-Client/app/faculty/dashboard/page.tsx',
    'e:/vac/VAC-Client/app/admin/dashboard/page.tsx',
    'e:/vac/VAC-Client/app/admin/course/[id]/page.tsx'
]

def update_table_ui(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, file not found.")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Outer table border wrapper
    content = content.replace(
        'border-slate-200 dark:border-slate-800', 
        'border-indigo-100 dark:border-indigo-900/30'
    )
    
    # Header TR
    content = content.replace(
        'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50',
        'border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-900/20'
    )
    # Some files might not have the exact 80/50 opacity, so generic match:
    content = content.replace(
        'bg-slate-50/50 dark:bg-slate-900/50',
        'bg-indigo-50/40 dark:bg-indigo-900/20'
    )
    
    # TH Classes
    content = re.sub(
        r'text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase',
        'text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide',
        content
    )
    # If they are just text-xs uppercase
    content = re.sub(
        r'text-\[11px\] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500',
        'text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide',
        content
    )

    # TD Cells
    content = re.sub(
        r'text-xs font-medium text-slate-400 dark:text-slate-500',
        'text-[13px] font-semibold text-slate-700 dark:text-slate-300',
        content
    )
    content = re.sub(
        r'text-xs font-medium text-slate-600 dark:text-slate-400',
        'text-[13px] font-semibold text-slate-700 dark:text-slate-300',
        content
    )

    # Action View Button
    content = re.sub(
        r'h-7 px-3 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer select-none',
        'text-indigo-600 dark:text-indigo-400 font-bold text-[13px] hover:underline cursor-pointer transition-colors',
        content
    )
    # General view button
    content = re.sub(
        r'px-3 py-1\.5 rounded text-xs font-semibold border border-slate-200.*?"',
        'text-indigo-600 dark:text-indigo-400 font-bold text-[13px] hover:underline cursor-pointer transition-colors"',
        content
    )

    # Status badging (Completed / Registered) -> No background
    content = re.sub(
        r'px-2 py-0\.5 rounded-full text-\[10px\] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
        'text-emerald-600 dark:text-emerald-400 font-bold text-[13px] tracking-wide',
        content
    )
    
    # Pending / Action needed status
    content = re.sub(
        r'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400',
        'text-amber-600 dark:text-amber-400 font-bold text-[13px] tracking-wide bg-transparent',
        content
    )

    # Table Footer
    content = content.replace(
        'border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10',
        'border-t border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-900/20'
    )

    content = content.replace(
        'text-xs text-slate-500 dark:text-slate-400">\n              Page',
        'text-sm font-bold text-slate-800 dark:text-slate-200">\n              Page'
    )
    content = content.replace(
        '<span className="text-xs text-slate-400">Rows per page</span>',
        '<span className="text-sm font-bold text-slate-800 dark:text-slate-200">Rows per page</span>'
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {filepath}")

for f in files_with_tables:
    update_table_ui(f)
