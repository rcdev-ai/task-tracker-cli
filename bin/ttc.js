#!/usr/bin/env node
'use strict';

// Load only errors.js first so the handlers are in place before src/ loads.
const { failureLine } = require('../src/errors');

let failed = false;
let lineWritten = false;

function fail(line) {
  failed = true;
  process.exitCode = 1;
  if (lineWritten) return;
  lineWritten = true;
  try {
    process.stderr.write(line);
  } catch {
    // stderr cannot be written: exit 1 silently.
  }
}

process.stdout.on('error', (err) => {
  fail('ttc: cannot write output: ' + ((err && err.code) || 'unknown error') + '\n');
});
process.stderr.on('error', () => {
  failed = true;
  lineWritten = true;
  process.exitCode = 1;
});
process.on('uncaughtException', (err) => fail(failureLine(err)));

const { run } = require('../src/cli');

run(process.argv.slice(2), { stdout: process.stdout, stderr: process.stderr }).then(
  (code) => { process.exitCode = failed ? 1 : code; },
  (err) => {
    if (err.outputStream === 'stderr') {
      failed = true;
      lineWritten = true;
      process.exitCode = 1;
    } else {
      fail(failureLine(err));
    }
  },
);
