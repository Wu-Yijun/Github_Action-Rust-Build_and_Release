// Read file
let fs = require('fs');
let content =
    fs.readFileSync('.github/workflows/example/javascript.js', 'utf8');

process.stdout.write(content.substring(0, 200) + '...');

// Test console.out
console.log('log: Hello World');
console.info('info: Hello World');
console.warn('warn: Hello World');
console.error('error: Hello World');

// Get input params;
const env1 = process.env.Env1;
const env2 = process.env.Env2;
console.log('input1: ' + env1);
console.log('input2: ' + env2);

const arg1 = process.argv[2];
const arg2 = process.argv[3];
console.log('args: ' + process.argv);

// Set output params
// const core = require('@actions/core');
console.log('::set-output name=output1::' + env1 + arg1);
// core.setOutput('output2', env2 + arg2);
process.env.MY_VARIABLE = "This is my variable";

// console log:
