// Zero-dependency static site generator for MAROOF MARKETING AGENCY.
// Run: node build.mjs  ->  outputs ./dist  (publish directory for Render)
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';

const SITE = 'https://maroof360.onrender.com';
const WA_NUM = '923190482228';
const WA_DISPLAY = '+92 319 0482228';
const WA = `https://wa.me/${WA_NUM}`;
const LOGO = '/assets/img/logo-mma.png'; // <- replace this single file to update the logo everywhere

const I = {
  meta:'<path d="M3 12c0-3 2-6 4.5-6S11 10 12 12s2.5 6 4.5 6S21 15 21 12s-2-6-4.5-6S13 10 12 12s-2.5 6-4.5 6S3 15 3 12z"/>',
  google:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M8 11h6M11 8v6"/>',
  social:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  brand:'<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
  web:'<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 21h8M12 18v3"/>',
  write:'<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  strategy:'<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
  creative:'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-.7-1.5-.7-2.5S14.2 15 15.5 15H18a3 3 0 0 0 3-3c0-5-4-9-9-9z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  consist:'<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
  biz:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  wa:'<path d="M20.5 3.5A11 11 0 0 0 3.2 17.1L2 22l5-1.3A11 11 0 0 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-3 .8.8-2.9-.2-.3A9 9 0 1 1 12 20.5zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.6.1a7.400 7.400 0 0 1-3.700-3.200c-.3-.5.3-.5.8-1.500.1-.2 0-.3 0-.5l-.9-2.100c-.2-.5-.5-.5-.7-.5h-.6a1.200 1.200 0 0 0-.9.4 3.600 3.600 0 0 0-1.100 2.700 6.200 6.200 0 0 0 1.300 3.300 14 14 0 0 0 5.400 4.800c2 .8 2.800.9 3.800.7a3.200 3.200 0 0 0 2.100-1.500 2.600 2.600 0 0 0 .2-1.500c-.1-.1-.3-.2-.6-.3z" fill="currentColor" stroke="none"/>',
};
const icon = (k, cls='') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[k]}</svg>`;

const SERVICES = [
  { id:'meta-ads', icon:'meta', name:'Facebook & Meta Ads Management', form:'Facebook & Meta Ads',
    short:'Structured campaign planning, audience targeting and creative direction for Facebook and Instagram advertising.',
    long:'We plan, set up and manage Meta advertising so your budget is directed by a clear strategy, with regular monitoring and practical optimization recommendations.',
    items:['Campaign planning','Audience research & targeting','Ad creative planning','Campaign setup','Performance monitoring','Optimization recommendations'] },
  { id:'google-ads', icon:'google', name:'Google Ads Management', form:'Google Ads',
    short:'Search campaign planning, keyword research and ad copy to reach people who are actively looking for you.',
    long:'From keyword research to ad copy and campaign setup, we manage Google Ads with a focus on relevance, clarity and steady improvement.',
    items:['Search campaign planning','Keyword research','Ad copy preparation','Campaign setup & management','Conversion tracking recommendations','Performance review & optimization'] },
  { id:'social-media', icon:'social', name:'Social Media Management', form:'Social Media Management',
    short:'Content planning, posting schedules and consistent brand presentation across your social presence.',
    long:'We help you show up consistently with planned content, clear captions and a cohesive look. Scope and platforms are agreed with you before work begins.',
    items:['Content planning','Posting schedules','Brand consistency','Creative content coordination','Caption preparation','Audience engagement support'] },
  { id:'branding', icon:'brand', name:'Logo Design & Brand Identity', form:'Logo Design & Brand Identity',
    short:'Logo concepts, colors and typography that give your business a distinctive, consistent identity.',
    long:'We develop logo concepts and a visual identity system so your business looks coherent and recognizable wherever customers meet it.',
    items:['Logo concepts','Brand color selection','Typography direction','Visual identity development','Brand asset preparation','Consistent visual presentation'] },
  { id:'web', icon:'web', name:'Web Design & Development', form:'Web Design & Development',
    short:'Responsive business websites and landing pages designed to make enquiries easy.',
    long:'We design and build clean, responsive websites with clear inquiry paths and sensible on-page SEO foundations. Features are confirmed with you during planning.',
    items:['Business website design','Responsive layouts','Landing pages','Frontend development','Contact & inquiry flows','Basic on-page SEO considerations'] },
  { id:'content', icon:'write', name:'Content Writing', form:'Content Writing',
    short:'Clear website copy, service descriptions and marketing content that sounds like your brand.',
    long:'We write and refine the words your business uses to explain itself, from website pages to social captions, keeping the message clear and consistent.',
    items:['Website copywriting','Service descriptions','Marketing content','Social media captions','Brand messaging','Content refinement'] },
];

const NAV = [['/', 'Home'], ['/services', 'Services'], ['/portfolio', 'Portfolio'], ['/about', 'About'], ['/contact', 'Contact']];

const header = (path) => `
<a class="skip" href="#main">Skip to content</a>
<header class="site-header" id="top">
  <div class="container nav">
    <a class="brand" href="/" aria-label="Maroof Marketing Agency, home"><img class="brand-logo" src="${LOGO}" alt="Maroof Marketing Agency logo" width="132" height="43"></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="nav-panel" aria-label="Open menu"><span></span></button>
    <div class="nav-panel" id="nav-panel">
      <nav aria-label="Primary"><ul class="nav-links">
        ${NAV.map(([h, l]) => `<li><a href="${h}"${h === path ? ' aria-current="page"' : ''}>${l}</a></li>`).join('')}
      </ul></nav>
      <a class="btn btn-primary nav-cta" href="/contact">Let's Talk ${icon('arrow', 'arrow')}</a>
      <a class="btn btn-primary nav-cta-m" href="/contact">Let's Talk ${icon('arrow', 'arrow')}</a>
    </div>
  </div>
</header>`;

const footer = () => `
<footer class="site-footer">
  <div class="container foot-grid">
    <div>
      <a class="brand" href="/" aria-label="Maroof Marketing Agency, home"><img class="brand-logo" src="${LOGO}" alt="Maroof Marketing Agency logo" width="132" height="43" loading="lazy"></a>
      <p style="margin-top:1rem;max-width:34ch">Digital marketing, creative design and web development for businesses ready to grow their online presence.</p>
    </div>
    <div><h4>Navigate</h4><ul>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></div>
    <div><h4>Services</h4><ul>${SERVICES.map(s => `<li><a href="/services#${s.id}">${s.name}</a></li>`).join('')}</ul></div>
    <div><h4>Contact</h4><ul>
      <li><a href="${WA}" target="_blank" rel="noopener">WhatsApp: ${WA_DISPLAY}</a></li>
      <li><a href="/contact">Send an inquiry</a></li>
      <li>Pakistan</li></ul></div>
  </div>
  <div class="container foot-bottom"><span>&copy; <span data-year>2026</span> Maroof Marketing Agency. All rights reserved.</span><span>Founder: Saad Rasheed</span></div>
</footer>
<a class="fab" href="${WA}" target="_blank" rel="noopener" aria-label="Chat with Maroof Marketing Agency on WhatsApp">${icon('wa')}</a>`;

const page = ({ path, title, desc, body, dark = true, extraHead = '' }) => `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#07152E">
<link rel="canonical" href="${SITE}${path === '/' ? '/' : path}">
<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" type="image/png" href="/assets/img/favicon.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<meta property="og:type" content="website"><meta property="og:site_name" content="Maroof Marketing Agency">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}${path}"><meta property="og:image" content="${SITE}/assets/img/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/styles.css">
<script>document.documentElement.classList.remove('no-js')</script>
${extraHead}
</head>
<body>
${header(path)}
<main id="main">${body}</main>
${footer()}
<script src="/assets/js/main.js" defer></script>
</body></html>`;

const svcIcon = (s) => icon(s.icon);
const ctaBand = (h = "Let's Build Something That Moves Your Business Forward.", p = 'Tell us about your business and what you want to achieve. We will come back to you with a clear, honest next step.') => `
<section class="section dark cta-band"><div class="container cta-inner">
  <div class="reveal"><span class="eyebrow">Start a conversation</span><h2>${h}</h2><p>${p}</p></div>
  <div class="btn-row reveal" data-d="2"><a class="btn btn-primary" href="/contact">Start a Project ${icon('arrow', 'arrow')}</a><a class="btn btn-whatsapp" href="${WA}" target="_blank" rel="noopener">${icon('wa')} WhatsApp Us</a></div>
</div></section>`;

// ---------- HOME ----------
const concept = (n) => ({
  1: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Abstract brand identity concept artwork"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0B2A5E"/><stop offset="1" stop-color="#147DFF"/></linearGradient></defs><rect width="400" height="300" fill="url(#g1)"/><circle cx="270" cy="110" r="70" fill="#38BDF8" opacity=".25"/><path d="M110 200l50-90 40 60 40-100 50 130z" fill="none" stroke="#fff" stroke-width="10" stroke-linejoin="round" opacity=".9"/><circle cx="110" cy="200" r="8" fill="#38BDF8"/></svg>`,
  2: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Abstract website layout concept artwork"><rect width="400" height="300" fill="#0B1020"/><rect x="50" y="50" width="300" height="200" rx="14" fill="#0F2347" stroke="#38BDF8" stroke-opacity=".5"/><rect x="50" y="50" width="300" height="26" rx="14" fill="#16346A"/><rect x="72" y="100" width="130" height="14" rx="7" fill="#fff"/><rect x="72" y="124" width="90" height="8" rx="4" fill="#64748B"/><rect x="72" y="156" width="70" height="26" rx="13" fill="#147DFF"/><rect x="230" y="96" width="94" height="110" rx="10" fill="#147DFF" opacity=".35"/><circle cx="277" cy="150" r="26" fill="#38BDF8" opacity=".7"/></svg>`,
  3: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Abstract social media post concept artwork"><rect width="400" height="300" fill="#07152E"/><rect x="60" y="40" width="130" height="130" rx="18" fill="#147DFF"/><rect x="210" y="70" width="130" height="130" rx="18" fill="#38BDF8" opacity=".85"/><rect x="110" y="150" width="130" height="110" rx="18" fill="#fff" opacity=".92"/><circle cx="125" cy="75" r="22" fill="#fff" opacity=".9"/></svg>`,
  4: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Abstract advertising creative concept artwork"><defs><linearGradient id="g4" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#07152E"/><stop offset="1" stop-color="#147DFF"/></linearGradient></defs><rect width="400" height="300" fill="url(#g4)"/><g fill="#38BDF8"><rect x="80" y="170" width="38" height="70" rx="6"/><rect x="132" y="140" width="38" height="100" rx="6"/><rect x="184" y="108" width="38" height="132" rx="6"/><rect x="236" y="72" width="38" height="168" rx="6"/></g><path d="M70 150L170 110l60-30 90-30" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`,
});
const PROJECTS = [
  { c:'branding', cat:'Branding', t:'Fintech Identity System', d:'Logo, color and type direction.', a:1 },
  { c:'web', cat:'Web Design', t:'Service Business Website', d:'Responsive homepage layout.', a:2 },
  { c:'social', cat:'Social Media', t:'Launch Campaign Posts', d:'Post series and caption style.', a:3 },
  { c:'ads', cat:'Advertising Creatives', t:'Lead Generation Ad Set', d:'Meta ad creative concepts.', a:4 },
  { c:'branding', cat:'Branding', t:'Boutique Brand Palette', d:'Visual identity exploration.', a:1 },
  { c:'web', cat:'Web Design', t:'Landing Page Concept', d:'Single-offer conversion page.', a:2 },
];
const workCard = (p, cls = '') => `<article class="work ${cls} reveal" data-cat="${p.c}"><div class="art">${concept(p.a)}</div><div class="meta"><span class="tag concept">Concept Project</span> <span class="tag">${p.cat}</span><h3>${p.t}</h3><p>${p.d}</p></div></article>`;

const home = page({
  path: '/', title: 'Maroof Marketing Agency | Digital Marketing, Design & Web Development',
  desc: 'Maroof Marketing Agency helps businesses grow with Meta and Google Ads, social media management, branding, web design and content writing. Based in Pakistan.',
  body: `
<section class="hero dark">
  <div class="container hero-grid">
    <div>
      <span class="eyebrow reveal">Digital strategy &amp; creative solutions</span>
      <h1 class="reveal" data-d="1">Your Next Stage of <span class="grad">Digital Growth</span> Starts Here.</h1>
      <p class="lead reveal" data-d="2">From performance-driven advertising to creative branding and modern websites, we help businesses build a stronger digital presence.</p>
      <div class="btn-row reveal" data-d="3"><a class="btn btn-primary" href="/contact">Start Your Project ${icon('arrow', 'arrow')}</a><a class="btn btn-secondary" href="/services">Explore Our Services</a></div>
    </div>
    <div class="stage reveal" data-d="2" id="stage" aria-hidden="true">
      <div class="stage-scene">
        <div class="layer l-glow"></div><div class="layer l-ring"></div>
        <div class="layer glass l-main"><div class="bars"><i></i><i></i><i></i><i></i><i></i></div><div class="l-line"></div><div class="l-line s"></div></div>
        <div class="layer glass l-card2">${icon('google')}</div>
        <div class="layer glass l-card3">${icon('web')}</div>
        <div class="layer orb l-orb"></div><div class="layer orb l-orb2"></div>
      </div>
    </div>
  </div>
  <a class="scroll-hint" href="#services" aria-label="Scroll to services"></a>
</section>

<section class="section" id="services"><div class="container">
  <div class="head split"><div class="reveal"><span class="eyebrow">What we do</span><h2>Six services. One consistent standard.</h2><p class="lead">Everything a growing business needs to be found, remembered and contacted online.</p></div><a class="btn btn-link reveal" href="/services">All services ${icon('arrow', 'arrow')}</a></div>
  <div class="bento">
    ${SERVICES.map((s, i) => `<a class="svc ${i === 0 ? 'wide feature' : i === 1 ? 'wide' : ''} reveal" data-d="${i % 3 + 1}" href="/services#${s.id}"><span class="num">0${i + 1}</span><span class="ico">${svcIcon(s)}</span><h3>${s.name}</h3><p>${s.short}</p><span class="more">Learn more ${icon('arrow', 'arrow')}</span></a>`).join('')}
  </div>
</div></section>

<section class="section dark"><div class="container split-2">
  <div class="reveal"><span class="eyebrow">Our approach</span><h2>Strategy first. Creativity with a purpose.</h2><p class="lead">We treat every project as a business problem to solve, not just a design to deliver. That is how marketing, branding and web work stay connected.</p>
  <div class="orbit-art" style="margin-top:2rem;max-width:300px"><svg viewBox="0 0 300 300" fill="none" aria-hidden="true"><circle cx="150" cy="150" r="130" stroke="rgba(56,189,248,.25)"/><circle cx="150" cy="150" r="90" stroke="rgba(255,255,255,.12)"/><circle cx="150" cy="150" r="48" fill="url(#o)"/><defs><radialGradient id="o" cx=".3" cy=".25"><stop stop-color="#fff"/><stop offset=".3" stop-color="#38BDF8"/><stop offset="1" stop-color="#147DFF"/></radialGradient></defs><circle cx="150" cy="20" r="8" fill="#38BDF8"/><circle cx="240" cy="150" r="6" fill="#147DFF"/><circle cx="62" cy="212" r="7" fill="#fff"/></svg></div></div>
  <div class="pillars">
    ${[['strategy', 'Strategic thinking', 'We start with your goals, audience and market so every action has a reason.'], ['creative', 'Creative execution', 'Thoughtful design and copy that make your message clear and memorable.'], ['consist', 'Consistent brand presentation', 'One look and one voice across ads, social, web and print.'], ['biz', 'Business-focused solutions', 'We prioritize work that supports real inquiries, not vanity.'], ['chat', 'Clear communication', 'Plain language, defined scope and regular updates throughout.']].map(([ic, t, d], i) => `<div class="pillar reveal" data-d="${i % 3 + 1}"><span class="ico">${icon(ic)}</span><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}
  </div>
</div></section>

<section class="section soft"><div class="container">
  <div class="head split"><div class="reveal"><span class="eyebrow">Featured work</span><h2>A look at how we think visually.</h2></div><a class="btn btn-link reveal" href="/portfolio">View portfolio ${icon('arrow', 'arrow')}</a></div>
  <div class="work-grid">
    ${workCard(PROJECTS[0], 'big')}${workCard(PROJECTS[1])}${workCard(PROJECTS[2])}${workCard(PROJECTS[3], 'big')}
  </div>
  <p class="note" style="margin-top:1.5rem">${icon('info')}<span>These are original concept projects created to demonstrate our design approach. They are not work for real clients.</span></p>
</div></section>

<section class="section"><div class="container">
  <div class="head reveal"><span class="eyebrow">How we work</span><h2>A simple process, from first call to ongoing improvement.</h2></div>
  <div class="steps">
    ${[['Discover', 'We learn about your business, audience and goals.'], ['Plan', 'We agree on scope, strategy and a clear way forward.'], ['Create', 'We design, write, build or set up the work.'], ['Launch', 'We publish and go live, with checks along the way.'], ['Improve', 'We review performance and refine what we can.']].map(([t, d], i) => `<div class="step reveal" data-d="${i}"><div class="n">0${i + 1}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}
  </div>
</div></section>
${ctaBand()}`,
});

// ---------- SERVICES ----------
const services = page({
  path: '/services', title: 'Services | Meta Ads, Google Ads, Branding, Web & Content | Maroof Marketing Agency',
  desc: 'Explore Maroof Marketing Agency services: Facebook & Meta Ads, Google Ads, social media management, logo and brand identity, web design and content writing.',
  body: `
<section class="page-hero dark"><div class="container"><span class="eyebrow reveal">Our services</span><h1 class="reveal" data-d="1">Marketing, design and web, under one roof.</h1><p class="lead reveal" data-d="2">Choose a single service or combine several. Every project begins with understanding your business, and scope is agreed with you before work starts.</p>
<div class="jump reveal" data-d="3">${SERVICES.map(s => `<a class="chip" href="#${s.id}">${s.form}</a>`).join('')}</div></div></section>
<section class="section"><div class="container">
${SERVICES.map((s, i) => `
<article class="svc-detail" id="${s.id}">
  <div class="svc-visual reveal" role="img" aria-label="${s.name} illustration"><span class="idx">0${i + 1} / 06</span><span class="ring"></span><span class="ring r2"></span><span class="big-ico">${svcIcon(s)}</span></div>
  <div class="reveal" data-d="1"><span class="eyebrow">Service 0${i + 1}</span><h2 style="font-size:clamp(1.6rem,3.2vw,2.4rem)">${s.name}</h2><p class="lead">${s.long}</p>
  <ul class="checks">${s.items.map(x => `<li>${icon('check')}<span>${x}</span></li>`).join('')}</ul>
  <div class="btn-row"><a class="btn btn-primary" href="/contact?service=${encodeURIComponent(s.form)}#inquiry">Get a Quote ${icon('arrow', 'arrow')}</a><a class="btn btn-secondary on-light" href="${WA}?text=${encodeURIComponent('Hello Maroof Marketing Agency, I am interested in ' + s.form + '.')}" target="_blank" rel="noopener">${icon('wa')} Ask on WhatsApp</a></div></div>
</article>`).join('')}
<p class="note" style="margin-top:2rem">${icon('info')}<span>Deliverables vary by project. We do not publish fixed prices; every quote is based on your needs. No results are guaranteed.</span></p>
</div></section>
${ctaBand('Not sure which service you need?', 'Describe your goals and we will suggest a sensible starting point.')}`,
});

// ---------- PORTFOLIO ----------
const portfolio = page({
  path: '/portfolio', title: 'Portfolio | Concept Projects | Maroof Marketing Agency',
  desc: 'Browse concept projects from Maroof Marketing Agency across branding, web design, social media and advertising creatives.',
  body: `
<section class="page-hero dark"><div class="container"><span class="eyebrow reveal">Portfolio</span><h1 class="reveal" data-d="1">Creative direction in practice.</h1><p class="lead reveal" data-d="2">A selection of original concept projects that show how we approach branding, web, social and advertising design.</p></div></section>
<section class="section"><div class="container">
  <p class="note" style="margin-bottom:1.5rem">${icon('info')}<span><strong>Please note:</strong> every project below is a clearly labeled concept created for demonstration. None represent real clients. Real work will replace these as it is added.</span></p>
  <div class="filters" role="group" aria-label="Filter projects by category">
    ${[['all', 'All'], ['branding', 'Branding'], ['web', 'Web Design'], ['social', 'Social Media'], ['ads', 'Advertising Creatives']].map(([k, l], i) => `<button class="filter" type="button" data-filter="${k}" aria-pressed="${i === 0}">${l}</button>`).join('')}
  </div>
  <div class="work-grid" id="work-grid">${PROJECTS.map(p => workCard(p, 'sq')).join('')}</div>
  <div class="empty" id="empty"><h3>No projects in this category yet</h3><p>New work will appear here as it is added.</p></div>
</div></section>
<section class="section soft"><div class="container cta-inner"><div class="reveal"><span class="eyebrow">Next step</span><h2>Have a Project in Mind?</h2><p class="lead">Tell us what you are working on and we will talk through the best way to approach it.</p></div><div class="btn-row reveal" data-d="2" style="justify-content:flex-end"><a class="btn btn-primary" href="/contact">Start a Project ${icon('arrow', 'arrow')}</a></div></div></section>`,
});

// ---------- ABOUT ----------
const about = page({
  path: '/about', title: 'About | Maroof Marketing Agency',
  desc: 'Learn about Maroof Marketing Agency, a Pakistan-based digital marketing, creative design and web development agency led by Saad Rasheed.',
  body: `
<section class="page-hero dark"><div class="container"><span class="eyebrow reveal">About the agency</span><h1 class="reveal" data-d="1">Marketing and design for businesses that want to be taken seriously online.</h1></div></section>
<section class="section"><div class="container split-2">
  <div class="reveal"><span class="eyebrow">Who we are</span><h2>A Pakistan-based digital agency.</h2><p class="lead">Maroof Marketing Agency is a digital marketing, creative design and web development agency founded by Saad Rasheed in Pakistan.</p><p style="color:var(--muted)">We work with small and medium-sized businesses, startups, entrepreneurs and local brands, as well as international businesses looking for dependable digital services.</p></div>
  <div class="fact-card reveal" data-d="2"><dl><div><dt>Agency</dt><dd>Maroof Marketing Agency</dd></div><div><dt>Founder</dt><dd>Saad Rasheed</dd></div><div><dt>Country</dt><dd>Pakistan</dd></div><div><dt>Focus</dt><dd>Digital Marketing, Creative Design &amp; Web Development</dd></div></dl></div>
</div></section>
<section class="section dark"><div class="container">
  <div class="head reveal"><span class="eyebrow">Purpose &amp; philosophy</span><p class="quote">Good marketing should be clear, consistent and useful to the business behind it.</p></div>
  <div class="values">
    <div class="value reveal"><span class="n">01 / PURPOSE</span><h3>Why our services exist</h3><p>Many businesses need advertising, branding and a website but do not have the time to coordinate several providers. We bring these together so the pieces fit.</p></div>
    <div class="value reveal" data-d="1"><span class="n">02 / MISSION</span><h3>Help businesses be found and trusted</h3><p>We aim to give businesses a credible, modern presence and a clear way for customers to reach them.</p></div>
    <div class="value reveal" data-d="2"><span class="n">03 / PHILOSOPHY</span><h3>Honest and practical</h3><p>We explain what we will do, avoid inflated promises, and focus on work that supports real business goals.</p></div>
  </div>
</div></section>
<section class="section"><div class="container split-2">
  <div class="reveal"><span class="eyebrow">How we approach projects</span><h2>Understand first. Then design, build and refine.</h2><p class="lead">We begin by listening, agree on scope, create the work, launch it carefully and review what can be improved.</p><a class="btn btn-link" href="/#services">See our process ${icon('arrow', 'arrow')}</a></div>
  <ul class="checks reveal" data-d="2" style="grid-template-columns:1fr">${['Clear discovery before any work begins', 'Defined scope and open communication', 'Consistent look and voice across channels', 'Review and improvement after launch'].map(x => `<li>${icon('check')}<span>${x}</span></li>`).join('')}</ul>
</div></section>
<section class="section soft"><div class="container">
  <div class="head reveal"><span class="eyebrow">Six areas of service</span><h2>What we can help with.</h2></div>
  <div class="mini-list">${SERVICES.map((s, i) => `<a class="mini reveal" data-d="${i % 3}" href="/services#${s.id}"><span class="ico">${svcIcon(s)}</span>${s.name}</a>`).join('')}</div>
</div></section>
${ctaBand('Let\'s talk about your business.', 'Share your goals and we will suggest a clear way forward.')}`,
});

// ---------- CONTACT ----------
const contact = page({
  path: '/contact', title: 'Contact | Start a Project | Maroof Marketing Agency',
  desc: 'Contact Maroof Marketing Agency. Send a project inquiry via WhatsApp or call +92 319 0482228 to discuss ads, branding, web design or content.',
  body: `
<section class="page-hero dark"><div class="container"><span class="eyebrow reveal">Contact</span><h1 class="reveal" data-d="1">Tell us about your project.</h1><p class="lead reveal" data-d="2">Fill in the form and we will prepare your inquiry as a WhatsApp message. You can also message us directly at any time.</p></div></section>
<section class="section" id="inquiry"><div class="container contact-grid">
  <div class="form-card reveal">
    <form id="inquiry-form" novalidate>
      <div class="fields">
        <div class="field"><label for="name">Full name <span class="req" aria-hidden="true">*</span></label><input id="name" name="name" autocomplete="name" required aria-describedby="name-err"><span class="err" id="name-err" role="alert">Please enter your full name.</span></div>
        <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-err"><span class="err" id="email-err" role="alert">Please enter a valid email address.</span></div>
        <div class="field"><label for="business">Business name</label><input id="business" name="business" autocomplete="organization"></div>
        <div class="field"><label for="phone">Contact number</label><input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
        <div class="field"><label for="service">Service required <span class="req" aria-hidden="true">*</span></label><select id="service" name="service" required aria-describedby="service-err"><option value="">Select a service</option>${['Facebook & Meta Ads', 'Google Ads', 'Social Media Management', 'Logo Design & Brand Identity', 'Web Design & Development', 'Content Writing', 'Other / Multiple Services'].map(o => `<option>${o.replace('&', '&amp;')}</option>`).join('')}</select><span class="err" id="service-err" role="alert">Please choose a service.</span></div>
        <div class="field"><label for="budget">Estimated budget</label><input id="budget" name="budget" placeholder="e.g. PKR 50,000 / month (optional)"></div>
        <div class="field full"><label for="details">Project details <span class="req" aria-hidden="true">*</span></label><textarea id="details" name="details" required aria-describedby="details-err"></textarea><span class="err" id="details-err" role="alert">Please describe your project (at least 10 characters).</span></div>
      </div>
      <p class="hint" style="margin-top:1rem">Fields marked * are required. This form does not send data to a server. It prepares a message and opens WhatsApp, where you must press <strong>Send</strong> for us to receive it.</p>
      <div class="btn-row" style="margin-top:1rem"><button class="btn btn-whatsapp" type="submit">${icon('wa')} Prepare WhatsApp Inquiry</button></div>
      <div class="form-status" id="form-status" role="status" aria-live="polite"></div>
    </form>
  </div>
  <aside class="side-card reveal" data-d="2">
    <span class="eyebrow">Direct contact</span>
    <p style="margin-bottom:0">WhatsApp / Phone</p><a class="num" href="${WA}" target="_blank" rel="noopener" style="text-decoration:none;color:#fff">${WA_DISPLAY}</a>
    <a class="btn btn-whatsapp" href="${WA}?text=${encodeURIComponent('Hello Maroof Marketing Agency, I would like to discuss a project.')}" target="_blank" rel="noopener">${icon('wa')} Chat on WhatsApp</a>
    <ul class="wa-list" aria-label="Quick WhatsApp messages by service">${SERVICES.map(s => `<li><a href="${WA}?text=${encodeURIComponent('Hello Maroof Marketing Agency, I am interested in ' + s.form + '.')}" target="_blank" rel="noopener"><span>${s.form}</span>${icon('arrow')}</a></li>`).join('')}</ul>
  </aside>
</div></section>`,
});

// ---------- 404 ----------
const nf = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Maroof Marketing Agency</title><meta name="robots" content="noindex"><meta name="theme-color" content="#07152E"><link rel="icon" href="/assets/img/favicon.png"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/css/styles.css"></head><body class="dark"><main class="notfound"><div><div class="big grad">404</div><h1 style="font-size:clamp(1.6rem,4vw,2.4rem)">This page could not be found.</h1><p>The link may be outdated or mistyped.</p><div class="btn-row" style="justify-content:center"><a class="btn btn-primary" href="/">Back to Home</a><a class="btn btn-secondary" href="/contact">Contact Us</a></div></div></main></body></html>`;

// ---------- OUTPUT ----------
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
const out = (p, c) => { const d = p === '/' ? 'dist' : `dist${p}`; mkdirSync(d, { recursive: true }); writeFileSync(`${d}/index.html`, c); };
out('/', home); out('/services', services); out('/portfolio', portfolio); out('/about', about); out('/contact', contact);
writeFileSync('dist/404.html', nf);
cpSync('assets', 'dist/assets', { recursive: true }); cpSync('assets/favicon.ico', 'dist/favicon.ico');
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${NAV.map(([h]) => `  <url><loc>${SITE}${h === '/' ? '/' : h}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log('Built 5 pages + 404 into ./dist');
