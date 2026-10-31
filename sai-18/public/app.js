(() => {
  'use strict';
  const $ = (s,b=document) => b.querySelector(s);
  const $$ = (s,b=document) => [...b.querySelectorAll(s)];
  const view = $('#view');
  const header = $('#site-header');
  const bagCount = $('#bag-count');
  const modal = $('#product-modal');
  const toast = $('#toast');
  let lastFocus = null;
  let modalCloseTimer = null;
  const warmCache = new Map();
  function warmImage(file){
    if(warmCache.has(file)) return warmCache.get(file);
    const img = new Image();
    img.decoding = 'async';
    img.src = asset(file);
    warmCache.set(file,img);
    if(img.decode) img.decode().catch(()=>{});
    return img;
  }
  function warmProductMedia(){
    // Portrait is warmed by the responsive preload link so we fetch only the needed size.
    ['holder-detail-v18.webp','sticks-approved.webp','matches-approved.webp','zine-v18.webp','vinyl-v18.webp'].forEach(warmImage);
  }
  const asset = n => `/assets/${n}`;
  const money = v => v == null ? '—' : `$${v}`;
  let current = 'intro';
  let moving = false;
  let transitionTimer = null;
  let cart = {};
  let toastTimer = null;
  try { cart = JSON.parse(localStorage.getItem('sai_cart_demo') || '{}') || {}; } catch { cart = {}; }

  // Only five approved collection entries. Unpriced editions are intentionally TBD.
  const products = [
    {id:'holder',index:'001',kind:'FORM',title:'Incense Holder',subtitle:'Brushed stainless steel',price:55,image:'holder-detail-v18.webp',desc:'A precise steel object designed to hold one stick at an angle and keep the ritual visually calm.',meta:'Stainless steel / Form / 001'},
    {id:'rice',index:'002',kind:'SCENT',title:'Rice Smoke',subtitle:'Rice / paper / soft smoke',price:15,image:'sticks-approved.webp',desc:'Soft and restrained. Rice, pale smoke, and a smooth paper-like calm.',meta:'Incense sticks / Scent / 002'},
    {id:'matches',index:'003',kind:'IGNITION',title:'Matches',subtitle:'Long safety matches',price:null,image:'matches-approved.webp',desc:'Long monochrome safety matches designed to accompany the ritual.',meta:'Ignition / Accessory / 003'},
    {id:'zine',index:'004',kind:'PHILOSOPHY',title:'Zine',subtitle:'SAI printed edition',price:null,image:'zine-v18.webp',desc:'An editorial publication on fragrance, objects and attention.',meta:'Philosophy / Printed edition / 004'},
    {id:'vinyl',index:'005',kind:'VINYL',title:'Vinyl',subtitle:'SAI sound edition',price:null,image:'vinyl-v18.webp',desc:'A forthcoming sound edition exploring stillness and atmosphere.',meta:'Vinyl / Sound edition / 005'}
  ];

  function setCount(){
    const total = Object.values(cart).reduce((a,b)=>a+(Number(b)||0),0);
    bagCount.textContent = `(${String(total).padStart(2,'0')})`;
    try { localStorage.setItem('sai_cart_demo', JSON.stringify(cart)); } catch {}
  }

  function showToast(message){
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>toast.classList.remove('show'), 1800);
  }

  function syncHeader(){
    const hidden = current === 'intro';
    const dark = current === 'philosophy' || current === 'connections';
    header.classList.toggle('hidden', hidden);
    header.classList.toggle('dark', dark);
    header.classList.toggle('collection-route', current === 'collection');
    $$('[data-route]').forEach(link => link.classList.toggle('active', link.dataset.route === current));
  }

  function introPage(){
    return `<button type="button" class="page intro-page" id="intro-enter" aria-label="Enter SAI collection">
      <picture class="intro-picture"><source media="(max-width:760px)" srcset="${asset('hero-symbol-mobile.png')}"/><img src="${asset('hero-logo.png')}" alt="SAI" class="intro-logo" fetchpriority="high" draggable="false"/></picture>
    </button>`;
  }

  function collectionPage(){
    return `<section class="page collection-page" aria-labelledby="collection-heading">
      <div class="collection-head"><div><div class="eyebrow">SAI / SERIES 001—005</div><h1 id="collection-heading">STILL AIR.</h1></div>
      <p>An exploration of scent, form and atmosphere.</p></div>
      <div class="collection-grid">${products.map(cardHTML).join('')}</div>
    </section>`;
  }

  function cardHTML(p){
    const price = p.price===null ? 'TBD' : money(p.price);
    return `<article class="product-card ${p.id==='holder'?'product-card-feature':''}" data-product="${p.id}" tabindex="0" role="button" aria-label="View ${p.title}">
      <span class="product-card-index">${p.kind} / ${p.index}</span>
      <span class="product-card-arrow" aria-hidden="true">↗</span>
      <div class="product-card-title">${p.title}</div>
      <span class="product-card-price">${price}</span>
    </article>`;
  }

  function philosophyPage(){
    return `<section class="page philosophy-page" aria-label="SAI philosophy">
      <div class="philosophy-hero">
        <div><div class="eyebrow">SAI / PHILOSOPHY</div><h1>The art of<br/>listening.</h1></div>
        <div class="philosophy-intro">Kōdō is the Japanese practice of appreciating fragrance.<span class="philosophy-next-sentence">It asks us to pay attention — not simply to what an aroma smells like,<span class="philosophy-next-line">but to how it occupies a moment.</span></span></div>
      </div>
      <div class="philosophy-sections">
        <div class="philosophy-layout">
          <div class="philosophy-portrait"><img src="${asset('isao-mori-full.webp')}" srcset="${asset('isao-mori-full-640.webp')} 640w, ${asset('isao-mori-full.webp')} 1122w" sizes="(max-width:760px) min(92vw,560px), (max-width:1480px) 42vw, 610px" alt="Portrait of Isao Mori, the symbolic face of SAI" width="1122" height="1402" decoding="async" fetchpriority="high" /></div>
          <div class="philosophy-texts">
            <div class="philosophy-card text"><div>
              <div class="philosophy-note">A quiet figure / Isao Mori</div>
              <h2>The face of SAI.</h2>
              <p>Isao Mori acts as a symbolic guide for the brand — not as a loud founder figure, but as a calm presence shaped by the spirit of Kōdō. He represents attention, restraint and a sensitivity to atmosphere.</p>
            </div><p>Fragrance is treated not as ornament, but as a medium: something that changes the emotional density of a room.</p></div>
            <div class="philosophy-card text"><div>
              <div class="philosophy-note">Form / 001</div>
              <h2>Form reduced.</h2>
              <p>Each object is edited back to essentials. The holder keeps the gesture simple. The stick becomes a line. The ash becomes a record of time. Nothing more needs to happen.</p>
            </div><p>Materials remain honest, silhouettes stay controlled, and the interface between hand, object and scent remains clear.</p></div>
          </div>
        </div>
      </div>
    </section>`;
  }

  function connectionsPage(){
    return `<section class="page connections-page" aria-labelledby="connections-heading">
      <div class="connections-shell">
        <header class="connections-hero">
          <div><div class="eyebrow">SAI / PHYSICAL SPACE</div><h1 id="connections-heading">Connections.</h1></div>
          <p>A place to experience fragrance as space. An invitation to slow down, notice the air, and stay for a moment.</p>
        </header>
        <div class="connections-gallery" aria-label="SAI storefront and exterior sign">
          <figure class="connections-image connections-storefront"><img src="${asset('connections-storefront.webp')}" alt="SAI monochrome storefront with frosted glass and oversized logo" width="2400" height="1500" decoding="async" fetchpriority="high" /></figure>
          <figure class="connections-image connections-flag"><img src="${asset('connections-flag-wide.webp')}" alt="SAI black hanging flag against a minimalist concrete facade" width="2048" height="1254" decoding="async" loading="lazy" /></figure>
        </div>
        <div class="connections-details">
          <div class="connections-description"><div class="philosophy-note">THE SPACE / SAI</div><p>Not simply a store.<br/>A quiet space for scent, form,<br/>and attention.</p></div>
          <div class="connections-data"><div class="connections-datum"><span>LOCATION</span><div>55.7558° N / 37.6173° E<br/>MOSCOW</div></div><div class="connections-datum"><span>HOURS</span><div>TUE — SUN<br/>11:00 — 21:00</div></div></div>
          <div class="connections-contact"><div class="connections-datum"><span>CONNECT</span><div><a href="https://www.instagram.com/sai.incense/" target="_blank" rel="noopener noreferrer">INST — @sai.incense ↗</a><a href="mailto:sai.scents@info.com">MAIL — sai.scents@info.com ↗</a></div></div></div>
        </div>
        <div class="connections-signoff"><span>SAI — INCENSE &amp; OBJECTS.</span><span>THE ART OF LISTENING.</span></div>
      </div>
    </section>`;
  }

  function bagPage(){
    const items = products.filter(p => p.price != null && cart[p.id] > 0);
    const count = items.reduce((a,p)=>a+cart[p.id],0);
    const subtotal = items.reduce((a,p)=>a+(cart[p.id]*p.price),0);
    return `<section class="page bag-page"><div class="bag-hero"><div><div class="eyebrow">Bag / SAI</div><h1>Your selection.</h1></div><div class="eyebrow">${String(count).padStart(2,'0')} items</div></div><div class="bag-grid"><div class="bag-box">${items.length ? items.map(itemHTML).join('') : `<div class="empty-state"><div><h2>Nothing here. Yet.</h2><p>Select an object to begin.</p><a href="/?view=collection" data-view="collection" class="pill-button"><span>Explore collection</span><span>↗</span></a></div></div>`}</div><aside class="summary-box"><div class="eyebrow" style="margin-bottom:8px">Order summary</div><div class="summary-line"><span>Items (${count})</span><span>${money(subtotal)}</span></div><div class="summary-line"><span>Shipping</span><span>—</span></div><div class="summary-total"><span>Total</span><span>${money(subtotal)}</span></div><button class="pill-button" type="button" data-demo-checkout ${count ? '' : 'disabled'}><span>Continue</span><span>↗</span></button></aside></div></section>`;
  }

  function itemHTML(p){
    // Editorial bag index: deliberately no product thumbnails.
    return `<div class="bag-item"><div class="bag-item-identity"><div class="item-title">${p.title}</div><div class="item-meta">${p.kind} / ${p.index}</div></div><div class="qty-row" aria-label="Quantity for ${p.title}"><button type="button" data-qty="${p.id}" data-delta="-1" aria-label="Remove one ${p.title}">−</button><span>${String(cart[p.id]).padStart(2,'0')}</span><button type="button" data-qty="${p.id}" data-delta="1" aria-label="Add one ${p.title}">+</button></div><div class="item-price">${money(p.price*cart[p.id])}</div></div>`;
  }

  function modalHTML(p){
    // Floating Object: single approved product photo, a restrained detail panel, no gallery.
    const modalPicture = p.image ? `<img src="${asset(p.image)}" alt="${p.title}" decoding="async" />` : `<div class="placeholder-box">Image coming later</div>`;
    return `<div class="modal-backdrop" data-close-modal="true"></div><section class="modal-sheet" role="dialog" aria-modal="true" aria-label="${p.title}" tabindex="-1"><div class="modal-top"><div class="eyebrow" style="margin:0">${p.kind} / ${p.index}</div><button class="close-button" data-close-modal="true" aria-label="Close">×</button></div><div class="modal-visual">${modalPicture}</div><div class="modal-info"><h2>${p.title}</h2><p class="modal-copy">${p.desc}</p><div class="modal-action-row"><span class="modal-price">${p.price == null ? 'TBD' : money(p.price)}</span>${p.price != null ? `<button class="pill-button" type="button" data-add="${p.id}"><span data-add-label>Add to bag</span><span>+</span></button>` : `<button class="pill-button" type="button" disabled><span>Coming soon</span><span>—</span></button>`}</div><p class="modal-add-status" role="status" aria-live="polite"></p></div></section>`;
  }

  function pageHTML(name){
    return name === 'collection' ? collectionPage() : name === 'philosophy' ? philosophyPage() : name === 'connections' ? connectionsPage() : name === 'bag' ? bagPage() : introPage();
  }

  function render(){
    // Instant render is reserved for the initial page and updates within the same route.
    view.innerHTML=pageHTML(current);
    view.style.backgroundColor = (current==='philosophy' || current==='connections') ? '#000000' : (current==='collection' || current==='bag') ? '#ffffff' : '#dddde0';
    syncHeader();
    setCount();
  }

  function valid(v){ return ['intro','collection','philosophy','connections','bag'].includes(v) ? v : 'intro'; }

  // Page dissolve: lightweight opacity crossfade plus a restrained mist layer.
  // It starts on the click, never inserts a blank screen, and can be interrupted.
  function finishTransition(){
    if(transitionTimer !== null) { clearTimeout(transitionTimer); transitionTimer=null; }
    const pages=$$('.page',view);
    pages.slice(0,-1).forEach(p=>p.remove());
    const last=pages.at(-1);
    if(last) last.classList.remove('route-initial','route-visible','route-exit');
    view.classList.remove('is-transitioning');
    moving=false;
  }

  function navigate(next, push=true){
    next = valid(next);
    if(next === current) return;
    if(moving) finishTransition();
    // Navigation has its own crossfade; skip the modal's exit wait on a route change.
    closeModal({immediate:true,restoreFocus:false});
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      current=next;
      if(push) history.pushState({view:next}, '', next==='intro'?'/':`/?view=${next}`);
      render();
      return;
    }
    moving=true;
    const previous=view.querySelector('.page:last-child');
    const template=document.createElement('template');
    template.innerHTML=pageHTML(next).trim();
    const incoming=template.content.firstElementChild;
    incoming.classList.add('route-initial');
    view.appendChild(incoming);
    view.style.backgroundColor = (next==='philosophy' || next==='connections') ? '#000000' : (next==='collection' || next==='bag') ? '#ffffff' : '#dddde0';
    current=next;
    if(push) history.pushState({view:next}, '', next==='intro'?'/':`/?view=${next}`);
    syncHeader();
    setCount();
    // The first paint is committed before crossfading; no intermediate blank frame.
    void incoming.offsetWidth;
    view.classList.add('is-transitioning');
    incoming.classList.add('route-visible');
    if(previous) previous.classList.add('route-exit');
    transitionTimer=window.setTimeout(finishTransition, 505);
  }

  function openModal(id){
    const p = products.find(x => x.id === id); if(!p) return;
    if(modalCloseTimer !== null){
      clearTimeout(modalCloseTimer);
      modalCloseTimer = null;
    }
    if(modal.hidden) lastFocus=document.activeElement;
    modal.classList.remove('is-closing');
    modal.innerHTML = modalHTML(p);
    modal.hidden = false;
    document.body.style.overflow='hidden';
    modal.querySelector('.modal-sheet')?.focus({preventScroll:true});
  }
  function closeModal({immediate=false,restoreFocus=true}={}){
    if(modal.hidden) return;
    if(modal.classList.contains('is-closing') && !immediate) return;
    if(modalCloseTimer !== null){
      clearTimeout(modalCloseTimer);
      modalCloseTimer = null;
    }
    const cleanup=()=>{
      modalCloseTimer=null;
      modal.hidden=true;
      modal.classList.remove('is-closing');
      modal.innerHTML='';
      document.body.style.overflow='';
      if(restoreFocus && lastFocus?.isConnected) lastFocus.focus({preventScroll:true});
      lastFocus=null;
    };
    if(immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      cleanup();
    } else {
      modal.classList.add('is-closing');
      modalCloseTimer=window.setTimeout(cleanup, 395);
    }
  }

  document.addEventListener('click', e => {
    const viewLink = e.target.closest('[data-view]');
    if(viewLink){ e.preventDefault(); navigate(viewLink.dataset.view); return; }
    if(e.target.closest('#intro-enter')){ navigate('collection'); return; }
    const product = e.target.closest('[data-product]');
    if(product){ openModal(product.dataset.product); return; }
    if(e.target.closest('[data-close-modal]')){ closeModal(); return; }
    const add = e.target.closest('[data-add]');
    if(add){
      const id = add.dataset.add;
      cart[id] = (cart[id]||0)+1;
      setCount();
      // Keep the product detail open. Feedback stays inside the card, so there is no abrupt collapse.
      const label=add.querySelector('[data-add-label]');
      const status=modal.querySelector('.modal-add-status');
      if(label) label.textContent = 'Added ✓';
      add.classList.add('just-added');
      if(status) status.textContent = `${String(cart[id]).padStart(2,'0')} ${cart[id] === 1 ? 'item' : 'items'} in bag`;
      clearTimeout(add._saiResetTimer);
      add._saiResetTimer=setTimeout(()=>{
        if(add.isConnected){
          if(label) label.textContent='Add to bag';
          add.classList.remove('just-added');
        }
      },1200);
      return;
    }
    const qty = e.target.closest('[data-qty]');
    if(qty){ const id=qty.dataset.qty, delta=Number(qty.dataset.delta); cart[id]=Math.max(0,(cart[id]||0)+delta); if(!cart[id]) delete cart[id]; render(); return; }
    if(e.target.closest('[data-demo-checkout]')) showToast('Visual demo only.');
  });

  // A mouse-following specular reflection, restricted to the hovered card.
  document.addEventListener('pointermove', e=>{
    if(e.pointerType==='touch') return;
    const card=e.target.closest?.('.product-card');
    if(!card) return;
    const rect=card.getBoundingClientRect();
    card.style.setProperty('--glow-x', `${((e.clientX-rect.left)/rect.width*100).toFixed(1)}%`);
    card.style.setProperty('--glow-y', `${((e.clientY-rect.top)/rect.height*100).toFixed(1)}%`);
  },{passive:true});

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') closeModal();
    const card = e.target.closest?.('[data-product]');
    if(card && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); openModal(card.dataset.product); }
  });

  window.addEventListener('popstate', ()=> {
    const qs = new URLSearchParams(location.search);
    const destination=valid(qs.get('view') || 'intro');
    if(destination===current) return;
    navigate(destination,false);
  });

  current = valid(new URLSearchParams(location.search).get('view') || 'intro');
  render();
  // Warm editorial imagery after initial rendering. Idle requests never block intro.
  if('requestIdleCallback' in window) window.requestIdleCallback(warmProductMedia,{timeout:1200});
  else window.setTimeout(warmProductMedia, 450);
})();
