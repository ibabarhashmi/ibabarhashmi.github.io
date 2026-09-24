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
  const img = el("img",{class:"avatar",src:SITE.avatar||SITE.avatarFallback,alt:"Portrait of "+(SITE.name||"Babar Hashmi"),width:"96",height:"96"});
  img.onerror = function(){ img.onerror=null; if(SITE.avatarFallback) img.src=SITE.avatarFallback; };
  const right = el("div",{});
  const h1 = el("h1",{id:"h-name",text:SITE.name||"Babar Hashmi"});
  const title = el("p",{class:"title",text:SITE.title||""});
  const meta = el("div",{class:"meta-row"});
  meta.insertAdjacentHTML("afterbegin", ICONS.pin);
  meta.appendChild(document.createTextNode((SITE.location||"") + " · " + (SITE.relocation||"")));
  const badge = el("div",{class:"badge",id:"avail-badge"});
  const dot = el("span",{class:"dot","aria-hidden":"true"});
  badge.appendChild(dot);
  badge.appendChild(document.createTextNode(SITE.availability||"Available remote — globally"));
  const bio = el("p",{class:"bio",text:SITE.bio||""});
  const chips = el("div",{class:"chips"});
  const all = [];
  Object.values(SITE.stack||{}).forEach(arr=>arr.forEach(s=>all.push(s)));
  all.slice(0,8).forEach(s=>chips.appendChild(el("span",{class:"chip",text:s})));
  const actions = el("div",{class:"actions"});
  const book = extLink(SITE.links.book,"Book a call"); book.className="btn btn-primary";
  actions.appendChild(book);
  const tg = extLink(SITE.links.telegram,"Telegram"); tg.className="btn btn-secondary";
  actions.appendChild(tg);
  const copyBtn = el("button",{class:"btn btn-secondary",type:"button",text:"Copy email"});
  copyBtn.setAttribute("aria-label","Copy email address");
  copyBtn.addEventListener("click", copyEmail);
  actions.appendChild(copyBtn);
  const li = extLink(SITE.links.linkedin,"LinkedIn"); li.className="btn btn-secondary";
  actions.appendChild(li);
  const gh = extLink(SITE.links.github,"GitHub"); gh.className="btn btn-secondary";
  actions.appendChild(gh);
  if(SITE.resume){
    const r = el("a",{class:"btn btn-secondary",href:SITE.resume,text:"Résumé"});
    r.setAttribute("target","_blank"); r.setAttribute("rel","noopener noreferrer");
    actions.appendChild(r);
  }
  if(SITE.phone){
    const p = el("a",{class:"btn btn-secondary",href:"tel:"+SITE.phone.replace(/\s/g,""),text:"Phone"});
    actions.appendChild(p);
  }
  right.append(h1,title,meta,badge,bio,chips,actions);
  wrap.append(img,right);
  root.appendChild(wrap);
})();

/* ---------- NOW ---------- */
(function(){
  const root = document.getElementById("tile-now");
  root.appendChild(el("h2",{class:"eyebrow",id:"h-now",text:"NOW"}));
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
  root.appendChild(el("h2",{class:"eyebrow",id:"h-time",text:"LOCAL TIME"}));
  root.setAttribute("aria-live","off");
  ZONES.forEach(z=>{
    const row = el("div",{class:"clock-row"});
    row.setAttribute("data-clock", z.tz);
    const left = el("div",{class:"clock-left"});
    left.appendChild(el("span",{class:"clock-label",text:z.label+" · "+z.city}));
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
  const foot = el("p",{class:"tile-foot",text:"Working hours 10:00–19:00 IST · 08:30–17:30 Dubai · 07:30–16:30 Riyadh"});
  root.appendChild(foot);
})();
function tick(){
  const now = new Date();
  ZONES.forEach(z=>{
    const node = document.querySelector('[data-clock="'+z.tz+'"]');
    if(!node) return;
    const t = node.querySelector(".clock-time");
    const d = node.querySelector(".day");
    if(t) t.textContent = fmt[z.tz].time.format(now);
    if(d) d.textContent = fmt[z.tz].day.format(now) + " · " + z.offset;
    let h = 12;
    try{ h = parseInt(fmt[z.tz].hour.format(now),10); }catch(e){}
    const day = (h>=7 && h<19);
    node.dataset.daypart = day ? "day" : "night";
    const ic = node.querySelector(".clock-icon");
    if(ic) ic.innerHTML = day ? ICONS.sun : ICONS.moon;
  });
  // availability dot
  let istH = 12;
  try{ istH = parseInt(fmt["Asia/Kolkata"].hour.format(now),10); }catch(e){}
  const wh = SITE.workingHoursIST || [10,19];
  const badge = document.getElementById("avail-badge");
  if(badge){
    const inside = istH>=wh[0] && istH<wh[1];
    badge.classList.toggle("off", !inside);
    badge.title = inside ? "Within IST working hours" : "Outside IST working hours — async replies";
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
  const KEY="gh_cache_v1", TTL=6*3600*1000;
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
    const repos = (await r.json()).filter(x=>!x.fork);
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
  root.appendChild(el("h2",{class:"eyebrow",id:"h-github",text:"GITHUB"}));
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
      const meta = [repo.language, repo.stars!=null?("★ "+repo.stars):null].filter(Boolean).join(" · ");
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
  root.appendChild(el("h2",{class:"eyebrow",id:"h-exp",text:"EXPERIENCE"}));
  const tl = el("div",{class:"timeline"});
  (SITE.experience||[]).forEach(job=>{
    const item = el("div",{class:"tl-item"});
    const top = el("div",{class:"tl-top"});
    top.appendChild(el("h3",{class:"tl-role",text:job.role}));
    top.appendChild(el("span",{class:"tl-dates",text:job.start+" – "+job.end}));
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
  head.textContent = "SELECTED WORK";
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
    card.appendChild(el("h2",{class:"eyebrow",text:p.tag||"PROJECT"}));
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
  root.appendChild(el("h2",{class:"eyebrow",id:"h-stack",text:"STACK"}));
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
  root.appendChild(el("h2",{class:"eyebrow",id:"h-certs",text:"CERTIFICATIONS"}));
  (SITE.certifications||[]).forEach(c=>{
    const r = el("div",{class:"cert-row"});
    r.appendChild(el("p",{class:"cert-name",text:c.name}));
    r.appendChild(el("p",{class:"cert-meta",text:c.issuer+" · "+c.date}));
    root.appendChild(r);
  });
})();

/* ---------- Domains / Vibe / Contact ---------- */
(function(){
  const d = document.getElementById("tile-domains");
  d.appendChild(el("h2",{class:"eyebrow",id:"h-domains",text:"DOMAINS"}));
  const chips = el("div",{class:"chips"});
  chips.style.margin = "0";
  (SITE.domains||[]).forEach(x=>chips.appendChild(el("span",{class:"chip",text:x})));
  d.appendChild(chips);

  const v = document.getElementById("tile-vibe");
  v.appendChild(el("h2",{class:"eyebrow",id:"h-vibe",text:"VIBE"}));
  v.appendChild(el("p",{class:"vibe-text",text:SITE.vibe||""}));

  const c = document.getElementById("tile-contact");
  c.appendChild(el("h2",{class:"eyebrow",id:"h-contact",text:"CONTACT"}));
  c.appendChild(el("p",{class:"contact-title",text:"Let's build something."}));
  c.appendChild(el("p",{text:"Available remote — globally. Based in Bangalore, open to relocation. CV on request — grab the PDF or just say hi."}));
  const row = el("div",{class:"actions"});
  const b1 = extLink(SITE.links.book,"Book a call"); b1.className="btn btn-primary"; row.appendChild(b1);
  const b2 = extLink(SITE.links.telegram,"Telegram"); b2.className="btn btn-secondary"; row.appendChild(b2);
  const b3 = el("button",{class:"btn btn-secondary",type:"button",text:"Copy email"});
  b3.addEventListener("click", copyEmail);
  row.appendChild(b3);
  if(SITE.resume){
    const r = el("a",{class:"btn btn-secondary",href:SITE.resume,text:"Download CV"});
    r.setAttribute("target","_blank"); r.setAttribute("rel","noopener noreferrer");
    row.appendChild(r);
  }
  c.appendChild(row);
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
