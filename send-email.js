// send-email.js - GitHub Actions 邮件发送核心脚本
const nodemailer = require('nodemailer');

// 从环境变量读取配置（Actions 中通过 env 传递）
const config = {
  // 邮箱 SMTP 配置（必填）
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'), // 转为数字，默认465
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD,
  to: process.env.EMAIL_TO,
  // GitHub 运行信息（可选，用于邮件内容）
  repo: process.env.GITHUB_REPOSITORY,
  status: process.env.JOB_STATUS,
  runId: process.env.GITHUB_RUN_ID,
  trigger: process.env.GITHUB_EVENT_NAME,
  commitMsg: process.env.COMMIT_MESSAGE || '无'
};

// 第一步：验证必填配置
if (!config.host || !config.user || !config.pass || !config.to) {
  console.error('❌ 错误：缺少邮箱核心配置！请检查 GitHub Secrets。');
  process.exit(1); // 退出并标记失败
}

// 第二步：构建邮件内容
const statusText = config.status === 'success' ? '✅ 测试成功' : '❌ 测试失败';
const triggerText = {
  schedule: '定时任务',
  push: '代码推送',
  workflow_dispatch: '手动触发'
}[config.trigger] || '未知触发方式';
const runUrl = `https://github.com/${config.repo}/actions/runs/${config.runId}`; // 运行日志链接

// 第三步：配置 nodemailer 传输器（适配主流邮箱）
const transporter = nodemailer.createTransport({
  host: config.host, // SMTP 服务器地址
  port: config.port, // 端口（465 = SSL，推荐）
  secure: true, // 强制 SSL 加密（465 端口必须设为 true）
  auth: {
    user: config.user, // 发件人邮箱
    pass: config.pass  // SMTP 授权码（不是邮箱登录密码！）
  }
});

// 第四步：定义邮件内容
const mailOptions = {
  from: `GitHub Actions <${config.user}>`, // 发件人（名称+邮箱）
  to: config.to, // 收件人（多个用逗号分隔：a@qq.com,b@163.com）
  subject: `【GitHub Actions】${config.repo} - ${statusText}`, // 邮件标题
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h2>GitHub Actions 运行结果通知</h2>
      <hr>
      <p><strong>仓库名称：</strong>${config.repo}</p>
      <p><strong>运行状态：</strong>${statusText}</p>
      <p><strong>触发方式：</strong>${triggerText}</p>
      <p><strong>运行日志：</strong><a href="${runUrl}">点击查看</a></p>
      <p><strong>提交信息：</strong>${config.commitMsg}</p>
      <p><strong>发送时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
    </div>
  ` // HTML 格式正文（支持样式/链接）
};

// 第五步：发送邮件
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(`❌ 邮件发送失败：${error.message}`);
    process.exit(1);
  }
  console.log(`✅ 邮件发送成功！响应：${info.response}`);
  process.exit(0);
});
