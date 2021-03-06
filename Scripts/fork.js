const which = require("./which.js");

/**
 * Run the fork command with the given arguments.
 */
async function fork(args) {
  const forkPath = await which("fork");

  if (!forkPath) {
    showForkInstructions();
    return;
  }

  return new Promise((resolve, reject) => {
    var process = new Process(forkPath, {
      args,
      cwd: nova.workspace.path,
    });

    var errLines = [];

    process.onStdout(function (data) {
      if (data) {
        errLines.push(data.trim());
      }
    });

    process.onStderr(function (data) {
      if (data) {
        errLines.push(data.trim());
      }
    });

    process.onDidExit(function (status) {
      if (status !== 0) {
        const message = "Could not run the fork utility.";
        nova.workspace.showInformativeMessage(
          nova.localize(message + "\n\n" + errLines.join("\n"))
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
 * Show instructions for setting up the fork command if it’s not found.
 */
function showForkInstructions() {
  const instructionsUrl = "https://git-fork.com";

  const lines = [
    "To use this command, you must install the Fork app.",
    "",
    "For more information, see:",
    `${instructionsUrl}`,
  ];
  nova.workspace.showActionPanel(
    nova.localize(lines.join("\n")),
    {
      buttons: ["Download Fork", "Close"],
    },
    (index) => {
      if (index === 0) {
        nova.openURL(instructionsUrl);
      }
    }
  );
}

module.exports = fork;