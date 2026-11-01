'use strict';
// TTC-1 set-form due command (REQ-0016, PD-0016). Expectations are written
// from the accepted ACs and independent of the command implementation.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const BIN = path.join(__dirname, '..', 'bin', 'ttc.js');
const SCRATCH = path.join(__dirname, '..', '.scratch', 'due-tests');
fs.mkdirSync(SCRATCH, { recursive: true });

function sandbox(t) {
  const base = fs.mkdtempSync(path.join(SCRATCH, 'case-'));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const work = path.join(base, 'work');
  fs.mkdirSync(work);
  return { base, work, dataDir: path.join(base, 'data'), file: path.join(base, 'data', 'tasks.json') };
}

function ttc(sb, ...args) {
  const env = { PATH: process.env.PATH, HOME: path.join(sb.base, 'home'), TTC_HOME: sb.dataDir, TZ: 'UTC' };
  return spawnSync(process.execPath, [BIN, ...args], { env, cwd: sb.work, encoding: 'utf8' });
}

function ok(sb, ...args) {
  const r = ttc(sb, ...args);
  assert.equal(r.status, 0, args.join(' ') + ': ' + r.stderr);
  assert.equal(r.stderr, '', args.join(' '));
  return r.stdout;
}

function expectOk(sb, stdout, ...args) { assert.equal(ok(sb, ...args), stdout, args.join(' ')); }

function expectFail(sb, stderr, ...args) {
  const r = ttc(sb, ...args);
  assert.equal(r.status, 1, args.join(' '));
  assert.equal(r.stdout, '', args.join(' '));
  if (stderr instanceof RegExp) assert.match(r.stderr, stderr, args.join(' '));
  else assert.equal(r.stderr, stderr, args.join(' '));
}

const lines = (...ls) => ls.map((l) => l + '\n').join('');
const bytes = (sb) => fs.readFileSync(sb.file);
const stored = (sb) => JSON.parse(bytes(sb).toString('utf8'));

function setupAc1(t) {
  const sb = sandbox(t);
  ok(sb, 'add', 'Pay rent', '--due', '2099-11-01', '--tag', 'bills');
  ok(sb, 'add', 'Call mom', '--tag', 'home');
  ok(sb, 'add', 'Fix bike', '--due', '2099-06-01');
  ok(sb, 'done', '3');
  expectOk(sb, 'Set due date of task 1 to 2099-11-10\n', 'due', '1', '2099-11-10');
  expectOk(sb, '#1 [ ] Pay rent due:2099-11-10 +bills\n#2 [ ] Call mom +home\n', 'list');
  return sb;
}

test('AC-1–3: set, replace, normalize ids, and expose the new date everywhere', (t) => {
  const sb = setupAc1(t);
  expectOk(sb, 'Set due date of task 2 to 2099-12-24\n', 'due', '002', '2099-12-24');
  expectOk(sb, lines(
    '#1 [ ] Pay rent due:2099-11-10 +bills',
    '#2 [ ] Call mom due:2099-12-24 +home',
  ), 'list');
  expectOk(sb, 'No tasks.\n', 'list', '--no-due');
  expectOk(sb, 'Set due date of task 2 to 9999-12-31\n', 'due', '2', '9999-12-31');
  expectOk(sb, 'Set due date of task 3 to 2000-01-02\n', 'due', '3', '2000-01-02');
  expectOk(sb, '#3 [x] Fix bike due:2000-01-02\n', 'list', '--done');
  expectOk(sb, 'Set due date of task 1 to 2000-01-02\n', 'due', '1', '2000-01-02');

  expectOk(sb, lines(
    '#1 [ ] Pay rent due:2000-01-02 !overdue +bills',
    '#2 [ ] Call mom due:9999-12-31 +home',
  ), 'list');
  expectOk(sb, '#1 [ ] Pay rent due:2000-01-02 !overdue +bills\n', 'list', '--overdue');
  expectOk(sb, '#2 [ ] Call mom due:9999-12-31 +home\n', 'list', '--due-from', '2099-01-01');
  expectOk(sb, lines('open: 2', 'done: 1', 'overdue: 1'), 'stats');
  expectOk(sb, 'id,title,status,due,tags,note\r\n' +
    '1,Pay rent,open,2000-01-02,bills,\r\n' +
    '2,Call mom,open,9999-12-31,home,\r\n' +
    '3,Fix bike,done,2000-01-02,,\r\n', 'export', '--format', 'csv');
});

test('AC-4: same date writes version 4 and upgrades v3/v1 files', (t) => {
  const same = setupAc1(t);
  expectOk(same, 'Set due date of task 1 to 2099-11-10\n', 'due', '1', '2099-11-10');
  assert.equal(stored(same).version, 4);

  const v3 = sandbox(t);
  fs.mkdirSync(v3.dataDir, { recursive: true });
  fs.writeFileSync(v3.file, JSON.stringify({ version: 3, nextId: 4, tasks: [
    { id: 1, title: 'Call mom', status: 'open', due: null, tags: [], note: null },
    { id: 2, title: 'Pay rent', status: 'open', due: '2099-10-01', tags: ['bills'], note: 'by card' },
    { id: 3, title: 'Fix bike', status: 'done', due: null, tags: ['home'], note: 'chain' },
  ] }));
  expectOk(v3, 'Set due date of task 2 to 2099-10-01\n', 'due', '2', '2099-10-01');
  assert.deepEqual(stored(v3), { version: 4, nextId: 4, tasks: [
    { id: 1, title: 'Call mom', status: 'open', due: null, tags: [], note: null, important: false },
    { id: 2, title: 'Pay rent', status: 'open', due: '2099-10-01', tags: ['bills'], note: 'by card', important: false },
    { id: 3, title: 'Fix bike', status: 'done', due: null, tags: ['home'], note: 'chain', important: false },
  ] });

  const v1 = sandbox(t);
  fs.mkdirSync(v1.dataDir, { recursive: true });
  fs.writeFileSync(v1.file, JSON.stringify({ nextId: 2, tasks: [{ id: 1, title: 'Pay rent', status: 'open', due: null, tags: [] }] }));
  expectOk(v1, 'Set due date of task 1 to 2099-10-01\n', 'due', '1', '2099-10-01');
  assert.deepEqual(stored(v1), { version: 4, nextId: 2, tasks: [{ id: 1, title: 'Pay rent', status: 'open', due: '2099-10-01', tags: [], note: null, important: false }] });
});

test('AC-5: only the selected due value changes', (t) => {
  const sb = sandbox(t);
  ok(sb, 'add', 'Pay rent', '--due', '2099-12-30', '--tag', 'home', '--note', 'by card', '--important');
  ok(sb, 'add', 'Buy milk', '--due', '2099-06-01');
  const beforePath = path.join(sb.work, 'before.json');
  const afterPath = path.join(sb.work, 'after.json');
  ok(sb, 'export', beforePath);
  expectOk(sb, 'Set due date of task 1 to 2000-01-02\n', 'due', '1', '2000-01-02');
  ok(sb, 'export', afterPath);
  const beforeText = fs.readFileSync(beforePath, 'utf8');
  const afterText = fs.readFileSync(afterPath, 'utf8');
  assert.equal(afterText, beforeText.replace('"due": "2099-12-30"', '"due": "2000-01-02"'));
  const before = JSON.parse(beforeText);
  const after = JSON.parse(afterText);
  assert.deepEqual(after, { ...before, tasks: before.tasks.map((task, i) => i === 0 ? { ...task, due: '2000-01-02' } : task) });
  expectOk(sb, '#1 [ ] Pay rent due:2000-01-02 !overdue !important +home\n#2 [ ] Buy milk due:2099-06-01\n', 'list');
});

test('AC-6–7: invalid input and argument errors preserve bytes', (t) => {
  const sb = setupAc1(t);
  const before = bytes(sb);
  const cases = [
    [['1', '2026-02-30'], 'invalid date: 2026-02-30'],
    [['1', '2026-1-05'], 'invalid date: 2026-1-05'],
    [['1', '10000-01-01'], 'invalid date: 10000-01-01'],
    [['1', 'tomorrow'], 'invalid date: tomorrow'],
    [['abc', '2099-11-10'], 'invalid task id: abc'],
    [['abc'], 'invalid task id: abc'],
    [['0', '2099-11-10'], 'invalid task id: 0'],
    [['2099-11-10', '1'], 'invalid task id: 2099-11-10'],
    [['99', '2099-11-10'], 'no task with id 99'],
    [['abc', '2026-02-30'], 'invalid task id: abc'],
    [['99', '2026-02-30'], 'invalid date: 2026-02-30'],
    [[], /^ttc: missing argument: <id>\n$/],
    [['1', '2099-11-10', '2099-11-11'], 'unexpected argument: 2099-11-11'],
    [['1', '2099-11-10', '--bogus'], 'unknown option: --bogus'],
    [['--bogus', 'abc', '2026-02-30'], 'unknown option: --bogus'],
    [['abc', '2026-02-30', 'extra'], 'unexpected argument: extra'],
    [['1'], /^ttc: [^\r\n\u0085\u2028\u2029]+\n$/],
  ];
  for (const [args, message] of cases) {
    if (message instanceof RegExp) expectFail(sb, message, 'due', ...args);
    else expectFail(sb, 'ttc: ' + message + '\n', 'due', ...args);
    assert.deepEqual(bytes(sb), before, args.join(' '));
  }
});

test('AC-8: validation precedes corrupt reads and absent homes stay absent', (t) => {
  const sb = setupAc1(t);
  // Replace the valid store with corrupt bytes while retaining the exact AC-1 setup.
  fs.mkdirSync(sb.dataDir, { recursive: true });
  fs.writeFileSync(sb.file, 'not json');
  const before = bytes(sb);
  expectFail(sb, 'ttc: invalid date: 2026-02-30\n', 'due', '1', '2026-02-30');
  assert.deepEqual(bytes(sb), before);
  expectFail(sb, /^ttc: cannot read [^\r\n\u0085\u2028\u2029]+\n$/, 'due', '1', '2099-11-10');
  assert.deepEqual(bytes(sb), before);

  const missing = sandbox(t);
  expectFail(missing, 'ttc: no task with id 1\n', 'due', '1', '2099-11-10');
  assert.equal(fs.existsSync(missing.file), false);
  assert.equal(fs.existsSync(missing.dataDir), false);
});

test('AC-9: help includes the set-date usage after postpone', (t) => {
  const sb = sandbox(t);
  expectOk(sb, 'Usage:\n' + lines(
    '  ttc help',
    '  ttc add "<title>" [--due YYYY-MM-DD] [--tag <t>]... [--note "<text>"] [--important]',
    '  ttc copy <id> [--due YYYY-MM-DD]',
    '  ttc list [--open|--done|--all|--overdue] [--no-due] [--tag <t>] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--search <text>]',
    '  ttc done <id>',
    '  ttc reopen <id>',
    '  ttc important <id>',
    '  ttc unimportant <id>',
    '  ttc postpone <id>',
    '  ttc due <id> YYYY-MM-DD | --clear',
    '  ttc rename <id> "<title>"',
    '  ttc delete <id>',
    '  ttc clean',
    '  ttc tag <id> +<t> | -<t>',
    '  ttc note <id> ["<text>" | --clear]',
    '  ttc export [<file>] [--format json|csv] [--open|--done|--all|--overdue] [--no-due] [--tag <t>] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--search <text>]',
    '  ttc import <file>',
    '  ttc stats',
  ), 'help');
});
