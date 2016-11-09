Blockly.WorkspaceSvg.prototype.isDeleteArea = function(e) {
  var isDelete = false;
  var mouseXY = Blockly.mouseToSvg(e, this.options.svg);
  var xy = new goog.math.Coordinate(mouseXY.x, mouseXY.y);
  if (this.deleteAreaTrash_) {
    if (this.deleteAreaTrash_.contains(xy)) {
      this.trashcan.setOpen_(true);
      Blockly.Css.setCursor(Blockly.Css.Cursor.DELETE);
      return true;
    }
    this.trashcan.setOpen_(false);
  }
  if (this.deleteAreaToolbox_) {
    if (this.deleteAreaToolbox_.contains(xy)) {
      Blockly.Css.setCursor(Blockly.Css.Cursor.DELETE);

      // modified
      if(this.onMouseOverToolboxDeletionZone){
        this.onMouseOverToolboxDeletionZone();
      }
      return true;
    }
  }

  // modified
  if(this.onMouseOutToolboxDeletionZone){
    this.onMouseOutToolboxDeletionZone();
  }
  Blockly.Css.setCursor(Blockly.Css.Cursor.CLOSED);
  return false;
};