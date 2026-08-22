const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'public/styles.css'),'utf8');
const js=fs.readFileSync(path.join(root,'public/app.js'),'utf8');
const inline=index.replace('<link rel="stylesheet" href="/styles.css">',`<style>${css}</style>`).replace('<script src="/app.js"></script>',`<script>${js}</script>`);
const workerPath=path.join(root,'worker.js');
const worker=fs.readFileSync(workerPath,'utf8');
const start=worker.indexOf('const page = `');
const end=worker.indexOf(';\nlet seedPromise;async function seed',start);
if(start<0||end<0)throw new Error('page template not found');
const safe=inline.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\${/g,'\\${');
const expected=`const page = \`${safe}\`;`;
if(process.argv.includes('--check')){if(worker.slice(start,end+1)!==expected)throw new Error('Worker page drift detected; run npm run sync:worker');console.log('PASS: Worker page matches public frontend assets');}else{const next=worker.slice(0,start)+expected+worker.slice(end+1);fs.writeFileSync(workerPath,next);console.log('PASS: Worker page synchronized');}
