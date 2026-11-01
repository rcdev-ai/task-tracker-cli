'use strict';

// Property 1: random argument lists against random stored state. Valid input
// matches the reference model's output and bytes; invalid input fails with one
// "ttc: " line and leaves every file as it was. Required PD-0014 / PD-0016
// cases also check the exact error and validation order in both modes.

const assert = require('node:assert/strict');
const { defineFuzzProperty } = require('./support/fuzz-harness');
const { genArgsCase, ARGS_LABELS, ARGS_SAMPLE_EVERY, REQUIRED_ARGS_CASES } = require('./support/fuzz-gen');

const cases = 10000;
assert.ok(REQUIRED_ARGS_CASES.length <= Math.ceil(cases / ARGS_SAMPLE_EVERY), 'required no-due and due cases must fit in subprocess sampling slots');

defineFuzzProperty({
  name: 'fuzz-args',
  generate: genArgsCase,
  labels: ARGS_LABELS,
  minPerLabel: 100,
  minOkShare: 0.25,
  cases,
  sampleEvery: ARGS_SAMPLE_EVERY,
});
