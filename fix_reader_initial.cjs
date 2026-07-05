const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const \[readerInitialPosition, setReaderInitialPosition\] = useState<\{ surahId: number; verseNumber: number \}>\(\{ surahId: 1, verseNumber: 1 \}\);/g, 
`const [readerInitialPosition, setReaderInitialPosition] = useState<{ surahId: number; verseNumber: number; ts?: number }>({ surahId: 1, verseNumber: 1 });`);

code = code.replace(/setReaderInitialPosition\(\{ surahId: 1, verseNumber: 1 \}\);/g, 
`setReaderInitialPosition({ surahId: 1, verseNumber: 1, ts: Date.now() });`);

code = code.replace(/setReaderInitialPosition\(\{ surahId: lastRead.surahId, verseNumber: lastRead.verseNum \}\);/g, 
`setReaderInitialPosition({ surahId: lastRead.surahId, verseNumber: lastRead.verseNum, ts: Date.now() });`);

// Fix the QuranReader component to use ts as a key to force re-render/remount if they click the button again
code = code.replace(/<QuranReader \n                  currentUser=\{currentUser\} /g, 
`<QuranReader \n                  key={readerInitialPosition.ts || "reader"}
                  currentUser={currentUser} `);

fs.writeFileSync('src/App.tsx', code);
