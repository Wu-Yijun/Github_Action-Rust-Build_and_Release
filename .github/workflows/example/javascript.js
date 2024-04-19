// javascript.js

let fs = require('fs');
let content = fs.readFileSync('.github/workflows/example/javascript.js', 'utf8');

console.log('log: Hello World');
console.info('info: Hello World');
console.warn('warn: Hello World');
console.error('error: Hello World');

process.stdout.write(content);

// get input parameter
console.log('input: ', process.env.INPUT_NAME);