import os
import re

files_with_tables = [
    'e:/vac/VAC-Client/app/faculty/course/[id]/page.tsx',
    'e:/vac/VAC-Client/app/faculty/dashboard/page.tsx',
    'e:/vac/VAC-Client/app/admin/dashboard/page.tsx',
    'e:/vac/VAC-Client/app/admin/course/[id]/page.tsx'
]

def update_table_ui(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Outer table wrapper
    content = re.sub(
        r'overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800',
        'overflow-x-auto rounded-xl border border-indigo-100 dark:border-indigo-900/30',
        content
    )
    # thead background and text
    content = re.sub(
        r'thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-heading font-bold border-b border-slate-100 dark:border-slate-800"',
        'thead className="bg-indigo-50/40 dark:bg-indigo-900/20 text-slate-700 dark:text-slate-300 capitalize tracking-wide font-bold border-b border-indigo-100 dark:border-indigo-900/50"',
        content
    )
    content = re.sub(
        r'thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-indigo-100 dark:border-indigo-900/30"',
        'thead className="bg-indigo-50/40 dark:bg-indigo-900/20 text-slate-700 dark:text-slate-300 capitalize tracking-wide font-bold border-b border-indigo-100 dark:border-indigo-900/50"',
        content
    )
    content = re.sub(
        r'thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-indigo-100 dark:border-indigo-900/30"',
        'thead className="bg-indigo-50/40 dark:bg-indigo-900/20 text-slate-700 dark:text-slate-300 capitalize tracking-wide font-bold border-b border-indigo-100 dark:border-indigo-900/50"',
        content
    )
    # TH Classes (replace standard padding/text)
    content = re.sub(
        r'th className="py-3\.5 px-4"',
        'th className="py-4 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide"',
        content
    )
    content = re.sub(
        r'th className="py-3\.5 px-4 text-center"',
        'th className="py-4 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide text-center"',
        content
    )
    
    # Action View Button (Admin style)
    content = re.sub(
        r'className="inline-flex items-center gap-1\.5 px-3 py-1\.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-heading font-bold shadow-xs transition-all duration-150 cursor-pointer"',
        'className="text-indigo-600 dark:text-indigo-400 font-bold text-[13px] hover:underline cursor-pointer transition-colors"',
        content
    )
    
    # Status Badges inside getStatusBadge (Admin style with backgrounds -> transparent)
    content = re.sub(
        r'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60',
        'text-emerald-600 dark:text-emerald-400 font-bold text-[13px] tracking-wide bg-transparent',
        content
    )
    content = re.sub(
        r'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60',
        'text-blue-600 dark:text-blue-400 font-bold text-[13px] tracking-wide bg-transparent',
        content
    )
    content = re.sub(
        r'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/70 dark:border-rose-800/60',
        'text-rose-600 dark:text-rose-400 font-bold text-[13px] tracking-wide bg-transparent',
        content
    )
    content = re.sub(
        r'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60',
        'text-amber-600 dark:text-amber-400 font-bold text-[13px] tracking-wide bg-transparent',
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {filepath}")

for f in files_with_tables:
    update_table_ui(f)
