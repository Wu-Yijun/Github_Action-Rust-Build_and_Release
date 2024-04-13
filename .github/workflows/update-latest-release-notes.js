
async function updateReleaseNotes() {
  // 获取传递的参数
  const args = process.argv.slice(2);
  const [owner, repo, release_id, tag_name, release_info] = args;

  // Octokit.js
  // https://github.com/octokit/core.js#readme
  const fs = require('fs').promises;
  const {Octokit} = await import('@octokit/core');

  const octokit = new Octokit({auth: process.env.GITHUB_TOKEN});
  let content = '### ' + release_info + '\n\n';
  try {
    content += await fs.readFile(path, 'utf8');
  } catch (error) {
    console.error('Error reading file:', error);
  }

  await octokit.request(
      `PATCH /repos/${owner}/${repo}/releases/${release_id}`, {
        owner: owner,
        repo: repo,
        release_id: release_id,
        tag_name: tag_name,
        target_commitish: 'master',
        body: content,
        draft: false,
        prerelease: false,
        headers: {'X-GitHub-Api-Version': '2022-11-28'}
      });
}

updateReleaseNotes().catch(console.error);