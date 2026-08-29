# 个人主页

简洁、易扩展的个人主页，包含四个栏目，开箱即用（双击 `index.html` 即可在浏览器打开，无需联网、无需后端）。

## 📁 文件结构

```
personal-homepage/
├── index.html          # 主页面（四个栏目内容都在这里编辑）
├── css/
│   └── style.css       # 样式
├── js/
│   ├── visits.js       # 页面访问统计（PV / UV）
│   └── main.js         # 交互逻辑（栏目切换、计算、测评）
└── README.md
```

## 🚀 快速开始

1. 双击 `index.html` 打开，即可看到完整页面
2. 左下角实时显示**访问量**，右下角弹出"第 N 位访客"提示
3. 点击左侧导航切换四个栏目

## ✏️ 如何添加/修改内容

### 1. 自我介绍
编辑 `index.html` 中 `<section id="intro">` 区块，修改姓名、研究方向等 `.info-item`，或在 `.card` 内新增段落。

### 2. 学科动态
在 `index.html` 的 `<div class="news-list">` 内，**复制一份** `.news-item` 结构，更新日期和内容即可：
```html
<article class="news-item">
    <div class="news-date">2026-08-25</div>
    <div class="news-body">
        <h3>新动态标题</h3>
        <p>内容描述……</p>
    </div>
</article>
```

### 3. 计算工具
在 `<section id="tools">` 内复制 `.tool-card` 结构即可新增计算器。现有 BMI 示例可作模板。

### 4. 测评
在 `<section id="assess">` 内可嵌入问卷。现有简易性格倾向测评可作参考。若需接入霍兰德量表等完整测评，可参照此结构扩展。

## 📊 访问统计说明

- 采用 **localStorage** 实现，**无需后端、无需联网**
- 统计指标：**PV**（页面访问量）、**UV**（独立访客数，按访客+每日去重）
- 数据仅保存在**访问者自己的浏览器**中，跨设备/跨浏览器不互通

> ⚠️ **局限性**：纯前端统计无法汇总所有真实访客。正式部署如需全量准确统计，建议接入：
> - Google Analytics / 百度统计（免费、简单）
> - 自建后端接口（在 `visits.js` 的 `recordVisit` 中增加 `fetch()` 上报）

### 调试接口（浏览器控制台）
```javascript
VisitStats.get()    // 查看当前统计 {pv, uv}
VisitStats.reset()  // 重置统计
```

## 🎨 自定义样式
修改 `css/style.css` 顶部的 `:root` 变量即可换肤：
```css
--primary: #4a6fa5;      /* 主色调 */
--primary-dark: #3a5a8a; /* 深色调 */
--radius: 12px;          /* 圆角大小 */
```

## 📱 响应式
已适配移动端，窄屏下侧边栏自动转为顶部横向导航。
