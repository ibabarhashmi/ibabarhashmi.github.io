"use strict";
(function(){
const SITE = window.SITE || {};
function el(tag, attrs, children){
  const n = document.createElement(tag);
  if(attrs) for(const k in attrs){
    if(k==="text") n.textContent = attrs[k];
    else if(k==="html") n.innerHTML = attrs[k];
    else n.setAttribute(k, attrs[k]);
  }
  (children||[]).forEach(c=>{ if(typeof c==="string") n.appendChild(document.createTextNode(c)); else if(c) n.appendChild(c); });
  return n;
}
function extLink(href, text){
  const a = el("a",{href:href,target:"_blank",rel:"noopener noreferrer"});
  a.appendChild(document.createTextNode(text));
  const vh = el("span",{class:"vh",text:" (opens in new tab)"});
  a.appendChild(vh);
  return a;
}
function orb(){
  const s = el("span",{class:"btn-orb","aria-hidden":"true"});
  s.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  return s;
}
const ICONS = {
  /* Single icon family: consistent 1.75 stroke, round caps. Phosphor-style paths, inline to avoid a new dependency on this static page. */
  pin:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  ext:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  sun:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>'
};
let tileIndex = 0;
function markTile(node){ node.style.setProperty("--i", String(tileIndex++)); return node; }
document.querySelectorAll(".tile").forEach(markTile);

/* ---------- Profile (Cinematic Center Hero) ---------- */
(function(){
  const root = document.getElementById("tile-profile");
  if(!root) return;
  root.classList.add("bezel", "hero-tile");
  const wrap = el("div",{class:"hero bezel-inner"});
  
  // Avatar as decorative element, not layout driver
  const img = el("img",{class:"hero-avatar",src:SITE.avatar||SITE.avatarFallback,alt:"Portrait of "+(SITE.name||"Babar Hashmi"),width:"120",height:"120",fetchpriority:"high",decoding:"async"});
  img.onerror = function(){ img.onerror=null; if(SITE.avatarFallback) img.src=SITE.avatarFallback; };
  
  const h1 = el("h1",{id:"h-name",text:SITE.name||"Babar Hashmi"});
  const title = el("p",{class:"hero-title",text:SITE.title||""});
  const meta = el("div",{class:"hero-meta"});
  meta.insertAdjacentHTML("afterbegin", ICONS.pin);
  meta.appendChild(document.createTextNode((SITE.location||"") + ", " + (SITE.relocation||"")));
  
  const badge = el("div",{class:"badge",id:"avail-badge"});
  const dot = el("span",{class:"dot","aria-hidden":"true"});
  badge.appendChild(dot);
  badge.appendChild(document.createTextNode(SITE.availability||"Available remote - globally"));
  
  const bio = el("p",{class:"hero-bio",text:SITE.bio||""});
  
  const actions = el("div",{class:"hero-actions"});
  const book = extLink(SITE.links.book,"Book a call"); book.className="btn btn-primary"; book.appendChild(orb());
  actions.appendChild(book);
  const work = el("a",{class:"btn btn-secondary",href:"#work-heading",text:"View work"});
  actions.appendChild(work);
  
  wrap.append(img, h1, title, meta, badge, bio, actions);
  root.appendChild(wrap);
})();

/* ---------- NOW ---------- */
(function(){
  const root = document.getElementById("tile-now");
  root.appendChild(el("h2",{class:"tile-title",id:"h-now",text:"Now"}));
  root.appendChild(el("p",{text:SITE.now||""}));
  root.lastChild.style.cssText = "font-size:17px;font-weight:500;margin:0";
})();



/* ---------- Impact ---------- */
(function(){
  const root = document.getElementById("tile-impact");
  root.appendChild(el("h2",{class:"eyebrow",id:"h-impact",text:"IMPACT"}));
  const grid = el("div",{class:"stats"});
  (SITE.impact||[]).forEach(s=>{
    const d = el("div",{class:"stat"});
    d.appendChild(el("div",{class:"stat-value",text:s.value}));
    d.appendChild(el("div",{class:"stat-label",text:s.label}));
    grid.appendChild(d);
  });
  root.appendChild(grid);
})();

/* ---------- GitHub ---------- */
const LANG_COLORS = {"Python":"#3572A5","TypeScript":"#3178C6","JavaScript":"#F1E05A","Jupyter Notebook":"#DA5B0B","Solidity":"#AA6746"};
async function loadGitHub(){
  const KEY="gh_cache_v2", TTL=6*3600*1000;
  try{
    const c = JSON.parse(localStorage.getItem(KEY)||"null");
    if(c && Date.now()-c.t<TTL) return c.d;
  }catch(e){}
  try{
    const [u,r] = await Promise.all([
      fetch("https://api.github.com/users/ibabarhashmi",{headers:{Accept:"application/vnd.github+json"}}),
      fetch("https://api.github.com/users/ibabarhashmi/repos?per_page=100&sort=updated",{headers:{Accept:"application/vnd.github+json"}})
    ]);
    if(!u.ok || !r.ok) throw new Error("rate-limited or unavailable");
    const user = await u.json();
    const HIDE=/^(paint-github|ibabarhashmi\.github\.io$)/;
    const repos = (await r.json()).filter(x=>!x.fork && !x.archived && x.description && !HIDE.test(x.name));
    const langs = {};
    repos.forEach(x=>{ if(x.language) langs[x.language]=(langs[x.language]||0)+1; });
    const d = {
      public_repos:user.public_repos, followers:user.followers,
      avatar:user.avatar_url,
      stars:repos.reduce((s,x)=>s+x.stargazers_count,0),
      languages:langs,
      recent:repos.slice(0,4).map(x=>({name:x.name,description:x.description,language:x.language,stars:x.stargazers_count,url:x.html_url,updated:x.pushed_at})),
      live:true
    };
    try{ localStorage.setItem(KEY, JSON.stringify({t:Date.now(),d:d})); }catch(e){}
    return d;
  }catch(e){ return Object.assign({}, SITE.githubFallback, {live:false}); }
}
(function(){
  const root = document.getElementById("tile-github");
  root.appendChild(el("h2",{class:"tile-title",id:"h-github",text:"GitHub"}));
  const sk = el("div",{id:"gh-skel"});
  for(let i=0;i<4;i++) sk.appendChild(el("div",{class:"skel"}));
  root.appendChild(sk);
  loadGitHub().then(d=>{
    sk.remove();
    const head = el("div",{class:"gh-head"});
    const av = el("img",{src:d.avatar||SITE.githubFallback.avatar,alt:"GitHub avatar of ibabarhashmi",width:"40",height:"40"});
    head.appendChild(av);
    head.appendChild(extLink("https://github.com/ibabarhashmi","@ibabarhashmi"));
    root.appendChild(head);
    const stats = el("div",{class:"gh-stats"});
    [["Repos",d.public_repos],["Stars",d.stars],["Followers",d.followers]].forEach(([l,v])=>{
      const s = el("div",{});
      s.appendChild(el("b",{text:String(v)}));
      s.appendChild(el("span",{text:l}));
      stats.appendChild(s);
    });
    root.appendChild(stats);
    const langs = d.languages||{};
    const total = Object.values(langs).reduce((a,b)=>a+b,0) || 1;
    const bar = el("div",{class:"langbar","aria-hidden":"true"});
    const legend = el("div",{class:"lang-legend"});
    Object.entries(langs).sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([name,count])=>{
      const seg = el("i",{});
      seg.style.width = (count/total*100)+"%";
      seg.style.background = LANG_COLORS[name]||"var(--text-3)";
      bar.appendChild(seg);
      const item = el("span",{});
      const dotS = el("s",{});
      dotS.style.background = LANG_COLORS[name]||"var(--text-3)";
      item.appendChild(dotS);
      item.appendChild(document.createTextNode(name));
      legend.appendChild(item);
    });
    root.appendChild(bar); root.appendChild(legend);
    (d.recent||[]).slice(0,4).forEach(repo=>{
      const r = el("div",{class:"repo"});
      const link = extLink(repo.url, repo.name); link.className="repo-name";
      r.appendChild(link);
      if(repo.description) r.appendChild(el("div",{class:"repo-desc",text:repo.description}));
      const meta = [repo.language, repo.stars!=null?("Stars "+repo.stars):null].filter(Boolean).join(" - ");
      if(meta) r.appendChild(el("div",{class:"repo-meta",text:meta}));
      root.appendChild(r);
    });
    if(d.live===false) root.appendChild(el("div",{class:"cached-note",text:"Showing cached data"}));
    const all = extLink("https://github.com/ibabarhashmi?tab=repositories","View all on GitHub →");
    all.className="view-all";
    root.appendChild(all);
  });
})();

/* ---------- Experience ---------- */
(function(){
  const root = document.getElementById("tile-exp");
  root.appendChild(el("h2",{class:"tile-title",id:"h-exp",text:"Experience"}));
  const tl = el("div",{class:"timeline"});
  (SITE.experience||[]).forEach(job=>{
    const item = el("div",{class:"tl-item"});
    const top = el("div",{class:"tl-top"});
    top.appendChild(el("h3",{class:"tl-role",text:job.role}));
    top.appendChild(el("span",{class:"tl-dates",text:job.start+" - "+job.end}));
    item.appendChild(top);
    item.appendChild(el("div",{class:"tl-org",text:job.org}));
    const ul = el("ul",{});
    job.points.forEach(p=>ul.appendChild(el("li",{text:p})));
    item.appendChild(ul);
    tl.appendChild(item);
  });
  root.appendChild(tl);
})();

/* ---------- Projects ---------- */
(function(){
  const head = document.getElementById("work-heading");
  head.textContent = "Selected work";
  const slot = document.getElementById("projects-slot");
  (SITE.projects||[]).forEach((p)=>{
    let card;
    if(p.repo){
      card = el("a",{class:"tile span-2 proj tile-linked",href:p.repo,target:"_blank",rel:"noopener noreferrer"});
      card.setAttribute("aria-label","Open "+p.name+" repository");
    }else{
      card = el("article",{class:"tile span-2 proj"});
    }
    markTile(card);
    card.appendChild(el("p",{class:"proj-tag",text:p.tag||"Project"}));
    if(p.repo){
      const s = el("span",{class:"ext","aria-hidden":"true"});
      s.innerHTML = ICONS.ext;
      card.appendChild(s);
    }
    card.appendChild(el("h3",{text:p.name}));
    card.appendChild(el("p",{class:"muted",text:p.summary}));
    if(p.highlights && p.highlights.length){
      const ul = el("ul",{class:"checks"});
      p.highlights.slice(0,3).forEach(h=>ul.appendChild(el("li",{text:h})));
      card.appendChild(ul);
    }
    const chips = el("div",{class:"chips"});
    (p.stack||[]).forEach(s=>chips.appendChild(el("span",{class:"chip",text:s})));
    if(!p.repo) chips.appendChild(el("span",{class:"chip chip-accent",text:"Private / work project"}));
    card.appendChild(chips);
    slot.appendChild(card);
  });
})();

/* ---------- Stack ---------- */
(function(){
  const root = document.getElementById("tile-stack");
  root.appendChild(el("h2",{class:"tile-title",id:"h-stack",text:"Stack"}));
  Object.entries(SITE.stack||{}).forEach(([g,items])=>{
    const grp = el("div",{class:"stack-group"});
    grp.appendChild(el("div",{class:"stack-name",text:g}));
    const chips = el("div",{class:"chips"});
    chips.style.margin = "0";
    items.forEach(s=>chips.appendChild(el("span",{class:"chip",text:s})));
    grp.appendChild(chips);
    root.appendChild(grp);
  });
})();



/* ---------- Domains / Vibe / Contact ---------- */
(function(){


  const v = document.getElementById("tile-vibe");
  v.appendChild(el("h2",{class:"tile-title",id:"h-vibe",text:"Note"}));
  v.appendChild(el("p",{class:"vibe-text",text:SITE.vibe||""}));

  const c = document.getElementById("tile-contact");
  c.classList.add("bezel");
  const ci = el("div",{class:"bezel-inner"});
  c.appendChild(ci);
  ci.appendChild(el("h2",{class:"eyebrow",id:"h-contact",text:"Contact"}));
  ci.appendChild(el("p",{class:"contact-title",text:"Let's build something."}));
  ci.appendChild(el("p",{text:"Available remote - globally. Based in Bangalore, open to relocation. Grab the CV or just say hi."}));
  const row = el("div",{class:"actions"});
  const b1 = extLink(SITE.links.book,"Book a call"); b1.className="btn btn-primary"; b1.appendChild(orb()); row.appendChild(b1);
  if(SITE.resume){
    const r = el("a",{class:"btn btn-secondary",href:SITE.resume,text:"Download CV"});
    r.setAttribute("target","_blank"); r.setAttribute("rel","noopener noreferrer");
    row.appendChild(r);
  }
  ci.appendChild(row);
  const icons = el("div",{class:"icon-row"});
  function brandLink(href,label,src,alt,darkSrc){
    /* Plain anchor on purpose: no extLink vh span, so copy-paste of the tile stays clean. Name lives in aria-label + title. */
    const a = el("a",{href:href,target:"_blank",rel:"noopener noreferrer"});
    a.className="icon-link";
    a.setAttribute("aria-label",label);
    a.setAttribute("title",label);
    const img = el("img",{src:src,alt:"",width:"24",height:"24",loading:"lazy"});
    img.setAttribute("aria-hidden","true");
    if(darkSrc){
      img.className="only-light";
      const dim = el("img",{src:darkSrc,alt:"",width:"24",height:"24",loading:"lazy"});
      dim.setAttribute("aria-hidden","true");
      dim.className="only-dark";
      a.appendChild(img); a.appendChild(dim);
    }else{
      a.appendChild(img);
    }
    return a;
  }
  icons.appendChild(brandLink(SITE.links.linkedin,"LinkedIn profile","assets/icons/linkedin.svg"));
  icons.appendChild(brandLink(SITE.links.github,"GitHub profile","assets/icons/github-light.svg","", "assets/icons/github-dark.svg"));
  icons.appendChild(brandLink(SITE.links.telegram,"Telegram chat","assets/icons/telegram.svg"));
  const mailBtn = el("a",{class:"icon-link",href:"mailto:"+SITE.email,target:"_blank",rel:"noopener noreferrer"});
  mailBtn.setAttribute("aria-label","Email Babar Hashmi");
  mailBtn.setAttribute("title","Email Babar Hashmi");
  mailBtn.insertAdjacentHTML("afterbegin",'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>');
  icons.appendChild(mailBtn);
  ci.appendChild(icons);
})();

/* ---------- Footer year ---------- */
(function(){
  const f = document.getElementById("foot-copy");
  if(f) f.textContent = "© "+new Date().getFullYear()+" "+(SITE.name||"Babar Hashmi");
})();

/* ---------- Toast + copy ---------- */
let toastTimer = null;
function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.hidden = true; }, 2000);
}
function copyEmail(){
  const email = SITE.email;
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(email).then(function(){ toast("Email copied"); }, function(){ window.location.href = "mailto:"+email; });
  }else{
    window.location.href = "mailto:"+email;
  }
}

/* ---------- Theme ---------- */
(function(){
  const btn = document.getElementById("theme-toggle");
  const meta = document.getElementById("meta-theme");
  function paint(){
    const dark = document.documentElement.dataset.theme==="dark";
    if(btn) btn.setAttribute("aria-pressed", dark?"true":"false");
    if(meta) meta.setAttribute("content", dark?"#0F0F0E":"#FCFBF9");
    const icon = document.getElementById("theme-icon");
    if(icon) icon.innerHTML = dark
      ? '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'
      : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  }
  paint();
  if(btn) btn.addEventListener("click", function(){
    const next = document.documentElement.dataset.theme==="dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try{ localStorage.setItem("theme", next); }catch(e){}
    paint();
  });
})();

/* ---------- Delight: count-up only ---------- */
(function(){
  try{ console.log("%cAgents that tell the truth. - BH", "color:#1487FA;font-weight:bold"); }catch(e){}
  const mqCalm = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const calm = !!(mqCalm && mqCalm.matches);
  const canRAF = !!window.requestAnimationFrame;

  /* count-up impact stats, first reveal only; final text stays in DOM */
  (function(){
    if(calm || !canRAF) return;
    const tile = document.getElementById("tile-impact");
    if(!tile || !("IntersectionObserver" in window)) return;
    function run(){
      tile.querySelectorAll(".stat-value").forEach(function(n){
        const m = /^([+\-]?)(\d+(?:\.\d+)?)(.*)$/.exec(n.textContent.trim());
        if(!m || parseFloat(m[2]) <= 0) return;
        const sign = m[1], target = parseFloat(m[2]), suffix = m[3];
        const t0 = performance.now(), dur = 800;
        (function frame(t){
          const k = Math.min(1, (t-t0)/dur), e = 1-Math.pow(1-k, 4);
          n.textContent = sign + Math.round(target*e) + suffix;
          if(k < 1) requestAnimationFrame(frame);
        })(t0);
      });
    }
    const io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ run(); io.disconnect(); } });
    }, { threshold: .3 });
    io.observe(tile);
  })();
})();

/* ---------- Entrance ---------- */
(function(){
  const tiles = document.querySelectorAll(".tile");
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver(function(entries){
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
    }, {threshold:.1});
    tiles.forEach(t=>io.observe(t));
  }else{
    tiles.forEach(t=>t.classList.add("in"));
  }
})();


/* ---------- GSAP Scroll Motion ---------- */
(function(){
  if(!window.gsap || !window.ScrollTrigger) return;
  const mqCalm = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const calm = !!(mqCalm && mqCalm.matches);
  if(calm) return;
  
  gsap.registerPlugin(ScrollTrigger);
  
  /* Experience: Scroll Pinning - pin each role while next scrolls over */
  const tlItems = gsap.utils.toArray('.tl-item');
  if(tlItems.length > 1){
    tlItems.forEach((item, i) => {
      if(i === tlItems.length - 1) return; // Last item doesn't pin
      ScrollTrigger.create({
        trigger: item,
        start: 'top 88px',
        endTrigger: tlItems[tlItems.length - 1],
        end: 'top 88px',
        pin: true,
        pinSpacing: false,
      });
      // Scale/fade previous as next arrives
      gsap.to(item, {
        scale: 0.95,
        opacity: 0.7,
        ease: 'none',
        scrollTrigger: {
          trigger: tlItems[i + 1],
          start: 'top bottom',
          end: 'top 88px',
          scrub: 1,
        },
      });
    });
  }
  
  /* Projects: Card Stacking - cards stack from bottom on scroll */
  const projCards = gsap.utils.toArray('.proj');
  if(projCards.length > 3){
    const stackCards = projCards.slice(0, 6); // First 6 cards
    stackCards.forEach((card, i) => {
      if(i === 0) return; // First card stays
      gsap.fromTo(card, 
        { y: 100, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: 'power3.out',
          duration: 0.8,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 0.5,
            toggleActions: 'play none none reverse',
          }
        }
      );
    });
  }
  
  /* Hero Avatar: Parallax float on scroll */
  const heroAvatar = document.querySelector('.hero-avatar');
  if(heroAvatar){
    gsap.to(heroAvatar, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '#tile-profile',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });
  }
  
  /* Section headings: Scrubbing text reveal */
  const sectionHeadings = gsap.utils.toArray('.section-heading, .eyebrow');
  sectionHeadings.forEach(heading => {
    gsap.fromTo(heading, 
      { opacity: 0.2, y: 20 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heading,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1,
        }
      }
    );
  });
})();
})();
