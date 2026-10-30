"""Focused visual interaction regression (in-memory: no network/deploy)."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64, json, re
root=Path(__file__).resolve().parent.parent
pub=root/'public'
html=(pub/'index.html').read_text()
html=re.sub(r'<link\b[^>]*>', '', html)
html=re.sub(r'<script\s+src=[^>]+></script>', '', html)
css=(pub/'styles.css').read_text()
js=(pub/'app.js').read_text()
assets={}
for f in (pub/'assets').glob('*.png'):
 assets[f.name]='data:image/png;base64,'+base64.b64encode(f.read_bytes()).decode('ascii')
js=js.replace('const asset = n => `/assets/${n}`;', 'const asset = n => ('+json.dumps(assets)+')[n];')
js=js.replace("history.pushState({view:next}, '', next==='intro'?'/':`/?view=${next}`);", "void 0;")
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height,device in [(1440,900,'desktop'),(390,844,'mobile')]:
  page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.set_content(html,wait_until='domcontentloaded')
  page.add_style_tag(content=css)
  page.add_script_tag(content=js)
  assert page.locator('#intro-enter').count()==1
  page.locator('#intro-enter').click()
  page.wait_for_timeout(650)
  assert page.locator('.product-card').count()==5
  assert page.locator('.brand-link').get_attribute('href')=='/'
  assert page.locator('.brand-link').get_attribute('data-view')=='intro'
  # first navigate to Philosophy then go home from left upper corner
  page.locator('[data-view="philosophy"]').click()
  page.wait_for_timeout(650)
  assert page.locator('.philosophy-portrait img').count()==1
  page.locator('.brand-link').click()
  page.wait_for_timeout(650)
  assert page.locator('#intro-enter').count()==1, 'brand does not navigate to intro'
  # go to Collection, assess effect
  page.locator('#intro-enter').click()
  page.wait_for_timeout(650)
  card=page.locator('.product-card').first
  page.mouse.move(0,0)
  page.wait_for_timeout(490)
  before=card.evaluate('(e)=>({opacity:getComputedStyle(e,"::after").opacity, blur:getComputedStyle(e).backdropFilter})')
  card.hover()
  page.wait_for_timeout(520)
  after=card.evaluate('(e)=>({opacity:getComputedStyle(e,"::after").opacity, blur:getComputedStyle(e).backdropFilter, beforeOpacity:getComputedStyle(e,"::before").opacity})')
  assert float(before['opacity'])==0,('glow should start hidden',device,before)
  assert float(after['opacity'])>=.95,('glow not visible',device,after)
  assert 'blur' in after['blur'],('missing glass blur',device,after)
  contacts=page.locator('.connect-block a')
  # scroll to bottom and move pointer for hover, ensure border removed
  first=contacts.first
  first.scroll_into_view_if_needed()
  bord0=first.evaluate('(e)=>getComputedStyle(e).borderBottomColor')
  first.hover()
  page.wait_for_timeout(390)
  bord1=first.evaluate('(e)=>getComputedStyle(e).borderBottomColor')
  assert bord1=='rgba(0, 0, 0, 0)',('social border not transparent on hover',device,bord0,bord1)
  # collection remains scrollable and card unaffected
  page.locator('[data-product="holder"]').click()
  assert page.locator('.modal-visual img').count()==1
  page.locator('[data-add="holder"]').click()
  assert '(01)' in page.locator('#bag-count').inner_text()
  assert not errors,(device,errors)
  results.append({'device':device,'five_cards':True,'brand_to_intro':True,'glass_before':before,'glass_after':after,'contact_border_normal':bord0,'contact_border_hover':bord1,'bag':True,'errors':errors})
  page.close()
 browser.close()
print(json.dumps(results,ensure_ascii=False,indent=2))
