/**
 * Centralized command dispatcher for running Fork Git client commands.
 * Each command resolves the repo path and invokes the Fork CLI with appropriate arguments.
 */

const { fork } = require('./fork');

const commands = {
  openRepository: () => fork(['open']),

  showCommitHistory: () => fork(['log']),

  openCommitView: () => fork(['status']),

  showFileHistory: async (editor) => {
    const path = nova.workspace.relativizePath(editor.document.path);
    const opened = await fork(['open']);
    if (!opened) return;
    return fork(['log', '--', path]);
  },
};

module.exports = commands;
