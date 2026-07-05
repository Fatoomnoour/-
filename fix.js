const fs = require('fs');
let code = fs.readFileSync('src/components/ProgressPage.tsx', 'utf8');
code = code.replace(/import \{ getReadingProgress, getUserMemorizationPlans, updateMemorizationPlan \} from "\.\.\/services\/firestoreService";/, '');
code = `import { getReadingProgress, getUserMemorizationPlans, updateMemorizationPlan } from "../services/firestoreService";\n` + code;
fs.writeFileSync('src/components/ProgressPage.tsx', code);
