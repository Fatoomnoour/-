const fs = require('fs');
let code = fs.readFileSync('src/components/ActiveRecitationTab.tsx', 'utf8');
code = code.replace(/      \}\);\n    \}\n\n    if \(currentVerseIndex < sessionVerses\.length - 1\) \{/g, 
`      });\n\n    if (currentVerseIndex < sessionVerses.length - 1) {`);
fs.writeFileSync('src/components/ActiveRecitationTab.tsx', code);
