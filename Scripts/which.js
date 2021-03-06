/**
 * Locate a command that is expected to be on the shell’s PATH.
 */
function which(command) {
  return new Promise((resolve) => {
    var process = new Process("which", {
      shell: true,
      args: [command],
    });

    const lines = [];

    process.onStdout(function (data) {
      if (data) {
        lines.push(data.trim());
      }
    });

    process.onDidExit(function (status) {
      if (status === 0) {
        const foundAt = lines.join("\n");
        resolve(foundAt);
      } else {
        resolve(undefined);
      }
    });

    process.start();
  });
}

module.exports = which;