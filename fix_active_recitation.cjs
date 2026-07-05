const fs = require('fs');
let code = fs.readFileSync('src/components/ActiveRecitationTab.tsx', 'utf8');

if(!code.includes("import confetti from 'canvas-confetti';")) {
  code = `import confetti from 'canvas-confetti';\n` + code;
}

code = code.replace(/const handleNextVerse = \(\) => \{/g, 
`const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch(e) {}
  };

  const handleNextVerse = () => {
    // Play sound and confetti when finishing verse correctly
    if(revealedWords.size === 0) {
      playSuccessSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#059669']
      });
    }
`);

fs.writeFileSync('src/components/ActiveRecitationTab.tsx', code);
