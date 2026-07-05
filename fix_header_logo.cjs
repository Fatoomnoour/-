const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!code.includes('import logoImg')) {
  code = `import logoImg from "../assets/images/athar_ayah_logo_1783253623984.jpg";\n` + code;
}

code = code.replace(/<div className="bg-emerald-600 rounded-xl p-2 shadow-sm relative overflow-hidden group">[\s\S]*?<\/div>/, 
`<div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm border border-emerald-100 dark:border-emerald-900/30">
            <img src={logoImg} alt="أثر آية" className="h-full w-full object-cover" />
          </div>`);

fs.writeFileSync('src/components/Header.tsx', code);
