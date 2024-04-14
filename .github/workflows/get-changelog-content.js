
function main() {
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

  content += '\n\n';

  // 读取 CHANGELOG.md 文件的内容
  const fs = require('fs');
  const CHANGELOG_FILE = 'CHANGELOG.md';
  try {
    const CHANGELOG_CONTENT = fs.readFileSync(CHANGELOG_FILE, 'utf8');
    content = content + CHANGELOG_CONTENT;
  } catch (error) {
    console.error('Error reading CHANGELOG.md:', error);
  }

  content += '\n\n## *Diff*:\n\nChanges are listed as follows:\n';

  // 读取commit_diff_temp.md文件的内容
  const COMMIT_DIFF_FILE = 'commit_diff_temp.md';
  try {
    const COMMIT_DIFF_CONTENT = fs.readFileSync(COMMIT_DIFF_FILE, 'utf8');
    content = content + convert_diff(COMMIT_DIFF_CONTENT);
  } catch (error) {
    console.error('Error reading commit_diff_temp.md:', error);
  }
  content += '\n```\n';

  // 将内容输出到输出参数
  content = JSON.stringify(content).replaceAll(`'`, `'"'"'`);
  console.log(`::set-output name=content::${content}`);
}

function convert_diff(diff) {
  // return diff;
  const lines = diff.split('\n');
  let result = '';
  let state = 'none';
  //   return diff;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.startsWith('diff --git')) {
      // 如果state为none, 则表示当前是第一个diff, 不需要输出 ``` \n\n
      // 如果state不为none, 则表示当前是一个diff的结束, 需要输出 ``` \n\n
      // 我们希望格式为: 输入: diff --git a/xxx b/xxx
      // 输出: ### xxx \n ```bash \n diff --git a/xxx b/xxx \n ``` \n \n ```diff
      // 进入diff状态
      if (state !== 'none') {
        result += '```\n\n';
      }
      result += `#### ${line.split(' ')[2].slice(1)}\n\n` +
          '```bash\n' + line + '\n```\n\n' +
          '```diff\n';
      state = 'diff';
      continue;
    }
    if (state === 'diff' &&
        (line.startsWith('index ') || line.startsWith('--- ') ||
         line.startsWith('+++ '))) {
      // 如果当前状态为diff, 且当前行以index, ---, +++开头, 则表示这是diff开头,
      // 直接输出加换行
      result += `${line}\n`;
      continue;
    }
    if (line.startsWith('@@ ')) {
      // 如果当前行以@@开头, 则表示这是一个定位行, 直接输出加换行
      // 进入正文状态
      result += `${line}\n`;
      state = 'content';
      continue;
    }
    // 正文一共4种状态, +, -, 空格, ~开头
    if (line.startsWith(' ')) {
      // 如果当前行以空格开头,
      // 需要判断它的下一行是什么状态, 如果是~开头, 则表示这是正常行
      // 我们在正常行首加上 * , 表示正常行
      // 如果是+或-, 则表示这是一个发生变化的行,
      // 需要在行首额外加上一个换行, 不加 * , 正常在行尾换行
      if (lines[i + 1].startsWith('~')) {
        // 如果现在是变化行状态 则需要加换行 转为正常行状态 且不用加 *
        // 因为是紧跟在变化行后面的
        if (state === 'change') {
          result += `${line}\n`;
          state = 'content';
        } else {
          result += `*${line}\n`;
        }
      } else {
        // 但如果这一行全是空格, 那么我们只需要在行尾加换行
        // 或者如果这一行已经是变化行状态, 那么我们只需要在行尾加换行
        if (line.trim() !== '' && state !== 'change') {
          result += '\n';
        }
        result += `${line}\n`;
      }
      continue;
    }
    if (line.startsWith('-') || line.startsWith('+')) {
      // 如果当前行以+-开头, 则表示这是一个发生变化的行, 我们保存+-不变,
      // 在行首额外加上一个换行, 不加 * , 正常在行尾换行
      // 正常在行尾换行, 进入变化行状态
      // 同时, 我们用一个空格将+-和后面的内容分开
      result += line[0] + ' ' + line.slice(1) + '\n';
      state = 'change';
      continue;
    }
    if (line.startsWith('~')) {
      // 如果当前行以~开头, 则表示这是换行, 由于我们已经在上面处理了换行,
      // 所以这里不需要处理, 直接略过
      continue;
    }
    result += `${line}\n`;
  }
  return result;
}

main();