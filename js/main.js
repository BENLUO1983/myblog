// ===== 元素获取 =====
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
const menuToggle = document.getElementById("menuToggle");

// ===== 切换 section（导航高亮 + 内容显示） =====
function switchSection(targetId) {
    sections.forEach((sec) => {
        sec.classList.toggle("active", sec.id === targetId);
    });
    navLinks.forEach((link) => {
        link.classList.toggle(
            "active",
            link.getAttribute("data-section") === targetId
        );
    });
}

// ===== 移动端抽屉开关 =====
function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
    menuToggle.classList.add("open");
}

function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    menuToggle.classList.remove("open");
}

// ===== 事件绑定 =====
document.addEventListener("DOMContentLoaded", () => {
    // 导航点击
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("data-section");
            if (!targetId) return;

            // 若为锚点链接，阻止默认跳转并手动切换
            e.preventDefault();
            switchSection(targetId);

            // 移动端：点击导航后自动关闭抽屉
            if (window.innerWidth <= 768) {
                closeSidebar();
            }

            // 更新地址栏 hash（可选，便于分享/刷新定位）
            try {
                history.replaceState(null, "", "#" + targetId);
            } catch (e) {
                // 部分环境（如 file:// 协议）不允许修改 history，忽略即可
            }
        });
    });

    // 汉堡按钮
    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            if (sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    // 点击遮罩关闭
    if (overlay) {
        overlay.addEventListener("click", closeSidebar);
    }

    // 按 Esc 关闭抽屉
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeSidebar();
    });

    // 响应式：窗口放大到桌面尺寸时，清除抽屉状态
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove("open");
            overlay.classList.remove("show");
            menuToggle.classList.remove("open");
        }
    });

    // 初始加载：根据 hash 定位 section
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && document.getElementById(initialHash)) {
        switchSection(initialHash);
    }
});
