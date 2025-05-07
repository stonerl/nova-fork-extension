const cache = new Map();

/**
 * Locate a binary in the system PATH and cache it.
 */
function locateFork() {
  if (cache.has('fork')) {
    return Promise.resolve(cache.get('fork'));
  }

  return new Promise((resolve) => {
    const process = new Process('which', {
      shell: true,
      args: ['fork'],
    });

    const lines = [];

    process.onStdout((data) => {
      if (data) lines.push(data.trim());
    });

    process.onDidExit((status) => {
      if (status === 0) {
        const foundAt = lines.join('\n');
        cache.set('fork', foundAt);
        resolve(foundAt);
      } else {
        showForkInstructions();
        resolve(undefined);
      }
    });

    process.start();
  });
}

/**
 * Run the Fork app with the given arguments.
 */
async function fork(args) {
  const forkPath = await locateFork();
  if (!forkPath) return false;

  return new Promise((resolve) => {
    const process = new Process(forkPath, {
      args,
      cwd: nova.workspace.path,
    });

    const errLines = [];

    process.onStdout((data) => {
      if (data) errLines.push(data.trim());
    });

    process.onStderr((data) => {
      if (data) errLines.push(data.trim());
    });

    process.onDidExit((status) => {
      if (status !== 0) {
        const message = 'Could not run the fork utility.';
        nova.workspace.showInformativeMessage(
          `${message}\n\n${errLines.join('\n')}`,
        );
        resolve(false);
      } else {
        resolve(true);
      }
    });

    process.start();
  });
}

/**
 * Show instructions for setting up the Fork app if it’s not found.
 */
function showForkInstructions() {
  const lines = [
    'To use this extension, you must install the Fork app and its command-line tool.',
    '',
    'For more information, see the extension’s Details page:',
  ];

  nova.workspace.showActionPanel(
    lines.join('\n'),
    {
      buttons: ['Open Details', 'Close'],
    },
    (index) => {
      if (index === 0) nova.extension.openReadme();
    },
  );
}

module.exports = {
  fork,
  locateFork,
};
