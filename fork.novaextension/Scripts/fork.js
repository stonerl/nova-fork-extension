const cache = new Map();

/**
 * Locate a binary in the system PATH and cache it.
 */
function locate(command) {
  if (cache.has(command)) {
    return Promise.resolve(cache.get(command));
  }

  return new Promise((resolve) => {
    const process = new Process('which', {
      shell: true,
      args: [command],
    });

    const lines = [];

    process.onStdout((data) => {
      if (data) lines.push(data.trim());
    });

    process.onDidExit((status) => {
      if (status === 0) {
        const foundAt = lines.join('\n');
        cache.set(command, foundAt);
        resolve(foundAt);
      } else {
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
  const forkPath = await locate('fork');

  if (!forkPath) {
    showForkInstructions();
    return;
  }

  return new Promise((resolve, reject) => {
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
        reject(new Error(message));
      } else {
        resolve();
      }
    });

    process.start();
  });
}

/**
 * Show instructions for setting up the Fork app if it’s not found.
 */
function showForkInstructions() {
  const instructionsUrl = 'https://fork.dev';
  const lines = [
    'To use this command, you must install the Fork app.',
    '',
    'For more information, see:',
    instructionsUrl,
  ];

  nova.workspace.showActionPanel(
    lines.join('\n'),
    {
      buttons: ['Download Fork', 'Close'],
    },
    (index) => {
      if (index === 0) nova.openURL(instructionsUrl);
    },
  );
}

module.exports = fork;
