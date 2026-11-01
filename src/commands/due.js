'use strict';

const { parseArgs, parseId } = require('../args');
const { TtcError } = require('../errors');
const { isValidDate } = require('../rules');
const { readList, writeList } = require('../storage');
const { withLock } = require('../lock');

module.exports = {
  name: 'due',
  usage: 'ttc due <id> YYYY-MM-DD | --clear',
  run(args, ctx) {
    const parsed = parseArgs(args, {
      positionals: ['<id>', '[YYYY-MM-DD]'],
      options: { '--clear': { value: false } },
    });
    const id = parseId(parsed.positionals[0]);
    const due = parsed.positionals[1];
    const clear = Object.hasOwn(parsed.options, '--clear');
    if (clear && due !== undefined) throw new TtcError('due date and --clear cannot be combined');
    if (!clear && due === undefined) throw new TtcError('no due date change specified');
    if (due !== undefined && !isValidDate(due)) throw new TtcError('invalid date: ' + due);

    const message = withLock(() => {
      const list = readList();
      const task = list.tasks.find((t) => t.id === id);
      if (task === undefined) throw new TtcError('no task with id ' + id);
      if (clear) {
        if (task.due === null) return 'Task ' + id + ' has no due date\n';
        task.due = null;
        writeList(list);
        return 'Cleared due date of task ' + id + '\n';
      }
      task.due = due;
      writeList(list);
      return 'Set due date of task ' + id + ' to ' + due + '\n';
    });
    ctx.stdout.write(message);
  },
};
