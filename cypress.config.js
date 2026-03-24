// cypress.config.js（Cypress 10+）
const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const path = require('path');

// 确保报告目录存在（关键：避免因目录不存在导致报告生成失败）
function ensureReportDirExists() {
  const reportDir = path.join(__dirname, 'cypress/reports');
  fs.ensureDirSync(reportDir);
  fs.ensureDirSync(path.join(reportDir, 'mochawesome'));
}

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // 测试执行前先创建报告目录
      on('before:run', () => {
        ensureReportDirExists();
      });
      
      // 配置 mochawesome 报告
      const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');
      on('before:run', async (details) => {
        console.log('准备生成测试报告...');
        await beforeRunHook(details);
      });
      on('after:run', async () => {
        console.log('生成测试报告中...');
        await afterRunHook();
      });
    },
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true, // 生成测试趋势图
    reportPageTitle: '我的Cypress测试报告',
    embeddedScreenshots: true, // 截图嵌入报告
    inlineAssets: true, // 资源内联（避免报告路径问题）
    saveAllAttempts: false, // 只保存最后一次测试尝试
    reportDir: 'cypress/reports/mochawesome', // 报告输出目录
  },
});
