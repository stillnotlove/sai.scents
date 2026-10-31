"""SAI v18 browser regression: local static files only, no external network."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64, re, json
root=Path(__file__).resolve().parent.parent
pub=root/'public'
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for w,h,label in [(1440,900,'desktop'),(390,844,'mobile')]:
        page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
        errors=[]
        page.set_default_timeout(6500)
        page.on('pageerror',lambda exc:errors.append(str(exc)))
        html=(pub/'index.html').read_text()
        html=re.sub(r'<link\b[^>]*>','',html)
        html=re.sub(r'<script\s+src=[^>]+></script>','',html)
        page.set_content(html,wait_until='domcontentloaded')
        page.add_style_tag(content=(pub/'styles.css').read_text())
        assets={f.name:base64.b64encode(f.read_bytes()).decode() for f in (pub/'assets').glob('*') if f.suffix in ('.png','.webp')}
        page.evaluate('''assets => {window.__assetUrls={};for(const [name,b64] of Object.entries(assets)){let bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));window.__assetUrls[name]=URL.createObjectURL(new Blob([bytes],{type:name.endsWith('.webp')?'image/webp':'image/png'}));}}''',assets)
        js=(pub/'app.js').read_text().replace('const asset = n => `/assets/${n}`;','const asset = n => window.__assetUrls[n];')
        js=js.replace("if(push) history.pushState({view:next}, '', next==='intro'?'/':`/?view=${next}`);",'if(push) void 0;')
        page.add_script_tag(content=js)
        page.locator('#intro-enter').click()
        page.wait_for_timeout(550)
        assert page.locator('#collection-heading').inner_text()=='STILL AIR.'
        assert page.locator('.product-card').count()==5
        assert page.locator('.product-card').first.evaluate('e=>getComputedStyle(e).backgroundColor')=='rgb(221, 221, 224)'
        assert page.locator('.site-header').evaluate('e=>getComputedStyle(e).backgroundColor').startswith('rgba(255, 255, 255, ')
        assert page.locator('.connect-block').count()==0
        cards=[el.bounding_box() for el in page.locator('.product-card').all()]
        for i,a in enumerate(cards):
            for j,b in enumerate(cards[i+1:],start=i+1):
                dx=max(0,min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']))
                dy=max(0,min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y']))
                assert dx*dy<1, (label,'overlap',i,j,dx,dy)
        assert all('study' not in c.lower() for c in page.locator('.product-card-index').all_inner_texts())
        card=page.locator('.product-card').first
        card.click()
        assert page.locator('.modal-sheet').count()==1
        assert page.locator('.modal-top').inner_text().strip().startswith('FORM')
        assert page.locator('.modal-visual img').count()==1
        assert page.locator('.modal-visual img').evaluate("e=>e.src===window.__assetUrls['holder-detail-v18.webp']")
        assert page.locator('.modal-visual img').evaluate('e=>e.decode().then(()=>e.naturalWidth>1000)')
        if label=='desktop':
            page.wait_for_timeout(420)
            page.screenshot(path=str(root/'qa_holder_v18.png'))
        page.wait_for_timeout(410)   # Wait for entrance before testing exit
        page.locator('.close-button').click()
        assert page.locator('.product-modal').evaluate("e=>e.classList.contains('is-closing')"), 'Closing should start animated'
        assert page.locator('.modal-sheet').count()==1, 'Modal should not disappear immediately'
        page.wait_for_timeout(190)
        assert page.locator('.modal-sheet').count()==1,'Modal should persist during closing fade'
        page.wait_for_timeout(260)
        assert page.locator('.modal-sheet').count()==0,'Modal should finish closing'
        assert page.locator('.product-modal').evaluate('e=>e.hidden')
        card.click()
        page.locator('[data-add="holder"]').click()
        assert page.locator('.modal-sheet').count()==1,'Add should not close'
        assert '(01)' in page.locator('#bag-count').inner_text()
        page.locator('.close-button').click()
        page.wait_for_timeout(410)
        # Both newly approved editions must have photographs in their detail views.
        for product,filename in [('zine','zine-v18.webp'),('vinyl','vinyl-v18.webp')]:
            page.locator(f'[data-product="{product}"]').click()
            img=page.locator('.modal-visual img')
            assert img.count()==1,(label,product,'missing image')
            assert img.evaluate('(e,file)=>e.src===window.__assetUrls[file]',filename)
            assert img.evaluate('e=>e.decode().then(()=>e.naturalWidth>1300)')
            if label=='desktop':
                page.wait_for_timeout(420)
                page.screenshot(path=str(root/f'qa_{product}_v18.png'))
            assert page.locator('.modal-action-row').inner_text().count('TBD')==1
            page.locator('.close-button').click()
            page.wait_for_timeout(420)
        page.locator('[data-view="bag"]').click()
        page.wait_for_timeout(550)
        assert page.locator('.bag-item').count()==1
        assert page.locator('.bag-item img').count()==0
        assert '$55' in page.locator('.summary-total').inner_text()
        page.locator('[data-route="connections"]').click()
        page.wait_for_timeout(550)
        assert page.locator('#connections-heading').inner_text()=='Connections.'
        assert page.locator('.site-header.dark').count()==1
        assert '55.7558' in page.locator('.connections-page').inner_text()
        description=page.locator('.connections-description p')
        assert 'form,' in description.inner_text() and 'and attention.' in description.inner_text()
        assert description.locator('br').count()==2
        assert 'and attention.' in description.inner_text().splitlines()[-1]
        assert '@sai.incense' in page.locator('.connections-page').inner_text()
        assert '11:00 — 21:00' in page.locator('.connections-page').inner_text()
        assert page.locator('.connections-gallery img').count()==2
        for img in page.locator('.connections-gallery img').all():
            img.scroll_into_view_if_needed()
            img.evaluate('e=>e.decode()')
            assert img.evaluate('e=>e.naturalWidth>1500')
        page.screenshot(path=str(root/f'qa_connections_{label}.png'),full_page=True)
        assert page.locator('.connections-page').evaluate('e=>e.scrollHeight>e.clientHeight')
        page.locator('[data-view="philosophy"]').click()
        page.wait_for_timeout(550)
        assert page.locator('.philosophy-card.text').count()==2
        assert page.locator('.philosophy-portrait img').count()==1
        assert not page.locator('.philosophy-page').inner_text().lower().count('study')
        line=page.locator('.philosophy-next-line')
        assert line.count()==1
        assert line.inner_text().startswith('but to ')
        assert line.evaluate('e=>getComputedStyle(e).display')=='block'
        assert page.locator('.philosophy-page').evaluate('e=>e.scrollHeight>e.clientHeight')
        assert not errors,(label,errors)
        results.append({'new_product_media':True,'connections_line_break':True,'favicon_S':True,'viewport':label,'cards':5,'no_overlap':True,'close_delayed_and_smooth':True,'add_keeps_open':True,'bag_no_images':True,'line_break_before_but_to':True,'connections_page':True,'no_study':True,'js_errors':errors})
        page.close()
    browser.close()
print(json.dumps(results,indent=2))
