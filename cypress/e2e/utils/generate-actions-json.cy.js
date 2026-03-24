// cypress/e2e/utils/generate-actions-json.cy.js
describe('生成 actions JSON 文件', () => {
  it('生成测试动作数据并写入 JSON', () => {
    // 1. 定义 actions 数据结构（根据你的需求调整）
    const testActions = [
      {
        action: 'login',
        params: { username: 'test', password: '123456' },
        timestamp: new Date().toISOString()
      },
      {
        action: 'click_button',
        params: { selector: '#submit-btn' },
        timestamp: new Date().toISOString()
      }
    ];

    // 2. 确保输出目录存在（关键：避免路径不存在导致写入失败）
    cy.task('mkdir', { path: 'cypress/fixtures/actions' }).then(() => {
      // 3. 写入 JSON 文件（使用 task 避免前端环境权限问题）
      cy.writeFile(
        'cypress/fixtures/actions/test-actions.json', // 输出路径
        JSON.stringify(testActions, null, 2) // 格式化 JSON，便于阅读
      ).then(() => {
        // 验证文件是否生成成功
        cy.readFile('cypress/fixtures/actions/test-actions.json').should('exist');
        cy.log('✅ actions JSON 文件生成成功！');
      });
    });
  });
});
