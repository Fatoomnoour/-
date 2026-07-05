const fs = require('fs');
let code = fs.readFileSync('src/services/firestoreService.ts', 'utf8');

// The issue is in getUserNotes where it does where and orderBy
// Let's replace the query to only do where, and we sort it client side
code = code.replace(/q = query\(notesRef, where\("surahId", "==", surahId\), orderBy\("createdAt", "desc"\)\);/g, 
`q = query(notesRef, where("surahId", "==", surahId)); // sort client side to avoid index requirement`);

fs.writeFileSync('src/services/firestoreService.ts', code);
