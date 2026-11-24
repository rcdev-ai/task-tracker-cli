'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const BIN = path.join(__dirname, '..', 'bin', 'ttc.js');
const INTERRUPTED_ADD = path.join(__dirname, 'fixtures', 'interrupted-add.js');

// A fresh home folder and data folder per call (C4).
function sandbox() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ttc-add-'));
  const dataDir = path.join(base, 'data');
  return { base, dataDir, file: path.join(dataDir, 'tasks.json') };
}

function envFor(sb, tz = 'UTC') {
  return { PATH: process.env.PATH, HOME: path.join(sb.base, 'home'), TTC_HOME: sb.dataDir, TZ: tz };
}

function add(sb, ...args) {
  return spawnSync(process.execPath, [BIN, 'add', ...args], { env: envFor(sb), encoding: 'utf8' });
}

function seed(sb, list) {
  fs.mkdirSync(sb.dataDir, { recursive: true });
  fs.writeFileSync(sb.file, JSON.stringify(list, null, 2) + '\n');
}

const SEED = { nextId: 2, tasks: [{ id: 1, title: 'old', status: 'open', due: null, tags: [] }] };

function stored(sb) {
  return JSON.parse(fs.readFileSync(sb.file, 'utf8'));
}

function assertOk(r, id, stderr = '') {
  assert.equal(r.status, 0);
  assert.equal(r.stderr, stderr);
  assert.equal(r.stdout, 'Added task ' + id + '\n');
}

// Failure: exit 1, nothing on stdout, one stderr line (the exact line when
// given), and tasks.json unchanged (seeded list, or absent when `absent`).
function assertFails(sb, args, line, { absent = false } = {}) {
  let before = null;
  if (!absent) {
    seed(sb, SEED);
    before = fs.readFileSync(sb.file);
  }
  const r = add(sb, ...args);
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
  if (line !== undefined) assert.equal(r.stderr, line + '\n');
  else assert.match(r.stderr, /^ttc: [^\n]+\n$/);
  if (absent) assert.equal(fs.existsSync(sb.file), false);
  else assert.deepEqual(fs.readFileSync(sb.file), before);
}

test('past-date add saves exact tasks, warns, and leaves other commands silent (TTC-868 AC-1/2/8)', () => {
  let sb = sandbox();
  assertOk(add(sb, 'Pay rent', '--due', '2000-01-02'), 1,
    'ttc: warning: due date 2000-01-02 is in the past\n');
  const rent = { id: 1, title: 'Pay rent', status: 'open', due: '2000-01-02', tags: [], note: null, important: false };
  assert.deepEqual(stored(sb), { version: 4, nextId: 2, tasks: [rent] });
  const list = spawnSync(process.execPath, [BIN, 'list'], { env: envFor(sb), encoding: 'utf8' });
  assert.equal(list.status, 0);
  assert.equal(list.stderr, '');
  assert.equal(list.stdout, '#1 [ ] Pay rent due:2000-01-02 !overdue\n');

  let backup = path.join(sb.base, 'x.json');
  function expectCommand(args, stdout) {
    const r = spawnSync(process.execPath, [BIN, ...args], { env: envFor(sb), encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout, stdout);
    assert.equal(r.stderr, '');
  }
  expectCommand(['export', backup], `Exported 1 tasks to ${backup}\n`);
  assertOk(add(sb, '--tag', 'home', '--due', '1999-12-31', 'Fix bike', '--note', 'chain', '--important'), 2,
    'ttc: warning: due date 1999-12-31 is in the past\n');
  assert.deepEqual(stored(sb), { version: 4, nextId: 3, tasks: [rent,
    { id: 2, title: 'Fix bike', status: 'open', due: '1999-12-31', tags: ['home'], note: 'chain', important: true },
  ] });

  // A fresh home for the exact non-add sequence in AC-8.
  sb = sandbox();
  backup = path.join(sb.base, 'x.json');
  assertOk(add(sb, 'Pay rent', '--due', '2000-01-02'), 1,
    'ttc: warning: due date 2000-01-02 is in the past\n');
  expectCommand(['export', backup], `Exported 1 tasks to ${backup}\n`);
  expectCommand(['copy', '1', '--due', '2000-01-03'], 'Copied task 1 as task 2\n');
  expectCommand(['copy', '1'], 'Copied task 1 as task 3\n');
  expectCommand(['due', '1', '1999-01-01'], 'Set due date of task 1 to 1999-01-01\n');
  expectCommand(['import', backup], `Imported 1 tasks from ${backup}\n`);
  assert.deepEqual(stored(sb), { version: 4, nextId: 2, tasks: [rent] });
});

test('a second add gets id 2 (criterion 2)', () => {
  const sb = sandbox();
  assertOk(add(sb, 'Pay rent', '--due', '2099-12-31'), 1);
  assertOk(add(sb, 'Call mom'), 2);
  const list = stored(sb);
  assert.equal(list.nextId, 3);
  assert.deepEqual(
    list.tasks.map((t) => [t.id, t.title, t.status]),
    [
      [1, 'Pay rent', 'open'],
      [2, 'Call mom', 'open'],
    ],
  );
});

test('due date and tags are stored (criterion 3)', () => {
  const sb = sandbox();
  assertOk(add(sb, 'Pay rent', '--due', '2099-12-31', '--tag', 'bills', '--tag', 'home'), 1);
  const t = stored(sb).tasks[0];
  assert.equal(t.due, '2099-12-31');
  assert.deepEqual([...t.tags].sort(), ['bills', 'home']);
});

test('options may come before the title (criterion 4)', () => {
  const sb = sandbox();
  assertOk(add(sb, '--tag', 'home', '--due', '2099-12-31', 'Pay rent'), 1);
  const t = stored(sb).tasks[0];
  assert.equal(t.title, 'Pay rent');
  assert.equal(t.due, '2099-12-31');
  assert.deepEqual(t.tags, ['home']);
});

test('past and leap-day due dates are accepted (criterion 5)', () => {
  const sb = sandbox();
  assertOk(add(sb, 'Old bill', '--due', '2020-01-01'), 1,
    'ttc: warning: due date 2020-01-01 is in the past\n');
  assertOk(add(sb, 'Leap day', '--due', '2104-02-29'), 2);
  assert.deepEqual(stored(sb).tasks.map((t) => t.due), ['2020-01-01', '2104-02-29']);
});

for (const d of ['2026-02-30', '2027-02-29', '10/01/2026', '2026-1-5', 'tomorrow']) {
  test(`invalid date ${d} is rejected (criterion 6)`, () => {
    assertFails(sandbox(), ['x', '--due', d], 'ttc: invalid date: ' + d);
  });
}

test('spaces at both ends of the title are removed (criterion 7)', () => {
  const sb = sandbox();
  assertOk(add(sb, '  Buy milk  '), 1);
  assert.equal(stored(sb).tasks[0].title, 'Buy milk');
});

test('inner spaces and non-English text are kept (criterion 8)', () => {
  const sb = sandbox();
  assertOk(add(sb, '  Café  au lait 牛乳 '), 1);
  assert.equal(stored(sb).tasks[0].title, 'Café  au lait 牛乳');
});

const NOT_ONE_LINE = 'ttc: title must be one non-empty line';
const CONTROL = 'ttc: title must not contain control characters';

for (const [name, title] of [
  ['empty', ''],
  ['spaces only', '   '],
]) {
  test(`${name} title is rejected (criterion 9)`, () => {
    assertFails(sandbox(), [title], NOT_ONE_LINE);
  });
}

test('a title with a line break inside is rejected (criterion 10)', () => {
  assertFails(sandbox(), ['line one\nline two'], NOT_ONE_LINE);
});

for (const [name, title] of [
  ['LF at the end', 'Buy milk\n'],
  ['CR at the end', 'Buy milk\r'],
  ['U+2028 inside', 'Buy   milk'],
  ['U+0085 at the end', 'Buy milk\u0085'],
  ['U+2029 inside', 'Buy   milk'],
]) {
  test(`a title with ${name} is a line-break error (criterion 11)`, () => {
    assertFails(sandbox(), [title], NOT_ONE_LINE);
  });
}

for (const [name, title] of [
  ['a tab inside', 'Buy \t milk'],
  ['a tab at the end', 'Buy milk\t'],
  ['a bell', 'Buy milk\u0007'],
]) {
  test(`a title with ${name} is a control-character error (criterion 12)`, () => {
    assertFails(sandbox(), [title], CONTROL);
  });
}

test('repeated tags in any case are kept once, lower case (criterion 13)', () => {
  const sb = sandbox();
  assertOk(add(sb, 'x', '--tag', 'Home', '--tag', 'HOME', '--tag', 'home'), 1);
  assert.deepEqual(stored(sb).tasks[0].tags, ['home']);
});

test('tags with - _ digits and 32 letters are accepted (criterion 14)', () => {
  const sb = sandbox();
  const long = 'abcdefghijklmnopqrstuvwxyzabcdef';
  assertOk(add(sb, 'x', '--tag', 'a-b_9', '--tag', long), 1);
  assert.deepEqual([...stored(sb).tasks[0].tags].sort(), ['a-b_9', long]);
});

for (const t of ['abcdefghijklmnopqrstuvwxyzabcdefa', 'two words', 'café', 'a.b', '-x', '_x']) {
  test(`invalid tag ${JSON.stringify(t)} is rejected (criterion 15)`, () => {
    assertFails(sandbox(), ['x', '--tag', t], 'ttc: invalid tag: ' + t);
  });
}

test('one invalid tag stores nothing, not even the valid one (criterion 16)', () => {
  assertFails(sandbox(), ['x', '--tag', 'ok', '--tag', 'two words'], 'ttc: invalid tag: two words', {
    absent: true,
  });
});

for (const args of [
  [],
  ['--due', '2026-10-01'],
  ['one', 'two'],
  ['x', '--due', '2026-10-01', '--due', '2026-10-02'],
  ['x', '--due'],
  ['x', '--due', '--tag', 'a'],
  ['x', '--tag'],
  ['x', '--priority'],
  ['--urgent'],
]) {
  test(`bad arguments ${JSON.stringify(args)} give a one-line error (criterion 17)`, () => {
    assertFails(sandbox(), args);
  });
}

test('failed past-date adds print only the error and preserve file bytes (TTC-868 AC-5)', () => {
  const sb = sandbox();
  assertOk(add(sb, 'Call mom'), 1);
  const before = fs.readFileSync(sb.file);
  for (const [args, line] of [
    [['Pay rent', '--due', '2000-01-02', '--tag', 'a b'], 'ttc: invalid tag: a b'],
    [['', '--due', '2000-01-02'], 'ttc: title must be one non-empty line'],
    [['Pay rent', '--due', '2000-01-02', '--due', '2000-01-03'], 'ttc: option given twice: --due'],
    [['Pay rent', '--due', '2000-02-30'], 'ttc: invalid date: 2000-02-30'],
  ]) {
    const r = add(sb, ...args);
    assert.equal(r.status, 1);
    assert.equal(r.stdout, '');
    assert.equal(r.stderr, line + '\n');
    assert.deepEqual(fs.readFileSync(sb.file), before);
  }
  fs.writeFileSync(sb.file, 'not json');
  const corrupt = fs.readFileSync(sb.file);
  const r = add(sb, 'Pay rent', '--due', '2000-01-02');
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
  const prefix = 'ttc: cannot read ' + sb.file + ': ';
  assert.ok(r.stderr.startsWith(prefix), r.stderr);
  assert.match(r.stderr.slice(prefix.length), /^[^\n]+\n$/);
  assert.deepEqual(fs.readFileSync(sb.file), corrupt);
});

// Compute calendar dates independently of the production overdue helper.
function dateIn(timeZone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

test('add warns only before local today in both date-line zones (TTC-868 AC-4)', () => {
  for (const tz of ['Pacific/Pago_Pago', 'Pacific/Kiritimati']) {
    let stable = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      const today = dateIn(tz);
      const [y, m, d] = today.split('-').map(Number);
      const yesterday = new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
      const sb = sandbox();
      const options = { env: envFor(sb, tz), encoding: 'utf8' };
      const current = spawnSync(process.execPath, [BIN, 'add', 'Pay rent', '--due', today], options);
      const past = spawnSync(process.execPath, [BIN, 'add', 'Call mom', '--due', yesterday], options);
      // Retry only a real date change, never a stable-date assertion failure.
      if (dateIn(tz) !== today) continue;
      assertOk(current, 1);
      assertOk(past, 2, `ttc: warning: due date ${yesterday} is in the past\n`);
      stable = true;
      break;
    }
    assert.ok(stable, `local date changed during both attempts in ${tz}`);
  }
});

test('a missing data folder and its parents are created (criterion 19)', () => {
  const sb = sandbox();
  sb.dataDir = path.join(sb.base, 'a', 'b', 'data');
  sb.file = path.join(sb.dataDir, 'tasks.json');
  assert.equal(add(sb, 'x').status, 0);
  assert.equal(stored(sb).tasks[0].id, 1);
});

for (const step of ['after-mkdir', 'after-open', 'mid-write', 'after-fsync', 'before-rename']) {
  test(`an add killed at ${step} keeps the old whole list (criterion 20)`, () => {
    const sb = sandbox();
    seed(sb, SEED);
    const before = fs.readFileSync(sb.file);
    const r = spawnSync(process.execPath, [INTERRUPTED_ADD, step], { env: envFor(sb), encoding: 'utf8' });
    assert.equal(r.signal, 'SIGKILL', 'step ' + step + ' did not fire: ' + r.stderr);
    assert.deepEqual(fs.readFileSync(sb.file), before);
    assert.deepEqual(JSON.parse(before), SEED);
  });
}

test('the last id 9007199254740991 is given (criterion 21)', () => {
  const sb = sandbox();
  seed(sb, { nextId: 9007199254740991, tasks: [] });
  assertOk(add(sb, 'Buy milk'), 9007199254740991);
});

test('no id is left at nextId 9007199254740992 (criterion 22)', () => {
  const sb = sandbox();
  seed(sb, { nextId: 9007199254740992, tasks: [] });
  const before = fs.readFileSync(sb.file);
  const r = add(sb, 'Buy milk');
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /^ttc: [^\n]+\n$/);
  assert.deepEqual(fs.readFileSync(sb.file), before);
});

test('ttc help lists the add usage line (criterion 23)', () => {
  const sb = sandbox();
  const r = spawnSync(process.execPath, [BIN, 'help'], { env: envFor(sb), encoding: 'utf8' });
  assert.equal(r.status, 0);
  const lines = r.stdout.split('\n').map((l) => l.trim());
  assert.ok(lines.includes('ttc help'));
  assert.ok(lines.includes('ttc add "<title>" [--due YYYY-MM-DD] [--tag <t>]... [--note "<text>"] [--important]'));
});

test('add --note stores the note typed and trimmed', () => {
  const sb = sandbox();
  assertOk(add(sb, 'Pay rent', '--note', '  bank transfer  '), 1);
  assert.equal(stored(sb).tasks[0].note, 'bank transfer');
});

test('add --note with only spaces is refused before any write', () => {
  const sb = sandbox();
  seed(sb, SEED);
  const before = fs.readFileSync(sb.file);
  const r = add(sb, 'Pay rent', '--note', '  ');
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /^ttc: [^\n]+\n$/);
  assert.deepEqual(fs.readFileSync(sb.file), before);
});

test('TTC_HOME as a regular file fails and keeps the file (criterion 24)', () => {
  const sb = sandbox();
  fs.mkdirSync(sb.base, { recursive: true });
  const notDir = path.join(sb.base, 'file');
  fs.writeFileSync(notDir, 'keep me');
  sb.dataDir = notDir;
  const r = add(sb, 'x');
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /^ttc: [^\n]+\n$/);
  assert.equal(fs.readFileSync(notDir, 'utf8'), 'keep me');
});
