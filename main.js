"use strict";
(function(){
const SITE = window.SITE || {};
/* Availability state lives top: hero profile IIFE builds the panel before later consts initialize. */
const PRESETS = [
  ["Asia/Kolkata","IST · Bangalore"],
  ["Asia/Dubai","GST · Dubai"],
  ["Asia/Riyadh","AST · Riyadh"],
  ["UTC","UTC"],
  ["Europe/London","London"],
  ["Europe/Berlin","Berlin"],
  ["America/New_York","New York"],
  ["America/Los_Angeles","Los Angeles"],
  ["Asia/Singapore","Singapore"],
  ["Australia/Sydney","Sydney"]
];
const avail = { tz: getVisitorTz() };
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
  moon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
  /* Brand marks: real Simple Icons paths, single-color fill=currentColor. No brand blues, no light/dark swap. */
  linkedin:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  github:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  telegram:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
  mail:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6L22 7"/></svg>'
};
let tileIndex = 0;
function markTile(node){ node.style.setProperty("--i", String(tileIndex++)); return node; }
document.querySelectorAll(".tile").forEach(markTile);

/* ---------- Profile ---------- */
(function(){
  const root = document.getElementById("tile-profile");
  if(!root) return;
  const wrap = el("div",{class:"profile profile-statement"});
  const main = el("div",{class:"profile-main"});
  const img = el("img",{class:"avatar",src:SITE.avatar||SITE.avatarFallback,alt:"Portrait of "+(SITE.name||"Babar Hashmi"),width:"168",height:"168",fetchpriority:"high",decoding:"async"});
  img.onerror = function(){ img.onerror=null; if(SITE.avatarFallback) img.src=SITE.avatarFallback; };
  const dock = el("div",{class:"avatar-dock hero-el"});
  dock.style.setProperty("--hi","0");
  dock.appendChild(img);
  const h1 = el("h1",{id:"h-name"});
  const nameBtn = el("button",{class:"name-btn",type:"button",text:SITE.name||"Babar Hashmi"});
  nameBtn.setAttribute("aria-expanded","false");
  nameBtn.setAttribute("aria-controls","name-def");
  h1.appendChild(nameBtn);
  h1.insertAdjacentHTML("beforeend",'<svg class="name-squiggle" aria-hidden="true" height="7" viewBox="0 0 120 7" preserveAspectRatio="none"><path d="M2 5 Q 30 1 60 4 T 118 3" pathLength="1"/></svg>');
  const ndef = el("span",{class:"name-def",id:"name-def",role:"note"});
  ndef.hidden = true;
  ndef.appendChild(el("span",{class:"nd-head",text:"Babar Hashmi"}));
  ndef.appendChild(el("span",{class:"nd-say",text:"/baabar haashmi/"}));
  const ndUrdu = el("span",{class:"nd-dev",text:"بابر ہاشمی"});
  ndUrdu.setAttribute("lang","ur");
  ndef.appendChild(ndUrdu);
  ndef.appendChild(el("span",{class:"nd-body",text:"Babar means tiger in Chagatai Turkic."}));
  h1.appendChild(ndef);
  nameBtn.addEventListener("click", function(){
    const open = ndef.hidden;
    ndef.hidden = !open;
    nameBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", function(e){
    if(!ndef.hidden && !h1.contains(e.target)){ ndef.hidden = true; nameBtn.setAttribute("aria-expanded","false"); }
  });
  document.addEventListener("keydown", function(e){
    if(e.key==="Escape" && !ndef.hidden){ ndef.hidden = true; nameBtn.setAttribute("aria-expanded","false"); nameBtn.focus(); }
  });
  const title = el("p",{class:"title",text:SITE.title||""});
  const meta = el("div",{class:"meta-row"});
  meta.insertAdjacentHTML("afterbegin", ICONS.pin);
  meta.appendChild(document.createTextNode((SITE.location||"") + ", " + (SITE.relocation||"")));
  meta.appendChild(document.createTextNode(" - "));
  meta.appendChild(el("time",{class:"meta-ist",datetime:"",text:""}));
  const badge = el("div",{class:"badge",id:"avail-badge"});
  const dot = el("span",{class:"dot","aria-hidden":"true"});
  badge.appendChild(dot);
  badge.appendChild(document.createTextNode(SITE.availability||"Available remote - globally"));
  const bio = el("p",{class:"bio",text:SITE.bio||""});
  const actions = el("div",{class:"actions"});
  const book = extLink(SITE.links.book,"Book a call"); book.className="btn btn-primary";
  book.insertAdjacentHTML("beforeend",'<span class="btn-glyph" aria-hidden="true">↗</span>');
  actions.appendChild(book);
  const work = el("a",{class:"btn btn-secondary",href:"#work-heading",text:"View work"});
  work.insertAdjacentHTML("beforeend",'<span class="btn-glyph" aria-hidden="true">↓</span>');
  actions.appendChild(work);
  [h1,title,meta,badge,bio,actions].forEach((n,i)=>{ n.classList.add("hero-el"); n.style.setProperty("--hi",String(i+1)); });
  main.append(h1,title,meta,badge,bio,actions);
  wrap.append(main);
  const grid = el("div",{class:"hero-grid"});
  grid.append(dock,wrap);
  grid.appendChild(buildAvailPanel());
  root.appendChild(grid);
})();

/* ---------- Avatar spring drag (yuvich pattern, single toy, transform-only) ---------- */
(function(){
  const dock = document.querySelector ? document.querySelector(".avatar-dock") : null;
  if(!dock || !dock.dataset || !dock.style || !dock.addEventListener || dock.dataset.dragInit) return;
  dock.dataset.dragInit = "1";
  const calm = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  const W = 2*Math.sqrt(60)*.62;
  let sx=0, sy=0, vx=0, vy=0, raf=0, dragging=false, moved=false, lx=0, ly=0, lt=0, px=0, py=0;
  function paint(x,y){ dock.style.setProperty("--dx",x+"px"); dock.style.setProperty("--dy",y+"px"); }
  function cur(){ return [parseFloat(dock.style.getPropertyValue("--dx"))||0, parseFloat(dock.style.getPropertyValue("--dy"))||0]; }
  function springHome(){
    if(calm){ paint(0,0); return; }
    let [x,y] = cur();
    let last = performance.now();
    cancelAnimationFrame(raf);
    (function step(t){
      const dt = Math.min(.032,(t-last)/1e3); last = t;
      vx += (-60*x - W*vx)*dt; vy += (-60*y - W*vy)*dt;
      x += vx*dt; y += vy*dt; paint(x,y);
      if(Math.hypot(x,y)>.3 || Math.hypot(vx,vy)>2) raf = requestAnimationFrame(step);
      else paint(0,0);
    })(last);
  }
  dock.addEventListener("pointerdown", function(e){
    if(e.pointerType==="mouse" && e.button!==0) return;
    cancelAnimationFrame(raf);
    dragging = true; moved = false;
    sx = lx = px = e.clientX; sy = ly = py = e.clientY; lt = performance.now();
    vx = vy = 0;
    try{ dock.setPointerCapture(e.pointerId); }catch(err){}
    dock.classList.add("dragging");
  });
  dock.addEventListener("pointermove", function(e){
    if(!dragging) return;
    let nx = e.clientX - sx, ny = e.clientY - sy;
    nx = Math.max(-80, Math.min(80, nx)); ny = Math.max(-60, Math.min(60, ny));
    if(Math.abs(e.clientX-sx)>4 || Math.abs(e.clientY-sy)>4) moved = true;
    const now = performance.now(), dt = Math.max(.001,(now-lt)/1e3);
    vx = vx*.6 + ((e.clientX-px)/dt)*.4; vy = vy*.6 + ((e.clientY-py)/dt)*.4;
    px = e.clientX; py = e.clientY; lt = now;
    paint(nx,ny);
  });
  function up(){ if(!dragging) return; dragging = false; dock.classList.remove("dragging"); vx = Math.max(-2500,Math.min(2500,vx)); vy = Math.max(-2500,Math.min(2500,vy)); springHome(); }
  dock.addEventListener("pointerup", up);
  dock.addEventListener("pointercancel", up);
})();

/* ---------- NOW ---------- */
(function(){
  const root = document.getElementById("tile-now");
  root.appendChild(el("h2",{class:"tile-title",id:"h-now",text:"Now"}));
  root.appendChild(el("p",{text:SITE.now||""}));
  root.lastChild.style.cssText = "font-size:17px;font-weight:500;margin:0";
})();

/* ---------- Availability: visitor tz vs IST comparator (hero panel) ---------- */
const IST_TZ = "Asia/Kolkata";
function tzCity(tz){ const p = String(tz).split("/"); return p.length>1 ? p[1].replace(/_/g," ") : String(tz); }
function validTz(tz){ try{ new Intl.DateTimeFormat("en",{timeZone:tz}); return true; }catch(e){ return false; } }
function getVisitorTz(){
  try{
    const saved = localStorage.getItem("visitor_tz");
    if(saved && validTz(saved)) return saved;
  }catch(e){}
  try{
    const d = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(d && validTz(d)) return d;
  }catch(e){}
  return "Asia/Dubai";
}
function tzFmt(tz){
  return {
    time:new Intl.DateTimeFormat("en-GB",{timeZone:tz,hour:"2-digit",minute:"2-digit",hour12:false,hourCycle:"h23"}),
    full:new Intl.DateTimeFormat("en-GB",{timeZone:tz,weekday:"short",hour:"numeric",minute:"2-digit",hour12:false}),
    hour:new Intl.DateTimeFormat("en-GB",{timeZone:tz,hour:"numeric",hour12:false,hourCycle:"h23"})
  };
}
function tzHour(tz,now){ try{ return parseInt(tzFmt(tz).hour.format(now),10); }catch(e){ return 12; } }
function buildAvailPanel(){
  const aside = el("aside",{class:"hero-avail hero-el","aria-label":"Availability across timezones"});
  aside.style.setProperty("--hi","7");
  aside.appendChild(el("p",{class:"avail-eyebrow",text:"Availability"}));
  const verdict = el("p",{class:"avail-verdict",role:"status"});
  verdict.appendChild(el("span",{class:"dot","aria-hidden":"true"}));
  verdict.appendChild(el("span",{class:"avail-verdict-text",text:"Checking hours..."}));
  aside.appendChild(verdict);
  const rows = el("div",{class:"avail-rows"});
  const istRow = el("div",{class:"avail-row"});
  const istT = el("time",{class:"avail-time avail-ist",datetime:""});
  istRow.appendChild(istT);
  istRow.appendChild(el("div",{class:"avail-label",text:"Bangalore · IST"}));
  const vRow = el("div",{class:"avail-row"});
  const vT = el("time",{class:"avail-time",datetime:""});
  vRow.appendChild(vT);
  const vLabel = el("div",{class:"avail-label"});
  vLabel.appendChild(el("span",{class:"avail-city",text:"Your time"}));
  vLabel.appendChild(document.createTextNode(" "));
  const change = el("button",{class:"avail-change",type:"button",text:"change"});
  change.setAttribute("aria-expanded","false");
  vLabel.appendChild(change);
  vRow.appendChild(vLabel);
  rows.appendChild(istRow); rows.appendChild(vRow);
  aside.appendChild(rows);
  const sel = el("select",{class:"avail-select","aria-label":"Choose your timezone"});
  sel.hidden = true;
  const presetTz = PRESETS.map(p=>p[0]);
  PRESETS.forEach(([tz,label])=>{
    const o = el("option",{value:tz,text:label});
    sel.appendChild(o);
  });
  try{
    const all = Intl.supportedValuesOf("timeZone").filter(t=>presetTz.indexOf(t)<0);
    all.forEach(tz=>{
      const o = el("option",{value:tz,text:tzCity(tz)});
      sel.appendChild(o);
    });
  }catch(e){}
  sel.value = avail.tz;
  if(sel.selectedIndex<0 && sel.options.length) sel.selectedIndex = 0;
  change.addEventListener("click", function(){
    sel.hidden = !sel.hidden;
    change.setAttribute("aria-expanded", String(!sel.hidden));
    if(!sel.hidden) sel.focus();
  });
  sel.addEventListener("change", function(){
    if(!validTz(sel.value)) return;
    avail.tz = sel.value;
    try{ localStorage.setItem("visitor_tz", avail.tz); }catch(e){}
    sel.hidden = true;
    change.setAttribute("aria-expanded","false");
    tickAvail();
  });
  aside.appendChild(sel);
  aside.appendChild(el("p",{class:"avail-foot",text:"Working hours 10:00-19:00 IST - replies within a day outside shared hours. IST wall-clock, no tracking."}));
  return aside;
}
function tickAvail(){
  const now = new Date();
  const istT = document.querySelector(".hero-avail .avail-ist");
  const vT = document.querySelector(".hero-avail .avail-row:nth-child(2) .avail-time");
  try{
    const f = tzFmt(IST_TZ);
    if(istT){ istT.textContent = f.time.format(now); istT.setAttribute("datetime", now.toISOString()); istT.setAttribute("aria-label", f.full.format(now)+" India Standard Time"); }
    const mIst = document.querySelector(".meta-ist");
    if(mIst){ mIst.textContent = f.time.format(now) + " IST"; mIst.setAttribute("datetime", now.toISOString()); }
  }catch(e){}
  try{
    const f = tzFmt(avail.tz);
    if(vT){ vT.textContent = f.time.format(now); vT.setAttribute("datetime", now.toISOString()); vT.setAttribute("aria-label", f.full.format(now)+" your time"); }
  }catch(e){}
  const city = document.querySelector(".hero-avail .avail-city");
  if(city) city.textContent = "Your time · " + tzCity(avail.tz);
  const sel = document.querySelector(".hero-avail .avail-select");
  if(sel && validTz(avail.tz)) sel.value = avail.tz;
  const istH = tzHour(IST_TZ, now), vH = tzHour(avail.tz, now);
  let sameTz = false;
  try{ sameTz = tzFmt(IST_TZ).time.format(now) === tzFmt(avail.tz).time.format(now); }catch(e){}
  const vRow = document.querySelector(".hero-avail .avail-row:nth-child(2)");
  if(vRow) vRow.hidden = sameTz;
  const overlap = istH>=10 && istH<19 && vH>=9 && vH<18;
  const verdict = document.querySelector(".hero-avail .avail-verdict");
  const vt = document.querySelector(".hero-avail .avail-verdict-text");
  if(verdict && vt){
    if(sameTz){
      verdict.classList.remove("off");
      vt.textContent = "Same timezone - talk anytime 10-19 IST";
    }else{
      verdict.classList.toggle("off", !overlap);
      vt.textContent = overlap ? "Overlap now - good time to talk" : "Outside shared hours - replies within a day";
    }
  }
  const wh = SITE.workingHoursIST || [10,19];
  const badge = document.getElementById("avail-badge");
  if(badge){
    const inside = istH>=wh[0] && istH<wh[1];
    badge.classList.toggle("off", !inside);
    badge.title = inside ? "Within IST working hours" : "Outside IST working hours - async replies";
  }
}
tickAvail();
(function scheduleAvail(){
  const delay = 60000 - (Date.now()%60000);
  setTimeout(function(){ tickAvail(); setInterval(function(){ if(!document.hidden) tickAvail(); },60000); }, delay);
})();
document.addEventListener("visibilitychange", function(){ if(!document.hidden) tickAvail(); });

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
/* Dots use full-range tints; names use darker text-safe twins (all >=4.5:1 on paper). */
const LANG_TINTS = ["#2a2722","#6b675f","#b3b3b3"];
const LANG_TEXT = ["#2a2722","#57534c","#6b675f"];
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
    const av = el("img",{src:d.avatar||SITE.githubFallback.avatar,alt:"GitHub avatar of ibabarhashmi",width:"40",height:"40",decoding:"async",loading:"lazy"});
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
    Object.entries(langs).sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([name,count],i)=>{
      const tint = LANG_TINTS[i]||LANG_TINTS[LANG_TINTS.length-1];
      const tcol = LANG_TEXT[i]||LANG_TEXT[LANG_TEXT.length-1];
      const seg = el("i",{});
      seg.style.width = (count/total*100)+"%";
      seg.style.background = tint;
      bar.appendChild(seg);
      const item = el("span",{});
      item.style.color = tcol;
      const dotS = el("s",{});
      dotS.style.background = tint;
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
  head.innerHTML = "";
  head.appendChild(el("h2",{class:"work-title",id:"work-title",text:"Selected work"}));
  const slot = document.getElementById("projects-slot");
  const filters = [["all","All"],["agents","Agents"],["security","Security"],["cv","Applied CV"]];
  const row = el("div",{class:"filter-row",role:"group","aria-label":"Filter projects"});
  const counts = {all:(SITE.projects||[]).length,agents:0,security:0,cv:0};
  (SITE.projects||[]).forEach(p=>{ if(counts[p.cat]!=null) counts[p.cat]++; });
  filters.forEach(([v,label],i)=>{
    const b = el("button",{class:"filter-btn",type:"button",text:label+" ("+counts[v]+")"});
    b.dataset.filter = v;
    b.setAttribute("aria-pressed", v==="all" ? "true" : "false");
    if(v==="all") b.classList.add("on");
    b.addEventListener("click", function(){
      row.querySelectorAll(".filter-btn").forEach(x=>{ x.classList.remove("on"); x.setAttribute("aria-pressed","false"); });
      b.classList.add("on"); b.setAttribute("aria-pressed","true");
      slot.querySelectorAll(".proj").forEach(c=>{
        const show = v==="all" || c.dataset.cat===v;
        c.hidden = !show;
      });
    });
    row.appendChild(b);
  });
  head.appendChild(row);
  (SITE.projects||[]).forEach((p)=>{
    let card;
    const cls = p.featured ? "tile span-4 proj proj-feat tile-linked" : "tile span-2 proj tile-linked";
    if(p.repo){
      card = el("a",{class:cls,href:p.repo,target:"_blank",rel:"noopener noreferrer"});
      card.setAttribute("aria-label","Open "+p.name+" repository");
    }else{
      card = el("article",{class:cls});
    }
    card.dataset.cat = p.cat||"all";
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
  root.appendChild(el("p",{class:"stack-lede",text:"PyTorch and fine-tuned LLMs up front, AWS and vLLM behind them, TypeScript holding the SDK together."}));
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
  const b1 = extLink(SITE.links.book,"Book a call"); b1.className="btn btn-primary"; b1.insertAdjacentHTML("beforeend",'<span class="btn-glyph" aria-hidden="true">↗</span>'); row.appendChild(b1);
  if(SITE.resume){
    const r = el("a",{class:"btn btn-secondary",href:SITE.resume,text:"Download CV"});
    r.setAttribute("target","_blank"); r.setAttribute("rel","noopener noreferrer");
    row.appendChild(r);
  }
  c.appendChild(row);
  const icons = el("div",{class:"icon-row"});
  function brandSvgLink(href,label,svg){
    /* Plain anchor on purpose: no extLink vh span, so copy-paste stays clean. Name lives in aria-label + title. Inline SVG inherits currentColor, no img swap. */
    const a = el("a",{href:href,target:"_blank",rel:"noopener noreferrer"});
    a.className="icon-link";
    a.setAttribute("aria-label",label);
    a.setAttribute("title",label);
    a.insertAdjacentHTML("afterbegin",svg);
    return a;
  }
  if(SITE.links.linkedin) icons.appendChild(brandSvgLink(SITE.links.linkedin,"LinkedIn profile",ICONS.linkedin));
  if(SITE.links.github) icons.appendChild(brandSvgLink(SITE.links.github,"GitHub profile",ICONS.github));
  if(SITE.links.telegram) icons.appendChild(brandSvgLink(SITE.links.telegram,"Telegram chat",ICONS.telegram));
  if(SITE.links.x) icons.appendChild(brandSvgLink(SITE.links.x,"X profile",ICONS.ext));
  const mailBtn = el("button",{class:"icon-link",type:"button"});
  mailBtn.setAttribute("aria-label","Copy email address to clipboard");
  mailBtn.setAttribute("title","Copy email address");
  mailBtn.insertAdjacentHTML("afterbegin",ICONS.mail);
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
  try{ console.log("%cAgents that tell the truth. - BH", "color:#2a2722;font-weight:bold"); }catch(e){}
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
    /* Safety: if IO never fires (hidden tab, headless), show content. */
    setTimeout(function(){ tiles.forEach(t=>t.classList.add("in")); }, 2500);
  }else{
    tiles.forEach(t=>t.classList.add("in"));
  }
})();
})();
