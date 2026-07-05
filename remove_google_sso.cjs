const fs = require('fs');
let code = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

code = code.replace(/\{\/\* Google SSO \*\/\}\n          <div className="p-4 bg-emerald-50\/50 dark:bg-emerald-950\/10 border border-emerald-100\/50 dark:border-emerald-900\/30 rounded-2xl space-y-3\.5">[\s\S]*?<\/div>\n\n          \{/g, "{");

fs.writeFileSync('src/components/AuthPage.tsx', code);
