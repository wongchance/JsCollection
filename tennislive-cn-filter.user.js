// ==UserScript==
// @name         TennisLive 中国/中国台北/中国香港 球员比赛过滤
// @name:en      TennisLive — China / Chinese Taipei / Hong Kong player filter
// @namespace    https://github.com/wangchao/tennislive-cn-filter
// @version      1.1.0
// @description  TennisLive 球员过滤（比赛页 + 排名页）：①「只看 / 全量」切换是否只保留中国(CN)、中国台北(TW)、中国香港(HK)球员；②比赛页另有「赛事级别 ≥」按赛事档次（ITF 希望赛 / Challenger / ATP-WTA / 500 / 1000-大满贯）过滤。自动跟随 AJAX 刷新，设置本地保存。
// @author       wangchao
// @match        *://*.tennislive.net/*
// @match        *://*.tennislive.us/*
// @match        *://*.tennislive.co.uk/*
// @match        *://*.tennislive.in/*
// @match        *://*.tennislive.se/*
// @match        *://tennislive.net/*
// @match        *://tennislive.us/*
// @match        *://tennislive.co.uk/*
// @match        *://tennislive.in/*
// @match        *://tennislive.se/*
// @match        *://tennisendirect.net/*
// @match        *://tenisendirecto.es/*
// @match        *://tenisenvivo.mx/*
// @match        *://livetenis.ro/*
// @match        *://teniszeredmenyek.net/*
// @match        *://tenisrezultati.com/*
// @match        *://placartenis.com.br/*
// @match        *://*.tennisendirect.net/*
// @match        *://*.tenisendirecto.es/*
// @match        *://*.tenisenvivo.mx/*
// @match        *://*.livetenis.ro/*
// @match        *://*.teniszeredmenyek.net/*
// @match        *://*.tenisrezultati.com/*
// @match        *://*.placartenis.com.br/*
// @run-at       document-idle
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/tennislive-cn-filter.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/tennislive-cn-filter.user.js
// ==/UserScript==

(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 0. 可配置项：想改国籍范围，只改 GROUPS 即可
   *    slugs = 旗帜文件名（不含扩展名）/ 国家代码，全部小写。
   *    站点把旗帜渲染成 images/flags/circle/<slug>.png，
   *    所以 slug 是最可靠的国籍信号（不依赖页面文字语言）。
   * ------------------------------------------------------------------ */
  const GROUPS = [
    {
      key: 'cn',
      label: '中国',
      code: 'CN',
      color: '#de2910',
      slugs: ['china', 'cn', 'chn', 'prc', 'peoples-republic-of-china', 'mainland-china', 'china-pr']
    },
    {
      key: 'tw',
      label: '中国台北',
      code: 'TW',
      color: '#1f6fd0',
      slugs: ['taiwan', 'chinese-taipei', 'taipei', 'tw', 'tpe', 'taiwan-china', 'chinese-taipei-ct']
    },
    {
      key: 'hk',
      label: '中国香港',
      code: 'HK',
      color: '#b91c1c',
      slugs: ['hongkong', 'hong-kong', 'hk', 'hkg', 'hongkong-china', 'hong-kong-china']
    }
  ];

  const STORE_KEY = 'tlfx.settings.v3';
  const LEGACY_STORE_KEY = 'tlfx.settings.v2';
  const OLDER_STORE_KEY = 'tlfx.settings.v1';
  const DEFAULTS = {
    filtered: true,   // true = 只显示中华球员；false = 全量显示
    minLevel: 'all',  // 赛事级别门槛：all / challenger / tour / fivehundred / elite
    open: true
  };

  // 门槛 → 所需 tier（数值越大级别越高）
  const LEVELS = [
    { key: 'all',         label: '不限级别',       tier: 0 },
    { key: 'challenger',  label: 'Challenger 以上', tier: 2 },
    { key: 'tour',        label: 'ATP/WTA 巡回赛',  tier: 3 },
    { key: 'fivehundred', label: '500 以上',        tier: 4 },
    { key: 'elite',       label: '1000 / 大满贯',   tier: 5 }
  ];
  const LEVEL_TIER = Object.fromEntries(LEVELS.map((l) => [l.key, l.tier]));
  const LEVEL_LABEL = Object.fromEntries(LEVELS.map((l) => [l.key, l.label]));

  const HIDE_ATTR = 'data-tlfx-hide';
  const EMPTY_ATTR = 'data-tlfx-empty';
  const META_ATTR = 'data-tlfx-countries';

  /* ------------------------------------------------------------------ *
   * 1. 存储
   * ------------------------------------------------------------------ */
  const hasGM = typeof GM_getValue === 'function' && typeof GM_setValue === 'function';

  function readStore(key) {
    try {
      const raw = hasGM ? GM_getValue(key, null) : localStorage.getItem(key);
      if (!raw) return null;
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (e) { return null; }
  }

  function loadSettings() {
    let parsed = readStore(STORE_KEY);
    if (!parsed) parsed = readStore(LEGACY_STORE_KEY);
    if (!parsed) parsed = readStore(OLDER_STORE_KEY);

    // v1（只看/隐藏 + 三国勾选）迁移
    if (parsed && !('filtered' in parsed) && 'mode' in parsed) {
      const any = ['cn', 'tw', 'hk'].some((k) => parsed[k] !== false);
      parsed = { filtered: parsed.mode !== 'hide' && any, open: parsed.open !== false };
    }

    const s = Object.assign({}, DEFAULTS, parsed || {});
    s.filtered = !!s.filtered;
    s.open = !!s.open;
    if (!LEVEL_TIER.hasOwnProperty(s.minLevel)) s.minLevel = DEFAULTS.minLevel;
    return s;
  }

  function saveSettings() {
    const raw = JSON.stringify(settings);
    try {
      if (hasGM) GM_setValue(STORE_KEY, raw);
      else localStorage.setItem(STORE_KEY, raw);
    } catch (e) { /* 忽略 */ }
  }

  const settings = loadSettings();

  /* ------------------------------------------------------------------ *
   * 2. 国籍识别
   * ------------------------------------------------------------------ */
  // slug 归一化：去扩展名后的文件名统一成 a-z0-9- 形式
  const normSlug = (v) => String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-flag$/, '')
    .replace(/^-+|-+$/g, '');

  const SLUG_TO_GROUP = new Map();
  GROUPS.forEach((g) => {
    g.slugs.forEach((s) => SLUG_TO_GROUP.set(normSlug(s), g.key));
    // 顺便把 label / code 也当别名
    SLUG_TO_GROUP.set(normSlug(g.code), g.key);
  });

  const IMG_NAME_RE = /([^/\\]+)\.(?:png|svg|webp|jpe?g|gif)$/i;

  function slugFromImg(img) {
    let raw = img.getAttribute('src') || img.getAttribute('data-src') || '';
    if (!raw) return '';
    let p = raw.split(/[?#]/)[0];
    try { p = decodeURIComponent(p); } catch (e) { /* 忽略 */ }
    const m = IMG_NAME_RE.exec(p);
    return m ? normSlug(m[1]) : '';
  }

  // 赛事表头里的国家旗帜不是球员国籍，必须排除
  const HEAD_SCOPE = '[data-reconcile-key^="head:"], .tl-mt-head, .tl-lt-head, thead, .tl-lt-tour, tfoot';

  function countriesOf(entry) {
    const found = new Set();

    // 排名页：<article data-country="CHN"> 是官方三位国家码，最可靠
    const cc = normSlug(entry.getAttribute('data-country'));
    if (cc) {
      const key = SLUG_TO_GROUP.get(cc);
      if (key) found.add(key);
    }

    // 旗帜（比赛页主要靠它，排名页作补充）
    const imgs = entry.querySelectorAll('img');
    for (const img of imgs) {
      if (img.closest(HEAD_SCOPE)) continue;
      const slug = slugFromImg(img);
      if (!slug) continue;
      const key = SLUG_TO_GROUP.get(slug);
      if (key) found.add(key);
    }
    return found;
  }

  /* ------------------------------------------------------------------ *
   * 2a. 页面类型：比赛页 / 排名页（ATP/WTA 的 ranking 与 live-ranking）
   * ------------------------------------------------------------------ */
  const RANK_PATH_RE = /\/ranking/i;
  function isRankingPage() {
    if (typeof location !== 'undefined' && RANK_PATH_RE.test(location.pathname)) return true;
    return !!document.querySelector('[data-live-row], [data-ranking-panel], .tl-lr-row');
  }

  /* ------------------------------------------------------------------ *
   * 2b. 赛事级别识别
   *     · 优先用站点自带 tournamentCatalog / homepageTournaments 的 category
   *     · 目录里没有的新赛事再用赛事名交叉校验
   *     · 无法判断的（tier=0）不参与级别过滤，避免误隐藏
   * ------------------------------------------------------------------ */
  const CAT_TIER = { 1: 5, 2: 5, 3: 5, 4: 4, 5: 3, 6: 4, 7: 2, 8: 2, 9: 2, 10: 2, 11: 1, 12: 1 };
  // 站点 rank 只能粗分：0=最低档 ITF，1=Challenger 及以上，3=总决赛。
  // 但 ITF 内部 W35（希望赛）与 W50/W75（挑战赛）rank 同为 1，必须按赛事名数字细分。
  const RANK_TIER = { 0: 1, 1: 2, 2: 3, 3: 5 };
  const TIER_LABEL = ['未知', 'ITF 希望赛', 'Challenger', 'ATP/WTA', '500', '1000/大满贯'];

  // 女子：W100/W75/W50=挑战赛(2)，W35/W15=希望赛(1)；男子 M15/M25 均为希望赛(1)
  function itfTierFromName(name) {
    const m = /\b([MW])\s?(\d{2,3})\b/i.exec(name || '');
    if (!m) return 0;
    const n = Number(m[2]);
    return m[1].toUpperCase() === 'W' && n >= 50 ? 2 : 1;
  }

  function tierOfTournament(t) {
    const cat = Number(t.category);
    if (cat === 12) {
      // 名字里的级别数字最精确；没有数字时才退回 rank
      return itfTierFromName(t.name) ||
        (RANK_TIER[Number(t.rank)] != null ? RANK_TIER[Number(t.rank)] : 1);
    }
    return CAT_TIER[cat] || 0;
  }

  const tournamentTiers = (() => {
    const map = new Map();
    const rt = window.TENNISLIVE_RUNTIME;
    if (!rt) return map;
    const add = (id, t) => {
      if (id == null || t == null) return;
      map.set(String(id), tierOfTournament(t));
    };
    (rt.tournamentCatalog || []).forEach((t) => add(t.id, t));
    (rt.homepageTournaments || []).forEach((t) =>
      add(t.tournamentId != null ? t.tournamentId : t.id, t));
    return map;
  })();

  function sectionTier(section) {
    const head = section.querySelector('.tl-mt-head, .tl-lt-head');
    const name = ((head && head.textContent) || '').replace(/\s+/g, ' ').trim();
    const key = section.getAttribute('data-tournament-key') || '';
    const idm = /(\d{3,7})/.exec(key);
    let tier = idm ? (tournamentTiers.get(idm[1]) || 0) : 0;

    // 赛事名校验：ITF 数字最精确，可纠正目录的粗分（W35 要降回希望赛）
    const itfTier = itfTierFromName(name);
    if (itfTier) {
      tier = itfTier;
    } else if (/\b(?:challenger|challenge)\b/i.test(name)) tier = Math.max(tier, 2);
    else if (/\b(?:grand slam|wimbledon|roland garros|us open|australian open|1000|masters|finals)\b/i.test(name)) tier = Math.max(tier, 5);
    else if (/\b500\b/.test(name)) tier = Math.max(tier, 4);
    else if (/\b250\b/.test(name)) tier = Math.max(tier, 3);
    else if (/\bITF\b/i.test(name)) tier = Math.max(tier, 1);
    else if (!tier && /\b(?:atp|wta)\b/i.test(name)) tier = 3;

    if (section.getAttribute('data-tlfx-tier') !== String(tier)) {
      section.setAttribute('data-tlfx-tier', String(tier));
    }
    const tip = `赛事级别：${TIER_LABEL[tier]}`;
    if (section.getAttribute('title') !== tip) section.setAttribute('title', tip);
    return tier;
  }

  /* ------------------------------------------------------------------ *
   * 3. 样式
   * ------------------------------------------------------------------ */
  const STYLE_ID = 'tlfx-style';
  const CSS = `
[${HIDE_ATTR}]{display:none!important}
[${EMPTY_ATTR}]{display:none!important}

#tlfx-panel{
  position:fixed;right:16px;bottom:88px;z-index:2147483000;
  width:212px;box-sizing:border-box;
  font:12px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;
  color:#111827;background:rgba(255,255,255,.94);
  border:1px solid rgba(15,23,42,.12);border-radius:14px;
  box-shadow:0 12px 32px -8px rgba(15,23,42,.28);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  user-select:none;overflow:hidden;
}
html.dark #tlfx-panel{
  color:#e6ebf2;background:rgba(17,21,27,.9);
  border-color:rgba(255,255,255,.14);
  box-shadow:0 14px 36px -10px rgba(0,0,0,.7);
}
#tlfx-panel *{box-sizing:border-box}
#tlfx-panel .tlfx-head{
  display:flex;align-items:center;gap:6px;
  padding:9px 10px;cursor:pointer;
}
#tlfx-panel .tlfx-dot{width:7px;height:7px;border-radius:50%;background:#14b8a6;flex:none;box-shadow:0 0 0 3px rgba(20,184,166,.18)}
#tlfx-panel .tlfx-title{font-weight:700;letter-spacing:.2px;font-size:12px}
#tlfx-panel .tlfx-count{
  margin-left:auto;font-variant-numeric:tabular-nums;
  font-size:11px;padding:1px 6px;border-radius:999px;
  background:rgba(20,184,166,.14);color:#0f766e;font-weight:700;
}
html.dark #tlfx-panel .tlfx-count{background:rgba(45,212,191,.16);color:#5eead4}
#tlfx-panel .tlfx-count.is-zero{background:rgba(239,68,68,.14);color:#b91c1c}
html.dark #tlfx-panel .tlfx-count.is-zero{background:rgba(248,113,113,.16);color:#fca5a5}
#tlfx-panel .tlfx-caret{
  width:16px;height:16px;flex:none;opacity:.55;transition:transform .18s ease;
}
#tlfx-panel[data-open="0"] .tlfx-caret{transform:rotate(-90deg)}
#tlfx-panel .tlfx-body{padding:0 10px 10px;display:block}
#tlfx-panel[data-open="0"] .tlfx-body{display:none}
#tlfx-panel .tlfx-modes{
  display:flex;gap:6px;
  padding:3px;border-radius:11px;
  background:rgba(15,23,42,.05);
}
html.dark #tlfx-panel .tlfx-modes{background:rgba(255,255,255,.06)}
#tlfx-panel .tlfx-mode{
  flex:1;padding:6px 0;border:0;border-radius:8px;
  background:transparent;color:inherit;
  font:inherit;font-size:12px;font-weight:600;letter-spacing:.3px;
  cursor:pointer;transition:.15s;opacity:.65;
}
html.dark #tlfx-panel .tlfx-mode{opacity:.6}
#tlfx-panel .tlfx-mode:hover{opacity:1}
#tlfx-panel .tlfx-mode.is-active{
  opacity:1;color:#fff;background:#0d9488;
  box-shadow:0 2px 6px -1px rgba(13,148,136,.5);
}
html.dark #tlfx-panel .tlfx-mode.is-active{color:#052e2b;background:#5eead4}
#tlfx-panel .tlfx-level-row{
  display:flex;align-items:center;gap:6px;margin-top:7px;
  font-size:10.5px;opacity:.75;
}
#tlfx-panel .tlfx-level{
  flex:1;min-width:0;padding:3px 4px;border-radius:7px;
  border:1px solid rgba(15,23,42,.16);background:transparent;color:inherit;
  font:inherit;font-size:10.5px;cursor:pointer;
}
html.dark #tlfx-panel .tlfx-level{border-color:rgba(255,255,255,.2)}
#tlfx-panel .tlfx-state{
  margin-top:7px;font-size:10.5px;line-height:1.4;opacity:.7;
}
#tlfx-panel .tlfx-state b{font-weight:700;opacity:1}
#tlfx-panel .tlfx-legend{
  display:flex;align-items:center;gap:8px;flex-wrap:wrap;
  margin-top:6px;font-size:10px;opacity:.5;
}
#tlfx-panel .tlfx-legend i{
  display:inline-block;width:6px;height:6px;border-radius:50%;margin-right:3px;vertical-align:1px;
}
#tlfx-panel .tlfx-tip{
  margin-top:8px;padding-top:7px;border-top:1px dashed rgba(127,127,127,.28);
  font-size:10.5px;line-height:1.4;opacity:.55;
}
`;

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = CSS;
    (document.head || document.documentElement).appendChild(el);
  }

  /* ------------------------------------------------------------------ *
   * 4. 面板 UI
   * ------------------------------------------------------------------ */
  let panel = null;
  let panelRefs = null;

  function buildPanel() {
    if (panel) return;
    const ranking = isRankingPage();
    const noun = ranking ? '球员' : '比赛';
    panel = document.createElement('div');
    panel.id = 'tlfx-panel';
    panel.setAttribute('data-page', ranking ? 'ranking' : 'matches');
    panel.setAttribute('data-open', settings.open ? '1' : '0');
    panel.innerHTML = `
      <div class="tlfx-head" role="button" tabindex="0" aria-label="展开/收起面板">
        <span class="tlfx-dot"></span>
        <span class="tlfx-title">中华球员过滤</span>
        <span class="tlfx-count">0/0</span>
        <svg class="tlfx-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
      </div>
      <div class="tlfx-body">
        <div class="tlfx-modes">
          <button type="button" class="tlfx-mode" data-view="only" title="只显示中国/中国台北/中国香港球员的${noun}">只看</button>
          <button type="button" class="tlfx-mode" data-view="all" title="显示全部${noun}">全量</button>
        </div>
        ${ranking ? '' : `<label class="tlfx-level-row">赛事级别 ≥
          <select class="tlfx-level" title="低于该级别的赛事也会被过滤">${LEVELS.map((l) =>
            `<option value="${l.key}">${l.label}</option>`
          ).join('')}</select>
        </label>`}
        <div class="tlfx-state"></div>
        <div class="tlfx-legend">${GROUPS.map((g) =>
          `<span><i style="background:${g.color}"></i>${g.label}</span>`
        ).join('')}</div>
      </div>`;

    panel.querySelectorAll('.tlfx-mode').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.dataset.view === 'only';
        if (settings.filtered === next) return;
        settings.filtered = next;
        saveSettings();
        syncPanel();
        apply();
      });
    });

    const levelSel = panel.querySelector('.tlfx-level');
    if (levelSel) {
      levelSel.addEventListener('change', (e) => {
        settings.minLevel = e.target.value;
        saveSettings();
        updatePanelStats(lastApply);
        apply();
      });
    }

    const collapse = () => {
      settings.open = !settings.open;
      panel.setAttribute('data-open', settings.open ? '1' : '0');
      saveSettings();
    };
    const head = panel.querySelector('.tlfx-head');
    head.addEventListener('click', collapse);
    head.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); collapse(); }
    });

    (document.body || document.documentElement).appendChild(panel);

    panelRefs = {
      count: panel.querySelector('.tlfx-count'),
      modes: Array.from(panel.querySelectorAll('.tlfx-mode')),
      level: panel.querySelector('.tlfx-level'),
      state: panel.querySelector('.tlfx-state')
    };
  }

  function syncPanel() {
    if (!panel || !panelRefs) return;
    panelRefs.modes.forEach((b) => {
      const on = (b.dataset.view === 'only') === settings.filtered;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (panelRefs.level && panelRefs.level.value !== settings.minLevel) {
      panelRefs.level.value = settings.minLevel;
    }
  }

  // 只在内容变化时写 DOM：面板本身也在被观察的子树里，
  // 无脑 textContent = x 会不断产生 mutation，形成 rAF 死循环。
  function setText(el, text) {
    if (el && el.textContent !== text) el.textContent = text;
  }

  function updatePanelStats(stats) {
    if (!panel || !panelRefs) return;
    const { total, byGroup, levelPass, visible } = stats;
    const ranking = panel.getAttribute('data-page') === 'ranking';
    const levelOn = !ranking && LEVEL_TIER[settings.minLevel] > 0;
    const anyFilter = settings.filtered || levelOn;
    const pass = anyFilter ? visible : total;
    const unit = ranking ? '人' : '场';

    setText(panelRefs.count, anyFilter ? `${pass}/${total}` : `${total}`);
    panelRefs.count.classList.toggle('is-zero', anyFilter && pass === 0);

    const parts = GROUPS.map((g) => `${g.label} ${byGroup[g.key] || 0}`).join(' · ');
    const prefix = settings.filtered ? '只看中华球员' : '全量';
    const lvl = levelOn ? ` ≥${LEVEL_LABEL[settings.minLevel]}：${levelPass} 场` : '';
    if (!total) {
      setText(panelRefs.state, ranking ? '本页没有排名列表' : '本页没有比赛列表');
    } else if (pass === 0 && anyFilter) {
      setText(panelRefs.state, ranking ? '没有中华球员的排名' : '当前条件下没有比赛');
    } else {
      setText(panelRefs.state, `${prefix}${lvl} · ${parts}`);
    }
  }

  /* ------------------------------------------------------------------ *
   * 5. 过滤核心
   * ------------------------------------------------------------------ */
  const ENTRY_SEL = '[data-match-entry], [data-live-row]';
  const entriesOf = (root) => Array.from(root.querySelectorAll(ENTRY_SEL));

  let lastApply = { matched: 0, total: 0, byGroup: {}, levelPass: 0, visible: 0 };
  let runCount = 0;
  // 元素级缓存：站点每 1~2 秒轮询一次分数，没必要反复扫同样的 DOM
  const countryCache = new WeakMap();
  const tierCache = new WeakMap();

  function apply() {
    runCount += 1;
    const entries = entriesOf(document);
    if (!entries.length) {
      lastApply = { matched: 0, total: 0, byGroup: {}, levelPass: 0, visible: 0 };
      if (panel) syncPanel();
      return lastApply;
    }

    const byGroup = { cn: 0, tw: 0, hk: 0 };
    let matched = 0;
    let levelPass = 0;
    const filtering = settings.filtered;                  // 只看 = 过滤；全量 = 不过滤
    const ranking = isRankingPage();
    // 排名页没有"赛事级别"概念，级别过滤不生效
    const levelTier = ranking ? 0 : (LEVEL_TIER[settings.minLevel] || 0);
    const levelFiltering = levelTier > 0;
    let visible = 0;

    entries.forEach((entry) => {
      let set = countryCache.get(entry);
      if (!set) { set = countriesOf(entry); countryCache.set(entry, set); }
      const meta = Array.from(set).join(' ');
      if (meta) {
        if (entry.getAttribute(META_ATTR) !== meta) entry.setAttribute(META_ATTR, meta);
      } else if (entry.hasAttribute(META_ATTR)) {
        entry.removeAttribute(META_ATTR);
      }

      set.forEach((k) => { if (byGroup[k] != null) byGroup[k] += 1; });

      const hit = set.size > 0;            // 三组国籍始终都算"中华球员"
      if (hit) matched += 1;

      // 级别：无法识别（tier=0）时不隐藏，避免误伤
      const section = entry.closest('[data-match-section]');
      let tier = 0;
      if (section) {
        if (!tierCache.has(section)) tierCache.set(section, sectionTier(section));
        tier = tierCache.get(section);
      }
      const levelHit = !levelFiltering || tier === 0 || tier >= levelTier;
      if (levelHit) levelPass += 1;

      const hide = (filtering && !hit) || !levelHit;
      if (!hide) visible += 1;
      entry.toggleAttribute(HIDE_ATTR, hide);
    });

    // 整个赛事分组都被过滤空 → 连表头一起折叠
    const sections = Array.from(document.querySelectorAll('[data-match-section]'));
    sections.forEach((section) => {
      const inner = entriesOf(section);
      if (!inner.length) {
        section.removeAttribute(EMPTY_ATTR);
        return;
      }
      const visible = inner.some((e) => !e.hasAttribute(HIDE_ATTR));
      section.toggleAttribute(EMPTY_ATTR, (filtering || levelFiltering) && !visible);
    });

    // “最近结束”这类非 section 包裹的块
    document.querySelectorAll('[data-recent-finished-block]').forEach((block) => {
      const inner = entriesOf(block);
      if (!inner.length) return;
      const visible = inner.some((e) => !e.hasAttribute(HIDE_ATTR));
      block.toggleAttribute(EMPTY_ATTR, (filtering || levelFiltering) && !visible);
    });

    lastApply = { matched, total: entries.length, byGroup, levelPass, visible };
    if (panel) updatePanelStats(lastApply);
    return lastApply;
  }

  /* ------------------------------------------------------------------ *
   * 6. 自动跟随（AJAX 刷新 / 切换筛选 / 滚动加载）
   * ------------------------------------------------------------------ */
  let scheduled = false;
  let timer = 0;
  let observer = null;

  const insidePanel = (node) => {
    const el = node && (node.nodeType === 1 ? node : node.parentElement);
    return !!(el && el.closest && el.closest('#tlfx-panel'));
  };

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      ensure();
    });
  }

  function startInterval() {
    if (timer) return;
    // 兜底：站点有内部状态重渲染时，保证 1.2s 内一定回到正确状态
    timer = setInterval(() => {
      if (document.hidden) return;
      try { apply(); } catch (e) { /* 忽略 */ }
    }, 1200);
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (insidePanel(m.target)) continue;
        if (m.type === 'attributes') {
          // 只有站点自己的 hidden / src 变化会影响可见性
          if (m.attributeName === 'class' || m.attributeName === 'src') { schedule(); return; }
          continue;
        }
        if (m.addedNodes.length || m.removedNodes.length) { schedule(); return; }
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'src']
    });

    window.addEventListener('pageshow', () => schedule());
  }

  /* ------------------------------------------------------------------ *
   * 7. 快捷键 / 菜单命令
   * ------------------------------------------------------------------ */
  function togglePanel() {
    settings.open = !settings.open;
    if (panel) panel.setAttribute('data-open', settings.open ? '1' : '0');
    saveSettings();
  }

  document.addEventListener('keydown', (e) => {
    if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'f' || e.key === 'F')) {
      e.preventDefault();
      togglePanel();
    }
  }, true);

  if (typeof GM_registerMenuCommand === 'function') {
    try {
      GM_registerMenuCommand('切换 只看 / 全量', () => {
        settings.filtered = !settings.filtered;
        saveSettings(); syncPanel(); apply();
      });
      GM_registerMenuCommand('重置过滤设置', () => {
        Object.assign(settings, DEFAULTS);
        saveSettings(); syncPanel(); apply();
      });
    } catch (e) { /* 忽略 */ }
  }

  /* ------------------------------------------------------------------ *
   * 8. 启动
   *    · 观察器先装（列表可能是 AJAX 才注入的）
   *    · 一旦页面上出现比赛条目，再挂面板并开始过滤
   * ------------------------------------------------------------------ */
  function ensure() {
    if (!document.body) return;
    if (!panel) {
      if (!entriesOf(document).length) return; // 无比赛列表的页面不注入面板
      buildPanel();
      syncPanel();
      startInterval();
    }
    apply();
  }

  function boot() {
    injectStyle();
    startObserver();
    ensure();
  }

  // 便于调试
  window.__tlfx = {
    get stats() { return lastApply; },
    get runs() { return runCount; },
    apply,
    settings,
    groups: GROUPS
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
