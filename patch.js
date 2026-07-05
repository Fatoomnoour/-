const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace fetch("/api/progress") inside useEffect
code = code.replace(/fetch\(\`\/api\/progress\?userId=\$\{encodeURIComponent\(currentUser\.id\)\}\`\)[\s\S]*?\.catch\(err => console\.error\("Error loading reading progress", err\)\);/, 
`getReadingProgress(currentUser.id)
        .then(data => {
          if (data && data.lastSurahId) {
            const pos = {
              surahId: data.lastSurahId,
              verseNum: data.lastVerseNumber || 1,
              surahName: data.lastSurahName || ""
            };
            setLastRead(pos);
            localStorage.setItem(\`last_read_\${currentUser.id}\`, JSON.stringify(pos));
          }
        })
        .catch(err => console.error("Error loading reading progress", err));`);

// Remove handleLogin's fake API
code = code.replace(/const handleLogin = async \(email: string, name: string\) => \{[\s\S]*?\};\n\n/g, "");

// Remove the pass-through for handleLogin
code = code.replace(/onLogin=\{handleLogin\}\n/g, "");

// Replace fetch(`/api/memorization/${planId}`) with updateMemorizationPlan
code = code.replace(/const res = await fetch\(`\/api\/memorization\/\$\{planId\}`\)[\s\S]*?body: JSON\.stringify\(\{[\s\S]*?\}\)[\s\S]*?\}\);/g, 
`await updateMemorizationPlan(currentUser.id, planId, {
          nextReviewDate,
          intervalDays,
          revisionHistory: [
            { date: new Date().toISOString().split('T')[0], rating },
            ...(activeMemoPlan?.revisionHistory || [])
          ]
        });`);
        
code = code.replace(/if \(res\.ok\) \{/g, `if (true) {`);

fs.writeFileSync('src/App.tsx', code);
