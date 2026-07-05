const fs = require('fs');

// Header.tsx
let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');
headerCode = headerCode.replace(/  onLogin: \(email: string, name: string\) => Promise<void>;\n/, '');
headerCode = headerCode.replace(/  onLogin,\n/, '');
headerCode = headerCode.replace(/  const \[isLoginModalOpen, setIsLoginModalOpen\] = useState\(false\);\n  const \[emailInput, setEmailInput\] = useState[\s\S]*?setIsLoading\(false\);\n    \}\n  \};\n/g, '');
headerCode = headerCode.replace(/\{!currentUser \? \([\s\S]*?\} \/\* End Login Modal \*\/\n/g, '');
fs.writeFileSync('src/components/Header.tsx', headerCode);

// AuthPage.tsx
let authCode = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');
authCode = authCode.replace(/onAuthSuccess\(\{[\s\S]*?\}\);/g, '');
fs.writeFileSync('src/components/AuthPage.tsx', authCode);

// App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/onLogin=\{handleLogin\}/g, '');
fs.writeFileSync('src/App.tsx', appCode);

