const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/key=\{readerInitialPosition\.ts \|\| "reader"\}/g, 
`key={readerInitialPosition?.ts || "reader"}`);

fs.writeFileSync('src/App.tsx', code);
