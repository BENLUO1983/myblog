 /**
  * 人力资本投资决策工具
  * 命名空间 HumanCapital，避免与 BMI、Holland 模块冲突
  */
 (function (global) {
     'use strict';

     function getVal(id) {
         return parseFloat(document.getElementById(id).value) || 0;
     }

     function calculate() {
         // 1. 读取输入
         const currentAge = getVal('hc-currentAge');
         const collegeYears = getVal('hc-collegeYears');
         const discountRate = getVal('hc-discountRate');
         const retirementAge = getVal('hc-retirementAge');

         const tuition = getVal('hc-tuition');
         const accommodation = getVal('hc-accommodation');
         const living = getVal('hc-living');
         const other = getVal('hc-other');

         const directStartSalary = getVal('hc-directStartSalary');
         const directAnnualGrowth = getVal('hc-directAnnualGrowth');
         const directCap = getVal('hc-directCap');

         const collegeStartSalary = getVal('hc-collegeStartSalary');
         const collegeAnnualGrowth = getVal('hc-collegeAnnualGrowth');
         const collegeCap = getVal('hc-collegeCap');

         const collegeScholarship = getVal('hc-collegeScholarship');
         const collegeParttime = getVal('hc-collegeParttime');

         const graduationAge = currentAge + collegeYears;
         if (graduationAge > retirementAge) {
             alert('毕业年龄超过退休年龄，请调整参数！');
             return;
         }

         // 2. 直接工作 NPV（当前到退休）
         let directNpv = 0;
         for (let age = currentAge; age <= retirementAge; age++) {
             const yearsPassed = age - currentAge;
             const salary = Math.min(
                 directStartSalary + yearsPassed * directAnnualGrowth,
                 directCap
             ) * 12;
             directNpv += salary / Math.pow(1 + discountRate, yearsPassed);
         }

         // 3. 大学期间净现金流现值
         let collegeCashFlowNpv = 0;
         for (let age = currentAge; age < graduationAge; age++) {
             const yearsPassed = age - currentAge;
             const annualDirectCost = tuition + accommodation + living + other;
             const currentDirectSalary = Math.min(
                 directStartSalary + yearsPassed * directAnnualGrowth,
                 directCap
             ) * 12;
             const collegeAnnualIncome = collegeScholarship + collegeParttime * 12;
             const annualNetCash = collegeAnnualIncome - (annualDirectCost + currentDirectSalary);
             collegeCashFlowNpv += annualNetCash / Math.pow(1 + discountRate, yearsPassed);
         }

         // 4. 大学毕业后收入现值
         let collegePostGradNpv = 0;
         for (let age = graduationAge; age <= retirementAge; age++) {
             const yearsPassed = age - currentAge;
             const yearsSinceGrad = age - graduationAge;
             const salary = Math.min(
                 collegeStartSalary + yearsSinceGrad * collegeAnnualGrowth,
                 collegeCap
             ) * 12;
             collegePostGradNpv += salary / Math.pow(1 + discountRate, yearsPassed);
         }

         const collegeTotalNpv = collegeCashFlowNpv + collegePostGradNpv;

         // 5. 展示结果
         document.getElementById('hc-directNpv').textContent = Math.round(directNpv).toLocaleString('zh-CN');
         document.getElementById('hc-collegeNpv').textContent = Math.round(collegeTotalNpv).toLocaleString('zh-CN');

         const rec = document.getElementById('hc-recommendation');
         if (collegeTotalNpv > directNpv) {
             rec.innerHTML =
                 '<p style="color:#27ae60;font-weight:bold;margin-top:10px;">📌 强烈推荐：优先选择读大学！</p>' +
                 '<p>读大学的总净现值（NPV）比直接工作高 <span class="highlight">' + Math.round(collegeTotalNpv - directNpv).toLocaleString('zh-CN') + ' 元</span>，长期收益更优。</p>' +
                 '<p><small>关键原因：毕业后薪资增长的长期回报远超过直接工作的短期现金流，奖学金+兼职收入部分抵消了成本。（计算结果因参数不同可能出现较大差异，数据仅供参考）</small></p>';
         } else {
             rec.innerHTML =
                 '<p style="color:#dc3545;font-weight:bold;margin-top:10px;">⚠️ 建议：优先选择直接工作。</p>' +
                 '<p>直接工作的总净现值（NPV）比读大学高 <span class="highlight">' + Math.round(directNpv - collegeTotalNpv).toLocaleString('zh-CN') + ' 元</span>，短期现金流更稳定。</p>' +
                 '<p><small>关键原因：大学期间成本+机会成本较高，且毕业后薪资增长幅度不足以覆盖前期投入。（计算结果因参数不同可能出现较大差异，数据仅供参考）</small></p>';
         }

         const resultEl = document.getElementById('hc-result');
         resultEl.style.display = 'block';
         resultEl.scrollIntoView({ behavior: 'smooth' });
     }

     global.HumanCapital = { calculate: calculate };
 })(window);
