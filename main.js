// This file handles interactive behavior for the site.

// Router: keep Projects on its own page, default to About
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-link]');
// Activates the selected page
function setActive(hash){
  const target = (hash||'#about').replace('#','');
  pages.forEach(p=>p.classList.toggle('active', p.id===target));
  navLinks.forEach(a=>a.setAttribute('aria-current', a.getAttribute('href')===`#${target}` ? 'page' : 'false'));
  window.scrollTo({top:0, behavior:'smooth'});
}
window.addEventListener('hashchange',()=>setActive(location.hash));
setActive(location.hash);

// Scroll reveal animations
// Observes elements and reveals them when they enter the viewport
const io = new IntersectionObserver((entries)=>{
  for(const e of entries){ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} }
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Subtle tilt + moving highlight for cards (no jank)
// Adds interactive tilt and highlight effect based on pointer position
document.querySelectorAll('[data-tilt]').forEach(card=>{
  card.addEventListener('pointermove', (e)=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;   // 0..1
    const y = (e.clientY - r.top) / r.height;   // 0..1
    // --mx and --my control the position of the highlight on the card
    card.style.setProperty('--mx', `${(x*100).toFixed(2)}%`);
    card.style.setProperty('--my', `${(y*0).toFixed(2)}%`); // keep highlight near top
    const rx = ((0.5 - y) * 2).toFixed(2);
    const ry = ((x - 0.5) * 3).toFixed(2);
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('pointerleave', ()=>{ card.style.transform=''; });
});

// Button ripple hotspot
// Updates ripple hotspot position on buttons based on pointer movement
document.querySelectorAll('.btn').forEach(b=>{
  b.addEventListener('pointermove',(e)=>{
    const r = b.getBoundingClientRect();
    b.style.setProperty('--px', ((e.clientX - r.left)/r.width*100)+'%');
  },{passive:true});
});

// Footer year
// Sets the current year in the footer
document.getElementById('y').textContent=new Date().getFullYear();

// Dynamic header: hide on scroll down, show on scroll up
(function(){
  const headerEl = document.querySelector('header');
  let lastY = window.scrollY || 0;
  let ticking = false;
  headerEl.classList.add('is-visible');

  // Updates header visibility based on scroll direction
  function update(){
    const y = window.scrollY || 0;
    const delta = 6; // small threshold to avoid flicker when scrolling slightly
    if (y > lastY + delta && y > 80){
      // scrolling down - hide header
      headerEl.classList.add('is-hidden');
      headerEl.classList.remove('is-visible');
    } else if (y < lastY - delta){
      // scrolling up - show header
      headerEl.classList.remove('is-hidden');
      headerEl.classList.add('is-visible');
    }
    lastY = y;
    ticking = false;
  }

  // Listen to scroll events and throttle updates using requestAnimationFrame for better performance
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }, {passive:true});

  // Ensure header shows when navigating between hash pages
  window.addEventListener('hashchange', function(){
    headerEl.classList.remove('is-hidden');
    headerEl.classList.add('is-visible');
  });
})();