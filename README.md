# 🚀 Portfolio — Software Engineer & AI Developer

Premium personal portfolio built with HTML5, CSS3, JavaScript, Three.js, and GSAP.

## ✨ Features
- 🎨 Dark premium design with neon cyan & violet accents
- ✨ Three.js particle canvas hero background
- 🔄 GSAP ScrollTrigger animations on all elements
- 🖱️ Custom cursor with magnetic button effects
- 🌐 Multi-language: **English · Bahasa Indonesia · 日本語**
- 🐙 Live GitHub API integration (repos, followers, stars)
- 📜 Certificate section with modal popup
- 📱 Fully responsive (desktop · tablet · mobile)
- ⚡ SEO-friendly & accessibility compliant

## 📁 Folder Structure
```
portfolio/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── translations.js   ← Language data + switcher
│   │   ├── github.js         ← GitHub API integration
│   │   └── main.js           ← All animations & logic
│   └── images/               ← Add your photo here
└── README.md
```

## ⚙️ Customization Checklist

### 1. Personal Info (`index.html`)
- [ ] Replace `Your Name` and `YN` logo initials
- [ ] Update hero description
- [ ] Update `Jakarta, Indonesia` location
- [ ] Update About section paragraphs
- [ ] Replace `your@email.com`
- [ ] Replace `YOUR_LINKEDIN`, `YOUR_INSTAGRAM`
- [ ] Add your photo in `assets/images/` and update `<img>` tag

### 2. GitHub Integration (`assets/js/main.js`)
```js
const CFG = {
  github: 'YOUR_ACTUAL_GITHUB_USERNAME', // ← Change this
  ...
};
```

### 3. Certificates (`assets/js/main.js`)
```js
const CERTS = [
  { name:'...', issuer:'...', year:'2024', type:'...', desc:'...', color:'#hex', credential:'https://...' },
  // Add more...
];
```

### 4. Experience & Skills (`index.html`)
- Update `.tl-card` sections with your real job history
- Adjust `.sk-fill` `--p` percentages to match your skill levels

### 5. Contact links (`index.html`)
- Replace all `YOUR_GITHUB_USERNAME`, `YOUR_LINKEDIN`, `YOUR_INSTAGRAM`
- Update `your@email.com`

---

## 🚀 Deployment

### GitHub Pages
```bash
# 1. Create repo named: YOUR_USERNAME.github.io
# 2. Push all files to main branch
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/USERNAME/USERNAME.github.io.git
git push -u origin main

# 3. Enable GitHub Pages in repo Settings > Pages > Deploy from main
# Live at: https://USERNAME.github.io
```

### Vercel (Recommended — fastest)
```bash
# Option A: Drag & drop the folder at vercel.com/new
# Option B: CLI
npm i -g vercel
cd portfolio
vercel --prod
```

### Netlify
```bash
# Option A: Drag & drop at app.netlify.com/drop
# Option B: CLI
npm i -g netlify-cli
netlify deploy --prod --dir .
```

---

## 🛠️ Local Development
```bash
# Python
python -m http.server 3000

# Node.js
npx serve .

# Then open http://localhost:3000
```

> **Note:** Must run on a local server (not file://) for GitHub API calls and fonts to load correctly.

---

## 📝 License
MIT — Free to use and modify for personal use.
