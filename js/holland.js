/**
 * 霍兰德职业兴趣测评（完整版 · 60题）
 * 命名空间 Holland。
 * ID 兼容：独立页面（holland.html）用无前缀 ID（page-intro/test/result），
 *         主页内嵌（#holland-app）用 hl- 前缀 ID（hl-page-intro...）。
 * 通过 $() 自动互转，同一份 JS 两套环境均可运行。
 */
(function (global) {
    'use strict';

    /* ===== 题目数据 ===== */
    const questions = [
        "我喜欢把一件事情做完后再做另一件事。",
        "在工作中我喜欢独自筹划，不愿受别人干涉。",
        "在集体讨论中，我往往保持沉默。",
        "我喜欢做戏剧、音乐、歌舞、新闻采访等方面的工作。",
        "每次写信我都一挥而就，不再重复。",
        "我经常不停地思考某一问题，直到想出正确的答案。",
        "对别人借我的和我借别人的东西，我都能记得很清楚。",
        "我喜欢抽象思维的工作，不喜欢动手的工作。",
        "我喜欢成为人们注意的焦点。",
        "我喜欢不时地夸耀一下自己取得的好成就。",
        "我曾经渴望有机会参加探险。",
        "当我独自一人时，会感到更愉快。",
        "我喜欢在做事情前，对此事情做出细致的安排。",
        "我讨厌修理自行车、电器一类的工作。",
        "我喜欢参加各种各样的聚会。",
        "我愿意从事虽然工资少、但是比较稳定的职业。",
        "音乐能使我陶醉。",
        "我办事很少思前想后。",
        "我喜欢经常请示上级。",
        "我喜欢需要运用智力的游戏。",
        "我很难做那种需要持续集中注意力的工作。",
        "我喜欢亲自动手制作一些东西，从中得到乐趣。",
        "我的动手能力很差。",
        "和不熟悉的人交谈对我来说毫不困难。",
        "和别人谈判时，我总是很容易放弃自己的观点。",
        "我很容易结识同性朋友。",
        "对于社会问题，我通常持中庸的态度。",
        "当我开始做一件事情后，即使碰到再多的困难，我也要执著地干下去。",
        "我是一个沉静而不易动感情的人。",
        "当我工作时，我喜欢避免干扰。",
        "我的理想是当一名科学家。",
        "与言情小说相比，我更喜欢推理小说。",
        "有些人太霸道，有时明明知道他们是对的，也要和他们对着干。",
        "我爱幻想。",
        "我总是主动地向别人提出自己的建议。",
        "我喜欢使用榔头一类的工具。",
        "我乐于解除别人的痛苦。",
        "我更喜欢自己下了赌注的比赛或游戏。",
        "我喜欢按部就班地完成要做的工作。",
        "我希望能经常换不同的工作来做。",
        "我总留有充裕的时间去赴约会。",
        "我喜欢阅读自然科学方面的书籍和杂志。",
        "如果掌握一门手艺并能以此为生，我会感到非常满意。",
        "我曾渴望当一名汽车司机。",
        "听别人谈“家中被盗”一类的事，很难引起我的同情。",
        "如果待遇相同，我宁愿当商品推销员，而不愿当图书管理员。",
        "我讨厌跟各类机械打交道。",
        "我小时候经常把玩具拆开，把里面看个究竟。",
        "当接受新任务后，我喜欢以自己的独特方法去完成它。",
        "我有文艺方面的天赋。",
        "我喜欢把一切安排得整整齐齐、井井有条。",
        "我喜欢作一名教师。",
        "和一群人在一起的时候，我总想不出恰当的话来说。",
        "看情感影片时，我常禁不住眼圈红润。",
        "我讨厌学数学。",
        "在实验室里独自做实验会令我寂寞难耐。",
        "对于急躁、爱发脾气的人，我仍能以礼相待。",
        "遇到难解答的问题时，我常常放弃。",
        "大家公认我是一名勤劳踏实的、愿为大家服务的人。",
        "我喜欢在人事部门工作。"
    ];

    /* ===== 计分键（来自原量表说明）===== */
    const scoring = {
        C: { yes: [7, 19, 29, 39, 41, 51, 57], no: [5, 18, 40] },
        R: { yes: [2, 13, 22, 36, 43], no: [14, 23, 44, 47, 48] },
        I: { yes: [6, 8, 20, 30, 31, 42], no: [21, 55, 56, 58] },
        E: { yes: [11, 24, 28, 35, 38, 46, 60], no: [3, 16, 25] },
        S: { yes: [26, 37, 52, 59], no: [1, 12, 15, 27, 45, 53] },
        A: { yes: [4, 9, 10, 17, 33, 34, 49, 50, 54], no: [32] }
    };
    const TYPES = ["R", "I", "A", "S", "E", "C"];
    const TYPE_INFO = {
        R: { name: "现实型", color: "#e74c3c", full: "现实型 R（Realistic）" },
        I: { name: "研究型", color: "#8e44ad", full: "研究型 I（Investigative）" },
        A: { name: "艺术型", color: "#e67e22", full: "艺术型 A（Artistic）" },
        S: { name: "社会型", color: "#27ae60", full: "社会型 S（Social）" },
        E: { name: "企业型", color: "#d35400", full: "企业型 E（Enterprising）" },
        C: { name: "常规型", color: "#2980b9", full: "常规型 C（Conventional）" }
    };

    /* ===== 职业匹配对照表 ===== */
    const JOB_MAP = {
        RIA: "牙科技术员、陶工、建筑设计员、模型工、细木工、制作链条人员",
        RIS: "厨师、林务员、跳水员、电器修理、眼镜制作、电工、纺织机器装配工、焊接工",
        RIE: "建筑与桥梁工程、环境工程、航空工程、公路工程、机械工程、矿业工程、制图员、农民、汽车修理、管工",
        RIC: "船上工作人员、牙医助手、制帽工、石匠、机器制造、钟表装配和检验、鞋匠、锁匠、装配工、木匠",
        IAR: "人类学家、天文学家、化学家、物理学家、医学病理、动物标本剥制者、艺术品管理者",
        IAS: "经济学家、财政经济学家、国际贸易经济学家、实验心理学家、工程师、内科医生、数学家",
        ISA: "实验心理学家、普通心理学家、发展心理学家、临床心理学家、皮肤科/精神科/妇产科/眼科医生、护士",
        IES: "细菌学家、生理学家、化学专家、地质专家、纺织技术专家、医院药剂师",
        IRC: "飞机领航员、飞行员、物理实验室技师、农业技术专家、生物技师、工程技术员、工具设计者",
        ASE: "戏剧导演、舞蹈教师、广告撰稿人、专栏作者、记者、演员、英语翻译",
        ASI: "音乐教师、乐器教师、美术教师、管弦乐指挥、歌星、演奏家、哲学家、作家、广告经理",
        AES: "流行歌手、舞蹈演员、电影导演、广播节目主持人、舞蹈教师、喜剧演员、模特",
        AIS: "画家、剧作家、编辑、评论家、时装艺术大师、新闻摄影师、文学作者",
        AIR: "建筑师、画家、摄影师、绘图员、雕刻家、环境美化工、包装设计师、陶器设计师",
        SEC: "社会活动家、教育咨询者、宿舍管理员、旅馆经理、饮食服务管理员",
        SEI: "大学校长、学院院长、医院行政管理员、历史学家、职业学校教师",
        SIA: "社会学家、心理咨询者、政治科学家、大学教师、研究生助教、成人教育教师",
        SIE: "营养学家、饮食学家、海关检查员、安全检查员、税务稽查员、校长",
        ESA: "博物馆馆长、音乐器材售货员、导游、事务长、服务员、法官、律师",
        EAS: "法官、律师、公证人",
        ERI: "建筑物管理员、工业工程师、护士长、农场管理员",
        ECI: "银行行长、审计员、信用管理员、地产管理员、商业管理员",
        CRI: "簿记员、会计、记时员、打字员、按键操作工、复印机操作工",
        CIS: "记账员、顾客服务员、土地测量员、保险公司职员、会计师、估价员",
        CSR: "运货代理商、铁路职员、交通检查员、薄记员、出纳员、银行财务职员",
        CSA: "秘书、图书管理员、办公室办事员",
        CRS: "仓库保管员、档案管理员、缝纫工、收款人"
    };
    const FALLBACK_JOBS = {
        R: "土木/机械工程师、技术工人、农民、电工、装配工、驾驶员",
        I: "科研人员、数学家、医生、工程师、程序员、分析师",
        A: "诗人、艺术家、作家、导演、设计师、音乐/美术教师",
        S: "教师、辅导员、护士、社工、咨询师、牧师",
        E: "企业家、推销员、经理、政治家、经纪人、制片人",
        C: "会计、出纳、秘书、图书管理员、银行职员、行政文员"
    };

    /* ===== 状态 ===== */
    const PER_PAGE = 10;
    let currentPage = 0;
    let answers = [];

    /* ===== 工具函数（ID 兼容两套环境）===== */
    const PAGE_IDS = { intro: 'page-intro', test: 'page-test', result: 'page-result' };
    const HL_PAGE_IDS = { intro: 'hl-page-intro', test: 'hl-page-test', result: 'hl-page-result' };
    const useHlPrefix = !!(function () {
        return document.getElementById('holland-app') && document.getElementById('hl-page-intro');
    })();
    function pageId(key) { return (useHlPrefix ? HL_PAGE_IDS : PAGE_IDS)[key]; }

    function $(id) {
        var el = document.getElementById(id);
        if (el) return el;
        /* 无前缀 / hl- 前缀自动互转兜底 */
        var alt = id.indexOf('hl-') === 0 ? id.replace(/^hl-/, '') : 'hl-' + id;
        return document.getElementById(alt);
    }
    function qIndex(itemNum) { return itemNum - 1; }

    function showPage(pageId) {
        [PAGE_IDS.intro, PAGE_IDS.test, PAGE_IDS.result].forEach(function (p) {
            var el = $(p);
            if (el) el.style.display = 'none';
        });
        var target = $(pageId);
        if (target) target.style.display = 'block';
    }

    function resetState() {
        answers = new Array(questions.length).fill(null);
        currentPage = 0;
    }

    /* ===== 流程控制 ===== */
    function startTest() {
        resetState();
        showPage(pageId('test'));
        renderPage();
    }

    function renderPage() {
        const start = currentPage * PER_PAGE;
        const end = Math.min(start + PER_PAGE, questions.length);
        const container = $('questions');
        if (!container) return;
        container.innerHTML = '';
        for (let i = start; i < end; i++) {
            const q = document.createElement('div');
            q.className = 'hl-q' + (answers[i] ? ' answered' : '');
            q.innerHTML =
                '<div class="hl-qtext"><span class="hl-num">' + (i + 1) + '.</span>' + questions[i] + '</div>' +
                '<div class="hl-opts">' +
                '<label><input type="radio" name="hl-q' + i + '" value="Y" ' + (answers[i] === 'Y' ? 'checked' : '') + ' onchange="Holland._answer(' + i + ',\'Y\')"> 是</label>' +
                '<label><input type="radio" name="hl-q' + i + '" value="N" ' + (answers[i] === 'N' ? 'checked' : '') + ' onchange="Holland._answer(' + i + ',\'N\')"> 否</label>' +
                '</div>';
            container.appendChild(q);
        }
        const totalPages = Math.ceil(questions.length / PER_PAGE);
        var gt = $('groupTitle');
        if (gt) gt.textContent = '第 ' + (currentPage + 1) + ' / ' + totalPages + ' 组题目';
        updateProgress();
        var bp = $('btnPrev'); if (bp) bp.disabled = currentPage === 0;
        var bn = $('btnNext'); if (bn) bn.textContent = (end >= questions.length) ? '提交并查看结果 →' : '下一页 →';
    }

    function updateProgress() {
        const answered = answers.filter(function (a) { return a !== null; }).length;
        const pct = answered / questions.length * 100;
        var bar = $('progBar'); if (bar) bar.style.width = pct + '%';
        var lab = $('progLabel'); if (lab) lab.textContent = answered + ' / ' + questions.length + ' 题已作答';
    }

    function answer(i, val) {
        answers[i] = val;
        renderPage();
    }

    function nextPage() {
        const start = currentPage * PER_PAGE;
        const end = Math.min(start + PER_PAGE, questions.length);
        const unanswered = [];
        for (let i = start; i < end; i++) if (!answers[i]) unanswered.push(i + 1);
        if (unanswered.length) {
            if (!confirm('本页还有 ' + unanswered.length + ' 题未作答（第 ' + unanswered.join('、') + ' 题），确定要跳过吗？')) {
                return;
            }
        }
        if (end >= questions.length) { finishTest(); return; }
        currentPage++;
        renderPage();
        window.scrollTo(0, 0);
    }

    function prevPage() {
        if (currentPage > 0) { currentPage--; renderPage(); window.scrollTo(0, 0); }
    }

    /* ===== 计分 & 结果 ===== */
    function computeScores() {
        const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        TYPES.forEach(function (t) {
            scoring[t].yes.forEach(function (n) { if (answers[qIndex(n)] === 'Y') scores[t] += 1; });
            scoring[t].no.forEach(function (n) { if (answers[qIndex(n)] === 'N') scores[t] += 1; });
        });
        return scores;
    }

    function finishTest() {
        const un = answers.map(function (a, i) { return a === null ? i + 1 : null; }).filter(function (x) { return x; });
        if (un.length) {
            if (!confirm('还有 ' + un.length + ' 题未作答，提交后将按未作答计分。点「取消」可返回继续作答。\n未答题号：' + un.join('、'))) {
                return;
            }
        }
        const scores = computeScores();
        const ranked = TYPES.slice().sort(function (a, b) { return scores[b] - scores[a]; });
        const top3 = ranked.slice(0, 3);
        const code = top3.join('');

        var cl = $('codeLetters'); if (cl) cl.textContent = code;
        var cs = $('codeScores');
        if (cs) cs.textContent = top3.map(function (t) { return TYPE_INFO[t].name + ' ' + scores[t] + '分'; }).join('  ·  ');

        renderBarChart(scores);
        renderScoreGrid(scores, top3);
        renderTypeDesc(top3, scores);
        renderJobs(code, top3);

        showPage(pageId('result'));
        window.scrollTo(0, 0);
    }

    function renderBarChart(scores) {
        const max = 10;
        var box = $('barChart');
        if (!box) return;
        box.innerHTML = '';
        TYPES.forEach(function (t) {
            const h = Math.max(8, scores[t] / max * 160);
            const item = document.createElement('div');
            item.className = 'hl-baritem';
            item.innerHTML = '<div class="hl-bar" style="height:' + h + 'px;background:' + TYPE_INFO[t].color + '"></div><div class="hl-barlabel">' + t + '</div><div>' + scores[t] + '</div>';
            box.appendChild(item);
        });
    }

    function renderScoreGrid(scores, top3) {
        var box = $('scoreGrid');
        if (!box) return;
        box.innerHTML = '';
        TYPES.slice().sort(function (a, b) { return scores[b] - scores[a]; }).forEach(function (t) {
            const cell = document.createElement('div');
            cell.className = 'hl-score-cell';
            cell.style.background = top3.indexOf(t) >= 0 ? TYPE_INFO[t].color : '#95a5a6';
            cell.innerHTML = '<div>' + TYPE_INFO[t].full + '</div><div class="hl-sn">' + scores[t] + '</div><div>分</div>';
            box.appendChild(cell);
        });
    }

    function renderTypeDesc(top3, scores) {
        const desc = top3.map(function (t) { return TYPE_INFO[t].full; }).join(' + ');
        const traits = {
            R: "偏好动手操作、具体实用的活动，稳重实际",
            I: "偏好思考分析、探索研究，理性独立",
            A: "偏好表达创造、艺术审美，想象丰富",
            S: "偏好助人服务、教育沟通，友善合作",
            E: "偏好领导影响、说服管理，自信冒险",
            C: "偏好规则秩序、文书数据，谨慎细致"
        };
        var td = $('typeDesc');
        if (!td) return;
        td.innerHTML =
            '<p><b>你的霍兰德代码：' + desc + '</b></p>' +
            '<p style="margin-top:8px;">' + top3.map(function (t) { return '<b style="color:' + TYPE_INFO[t].color + '">' + TYPE_INFO[t].name + '</b>——' + traits[t]; }).join('；') + '。</p>' +
            '<p style="margin-top:8px;">其中<b>第一位（' + TYPE_INFO[top3[0]].name + '）</b>最能代表你的核心职业兴趣，前两位的组合最具参考意义。</p>';
    }

    function renderJobs(code, top3) {
        let jobs = JOB_MAP[code];
        if (!jobs) {
            jobs = JOB_MAP[code.substring(0, 2)] || JOB_MAP[code.substring(1, 3)];
            if (!jobs) {
                jobs = top3.map(function (t) { return FALLBACK_JOBS[t]; }).join('；');
            } else {
                jobs = jobs + '（另可参考）' + top3.map(function (t) { return FALLBACK_JOBS[t]; }).join('；');
            }
        }
        var jl = $('jobList');
        if (jl) jl.innerHTML = '<b>代码 ' + code + ' 对应职业方向：</b><br>' + jobs.replace(/、/g, '、');
    }

    function restart() {
        resetState();
        showPage(pageId('intro'));
        window.scrollTo(0, 0);
    }

    /* ===== 公开接口 ===== */
    global.Holland = {
        startTest: startTest,
        nextPage: nextPage,
        prevPage: prevPage,
        restart: restart,
        _answer: answer
    };
})(window);
