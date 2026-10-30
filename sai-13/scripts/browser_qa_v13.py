"""Local browser regression suite; no web requests or Vercel access."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,re,json
root=Path(__file__).resolve().parent.parent
pub=root/'public'
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for w,h,label in [(1440,900,'desktop'),(390,844,'mobile')]:
        page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
        errors=[]
        page.set_default_timeout(6500)
        page.on('pageerror',lambda exc: errors.append(str(exc)))
        html=(pub/'index.html').read_text()
        html=re.sub(r'<link\b[^>]*>','',html)
        html=re.sub(r'<script\s+src=[^>]+></script>','',html)
        page.set_content(html,wait_until='domcontentloaded')
        page.add_style_tag(content=(pub/'styles.css').read_text())
        assets={f.name:base64.b64encode(f.read_bytes()).decode() for f in (pub/'assets').glob('*') if f.suffix in ('.png','.webp')}
        page.evaluate('''assets => {window.__assetUrls={};for(const [name,b64] of Object.entries(assets)){let bytes=Uint8Array.from(atob(b64), c=>c.charCodeAt(0));window.__assetUrls[name]=URL.createObjectURL(new Blob([bytes],{type:name.endsWith('.webp')?'image/webp':'image/png'}));}}''',assets)
        js=(pub/'app.js').read_text().replace('const asset = n => `/assets/${n}`;','const asset = n => window.__assetUrls[n];')
        js=js.replace("if(push) history.pushState({view:next}, '', next==='intro'?'/':`/?view=${next}`);",'if(push) void 0;')
        page.add_script_tag(content=js)
        page.locator('#intro-enter').click()
        page.wait_for_timeout(575)
        assert page.locator('.product-card').count()==5
        assert page.locator('.product-card').first.evaluate('e=>getComputedStyle(e).backgroundColor')=='rgb(221, 221, 224)'
        assert page.locator('.product-card').nth(1).evaluate('e=>getComputedStyle(e).backgroundColor')=='rgb(221, 221, 224)'
        card=page.locator('.product-card').first
        card.scroll_into_view_if_needed()
        if label=='desktop':
            card.hover();page.wait_for_timeout(500)
            assert card.evaluate('e=>getComputedStyle(e).backgroundColor')=='rgb(221, 221, 224)'
            assert float(card.evaluate('e=>getComputedStyle(e,"::before").opacity'))>.85
        card.click()
        assert page.locator('.modal-sheet').count()==1
        dim=page.locator('.modal-sheet').bounding_box()
        assert dim['width'] < (780 if label=='desktop' else 400),('modal not compact',dim)
        assert page.locator('.modal-visual img').count()==1
        assert page.locator('.modal-visual img').evaluate('e=>e.naturalWidth')>=2800
        if label=='desktop':
            page.wait_for_timeout(500)
            page.screenshot(path=str(root/'qa_floating_desktop.png'))
        page.locator('[data-add="holder"]').click()
        assert page.locator('.modal-sheet').count()==1
        page.locator('[data-add="holder"]').click()
        assert '(02)' in page.locator('#bag-count').inner_text()
        assert page.locator('.modal-add-status').inner_text().strip()=='02 items in bag'
        page.locator('.close-button').click()
        page.locator('[data-view="bag"]').click()
        page.wait_for_timeout(575)
        assert page.locator('.bag-item').count()==1
        assert page.locator('.bag-item img').count()==0
        assert '$110' in page.locator('.summary-total').inner_text()
        assert page.locator('.bag-item').first.locator('.item-title').inner_text()=='INCENSE HOLDER'
        if label=='desktop':page.screenshot(path=str(root/'qa_bag_desktop.png'))
        page.locator('[data-qty="holder"][data-delta="-1"]').click()
        assert '$55' in page.locator('.summary-total').inner_text()
        page.locator('[data-view="philosophy"]').click()
        page.wait_for_timeout(575)
        assert page.locator('.philosophy-portrait img').count()==1
        assert page.locator('.philosophy-texts .philosophy-card').count()==2
        assert page.locator('.philosophy-page').evaluate('e=>e.scrollHeight>e.clientHeight')
        assert not errors, (label,errors)
        results.append({'screen':label,'catalog_cards':5,'compact_floating':True,'bag_no_images':True,'adding_keeps_open':True,'bag_qty_works':True,'philosophy_scroll':True,'js_errors':errors})
        page.close()
    browser.close()
print(json.dumps(results,ensure_ascii=False,indent=2))
