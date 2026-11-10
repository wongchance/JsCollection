// ==UserScript==
// @name         Mission Author Extension
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       wongchance
// @match        https://mission-author-dot-betaspike.appspot.com/*
// @match        http://missions.ingress.com*
// @match        https://missions.ingress.com*
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/misson-author.extend.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/misson-author.extend.user.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @run-at       document-idle
// @grant        none
// ==/UserScript==

/* 变更记录
 * 0.1.2 2020-03-21 增加 missions.ingress.com 网址匹配
 * 0.2.0 2020-03-25 排序支持数字自然序（1, 9, 10）
 * 0.2.1 2026-11-10
 *   1. 回填时触发 input/change 并写入 Angular scope，避免「看着有值、保存是空」
 *   2. 排序不再 empty() 列表（会 cleanData 掉挂在节点上的 Angular scope），改为移动节点
 *   3. 名字节点缺失时不再抛 TypeError 中断整个过滤
 *   4. 已发布计数改为实时（MutationObserver 监听列表变化）
 *   5. 状态判定优先用 classList，回退读 ng-class 属性，去掉带引号的脆弱比较
 *   6. 存储键加 mae_ 前缀并兼容旧键，读写包 try/catch，隐私模式下不再整段崩
 *   7. 固定 1 秒轮询改为 MutationObserver + hashchange，注入幂等，不再永久占用计时器
 *   8. 排序前把全角数字、带圈 ①②③⑴⒈㉑㊱ 归一化成阿拉伯数字
 *   9. jQuery 由 bootcss 换成 jsDelivr（版本 3.7.1，Bootstrap 3 / AngularJS 均兼容）
 *  10. 进入列表页即自动按 all 显示并排序；等任务行和名字都渲染完才排，不会排到空名字
 *  11. 分页 / 懒加载 / 整块重渲染后到的行会再排一次（用 data-mae-sorted 标记识别，不会自激）
 *  12. save / load 旁边显示存储状态：有存档显示「已存：名称 + 描述 · 时间」，没有则置灰 load
 */

(function () {
    'use strict';

    if (window.__maeInstalled) { return; }
    window.__maeInstalled = true;

    var $ = window.jQuery;
    if (!$) {
        console.warn('[MAE] jQuery 未加载，脚本退出');
        return;
    }

    /* ---------------- 存储：加前缀 + 兼容 0.2.0 的旧键 ---------------- */

    var PREFIX = 'mae_';
    var KEY = { name: 'name', desc: 'description', loc: 'loc', dspAt: 'dsp_saved_at', locAt: 'loc_saved_at' };

    var store = {
        read: function (k) {
            var out = null;
            try {
                out = localStorage.getItem(PREFIX + k);
                if (out === null && localStorage.getItem(k) !== null) {
                    out = localStorage.getItem(k);
                    try { localStorage.setItem(PREFIX + k, out); } catch (e1) { /* ignore */ }
                }
            } catch (e2) {
                out = null;
            }
            return out;
        },
        write: function (k, v) {
            try {
                localStorage.setItem(PREFIX + k, v == null ? '' : String(v));
                return true;
            } catch (e) {
                return false;
            }
        }
    };

    /* ---------------- AngularJS 回填：改 DOM 的同时改 model ---------------- */

    function setValue($el, value) {
        if (!$el || !$el.length) { return; }
        var el = $el[0];
        var v = value == null ? '' : String(value);

        $el.val(v);

        try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e1) { /* ignore */ }
        try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e2) { /* ignore */ }

        try {
            var angular = window.angular;
            var expr = el.getAttribute('ng-model');
            if (angular && expr) {
                var scope = angular.element(el).scope();
                if (scope) {
                    scope.$applyAsync(function () {
                        try { scope.$eval(expr + ' = ' + JSON.stringify(v)); } catch (e3) { /* ignore */ }
                    });
                }
            }
        } catch (e4) { /* ignore */ }
    }

    /* ---------------- 名字归一化 + 自然排序 ---------------- */

    var PAD = 10;

    // 全角数字 ０-９、带圈 ①-⑳ ⓪、括号 ⑴-⒇ ⒈-⒛、㉑-㉟、㊱-㊿ 全部折算成阿拉伯数字
    function normalizeDigits(s) {
        return String(s)
            .replace(/[\uFF10-\uFF19]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFF10 + 0x30); })
            .replace(/[\u2460-\u2473]/g, function (c) { return String(c.charCodeAt(0) - 0x2460 + 1); })
            .replace(/\u24EA/g, function () { return '0'; })
            .replace(/[\u2474-\u2487]/g, function (c) { return String(c.charCodeAt(0) - 0x2474 + 1); })
            .replace(/[\u2488-\u249B]/g, function (c) { return String(c.charCodeAt(0) - 0x2488 + 1); })
            .replace(/[\u3251-\u325F]/g, function (c) { return String(c.charCodeAt(0) - 0x3251 + 21); })
            .replace(/[\u32B1-\u32BF]/g, function (c) { return String(c.charCodeAt(0) - 0x32B1 + 36); });
    }

    // 每段数字补零到 10 位后再比较，1 / 9 / 10 才会按数值排
    function sortKey(name) {
        return normalizeDigits(name).replace(/\d+/g, function (d) {
            return d.length >= PAD ? d : d.padStart(PAD, '0');
        });
    }

    function rowName(row) {
        var $name = $(row).find('span.name').first();
        if (!$name.length) { return ''; }
        return String($name.text() || '').trim();
    }

    // 用 DocumentFragment 移动节点重新排列：不重建、不 cleanData，Angular 绑定与事件都还在
    function resort(rows) {
        if (!rows || !rows.length) { return rows; }
        var parent = rows[0].parentNode;
        if (!parent) { return rows; }

        var arr = Array.prototype.slice.call(rows);
        arr.sort(function (a, b) {
            var na = rowName(a), nb = rowName(b);
            var c = sortKey(na).localeCompare(sortKey(nb));
            return c !== 0 ? c : na.localeCompare(nb);
        });

        var frag = document.createDocumentFragment();
        for (var i = 0; i < arr.length; i++) { frag.appendChild(arr[i]); }
        parent.appendChild(frag);

        // 打上标记：这批行已参与排序。后续只有「未标记的行」出现时才重排，
        // 这样既能把后到的批次排进去，又不会被自己移动节点触发的观察器拖成死循环。
        for (var j = 0; j < arr.length; j++) { arr[j].setAttribute('data-mae-sorted', '1'); }

        return $(arr);
    }

    /* ---------------- 状态判定 ---------------- */

    var STATUS_PREFIX = 'mission-list-item-';
    var PUBLISHED_STATUS = ['submitted_and_published', 'published', 'draft_of_published_mission'];

    function hasStatus(el, status) {
        var cls = STATUS_PREFIX + status;
        if (el.classList && el.classList.contains(cls)) { return true; }
        // 老写法兜底：ng-class 属性的原始值是 'mission-list-item-xxx'（外面带单引号）
        var raw = String($(el).attr('ng-class') || '').replace(/['"]/g, '').replace(/\s+/g, ' ');
        return (' ' + raw + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    /* ---------------- 过滤菜单 ---------------- */

    var FILTERS = [
        { id: 'alllist',        label: 'all',            status: null },
        { id: 'newDraftlist',   label: 'new Draft',      status: ['draft'] },
        { id: 'editDraftlist',  label: 'edit Draft',     status: ['draft_of_published_mission'] },
        { id: 'newReviewlist',  label: 'in New Review',  status: ['submitted'] },
        { id: 'editReviewlist', label: 'in Edit Review', status: ['submitted_and_published'] },
        { id: 'publishedlist',  label: 'published',      status: ['published'] }
    ];

    var currentFilter = 'alllist';
    var pendingInitialSort = false;   // 进入列表页后还没排过序
    var lastRowCount = 0;             // 上一轮看到的行数，用来发现 0 -> N 的「刚渲染完」
    var initialSortRetries = 0;       // 等 DOM 渲染的有限重试次数，防止死等

    function rowsInList() {
        return $('div.missions-list').find('div.row.mission');
    }

    // 行出现了，但名字文本还在插值中，这时候排序会排错，必须等
    function rowsReady(rows) {
        for (var i = 0; i < rows.length; i++) {
            if (!rowName(rows[i])) { return false; }
        }
        return true;
    }

    // 有没有「没参与过排序、且已经有名字」的行（后到的批次 / 整块重渲染）
    function needsSort(rows) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].getAttribute('data-mae-sorted') === '1') { continue; }
            if (rowName(rows[i])) { return true; }
        }
        return false;
    }

    function toArray(collection) {
        var out = [];
        for (var i = 0; i < collection.length; i++) { out.push(collection[i]); }
        return out;
    }

    function updateCount(elements) {
        var $c = $('#maePublishedCount');
        if (!$c.length) { return; }
        if (!elements) { elements = toArray(rowsInList()); }

        var n = 0;
        for (var i = 0; i < elements.length; i++) {
            for (var j = 0; j < PUBLISHED_STATUS.length; j++) {
                if (hasStatus(elements[i], PUBLISHED_STATUS[j])) { n++; break; }
            }
        }
        $c.text('published Count: ' + n);
    }

    function markActive(id) {
        $('#maeExtensionMenu li a').each(function () {
            this.style.fontWeight = (this.id === id) ? '600' : '';
        });
    }

    function applyFilter(id, doSort) {
        var conf = FILTERS[0];
        for (var i = 0; i < FILTERS.length; i++) {
            if (FILTERS[i].id === id) { conf = FILTERS[i]; break; }
        }
        currentFilter = conf.id;

        var rows = rowsInList();
        if (doSort && rows.length) { rows = resort(rows); }
        var elements = toArray(rows);

        for (var k = 0; k < elements.length; k++) {
            var el = elements[k];
            var show = true;
            if (conf.status) {
                show = false;
                for (var s = 0; s < conf.status.length; s++) {
                    if (hasStatus(el, conf.status[s])) { show = true; break; }
                }
            }
            el.style.display = show ? '' : 'none';
        }

        updateCount(elements);
        markActive(conf.id);
    }

    /* ---------------- 「有没有存过东西」的状态提示 ---------------- */

    function ensureStyle() {
        if (document.getElementById('maeStyle')) { return; }
        var style = document.createElement('style');
        style.id = 'maeStyle';
        style.appendChild(document.createTextNode(
            '.mae-hint{font-size:12px;line-height:1.4;margin-left:8px;opacity:.75;}' +
            '.mae-hint.mae-empty{opacity:.5;font-style:italic;}' +
            '.mae-dot{display:inline-block;width:6px;height:6px;border-radius:50%;' +
            'margin-right:5px;vertical-align:middle;background:#1D9E75;}' +
            '.mae-empty .mae-dot{background:#888780;}'
        ));
        (document.head || document.documentElement).appendChild(style);
    }

    function formatTime(v) {
        if (!v) { return ''; }
        var d = new Date(v);
        if (isNaN(d.getTime())) { return ''; }
        var p = function (n) { return (n < 10 ? '0' : '') + n; };
        return p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    }

    // 用 textNode 拼接，避免把存档内容当 HTML 插进页面
    function renderHint($hint, text, title, isEmpty) {
        if (!$hint || !$hint.length) { return; }
        $hint.empty();
        $hint.append($('<span class="mae-dot"></span>'));
        $hint.append(document.createTextNode(text));
        if (isEmpty) {
            $hint.addClass('mae-empty').removeAttr('title');
        } else {
            $hint.removeClass('mae-empty').attr('title', title || text);
        }
    }

    function refreshDspHint() {
        var $hint = $('#maeDspHint');
        if (!$hint.length) { return; }

        var name = store.read(KEY.name);
        var desc = store.read(KEY.desc);
        var parts = [];
        if (name) { parts.push('名称'); }
        if (desc) { parts.push('描述'); }
        var has = parts.length > 0;

        if (has) {
            var time = formatTime(store.read(KEY.dspAt));
            renderHint($hint,
                '已存：' + parts.join(' + ') + (time ? ' · ' + time : ''),
                '名称：' + (name || '(空)') + '\n描述：' + (desc || '(空)'),
                false);
        } else {
            renderHint($hint, '本地无存档', '', true);
        }
        $('#maeLoadDsp').prop('disabled', !has);
    }

    function refreshLocHint() {
        var $hint = $('#maeLocHint');
        if (!$hint.length) { return; }

        var loc = store.read(KEY.loc);
        var has = !!(loc && loc.length);

        if (has) {
            var brief = loc.length > 16 ? loc.slice(0, 16) + '…' : loc;
            var time = formatTime(store.read(KEY.locAt));
            renderHint($hint, '已存：' + brief + (time ? ' · ' + time : ''), loc, false);
        } else {
            renderHint($hint, '无存档', '', true);
        }
        $('#maeLoadLoc').prop('disabled', !has);
    }

    function refreshHints() {
        refreshDspHint();
        refreshLocHint();
    }

    /* ---------------- 注入：编辑器页的 save / load ---------------- */

    function saveDsp(e) {
        if (e) { e.preventDefault(); }
        var name = $('input[ng-model="mission.definition.name"]').val() || '';
        var desc = $('textarea[ng-model="mission.definition.description"]').val() || '';
        var ok = store.write(KEY.name, name) && store.write(KEY.desc, desc);
        if (ok) {
            store.write(KEY.dspAt, new Date().toISOString());
            refreshDspHint();
        } else {
            alert('保存失败：浏览器本地存储不可用（隐私模式或已禁用？）');
        }
    }

    function loadDsp(e) {
        if (e) { e.preventDefault(); }
        var name = store.read(KEY.name);
        var desc = store.read(KEY.desc);

        if (name === null && desc === null) {
            alert('没有找到已保存的名称和描述');
            return;
        }
        if (!name || !desc) {
            var msg = (!name && !desc) ? '名称和描述都是空的，仍要载入吗？'
                : (!name ? '名称是空的，仍要载入吗？' : '描述是空的，仍要载入吗？');
            if (!confirm(msg)) { return; }
        }

        setValue($('input[ng-model="mission.definition.name"]'), name || '');
        setValue($('textarea[ng-model="mission.definition.description"]'), desc || '');
        refreshDspHint();
    }

    function injectEditorTools() {
        var $name = $('input[ng-model="mission.definition.name"]');
        if (!$name.length || $('#maeSaveDsp').length) { return false; }

        ensureStyle();
        $name.first().parent().parent().append(
            '<div class="form-group" id="maeDspBox">' +
            '<button class="button" type="button" id="maeSaveDsp">save</button> ' +
            '<button class="button" type="button" id="maeLoadDsp">load</button>' +
            '<span class="mae-hint" id="maeDspHint"></span>' +
            '</div>'
        );
        $('#maeSaveDsp').on('click', saveDsp);
        $('#maeLoadDsp').on('click', loadDsp);
        refreshDspHint();
        return true;
    }

    /* ---------------- 注入：列表页的导航栏菜单 ---------------- */

    function injectNavbar() {
        if (!$('button.create-mission-button').length || $('#maeExtensionMenu').length) { return false; }
        var $nav = $('div.navbar-collapse');
        if (!$nav.length) { return false; }

        var items = '';
        for (var i = 0; i < FILTERS.length; i++) {
            items += '<li><a href="javascript:void(0)" id="' + FILTERS[i].id + '" target="_self">' +
                '<span class="glyphicon"></span> ' + FILTERS[i].label + '</a></li>';
        }

        var menu = '<ul class="nav navbar-nav navbar-login" id="maeExtensionMenu" style="float:left !important;">' +
            '<li class="dropdown">' +
            '<a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon"></span>Extension <b class="caret"></b></a>' +
            '<ul class="dropdown-menu">' + items + '</ul>' +
            '</li></ul>';

        var counter = '<ul class="nav navbar-nav navbar-login" id="maeCounterMenu" style="float:left !important;">' +
            '<li><a href="javascript:void(0)" id="maePublishedCount">published Count: 0</a></li></ul>';

        $nav.first().append(menu).append(counter);

        for (var j = 0; j < FILTERS.length; j++) {
            (function (id) {
                $('#' + id).on('click', function (e) {
                    e.preventDefault();
                    // 用户主动选了过滤器，就不再执行「首次进入自动 all」
                    pendingInitialSort = false;
                    applyFilter(id, true);
                });
            })(FILTERS[j].id);
        }

        // 此刻行数据通常还没异步渲染出来，先记账，等行出现后再按 all 排序一次
        pendingInitialSort = true;
        lastRowCount = 0;
        updateCount([]);
        scheduleReapply();
        return true;
    }

    /* ---------------- 注入：地点输入框的 save / load ---------------- */

    function saveLoc(e) {
        if (e) { e.preventDefault(); }
        var loc = $('#autocomplete').val() || '';
        if (store.write(KEY.loc, loc)) {
            store.write(KEY.locAt, new Date().toISOString());
            refreshLocHint();
        } else {
            alert('保存失败：浏览器本地存储不可用');
        }
    }

    function loadLoc(e) {
        if (e) { e.preventDefault(); }
        var loc = store.read(KEY.loc);
        if (loc === null || loc === '') {
            alert('没有找到已保存的地点');
            return;
        }
        var $input = $('#autocomplete');
        if (!$input.length) { return; }
        setValue($input, loc);
        var $search = $('span.glyphicon.glyphicon-search').first();
        if ($search.length) { $search[0].click(); }
        refreshLocHint();
    }

    function injectLocTools() {
        var $group = $('span.input-group-btn').first();
        if (!$group.length || $('#maeSaveLoc').length) { return false; }

        ensureStyle();
        $group.append(
            '<button type="button" class="smaller flat transparent" id="maeSaveLoc">save</button>' +
            '<button type="button" class="smaller flat transparent" id="maeLoadLoc">load</button>'
        );

        // 提示放在 .input-group 外面，免得破坏 Bootstrap 3 的表格布局
        var $anchor = $group.closest('.input-group');
        if (!$anchor.length) { $anchor = $group.parent(); }
        $anchor.after('<span class="mae-hint" id="maeLocHint"></span>');

        $('#maeSaveLoc').on('click', saveLoc);
        $('#maeLoadLoc').on('click', loadLoc);
        refreshLocHint();
        return true;
    }

    /* ---------------- 调度：观察 DOM 变化，替代永久轮询 ---------------- */

    var scanTimer = null;
    var filterTimer = null;

    function scan() {
        injectEditorTools();
        injectNavbar();
        injectLocTools();
    }

    function scheduleScan() {
        if (scanTimer) { return; }
        scanTimer = setTimeout(function () {
            scanTimer = null;
            try { scan(); } catch (err) { console.warn('[MAE] 注入失败', err); }
        }, 150);
    }

    function scheduleReapply() {
        if (filterTimer) { return; }
        filterTimer = setTimeout(function () {
            filterTimer = null;
            if (!$('#maeExtensionMenu').length) { return; }

            var rows = rowsInList();
            var n = rows.length;

            // 行数从 0 变成 N，说明列表刚渲染出来（首次进入 / 路由切回），补一次排序
            if (n > 0 && lastRowCount === 0) { pendingInitialSort = true; }
            lastRowCount = n;

            if (!n) { updateCount([]); return; }

            if (pendingInitialSort) {
                // 等任务 DOM 真正渲染完（行在、名字也有）再排，最多等 25 * 200ms
                if (!rowsReady(rows) && initialSortRetries < 25) {
                    initialSortRetries++;
                    scheduleReapply();
                    return;
                }
                pendingInitialSort = false;
                initialSortRetries = 0;
                applyFilter('alllist', true);   // 首次进入：显示全部 + 按 all 排序
                return;
            }

            // 后到的批次（分页 / 懒加载 / 整块重渲染）也要排进去
            if (needsSort(rows) && rowsReady(rows)) {
                applyFilter(currentFilter, true);
                return;
            }

            // 其余情况只重放显隐与计数，不重排，避免「重排 -> 观察器 -> 再重排」的自激
            applyFilter(currentFilter, false);
        }, 200);
    }

    function startWatch() {
        scan();

        if (!window.MutationObserver) {
            // 极老浏览器兜底
            setInterval(function () { try { scan(); } catch (e) { /* ignore */ } }, 2000);
            return;
        }

        var observer = new MutationObserver(function () {
            scheduleScan();
            scheduleReapply();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,          // 任务名是插值出来的，文本节点变化也得收
            attributes: true,
            attributeFilter: ['class', 'ng-class']
        });

        // AngularJS 路由切换会整块换视图，补一个信号
        window.addEventListener('hashchange', function () {
            pendingInitialSort = true;   // 切回列表页时同样按 all 重新排一次
            lastRowCount = 0;
            initialSortRetries = 0;
            setTimeout(function () { try { scan(); } catch (e) { /* ignore */ } }, 300);
        });

        // 别的标签页存过东西，这边的提示跟着变（不要再往里塞定时器，会和自己打架）
        window.addEventListener('storage', function () { refreshHints(); });
    }

    function boot() {
        if (!document.body) {
            setTimeout(boot, 200);
            return;
        }
        startWatch();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
