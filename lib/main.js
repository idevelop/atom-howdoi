'use babel';

var howdoi = require("./howdoi");

function inlineSearchReplace() {
  var editor = atom.workspace.getActivePaneItem();
  if (!(editor instanceof require('atom').TextEditor)) {
    return;
  }

  var googleAPIKey = atom.config.get('howdoi.googleApiKey');
  if (!googleAPIKey) {
    atom.notifications.addWarning(`Missing Google API Key, please check the package\'s Settings.`);
    return ;
  }

  editor.moveToBeginningOfLine();
  editor.selectToEndOfLine();
  var selection = editor.getSelectedText();
  var whitespace = selection.match(/^(\s)*/)[0];

  selection = selection.trim();

  if (selection.length == 0) return;

  var grammar = editor.getGrammar();
  var query = selection +
    (grammar.scopeName.startsWith('text.plain.') ? '' : ` in ${grammar.name}`);

  var notification = atom.notifications.addInfo(`Searching for ${query}`, {
    dismissable: true,
  });

  howdoi(query, googleAPIKey, result => {
    var code = result.split('\n').map(line => whitespace + line).join('\n');
    editor.insertText(code);
    notification.dismiss();
  }, () => {
    atom.notifications.addWarning(`Nobody knows how to ${query} :-/`);
    notification.dismiss();
  }, error => {
    atom.notifications.addError(error);
    notification.dismiss();
  });
}

module.exports = {
  activate: state => {
    atom.commands.add('atom-workspace', 'atom-howdoi:inline', inlineSearchReplace);
  },
  config: {
    googleApiKey: {
      title: 'Google API Key',
      description: 'Please entery your Google API Key. See the readme for details.',
      type: 'string',
      default: '',
      order: 1,
    }
  }
};
