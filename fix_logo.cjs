const fs = require('fs');
let code = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

code = `import logoImg from "../assets/images/athar_ayah_logo_1783253623984.jpg";\n` + code;
code = code.replace(/src="https:\/\/file\.notion\.so[^"]+"/g, `src={logoImg}`);

fs.writeFileSync('src/components/AuthPage.tsx', code);
