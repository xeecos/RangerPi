/**
 * Install this field on a block.
 * @param {!Blockly.Block} block The block containing this field.
 */
Blockly.Field.prototype.init = function(block) {
  if (this.sourceBlock_) {
    // Field has already been initialized once.
    return;
  }
  this.sourceBlock_ = block;
  // Build the DOM.
  this.fieldGroup_ = Blockly.createSvgElement('g', {}, null);
  if (!this.visible_) {
    this.fieldGroup_.style.display = 'none';
  }
  this.borderRect_ = Blockly.createSvgElement('rect',
      {'rx': 4,
       'ry': 4,
       'x': -Blockly.BlockSvg.SEP_SPACE_X / 2,
       'y': -15,
       'height': 20}, this.fieldGroup_);
  this.textElement_ = Blockly.createSvgElement('text',
      {'class': 'blocklyText'}, this.fieldGroup_);

  this.updateEditable();
  block.getSvgRoot().appendChild(this.fieldGroup_);
  this.mouseUpWrapper_ =
      Blockly.bindEvent_(this.fieldGroup_, 'mouseup', this, this.onMouseUp_);
  // Force a render.
  this.updateTextNode_();
};


/**
 * Handle a mouse up event on an editable field.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.Field.prototype.onMouseUp_ = function(e) {
  if (Blockly.isRightButton(e)) {
    // Right-click.
    return;
  } else if (Blockly.dragMode_ == 2) {
    // Drag operation is concluding.  Don't open the editor.
    return;
  } else if (this.sourceBlock_.isEditable()) {
    // Non-abstract sub-classes must define a showEditor_ method.
    this.showEditor_();
  }
};