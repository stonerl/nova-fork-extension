const forkCommands = require('./forkCommands.js');

let gitWatcher = null;

function checkGitPresence() {
  const root = nova.workspace.path;
  if (!root) return false;
  return nova.fs.access(`${root}/.git`, nova.fs.F_OK);
}

exports.activate = function () {
  // Preload Fork path to trigger locate + prompt if missing
  require('./fork.js').locateFork?.();

  // 1) set initial state
  nova.workspace.context.set('isGitRepo', checkGitPresence());

  // 2) watch for .git appearing/disappearing anywhere in the workspace
  gitWatcher = nova.fs.watch(null, () => {
    nova.workspace.context.set('isGitRepo', checkGitPresence());
  });

  // 3) register commands (they only light up when isGitRepo===true)
  nova.commands.register(
    'fork.fileHistory',
    async (editor) => await forkCommands.showFileHistory(editor),
  );
  nova.commands.register(
    'fork.commitHistory',
    async () => await forkCommands.showCommitHistory(),
  );
  nova.commands.register(
    'fork.localChanges',
    async () => await forkCommands.openCommitView(),
  );
  nova.commands.register(
    'fork.openRepository',
    async () => await forkCommands.openRepository(),
  );
};

exports.deactivate = function () {
  if (gitWatcher) {
    gitWatcher.dispose();
    gitWatcher = null;
  }
};
