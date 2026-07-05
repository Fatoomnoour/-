const fs = require('fs');
let code = fs.readFileSync('src/services/firestoreService.ts', 'utf8');

code = code.replace(/return snap\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.\(doc\.data\(\) as Partial<QuranNote>\) \}\ as QuranNote\)\);/g, 
`let results = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Partial<QuranNote>) } as QuranNote));
    if (surahId) {
      results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return results;`);

fs.writeFileSync('src/services/firestoreService.ts', code);
