'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const BIN = path.join(__dirname, '..', 'bin', 'ttc.js');

function ttc(args, { ttcHome } = {}) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'ttc-'));
  const env = { PATH: process.env.PATH, HOME: home };
  if (ttcHome !== undefined) env.TTC_HOME = ttcHome;
  const r = spawnSync(process.execPath, [BIN, ...args], { env, encoding: 'utf8' });
  return { ...r, home };
}

function usageLines(stdout) {
  return stdout.split('\n').map((l) => l.trim());
}

for (const args of [[], ['help'], ['--help']]) {
  test(`ttc ${args.join(' ')} prints the usage and creates nothing (criteria 1-4)`, () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ttc-'));
    const ttcHome = path.join(base, 'missing', 'data');
    const r = ttc(args, { ttcHome });
    assert.equal(r.status, 0);
    assert.equal(r.stderr, '');
    assert.ok(usageLines(r.stdout).includes('ttc help'));
    assert.equal(fs.existsSync(path.join(base, 'missing')), false);
    assert.equal(fs.existsSync(path.join(r.home, '.ttc')), false);
  });
}

test('ttc -h matches --help and help without creating or changing task data', (t) => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ttc-'));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));

  for (const existing of [false, true]) {
    const ttcHome = path.join(base, existing ? 'existing' : 'missing', 'data');
    const file = path.join(ttcHome, 'tasks.json');
    if (existing) {
      fs.mkdirSync(ttcHome, { recursive: true });
      fs.writeFileSync(file, JSON.stringify({ version: 4, nextId: 1, tasks: [] }) + '\n');
    }
    const before = existing ? fs.readFileSync(file) : null;
    const mtime = existing ? fs.statSync(file, { bigint: true }).mtimeNs : null;
    let expected;

    for (const flag of ['--help', '-h', 'help']) {
      const r = ttc([flag], { ttcHome });
      t.after(() => fs.rmSync(r.home, { recursive: true, force: true }));
      assert.equal(r.status, 0, flag);
      assert.equal(r.stderr, '', flag);
      if (flag === '--help') expected = r.stdout;
      assert.equal(r.stdout, expected, flag);
      assert.equal(fs.existsSync(path.join(r.home, '.ttc')), false);
      if (existing) {
        assert.deepEqual(fs.readFileSync(file), before);
        assert.equal(fs.statSync(file, { bigint: true }).mtimeNs, mtime);
      } else {
        assert.equal(fs.existsSync(file), false);
        assert.equal(fs.existsSync(path.dirname(ttcHome)), false);
      }
    }
  }
});

test('ttc help extra is a one-line error (criterion 5)', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ttc-'));
  const r = ttc(['help', 'extra'], { ttcHome: path.join(base, 'data') });
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /^ttc: [^\n]+\n$/);
});

test('ttc frobnicate is the exact unknown-command line (criterion 6)', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ttc-'));
  const ttcHome = path.join(base, 'data');
  const r = ttc(['frobnicate'], { ttcHome });
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
  assert.equal(r.stderr, 'ttc: unknown command: frobnicate (see ttc help)\n');
  assert.equal(fs.existsSync(ttcHome), false);
  assert.equal(fs.existsSync(path.join(r.home, '.ttc')), false);
});

test('ttc help lists the add, list, export and import usages (RCDEV-830 AC31)', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ttc-'));
  const r = ttc(['help'], { ttcHome: path.join(base, 'data') });
  assert.equal(r.status, 0);
  const lines = usageLines(r.stdout);
  assert.ok(lines.includes('ttc help'));
  assert.ok(lines.includes('ttc add "<title>" [--due YYYY-MM-DD] [--tag <t>]... [--note "<text>"] [--important]'));
  assert.ok(lines.some((l) => l.startsWith('ttc list ')));
  assert.ok(lines.some((l) => l.startsWith('ttc rename ')));
  assert.ok(lines.some((l) => l.startsWith('ttc delete ')));
  assert.ok(lines.some((l) => l.startsWith('ttc done ')));
  assert.ok(lines.some((l) => l.startsWith('ttc reopen ')));
  assert.ok(lines.some((l) => l.startsWith('ttc tag ')));
  assert.equal(lines.indexOf('ttc note <id> ["<text>" | --clear]'), lines.findIndex((l) => l.startsWith('ttc tag ')) + 1);
  assert.ok(lines.includes(
    'ttc export [<file>] [--format json|csv] [--open|--done|--all|--overdue] [--no-due] [--tag <t>] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--search <text>]',
  ));
  assert.ok(lines.includes('ttc import <file>'));
});
