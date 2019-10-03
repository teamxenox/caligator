/**
 * Constants to map to keyboard Event keys
 * @type {Object}
 */
const keys = {
  SHIFT: 'Shift',
  OPEN_PARENTHESIS: '('
};

/**
 * Constants to map to the document.executeCommand function.
 * @type {Object}
 */
const commands = {
  INSERT_TEXT: 'insertText'
};

/**
 * A simple object to track some keyboard state.
 * @type {Object}
 */
const keyboardState = {
  shift: false
};

const overrideShift = (key) => {
  // get the selected text
  const selection = window.getSelection().toString();

  // do this if 
  if (selection.length > 0) {
    if (key === keys.OPEN_PARENTHESIS && document.getElementById('toggle-paren-wrap').checked) {

      // don't replace the text
      event.preventDefault();

      // wrap in parenthesis. Use document.execCommand to make the opperation undoable
      const { selectionStart, selectionEnd } = document.activeElement;
      const selection = document.getSelection().toString();
      document.execCommand(commands.INSERT_TEXT, false, `(${selection})`);

      // reselect the text
      document.activeElement.selectionStart = selectionStart;
      document.activeElement.selectionEnd = selectionEnd + 2;
    }
  }
}

module.exports = {
  keys,
  keyboardState,
  commands,
  overrideShift
};