Blockly.onMouseUp_ = function(e) {
  var workspace = Blockly.getMainWorkspace();
  Blockly.Css.setCursor(Blockly.Css.Cursor.OPEN);
  workspace.isScrolling = false;

  // modified
  if(workspace.onFireMouseUp){
    workspace.onFireMouseUp();
  }
  // Unbind the touch event if it exists.
  if (Blockly.onTouchUpWrapper_) {
    Blockly.unbindEvent_(Blockly.onTouchUpWrapper_);
    Blockly.onTouchUpWrapper_ = null;
  }
  if (Blockly.onMouseMoveWrapper_) {
    Blockly.unbindEvent_(Blockly.onMouseMoveWrapper_);
    Blockly.onMouseMoveWrapper_ = null;
  }
};
