const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

if(!code.includes('fonts.googleapis.com')) {
  code = `@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;500;600;700;800;900&display=swap');\n` + code;
  fs.writeFileSync('src/index.css', code);
}
