
async function updateReleaseNotes() {
  // Octokit.js
  // https://github.com/octokit/core.js#readme
  const fs = require('fs').promises;
  const {Octokit} = await import('@octokit/core');

  // 获取传递的参数
  const args = process.argv.slice(2);
  const [token, release_info] = args;
  const repoFullName = process.env.GITHUB_REPOSITORY;
  const [owner, repo] = repoFullName.split('/');
  const path = './CHANGELOG.md';

  let content = '### ' + release_info + '\n\n';
  try {
    content += await fs.readFile(path, 'utf8');
  } catch (error) {
    console.error('Error reading file:', error);
  }

  // 获取最新的 release 信息
  const octokit0 = new Octokit();
  const latestRelease =
      await octokit0
          .request(
              `GET /repos/${owner}/${repo}/releases/latest`,
              {owner: owner, repo: repo})
          .then(response => {
            return response.data;
          })
          .catch(error => {
            console.error('Error getting latest release:', error);
          });

  const releaseId = latestRelease.id;
  const releaseBody = latestRelease.body;
  const releaseUrl = latestRelease.html_url;

  console.error(`PATCH /repos/${owner}/${repo}/releases/${releaseId}`, {
    owner: owner,
    repo: repo,
    release_id: '' + releaseId,
    body: 'test',
  });
  const octokit = new Octokit({token: token});
  // 更新 release 的正文内容
  await octokit
      .request(`PATCH /repos/${owner}/${repo}/releases/${releaseId}`, {
        owner: owner,
        repo: repo,
        release_id: '' + releaseId,
        body: 'test',
      })
      .then(response => {
        console.log('Release body updated:', response.status);
      })
      .catch(error => {
        console.error('Error updating release body:', error);
      });
}

updateReleaseNotes().catch(console.error);