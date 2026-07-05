const fs = require('fs');
let code = fs.readFileSync('src/components/QuranReader.tsx', 'utf8');
code = code.replace(/interface QuranReaderProps \{/g, 
`interface QuranReaderProps {\n  key?: React.Key | string | number;`);
fs.writeFileSync('src/components/QuranReader.tsx', code);
