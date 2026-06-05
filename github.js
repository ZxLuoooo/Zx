// github.js — GitHub API Integration

const LANG_COLORS = {
  JavaScript:'#f1e05a', TypeScript:'#2b7489', Python:'#3572A5',
  Dart:'#00B4AB', Java:'#b07219', 'C++':'#f34b7d', 'C#':'#239120',
  C:'#555555', HTML:'#e34c26', CSS:'#563d7c', Shell:'#89e051',
  Arduino:'#00979D', Rust:'#dea584', Go:'#00ADD8', Swift:'#ffac45',
  Kotlin:'#F18E33', Ruby:'#701516', PHP:'#4F5D95',
  _default:'#8b949e'
};

async function initGitHub(username, max = 6) {
  try {
    const [uRes, rRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`)
    ]);
    if (!uRes.ok) throw new Error('User not found');
    const [user, repos] = await Promise.all([uRes.json(), rRes.json()]);

    // Update stats
    _set('stat-repos',    user.public_repos);
    _set('stat-followers', user.followers);
    _set('gh-user',       user.login);
    _set('gh-repos',      `${user.public_repos} repos`);
    _set('gh-followers',  `${user.followers} followers`);

    const stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
    _set('gh-stars', `${stars} stars`);

    // Fix GitHub links
    document.querySelectorAll('a[href*="YOUR_GITHUB_USERNAME"]').forEach(a => {
      a.href = a.href.replace(/YOUR_GITHUB_USERNAME/g, username);
    });

    const top = repos
      .filter(r => !r.fork && r.name.toLowerCase() !== username.toLowerCase())
      .sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, max);

    renderProjects(top);
  } catch (e) {
    console.warn('[GitHub]', e.message);
    renderDemoProjects();
  }
}

function renderProjects(repos) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';

  repos.forEach((repo, i) => {
    const lang  = repo.language || 'Code';
    const color = LANG_COLORS[lang] || LANG_COLORS._default;
    const desc  = repo.description || (window.LM ? window.LM.get('projects.noDesc') : 'No description available.');

    const card = document.createElement('article');
    card.className = 'project-card glass-card';
    card.setAttribute('role', 'listitem');
    card.style.animationDelay = `${i * 0.08}s`;

    const topics = (repo.topics || []).slice(0, 3);
    const topicsHtml = topics.length
      ? `<div class="proj-topics">${topics.map(t => `<span class="topic-tag">${t}</span>`).join('')}</div>`
      : '';
    const demoHtml = repo.homepage
      ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="project-link demo-link"><i class="fas fa-external-link-alt"></i> Demo</a>`
      : '';

    card.innerHTML = `
      <div class="proj-header">
        <span class="proj-lang-dot" style="background:${color};box-shadow:0 0 8px ${color}40"></span>
        <div class="proj-meta">
          <span class="proj-lang">${lang}</span>
          <div class="proj-stats">
            <span><i class="fas fa-star"></i>${repo.stargazers_count}</span>
            <span><i class="fas fa-code-branch"></i>${repo.forks_count}</span>
          </div>
        </div>
      </div>
      <h3 class="proj-name">${repo.name.replace(/-/g,' ')}</h3>
      <p class="proj-desc">${desc.length > 100 ? desc.slice(0,100)+'…' : desc}</p>
      ${topicsHtml}
      <div class="proj-footer">
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-link">
          <i class="fab fa-github"></i> Code
        </a>
        ${demoHtml}
      </div>
      <div class="proj-glow" style="background:${color}"></div>
    `;

    // 3-D tilt effect
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 18;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -18;
      card.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });

    grid.appendChild(card);

    // GSAP reveal if available
    if (window.gsap && window.ScrollTrigger) {
      gsap.from(card, {
        scrollTrigger:{ trigger:card, start:'top 92%', once:true },
        opacity:0, y:36, duration:0.65, delay:i*0.08, ease:'power3.out'
      });
    }
  });
}

function renderDemoProjects() {
  _set('stat-repos',    '20+');
  _set('stat-followers','150+');
  _set('gh-repos',      '20+ repos');
  _set('gh-followers',  '150+ followers');
  _set('gh-stars',      '200+ stars');

  const DEMO = [
    { name:'flutter-ai-app',      description:'Cross-platform mobile app with integrated AI using TensorFlow Lite and Flutter.',            language:'Dart',       stargazers_count:42, forks_count:8,  html_url:'#', homepage:null,  topics:['flutter','ai','mobile'] },
    { name:'smart-robot',         description:'Autonomous robot control with Arduino and ESP32, supporting WiFi remote operation.',          language:'C++',        stargazers_count:28, forks_count:5,  html_url:'#', homepage:null,  topics:['arduino','esp32','robotics'] },
    { name:'ml-image-classifier', description:'Real-time deep learning image classifier using Python, TensorFlow, and OpenCV.',             language:'Python',     stargazers_count:35, forks_count:12, html_url:'#', homepage:'#',  topics:['python','ml','tensorflow'] },
    { name:'3d-model-generator',  description:'Procedural 3D model generation script for rapid prototyping and 3D printing workflows.',     language:'Python',     stargazers_count:19, forks_count:4,  html_url:'#', homepage:null,  topics:['blender','3d','python'] },
    { name:'iot-dashboard',       description:'Real-time IoT sensor monitoring dashboard powered by ESP32 with live data visualization.',   language:'JavaScript', stargazers_count:31, forks_count:7,  html_url:'#', homepage:'#',  topics:['iot','esp32','dashboard'] },
    { name:'portfolio-website',   description:'This portfolio site. Built with HTML, CSS, Three.js, GSAP, and multi-language support.',     language:'JavaScript', stargazers_count:15, forks_count:3,  html_url:'#', homepage:'#',  topics:['portfolio','threejs','gsap'] }
  ];
  renderProjects(DEMO);
}

function _set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
