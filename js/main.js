/**
 * 个人主页主交互逻辑
 * - 栏目切换（单页导航 + hashchange 支持浏览器前进/后退）
 * - 移动端抽屉式侧边栏（汉堡按钮、遮罩、Esc、外部点击关闭）
 * - 暗黑模式（跟随系统 + 手动切换 + localStorage 记忆）
 * - GoatCounter 访问量图片防缓存刷新
 */
(function () {
    'use strict';

    /* ===== 栏目切换 ===== */
    function initNavigation() {
        var navLinks = document.querySelectorAll('.nav-link');
        var sections = document.querySelectorAll('.section');

        function activateSection(targetId) {
            if (!targetId) return;
            var matchedLink = document.querySelector('.nav-link[data-section="' + targetId + '"]');
            if (!matchedLink) return;

            navLinks.forEach(function (l) { l.classList.remove('active'); });
            matchedLink.classList.add('active');

            sections.forEach(function (sec) { sec.classList.remove('active'); });
            var target = document.getElementById(targetId);
            if (target) target.classList.add('active');

            /* 单页栏目切换也计入一次浏览 */
            trackSection(targetId);
        }

        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var targetId = link.getAttribute('data-section');
                /* 外链（href 指向独立页面）不拦截，正常跳转 */
                var href = link.getAttribute('href') || '';
                if (href.indexOf('#') !== 0) return;
                e.preventDefault();
                activateSection(targetId);
                try {
                    history.replaceState(null, '', '#' + targetId);
                } catch (err) { /* 忽略特殊协议下的报错 */ }
                closeSidebar();
            });
        });

        /* 浏览器前进/后退也能切换栏目 */
        window.addEventListener('hashchange', function () {
            var hash = window.location.hash.replace('#', '');
            activateSection(hash);
        });

        /* 初始按 hash 激活 */
        var hash = window.location.hash.replace('#', '');
        activateSection(hash);
    }

    /* ===== 移动端抽屉 ===== */
    function openSidebar() {
        var sidebar = document.getElementById('sidebar');
        var overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        var sidebar = document.getElementById('sidebar');
        var overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    function initSidebar() {
        var toggle = document.getElementById('menuToggle');
        var overlay = document.getElementById('sidebarOverlay');

        if (toggle) toggle.addEventListener('click', openSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);

        /* Esc 关闭抽屉 */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeSidebar();
        });

        /* 窗口跨越断点时清理状态 */
        var mq = window.matchMedia('(min-width: 769px)');
        function handleResize(e) {
            if (e.matches) closeSidebar();
        }
        if (mq.addEventListener) mq.addEventListener('change', handleResize);
        else if (mq.addListener) mq.addListener(handleResize);
    }

    /* ===== 暗黑模式 ===== */
    function initTheme() {
        var toggle = document.getElementById('themeToggle');
        var saved = null;
        try { saved = localStorage.getItem('theme'); } catch (e) {}
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (saved === 'dark' || saved === 'light') {
            document.documentElement.setAttribute('data-theme', saved);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        updateThemeIcon();

        if (toggle) toggle.addEventListener('click', function () {
            var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            var next = cur === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
            updateThemeIcon();
        });

        /* 跟随系统变化 */
        var sysDark = window.matchMedia('(prefers-color-scheme: dark)');
        function handleSysChange(e) {
            var manual = null;
            try { manual = localStorage.getItem('theme'); } catch (e) {}
            if (!manual) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                updateThemeIcon();
            }
        }
        if (sysDark.addEventListener) sysDark.addEventListener('change', handleSysChange);
        else if (sysDark.addListener) sysDark.addListener(handleSysChange);
    }

    function updateThemeIcon() {
        var toggle = document.getElementById('themeToggle');
        if (!toggle) return;
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        toggle.textContent = dark ? '☀️' : '🌙';
        toggle.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
    }

    /* ===== GoatCounter 访问统计 =====
     * 采用「纯手动打点」：直接用 new Image().src 向 GoatCounter 的
     * /count 端点发请求，不依赖 count.js 是否加载成功，确保一定上报。
     * （页面底部 count.js 作为标准方式并存，服务端自动去重）
     * 展示端：给计数图片追加时间戳，绕过浏览器/GoatCounter 的 4 小时缓存。
     */
    var GC_ENDPOINT = 'https://laobanban.goatcounter.com/count';

    /* 上报一条浏览记录，path 为当前栏目（用于后台分页面统计） */
    function trackPageview(path) {
        var p = path || (window.location.pathname + window.location.hash);
        var url = GC_ENDPOINT + '?p=' + encodeURIComponent(p) +
                  '&t=' + new Date().getTime() + '&src=manual';
        try {
            var beacon = new Image();
            beacon.src = url;
            /* sendBeacon 让页面跳转/卸载时也能可靠上报 */
            if (navigator.sendBeacon) {
                try { navigator.sendBeacon(url); } catch (e) {}
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    function initCounter() {
        /* 1. 展示端：给计数图片追加时间戳，绕过缓存，即时刷新数字 */
        var img = document.getElementById('gc-counter');
        if (img && img.src) {
            img.src = img.src.split('?')[0] + '?t=' + new Date().getTime();
        }

        /* 2. 上报端：页面首次加载上报一次 */
        trackPageview(window.location.pathname + (window.location.hash || ''));
    }

    /* 栏目切换时手动上报，让单页浏览也被计入 */
    function trackSection(targetId) {
        if (!targetId) return;
        trackPageview(window.location.pathname + '#' + targetId);
    }

    /* ===== 初始化 ===== */
    document.addEventListener('DOMContentLoaded', function () {
        initNavigation();
        initSidebar();
        initTheme();
        initCounter();
    });
})(window);
