const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/<link rel="icon" type="image\/jpeg" href="https:\/\/file\.notion\.so[^"]+" \/>/g, 
`<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📖</text></svg>" />`);

code = code.replace(/<link rel="apple-touch-icon" href="https:\/\/file\.notion\.so[^"]+" \/>/g, "");

fs.writeFileSync('index.html', code);
