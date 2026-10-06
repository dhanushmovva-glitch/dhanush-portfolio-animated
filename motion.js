'use strict';
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const root=document.documentElement;
 const hero=document.querySelector('.hero');
 const timeline=document.querySelector('.timeline');
 const contact=document.getElementById('contact');
 const idCard=document.querySelector('.id-card');
 if(idCard)idCard.addEventListener('click',()=>{const flipped=idCard.classList.toggle('flipped');idCard.setAttribute('aria-pressed',String(flipped));idCard.setAttribute('aria-label',flipped?'Turn Dhanush Movva’s profile card to the front':'Flip Dhanush Movva’s profile card')});
 const clamp=v=>Math.max(0,Math.min(1,v));
 let pending=false;
 function updateScroll(){
  pending=false;
  const max=root.scrollHeight-innerHeight;
  root.style.setProperty('--scroll-progress',max>0?scrollY/max:0);
  if(reduced.matches)return;
  root.style.setProperty('--hero-scroll',clamp(scrollY/hero.offsetHeight));
  const tr=timeline.getBoundingClientRect();
  timeline.style.setProperty('--timeline-progress',clamp((innerHeight*.65-tr.top)/tr.height));
  const cr=contact.getBoundingClientRect();
  contact.style.setProperty('--contact-progress',clamp((innerHeight-cr.top)/innerHeight));
 }
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateScroll)}},{passive:true});
 addEventListener('resize',updateScroll,{passive:true});updateScroll();
 // Reveal the reference's headings and skill elements in a staggered sequence.
 if(!reduced.matches){
  const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');e.target.classList.remove('ready');observer.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll('.section h2,.id-card,.learning-grid,.timeline article,.achievement-card,.skill').forEach((el,i)=>{el.classList.add('reveal','ready');if(el.classList.contains('skill'))el.style.setProperty('--i',i%5);observer.observe(el)});
 }
 const panels=[...document.querySelectorAll('.reference-panels .project')];
 const activate=panel=>{panels.forEach(p=>p.classList.toggle('active',p===panel))};
 activate(panels[0]);
 panels.forEach((panel,i)=>{
  panel.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')activate(panel)});
  panel.addEventListener('focusin',()=>activate(panel));
  panel.addEventListener('click',()=>activate(panel));
  panel.addEventListener('keydown',e=>{if(e.target!==panel)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(panel)}if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();panels[(i+1)%panels.length].focus()}if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();panels[(i+panels.length-1)%panels.length].focus()}});
 });
 const learning=[...document.querySelectorAll('[data-learning]')];
 let learningIndex=0,paused=reduced.matches,learningHover=false;
 const setLearning=i=>{learningIndex=i;learning.forEach((b,j)=>b.classList.toggle('selected',i===j))};
 learning.forEach((b,i)=>{b.addEventListener('pointerenter',()=>setLearning(i));b.addEventListener('focus',()=>setLearning(i));b.addEventListener('click',()=>setLearning(i))});
 const list=document.querySelector('.learning-list');
 list.addEventListener('pointerenter',()=>learningHover=true);list.addEventListener('pointerleave',()=>learningHover=false);
 list.addEventListener('focusin',()=>learningHover=true);list.addEventListener('focusout',e=>{if(!list.contains(e.relatedTarget))learningHover=false});
 let learningVisible=false,achievementsVisible=false;
 const visibility=new IntersectionObserver(es=>es.forEach(e=>{if(e.target.id==='learning')learningVisible=e.isIntersecting;else achievementsVisible=e.isIntersecting}),{threshold:.15});visibility.observe(document.getElementById('learning'));visibility.observe(document.getElementById('achievements'));
 setInterval(()=>{if(!paused&&!reduced.matches&&learningVisible&&!learningHover&&!document.hidden)setLearning((learningIndex+1)%learning.length)},2600);
 const viewport=document.querySelector('.achievement-viewport');
 const pause=document.querySelector('.motion-toggle');
 let direction=1,hover=false,dragging=false,lastTime=0,frame=0,idleUntil=0,position=viewport.scrollLeft;
 function setPause(value){paused=value;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Play card motion':'Pause card motion'}
 setPause(reduced.matches);
 pause.addEventListener('click',()=>setPause(!paused));
 let draggingStart=0,scrollStart=0;
 viewport.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;dragging=true;draggingStart=e.clientX;scrollStart=viewport.scrollLeft;viewport.setPointerCapture(e.pointerId)});
 viewport.addEventListener('pointermove',e=>{if(dragging)viewport.scrollLeft=scrollStart+draggingStart-e.clientX});
 const endDrag=()=>{dragging=false;idleUntil=performance.now()+4000};
 viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);
 viewport.addEventListener('pointerenter',()=>hover=true);viewport.addEventListener('pointerleave',()=>{hover=false;endDrag()});
 viewport.addEventListener('focusin',()=>hover=true);viewport.addEventListener('focusout',()=>hover=false);
 viewport.addEventListener('touchstart',()=>idleUntil=performance.now()+6000,{passive:true});
 viewport.addEventListener('wheel',()=>idleUntil=performance.now()+4000,{passive:true});
 viewport.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();idleUntil=performance.now()+5000;viewport.scrollBy({left:e.key==='ArrowRight'?300:-300,behavior:reduced.matches?'instant':'smooth'})}});
 function animate(time){
  const delta=Math.min(40,time-lastTime||0);lastTime=time;
  if(achievementsVisible&&!paused&&!reduced.matches&&!hover&&!dragging&&!document.hidden&&time>idleUntil){
   const max=viewport.scrollWidth-viewport.clientWidth;
   if(max>0){let next=position+direction*delta*.045;if(next>=max){next=max;direction=-1;idleUntil=time+1300}else if(next<=0){next=0;direction=1;idleUntil=time+1300}position=next;viewport.scrollLeft=next}
  }else{position=viewport.scrollLeft}
  frame=requestAnimationFrame(animate);
 }
 frame=requestAnimationFrame(animate);
 reduced.addEventListener('change',()=>{setPause(reduced.matches);updateScroll();if(reduced.matches)document.querySelectorAll('.reveal.ready').forEach(e=>e.classList.remove('ready'))});
 const cursor=document.querySelector('.cursor-ring');
 if(matchMedia('(pointer:fine)').matches&&!reduced.matches){addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.style.opacity='1';cursor.classList.toggle('hovering',!!e.target.closest('a,button,.project'))},{passive:true});document.addEventListener('mouseleave',()=>cursor.style.opacity='0')}
 addEventListener('pagehide',()=>cancelAnimationFrame(frame));
})();
