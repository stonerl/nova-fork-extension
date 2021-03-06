const showFileHistory = require('./showFileHistory.js');
const openRepository = require('./openRepository.js');

exports.activate = function () {
  // Do work when the extension is activated
};

exports.deactivate = function () {
  // Clean up state before the extension is deactivated
};

nova.commands.register('open-in-fork.fileHistory', async (editor) => {
  await showFileHistory(editor);
});

nova.commands.register('open-in-fork.openRepository', async () => {
  openRepository();
});
