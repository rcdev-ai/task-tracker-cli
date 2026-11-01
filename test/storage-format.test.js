'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { migrateV1ToV2, migrateV2ToV3, parseList } = require('../src/storage');

const body = { nextId: 2, tasks: [{ id: 1, title: 'A', status: 'open', due: null, tags: [] }] };

test('migrateV1ToV2 puts version 2 first and does not touch its input', () => {
  for (const doc of [{ ...body }, { version: 1, ...body }]) {
    const before = JSON.stringify(doc);
    const out = migrateV1ToV2(doc);
    assert.deepEqual(Object.keys(out), ['version', 'nextId', 'tasks']);
    assert.equal(out.version, 2);
    assert.deepEqual(out.tasks, body.tasks);
    assert.equal(JSON.stringify(doc), before);
  }
});

test('migrateV2ToV3 adds note null last to every task and does not touch its input', () => {
  const doc = { version: 2, ...body };
  const before = JSON.stringify(doc);
  const out = migrateV2ToV3(doc);
  assert.deepEqual(Object.keys(out), ['version', 'nextId', 'tasks']);
  assert.equal(out.version, 3);
  assert.deepEqual(Object.keys(out.tasks[0]), ['id', 'title', 'status', 'due', 'tags', 'note']);
  assert.equal(out.tasks[0].note, null);
  assert.equal(JSON.stringify(doc), before);
});

test('parseList refuses a newer version before checking the layout', () => {
  for (const v of ['5', '1000']) {
    const { problem, list: l } = parseList('{"version":' + v + ',"anything":true}');
    assert.equal(l, undefined);
    assert.match(problem, new RegExp('newer ttc \\(format version ' + v + ';'));
  }
});

test('parseList refuses a version that is not a whole number of 1 or more', () => {
  for (const v of ['0', '-1', '-0', '2.5', '"2"', 'null', 'true', '[]', '{}', '1e400']) {
    assert.deepEqual(parseList('{"version":' + v + ',"nextId":1,"tasks":[]}'), {
      problem: 'the version is not a whole number of 1 or more',
    });
  }
});
