const fs = require('fs');
const CHANGELOG_FILE = 'CHANGELOG.md';
const CHANGELOG_CONTENT = fs.readFileSync(CHANGELOG_FILE, 'utf8');
console.log(`::set-output name=content::${JSON.stringify(CHANGELOG_CONTENT)}`);