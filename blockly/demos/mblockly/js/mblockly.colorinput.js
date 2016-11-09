/**
 * Copyright 2015 Makeblock
 * Author: Wangyu
 * Description: provide an slider interface
 * to input numbers between 0-255;
 * 
 */

'use strict';

goog.provide('MBlockly.FieldColour');

goog.require('Blockly.Blocks');
goog.require('goog.ui.Dialog')
goog.require('goog.ui.Slider');

MBlockly.FieldColour = function(text, opt_changeHandler, opt_min, opt_max) {
  MBlockly.FieldColour.superClass_.constructor.call(this, text);
  this.setChangeHandler(opt_changeHandler);
};
goog.inherits(MBlockly.FieldColour, Blockly.FieldColour);

/**
 * Clone this FieldTextInput.
 * @return {!Blockly.FieldTextInput} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
MBlockly.FieldColour.prototype.clone = function() {
  return new MBlockly.FieldColour(this.getText(), this.changeHandler_);
};

Blockly.Blocks['colour_picker'] = {
  /**
   * Block for colour picker.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.COLOUR_PICKER_HELPURL);
    this.setColour(Blockly.Blocks.colour.HUE);
    this.appendDummyInput()
        .appendField(new MBlockly.FieldColour('#ff0000'), 'COLOUR');
    this.setOutput(true, 'Colour');
    this.setTooltip(Blockly.Msg.COLOUR_PICKER_TOOLTIP);
  }
};

// override showEditor_ function only in mobile devices
if (goog.userAgent.MOBILE || goog.userAgent.ANDROID ||
                      goog.userAgent.IPAD) {
  var dialog1 = new goog.ui.Dialog();
}

MBlockly.FieldColour.prototype.showEditor_ = function(opt_quietInput) {
    // this is mostly copied from google library;
    // not a really good practice, but clean.
  var self = this;
  var dialog1 = new goog.ui.Dialog();
  dialog1.setContent('<div id="color-picker-box">'+
                        '<div id="color-picker-R">'+
                          '<input type="text" data-wheelcolorpicker="" data-wcp-layout="block" class="colorpicker">'+
                        '<button id="color-dialog-ok"></button>'+
                     '</div>');
  dialog1.setVisible(true);
  dialog1.setDisposeOnHide(true);
  $('input[data-wheelcolorpicker]').wheelColorPicker();

  $('.modal-dialog-title').hide();
  $('.modal-dialog-buttons').hide();

  var eventType = MBlockly.App.checkDeviceType();

  $('.modal-dialog-bg').off(eventType);
    $('.modal-dialog-bg').on(eventType, function(){
      $('#power-slider-box').remove();
      dialog1.setVisible(false);
  });

  $('#color-dialog-ok').on(eventType, function(){
    self.setValue('#'+$('.colorpicker').val());
    $('#color-picker-box').remove();
    dialog1.setVisible(false);
  });

};