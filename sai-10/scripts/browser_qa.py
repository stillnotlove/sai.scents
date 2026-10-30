"""In-memory visual regression test (no navigation/network, works in sandbox)."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64, json, re
root=Path(__file__).resolve().parent.parent
pub=root/'public'
html=(pub/'index.html').read_text()
# Runtime will be loaded explicitly, no external network URLs required.
html=re.sub(r'<link\b[^>]*>', '', html)
html=re.sub(r'<script\s+src=[^>]+></script>', '', html)
css=(pub/'styles.css').read_text()
js=(pub/'app.js').read_text()
asset_map={}
for f in (pub/'assets').glob('*'):
 if f.suffix=='.png':
  asset_map[f.name]='data:image/png;base64,'+base64.b64encode(f.read_bytes()).decode('ascii')
js=js.replace("const asset = n => `/assets/${n}`;",'const asset = n => ('+json.dumps(asset_map)+')[n];')
js=js.replace("history.pushState({view:next}, '', next==='intro'?'/':`/?view=${next}`);",'void 0;')
results={}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height,mode in [(1440,900,'desktop'),(390,844,'mobile')]:
  page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html, wait_until='domcontentloaded')
  page.add_style_tag(content=css)
  page.add_script_tag(content=js)
  page.locator('#intro-enter').click()
  page.wait_for_timeout(740)
  assert page.locator('.product-card').count()==5, ('product count',mode)
  rects=[page.locator('.product-card').nth(i).bounding_box() for i in range(5)]
  def overlap(a,b):
   return max(a['x'],b['x']) < min(a['x']+a['width'],b['x']+b['width'])-1 and max(a['y'],b['y']) < min(a['y']+a['height'],b['y']+b['height'])-1
  for i in range(5):
   for j in range(i+1,5):
    assert not overlap(rects[i],rects[j]), ('OVERLAP',mode,i,j)
  page.screenshot(path=str(root/f'v9_{mode}_collection.png'))
  page.locator('[data-product="holder"]').click()
  assert page.locator('.modal-visual img').count()==1
  assert page.locator('[data-photo]').count()==0
  img=page.locator('.modal-visual img').evaluate('(img)=>({w:img.naturalWidth,h:img.naturalHeight})')
  assert img=={'w':2800,'h':1848},('holder image dimensions',img)
  page.locator('[data-add="holder"]').click()
  assert '(01)' in page.locator('#bag-count').inner_text()
  page.locator('[data-view="philosophy"]').click()
  page.wait_for_timeout(720)
  assert page.locator('.philosophy-portrait img').count()==1
  assert page.locator('.philosophy-card.text').count()==2
  assert page.locator('.philosophy-card.visual').count()==0
  portrait=page.locator('.philosophy-portrait img').evaluate('(img)=>({w:img.naturalWidth,h:img.naturalHeight})')
  assert portrait=={'w':1122,'h':1402},portrait
  page.screenshot(path=str(root/f'v9_{mode}_philosophy.png'))
  scroll=page.locator('.philosophy-page').evaluate('(el)=>({scrollHeight:el.scrollHeight,clientHeight:el.clientHeight})')
  assert scroll['scrollHeight']>scroll['clientHeight'],('philosophy scroll',mode,scroll)
  page.locator('[data-view="bag"]').click()
  page.wait_for_timeout(720)
  assert '$55' in page.locator('.summary-total').inner_text()
  assert not errors, ('JS errors', mode, errors)
  results[mode]={'cards':5,'no_overlap':True,'holder_single_image':img,'portrait_full_res':portrait,'scrollable_philosophy':scroll,'bag_total':55,'errors':errors}
  page.close()
 browser.close()
print(json.dumps(results,indent=2))
