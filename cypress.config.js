const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // 测试文件目录（默认）
    specPattern: "cypress/e2e/**/*.cy.js",
    // 禁用视频录制（CI 环境可选）
    video: false,
  },
  // 强制无头模式运行（适配 CI 环境）
  chromeWebSecurity: false,
  headless: true
});
