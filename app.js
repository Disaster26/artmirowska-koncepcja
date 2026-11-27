(function(){
function init(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function zamknij(){top.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu')}
  bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',zamknij)});
  var links=[].slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    ['start','o-mnie','malarstwo','wnetrza','kontakt'].forEach(function(id){var t=document.getElementById(id);if(t)io.observe(t)});
  }
  document.querySelectorAll('[data-tor]').forEach(function(tor){
    var down=false,sx=0,sl=0,moved=false;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||tor.scrollWidth<=tor.clientWidth+2)return;down=true;moved=false;sx=e.clientX;sl=tor.scrollLeft});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4&&!moved){moved=true;tor.classList.add('drag')}if(moved)tor.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;if(moved){var x=tor.scrollLeft;tor.classList.remove('drag');tor.scrollLeft=x}});
    tor.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
    var nav=document.querySelector('[data-nav="'+tor.id+'"]'),bs=nav?nav.querySelectorAll('button'):[];
    function upd(){if(!nav)return;var over=tor.scrollWidth>tor.clientWidth+2;nav.style.visibility=over?'visible':'hidden';if(bs.length){bs[0].disabled=tor.scrollLeft<4;bs[1].disabled=tor.scrollLeft+tor.clientWidth>=tor.scrollWidth-4}}
    [].forEach.call(bs,function(b){b.addEventListener('click',function(){tor.scrollBy({left:tor.clientWidth*.8*(+b.dataset.k),behavior:'smooth'})})});
    tor.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
    requestAnimationFrame(upd);addEventListener('resize',upd);
  });
  var lb=document.getElementById('lb'),lbi=lb.querySelector('img'),lbc=lb.querySelector('figcaption'),grp=[],ix=0,last=null,tx0=null,tm=0;
  function pokaz(){var b=grp[ix],sm=b.querySelector('img');clearTimeout(tm);lbi.src=(sm&&sm.currentSrc)||b.dataset.mid;lbi.alt=sm?sm.alt:'';
    var big=new Image();tm=setTimeout(function(){big.onload=function(){if(grp[ix]===b)lbi.src=big.src};big.src=b.dataset.src},120);
    lbc.textContent=b.dataset.cap+(grp.length>1?'  ('+(ix+1)+' / '+grp.length+')':'');
    var fg=b.closest('figure'),em=fg&&fg.querySelector('figcaption em'),g=fg&&fg.querySelector('a.gal');if(em){var st=document.createElement('span');st.className='lb-st'+(em.classList.contains('nie')?' nie':'');st.textContent=em.textContent;lbc.appendChild(document.createElement('br'));lbc.appendChild(st)}if(g){lbc.appendChild(document.createElement('br'));lbc.appendChild(g.cloneNode(true))}}
  function otworz(b){grp=[].slice.call(document.querySelectorAll('[data-lb="'+b.dataset.lb+'"]')).filter(function(x){return !x.closest('[hidden]')});ix=grp.indexOf(b);last=b;pokaz();lb.classList.add('on');document.body.style.overflow='hidden';lb.querySelector('.x').focus();var m=grp.length>1;lb.querySelector('.p').hidden=!m;lb.querySelector('.n').hidden=!m}
  function zam(){lb.classList.remove('on');document.body.style.overflow='';clearTimeout(tm);lbi.removeAttribute('src');if(last)last.focus()}
  function kr(d){ix=(ix+d+grp.length)%grp.length;pokaz()}
  document.querySelectorAll('[data-lb]').forEach(function(b){b.addEventListener('click',function(){otworz(b)})});
  lb.querySelector('.x').addEventListener('click',zam);lb.querySelector('.p').addEventListener('click',function(){kr(-1)});lb.querySelector('.n').addEventListener('click',function(){kr(1)});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.tagName==='FIGURE')zam()});
  lb.addEventListener('touchstart',function(e){tx0=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(tx0===null)return;var d=e.changedTouches[0].clientX-tx0;if(Math.abs(d)>50&&grp.length>1)kr(d<0?1:-1);tx0=null});
  document.addEventListener('keydown',function(e){if(lb.classList.contains('on')){if(e.key==='Escape')zam();if(e.key==='ArrowRight')kr(1);if(e.key==='ArrowLeft')kr(-1)}else if(e.key==='Escape')zamknij()});
  /* filtr galerii obrazow */
  document.querySelectorAll('.flt').forEach(function(fl){var bs=fl.querySelectorAll('button'),fig=fl.parentNode.querySelectorAll('.siatka .ob[data-st]');
    [].forEach.call(bs,function(b){b.addEventListener('click',function(){var k=b.dataset.f;[].forEach.call(bs,function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
      [].forEach.call(fig,function(x){x.hidden=!!k&&x.dataset.st!==k});dispatchEvent(new Event('scroll'))})})});
  var f=document.getElementById('form'),msg=document.getElementById('msg');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();var ok=true;[].forEach.call(f.querySelectorAll('[required]'),function(i){var v=i.type==='checkbox'?(i.checked?'1':''):i.value.trim();var bad=!v;i.setAttribute('aria-invalid',bad);if(bad&&ok){ok=false;i.focus()}});if(!ok)return;msg.hidden=false;f.reset();msg.scrollIntoView({block:'nearest',behavior:'smooth'})});
  var lz=[].slice.call(document.querySelectorAll('img[data-src]'));
  function wczytaj(i){if(!i.dataset.src)return;i.srcset=i.dataset.srcset;i.src=i.dataset.src;i.removeAttribute('data-src')}
  if('IntersectionObserver' in window){
    function obs(root,mar,els){var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){wczytaj(e.target);o.unobserve(e.target)}})},{root:root,rootMargin:mar});els.forEach(function(i){o.observe(i)})}
    obs(null,'400px 0px',lz.filter(function(i){return !i.closest('.pas')}));
    var po=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){po.unobserve(e.target);obs(e.target,'0px 900px',[].slice.call(e.target.querySelectorAll('img[data-src]')))}})},{rootMargin:'500px 0px'});
    document.querySelectorAll('.pas').forEach(function(p){po.observe(p)});
  }else lz.forEach(wczytaj);
  var r=document.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
(function(){
  var r=document.getElementById('pokaz');if(!r)return;
  var im=[].slice.call(r.querySelectorAll('img')),i=0,t=0,cel=-1,ruch=!matchMedia('(prefers-reduced-motion:reduce)').matches;
  function laduj(x){if(x&&x.dataset.src){x.loading='eager';x.srcset=x.dataset.srcset;x.src=x.dataset.src;x.removeAttribute('data-src')}}
  if(im.length<2)return;
  /* kwadraciki: ktory obraz jest widoczny, klik = przejscie */
  var kw=document.createElement('div');kw.className='kw';kw.setAttribute('role','group');kw.setAttribute('aria-label','Wybór obrazu');
  var bt=im.map(function(x,n){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Obraz '+(n+1)+' z '+im.length);
    b.addEventListener('click',function(){idz(n);start()});kw.appendChild(b);return b});
  r.appendChild(kw);
  function zaznacz(){bt.forEach(function(b,n){b.classList.toggle('on',n===i);b.setAttribute('aria-current',n===i?'true':'false')})}
  function idz(n){if(n===i)return;var nx=im[n];cel=n;laduj(nx);laduj(im[(n+1)%im.length]);
    function pokaz(){if(cel!==n)return;im[i].classList.remove('on');nx.classList.add('on');i=n;zaznacz()}
    if(nx.complete&&nx.naturalWidth)pokaz();else nx.addEventListener('load',pokaz,{once:true})}
  zaznacz();
  /* telefon: wysokosc ramy = najwyzszy obraz na pelna szerokosc, ale nie wiecej niz wolne miejsce nad wizytowka */
  var mq=matchMedia('(max-width:760px)'),wz=document.querySelector('.wiz'),hd=document.querySelector('.top'),pr=document.createElement('div');
  pr.style.cssText='position:absolute;visibility:hidden;height:100svh;width:0;top:0';document.body.appendChild(pr);
  function kw_poz(){var x=im[i];if(!x.offsetWidth){kw.style.top=kw.style.right='';return}
    kw.style.top=(x.offsetTop+14)+'px';kw.style.right=(r.clientWidth-x.offsetLeft-x.offsetWidth+14)+'px'}
  /* telefon: rama na cale wolne miejsce nad wizytowka; obrazy poziome cover z kadrem max ok. 18% szerokosci, pionowe w calosci */
  var KROP=0.82;
  function q_(x){return (+x.getAttribute('width'))/(+x.getAttribute('height'))||1.4}
  function kr_(x){return +x.dataset.krop||KROP}
  var sloty=wz?[[wz,'paddingTop'],[wz,'paddingBottom'],[wz.querySelector('.lead'),'marginTop'],[wz.querySelector('.haslo'),'marginTop'],[wz.querySelector('.haslo'),'marginBottom']].filter(function(z){return z[0]}):[];
  function wys(){
    im.forEach(function(x){x.style.width=x.style.height=x.style.maxHeight=x.style.objectFit=x.style.objectPosition=''});
    sloty.forEach(function(z){z[0].style[z[1]]=''});
    if(!mq.matches){r.style.height='';kw_poz();return}
    var W=r.clientWidth,caps=[];
    var wolne=(pr.offsetHeight||innerHeight)-(hd?hd.offsetHeight:0)-(wz?wz.offsetHeight:0)-8-12-24;
    im.forEach(function(x){var q=q_(x);if(q>1)caps.push(W/(kr_(x)*q))});
    caps.sort(function(a,b){return a-b});
    /* wysokosc ramy = typowy (mediana) obraz poziomy z kadrem do ok. 18%, nie wiecej niz wolne miejsce */
    var H=Math.round(Math.max(180,Math.min(wolne,caps.length?caps[caps.length>>1]:W/1.4)));
    r.style.height=H+'px';
    /* nadmiar miejsca (wysokie telefony) rozlozony rowno w wizytowce, zeby konczyla sie tuz nad dolem ekranu */
    var L=wolne-H,ok=sloty.filter(function(z){return z[0].offsetParent!==null});
    if(L>4&&ok.length){var e=Math.min(36,L/ok.length);ok.forEach(function(z){z[0].style[z[1]]=Math.round(parseFloat(getComputedStyle(z[0])[z[1]])+e)+'px'})}
    im.forEach(function(x){var q=q_(x);if(q<=1||H<=W/q)return;
      x.style.width='100%';x.style.height=Math.round(Math.min(H,W/(kr_(x)*q)))+'px';x.style.maxHeight='none';x.style.objectFit='cover';x.style.objectPosition=x.dataset.pos||'50% 50%'});
    kw_poz()}
  wys();addEventListener('resize',wys);addEventListener('load',wys);im.forEach(function(x){x.addEventListener('load',kw_poz)});
  /* przesuwanie palcem / mysza: poziomo zmiana obrazu, pionowo zwykle przewijanie strony */
  var sx=null,sy=0,poz=false;
  r.addEventListener('dragstart',function(e){e.preventDefault()});
  r.addEventListener('pointerdown',function(e){if(e.target.closest('.kw')||(e.pointerType==='mouse'&&e.button!==0))return;sx=e.clientX;sy=e.clientY;poz=false});
  r.addEventListener('pointermove',function(e){if(sx===null)return;var dx=e.clientX-sx,dy=e.clientY-sy;
    if(!poz&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){poz=true;r.classList.add('ciag');clearInterval(t)}
    if(poz)im[i].style.transform='translateX('+Math.round(dx*.35)+'px)'});
  function puszczony(e,anul){if(sx===null)return;var dx=e.clientX-sx;r.classList.remove('ciag');im[i].style.transform='';sx=null;
    if(poz&&!anul&&Math.abs(dx)>40){r.classList.add('szybko');setTimeout(function(){r.classList.remove('szybko')},900);idz((i+(dx<0?1:-1)+im.length)%im.length)}
    if(poz)start();poz=false}
  r.addEventListener('pointerup',function(e){puszczony(e,false)});
  r.addEventListener('pointercancel',function(e){puszczony(e,true)});
  r.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse')puszczony(e,false)});
  var zz=zaznacz;zaznacz=function(){zz();kw_poz()};
  /* pokaz zmienia obrazy sam takze na telefonie; przy ograniczonym ruchu wolniej i samym przenikaniem (bez przesuwania) */
  function start(){clearInterval(t);t=setInterval(function(){if(!document.hidden)idz((i+1)%im.length)},ruch?5500:8000)}
  setTimeout(function(){laduj(im[1])},1200);
  document.addEventListener('visibilitychange',function(){if(document.hidden)clearInterval(t);else start()});
  start();
})();
