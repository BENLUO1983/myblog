/**
 * 页面访问统计模块
 * 使用 localStorage 实现，无需后端、无需联网
 * 统计指标：PV（页面访问量）、UV（独立访客数）
 *
 * 说明：纯前端统计仅在同一浏览器内准确。
 * 如需真实全量统计，后期可接入 Google Analytics / 百度统计 / 自建后端。
 */

(function () {
    'use strict';

    var STORAGE_KEY = 'personal_homepage_visits';
    var VISITOR_KEY = 'personal_homepage_visitor_id';

    // 读取或初始化存储
    function getStore() {
        var store = localStorage.getItem(STORAGE_KEY);
        return store ? JSON.parse(store) : { pv: 0, visitors: {} };
    }

    function saveStore(store) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }

    // 生成简单访客标识
    function getOrCreateVisitorId() {
        var id = localStorage.getItem(VISITOR_KEY);
        if (!id) {
            id = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(VISITOR_KEY, id);
        }
        return id;
    }

    // 核心：记录一次访问
    function recordVisit() {
        var store = getStore();
        var visitorId = getOrCreateVisitorId();
        var today = new Date().toDateString();

        // PV +1
        store.pv += 1;

        // UV：按访客 + 每日去重
        if (!store.visitors[visitorId]) {
            store.visitors[visitorId] = {};
        }
        // 新的一天或新访客则计为一次独立访问
        if (store.visitors[visitorId].lastDay !== today) {
            store.visitors[visitorId].lastDay = today;
            store.visitors[visitorId].count = (store.visitors[visitorId].count || 0) + 1;
        }

        saveStore(store);
        return store;
    }

    // 获取统计数据
    function getStats() {
        var store = getStore();
        // UV = 有过访问记录的独立访客数
        var uv = 0;
        for (var key in store.visitors) {
            if (store.visitors.hasOwnProperty(key) && store.visitors[key].count > 0) {
                uv += 1;
            }
        }
        return { pv: store.pv, uv: uv };
    }

    // 重置统计（可在控制台调用 resetVisits()）
    function resetVisits() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(VISITOR_KEY);
    }

    // 页面加载完成后更新界面
    function init() {
        var store = recordVisit();
        var stats = getStats();

        // 更新侧边栏数字
        var visitCountEl = document.getElementById('visit-count');
        if (visitCountEl) {
            visitCountEl.textContent = stats.pv;
        }

        // 弹出提示
        var toast = document.getElementById('stat-toast');
        var toastCount = document.getElementById('toast-count');
        if (toast && toastCount) {
            toastCount.textContent = stats.pv;
            setTimeout(function () {
                toast.classList.add('show');
            }, 500);
            setTimeout(function () {
                toast.classList.remove('show');
            }, 4000);
        }
    }

    // 暴露全局接口
    window.VisitStats = {
        get: getStats,
        reset: resetVisits
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
