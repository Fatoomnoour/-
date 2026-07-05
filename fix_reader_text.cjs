const fs = require('fs');
let code = fs.readFileSync('src/components/QuranReader.tsx', 'utf8');

code = code.replace(/text-slate-800/g, 'text-slate-900');
code = code.replace(/text-slate-700/g, 'text-slate-800');

fs.writeFileSync('src/components/QuranReader.tsx', code);
