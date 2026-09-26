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

/* ---------- Profile ---------- */
(function(){
  const root = document.getElementById("tile-profile");
  if(!root) return;
  const wrap = el("div",{class:"profile"});
  const img = el("img",{class:"avatar",src:SITE.avatar||SITE.avatarFallback,alt:"Portrait of "+(SITE.name||"Babar Hashmi"),width:"96",height:"96",fetchpriority:"high",decoding:"async"});
  img.onerror = function(){ img.onerror=null; if(SITE.avatarFallback) img.src=SITE.avatarFallback; };
  const right = el("div",{class:"profile-text"});
  const h1 = el("h1",{id:"h-name",text:SITE.name||"Babar Hashmi"});
  const title = el("p",{class:"title",text:SITE.title||""});
  const meta = el("div",{class:"meta-row"});
  meta.insertAdjacentHTML("afterbegin", ICONS.pin);
  meta.appendChild(document.createTextNode((SITE.location||"") + ", " + (SITE.relocation||"")));
  const badge = el("div",{class:"badge",id:"avail-badge"});
  const dot = el("span",{class:"dot","aria-hidden":"true"});
  badge.appendChild(dot);
  badge.appendChild(document.createTextNode(SITE.availability||"Available remote - globally"));
  const bio = el("p",{class:"bio",text:SITE.bio||""});
  const actions = el("div",{class:"actions"});
  const book = extLink(SITE.links.book,"Book a call"); book.className="btn btn-primary";
  actions.appendChild(book);
  const work = el("a",{class:"btn btn-secondary",href:"#work-heading",text:"View work"});
  actions.appendChild(work);
  right.append(h1,title,meta,badge,bio,actions);
  wrap.append(img,right);
  root.appendChild(wrap);
})();

/* ---------- NOW ---------- */
(function(){
  const root = document.getElementById("tile-now");
  root.appendChild(el("h2",{class:"tile-title",id:"h-now",text:"Now"}));
  root.appendChild(el("p",{text:SITE.now||""}));
  root.lastChild.style.cssText = "font-size:17px;font-weight:500;margin:0";
})();

/* ---------- Clocks ---------- */
const ZONES = [
  { label:"IST", city:"Bangalore", tz:"Asia/Kolkata", offset:"UTC+5:30" },
  { label:"KSA", city:"Riyadh", tz:"Asia/Riyadh", offset:"UTC+3" },
  { label:"UAE", city:"Dubai", tz:"Asia/Dubai", offset:"UTC+4" }
];
const fmt = {};
ZONES.forEach(z=>{
  fmt[z.tz] = {
    time:new Intl.DateTimeFormat("en-GB",{timeZone:z.tz,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false,hourCycle:"h23"}),
    day:new Intl.DateTimeFormat("en-GB",{timeZone:z.tz,weekday:"short",day:"numeric",month:"short"}),
    hour:new Intl.DateTimeFormat("en-GB",{timeZone:z.tz,hour:"numeric",hour12:false,hourCycle:"h23"})
  };
});
(function(){
  const root = document.getElementById("tile-time");
  root.appendChild(el("h2",{class:"tile-title",id:"h-time",text:"Local time"}));
  root.setAttribute("aria-live","off");
  ZONES.forEach(z=>{
    const row = el("div",{class:"clock-row"});
    row.setAttribute("data-clock", z.tz);
    const left = el("div",{class:"clock-left"});
    left.appendChild(el("span",{class:"clock-label",text:z.label+" - "+z.city}));
    left.appendChild(el("span",{class:"clock-city",text:z.offset}));
    const right = el("div",{class:"clock-right"});
    right.appendChild(el("div",{class:"clock-time",text:"--:--:--"}));
    const sub = el("div",{class:"clock-day"});
    sub.appendChild(el("span",{class:"day",text:""}));
    const ic = el("span",{class:"clock-icon","aria-hidden":"true"});
    sub.appendChild(ic);
    right.appendChild(sub);
    row.append(left,right);
    root.appendChild(row);
  });
  const foot = el("p",{class:"tile-foot",text:"Working hours 10:00-19:00 IST (08:30-17:30 Dubai, 07:30-16:30 Riyadh)"});
  root.appendChild(foot);
  root.appendChild(el("p",{class:"tile-foot",id:"overlap",text:""}));
})();
function tick(){
  const now = new Date();
  ZONES.forEach(z=>{
    const node = document.querySelector('[data-clock="'+z.tz+'"]');
    if(!node) return;
    const t = node.querySelector(".clock-time");
    const d = node.querySelector(".day");
    if(t) t.textContent = fmt[z.tz].time.format(now);
    if(d) d.textContent = fmt[z.tz].day.format(now) + " (" + z.offset + ")";
    let h = 12;
    try{ h = parseInt(fmt[z.tz].hour.format(now),10); }catch(e){}
    const day = (h>=7 && h<19);
    node.dataset.daypart = day ? "day" : "night";
    const ic = node.querySelector(".clock-icon");
    if(ic && ic.dataset.p!==node.dataset.daypart){ ic.dataset.p=node.dataset.daypart; ic.innerHTML = day ? ICONS.sun : ICONS.moon; }
  });
  const ov=document.getElementById("overlap");
  if(ov){ let dh=12; try{dh=parseInt(fmt["Asia/Dubai"].hour.format(now),10);}catch(e){}
    let ih=12; try{ih=parseInt(fmt["Asia/Kolkata"].hour.format(now),10);}catch(e){}
    const gulf=dh>=9&&dh<18, me=ih>=10&&ih<19;
    ov.textContent = (gulf&&me) ? "Overlap now: Gulf business hours" : "Outside shared hours - replies within a day"; }
  // availability dot
  let istH = 12;
  try{ istH = parseInt(fmt["Asia/Kolkata"].hour.format(now),10); }catch(e){}
  const wh = SITE.workingHoursIST || [10,19];
  const badge = document.getElementById("avail-badge");
  if(badge){
    const inside = istH>=wh[0] && istH<wh[1];
    badge.classList.toggle("off", !inside);
    badge.title = inside ? "Within IST working hours" : "Outside IST working hours - async replies";
  }
}
tick();
(function schedule(){
  const delay = 1000 - (Date.now()%1000);
  setTimeout(function(){ tick(); setInterval(function(){ if(!document.hidden) tick(); },1000); }, delay);
})();
document.addEventListener("visibilitychange", function(){ if(!document.hidden) tick(); });

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
  (SITE.projects||[]).forEach(p=>{
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
      p.highlights.forEach(h=>ul.appendChild(el("li",{text:h})));
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

/* ---------- Certs ---------- */
(function(){
  const root = document.getElementById("tile-certs");
  root.appendChild(el("h2",{class:"tile-title",id:"h-certs",text:"Certifications"}));
  (SITE.certifications||[]).forEach(c=>{
    const r = el("div",{class:"cert-row"});
    r.appendChild(el("p",{class:"cert-name",text:c.name}));
    r.appendChild(el("p",{class:"cert-meta",text:c.issuer+" - "+c.date}));
    root.appendChild(r);
  });
})();

/* ---------- Domains / Vibe / Contact ---------- */
(function(){
  const d = document.getElementById("tile-domains");
  d.appendChild(el("h2",{class:"tile-title",id:"h-domains",text:"Domains"}));
  const chips = el("div",{class:"chips"});
  chips.style.margin = "0";
  (SITE.domains||[]).forEach(x=>chips.appendChild(el("span",{class:"chip",text:x})));
  d.appendChild(chips);

  const v = document.getElementById("tile-vibe");
  v.appendChild(el("h2",{class:"tile-title",id:"h-vibe",text:"Note"}));
  v.appendChild(el("p",{class:"vibe-text",text:SITE.vibe||""}));

  const c = document.getElementById("tile-contact");
  c.appendChild(el("h2",{class:"eyebrow",id:"h-contact",text:"Contact"}));
  c.appendChild(el("p",{class:"contact-title",text:"Let's build something."}));
  c.appendChild(el("p",{text:"Available remote - globally. Based in Bangalore, open to relocation. Grab the CV or just say hi."}));
  const row = el("div",{class:"actions"});
  const b1 = extLink(SITE.links.book,"Book a call"); b1.className="btn btn-primary"; row.appendChild(b1);
  if(SITE.resume){
    const r = el("a",{class:"btn btn-secondary",href:SITE.resume,text:"Download CV"});
    r.setAttribute("target","_blank"); r.setAttribute("rel","noopener noreferrer");
    row.appendChild(r);
  }
  c.appendChild(row);
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
  const mailBtn = el("button",{class:"icon-link",type:"button"});
  mailBtn.setAttribute("aria-label","Copy email address to clipboard");
  mailBtn.setAttribute("title","Copy email address");
  /* Inline (not img) so stroke inherits .icon-link color in both themes. Swap this block to change providers. */
  mailBtn.insertAdjacentHTML("afterbegin",'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6L22 7"/></svg>');
  mailBtn.addEventListener("click", copyEmail);
  icons.appendChild(mailBtn);
  c.appendChild(icons);
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

/* ---------- Delight: count-up only (tilt, spotlight, orb canvas cut) ---------- */
(function(){
  try{ console.log("%cAgents that tell the truth. - BH", "color:#1487FA;font-weight:bold"); }catch(e){}
  const mqCalm = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const calm = !!(mqCalm && mqCalm.matches);
  const canRAF = !!window.requestAnimationFrame;

  /* network backdrop: element kept dormant, no animation loop (2026 cut) */
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
})();
