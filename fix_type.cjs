const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/useState<\{ surahId: number; verseNumber: number \} \| null>\(null\);/g, 
`useState<{ surahId: number; verseNumber: number; ts?: number } | null>(null);`);
fs.writeFileSync('src/App.tsx', code);
