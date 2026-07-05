const fs = require('fs');

// App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/<AuthPage \/>/g, '<AuthPage onLogin={() => {}} />');
fs.writeFileSync('src/App.tsx', appCode);

// GroupsTab.tsx
let groupCode = fs.readFileSync('src/components/groups/GroupsTab.tsx', 'utf8');
groupCode = `import { getUserGroups, createGroup, joinGroup } from "../../services/firestoreService";\n` + groupCode;
fs.writeFileSync('src/components/groups/GroupsTab.tsx', groupCode);

