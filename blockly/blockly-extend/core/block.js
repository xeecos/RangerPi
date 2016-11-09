/**
 * Obtain a newly created block.
 * @param {!Blockly.Workspace} workspace The block's workspace.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @return {!Blockly.Block} The created block
 */
Blockly.Block.obtain = function(workspace, prototypeName, extra_attributes) {
  if (Blockly.Realtime.isEnabled()) {
    return Blockly.Realtime.obtainBlock(workspace, prototypeName);
  } else {
    if (workspace.rendered) {
      var newBlock = new Blockly.BlockSvg();
    } else {
      var newBlock = new Blockly.Block();
    }
    newBlock.extra_attributes = extra_attributes;
    newBlock.initialize(workspace, prototypeName);
    return newBlock;
  }
};

/**
 * Duplicate this block and its children.
 * @return {!Blockly.Block} The duplicate.
 * @private
 */
Blockly.Block.prototype.duplicateBelow_ = function() {
  // Create a duplicate via XML.
  var xmlBlock = Blockly.Xml.blockToDom_(this);
  // Blockly.Xml.deleteNext(xmlBlock);
  var newBlock = Blockly.Xml.domToBlock(
      /** @type {!Blockly.Workspace} */ (this.workspace), xmlBlock);
  // Move the duplicate next to the old block.
  var xy = this.getRelativeToSurfaceXY();
  if (this.RTL) {
    xy.x -= Blockly.SNAP_RADIUS;
  } else {
    xy.x += Blockly.SNAP_RADIUS;
  }
  xy.y += Blockly.SNAP_RADIUS * 2;
  newBlock.moveBy(xy.x, xy.y);
  newBlock.select();
  return newBlock;
};