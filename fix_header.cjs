const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(/<\/div>\n          <\/div>\n          <div className="flex flex-col">/, 
`</div>\n          <div className="flex flex-col">`);

fs.writeFileSync('src/components/Header.tsx', code);
