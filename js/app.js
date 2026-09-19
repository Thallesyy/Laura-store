/* =========================================================
   APP DA LOJA — não precisa mexer aqui para trocar produtos
   (isso fica em js/config.js)
   ========================================================= */
(() => {
"use strict";

/* ---------- utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const digits = s => String(s || "").replace(/\D/g, "");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const DUR = 7; // segundos para uma volta completa de 360°

const store = {
  get(k, def) { try { const v = localStorage.getItem("loja:" + k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set(k, v) { try { localStorage.setItem("loja:" + k, JSON.stringify(v)); } catch {} },
};

const byId = id => PRODUTOS.find(p => p.id === id);

const state = {
  tab: "inicio",
  cat: "Destaques",
  busca: "",
  buscaCat: "Todos",
  cart: store.get("cart", []).filter(i => byId(i.id)),
  orders: store.get("orders", []),
  favs: store.get("favs", []),
  user: store.get("user", {}),
  seguindo: store.get("seguindo", false),
  theme: store.get("theme", "auto"),
};

const waLink = msg => `https://wa.me/${digits(LOJA.contato.whatsapp)}?text=${encodeURIComponent(msg)}`;

/* ---------- ícones ---------- */
const ICON = {
  verified: '<svg viewBox="0 0 22 22" aria-label="Conta verificada"><path d="M20.4 11c0-1.3-.8-2.4-2-3 .4-1.3.2-2.7-.8-3.6-1-1-2.4-1.2-3.6-.8-.6-1.2-1.7-2-3-2s-2.4.8-3 2c-1.3-.4-2.7-.2-3.6.8-1 1-1.2 2.4-.8 3.6-1.2.6-2 1.7-2 3s.8 2.4 2 3c-.4 1.3-.2 2.7.8 3.6 1 1 2.4 1.2 3.6.8.6 1.2 1.7 2 3 2s2.4-.8 3-2c1.3.4 2.7.2 3.6-.8 1-1 1.2-2.4.8-3.6 1.2-.6 2-1.7 2-3zm-10.7 3.9-3.4-3.4 1.3-1.3 2.1 2.1 4.4-4.8 1.4 1.3-5.8 6.1z"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M7.4 13l5.3 5.3-1.4 1.4L3.6 12l7.7-7.7 1.4 1.4L7.4 11H21v2H7.4z"/></svg>',
  share: '<svg viewBox="0 0 24 24"><path d="M12 2.6l5.7 5.7-1.4 1.4L13 6.4V16h-2V6.4L7.7 9.7 6.3 8.3 12 2.6zM21 15v3.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5V15h2v3.5c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V15h2z"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M16.7 3.5c-1.9 0-3.6 1-4.7 2.5-1.1-1.5-2.8-2.5-4.7-2.5C4.4 3.5 2 6 2 9.1c0 5.6 8.4 10.9 9.5 11.6l.5.3.5-.3C13.6 20 22 14.7 22 9.1 22 6 19.6 3.5 16.7 3.5zM12 18.7C9.6 17.1 4 13 4 9.1 4 7.1 5.5 5.5 7.3 5.5c1.7 0 3.1 1.2 3.7 2.9h2c.6-1.7 2-2.9 3.7-2.9C18.5 5.5 20 7.1 20 9.1c0 3.9-5.6 8-8 9.6z"/></svg>',
  heartFill: '<svg viewBox="0 0 24 24"><path d="M16.7 3.5c-1.9 0-3.6 1-4.7 2.5-1.1-1.5-2.8-2.5-4.7-2.5C4.4 3.5 2 6 2 9.1c0 5.6 8.4 10.9 9.5 11.6l.5.3.5-.3C13.6 20 22 14.7 22 9.1 22 6 19.6 3.5 16.7 3.5z"/></svg>',
  rotate: '<svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 0 1 7.7 5.9l1.8-1 1 1.7-4.3 2.5-2.5-4.3 1.7-1 .6 1A6 6 0 0 0 6 12H4a8 8 0 0 1 8-8zm8 8a8 8 0 0 1-15.7 2.1l-1.8 1-1-1.7 4.3-2.5 2.5 4.3-1.7 1-.6-1A6 6 0 0 0 18 12h2z"/></svg>',
  hand: '<svg viewBox="0 0 24 24"><path d="M4 12l4-4v3h8V8l4 4-4 4v-3H8v3z"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>',
  minus: '<svg viewBox="0 0 24 24"><path d="M5 11h14v2H5z"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M9 3h6l1 2h4v2H4V5h4l1-2zM6 8h12l-1 13H7L6 8zm4 2v9h1.5v-9H10zm2.5 0v9H14v-9h-1.5z"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24"><path d="M9.3 5.3 16 12l-6.7 6.7-1.4-1.4 5.3-5.3-5.3-5.3z"/></svg>',
  zap: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 5 5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-2.9-.4-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.7 4.2 3.7 1.6.7 2.2.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3z"/></svg>',
  insta: '<svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9z"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 3.2V17h16V8.2l-8 5.3-8-5.3zM5.3 7 12 11.4 18.7 7H5.3z"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M6.6 2.5 9.7 5.6 8 8.4a13 13 0 0 0 7.6 7.6l2.8-1.7 3.1 3.1-2.2 3.3c-.3.4-.8.6-1.3.5C9.9 19.8 4.2 14.1 2.8 6c-.1-.5.1-1 .5-1.3l3.3-2.2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 2a7.5 7.5 0 0 1 7.5 7.5c0 5.4-6.6 11.6-6.9 11.9L12 22l-.6-.6c-.3-.3-6.9-6.5-6.9-11.9A7.5 7.5 0 0 1 12 2zm0 2a5.5 5.5 0 0 0-5.5 5.5c0 3.5 4 7.8 5.5 9.4 1.5-1.6 5.5-5.9 5.5-9.4A5.5 5.5 0 0 0 12 4zm0 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm1 3v4.6l3.2 3.2-1.4 1.4L11 12.4V7h2z"/></svg>',
  user: '<svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 10c4.4 0 8 2.7 8 6v2H4v-2c0-3.3 3.6-6 8-6zm0 2c-3.1 0-5.6 1.6-6 4h12c-.4-2.4-2.9-4-6-4z"/></svg>',
  receipt: '<svg viewBox="0 0 24 24"><path d="M5 2h14a1 1 0 0 1 1 1v19l-3-2-2.5 2L12 20l-2.5 2L7 20l-3 2V3a1 1 0 0 1 1-1zm1 2v14.3l1-.7 2.5 2 2.5-2 2.5 2 2.5-2 1 .7V4H6zm2 3h8v2H8V7zm0 4h8v2H8v-2z"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M11.4 2.1a8 8 0 1 0 10.5 10.5A9.5 9.5 0 0 1 11.4 2.1zM9.1 4.6a11.5 11.5 0 0 0 10.3 10.3A8 8 0 1 1 9.1 4.6z"/></svg>',
  pinned: '<svg viewBox="0 0 24 24"><path d="M7 4.5C7 3.1 8.1 2 9.5 2h5C15.9 2 17 3.1 17 4.5v5.3l1.9 3.8.1.4v1.5h-6v6.4l-1 1.5-1-1.5V15.5H5V14l.1-.4L7 9.8V4.5z"/></svg>',
};

const toast = (() => {
  let t;
  return msg => {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(t);
    t = setTimeout(() => el.classList.remove("show"), 2200);
  };
})();

/* ---------- cabeçalho estilo X ---------- */
function setAvatar(el) {
  if (LOJA.avatar) { el.style.backgroundImage = `url("${LOJA.avatar}")`; el.textContent = ""; }
  else el.textContent = LOJA.nome.trim().charAt(0).toUpperCase();
}

function renderHeader() {
  document.title = LOJA.nome;
  if (LOJA.banner) $("#banner").style.backgroundImage = `url("${LOJA.banner}")`;
  setAvatar($("#avatar"));
  $("#lojaNome").textContent = LOJA.nome;
  $("#selo").innerHTML = LOJA.verificado ? ICON.verified : "";
  $("#lojaUser").textContent = LOJA.usuario;
  $("#lojaBio").textContent = LOJA.bio;
  $("#lojaCidade").textContent = LOJA.cidade;
  const insta = $("#lojaInsta");
  insta.textContent = "instagram.com/" + LOJA.contato.instagram;
  insta.href = "https://instagram.com/" + LOJA.contato.instagram;
  $("#lojaDesde").textContent = LOJA.desde;
  $("#lojaNumeros").innerHTML =
    `<span><b>${PRODUTOS.length}</b> Produtos</span>` +
    LOJA.numeros.map(n => `<span><b>${esc(n.valor)}</b> ${esc(n.rotulo)}</span>`).join("");
  $("#topbarNome").textContent = LOJA.nome;
  $("#topbarSub").textContent = `${PRODUTOS.length} produtos`;
  $("#btnZap").href = waLink(`Olá, ${LOJA.nome}! Vim pelo site 😊`);
  updateSeguir();

  if (LOJA.fixado) {
    const av = LOJA.avatar ? `style="background-image:url('${esc(LOJA.avatar)}')">` : `>${esc(LOJA.nome.charAt(0))}`;
    $("#fixado").innerHTML = `
      <div class="post-pin">${ICON.pinned}Fixado</div>
      <article class="post">
        <div class="avatar" ${av}</div>
        <div>
          <div class="post-head"><b>${esc(LOJA.nome)}</b>${LOJA.verificado ? ICON.verified : ""}<span>${esc(LOJA.usuario)} · ${esc(LOJA.fixado.data)}</span></div>
          <p>${esc(LOJA.fixado.texto)}</p>
        </div>
      </article>`;
    $("#fixado").style.paddingTop = "12px";
  }
}

function updateSeguir() {
  const b = $("#btnSeguir");
  b.textContent = state.seguindo ? "Seguindo" : "Seguir";
  b.classList.toggle("on", state.seguindo);
}

/* ---------- cards e objeto 360° ---------- */
function priceHTML(p) {
  const off = p.precoAntigo ? Math.round((1 - p.preco / p.precoAntigo) * 100) : 0;
  return `<div class="price"><b>${brl(p.preco)}</b>${off ? `<s>${brl(p.precoAntigo)}</s><span class="off">-${off}%</span>` : ""}</div>`;
}

/* Várias camadas empilhadas em profundidade = objeto com "espessura" ao girar */
function objHTML(p, manual) {
  const inner = p.imagem ? `<img src="${esc(p.imagem)}" alt="" draggable="false">` : esc(p.emoji || "🛍️");
  const n = 9;
  let layers = "";
  for (let i = 0; i < n; i++) {
    const z = (i - (n - 1) / 2) * 0.6;
    const face = i === 0 || i === n - 1;
    layers += `<span class="layer${face ? "" : " inner"}" style="transform:translateZ(${z.toFixed(2)}cqw)">${inner}</span>`;
  }
  return `<div class="obj${manual ? " manual" : ""}">${layers}</div>`;
}

function stageHTML(p, { cls = "", badge = true, manual = false, hint = false } = {}) {
  const frames = p.fotos360 && p.fotos360.length > 1;
  const delay = -((p.id * 1.37) % DUR).toFixed(2);
  const tag = !badge ? "" :
    p.precoAntigo ? `<span class="tag">OFERTA</span>` :
    (p.tags || []).includes("novo") ? `<span class="tag novo">NOVO</span>` : "";
  return `
    <div class="stage ${cls}" data-pid="${p.id}" ${frames ? "data-frames" : ""} style="--c:${esc(p.cor || "#eee")};--dur:${DUR}s;--delay:${delay}s">
      ${badge ? `<span class="badge-360">${ICON.rotate}360°</span>` : ""}
      ${tag}
      <div class="float">
        ${frames
          ? `<div class="frames"><img src="${esc(p.fotos360[0])}" alt="${esc(p.nome)}" draggable="false"></div>`
          : objHTML(p, manual)}
      </div>
      <div class="shadow${manual || frames ? " manual" : ""}"></div>
      ${hint ? `<span class="detail-hint">${ICON.hand}Arraste para girar 360°</span>` : ""}
    </div>`;
}

function cardHTML(p, i) {
  return `
    <div class="card" role="button" tabindex="0" data-open="${p.id}" style="--i:${Math.min(i, 12)}" aria-label="${esc(p.nome)}, ${brl(p.preco)}">
      ${stageHTML(p)}
      <span class="card-name">${esc(p.nome)}</span>
      ${priceHTML(p)}
    </div>`;
}

function renderGrid(el, list) {
  el.innerHTML = list.map(cardHTML).join("");
  $$(".stage", el).forEach(watchStage);
}

/* Pausa o giro de quem está fora da tela (economiza bateria) */
const visibleFrames = new Set();
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.classList.toggle("paused", !e.isIntersecting);
    if (e.target.hasAttribute("data-frames")) {
      if (e.isIntersecting) { preloadFrames(byId(+e.target.dataset.pid)); visibleFrames.add(e.target); }
      else visibleFrames.delete(e.target);
    }
  });
}, { rootMargin: "80px" });

function watchStage(st) { io.observe(st); }

const preloaded = new Set();
function preloadFrames(p) {
  if (!p || preloaded.has(p.id)) return;
  preloaded.add(p.id);
  p.fotos360.forEach(src => { const im = new Image(); im.src = src; });
}

function setFrame(img, p, ang) {
  const n = p.fotos360.length;
  const a = ((ang % 360) + 360) % 360;
  const src = p.fotos360[Math.floor(a / 360 * n) % n];
  if (img.getAttribute("src") !== src) img.setAttribute("src", src);
}

/* ---------- abas da página inicial (estilo X) ---------- */
const TABS = ["Destaques", "Novidades", "Promoções", ...CATEGORIAS];

function filtroAba(cat) {
  const has = t => p => (p.tags || []).includes(t);
  let list;
  if (cat === "Destaques") list = PRODUTOS.filter(has("destaque"));
  else if (cat === "Novidades") list = PRODUTOS.filter(has("novo"));
  else if (cat === "Promoções") list = PRODUTOS.filter(p => p.precoAntigo || has("promo")(p));
  else list = PRODUTOS.filter(p => p.categoria === cat);
  return list;
}

function renderTabs() {
  $("#tabs").innerHTML = TABS
    .filter(t => filtroAba(t).length)
    .map(t => `<button class="${t === state.cat ? "active" : ""}" data-cat="${esc(t)}">${esc(t)}</button>`).join("");
}

function renderInicio() {
  const list = filtroAba(state.cat);
  renderGrid($("#gridInicio"), list.length ? list : PRODUTOS);
}

$("#tabs").addEventListener("click", e => {
  const b = e.target.closest("[data-cat]");
  if (!b || b.dataset.cat === state.cat) return;
  state.cat = b.dataset.cat;
  $$("#tabs button").forEach(x => x.classList.toggle("active", x === b));
  b.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  renderInicio();
  const top = $("#tabs").offsetTop - 53;
  if (scrollY > top) scrollTo({ top });
});

/* Barra do topo fica sólida ao passar do banner (igual ao X) */
function onScroll() {
  if (state.tab !== "inicio") return;
  $("#topbar").classList.toggle("solid", scrollY > $("#banner").offsetHeight - 53);
}
addEventListener("scroll", onScroll, { passive: true });

/* ---------- navegação de baixo (estilo iFood) ---------- */
const PAGES = ["inicio", "busca", "carrinho", "pedidos", "perfil"];
const scrollPos = {};
const renderers = {};

function go(tab, { focusSearch = false } = {}) {
  if (!PAGES.includes(tab)) tab = "inicio";
  const same = state.tab === tab;
  scrollPos[state.tab] = scrollY;
  state.tab = tab;
  $$(".page").forEach(p => { p.hidden = p.id !== "page-" + tab; });
  $$("#bottomNav [data-tab]").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  PAGES.forEach(p => document.body.classList.toggle("tab-" + p, p === tab));
  history.replaceState(history.state, "", "#" + tab);
  if (renderers[tab]) renderers[tab]();
  if (same) scrollTo({ top: 0, behavior: "smooth" });
  else scrollTo(0, scrollPos[tab] || 0);
  onScroll();
  if (focusSearch) $("#buscaInput").focus({ preventScroll: true });
}

/* ---------- janelas sobrepostas + botão voltar do celular ---------- */
const stack = [];

function openSheet(html, { onOpen, onClose } = {}) {
  const el = document.createElement("div");
  el.className = "sheet";
  el.innerHTML = `<div class="sheet-backdrop" data-close></div><div class="sheet-panel">${html}</div>`;
  $("#overlays").append(el);
  document.body.classList.add("locked");
  const entry = { el, onClose };
  stack.push(entry);
  history.pushState({ sheet: stack.length }, "");
  if (onOpen) onOpen(el);
  else defaultIn(el);
  return el;
}

function defaultIn(el) {
  el.querySelector(".sheet-backdrop").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
  el.querySelector(".sheet-panel").animate(
    [{ transform: "translateY(100%)" }, { transform: "none" }],
    { duration: reduceMotion ? 1 : 380, easing: "cubic-bezier(.2,.8,.2,1)" });
}

function defaultOut(el, done) {
  el.querySelector(".sheet-backdrop").animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" });
  el.querySelector(".sheet-panel").animate(
    [{ transform: "none" }, { transform: "translateY(100%)" }],
    { duration: reduceMotion ? 1 : 300, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" }).onfinish = done;
}

const closeSheet = () => history.back();

addEventListener("popstate", () => {
  const top = stack.pop();
  if (!top) return;
  const finish = () => {
    top.el.remove();
    if (!stack.length) document.body.classList.remove("locked");
  };
  if (top.onClose) top.onClose(top.el, finish);
  else defaultOut(top.el, finish);
});

/* ---------- visualizador 360° (arrastar para girar) ---------- */
let viewer = null;

function currentAngle(obj) {
  const t = getComputedStyle(obj).transform;
  if (!t || t === "none") return 0;
  const m = new DOMMatrix(t);
  return Math.atan2(-m.m13, m.m11) * 180 / Math.PI;
}

function makeViewer(stage, p, startAng = 0) {
  const obj = $(".obj", stage), shadow = $(".shadow", stage), img = $(".frames img", stage), hint = $(".detail-hint", stage);
  const AUTO = 360 / DUR;
  let ang = startAng, vel = reduceMotion ? 0 : AUTO, dir = 1;
  let dragging = false, lastX = 0, lastT = 0, resumeAt = 0, moved = false;

  const apply = () => {
    if (obj) {
      obj.style.transform = `rotateY(${ang}deg)`;
      shadow.style.transform = `scaleX(${(0.55 + 0.45 * Math.abs(Math.cos(ang * Math.PI / 180))).toFixed(3)})`;
    } else if (img) setFrame(img, p, ang);
  };
  const hideHint = () => hint && hint.classList.add("hide");
  const hintTimer = setTimeout(hideHint, 4500);

  stage.addEventListener("pointerdown", e => {
    dragging = true; moved = false;
    lastX = e.clientX; lastT = performance.now(); vel = 0;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", e => {
    if (!dragging) return;
    const now = performance.now(), dx = e.clientX - lastX, dt = Math.max(1, now - lastT) / 1000;
    if (Math.abs(dx) > 2) { moved = true; hideHint(); }
    ang += dx * 0.6;
    vel = (dx * 0.6) / dt;
    lastX = e.clientX; lastT = now;
  });
  const up = () => {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(vel) > 20) dir = Math.sign(vel);
    if (performance.now() - lastT > 80) vel = 0; // soltou parado
    resumeAt = performance.now() + 1400;
  };
  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", up);

  apply();
  return {
    tick(dt) {
      if (!dragging) {
        const target = !reduceMotion && performance.now() > resumeAt ? AUTO * dir : 0;
        vel += (target - vel) * Math.min(1, dt * 2.2); // inércia + volta ao giro automático
        ang += vel * dt;
      }
      apply();
    },
    destroy() { clearTimeout(hintTimer); },
  };
}

/* Um único loop de animação para fotos 360 e o visualizador */
let lastFrame = 0;
function loop(t) {
  const dt = lastFrame ? Math.min(0.05, (t - lastFrame) / 1000) : 0;
  lastFrame = t;
  if (!reduceMotion) {
    visibleFrames.forEach(st => {
      if (st.closest(".sheet") && viewer) return;
      st._ang = (st._ang || 0) + dt * 360 / DUR;
      setFrame($(".frames img", st), byId(+st.dataset.pid), st._ang);
    });
  }
  if (viewer) viewer.tick(dt);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- produto: abrir com animação "do card para a tela" ---------- */
let pendingFly = null;

function openProduct(id, fromStage) {
  const p = byId(id);
  if (!p) return;
  let qtd = 1, opcao = null;
  const fav = () => state.favs.includes(p.id);

  const html = `
    <div class="sheet-float-btns">
      <button class="circle-btn" data-close aria-label="Voltar">${ICON.back}</button>
      <div style="display:flex;gap:10px">
        <button class="circle-btn" data-share-p aria-label="Compartilhar">${ICON.share}</button>
        <button class="circle-btn fav${fav() ? " on" : ""}" data-fav aria-label="Favoritar">${fav() ? ICON.heartFill : ICON.heart}</button>
      </div>
    </div>
    <div class="sheet-scroll">
      ${stageHTML(p, { cls: "detail-stage", badge: false, manual: true, hint: true })}
      <div class="detail-body">
        <h2>${esc(p.nome)}</h2>
        ${priceHTML(p)}
        <p class="desc">${esc(p.descricao || "")}</p>
        ${p.opcoes ? `
        <div>
          <div class="opt-title"><span>Escolha: ${esc(p.opcoes.nome)}</span><small>OBRIGATÓRIO</small></div>
          <div class="opts">${p.opcoes.valores.map(v => `<button class="chip" data-opt="${esc(v)}">${esc(v)}</button>`).join("")}</div>
        </div>` : ""}
        <div>
          <label class="field-label" for="obsProd">Alguma observação?</label>
          <textarea class="input" id="obsProd" maxlength="140" placeholder="Ex.: embalar para presente"></textarea>
        </div>
      </div>
    </div>
    <div class="sheet-foot">
      <div class="stepper">
        <button data-q="-1" aria-label="Diminuir">${ICON.minus}</button>
        <span data-qtd>1</span>
        <button data-q="1" aria-label="Aumentar">${ICON.plus}</button>
      </div>
      <button class="btn" data-add><span>Adicionar</span><span data-total>${brl(p.preco)}</span></button>
    </div>`;

  let startAng = 0;
  const fromObj = fromStage && $(".obj", fromStage);
  if (fromObj) startAng = currentAngle(fromObj);

  const el = openSheet(html, {
    onOpen: el => flipIn(el, fromStage),
    onClose: (el, done) => {
      viewer && viewer.destroy();
      viewer = null;
      flipOut(el, fromStage, () => {
        done();
        if (pendingFly) { flyToCart(pendingFly, fromStage); pendingFly = null; }
      });
    },
  });

  const stage = $(".detail-stage", el);
  viewer = makeViewer(stage, p, startAng);

  const updateTotal = () => {
    $("[data-qtd]", el).textContent = qtd;
    $("[data-total]", el).textContent = brl(p.preco * qtd);
  };

  el.addEventListener("click", e => {
    const t = e.target;
    const q = t.closest("[data-q]");
    if (q) { qtd = Math.max(1, Math.min(99, qtd + +q.dataset.q)); updateTotal(); return; }
    const o = t.closest("[data-opt]");
    if (o) {
      opcao = o.dataset.opt;
      $$("[data-opt]", el).forEach(x => x.classList.toggle("on", x === o));
      return;
    }
    const f = t.closest("[data-fav]");
    if (f) {
      state.favs = fav() ? state.favs.filter(x => x !== p.id) : [...state.favs, p.id];
      store.set("favs", state.favs);
      f.classList.toggle("on", fav());
      f.innerHTML = fav() ? ICON.heartFill : ICON.heart;
      toast(fav() ? "Adicionado aos favoritos 💖" : "Removido dos favoritos");
      return;
    }
    if (t.closest("[data-share-p]")) { share(p.nome, `${p.nome} — ${brl(p.preco)} na ${LOJA.nome}`); return; }
    if (t.closest("[data-add]")) {
      if (p.opcoes && !opcao) {
        const opts = $(".opts", el);
        opts.classList.remove("shake"); void opts.offsetWidth; opts.classList.add("shake");
        opts.scrollIntoView({ behavior: "smooth", block: "center" });
        toast(`Escolha: ${p.opcoes.nome}`);
        return;
      }
      addToCart(p.id, qtd, opcao, $("#obsProd", el).value.trim());
      pendingFly = p;
      closeSheet();
    }
  });
}

function flipIn(el, from) {
  const backdrop = $(".sheet-backdrop", el), panel = $(".sheet-panel", el), stage = $(".detail-stage", el);
  backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
  if (!from || reduceMotion || !document.contains(from)) return defaultIn(el);

  const a = from.getBoundingClientRect(), b = stage.getBoundingClientRect();
  const sx = a.width / b.width, sy = a.height / b.height;
  const ease = "cubic-bezier(.2,.8,.2,1)", duration = 480;
  panel.style.overflow = "visible";
  stage.style.transformOrigin = "0 0";
  stage.style.zIndex = 5;
  from.style.visibility = "hidden";
  stage.animate([
    { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${sx}, ${sy})`, borderRadius: `${16 / sx}px` },
    { transform: "none", borderRadius: "0px" },
  ], { duration, easing: ease }).onfinish = () => { panel.style.overflow = ""; stage.style.zIndex = ""; };
  const bg = getComputedStyle(panel).backgroundColor;
  panel.animate([{ backgroundColor: "rgba(0,0,0,0)" }, { backgroundColor: bg }], { duration: 300, easing: ease });
  $(".sheet-foot", el).animate([{ transform: "translateY(100%)" }, { transform: "none" }], { duration, easing: ease });
  $(".sheet-float-btns", el).animate([{ opacity: 0, transform: "scale(.8)" }, { opacity: 1, transform: "none" }], { duration: 300, delay: 200, fill: "backwards" });
}

function flipOut(el, from, done) {
  const backdrop = $(".sheet-backdrop", el), panel = $(".sheet-panel", el), stage = $(".detail-stage", el);
  if (!from || reduceMotion || !document.contains(from)) {
    return defaultOut(el, () => { if (from) from.style.visibility = ""; done(); });
  }
  const opts = { duration: 380, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" };
  const a = from.getBoundingClientRect(), b = stage.getBoundingClientRect();
  const sx = a.width / b.width, sy = a.height / b.height;
  panel.style.overflow = "visible";
  stage.style.transformOrigin = "0 0";
  stage.style.zIndex = 5;
  backdrop.animate([{ opacity: 1 }, { opacity: 0 }], opts);
  panel.animate([{ backgroundColor: getComputedStyle(panel).backgroundColor }, { backgroundColor: "rgba(0,0,0,0)" }], opts);
  [".detail-body", ".sheet-foot", ".sheet-float-btns"].forEach(s =>
    $(s, el).animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: "forwards" }));
  stage.animate([
    { transform: "none", borderRadius: "0px" },
    { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${sx}, ${sy})`, borderRadius: `${16 / sx}px` },
  ], opts).onfinish = () => { from.style.visibility = ""; done(); };
}

/* ---------- carrinho ---------- */
const cartKey = (id, opcao) => `${id}|${opcao || ""}`;

function addToCart(id, qtd, opcao, obs) {
  const key = cartKey(id, opcao);
  const item = state.cart.find(i => i.key === key);
  if (item) { item.qtd = Math.min(99, item.qtd + qtd); if (obs) item.obs = obs; }
  else state.cart.push({ key, id, qtd, opcao: opcao || null, obs: obs || "" });
  saveCart();
}

function saveCart() {
  state.cart = state.cart.filter(i => i.qtd > 0 && byId(i.id));
  store.set("cart", state.cart);
  updateCartUI();
}

function taxaEntrega(subtotal, modo) {
  const e = LOJA.entrega;
  if (modo === "retirada" || !subtotal) return 0;
  if (e.gratisAcima > 0 && subtotal >= e.gratisAcima) return 0;
  return e.taxa;
}

function totals(modo = "entrega") {
  const subtotal = state.cart.reduce((s, i) => s + byId(i.id).preco * i.qtd, 0);
  const count = state.cart.reduce((s, i) => s + i.qtd, 0);
  const entrega = taxaEntrega(subtotal, modo);
  return { subtotal, count, entrega, total: subtotal + entrega };
}

function updateCartUI() {
  const { count, subtotal } = totals();
  const badge = $("#navBadge");
  badge.hidden = !count;
  badge.textContent = count > 99 ? "99+" : count;
  $("#cartBar").hidden = !count;
  $("#cartBarQtd").textContent = count;
  $("#cartBarTotal").textContent = brl(subtotal);
  if (state.tab === "carrinho") renderers.carrinho();
}

function bumpBadge() {
  const b = $("#navBadge");
  b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
}

function flyToCart(p, fromStage) {
  toast("Adicionado ao carrinho 🛒");
  if (reduceMotion) return bumpBadge();
  const a = fromStage && document.contains(fromStage)
    ? fromStage.getBoundingClientRect()
    : { left: innerWidth / 2 - 40, top: innerHeight / 2 - 40, width: 80, height: 80 };
  const b = $("#navCarrinho").getBoundingClientRect();
  const size = 56;
  const sx = a.left + a.width / 2 - size / 2, sy = a.top + a.height / 2 - size / 2;
  const tx = b.left + b.width / 2 - size / 2, ty = b.top + 14 - size / 2;
  const f = document.createElement("div");
  f.className = "flyer";
  f.style.cssText = `--c:${p.cor};width:${size}px;height:${size}px;left:0;top:0;font-size:30px`;
  f.innerHTML = p.imagem ? `<img src="${esc(p.imagem)}" alt="">` : esc(p.emoji || "🛍️");
  document.body.append(f);
  f.animate([
    { transform: `translate(${sx}px, ${sy}px) scale(1.5)`, opacity: 1 },
    { transform: `translate(${(sx + tx) / 2}px, ${Math.min(sy, ty) - 110}px) scale(1.1) rotate(180deg)`, opacity: 1, offset: 0.45 },
    { transform: `translate(${tx}px, ${ty}px) scale(.25) rotate(360deg)`, opacity: .7 },
  ], { duration: 800, easing: "cubic-bezier(.45,0,.55,1)" }).onfinish = () => { f.remove(); bumpBadge(); };
}

function share(title, text) {
  const url = location.href.split("#")[0];
  if (navigator.share) navigator.share({ title, text, url }).catch(() => {});
  else navigator.clipboard?.writeText(url).then(() => toast("Link copiado!"), () => toast(url));
}

/* ---------- BUSCA ---------- */
function renderBuscaChips() {
  $("#buscaChips").innerHTML = ["Todos", ...CATEGORIAS]
    .map(c => `<button class="chip${c === state.buscaCat ? " on" : ""}" data-bcat="${esc(c)}">${esc(c)}</button>`).join("");
}

function renderBuscaGrid() {
  const q = norm(state.busca.trim());
  const list = PRODUTOS.filter(p =>
    (state.buscaCat === "Todos" || p.categoria === state.buscaCat) &&
    (!q || norm(`${p.nome} ${p.categoria} ${p.descricao || ""}`).includes(q)));
  $("#buscaInfo").textContent = q ? `${list.length} resultado${list.length === 1 ? "" : "s"} para “${state.busca.trim()}”` : "";
  if (!list.length) {
    $("#gridBusca").innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="big">🔎</div><h3>Nada encontrado</h3><p>Tente outra palavra ou categoria.</p></div>`;
    return;
  }
  renderGrid($("#gridBusca"), list);
}

renderers.busca = () => { renderBuscaChips(); renderBuscaGrid(); };

let buscaTimer;
$("#buscaInput").addEventListener("input", e => {
  state.busca = e.target.value;
  clearTimeout(buscaTimer);
  buscaTimer = setTimeout(renderBuscaGrid, 150);
});
$("#buscaChips").addEventListener("click", e => {
  const c = e.target.closest("[data-bcat]");
  if (!c) return;
  state.buscaCat = c.dataset.bcat;
  renderers.busca();
});

/* ---------- CARRINHO ---------- */
function thumbHTML(p) {
  return `<div class="thumb" style="--c:${esc(p.cor)}">${p.imagem ? `<img src="${esc(p.imagem)}" alt="">` : esc(p.emoji || "🛍️")}</div>`;
}

function summaryHTML(t, modo = "entrega") {
  const entregaTxt = modo === "retirada" ? "Retirada" : t.entrega ? brl(t.entrega) : `<span class="gratis">Grátis</span>`;
  return `
    <div class="summary">
      <div class="row"><span>Subtotal</span><span>${brl(t.subtotal)}</span></div>
      <div class="row"><span>Taxa de entrega</span><span>${entregaTxt}</span></div>
      <div class="row total"><span>Total</span><span>${brl(t.total)}</span></div>
    </div>`;
}

renderers.carrinho = () => {
  const box = $("#carrinhoConteudo");
  if (!state.cart.length) {
    box.innerHTML = `
      <div class="empty"><div class="big">🛒</div><h3>Seu carrinho está vazio</h3>
      <p>Que tal dar uma olhada nas novidades?</p><button class="btn" data-go="inicio">Ver produtos</button></div>`;
    return;
  }
  const t = totals();
  const e = LOJA.entrega;
  const falta = e.gratisAcima > 0 ? e.gratisAcima - t.subtotal : 0;
  box.innerHTML = `
    ${state.cart.map(i => {
      const p = byId(i.id);
      return `
        <div class="cart-item">
          ${thumbHTML(p)}
          <div class="cart-info">
            <div class="nm">${esc(p.nome)}</div>
            ${i.opcao ? `<div class="op">${esc(p.opcoes?.nome || "Opção")}: ${esc(i.opcao)}</div>` : ""}
            ${i.obs ? `<div class="op">Obs.: ${esc(i.obs)}</div>` : ""}
            <div class="pr">${brl(p.preco * i.qtd)}</div>
          </div>
          <div class="stepper">
            <button data-cq="-1" data-key="${esc(i.key)}" aria-label="Diminuir">${i.qtd === 1 ? ICON.trash : ICON.minus}</button>
            <span>${i.qtd}</span>
            <button data-cq="1" data-key="${esc(i.key)}" aria-label="Aumentar">${ICON.plus}</button>
          </div>
        </div>`;
    }).join("")}
    <div class="pad"><button class="link-btn" data-go="inicio">+ Adicionar mais itens</button></div>
    ${falta > 0 ? `
      <div class="frete-bar">Faltam <b>${brl(falta)}</b> para ganhar <b>frete grátis</b> 🚚
        <div class="track"><div class="fill" style="width:${Math.min(100, t.subtotal / e.gratisAcima * 100)}%"></div></div>
      </div>` : e.gratisAcima > 0 ? `<div class="frete-bar">🎉 Você ganhou <b>frete grátis</b>!</div>` : ""}
    ${summaryHTML(t)}
    <div class="pad"><button class="btn block" data-checkout>Continuar</button></div>`;
};

$("#carrinhoConteudo").addEventListener("click", e => {
  const b = e.target.closest("[data-cq]");
  if (b) {
    const item = state.cart.find(i => i.key === b.dataset.key);
    if (item) { item.qtd += +b.dataset.cq; saveCart(); }
    return;
  }
  if (e.target.closest("[data-checkout]")) openCheckout();
});

/* ---------- campos de endereço (usado no checkout e em "Meus dados") ---------- */
function addressFieldsHTML(u) {
  const v = k => esc(u[k] || "");
  return `
    <div class="row3">
      <input class="input" name="cep" inputmode="numeric" placeholder="CEP" value="${v("cep")}" maxlength="9">
      <input class="input" name="rua" placeholder="Rua / Avenida" value="${v("rua")}" autocomplete="address-line1">
    </div>
    <div class="row2">
      <input class="input" name="numero" placeholder="Número" value="${v("numero")}">
      <input class="input" name="complemento" placeholder="Complemento" value="${v("complemento")}">
    </div>
    <div class="row2">
      <input class="input" name="bairro" placeholder="Bairro" value="${v("bairro")}">
      <input class="input" name="cidade" placeholder="Cidade" value="${v("cidade")}">
    </div>`;
}

function bindMasks(root) {
  const tel = $("[name=tel]", root), cep = $("[name=cep]", root);
  if (tel) tel.addEventListener("input", () => {
    const d = digits(tel.value).slice(0, 11);
    tel.value = d.length > 10 ? d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
      : d.length > 6 ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
      : d.length > 2 ? d.replace(/(\d{2})(\d+)/, "($1) $2") : d;
  });
  if (cep) cep.addEventListener("input", async () => {
    const d = digits(cep.value).slice(0, 8);
    cep.value = d.length > 5 ? d.replace(/(\d{5})(\d+)/, "$1-$2") : d;
    if (d.length !== 8) return;
    try { // preenche o endereço sozinho pelo CEP
      const r = await fetch(`https://viacep.com.br/ws/${d}/json/`).then(r => r.json());
      if (r.erro) return toast("CEP não encontrado");
      $("[name=rua]", root).value = r.logradouro || "";
      $("[name=bairro]", root).value = r.bairro || "";
      $("[name=cidade]", root).value = r.localidade ? `${r.localidade}/${r.uf}` : "";
      $("[name=numero]", root).focus();
    } catch { /* sem internet: preenche na mão */ }
  });
}

const formData = root => Object.fromEntries($$("input[name], textarea[name]", root)
  .filter(i => i.type !== "radio" || i.checked).map(i => [i.name, i.value.trim()]));

/* ---------- FINALIZAR PEDIDO ---------- */
function openCheckout() {
  if (!state.cart.length) return;
  const u = state.user;
  let modo = "entrega";
  const el = openSheet(`
    <div class="sheet-head"><button class="circle-btn" data-close aria-label="Voltar">${ICON.back}</button><h3>Finalizar pedido</h3></div>
    <div class="sheet-scroll">
      <form class="form" id="checkoutForm" novalidate>
        <h4>Seus dados</h4>
        <input class="input" name="nome" placeholder="Nome completo" value="${esc(u.nome || "")}" autocomplete="name">
        <input class="input" name="tel" type="tel" inputmode="tel" placeholder="WhatsApp com DDD" value="${esc(u.tel || "")}" autocomplete="tel">

        <h4>Como quer receber?</h4>
        ${LOJA.entrega.retirada ? `<div class="seg"><button type="button" class="on" data-modo="entrega">Entrega</button><button type="button" data-modo="retirada">Retirar na loja</button></div>` : ""}
        <div data-endereco>${addressFieldsHTML(u)}</div>
        <p class="muted" data-retirada hidden>${ICON.pin} ${esc(LOJA.contato.endereco)}</p>

        <h4>Pagamento</h4>
        <div class="pay">${LOJA.pagamentos.map((pg, i) =>
          `<label><input type="radio" name="pagamento" value="${esc(pg)}"${i === 0 ? " checked" : ""}>${esc(pg)}</label>`).join("")}</div>
        <input class="input" name="troco" placeholder="Troco para quanto? (opcional)" inputmode="decimal" hidden style="margin-top:10px">

        <h4>Observações</h4>
        <textarea class="input" name="obs" maxlength="200" placeholder="Ex.: deixar na portaria"></textarea>
      </form>
      <div data-summary></div>
    </div>
    <div class="sheet-foot"><button class="btn zap" data-enviar><span>${ICON.zap} Enviar pelo WhatsApp</span><span data-tot></span></button></div>`);

  const form = $("#checkoutForm", el);
  bindMasks(form);
  const refresh = () => {
    const t = totals(modo);
    $("[data-summary]", el).innerHTML = summaryHTML(t, modo);
    $("[data-tot]", el).textContent = brl(t.total);
    $("[data-endereco]", el).hidden = modo === "retirada";
    $("[data-retirada]", el).hidden = modo !== "retirada";
    const din = $("[name=pagamento]:checked", form)?.value === "Dinheiro";
    $("[name=troco]", form).hidden = !din;
  };
  refresh();

  form.addEventListener("change", refresh);
  form.addEventListener("submit", e => e.preventDefault());
  el.addEventListener("click", e => {
    const m = e.target.closest("[data-modo]");
    if (m) {
      modo = m.dataset.modo;
      $$("[data-modo]", el).forEach(b => b.classList.toggle("on", b === m));
      refresh();
      return;
    }
    if (e.target.closest("[data-enviar]")) enviarPedido(el, form, modo);
  });
}

function enviarPedido(el, form, modo) {
  const d = formData(form);
  const req = ["nome", "tel", ...(modo === "entrega" ? ["rua", "numero", "bairro"] : [])];
  const bad = req.filter(k => !d[k] || (k === "tel" && digits(d.tel).length < 10));
  $$(".input", form).forEach(i => i.classList.toggle("err", bad.includes(i.name)));
  if (bad.length) {
    $(`[name=${bad[0]}]`, form).focus();
    return toast("Preencha os campos destacados");
  }

  // guarda os dados para a próxima compra
  const { pagamento, troco, obs, ...dadosCliente } = d;
  state.user = { ...state.user, ...dadosCliente };
  store.set("user", state.user);

  const t = totals(modo);
  const seq = store.get("seq", 0) + 1;
  store.set("seq", seq);
  const order = {
    num: String(seq).padStart(4, "0"),
    data: Date.now(),
    itens: state.cart.map(i => {
      const p = byId(i.id);
      return { id: p.id, nome: p.nome, preco: p.preco, qtd: i.qtd, opcao: i.opcao, opcaoNome: p.opcoes?.nome, obs: i.obs };
    }),
    ...t, modo, pagamento, troco, obs,
    cliente: { nome: d.nome, tel: d.tel },
    endereco: modo === "entrega" ? [d.rua && `${d.rua}, ${d.numero}`, d.complemento, d.bairro, d.cidade, d.cep && `CEP ${d.cep}`].filter(Boolean).join(" — ") : "",
  };
  state.orders.unshift(order);
  store.set("orders", state.orders);
  state.cart = [];
  saveCart();

  window.open(waLink(mensagemPedido(order)), "_blank", "noopener");

  const panel = $(".sheet-panel", el);
  panel.innerHTML = `
    <div class="sheet-scroll">
      <div class="success">
        <svg class="check" viewBox="0 0 56 56"><circle class="ring" cx="28" cy="28" r="26"/><path class="tick" d="M16 29l8 8 16-17"/></svg>
        <h3>Pedido nº ${order.num} enviado!</h3>
        <p>Finalize a conversa no WhatsApp — a loja vai confirmar seu pedido por lá.</p>
        <button class="btn block" data-ver-pedidos>Ver meus pedidos</button>
        <p style="margin-top:14px"><a href="${waLink(mensagemPedido(order))}" target="_blank" rel="noopener">WhatsApp não abriu? Toque aqui</a></p>
      </div>
    </div>`;
  $("[data-ver-pedidos]", panel).addEventListener("click", () => { closeSheet(); go("pedidos"); });
}

function mensagemPedido(o) {
  const linhas = o.itens.map(i =>
    `• ${i.qtd}x ${i.nome}${i.opcao ? ` (${i.opcaoNome || "Opção"}: ${i.opcao})` : ""} — ${brl(i.preco * i.qtd)}${i.obs ? `\n   _Obs.: ${i.obs}_` : ""}`);
  return [
    `*Novo pedido nº ${o.num}* 🛍️`,
    ``,
    `*Cliente:* ${o.cliente.nome}`,
    `*WhatsApp:* ${o.cliente.tel}`,
    ``,
    `*Itens*`,
    ...linhas,
    ``,
    `Subtotal: ${brl(o.subtotal)}`,
    `Entrega: ${o.modo === "retirada" ? "Retirar na loja" : o.entrega ? brl(o.entrega) : "Grátis"}`,
    `*Total: ${brl(o.total)}*`,
    ``,
    o.modo === "entrega" ? `*Endereço:* ${o.endereco}` : `*Retirada na loja*`,
    `*Pagamento:* ${o.pagamento}${o.troco ? ` (troco para ${o.troco})` : ""}`,
    o.obs ? `*Obs.:* ${o.obs}` : "",
  ].join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/* ---------- PEDIDOS ---------- */
const fmtData = ts => new Date(ts).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const lojaAvatarHTML = () => LOJA.avatar
  ? `<div class="avatar" style="background-image:url('${esc(LOJA.avatar)}')"></div>`
  : `<div class="avatar">${esc(LOJA.nome.charAt(0))}</div>`;

renderers.pedidos = () => {
  const box = $("#pedidosConteudo");
  if (!state.orders.length) {
    box.innerHTML = `
      <div class="empty"><div class="big">🧾</div><h3>Você ainda não fez pedidos</h3>
      <p>Seus pedidos vão aparecer aqui.</p><button class="btn" data-go="inicio">Começar a comprar</button></div>`;
    return;
  }
  box.innerHTML = state.orders.map((o, i) => `
    <article class="order" style="--i:${i}" data-order="${i}">
      <div class="order-top">${lojaAvatarHTML()}<div><b>${esc(LOJA.nome)}</b><div class="muted" style="font-size:13px">Pedido nº ${esc(o.num)} · ${fmtData(o.data)}</div></div>${ICON.chev}</div>
      <div class="order-status"><i></i>Enviado pelo WhatsApp</div>
      <div class="order-items">${o.itens.map(it => `${it.qtd}x ${esc(it.nome)}`).join(", ")}</div>
      <div style="margin-top:6px"><b>${brl(o.total)}</b></div>
      <div class="order-actions">
        <button class="btn ghost" data-ajuda="${i}">Ajuda</button>
        <button class="btn" data-repetir="${i}">Pedir de novo</button>
      </div>
    </article>`).join("");
};

$("#pedidosConteudo").addEventListener("click", e => {
  const aj = e.target.closest("[data-ajuda]");
  if (aj) { window.open(waLink(`Olá! Preciso de ajuda com o pedido nº ${state.orders[+aj.dataset.ajuda].num}.`), "_blank", "noopener"); return; }
  const rp = e.target.closest("[data-repetir]");
  if (rp) {
    const o = state.orders[+rp.dataset.repetir];
    let n = 0;
    o.itens.forEach(it => { if (byId(it.id)) { addToCart(it.id, it.qtd, it.opcao, it.obs); n++; } });
    toast(n ? "Itens adicionados ao carrinho" : "Esses produtos não estão mais disponíveis");
    if (n) go("carrinho");
    return;
  }
  const card = e.target.closest("[data-order]");
  if (card) openPedido(state.orders[+card.dataset.order]);
});

function openPedido(o) {
  openSheet(`
    <div class="sheet-head"><button class="circle-btn" data-close aria-label="Voltar">${ICON.back}</button><h3>Pedido nº ${esc(o.num)}</h3></div>
    <div class="sheet-scroll">
      <ul class="timeline" style="margin-top:12px">
        <li class="done"><b>Pedido enviado</b><br><small>${fmtData(o.data)}</small></li>
        <li>Confirmação da loja pelo WhatsApp</li>
        <li>${o.modo === "retirada" ? "Pronto para retirada" : "Saiu para entrega"}</li>
        <li>${o.modo === "retirada" ? "Retirado" : "Entregue"}</li>
      </ul>
      ${o.itens.map(it => { const p = byId(it.id) || { cor: "#eee", emoji: "🛍️" }; return `
        <div class="cart-item">${thumbHTML(p)}<div class="cart-info">
          <div class="nm">${it.qtd}x ${esc(it.nome)}</div>
          ${it.opcao ? `<div class="op">${esc(it.opcaoNome || "Opção")}: ${esc(it.opcao)}</div>` : ""}
          <div class="pr">${brl(it.preco * it.qtd)}</div></div></div>`; }).join("")}
      ${summaryHTML(o, o.modo)}
      <div class="pad muted">
        <p><b style="color:var(--text)">${o.modo === "retirada" ? "Retirada na loja" : "Entrega"}</b><br>${esc(o.modo === "retirada" ? LOJA.contato.endereco : o.endereco)}</p>
        <p style="margin-top:10px"><b style="color:var(--text)">Pagamento</b><br>${esc(o.pagamento)}${o.troco ? ` · troco para ${esc(o.troco)}` : ""}</p>
      </div>
    </div>
    <div class="sheet-foot"><a class="btn zap block" target="_blank" rel="noopener" href="${waLink(`Olá! Quero saber sobre o pedido nº ${o.num}.`)}">${ICON.zap} Falar com a loja</a></div>`);
}

/* ---------- PERFIL + CONTATO ---------- */
function contatoHTML() {
  const c = LOJA.contato;
  const item = (href, icon, titulo, sub) =>
    `<li><a href="${esc(href)}" target="_blank" rel="noopener">${icon}<span>${esc(titulo)}<span class="sub">${esc(sub)}</span></span>${ICON.chev}</a></li>`;
  return `<ul class="menu">
    ${item(waLink(`Olá, ${LOJA.nome}!`), ICON.zap, "WhatsApp", c.telefone)}
    ${item("https://instagram.com/" + c.instagram, ICON.insta, "Instagram", "@" + c.instagram)}
    ${item("mailto:" + c.email, ICON.mail, "E-mail", c.email)}
    ${item("tel:+" + digits(c.whatsapp), ICON.phone, "Ligar", c.telefone)}
    ${item("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(c.endereco), ICON.pin, "Endereço", c.endereco)}
  </ul>
  <div class="menu-title">Horário de atendimento</div>
  <div class="hours">${c.horario.map(([d, h]) => `<div><span>${esc(d)}</span><span class="muted">${esc(h)}</span></div>`).join("")}</div>`;
}

const THEMES = { auto: "Automático", light: "Claro", dark: "Escuro" };
function applyTheme() {
  const t = state.theme;
  if (t === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.dataset.theme = t;
}

renderers.perfil = () => {
  const u = state.user;
  const nome = u.nome ? u.nome.split(" ")[0] : "";
  $("#perfilConteudo").innerHTML = `
    <div class="me">
      <div class="avatar">${nome ? esc(nome.charAt(0).toUpperCase()) : ICON.user}</div>
      <div><b>${nome ? `Olá, ${esc(nome)}!` : "Olá! 👋"}</b><div class="muted">${esc(u.tel || "Seus dados ficam salvos neste aparelho")}</div></div>
    </div>
    <div class="menu-title">Minha conta</div>
    <ul class="menu">
      <li><button data-p="dados">${ICON.user}<span>Meus dados<span class="sub">Nome, WhatsApp e endereço</span></span>${ICON.chev}</button></li>
      <li><button data-p="favs">${ICON.heart}<span>Favoritos<span class="sub">${state.favs.length} produto${state.favs.length === 1 ? "" : "s"}</span></span>${ICON.chev}</button></li>
      <li><button data-go="pedidos">${ICON.receipt}<span>Meus pedidos<span class="sub">${state.orders.length} pedido${state.orders.length === 1 ? "" : "s"}</span></span>${ICON.chev}</button></li>
      <li><button data-p="tema">${ICON.moon}<span>Aparência<span class="sub">${THEMES[state.theme]}</span></span>${ICON.chev}</button></li>
    </ul>
    <div class="menu-title">Fale com a loja</div>
    ${contatoHTML()}
    <div class="menu-title">Dúvidas frequentes</div>
    ${LOJA.faq.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
    <p class="muted pad" style="text-align:center;font-size:13px;margin-top:12px">© ${new Date().getFullYear()} ${esc(LOJA.nome)}</p>`;
};

$("#perfilConteudo").addEventListener("click", e => {
  const b = e.target.closest("[data-p]");
  if (!b) return;
  const k = b.dataset.p;
  if (k === "tema") {
    const order = Object.keys(THEMES);
    state.theme = order[(order.indexOf(state.theme) + 1) % order.length];
    store.set("theme", state.theme);
    applyTheme();
    renderers.perfil();
    toast("Aparência: " + THEMES[state.theme]);
  }
  if (k === "dados") openDados();
  if (k === "favs") openFavs();
});

function openDados() {
  const u = state.user;
  const el = openSheet(`
    <div class="sheet-head"><button class="circle-btn" data-close aria-label="Voltar">${ICON.back}</button><h3>Meus dados</h3></div>
    <div class="sheet-scroll"><form class="form" novalidate>
      <h4>Contato</h4>
      <input class="input" name="nome" placeholder="Nome completo" value="${esc(u.nome || "")}" autocomplete="name">
      <input class="input" name="tel" type="tel" inputmode="tel" placeholder="WhatsApp com DDD" value="${esc(u.tel || "")}" autocomplete="tel">
      <h4>Endereço de entrega</h4>
      ${addressFieldsHTML(u)}
    </form></div>
    <div class="sheet-foot"><button class="btn block" data-salvar>Salvar</button></div>`);
  const form = $("form", el);
  bindMasks(form);
  form.addEventListener("submit", e => e.preventDefault());
  $("[data-salvar]", el).addEventListener("click", () => {
    state.user = { ...state.user, ...formData(form) };
    store.set("user", state.user);
    toast("Dados salvos ✔");
    renderers.perfil();
    closeSheet();
  });
}

function openFavs() {
  const list = state.favs.map(byId).filter(Boolean);
  const el = openSheet(`
    <div class="sheet-head"><button class="circle-btn" data-close aria-label="Voltar">${ICON.back}</button><h3>Favoritos</h3></div>
    <div class="sheet-scroll">${list.length ? `<div class="grid"></div>` :
      `<div class="empty"><div class="big">💖</div><h3>Nenhum favorito ainda</h3><p>Toque no coração de um produto para salvar aqui.</p></div>`}</div>`);
  if (list.length) renderGrid($(".grid", el), list);
}

function openContato() {
  openSheet(`
    <div class="sheet-head"><button class="circle-btn" data-close aria-label="Voltar">${ICON.back}</button><h3>Fale com a ${esc(LOJA.nome)}</h3></div>
    <div class="sheet-scroll">${contatoHTML()}</div>`);
}

/* ---------- eventos gerais ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  const open = t.closest("[data-open]");
  if (open) return openProduct(+open.dataset.open, $(".stage", open));
  const g = t.closest("[data-go]");
  if (g) {
    const tab = g.dataset.go;
    const fromSheet = g.closest(".sheet");
    if (fromSheet) closeSheet();
    return go(tab, { focusSearch: tab === "busca" && !!g.closest(".topbar") });
  }
  if (t.closest("[data-close]")) return closeSheet();
  const nav = t.closest("#bottomNav [data-tab]");
  if (nav) return go(nav.dataset.tab);
});

document.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-open]")) {
    e.preventDefault();
    e.target.click();
  }
  if (e.key === "Escape" && stack.length) closeSheet();
});

$("#cartBar").addEventListener("click", () => go("carrinho"));
$("#btnShare").addEventListener("click", () => share(LOJA.nome, LOJA.bio));
$("#btnMais").addEventListener("click", openContato);
$("#btnSeguir").addEventListener("click", () => {
  state.seguindo = !state.seguindo;
  store.set("seguindo", state.seguindo);
  updateSeguir();
  if (state.seguindo) {
    toast("Obrigada por seguir! 💖");
    window.open("https://instagram.com/" + LOJA.contato.instagram, "_blank", "noopener");
  }
});

/* ---------- início ---------- */
applyTheme();
renderHeader();
if (!filtroAba(state.cat).length) state.cat = TABS.find(t => filtroAba(t).length) || TABS[0];
renderTabs();
renderInicio();
updateCartUI();
go(location.hash.slice(1) || "inicio");
})();
