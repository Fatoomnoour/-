const fs = require('fs');
let code = fs.readFileSync('src/components/groups/GroupsTab.tsx', 'utf8');

// remove inline import
code = code.replace(/import \{ getUserGroups, createGroup, joinGroup \} from "\.\.\/\.\.\/services\/firestoreService";\n\n  const fetchGroups = async \(\) => \{/g, 
'  const fetchGroups = async () => {');

// add it to top
code = code.replace(/import \{ Group \} from "\.\.\/\.\.\/types";/, 
`import { Group } from "../../types";\nimport { getUserGroups, createGroup, joinGroup } from "../../services/firestoreService";`);

fs.writeFileSync('src/components/groups/GroupsTab.tsx', code);
