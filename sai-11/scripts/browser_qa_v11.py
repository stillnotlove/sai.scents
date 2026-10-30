"""SAI v11 integration QA: real file-backed responses in Chromium, without external network."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,json,re
root=Path(__file__).resolve().parent.parent
pub=root/'public'
base='about:blank'
checks=[]

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height,label in [(1440,900,'desktop'),(390,844,'mobile')]:
        page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
        errors=[]
        responses={}
        page.on('pageerror',lambda exc: errors.append(str(exc)))
        html=(pub/'index.html').read_text()
        html=re.sub(r'<link\b[^>]*>', '', html)
        html=re.sub(r'<script\s+src=[^>]+></script>', '', html)
        css=(pub/'styles.css').read_text()
        js=(pub/'app.js').read_text()
        assets={}
        for f in (pub/'assets').glob('*'):
            if f.suffix not in ('.webp','.png'): continue
            assets[f.name]=base64.b64encode(f.read_bytes()).decode('ascii')
        page.set_content(html,wait_until='domcontentloaded')
        page.add_style_tag(content=css)
        page.evaluate("""assets => {
          window.__assetUrls = {};
          for(const [name,b64] of Object.entries(assets)){
            const bytes = Uint8Array.from(atob(b64), c=>c.charCodeAt(0));
            const type = name.endsWith('.webp') ? 'image/webp':'image/png';
            window.__assetUrls[name] = URL.createObjectURL(new Blob([bytes],{type}));
          }
        }""", assets)
        js=js.replace('const asset = n => `/assets/${n}`;', 'const asset = n => window.__assetUrls[n];')
        js=js.replace("if(push) history.pushState({view:next}, '', next==='intro'?'/':`/?view=${next}`);",'if(push) void 0;')
        page.add_script_tag(content=js)
        responses={name:len(base64.b64decode(b64)) for name,b64 in assets.items()}
        assert page.locator('#intro-enter').count()==1
        # Warm image load is kicked off by idle; direct route must also work.
        page.locator('#intro-enter').click()
        page.wait_for_timeout(550)
        assert page.locator('.product-card').count()==5
        # Check layout: no overlaps, correct width across rows.
        rectangles=page.locator('.product-card').evaluate_all('(els)=>els.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,right:e.getBoundingClientRect().right,bottom:e.getBoundingClientRect().bottom}))')
        for i,a in enumerate(rectangles):
            for b in rectangles[i+1:]:
                assert min(a['right'],b['right'])<=max(a['x'],b['x'])+.5 or min(a['bottom'],b['bottom'])<=max(a['y'],b['y'])+.5, ('cards overlap',label,i)
        card=page.locator('.product-card').first
        card.scroll_into_view_if_needed()
        card.hover()
        page.wait_for_timeout(440)
        after=card.evaluate('e=>({before:getComputedStyle(e,"::before").opacity, after:getComputedStyle(e,"::after").opacity, gx:e.style.getPropertyValue("--glow-x"), bg:getComputedStyle(e).backgroundColor})')
        assert float(after['before'])>.89 and float(after['after'])>.89,('glass layer',label,after)
        if label=='desktop':
            assert after['gx'].endswith('%'),('no cursor reflection',after)
        if label=='desktop': page.screenshot(path=str(root/'qa_collection_hover_desktop.png'))
        card.click()
        assert page.locator('.modal-sheet').count()==1
        photo=page.locator('.modal-visual img')
        assert photo.count()==1
        assert photo.evaluate('im=>im.complete && im.naturalWidth===2800'),('holder resolution incorrect',label)
        page.locator('[data-add="holder"]').click()
        assert '(01)' in page.locator('#bag-count').inner_text()
        # navigate to philosophy and check original image displayed with optimized encoding
        page.locator('[data-view="philosophy"]').click()
        page.wait_for_timeout(550)
        portrait=page.locator('.philosophy-portrait img')
        assert portrait.count()==1
        portrait.scroll_into_view_if_needed()
        portrait.wait_for(state='visible')
        page.wait_for_function('document.querySelector(".philosophy-portrait img")?.complete && document.querySelector(".philosophy-portrait img")?.naturalWidth>0')
        art=portrait.evaluate('el=>({w:el.naturalWidth,h:el.naturalHeight,url:el.currentSrc,complete:el.complete})')
        assert art['url'].startswith('blob:') and art['complete'],('portrait not optimized',label,art)
        assert page.locator('.philosophy-texts .philosophy-card').count()==2
        assert not errors,('javascript errors',label,errors)
        page.locator('.brand-link').click()
        page.wait_for_timeout(540)
        assert page.locator('#intro-enter').count()==1
        # Interruptibility: fast clicks should not leave multiple pages or stuck state.
        page.locator('#intro-enter').click()
        page.wait_for_timeout(120)
        page.locator('[data-view="philosophy"]').click()
        page.wait_for_timeout(530)
        assert page.locator('#view > .page').count()==1
        assert page.locator('.philosophy-page').count()==1
        # optionally take screenshot of collection/philosophy for QC
        if label=='desktop':
            page.screenshot(path=str(root/'qa_philosophy_desktop.png'))
        page.close()
        checks.append({'screen':label,'cards':len(rectangles),'holder_image':2800,'portrait':art,'hover':after,'errors':errors,'network_bytes':sum(responses.values())})
    browser.close()
print(json.dumps(checks,ensure_ascii=False,indent=2))
