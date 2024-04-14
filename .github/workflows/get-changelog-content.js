
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
  
  content += '\n\n## *Git Diff*:\n\n';
  content += `<details><summary>Changes are listed as follows:</summary>`;

  // 读取commit_diff_temp.md文件的内容
  const COMMIT_DIFF_FILE = 'commit_diff_temp.md';
  try {
    const COMMIT_DIFF_CONTENT = fs.readFileSync(COMMIT_DIFF_FILE, 'utf8');
    content = content + convert_diff(COMMIT_DIFF_CONTENT);
  } catch (error) {
    console.error('Error reading commit_diff_temp.md:', error);
  }

  content += '</details>';

  // 将内容输出到输出参数
  content = JSON.stringify(content).replaceAll(`'`, `'"'"'`);
  console.log(`::set-output name=content::${content}`);
}

function convert_diff(diff) {
  // return diff;
  const lines = diff.split('\n');
  let typed_lines = [];
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
      let result = '';
      if (state !== 'none') {
        result += '```\n\n';
      }
      result += `### ${line.split(' ')[2].slice(2)}\n\n` +
          '```bash\n' + line + '\n```\n\n' +
          '```diff\n';
      state = 'diff';
      typed_lines.push(['basic', result]);
      continue;
    }
    if (state === 'diff' &&
        (line.startsWith('index ') || line.startsWith('--- ') ||
         line.startsWith('+++ '))) {
      // 如果当前状态为diff, 且当前行以index, ---, +++开头, 则表示这是diff开头,
      // 直接输出加换行
      typed_lines.push(['basic', `${line}\n`]);
      continue;
    }
    if (line.startsWith('@@ ')) {
      // 如果当前行以@@开头, 则表示这是一个定位行, 直接输出加换行
      // 进入正文状态
      state = 'content';
      typed_lines.push(['basic', `${line}\n`]);
      continue;
    }
    // 正文一共4种状态, +, -, 空格, ~开头
    if (line.startsWith(' ')) {
      // 如果当前行以空格开头, 需要判断它的状态,
      // 如果下一行是+或-, 则表示这是一个前缀行, 不加 *
      // 如果上一行是变化行, 则表示这是一个后缀行, 不加 *
      // 如果是下一行以 ~ 开头, 则表示这是正常行, 在行首加上 * , 表示正常行
      if (lines[i + 1].startsWith('+') || lines[i + 1].startsWith('-')) {
        // 如果如果前缀行全都是空格, 直接略去
        if (line.trim() === '') {
          continue;
        }
        typed_lines.push(['prefix', `${line}\n`]);
        continue;
      }
      if (typed_lines[typed_lines.length - 1][0] === 'change') {
        // 如果后缀行全都是空格, 直接略去
        if (line.trim() === '') {
          continue;
        }
        typed_lines.push(['suffix', `${line}\n`]);
        continue;
      }
      typed_lines.push(['basic', `*${line.slice(1)}\n`]);
      continue;
    }
    if (line.startsWith('-') || line.startsWith('+')) {
      // 如果当前行以+-开头, 则表示这是一个发生变化的行, 我们保存+-不变,
      // 在行首额外加上一个换行, 不加 * , 正常在行尾换行
      // 正常在行尾换行, 进入变化行状态
      // 同时, 我们用一个空格将+-和后面的内容分开
      typed_lines.push(['change', `${line[0]} ${line.slice(1)}\n`]);
      continue;
    }
    if (line.startsWith('~')) {
      // 如果当前行以~开头, 则表示这是换行, 由于我们已经在上面处理了换行,
      // 所以这里不需要处理, 直接略过
      continue;
    }
    // 如果当前行不符合以上任何一种情况, 则表示这是一个异常行,
    // 在前面加一个感叹号直接输出
    typed_lines.push(['basic', `!${line}\n`]);
  }
  // 最后, 我们需要将最后一个diff的后缀加上 ``` \n\n
  if (state !== 'none') {
    typed_lines.push(['basic', '\n```\n\n']);
  }
  // 将处理后的行拼接起来, 其中 basic 组的前后需要加上换行
  let result = '';
  state = 'baisc'
  for (let i = 0; i < typed_lines.length; i++) {
    let line = typed_lines[i];
    if (line[0] === 'basic') {
      if (state === 'basic') {
        result += line[1];
      } else {
        result += '\n' + line[1];
        state = 'basic';
      }
    } else {
      if (state === 'basic') {
        result += '\n' + line[1];
        state = 'not basic';
      } else {
        result += line[1];
      }
    }
  }
  return result;
}

main();