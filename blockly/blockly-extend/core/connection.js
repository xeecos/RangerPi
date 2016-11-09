/**
 * Add highlighting around this connection.
 */
/// patched by callblueday - avoid block drop
Blockly.Connection.prototype.highlight = function() {
  var steps;
  if (this.type == Blockly.INPUT_VALUE || this.type == Blockly.OUTPUT_VALUE) {
    var tabWidth = this.sourceBlock_.RTL ? -Blockly.BlockSvg.TAB_WIDTH :
        Blockly.BlockSvg.TAB_WIDTH;

    // modified
    steps = 'm 0,0 v 10 c 0,10 ' + -tabWidth + ',-8 ' + -tabWidth + ',7.5 s ' +
            tabWidth + ',-2.5 ' + tabWidth + ',7.5 v 10';
  } else {
    if (this.sourceBlock_.RTL) {
      steps = 'm 20,0 h -5 ' + Blockly.BlockSvg.NOTCH_PATH_RIGHT + ' h -5';
    } else {
      steps = 'm -20,0 h 5 ' + Blockly.BlockSvg.NOTCH_PATH_LEFT + ' h 5';
    }
  }
  var xy = this.sourceBlock_.getRelativeToSurfaceXY();
  var x = this.x_ - xy.x;
  var y = this.y_ - xy.y;
  Blockly.Connection.highlightedPath_ = Blockly.createSvgElement('path',
      {'class': 'blocklyHighlightedConnectionPath',
       'd': steps,
       transform: 'translate(' + x + ', ' + y + ')'},
      this.sourceBlock_.getSvgRoot());
};
