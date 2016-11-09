goog.require('goog.color.hexToRgb');
goog.require('Blockly.Blocks');
goog.require('MBlockly.BlockKeeper');
goog.require('MBlockly.Control');


MBlockly.BlockKeeper.makeBlock('move_run', ['=SPEED', 'DIRECTION'], function(){
    var iconImages = MBlockly.resources().ICONS;
    var icon = new Blockly.FieldImage(iconImages.MOVE_FORWARD, 30, 30, '*');

    this.setColour(MBlockly.BlockKeeper.HUE.move);
    var dropdown = new Blockly.FieldDropdown([
        [Blockly.Msg.MOVE_FORWARD, 'FORWARD'],
        [Blockly.Msg.MOVE_BACKWARD, 'BACKWARD']
    ], function(newValue) {
        if (newValue == 'FORWARD') {
            icon.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', iconImages.MOVE_FORWARD);
        } else {
            icon.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', iconImages.MOVE_BACKWARD);
        }
    });

    this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField(icon)
        .appendField(Blockly.Msg.MOVE_RUN)
        .appendField(dropdown, 'DIRECTION')
        .appendField(Blockly.Msg.MOVE_SPEED_TIP);
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);

}, function(speed, direction){
    var dir = (direction == 'FORWARD') ? 1 : -1;
    speed ? speed : (speed = 0);
    MBlockly.Action.runSpeed(speed, dir);
});

MBlockly.BlockKeeper.makeBlock('move_turn', ['=SPEED', 'DIRECTION'], function(){
    var iconImages = MBlockly.resources().ICONS;
    var icon = new Blockly.FieldImage(iconImages.MOVE_TURN_LEFT, 30, 30, '*');

    this.setColour(MBlockly.BlockKeeper.HUE.move);
    var dropdown = new Blockly.FieldDropdown([
            [Blockly.Msg.MOVE_TURN_LEFT, 'LEFT'],
            [Blockly.Msg.MOVE_TURN_RIGHT, 'RIGHT']
        ], function(newValue) {
        if (newValue == 'LEFT') {
            icon.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', iconImages.MOVE_TURN_LEFT);
        } else {
            icon.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', iconImages.MOVE_TURN_RIGHT);
        }
    });

        this.appendValueInput('SPEED')
            .setCheck('Number')
            .appendField(icon)
            .appendField(Blockly.Msg.MOVE_TURN)
            .appendField(dropdown, 'DIRECTION')
            .appendField(Blockly.Msg.MOVE_SPEED_TIP);
        this.setInputsInline(true);
        this.setNextStatement(true);
        this.setPreviousStatement(true);

}, function(speed, direction){
    var dir = (direction == 'LEFT') ? 1 : -1;
    speed ? speed : (speed = 0);
    MBlockly.Action.turnSpeed(speed, dir);
});



MBlockly.BlockKeeper.makeBlock('move_rotate', ['ROTATE_WAY', '=SPEED', '=TIME'], function(){
    var iconImages = MBlockly.resources().ICONS;
    var icon = new Blockly.FieldImage(iconImages.MOVE_ROTATE_CLOCKWISE, 30, 30, '*');
    this.setColour(MBlockly.BlockKeeper.HUE.move);

    var rotateWay = new Blockly.FieldDropdown([
        [Blockly.Msg.MOVE_CLOCKWISE, 'CLOCKWISE'],
        [Blockly.Msg.MOVE_ANTICLOCKWISE, 'ANTICLOCKWISE']
    ], function(newValue) {
        if (newValue == 'CLOCKWISE') {
            icon.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', iconImages.MOVE_ROTATE_CLOCKWISE);
        } else {
            icon.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', iconImages.MOVE_ROTATE_ANTICLOCKWISE);
        }
    });

    this.appendDummyInput()
        .appendField(icon)
        .appendField(rotateWay, 'ROTATE_WAY')
        .appendField(Blockly.Msg.MOVE_ROTATE_AT_SPEED);
    this.appendValueInput('SPEED')
        .setCheck('Number');
    this.appendDummyInput()
            .appendField(Blockly.Msg.MOVE_ROTATE_FOR);
    this.appendValueInput('TIME')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField(Blockly.Msg.MOVE_ROTATE_SECOND);

    this.setInputsInline(true);
    this.setOutput(false);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
}, function(rotateWay, speed, time){
    var runtime = this;
    runtime.pause();
    if(rotateWay == 'CLOCKWISE') {
        MBlockly.Action.clockwiseRotate(speed, time);
    } else {
        MBlockly.Action.antiClockwiseRotate(speed, time);
    }
    setTimeout((function(){return function(){
        runtime.resume();
    }})(speed, time, runtime), time*1000);

});


MBlockly.BlockKeeper.makeBlock('move_stop', [], function(){
    var icon = new Blockly.FieldImage(MBlockly.resources().ICONS.MOVE_STOP, 32, 32, '*');
    this.setColour(MBlockly.BlockKeeper.HUE.move);

    this.appendDummyInput()
        .appendField(icon)
        .appendField(Blockly.Msg.MOVE_STOP_MOVING);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
}, function(){
    MBlockly.Control.stopSpeed();
});


/* servo motor */
MBlockly.BlockKeeper.makeBlock('move_set_servo_motor', ['PORT', 'SLOT', "=DEGREE"], function(){
    var port = new Blockly.FieldDropdown([
            [Blockly.Msg.PORT + "1", "PORT-1"],
            [Blockly.Msg.PORT + "2", "PORT-2"],
            [Blockly.Msg.PORT + "3", "PORT-3"],
            [Blockly.Msg.PORT + "4", "PORT-4"]
        ]);

    var slot = new Blockly.FieldDropdown([
            [Blockly.Msg.SLOT + "1", "SLOT-1"],
            [Blockly.Msg.SLOT + "2", "SLOT-2"]
        ]);

    var iconImages = MBlockly.resources().ICONS;
    var icon = new Blockly.FieldImage(iconImages.MOVE_SERVO_MOTOR, 30, 30, '*');
    this.setColour(MBlockly.BlockKeeper.HUE.move);

    this.appendDummyInput()
        .appendField(icon)
        .appendField(Blockly.Msg.MOVE_SERVO_MOTOR_BEGIN)
        .appendField(port, 'PORT')
        .appendField(Blockly.Msg.SLOT)
        .appendField(slot, 'SLOT')
        .appendField(Blockly.Msg.DEGREE);
    this.appendValueInput('DEGREE')
        .setCheck('Number');
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);

}, function(portStr, slotStr, degree){
    var port = parseInt(portStr.data.split('PORT-')[1]);
    var slot = parseInt(slotStr.data.split('SLOT-')[1]);
    degree = parseInt(degree);
    MBlockly.Control.setServoMotor(port, slot, degree);
});