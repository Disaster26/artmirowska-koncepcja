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
    lbc.textContent=b.dataset.cap+(grp.length>1?'  ('+(ix+1)+' / '+grp.length+')':'')}
  function otworz(b){grp=[].slice.call(document.querySelectorAll('[data-lb="'+b.dataset.lb+'"]'));ix=grp.indexOf(b);last=b;pokaz();lb.classList.add('on');document.body.style.overflow='hidden';lb.querySelector('.x').focus();var m=grp.length>1;lb.querySelector('.p').hidden=!m;lb.querySelector('.n').hidden=!m}
  function zam(){lb.classList.remove('on');document.body.style.overflow='';clearTimeout(tm);lbi.removeAttribute('src');if(last)last.focus()}
  function kr(d){ix=(ix+d+grp.length)%grp.length;pokaz()}
  document.querySelectorAll('[data-lb]').forEach(function(b){b.addEventListener('click',function(){otworz(b)})});
  lb.querySelector('.x').addEventListener('click',zam);lb.querySelector('.p').addEventListener('click',function(){kr(-1)});lb.querySelector('.n').addEventListener('click',function(){kr(1)});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.tagName==='FIGURE')zam()});
  lb.addEventListener('touchstart',function(e){tx0=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(tx0===null)return;var d=e.changedTouches[0].clientX-tx0;if(Math.abs(d)>50&&grp.length>1)kr(d<0?1:-1);tx0=null});
  document.addEventListener('keydown',function(e){if(lb.classList.contains('on')){if(e.key==='Escape')zam();if(e.key==='ArrowRight')kr(1);if(e.key==='ArrowLeft')kr(-1)}else if(e.key==='Escape')zamknij()});
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
  function laduj(x){if(x&&x.dataset.src){x.srcset=x.dataset.srcset;x.src=x.dataset.src;x.removeAttribute('data-src')}}
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
  function kw_poz(){var x=im[i];if(!mq.matches){kw.style.top=kw.style.right='';return}
    var w=x.offsetWidth,h=x.offsetHeight;kw.style.top='10px';kw.style.right=((r.clientWidth-w)/2+10)+'px'}
  function wys(){if(!mq.matches){r.style.height='';kw_poz();return}
    var W=r.clientWidth,mx=0;im.forEach(function(x){var q=(+x.getAttribute('width'))/(+x.getAttribute('height'));if(q)mx=Math.max(mx,W/q)});
    var wolne=(pr.offsetHeight||innerHeight)-(hd?hd.offsetHeight:0)-(wz?wz.offsetHeight:0)-8-12-14;
    r.style.height=Math.round(Math.max(180,Math.min(mx,wolne)))+'px';kw_poz()}
  wys();addEventListener('resize',wys);addEventListener('load',wys);
  var zz=zaznacz;zaznacz=function(){zz();kw_poz()};
  function start(){clearInterval(t);if(ruch)t=setInterval(function(){idz((i+1)%im.length)},5500)}
  if(ruch)setTimeout(function(){laduj(im[1])},1500);
  document.addEventListener('visibilitychange',function(){if(document.hidden)clearInterval(t);else start()});
  start();
})();
