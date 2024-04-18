let fs = require('fs');
let content = fs.readFileSync('CHANGELOG.md', 'utf8');
process.stdout.write(content);
console.log(`::set-output name=content::${content}`);