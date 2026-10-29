(() => {
  'use strict';
  const $ = (selector,base=document) => base.querySelector(selector);
  const $$ = (selector,base=document) => [...base.querySelectorAll(selector)];
  const view = $('#view');
  const veil = $('#page-veil');
  const overlay = $('#product-overlay');
  const countEl = $('#bag-count');
  const toast = $('#toast');
  const header = $('#header');
  const asset = name => `/assets/${name}`;
  const fmt = value => value === null ? '—' : `$${Number(value).toFixed(0)}`;
  const products = [
    {id:'holder', number:'001', title:'Incense Holder',label:'OBJECT STUDY 001',type:'objects',price:55,image:'holder-main.webp',fit:'',desc:'One considered gesture in brushed stainless steel. A solid counterweight and an elongated ash channel form a quiet, functional object.',notes:'Brushed stainless steel · Single stick holder'},
    {id:'hinoki',number:'002',title:'Hinoki',label:'CLEAN WOOD / COOL AIR',type:'incense',price:15,image:'scent-hinoki.webp',desc:'The clarity of hinoki wood. A dry, spacious, quietly resinous atmosphere.',notes:'Incense sticks · Conceptual scent collection'},
    {id:'rice-smoke',number:'003',title:'Rice Smoke',label:'RICE / PAPER / SOFT SMOKE',type:'incense',price:15,image:'scent-rice.webp',desc:'An understated study of steamed rice, paper and the faintest smoky trace.',notes:'Incense sticks · Conceptual scent collection'},
    {id:'black-tea',number:'004',title:'Black Tea',label:'DRY TEA / WOOD',type:'incense',price:15,image:'scent-tea.webp',desc:'Deep tea, dry wood and restrained smoke. A warm note within a cool space.',notes:'Incense sticks · Conceptual scent collection'},
    {id:'red-shiso',number:'005',title:'Red Shiso',label:'SHISO / GREEN / PEPPER',type:'incense',price:15,image:'scent-shiso.webp',desc:'A sharp botanical note with a light peppered edge. Clean, direct, uncommon.',notes:'Incense sticks · Conceptual scent collection'},
    {id:'yuzu-peel',number:'006',title:'Yuzu Peel',label:'BITTER CITRUS / GREEN STEM',type:'incense',price:15,image:'scent-yuzu.webp',desc:'Bitter citrus zest and green stem. A precise shift in the air.',notes:'Incense sticks · Conceptual scent collection'},
    {id:'cedar-dust',number:'007',title:'Cedar Dust',label:'CEDAR / MINERAL',type:'incense',price:15,image:'scent-cedar.webp',desc:'Cedar and mineral dryness. A grounded scent with very little sweetness.',notes:'Incense sticks · Conceptual scent collection'},
    {id:'matches',number:'008',title:'Safety Matches',label:'20 MATCHES / MONOCHROME',type:'objects',price:null,image:'matches.webp',desc:'Long black safety matches with grey heads. Designed to accompany the ritual.',notes:'Price and availability to be confirmed'},
    {id:'journal',number:'009',title:'SAI Journal',label:'EDITORIAL OBJECT / SOON',type:'editions',price:null,image:null,desc:'A printed study of scent, culture and objects. Visuals to be added.',notes:'Editorial edition · In development'}
  ];
  let activeView='home';
  let activeFilter='all';
  let transitionBusy=false;
  let toastTimeout;
  let observer;
  let cart = {};
  try {const saved=JSON.parse(localStorage.getItem('sai_demo_cart')||'{}');cart=(saved&&typeof saved==='object'&&!Array.isArray(saved))?saved:{}} catch {cart={}}
  const image = (name, cls='', extra='') => `<img src="${asset(name)}" class="${cls}" ${extra} alt=""/>`;
  const button = (label, target, second=false) => `<a href="/?view=${target}" data-view="${target}" class="button ${second?'secondary':''}"><span>${label}</span><span class="btn-arrow" aria-hidden="true">↗</span></a>`;
  const heroPage = () => `
    <section class="hero" aria-label="SAI — Incense & Objects">
      ${image('hero-logo.png','hero-original','fetchpriority="high" draggable="false"')}
      <div class="hero-fog" aria-hidden="true"></div>
      <div class="hero-top"><span>SCENT IS A WAY OF SEEING.</span><span>STUDY NO. 001 / 2026</span></div>
      <div class="hero-lower"><div class="hero-line">A contemporary interpretation of Kōdō.<br/>Objects, fragrance, and the spaces between.</div>
       <div class="hero-buttons">${button('Explore collection','collection')}${button('The philosophy','philosophy',true)}</div>
      </div>
      <div class="hero-scroll" aria-hidden="true">SCROLL</div>
    </section>
    <section class="section-space section-intro">
      <div class="body reveal"><div class="micro muted">01 — A DIFFERENT KIND OF ATTENTION</div><h2 class="section-title" style="margin-top:30px">An atmosphere,<br/>not an accessory.</h2><p class="section-copy">A scent can change how a room feels without changing what it contains. SAI explores this quiet transformation through incense and considered everyday objects.</p>${button('Discover SAI','philosophy')}</div>
      <div class="intro-visual reveal">${image('holder-detail.webp','','loading="lazy"')}</div>
    </section>
    <section class="section-feature">
      <div class="section-label-row reveal"><span class="micro">02 — OBJECT STUDY</span><span class="micro muted">FORM / FUNCTION / FEELING</span></div>
      <div class="feature-content">
       <div class="feature-image reveal">${image('holder-main.webp','','loading="lazy"')}</div>
       <div class="feature-info reveal"><div class="feature-meta"><span>001 / INCENSE HOLDER</span><span>BRUSHED STEEL</span></div><h2 class="section-title">Designed to<br/>disappear.</h2><p class="section-copy">A minimal form that gives the gesture its place. Steel, shadow, a single line of incense. No excess.</p><button type="button" class="button" data-product="holder"><span>Explore object — $55</span><span class="btn-arrow">↗</span></button></div>
      </div>
    </section>
    <section class="section-scent">
      <div class="scent-smoke" aria-hidden="true"></div>
      <div class="reveal"><div class="micro" style="color:#999">03 — SENSE THE SPACE</div><h2 class="section-title" style="margin-top:29px">Listen to<br/>what remains.</h2><p class="section-copy">Inspired by the Japanese way of fragrance, SAI invites a more attentive relationship with scent. Each note has a presence. Each moment, a different quality.</p>${button('Explore incense','collection',true)}</div>
      <div class="scent-side reveal">${image('incense-close.webp','','loading="lazy"')}</div>
    </section>
    <section class="section-preview">
      <div class="preview-top reveal"><div><div class="micro muted" style="margin-bottom:13px">04 — THE COLLECTION</div><h2 class="section-title">Selected objects.</h2></div>${button('View all','collection',true)}</div>
      <div class="preview-grid">
      ${[[products[0],'holder-main.webp'],[products[1],'scent-hinoki.webp'],[products[7],'matches.webp']].map(([p,im])=>`<article class="preview-card reveal" data-product="${p.id}" tabindex="0" role="button" aria-label="View ${p.title}">${image(im,'','loading="lazy"')}<div class="preview-name"><span>${p.title}</span><span>${fmt(p.price)}</span></div></article>`).join('')}
      </div>
    </section>`;
  const productCard = (p,i) => `<article class="product-card reveal ${p.id==='holder'&&activeFilter==='all'?'spotlight':''}" data-product="${p.id}" tabindex="0" role="button" aria-label="View ${p.title}">
    <div class="product-media"><span class="product-meta">${p.number} / SAI</span>
      ${p.image? image(p.image,p.id==='matches'?'':'',`loading="lazy"`):`<div class="journal-placeholder"><span class="plus">+</span><span class="label">ARTWORK TO BE ADDED</span></div>`}
      <div class="product-quick" aria-hidden="true">↗</div>
    </div><div class="product-text"><div><h2>${p.title}</h2><p>${p.label}</p></div><strong>${fmt(p.price)}</strong></div>
  </article>`;
  const collectionPage = () => {
    const visible=products.filter(p=>activeFilter==='all'||p.type===activeFilter);
    return `<section class="collection-page"><div class="page-intro"><div><div class="micro muted">THE INDEX / 001 — 009</div><h1>The collection.</h1></div><p>Incense and objects made to change the feeling of a space. Nothing more than necessary.</p></div>
    <div class="filters" aria-label="Filter collection">${[['all','All'],['incense','Incense'],['objects','Objects'],['editions','Editions']].map(([k,l])=>`<button class="filter ${activeFilter===k?'active':''}" type="button" data-filter="${k}" aria-pressed="${activeFilter===k}">${l}</button>`).join('')}<span class="filter-count">${String(visible.length).padStart(2,'0')} OBJECTS</span></div>
    <div class="product-grid">${visible.map(productCard).join('')}</div></section>`;
  };
  const philosophyPage = () => `<div class="philosophy"><section class="philosophy-intro"><div class="reveal"><div class="micro" style="color:#a5a5aa">SAI / PHILOSOPHY</div><h1>The art of<br/>listening.</h1></div><p class="reveal">Kōdō is the Japanese practice of appreciating fragrance. It asks us to pay attention — not simply to what an aroma smells like, but to how it occupies a moment.</p></section>
    <section class="portrait-panel"><div>${image('portrait.webp','','loading="lazy"')}</div><div class="portrait-text"><div class="micro">A FACE OF SAI / ISAO MORI</div><h2>A quiet influence.</h2><p>Isao Mori is the fictional face and an inspiration for SAI. Following the spirit of Kōdō, his presence invites us to rediscover what fragrance can bring to everyday life.</p></div></section>
    <section class="philosophy-outro reveal"><div class="micro" style="color:#999">A CONTEMPORARY INTERPRETATION</div><h2>Scent is an invisible element of space.</h2>${button('Explore the collection','collection',true)}</section></div>`;
  const bagPage = () => {
    const active=products.filter(p=>cart[p.id]>0&&p.price!==null);
    const subtotal=active.reduce((acc,p)=>acc+p.price*(cart[p.id]||0),0);
    const n=active.reduce((acc,p)=>acc+(cart[p.id]||0),0);
    return `<section class="bag-page"><div class="bag-top"><div><div class="micro muted">YOUR SELECTION / SAI</div><h1>Shopping bag.</h1></div><div class="micro">${String(n).padStart(2,'0')} OBJECTS</div></div>
      <div class="bag-grid"><div class="bag-items">${active.length?active.map(p=>`<div class="bag-row">${image(p.image,'',`alt="${p.title}"`)}<div><div class="name">${p.title}</div><div class="detail">${p.label}</div><div class="qty-control"><button type="button" aria-label="Remove one ${p.title}" data-qty="${p.id}" data-delta="-1">−</button><span>${String(cart[p.id]).padStart(2,'0')}</span><button type="button" aria-label="Add one ${p.title}" data-qty="${p.id}" data-delta="1">+</button></div></div><div class="row-price">${fmt(p.price*cart[p.id])}</div></div>`).join(''):`<div class="empty-bag"><h2>Nothing here. Yet.</h2><p>Your selection is waiting to begin.</p>${button('Discover the collection','collection')}</div>`}</div>
       <aside class="order-summary"><div class="micro" style="margin-bottom:28px">ORDER SUMMARY</div><div class="summary-line"><span>Items (${n})</span><span>${fmt(subtotal)}</span></div><div class="summary-line"><span>Shipping</span><span>—</span></div><div class="total"><span>Total</span><b>${fmt(subtotal)}</b></div><button class="button" type="button" data-demo-checkout ${n?'':'disabled'}><span>Continue</span><span class="btn-arrow">↗</span></button><p class="demo-note">VISUAL DEMO ONLY. NO PAYMENT OR ORDER IS PROCESSED.</p></aside></div></section>`;
  };
  function cartSave() {
    try{localStorage.setItem('sai_demo_cart',JSON.stringify(cart))}catch(_e){}
    const n=Object.values(cart).reduce((a,b)=>a+(Number(b)||0),0);
    countEl.textContent=`(${String(n).padStart(2,'0')})`;
  }
  function toastMessage(msg) { toast.textContent=msg;toast.classList.add('on');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.classList.remove('on'),2700); }
  function observeReveal() {
    if(observer)observer.disconnect();
    const all=$$('.reveal',view);
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){all.forEach(e=>e.classList.add('visible'));return}
    observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:0.07,rootMargin:'0px 0px -30px 0px'});
    all.forEach(e=>observer.observe(e));
  }
  function syncHeader() {
    const isDark=activeView==='philosophy';
    header.classList.toggle('dark',isDark && window.scrollY<630);
    $$('[data-route-nav]').forEach(e=>e.classList.toggle('active',e.dataset.routeNav===activeView));
  }
  function render() {
    view.classList.toggle('bg-dark',activeView==='philosophy');
    view.classList.toggle('bg-white',activeView==='bag');
    view.innerHTML=activeView==='collection'?collectionPage():activeView==='philosophy'?philosophyPage():activeView==='bag'?bagPage():heroPage();
    view.style.animation='none';void view.offsetWidth;view.style.animation='';
    syncHeader();observeReveal();cartSave();
  }
  function validView(v){return ['home','collection','philosophy','bag'].includes(v)?v:'home'}
  function navigate(next,{push=true,immediate=false}={}) {
    next=validView(next);if(transitionBusy)return;
    closeProduct();
    const nextURL=next==='home'?'/':`/?view=${next}`;
    if(next===activeView&&push){window.scrollTo({top:0,behavior:'smooth'});return}
    if(push)history.pushState({view:next},'',nextURL);
    if(immediate){activeView=next;window.scrollTo(0,0);render();return}
    transitionBusy=true;veil.classList.add('on');
    setTimeout(()=>{activeView=next;window.scrollTo({top:0,behavior:'instant'});render();setTimeout(()=>{veil.classList.remove('on');setTimeout(()=>{transitionBusy=false},450)},100)},400);
  }
  function productHTML(p) {
    return `<div class="overlay-backdrop" data-close-product="true"></div><section class="product-sheet" role="dialog" aria-modal="true" aria-label="${p.title}" tabindex="-1">
      <div class="sheet-top"><span class="micro">SAI / OBJECT ${p.number}</span><button class="round-dismiss" type="button" data-close-product="true" aria-label="Close">×</button></div>
      <div class="sheet-image">${p.image?image(p.image):`<div class="journal-placeholder"><span class="plus">+</span><span class="label">ARTWORK TO BE ADDED</span></div>`}</div>
      <div class="sheet-info"><div class="micro muted">${p.label}</div><h2>${p.title}.</h2><p class="description">${p.desc}</p><div class="sheet-spec"><span>${p.notes}</span><span>${fmt(p.price)}</span></div>
      ${p.price!==null?`<button type="button" class="button" data-add="${p.id}"><span>Add to bag — ${fmt(p.price)}</span><span class="btn-arrow">+</span></button>`:`<button class="button" disabled><span>Coming soon</span><span>—</span></button>`}
      </div></section>`;
  }
  function openProduct(id) {const p=products.find(x=>x.id===id);if(!p)return;overlay.innerHTML=productHTML(p);overlay.hidden=false;document.body.classList.add('locked');$('.product-sheet',overlay).focus()}
  function closeProduct() {overlay.hidden=true;overlay.innerHTML='';document.body.classList.remove('locked')}
  document.addEventListener('click',event=>{
    const viewTarget=event.target.closest('[data-view]');
    if(viewTarget){event.preventDefault();navigate(viewTarget.dataset.view);return}
    const filterTarget=event.target.closest('[data-filter]');
    if(filterTarget){activeFilter=filterTarget.dataset.filter;render();return}
    const productTarget=event.target.closest('[data-product]');
    if(productTarget){openProduct(productTarget.dataset.product);return}
    if(event.target.closest('[data-close-product]')){closeProduct();return}
    const addTarget=event.target.closest('[data-add]');
    if(addTarget){const id=addTarget.dataset.add;cart[id]=(cart[id]||0)+1;cartSave();closeProduct();toastMessage('Added to your bag.');return}
    const qtyTarget=event.target.closest('[data-qty]');
    if(qtyTarget){const id=qtyTarget.dataset.qty;cart[id]=Math.max(0,(cart[id]||0)+Number(qtyTarget.dataset.delta));if(!cart[id])delete cart[id];cartSave();render();return}
    if(event.target.closest('[data-demo-checkout]')){toastMessage('Visual preview only — checkout is not connected.');return}
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!overlay.hidden)closeProduct();
    if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-product]')){event.preventDefault();openProduct(event.target.dataset.product)}
  });
  window.addEventListener('popstate',()=>{const qs=new URLSearchParams(location.search);navigate(qs.get('view')||'home',{push:false})});
  window.addEventListener('scroll',syncHeader,{passive:true});
  activeView=validView(new URLSearchParams(location.search).get('view')||'home');
  render();
})();
