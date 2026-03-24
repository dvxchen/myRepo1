// cypress/support/e2e.js
// ***********************************************************
// 全局测试环境配置文件
// ***********************************************************

// 1. 导入 Cypress 自带的命令（如 cy.visit、cy.get 等）
import './commands';

// 2. 配置测试全局钩子（可选）
beforeEach(() => {
  // 每个测试用例执行前的操作：例如设置视口大小、清除缓存
  cy.viewport(1920, 1080); // 设置浏览器视口为1080P
  cy.clearLocalStorage(); // 清除本地存储
});

afterEach(() => {
  // 每个测试用例执行后的操作：例如捕获失败截图（Cypress 已默认支持，可自定义）
  if (Cypress.currentTest.state === 'failed') {
    cy.screenshot(`failed-test-${Cypress.currentTest.title}`);
  }
});

// 3. 禁用未捕获的异常警告（可选，避免干扰测试）
Cypress.on('uncaught:exception', (err, runnable) => {
  // 返回 false 可以阻止 Cypress 因未捕获异常而失败测试
  return false;
});
