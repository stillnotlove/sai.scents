const fs = require('node:fs');
const path = require('node:path');
const base = path.resolve(__dirname,'../public');
const js = fs.readFileSync(path.join(base,'app.js'),'utf8');
const css = fs.readFileSync(path.join(base,'styles.css'),'utf8');
const html = fs.readFileSync(path.join(base,'index.html'),'utf8');
function assert(cond,message){if(!cond)throw new Error('SAI QA failed: '+message)}
const declared = [...new Set([...js.matchAll(/'([A-Za-z0-9_-]+\.(?:png|webp|svg))'/g)].map(x=>x[1]))];
for(const f of declared){assert(fs.existsSync(path.join(base,'assets',f)),'missing asset '+f)}
for(const f of ['hero-logo.png','favicon.png','apple-touch-icon.png','hero-symbol-mobile.png']) assert(fs.existsSync(path.join(base,'assets',f)),'missing '+f);
assert(js.includes('id="intro-enter"'),'intro click surface missing');
assert(!js.includes('intro-caption'),'old intro subtitle still present');
assert(js.includes('philosophy-next-sentence'),'philosophy line break not found');
assert(js.includes('image-gallery'),'HQ holder gallery missing');
assert(js.includes('collection-grid'),'collection grid missing');
assert(js.includes('philosophy-sections'),'full scrollable philosophy missing');
assert(css.includes('grid-template-columns:repeat(3,minmax(0,1fr))'),'uniform desktop grid missing');
assert(css.includes('overflow-y:auto'),'scroll container missing');
assert(js.includes('class="product-card-top"'),'minimal product panel structure missing');
assert(!js.includes('class="product-visual"'),'collection still contains photographic cards');
assert(js.includes('route-initial') && css.includes('.page.route-exit'),'cross-dissolve transition missing');
assert(!/#[a-f\d]{3,8}\b/gi.test(css.replace(/#(?:dddde0|ffffff|000000)\b/gi,'')),'unexpected HEX palette color');
assert(html.includes('favicon.png'),'favicon not linked');
console.log('SAI v6 QA static checks passed:',declared.length,'image assets referenced');
