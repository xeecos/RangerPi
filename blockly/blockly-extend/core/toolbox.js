/**
 * Expand or collapse the node on mouse click.
 * @param {!goog.events.BrowserEvent} e The browser event.
 * @override

Blockly.Toolbox.TreeNode.prototype.onMouseDown = function(e) {
  // Expand icon.
  if (this.hasChildren() && this.isUserCollapsible_) {
    this.toggle();
    this.select();
  } else if (this.isSelected()) {
    this.getTree().setSelectedItem(null);
  } else if (e.toString() == "[object TouchEvent]") {   // prevent toolbox popup because user clicked a overlay window
    this.select();
  }
  this.updateRow();
}; */