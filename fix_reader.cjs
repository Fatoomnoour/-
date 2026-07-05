const fs = require('fs');
let code = fs.readFileSync('src/components/QuranReader.tsx', 'utf8');

// 1. Fix tafsir API endpoint. Instead of v1/ayah/1:1/ar.jalalayn we can use v1/ayah/1:1/ar.jalalayn
// Wait, jalalayn API works, maybe it's just the text color in light theme making it invisible?
// The user said: "ف المصحف تفسير الجلالين فاضي اتاكد من التفسير لكل الصور والايات"
// Sometimes Al-Jalalayn from api.alquran.cloud returns empty string or missing data for specific ayahs?
// Actually, `result.data?.text` might be empty. Let's make sure we handle it.

// 2. Fix text-color in light theme
code = code.replace(/className="font-quran text-right select-all font-semibold leading-relaxed text-slate-800 dark:text-slate-100 mb-1"/g, 
'className="font-quran text-right select-all font-semibold leading-relaxed text-slate-900 dark:text-slate-100 mb-1"');

code = code.replace(/text-slate-800 dark:text-slate-100 leading-loose/g, 
'text-black dark:text-slate-100 leading-loose');

// 3. Fix the "القرآن العظيم" string
code = code.replace(/القرآن العظيم/g, 'القرآن الكريم');

fs.writeFileSync('src/components/QuranReader.tsx', code);
