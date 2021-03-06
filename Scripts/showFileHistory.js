const fork = require("./fork");

/**
 * Show the current file’s history in Fork.
 */
async function showFileHistory(editor) {
  const relativePath = nova.workspace.relativizePath(editor.document.path);
  await fork(["log", "--", relativePath]);
}

module.exports = showFileHistory;