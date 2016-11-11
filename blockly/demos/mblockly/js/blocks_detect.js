goog.require('Blockly.Blocks');
goog.require('MBlockly.BlockKeeper');
goog.require('MBlockly.Control');

MBlockly.BlockKeeper.makeBlock('detect_ultrasonic', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.detect);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.DETECT_ULTRASONIC, 30, 30, '*'))
        .appendField(Blockly.Msg.DETECT_DISTANCE)
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(){
    var runtime = this;
    runtime.pause();
    var val = MBlockly.Control.getUltrasonicValue(function(){
        MBlockly.Control.out(val);
        runtime.resume();
    });
    return val;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);

MBlockly.BlockKeeper.makeBlock('detect_ultrasonic_threshold', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.event);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.START_OBSTACLE_DETECTED, 30, 30, '*'))
        .appendField(Blockly.Msg.DETECT_DISTANCE_THRESHOLD)
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(){
    var runtime = this;
    runtime.pause();
    var val = MBlockly.Control.getUltrasonicValue(function(){
        MBlockly.Control.out(val);
        runtime.resume();
    });
    var wrapper = {
        toString: function(){
            if(this.val < 30){
                return '1';
            }
            else{
                return '0';  // in javascript 'false' == true!
            }
        }
    };
    wrapper.val = val;
    return wrapper;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);


MBlockly.BlockKeeper.makeBlock('detect_lightness', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.detect);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.DETECT_BRIGHTNESS, 30, 30, '*'))
        .appendField(Blockly.Msg.DETECT_LIGHTNESS);
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(){
    var runtime = this;
    runtime.pause();
    var val = MBlockly.Control.getLightSensorValue(function(){
        MBlockly.Control.out(val);
        runtime.resume();
    });
    return val;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);

MBlockly.BlockKeeper.makeBlock('detect_lightness_threshold', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.event);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.START_RECEIVE_LIGHT, 30, 30, '*'))
        .appendField(Blockly.Msg.DETECT_LIGHTNESS_THRESHOLD);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(){
    var runtime = this;
    runtime.pause();
    var val = MBlockly.Control.getLightSensorValue(function(){
        runtime.resume();
    });
    var wrapper = {
        toString: function(){
            if(this.val/10 > 60){
                return '1';
            }
            else{
                return '0';  // in javascript 'false' == true!
            }
        }
    };
    wrapper.val = val;
    return wrapper;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);


MBlockly.BlockKeeper.makeBlock('detect_common_lightness', ['PORT'], function(){
    var port = new Blockly.FieldDropdown([
            [Blockly.Msg.PORT + "3", "PORT-3"],
            [Blockly.Msg.PORT + "4", "PORT-4"]
        ]);

    this.setColour(MBlockly.BlockKeeper.HUE.detect);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.DETECT_BRIGHTNESS, 30,30, '*'))
        .appendField(Blockly.Msg.DETECT_LIGHTNESS)
        .appendField(port, 'PORT');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(portStr){
    var port = parseInt(portStr.data.split('PORT-')[1]);
    var runtime = this;
    runtime.pause();
    var val = MBlockly.Control.getCommonLightSensorValue(port, function() {
        runtime.resume();
    });
    return val;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);


MBlockly.BlockKeeper.makeBlock('detect_common_volume', ['PORT'], function(){
    var port = new Blockly.FieldDropdown([
            [Blockly.Msg.PORT + "3", "PORT-3"],
            [Blockly.Msg.PORT + "4", "PORT-4"]
        ]);

    this.setColour(MBlockly.BlockKeeper.HUE.detect);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.EVENT_SOUND, 30,30, '*'))
        .appendField(Blockly.Msg.DETECT_VOLUME)
        .appendField(port, 'PORT');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(portStr){
    var port = parseInt(portStr.data.split('PORT-')[1]);
    var runtime = this;
    runtime.pause(); // 暂停程序执行
    var val = MBlockly.Control.getCommonSoundSensorValue(port, function() {
        runtime.resume();
    });
    return val;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);

MBlockly.BlockKeeper.makeBlock('start_detect_face', ['face_type'], function(){
    var iconImages = MBlockly.resources().ICONS;
    var icon = new Blockly.FieldImage(iconImages.MOVE_TURN_LEFT, 30, 30, '*');

    this.setColour(MBlockly.BlockKeeper.HUE.move);
    var dropdown = new Blockly.FieldDropdown([
            [Blockly.Msg.FACE_TYPE, 'face'],
            [Blockly.Msg.EMOTION_TYPE, 'emotion']
        ], function(newValue) {
    });

        this.appendDummyInput()
	    .appendField(icon)
            .appendField(Blockly.Msg.START_DETECT_FACE)
            .appendField(dropdown, 'face_type')
        this.setInputsInline(true);
        this.setNextStatement(true);
        this.setPreviousStatement(true);

}, function(type){
	if(type=="face"){
		MBlockly.Control.requestFace();
	}
});

MBlockly.BlockKeeper.makeBlock('face_status_detected', ['_face_type'], function(){
    var status = new Blockly.FieldDropdown([
            ["age", "Age"],
            ["smile", "Smile"]
        ]);

    this.setColour(MBlockly.BlockKeeper.HUE.detect);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.EVENT_SOUND, 30,30, '*'))
        .appendField(Blockly.Msg.FACE_STATUS)
        .appendField(status, '_face_type');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(status){
    var val = MBlockly.Control["face"+status]();
    return val;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);


MBlockly.BlockKeeper.makeBlock('emotion_status_detected', ['emotion_status'], function(){
    var status = new Blockly.FieldDropdown([
            ["happiness", "Happiness"],
            ["sadness", "Sadness"],
            ["superise", "Superise"]
        ]);

    this.setColour(MBlockly.BlockKeeper.HUE.detect);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.EVENT_SOUND, 30,30, '*'))
        .appendField(Blockly.Msg.EMOTION_STATUS)
        .appendField(status, 'emotion_status');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(portStr){
    var val = 0
    return val;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);