const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // 1. 配置测试失败时自动截图（默认开启，指定保存路径）
      on('after:screenshot', (details) => {
        // 截图保存到 cypress/screenshots/[用例名称].png
        console.log('截图路径：', details.path);
      });

      // 2. 配置测试失败时自动录屏（默认开启，指定保存路径）
      on('after:video', (video) => {
        // 视频保存到 cypress/videos/[用例名称].mp4
        console.log('视频路径：', video.path);
      });
    },
    // 禁用支持文件（可选，避免无关警告）
    supportFile: false,
    // 测试文件路径（默认）
    specPattern: "cypress/e2e/**/*.cy.js",
  },
  // 全局配置：截图/视频保存路径
  screenshotsFolder: "./cypress/screenshots",
  videosFolder: "./cypress/videos",
  // 报告相关配置
  reporter: "cypress-multi-reporters", // 多报告器
  reporterOptions: {
    configFile: "reporter-config.json", // 报告器配置文件
  },
  // CI 环境强制无头运行
  headless: true,
  // 禁用视频（可选，减少耗时，如需保留则设为 true）
  video: false,
});
