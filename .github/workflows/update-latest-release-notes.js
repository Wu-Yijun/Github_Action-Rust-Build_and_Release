
async function updateReleaseNotes() {
  // 获取传递的参数
  const args = process.argv.slice(6);
  const [token, owner, repo, release_id, tag_name, release_info] = args;

  // Octokit.js
  // https://github.com/octokit/core.js#readme
  const fs = require("fs").promises;
  const { Octokit } = await import("@octokit/core");

  const octokit = new Octokit({auth: token});
  const content = await fs.readFile(path, 'utf8');

  await octokit.request(
      `PATCH /repos/${owner}/${repo}/releases/${release_id}`, {
        owner: owner,
        repo: repo,
        release_id: release_id,
        tag_name: tag_name,
        target_commitish: 'master',
        body: '### ' + release_info + '\n\n' + content,
        draft: false,
        prerelease: false,
        headers: {'X-GitHub-Api-Version': '2022-11-28'}
      });
}

updateReleaseNotes().catch(console.error);