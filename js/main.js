 /**
  * 个人主页主交互逻辑
  * - 栏目切换（单页导航）
  * - 计算、测评已拆分为独立页面（capital.html / holland.html），由入口卡片跳转
  */
 (function () {
     'use strict';

     /* ===== 栏目切换 ===== */
     function initNavigation() {
         var navLinks = document.querySelectorAll('.nav-link');
         var sections = document.querySelectorAll('.section');

         navLinks.forEach(function (link) {
             link.addEventListener('click', function (e) {
                 var targetId = link.getAttribute('data-section');
                 /* 外链（href 指向独立页面）不拦截，正常跳转 */
                 if (link.getAttribute('href') && link.getAttribute('href').indexOf('#') !== 0) return;
                 e.preventDefault();

                 navLinks.forEach(function (l) { l.classList.remove('active'); });
                 link.classList.add('active');

                 sections.forEach(function (sec) { sec.classList.remove('active'); });
                 var target = document.getElementById(targetId);
                 if (target) {
                     target.classList.add('active');
                 }

                 history.replaceState(null, '', '#' + targetId);
             });
         });

         var hash = window.location.hash.replace('#', '');
         if (hash) {
             var matched = document.querySelector('.nav-link[data-section="' + hash + '"]');
             if (matched) matched.click();
         }
     }

     /* ===== 初始化 ===== */
     document.addEventListener('DOMContentLoaded', function () {
         initNavigation();
     });
 })(window);
