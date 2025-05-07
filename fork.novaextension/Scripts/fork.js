const cache = new Map();

/**
 * Locate the Fork CLI binary in the user's PATH and cache the result.
 *
 * Uses the `which` command to find the full path to the `fork` executable.
 * If found, the result is cached to avoid repeated lookups.
 * If not found, shows setup instructions and returns undefined.
 *
 * @returns {Promise<string | undefined>} The path to the `fork` binary, or undefined if not found.
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
 *
 * If Fork is not installed, shows setup instructions and returns false.
 * If Fork is launched for the first time, waits briefly to ensure it is ready
 * before resolving. Otherwise, executes the command immediately.
 *
 * @param {string[]} args - Arguments to pass to the Fork CLI.
 * @returns {Promise<boolean>} Resolves to true on success, or false if Fork could not be run.
 */
async function fork(args) {
  const forkPath = await locateFork();
  if (!forkPath) return false;

  const wasRunning = await isForkRunning();

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

    process.onDidExit(async (status) => {
      if (status !== 0) {
        const message = 'Could not run the fork utility.';
        nova.workspace.showInformativeMessage(
          `${message}\n\n${errLines.join('\n')}`,
        );
        resolve(false);
      } else {
        if (!wasRunning) {
          await new Promise((r) => setTimeout(r, 500));
        }
        resolve(true);
      }
    });

    process.start();
  });
}

/**
 * Check if the Fork app is currently running.
 *
 * Uses `ps -A` and searches for "Fork.app" in the process list.
 * Returns true if the app is running, false otherwise.
 */
function isForkRunning() {
  const ps = new Process('/bin/ps', { args: ['-A'], shell: false });

  let output = '';
  ps.onStdout((data) => (output += data));

  return new Promise((resolve) => {
    ps.onDidExit(() => {
      resolve(/\bFork\.app\b/.test(output));
    });
    ps.start();
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
