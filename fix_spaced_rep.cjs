const fs = require('fs');
let code = fs.readFileSync('src/components/ProgressPage.tsx', 'utf8');

const replacement = `
          <h3 className="text-sm font-black text-emerald-600 flex items-center gap-1.5 border-b pb-3">
            <Calendar className="h-5 w-5" />
            <span>روزنامة التكرار المتباعد</span>
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            تعتمد الجدولة المتباعدة على قياس جودة استذكار الموضع وتكرار تلاوته بالتدريج في فترات متباعدة لتخزينه بالذاكرة العميقة.
          </p>

          <div className="relative border-r-2 border-slate-100 dark:border-slate-800 pr-6 space-y-6 pt-4 mt-2">
            
            <div className="relative">
              <span className="absolute -right-[31px] top-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-4 ring-white dark:ring-slate-900 shadow-sm"></span>
              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs hover:border-rose-200 transition">
                <span className="block text-xs font-black text-rose-600 mb-1">مراجعة تكرارية (يوم)</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">للمواضع الصعبة جداً أو حديثة الحفظ لضمان عدم تلاشي البصمة العصبية.</p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -right-[31px] top-1 h-3.5 w-3.5 rounded-full bg-amber-500 ring-4 ring-white dark:ring-slate-900 shadow-sm"></span>
              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs hover:border-amber-200 transition">
                <span className="block text-xs font-black text-amber-600 mb-1">مراجعة متوسطة (٣ أيام)</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">للمواضع متوسطة التمكين لرفع مستوى استذكارها التلقائي.</p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -right-[31px] top-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900 shadow-sm"></span>
              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs hover:border-emerald-200 transition">
                <span className="block text-xs font-black text-emerald-600 mb-1">مراجعة متباعدة (٧ أيام)</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">للمواضع السهلة والمستقرة لتجنب تشتتها من الذاكرة.</p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -right-[31px] top-1 h-3.5 w-3.5 rounded-full bg-purple-500 ring-4 ring-white dark:ring-slate-900 shadow-sm"></span>
              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs hover:border-purple-200 transition">
                <span className="block text-xs font-black text-purple-600 mb-1">مراجعة راسخة (١٤ - ٣٠ يوماً)</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">للمواضع المتقنة تماماً (الصم) لمراجعتها دورياً لضمان عدم ضياع التمكين.</p>
              </div>
            </div>

          </div>`;

code = code.replace(/<h3 className="text-sm font-black text-emerald-600 flex items-center gap-1\.5 border-b pb-3">[\s\S]*?<\/div>\n          <\/div>/, replacement);

fs.writeFileSync('src/components/ProgressPage.tsx', code);
