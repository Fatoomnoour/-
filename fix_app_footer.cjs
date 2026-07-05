const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const footerHtml = `
      {/* Footer / Author Info */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-8 mt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
        <div>
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-1">أثر آية</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">منصة قرآنية متكاملة لتدبر وحفظ القرآن الكريم</p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-1">
          <span className="text-xs text-slate-500 font-bold">تطوير وتصميم:</span>
          <a 
            href="https://www.linkedin.com/in/fatma-nour-ai-trainer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-black text-emerald-600 hover:text-emerald-500 transition"
          >
            Fatma Nour (AI Trainer)
          </a>
          <span className="text-[10px] text-slate-400 mt-1">للتواصل والاقتراحات</span>
        </div>
      </footer>

      {/* Fixed advanced sticky Audio Player */}`;

code = code.replace(/\{(\/\* Fixed advanced sticky Audio Player \*\/)\}/, footerHtml);

fs.writeFileSync('src/App.tsx', code);
