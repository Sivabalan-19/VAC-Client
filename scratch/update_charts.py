import os

filepath = 'e:/vac/VAC-Client/app/student/dashboard/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">',
    '<span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">'
)

content = content.replace(
    '<span className="text-xs font-semibold text-slate-400">{completedCourses.length} total</span>',
    '<span className="text-sm font-bold text-indigo-400">{completedCourses.length} total</span>'
)

content = content.replace(
    '<div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">',
    '<div className="flex items-center justify-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">'
)

content = content.replace(
    'bg-slate-50/50 dark:bg-slate-950/20 text-center space-y-4">',
    'bg-white dark:bg-slate-900 text-center space-y-4">'
)

content = content.replace(
    '<h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Credit Comparison</h3>',
    '<h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Credit Comparison</h3>'
)

content = content.replace(
    '<span className="text-xs font-semibold text-slate-400">Current year</span>',
    '<span className="text-sm font-bold text-slate-500 dark:text-slate-400">Current year</span>'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated student dashboard charts styling.')
