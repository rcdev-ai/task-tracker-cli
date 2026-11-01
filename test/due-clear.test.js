'use strict';
// TTC-2 clear-form due command. Expectations derive from the frozen ACs and
// PD-0016, and exercise the CLI as a real process.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const BIN = path.join(__dirname, '..', 'bin', 'ttc.js');
const SCRATCH = path.join(__dirname, '..', '.scratch', 'due-clear-tests');
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
  expectOk(sb, 'Added task 1\n', 'add', 'Pay rent', '--due', '2000-01-02', '--tag', 'bills');
  expectOk(sb, 'Added task 2\n', 'add', 'Call mom', '--tag', 'home');
  expectOk(sb, 'Added task 3\n', 'add', 'Fix bike', '--due', '2099-06-01');
  ok(sb, 'done', '3');
  return sb;
}

test('AC-1: clear an open date and update all due views', (t) => {
  const sb = setupAc1(t);
  expectOk(sb, 'Cleared due date of task 1\n', 'due', '1', '--clear');
  expectOk(sb, lines('#1 [ ] Pay rent +bills', '#2 [ ] Call mom +home'), 'list');
  expectOk(sb, lines('#1 [ ] Pay rent +bills', '#2 [ ] Call mom +home'), 'list', '--no-due');
  expectOk(sb, 'No tasks.\n', 'list', '--overdue');
  expectOk(sb, lines('open: 2', 'done: 1', 'overdue: 0'), 'stats');
});

test('AC-2: clear a normalized done id, preserve fields, export, and retain set form', (t) => {
  const sb = setupAc1(t);
  expectOk(sb, 'Cleared due date of task 1\n', 'due', '1', '--clear');
  expectOk(sb, 'Cleared due date of task 3\n', 'due', '--clear', '003');
  expectOk(sb, '#3 [x] Fix bike\n', 'list', '--done');
  assert.deepEqual(stored(sb), { version: 4, nextId: 4, tasks: [
    { id: 1, title: 'Pay rent', status: 'open', due: null, tags: ['bills'], note: null, important: false },
    { id: 2, title: 'Call mom', status: 'open', due: null, tags: ['home'], note: null, important: false },
    { id: 3, title: 'Fix bike', status: 'done', due: null, tags: [], note: null, important: false },
  ] });
  expectOk(sb, 'id,title,status,due,tags,note\r\n1,Pay rent,open,,bills,\r\n2,Call mom,open,,home,\r\n3,Fix bike,done,,,\r\n', 'export', '--format', 'csv');
  expectOk(sb, 'Set due date of task 1 to 2099-11-10\n', 'due', '1', '2099-11-10');
  expectOk(sb, lines('#1 [ ] Pay rent due:2099-11-10 +bills', '#2 [ ] Call mom +home'), 'list');
});

test('AC-3: clearing an undated task is a byte-preserving no-op, including v3', (t) => {
  const sb = setupAc1(t);
  const before = bytes(sb);
  expectOk(sb, 'Task 2 has no due date\n', 'due', '2', '--clear');
  assert.deepEqual(bytes(sb), before);

  const v3 = sandbox(t);
  fs.mkdirSync(v3.dataDir, { recursive: true });
  fs.writeFileSync(v3.file, '{"version":3,"nextId":2,"tasks":[{"id":1,"title":"Call mom","status":"open","due":null,"tags":[],"note":null}]}');
  const v3Before = bytes(v3);
  expectOk(v3, 'Task 1 has no due date\n', 'due', '1', '--clear');
  assert.deepEqual(bytes(v3), v3Before);
});

test('AC-4: clearing a dated v3 task upgrades it to v4 and preserves all other fields', (t) => {
  const sb = sandbox(t);
  fs.mkdirSync(sb.dataDir, { recursive: true });
  fs.writeFileSync(sb.file, JSON.stringify({ version: 3, nextId: 4, tasks: [
    { id: 1, title: 'Call mom', status: 'open', due: null, tags: [], note: null },
    { id: 2, title: 'Pay rent', status: 'open', due: '2099-10-01', tags: ['bills'], note: 'by card' },
    { id: 3, title: 'Fix bike', status: 'done', due: null, tags: ['home'], note: 'chain' },
  ] }));
  expectOk(sb, 'Cleared due date of task 2\n', 'due', '2', '--clear');
  assert.deepEqual(stored(sb), { version: 4, nextId: 4, tasks: [
    { id: 1, title: 'Call mom', status: 'open', due: null, tags: [], note: null, important: false },
    { id: 2, title: 'Pay rent', status: 'open', due: null, tags: ['bills'], note: 'by card', important: false },
    { id: 3, title: 'Fix bike', status: 'done', due: null, tags: ['home'], note: 'chain', important: false },
  ] });
});

test('AC-5: clear changes only the selected exported due value', (t) => {
  const sb = sandbox(t);
  ok(sb, 'add', 'Pay rent', '--due', '2099-12-30', '--tag', 'home', '--note', 'by card', '--important');
  ok(sb, 'add', 'Buy milk', '--due', '2099-06-01');
  const beforePath = path.join(sb.work, 'before.json');
  const afterPath = path.join(sb.work, 'after.json');
  ok(sb, 'export', beforePath);
  expectOk(sb, 'Cleared due date of task 1\n', 'due', '1', '--clear');
  ok(sb, 'export', afterPath);
  const beforeText = fs.readFileSync(beforePath, 'utf8');
  const afterText = fs.readFileSync(afterPath, 'utf8');
  assert.equal(afterText, beforeText.replace('"due": "2099-12-30"', '"due": null'));
  const before = JSON.parse(beforeText);
  const after = JSON.parse(afterText);
  assert.deepEqual(after, { ...before, tasks: before.tasks.map((task, i) => i === 0 ? { ...task, due: null } : task) });
  expectOk(sb, lines('#1 [ ] Pay rent !important +home', '#2 [ ] Buy milk due:2099-06-01'), 'list');
});

test('AC-6: clear parser and validation precedence preserve bytes', (t) => {
  const sb = setupAc1(t);
  const before = bytes(sb);
  const cases = [
    [['3', '2099-11-10', '--clear'], 'ttc: due date and --clear cannot be combined\n'],
    [['--clear', '3', '2099-11-10'], 'ttc: due date and --clear cannot be combined\n'],
    [['3', '2026-02-30', '--clear'], 'ttc: due date and --clear cannot be combined\n'],
    [['99', '2099-11-10', '--clear'], 'ttc: due date and --clear cannot be combined\n'],
    [['abc', '2099-11-10', '--clear'], 'ttc: invalid task id: abc\n'],
    [['abc', '--clear'], 'ttc: invalid task id: abc\n'],
    [['99', '--clear'], 'ttc: no task with id 99\n'],
    [['1', '--clear', '--clear'], 'ttc: option given twice: --clear\n'],
    [['--clear'], 'ttc: missing argument: <id>\n'],
    [['1', '2099-11-10', 'x', '--clear'], 'ttc: unexpected argument: x\n'],
    [['1', '--clear', '--bogus'], 'ttc: unknown option: --bogus\n'],
  ];
  for (const [args, stderr] of cases) {
    expectFail(sb, stderr, 'due', ...args);
    assert.deepEqual(bytes(sb), before, args.join(' '));
  }
  expectFail(sb, /^ttc: [^\r\n\u0085\u2028\u2029]+\n$/, 'due', '1');
  assert.deepEqual(bytes(sb), before);
});

test('AC-7: combination refusal precedes corrupt reads and absent homes stay absent', (t) => {
  const sb = sandbox(t);
  fs.mkdirSync(sb.dataDir, { recursive: true });
  fs.writeFileSync(sb.file, 'not json');
  const before = bytes(sb);
  expectFail(sb, 'ttc: due date and --clear cannot be combined\n', 'due', '1', '2099-11-10', '--clear');
  assert.deepEqual(bytes(sb), before);
  expectFail(sb, /^ttc: cannot read [^\r\n\u0085\u2028\u2029]+\n$/, 'due', '1', '--clear');
  assert.deepEqual(bytes(sb), before);

  const missing = sandbox(t);
  expectFail(missing, 'ttc: no task with id 1\n', 'due', '1', '--clear');
  assert.equal(fs.existsSync(missing.file), false);
  assert.equal(fs.existsSync(missing.dataDir), false);
});

test('AC-8: help includes the clear-form usage', (t) => {
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
