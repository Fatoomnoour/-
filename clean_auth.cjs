const fs = require('fs');

// App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/const handleAuthSuccess =[\s\S]*?\};\n\n  const handleGoogleLoginSimulate =[\s\S]*?\};\n\n/g, '');
appCode = appCode.replace(/<AuthPage \n          onAuthSuccess=\{handleAuthSuccess\}\n          onGoogleLoginSimulate=\{handleGoogleLoginSimulate\}\n        \/>/g, '<AuthPage />');
fs.writeFileSync('src/App.tsx', appCode);

// AuthPage.tsx
let authCode = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');
authCode = authCode.replace(/interface AuthPageProps \{[\s\S]*?\}\n\nexport default function AuthPage\(\{ onAuthSuccess \}: AuthPageProps\) \{/g, 'export default function AuthPage() {');
authCode = authCode.replace(/onAuthSuccess\(\{ id: user\.uid, name: user\.displayName \|\| "مستخدم", email: user\.email \|\| "", photoURL: user\.photoURL \|\| undefined \}\);/g, '');
fs.writeFileSync('src/components/AuthPage.tsx', authCode);

