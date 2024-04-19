// Read file
let fs = require('fs');
let content =
    fs.readFileSync('.github/workflows/example/javascript.js', 'utf8');

process.stdout.write(content);

// Test console.out
console.log('log: Hello World');
console.info('info: Hello World');
console.warn('warn: Hello World');
console.error('error: Hello World');

// Get input params
// const core = require('@actions/core');
// const name = core.getInput('name');
// console.log('input: ', name);

console.log('input: ', process.env.InputKey1);
console.log('input: ', process.env.InputKey2);
console.log('input: ', process.env.INPUT_NAME);

// Set output params
console.log(
    '::set-output name=JAVASCRIPT_OUT::$' + process.env.InputKey1 +
    process.env.InputKey2);

// console log:
