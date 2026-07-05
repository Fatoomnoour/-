const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// replace logoutUser with logout
code = code.replace(/logoutUser/g, 'logout');

// add import for updateMemorizationPlan
code = code.replace(/import \{ getUserNotes, getUserBookmarks, getReadingProgress, getUserMemorizationPlans \} from "\.\/services\/firestoreService";/,
'import { getUserNotes, getUserBookmarks, getReadingProgress, getUserMemorizationPlans, updateMemorizationPlan } from "./services/firestoreService";');

// Remove <AuthPage onLogin={handleLogin} /> -> <AuthPage />
code = code.replace(/<AuthPage \/>/g, '<AuthPage />');

fs.writeFileSync('src/App.tsx', code);
