// send-email.js
const nodemailer = require('nodemailer');
const fs = require('fs');

// 读取环境变量
const config = {
  // 邮箱配置
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD,
  to: process.env.EMAIL_TO,
  // 测试结果（从 Actions 输出变量获取）
  total: process.env.CYPRESS_TOTAL || 0,
  passes: process.env.CYPRESS_PASSES || 0,
  failures: process.env.CYPRESS_FAILURES || 0,
  // GitHub 信息
  repo: process.env.GITHUB_REPOSITORY,
  runId: process.env.GITHUB_RUN_ID,
  jobStatus: process.env.JOB_STATUS
};

// 验证邮箱配置
if (!config.host || !config.user || !config.pass || !config.to) {
  console.error('❌ 缺少邮箱配置！');
  process.exit(1);
}

// 构建邮件内容
const statusText = config.jobStatus === 'success' ? '✅ 测试成功' : '❌ 测试失败';
const runUrl = `https://github.com/${config.repo}/actions/runs/${config.runId}`;

// 配置 SMTP
const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: true,
  auth: { user: config.user, pass: config.pass }
});

// 邮件选项
const mailOptions = {
  from: `GitHub Actions <${config.user}>`,
  to: config.to,
  subject: `【Cypress 测试】${config.repo} - ${statusText}（${config.passes}/${config.total} 通过）`,
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h2>Cypress 测试结果通知</h2>
      <hr>
      <p><strong>仓库：</strong>${config.repo}</p>
      <p><strong>状态：</strong>${statusText}</p>
      <p><strong>测试统计：</strong>总用例 ${config.total} · 通过 ${config.passes} · 失败 ${config.failures}</p>
      <p><strong>运行日志：</strong><a href="${runUrl}">点击查看</a></p>
      <p><strong>发送时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
    </div>
  `
};

// 发送邮件
transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error('❌ 邮件发送失败：', err.message);
    process.exit(1);
  }
  console.log('✅ 邮件发送成功：', info.response);
  process.exit(0);
});
