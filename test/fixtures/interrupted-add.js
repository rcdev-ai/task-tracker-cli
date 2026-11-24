'use strict';
// Test-only. Run as a child process: node interrupted-add.js <step>
// Runs `ttc add x` and kills itself with SIGKILL at the given step of the write.
const { killAtStep } = require('./kill-at-step');

killAtStep(process.argv[2]);

const { run } = require('../../src/cli');
run(['add', 'x'], { stdout: process.stdout, stderr: process.stderr }).then((code) => { process.exitCode = code; });
