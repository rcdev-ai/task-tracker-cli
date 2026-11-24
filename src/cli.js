'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('./args');
const { oneLine, failureLine } = require('./errors');
const commands = require('./commands');

// A write's return value only describes backpressure. Completion (including
// EPIPE) arrives through its callback or error event.
function writeOutput(stream, text, name) {
  if (!text) return Promise.resolve();
  return new Promise((resolve, reject) => {
    function failed(err) {
      const failure = new Error('cannot write output: ' + ((err && err.code) || 'unknown error'));
      failure.outputStream = name;
      reject(failure);
    }
    function onError(err) {
      stream.removeListener('error', onError);
      failed(err);
    }
    stream.once('error', onError);
    try {
      stream.write(text, (err) => {
        if (err) {
          // Writable emits its error after calling this callback. Keep the
          // listener until then, including for callers outside the executable.
          failed(err);
        } else {
          stream.removeListener('error', onError);
          resolve();
        }
      });
    } catch (err) {
      stream.removeListener('error', onError);
      failed(err);
    }
  });
}

async function run(argv, { stdout, stderr }) {
  let out = '';
  let warning = '';
  let code = 0;
  try {
    if (argv[0] === '--version') {
      parseArgs(argv.slice(1), { positionals: [], options: {} });
      const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
      out = version + '\n';
    } else {
      let name = argv[0];
      let args = argv.slice(1);
      if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') name = 'help';
      const command = commands.find((c) => c.name === name);
      if (!command) {
        warning = 'ttc: unknown command: ' + oneLine(name) + ' (see ttc help)\n';
        code = 1;
      } else {
        // Neither buffer reaches a real stream until validation and saving finish.
        command.run(args, {
          stdout: { write: (s) => { out += s; } },
          stderr: { write: (s) => { warning += s; } },
        });
      }
    }
  } catch (err) {
    out = '';
    warning = failureLine(err);
    code = 1;
  }
  await writeOutput(stdout, out, 'stdout');
  await writeOutput(stderr, warning, 'stderr');
  return code;
}

module.exports = { run };
