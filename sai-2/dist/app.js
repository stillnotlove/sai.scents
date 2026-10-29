(() => {
  'use strict';
  const $ = (s,b=document)=>b.querySelector(s);
  const $$ = (s,b=document)=>[...b.querySelectorAll(s)];
  const view = $('#view');
  const veil = $('#page-veil');
  const overlay = $('#product-overlay');
  const countEl = $('#bag-count');
  const toast = $('#toast');
  const header = $('#header');
  const asset = name => `/assets/${name}`;
  const fmt = value => value === null ? '—' : `$${Number(value).toFixed(0)}`;

  const products = [
    {id:'holder', number:'001', title:'Incense Holder', label:'Brushed steel / object study', type:'objects', price:55, image:'holder-main.png', overlay:'holder-main.png', layout:'hero', desc:'A solid steel holder with a quiet geometry. One gesture, one stick, one continuous ash line.', notes:'Brushed stainless steel · Single stick holder'},
    {id:'hinoki', number:'002', title:'Hinoki', label:'Clean wood / cool air', type:'incense', price:15, image:'scent-hinoki.png', overlay:'scent-hinoki.png', layout:'landscape', desc:'A dry and spacious interpretation of hinoki wood. Cool, clean and precise.', notes:'Incense sticks · Concept scent'},
    {id:'rice-smoke', number:'003', title:'Rice Smoke', label:'Rice / paper / soft smoke', type:'incense', price:15, image:'scent-rice.png', overlay:'scent-rice.png', layout:'landscape', desc:'Steamed rice, paper and a faint smoke trace. Softness without sweetness.', notes:'Incense sticks · Concept scent'},
    {id:'black-tea', number:'004', title:'Black Tea', label:'Dry tea / wood', type:'incense', price:15, image:'scent-tea.png', overlay:'scent-tea.png', layout:'portrait', desc:'Warm tea and dry wood carried through a calm, architectural smoke.', notes:'Incense sticks · Concept scent'},
    {id:'red-shiso', number:'005', title:'Red Shiso', label:'Shiso / green / pepper', type:'incense', price:15, image:'scent-shiso.png', overlay:'scent-shiso.png', layout:'portrait', desc:'Sharp and botanical with a peppered edge. Direct, clean and unusual.', notes:'Incense sticks · Concept scent'},
    {id:'yuzu-peel', number:'006', title:'Yuzu Peel', label:'Bitter citrus / green stem', type:'incense', price:15, image:'scent-yuzu.png', overlay:'scent-yuzu.png', layout:'square', desc:'Bitter zest, subtle brightness and a green stem freshness.', notes:'Incense sticks · Concept scent'},
    {id:'cedar-dust', number:'007', title:'Cedar Dust', label:'Cedar / mineral', type:'incense', price:15, image:'scent-cedar.png', overlay:'scent-cedar.png', layout:'square', desc:'Dry cedar and mineral air. Grounded and restrained.', notes:'Incense sticks · Concept scent'},
    {id:'matches', number:'008', title:'Safety Matches', label:'20 matches / monochrome', type:'objects', price:null, image:'matches.png', overlay:'matches.png', layout:'square', desc:'Long black safety matches with grey heads, intended to accompany the ritual.', notes:'Price and availability to be confirmed'},
    {id:'journal', number:'009', title:'SAI Journal', label:'Editorial object / soon', type:'editions', price:null, image:null, overlay:null, layout:'placeholder', desc:'A printed study of scent, ritual and objects. Visuals will be added later.', notes:'Editorial edition · In development'}
  ];

  let activeView = 'home';
  let activeFilter = 'all';
  let transitionBusy = false;
  let toastTimeout = null;
  let cart = {};
  try {
    const saved = JSON.parse(localStorage.getItem('sai_demo_cart') || '{}');
    cart = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch(_e) { cart = {}; }

  const image = (name, cls='', extra='') => `<img src="${asset(name)}" class="${cls}" ${extra} alt=""/>`;

  function homePage(){
    return `<section class="page home-screen" aria-label="SAI — Incense & Objects">
      ${image('hero-logo.png','hero-original','fetchpriority="high" draggable="false"')}
      <div class="hero-fog" aria-hidden="true"></div>
      <div class="hero-meta"><span>SCENT IS A WAY OF SEEING.</span><span>STUDY NO. 001 / 2026</span></div>
      <div class="hero-copy">A contemporary interpretation of Kōdō.<br/>Objects, fragrance, and the spaces between.</div>
      <div class="hero-note">Use the navigation</div>
    </section>`;
  }

  const cardClass = p => `product-card ${p.layout} ${p.id==='matches'?'matches':''} ${p.image? '' : 'placeholder'}`;
  const productCard = p => `<article class="${cardClass(p)}" data-product="${p.id}" tabindex="0" role="button" aria-label="View ${p.title}">
    <div class="product-media">
      <span class="product-meta">${p.number} / SAI</span>
      ${p.image ? image(p.image,'',`loading="lazy" decoding="async"`) : `<div class="journal-placeholder"><div class="inner"><span class="plus">+</span><span class="label">Artwork to be added</span></div></div>`}
      <div class="product-quick" aria-hidden="true">↗</div>
    </div>
    <div class="product-text"><div><h2>${p.title}</h2><p>${p.label}</p></div><strong>${fmt(p.price)}</strong></div>
  </article>`;

  function collectionPage(){
    const visible = products.filter(p => activeFilter==='all' || p.type===activeFilter);
    return `<section class="page collection-page">
      <div class="collection-head">
        <div><div class="micro muted" style="color:#8c8c93">The index / 001 — 009</div><h1>The collection.</h1></div>
        <p>Objects and incense designed to alter the feeling of a space. Precise, quiet and reduced to essentials.</p>
      </div>
      <div class="filters" aria-label="Filter collection">
        ${[['all','All'],['incense','Incense'],['objects','Objects'],['editions','Editions']].map(([k,l])=>`<button class="filter ${activeFilter===k?'active':''}" type="button" data-filter="${k}" aria-pressed="${activeFilter===k}">${l}</button>`).join('')}
        <span class="filter-count">${String(visible.length).padStart(2,'0')} objects</span>
      </div>
      <div class="product-grid">${visible.map(productCard).join('')}</div>
    </section>`;
  }

  function philosophyPage(){
    return `<section class="page philosophy-page">
      <div class="philosophy-intro">
        <div><div class="micro" style="color:#7f7f86">SAI / PHILOSOPHY</div><h1>The art of<br/>listening.</h1></div>
        <div class="philosophy-copy">Kōdō is the Japanese practice of appreciating fragrance.<br/>It asks us to pay attention — not simply to what an aroma smells like, but to how it occupies a moment.</div>
      </div>
      <div class="philosophy-body">
        <div class="portrait-frame">${image('portrait.png','','loading="lazy" decoding="async"')}</div>
        <div class="philosophy-panel">
          <div>
            <div class="micro" style="color:#7f7f86">A face of SAI / Isao Mori</div>
            <h2>A quiet influence.</h2>
            <p>Isao Mori is the fictional face and symbolic guide of SAI. He does not explain the ritual so much as embody its attitude: attentive, understated, and open to the emotional atmosphere created by scent.</p>
          </div>
          <div class="philosophy-quote">Fragrance is not decoration. It is a way of shaping stillness.</div>
        </div>
      </div>
    </section>`;
  }

  function bagPage(){
    const active = products.filter(p => cart[p.id] > 0 && p.price !== null);
    const itemsCount = active.reduce((acc,p)=>acc+(cart[p.id]||0),0);
    const subtotal = active.reduce((acc,p)=>acc+(cart[p.id]||0)*p.price,0);
    return `<section class="page bag-page">
      <div class="bag-top"><div><div class="micro muted">Your selection / SAI</div><h1>Shopping bag.</h1></div><div class="micro muted">${String(itemsCount).padStart(2,'0')} objects</div></div>
      <div class="bag-grid">
        <div class="bag-items">
          ${active.length ? active.map(p=>`<div class="bag-row">${image(p.image||'hero-logo.png','','decoding="async"')}<div><div class="name">${p.title}</div><div class="detail">${p.label}</div><div class="qty-control"><button type="button" data-qty="${p.id}" data-delta="-1" aria-label="Remove one ${p.title}">−</button><span>${String(cart[p.id]).padStart(2,'0')}</span><button type="button" data-qty="${p.id}" data-delta="1" aria-label="Add one ${p.title}">+</button></div></div><div class="row-price">${fmt(p.price*cart[p.id])}</div></div>`).join('') : `<div class="empty-bag"><div><h2>Nothing here. Yet.</h2><p>Your selection is waiting to begin.</p><a href="/?view=collection" data-view="collection" class="button"><span>Discover the collection</span><span>↗</span></a></div></div>`}
        </div>
        <aside class="order-summary"><div class="micro muted" style="margin-bottom:18px">Order summary</div><div class="summary-line"><span>Items (${itemsCount})</span><span>${fmt(subtotal)}</span></div><div class="summary-line"><span>Shipping</span><span>—</span></div><div class="total"><span>Total</span><b>${fmt(subtotal)}</b></div><button class="button" type="button" data-demo-checkout ${itemsCount ? '' : 'disabled'}><span>Continue</span><span>↗</span></button><p class="demo-note">Visual demo only. No payment or order is processed.</p></aside>
      </div>
    </section>`;
  }

  function productHTML(p){
    return `<div class="overlay-backdrop" data-close-product="true"></div>
      <section class="product-sheet" role="dialog" aria-modal="true" aria-label="${p.title}" tabindex="-1">
        <div class="sheet-top"><span class="micro">SAI / OBJECT ${p.number}</span><button class="round-dismiss" type="button" data-close-product="true" aria-label="Close">×</button></div>
        <div class="sheet-image">${p.overlay ? image(p.overlay,'',`decoding="async"`) : `<div class="journal-placeholder"><div class="inner"><span class="plus">+</span><span class="label">Artwork to be added</span></div></div>`}</div>
        <div class="sheet-info"><div class="micro muted">${p.label}</div><h2>${p.title}.</h2><p class="description">${p.desc}</p><div class="sheet-spec"><span>${p.notes}</span><span>${fmt(p.price)}</span></div>${p.price !== null ? `<button type="button" class="button" data-add="${p.id}"><span>Add to bag — ${fmt(p.price)}</span><span>+</span></button>` : `<button type="button" class="button" disabled><span>Coming soon</span><span>—</span></button>`}</div>
      </section>`;
  }

  function cartSave(){
    try { localStorage.setItem('sai_demo_cart', JSON.stringify(cart)); } catch(_e) {}
    const n = Object.values(cart).reduce((a,b)=>a + (Number(b)||0), 0);
    countEl.textContent = `(${String(n).padStart(2,'0')})`;
  }
  function toastMessage(msg){
    toast.textContent = msg;
    toast.classList.add('on');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(()=>toast.classList.remove('on'), 2200);
  }
  function syncHeader(){
    const isDark = activeView === 'collection' || activeView === 'philosophy';
    header.classList.toggle('dark', isDark);
    $$('[data-route-nav]').forEach(el => el.classList.toggle('active', el.dataset.routeNav === activeView));
  }
  function render(){
    view.classList.toggle('bg-dark', activeView==='collection' || activeView==='philosophy');
    view.classList.toggle('bg-white', activeView==='bag');
    view.innerHTML = activeView === 'collection' ? collectionPage() : activeView === 'philosophy' ? philosophyPage() : activeView === 'bag' ? bagPage() : homePage();
    syncHeader();
    cartSave();
  }
  function validView(v){ return ['home','collection','philosophy','bag'].includes(v) ? v : 'home'; }
  function closeProduct(){ overlay.hidden = true; overlay.innerHTML = ''; document.body.classList.remove('locked'); }
  function openProduct(id){ const p = products.find(x=>x.id===id); if(!p) return; overlay.innerHTML = productHTML(p); overlay.hidden = false; document.body.classList.add('locked'); $('.product-sheet', overlay).focus(); }
  function navigate(next, {push=true, immediate=false} = {}){
    next = validView(next);
    if(transitionBusy) return;
    closeProduct();
    const nextURL = next === 'home' ? '/' : `/?view=${next}`;
    if(push) history.pushState({view:next}, '', nextURL);
    if(immediate){ activeView = next; render(); return; }
    transitionBusy = true;
    veil.classList.add('on');
    setTimeout(()=>{
      activeView = next;
      render();
      setTimeout(()=>{
        veil.classList.remove('on');
        setTimeout(()=> transitionBusy = false, 120);
      }, 70);
    }, 120);
  }

  document.addEventListener('click', (event)=>{
    const viewTarget = event.target.closest('[data-view]');
    if(viewTarget){ event.preventDefault(); navigate(viewTarget.dataset.view); return; }
    const filterTarget = event.target.closest('[data-filter]');
    if(filterTarget){ activeFilter = filterTarget.dataset.filter; render(); return; }
    const productTarget = event.target.closest('[data-product]');
    if(productTarget){ openProduct(productTarget.dataset.product); return; }
    if(event.target.closest('[data-close-product]')){ closeProduct(); return; }
    const addTarget = event.target.closest('[data-add]');
    if(addTarget){ const id = addTarget.dataset.add; cart[id] = (cart[id]||0) + 1; cartSave(); closeProduct(); toastMessage('Added to your bag.'); return; }
    const qtyTarget = event.target.closest('[data-qty]');
    if(qtyTarget){ const id = qtyTarget.dataset.qty; cart[id] = Math.max(0, (cart[id]||0) + Number(qtyTarget.dataset.delta)); if(!cart[id]) delete cart[id]; render(); return; }
    if(event.target.closest('[data-demo-checkout]')){ toastMessage('Visual demo only — checkout is not connected.'); }
  });

  document.addEventListener('keydown', (event)=>{
    if(event.key === 'Escape' && !overlay.hidden) closeProduct();
    if((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-product]')){ event.preventDefault(); openProduct(event.target.dataset.product); }
  });

  window.addEventListener('popstate', ()=>{
    const qs = new URLSearchParams(location.search);
    navigate(qs.get('view') || 'home', {push:false, immediate:true});
  });

  activeView = validView(new URLSearchParams(location.search).get('view') || 'home');
  render();
})();
