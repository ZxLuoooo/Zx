// main.js — Core animations, interactions & logic

'use strict';

// ─── CONFIG ─────────────────────────────────────────────────
const CFG = {
  github: 'YOUR_GITHUB_USERNAME', // ← Change this!
  maxProjects: 6,
  loaderDuration: 2200,
};

// Cert data (update with your real info + credential URLs)
const CERTS = [
  { name:'Google IT Support Professional', issuer:'Google',            year:'2024', type:'Professional Certificate', desc:'Comprehensive IT support training covering networking, OS, troubleshooting, and security fundamentals.',  color:'#4285F4', credential:'' },
  { name:'Machine Learning Specialization', issuer:'Coursera / Stanford', year:'2024', type:'Specialization',         desc:'Deep dive into supervised, unsupervised learning and best practices in AI/ML system development.',             color:'#0056D2', credential:'' },
  { name:'Flutter Development Bootcamp',    issuer:'App Brewery / Udemy', year:'2023', type:'Bootcamp',               desc:'Full-stack Flutter development: UI, state management, Firebase, REST APIs, and production deployment.',       color:'#02569B', credential:'' },
  { name:'Arduino Fundamentals',            issuer:'Arduino Education',    year:'2023', type:'Technical Certificate',  desc:'Hardware programming, sensor integration, motor control, PWM, and end-to-end IoT project development.',       color:'#00878A', credential:'' },
  { name:'Python for AI & ML',              issuer:'Udemy',                year:'2023', type:'Course Certificate',     desc:'Python with NumPy, Pandas, Scikit-learn, TensorFlow and Keras for real-world machine learning projects.',    color:'#3776AB', credential:'' },
];

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initLoader();           // Loader triggers everything else on complete
  initCursor();
  initNavbar();
  initTypewriter();
  initCertModal();
  initContactForm();
  initMagnetic();

  // GitHub / Projects
  if (CFG.github && CFG.github !== 'YOUR_GITHUB_USERNAME') {
    initGitHub(CFG.github, CFG.maxProjects);
  } else {
    renderDemoProjects();
  }
});

// ─── SCROLL PROGRESS ─────────────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scroll-prog');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = (pct * 100) + '%';
  }, { passive: true });
}

// ─── LOADER ──────────────────────────────────────────────────
function initLoader() {
  const loader  = document.getElementById('loader');
  const barEl   = document.getElementById('loader-bar');
  const pctEl   = document.getElementById('loader-pct');
  const statEl  = document.getElementById('loader-status');
  if (!loader) { onLoaderDone(); return; }

  const msgs = ['Initializing engine...', 'Loading assets...', 'Compiling shaders...', 'Almost ready...'];
  let prog = 0, msgIdx = 0;

  const iv = setInterval(() => {
    prog = Math.min(prog + Math.random() * 12, 100);
    if (barEl) barEl.style.width = prog + '%';
    if (pctEl) pctEl.textContent = Math.round(prog) + '%';

    const newIdx = Math.min(Math.floor(prog / 26), msgs.length - 1);
    if (newIdx !== msgIdx && statEl) { msgIdx = newIdx; statEl.textContent = msgs[msgIdx]; }

    if (prog >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        if (window.gsap) {
          gsap.to(loader, { opacity:0, duration:0.7, ease:'power2.inOut', onComplete: () => {
            loader.style.display = 'none';
            onLoaderDone();
          }});
        } else {
          loader.style.display = 'none';
          onLoaderDone();
        }
      }, 450);
    }
  }, 70);
}

function onLoaderDone() {
  if (window.gsap) { gsap.registerPlugin(ScrollTrigger); }
  initHeroCanvas();
  initGSAP();
  initSkillBars();
}

// ─── CUSTOM CURSOR ───────────────────────────────────────────
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;

  let mx = -100, my = -100, rx = -100, ry = -100;
  let raf;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive:true });

  function tick() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(tick);
  }
  tick();

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  // Hover class toggle
  document.body.addEventListener('mouseover', e => {
    const t = e.target.closest('a,button,.cert-card,.project-card,.contact-link');
    if (t) { dot.classList.add('hovered'); ring.classList.add('hovered'); }
  });
  document.body.addEventListener('mouseout', e => {
    const t = e.target.closest('a,button,.cert-card,.project-card,.contact-link');
    if (t) { dot.classList.remove('hovered'); ring.classList.remove('hovered'); }
  });
}

// ─── THREE.JS HERO CANVAS ────────────────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  const scene    = new THREE.Scene();
  const W = canvas.offsetWidth  || window.innerWidth;
  const H = canvas.offsetHeight || window.innerHeight;
  const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
  camera.position.z = 38;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle geometry
  const COUNT = window.innerWidth < 768 ? 700 : 1400;
  const pos   = new Float32Array(COUNT * 3);
  const col   = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    pos[i3]     = (Math.random() - 0.5) * 110;
    pos[i3 + 1] = (Math.random() - 0.5) * 70;
    pos[i3 + 2] = (Math.random() - 0.5) * 50;
    // Cyan (#00D4FF) or Violet (#8B5CF6)
    if (Math.random() > 0.5) { col[i3]=0;    col[i3+1]=0.83; col[i3+2]=1; }
    else                      { col[i3]=0.55; col[i3+1]=0.36; col[i3+2]=0.96; }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.28, vertexColors:true,
    transparent:true, opacity:0.65,
    blending: THREE.AdditiveBlending, depthWrite:false
  });

  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  // Mouse parallax
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 0.06;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.04;
  }, { passive:true });

  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    t += 0.0008;
    curX += (targetX - curX) * 0.04;
    curY += (targetY - curY) * 0.04;
    pts.rotation.y = t + curX;
    pts.rotation.x = t * 0.4 + curY;
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// ─── GSAP ANIMATIONS ─────────────────────────────────────────
function initGSAP() {
  if (!window.gsap) return;

  // Hero entrance
  const tl = gsap.timeline({ defaults:{ ease:'power3.out' } });
  tl.to('.hero-tag',   { opacity:1, y:0, duration:0.6 })
    .to('.hero-title', { opacity:1, y:0, duration:0.7 }, '-=0.35')
    .to('.hero-roles', { opacity:1, y:0, duration:0.6 }, '-=0.4')
    .to('.hero-desc',  { opacity:1, y:0, duration:0.6 }, '-=0.35')
    .to('.hero-cta',   { opacity:1, y:0, duration:0.55 }, '-=0.35')
    .to('.hero-stats', { opacity:1, y:0, duration:0.55 }, '-=0.3')
    .to('.hero-scroll-ind', { opacity:1, duration:0.4 }, '-=0.1');

  // Hero parallax
  gsap.to('.hero-content', {
    scrollTrigger: { trigger:'#hero', start:'top top', end:'bottom top', scrub:1.2 },
    y: 90, opacity:0.4
  });

  // Section headers
  gsap.utils.toArray('.sec-header').forEach(el => {
    gsap.from(el.children, {
      scrollTrigger:{ trigger:el, start:'top 87%', once:true },
      opacity:0, y:28, stagger:0.15, duration:0.7, ease:'power3.out'
    });
  });

  // Staggered card reveals
  ['.skill-cat', '.cert-card', '.lang-card', '.tl-item', '.contact-link'].forEach(sel => {
    gsap.utils.toArray(sel).forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger:{ trigger:el, start:'top 90%', once:true },
        opacity:0, y:40, duration:0.7, delay: (i % 4) * 0.1, ease:'power3.out'
      });
    });
  });

  // Navbar shrink on scroll
  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: self => {
      document.getElementById('navbar')?.classList.toggle('scrolled', self.progress > 0);
    }
  });
}

// ─── SKILL BARS ──────────────────────────────────────────────
function initSkillBars() {
  const fills = document.querySelectorAll('.sk-fill');
  if (!fills.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target.style.getPropertyValue('--p') || '0%';
        e.target.style.width = target;
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  fills.forEach(f => io.observe(f));
}

// ─── TYPEWRITER / ROLES ──────────────────────────────────────
function initTypewriter() {
  const roles = document.querySelectorAll('.role');
  if (!roles.length) return;
  let cur = 0;
  roles[0].classList.add('active');
  setInterval(() => {
    roles[cur].classList.remove('active');
    cur = (cur + 1) % roles.length;
    roles[cur].classList.add('active');
  }, 2600);
}

// ─── NAVBAR ──────────────────────────────────────────────────
function initNavbar() {
  const hbg    = document.getElementById('hamburger');
  const links  = document.getElementById('nav-links');

  hbg?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    hbg.classList.toggle('active', open);
    hbg.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      hbg?.classList.remove('active');
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior:'smooth' });
      }
    });
  });

  // Active link tracking
  const sections = document.querySelectorAll('section[id]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${en.target.id}`);
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => io.observe(s));
}

// ─── CERTIFICATE MODAL ───────────────────────────────────────
function initCertModal() {
  const bg    = document.getElementById('cert-modal');
  const box   = document.getElementById('modal-box');
  const inner = document.getElementById('modal-inner');
  const close = document.getElementById('modal-close');
  if (!bg || !box || !inner) return;

  function openModal(idx) {
    const c = CERTS[idx];
    if (!c) return;
    inner.innerHTML = `
      <div class="modal-hdr" style="background:${c.color}12;border-bottom-color:${c.color}30">
        <div class="modal-cert-ico" style="color:${c.color}"><i class="fas fa-certificate"></i></div>
        <div class="modal-hdr-text">
          <h2>${c.name}</h2>
          <span style="color:${c.color}">${c.type}</span>
        </div>
      </div>
      <div class="modal-body">
        <div class="modal-infos">
          <div class="modal-info">
            <i class="fas fa-building"></i>
            <div><span class="modal-info-lbl">Issued by</span><span class="modal-info-val">${c.issuer}</span></div>
          </div>
          <div class="modal-info">
            <i class="fas fa-calendar-alt"></i>
            <div><span class="modal-info-lbl">Year</span><span class="modal-info-val">${c.year}</span></div>
          </div>
        </div>
        <p class="modal-desc">${c.desc}</p>
        ${c.credential
          ? `<a href="${c.credential}" target="_blank" rel="noopener" class="btn btn-primary">Verify Credential <i class="fas fa-external-link-alt"></i></a>`
          : `<p class="modal-cred-note">🔗 Add your credential URL in CERTS array (main.js)</p>`}
      </div>`;
    bg.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeModal() {
    bg.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  document.querySelectorAll('.cert-card').forEach(card => {
    const trigger = (e) => {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      openModal(parseInt(card.dataset.cert));
    };
    card.addEventListener('click', trigger);
    card.addEventListener('keydown', trigger);
  });

  close?.addEventListener('click', closeModal);
  bg.addEventListener('click', e => { if (e.target === bg) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// ─── CONTACT FORM ────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type=submit]');
    const name = form.querySelector('#f-name')?.value.trim();
    const mail = form.querySelector('#f-email')?.value.trim();
    const msg  = form.querySelector('#f-msg')?.value.trim();
    if (!name || !mail || !msg) {
      btn.textContent = window.LM?.get('contact.form.err') || 'Please fill all fields.';
      btn.style.borderColor = '#ff4d6d';
      setTimeout(() => { btn.textContent = window.LM?.get('contact.form.send') || 'Send Message'; btn.style.borderColor = ''; }, 2500);
      return;
    }
    const orig = btn.textContent;
    btn.textContent = window.LM?.get('contact.form.ok') || 'Message Sent!';
    btn.style.borderColor = '#00e676';
    btn.style.color       = '#00e676';
    setTimeout(() => {
      btn.textContent     = orig;
      btn.style.borderColor = '';
      btn.style.color       = '';
      form.reset();
    }, 3000);
  });
}

// ─── MAGNETIC BUTTONS ────────────────────────────────────────
function initMagnetic() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 550);
    });
  });
}
