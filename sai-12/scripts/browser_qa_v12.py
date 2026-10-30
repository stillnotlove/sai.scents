"""SAI v12 browser regression checks without network access."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,json,re
root=Path(__file__).resolve().parent.parent
pub=root/'public'
checks=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for w,h,label in [(1440,900,'desktop'),(390,844,'mobile')]:
        page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
        errors=[]
        page.set_default_timeout(5000)
        page.on('pageerror',lambda exc: errors.append(str(exc)))
        html=(pub/'index.html').read_text()
        html=re.sub(r'<link\b[^>]*>', '', html)
        html=re.sub(r'<script\s+src=[^>]+></script>', '', html)
        page.set_content(html,wait_until='domcontentloaded')
        page.add_style_tag(content=(pub/'styles.css').read_text())
        assets={f.name:base64.b64encode(f.read_bytes()).decode() for f in (pub/'assets').glob('*') if f.suffix in ('.png','.webp')}
        page.evaluate("""assets => {
          window.__assetUrls={};
          for(const [name,b64] of Object.entries(assets)){
            let bytes=Uint8Array.from(atob(b64), c=>c.charCodeAt(0));
            window.__assetUrls[name]=URL.createObjectURL(new Blob([bytes],{type:name.endsWith('.webp')?'image/webp':'image/png'}));
          }
        }""",assets)
        js=(pub/'app.js').read_text().replace('const asset = n => `/assets/${n}`;', 'const asset = n => window.__assetUrls[n];')
        js=js.replace("if(push) history.pushState({view:next}, '', next==='intro'?'/':`/?view=${next}`);",'if(push) void 0;')
        page.add_script_tag(content=js)
        assert page.locator('#intro-enter').count()==1
        page.locator('#intro-enter').click()
        page.wait_for_timeout(600)
        assert page.locator('.product-card').count()==5
        assert page.locator('.collection-page').evaluate("e=>getComputedStyle(e).backgroundColor")=='rgb(255, 255, 255)'
        assert not page.locator('#site-header').evaluate("e=>e.classList.contains('dark')")
        rects=page.locator('.product-card').evaluate_all('(els)=>els.map(e=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}})')
        for i,a in enumerate(rects):
            for b in rects[i+1:]:
                assert min(a['right'],b['right'])<=max(a['x'],b['x'])+.5 or min(a['bottom'],b['bottom'])<=max(a['y'],b['y'])+.5,('overlap',label,i)
        card=page.locator('.product-card').first
        card.scroll_into_view_if_needed()
        card.hover()
        page.wait_for_timeout(420)
        hover=card.evaluate('el=>({opacity:getComputedStyle(el,"::before").opacity, glow:el.style.getPropertyValue("--glow-x")})')
        if label=='desktop': assert float(hover['opacity'])>0.85
        if label=='desktop':page.screenshot(path=str(root/'sai12_collection_preview.png'))
        card.click()
        assert page.locator('.modal-sheet').count()==1
        assert page.locator('.modal-visual img').count()==1
        assert page.locator('.modal-visual img').evaluate('im=>im.naturalWidth===2800')
        page.locator('[data-add="holder"]').click()
        assert page.locator('.modal-sheet').count()==1,'modal closed after add'
        assert page.locator('.modal-add-status').inner_text().strip()=='01 item in bag'
        assert '(01)' in page.locator('#bag-count').inner_text()
        page.locator('[data-add="holder"]').click()
        assert page.locator('.modal-sheet').count()==1,'modal closed after second add'
        assert page.locator('.modal-add-status').inner_text().strip()=='02 items in bag'
        assert '(02)' in page.locator('#bag-count').inner_text()
        page.locator('[data-close-modal]').last.click()
        page.locator('[data-view="bag"]').click()
        page.wait_for_timeout(600)
        assert page.locator('.summary-total').inner_text().find('$110')>=0, 'bag total not $110'
        page.locator('[data-view="philosophy"]').click()
        page.wait_for_timeout(600)
        assert page.locator('.philosophy-page').count()==1
        assert page.locator('.philosophy-texts .philosophy-card').count()==2
        assert page.locator('.philosophy-portrait img').count()==1
        assert not errors,('JS errors',label,errors)
        page.close()
        checks.append({'viewport':label,'collection_white':True,'cards':5,'holder_add_keeps_open':True,'repeat_add':2,'bag_total':'$110','errors':errors})
    browser.close()
print(json.dumps(checks,indent=2))
