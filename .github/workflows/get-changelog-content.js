const {execSync} = require('child_process');

let content = '';
try {
  // 执行 git log 命令获取最近一次提交的提交消息
  const COMMIT_MESSAGE = execSync('git log -1 --pretty=%B').toString().trim();
  // 分段, 每段的两端加上斜体 * *
  content = content +
      COMMIT_MESSAGE.split('\n').map(line => `### *${line}*`).join('\n');
} catch (error) {
  console.error('Error getting commit message:', error);
}

// 读取 CHANGELOG.md 文件的内容
const fs = require('fs');
const CHANGELOG_FILE = 'CHANGELOG.md';
try {
  const CHANGELOG_CONTENT = fs.readFileSync(CHANGELOG_FILE, 'utf8');
  content = content + CHANGELOG_CONTENT;
} catch (error) {
  console.error('Error reading CHANGELOG.md:', error);
}
console.log(`::set-output name=content::${JSON.stringify(content)}`);