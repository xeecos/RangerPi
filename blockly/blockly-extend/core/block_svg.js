Blockly.BlockSvg.prototype.onMouseDown_ = function(e) {
  if (this.isInFlyout) {
    return;
  }
  // Update Blockly's knowledge of its own location.
  Blockly.svgResize(this.workspace);
  Blockly.terminateDrag_();
  this.select();
  Blockly.hideChaff();
  if (Blockly.isRightButton(e)) {
    // Right-click.
    this.showContextMenu_(e);
  } else if (!this.isMovable()) {
    // Allow unmovable blocks to be selected and context menued, but not
    // dragged.  Let this event bubble up to document, so the workspace may be
    // dragged instead.
    return;
  } else {
    // Left-click (or middle click)
    Blockly.removeAllRanges();
    Blockly.Css.setCursor(Blockly.Css.Cursor.CLOSED);
    // Look up the current translation and record it.
    var xy = this.getRelativeToSurfaceXY();
    this.startDragX = xy.x;
    this.startDragY = xy.y;
    // Record the current mouse position.
    this.startDragMouseX = e.clientX;
    this.startDragMouseY = e.clientY;
    Blockly.dragMode_ = 1;
    Blockly.BlockSvg.onMouseUpWrapper_ = Blockly.bindEvent_(document,
        'mouseup', this, this.onMouseUp_);

    // modified: 解决拖动时用另一个手指按画面删除遮罩不消失的问题
    $(window).on('touchend', function(){
      $('#blockDeletionMask').hide();
    });
    // Blockly.BlockSvg.onMouseUpWrapper_ = Blockly.bindEvent_(document,
    //     'touchend', this, function(){
    //       $('#blockDeletionMask').hide();
    //     });
    Blockly.BlockSvg.onMouseMoveWrapper_ = Blockly.bindEvent_(document,
        'mousemove', this, this.onMouseMove_);
    // Build a list of bubbles that need to be moved and where they started.
    this.draggedBubbles_ = [];
    var descendants = this.getDescendants();
    for (var x = 0, descendant; descendant = descendants[x]; x++) {
      var icons = descendant.getIcons();
      for (var y = 0; y < icons.length; y++) {
        var data = icons[y].getIconLocation();
        data.bubble = icons[y];
        this.draggedBubbles_.push(data);
      }
    }
  }
  // This event has been handled.  No need to bubble up to the document.
  e.stopPropagation();
};


Blockly.BlockSvg.prototype.onMouseUp_ = function(e) {
  var this_ = this;
  Blockly.doCommand(function() {
    Blockly.terminateDrag_();
    if (Blockly.selected && Blockly.highlightedConnection_) {
      // Connect two blocks together.
      Blockly.localConnection_.connect(Blockly.highlightedConnection_);
      if (this_.rendered) {
        // Trigger a connection animation.
        // Determine which connection is inferior (lower in the source stack).
        var inferiorConnection;
        if (Blockly.localConnection_.isSuperior()) {
          inferiorConnection = Blockly.highlightedConnection_;
        } else {
          inferiorConnection = Blockly.localConnection_;
        }
        inferiorConnection.sourceBlock_.connectionUiEffect();
      }
      if (this_.workspace.trashcan) {
        // Don't throw an object in the trash can if it just got connected.
        this_.workspace.trashcan.close();
      }
    } else if (this_.workspace.isDeleteArea(e) &&
        Blockly.selected.isDeletable()) {

      // modified
      if(this_.workspace.onBlockTrashed){
        this_.workspace.onBlockTrashed();
      }
      var trashcan = this_.workspace.trashcan;
      if (trashcan) {
        goog.Timer.callOnce(trashcan.close, 100, trashcan);
      }
      // call onBlockMouseUp twice because this_.workspace will be out of existance
      //  if the block is deleted
      if(this_.workspace && this_.workspace.onBlockMouseUp){
          this_.workspace.onBlockMouseUp();
      }
      Blockly.selected.dispose(false, true);
      // Dropping a block on the trash can will usually cause the workspace to
      // resize to contain the newly positioned block.  Force a second resize
      // now that the block has been deleted.
      Blockly.fireUiEvent(window, 'resize');
    }
    if (Blockly.highlightedConnection_) {
      Blockly.highlightedConnection_.unhighlight();
      Blockly.highlightedConnection_ = null;
    }
    Blockly.Css.setCursor(Blockly.Css.Cursor.OPEN);
  });
  if(this_.workspace && this_.workspace.onBlockMouseUp){
      this_.workspace.onBlockMouseUp();
  }
};


/**
 * Show the context menu for this block.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.BlockSvg.prototype.showContextMenu_ = function(e) {
  if (this.workspace.options.readOnly || !this.contextMenu) {
    return;
  }
  // Save the current block in a variable for use in closures.
  var block = this;
  var options = [];

  if (this.isDeletable() && this.isMovable() && !block.isInFlyout) {
    // Option to duplicate this block.
    var duplicateOption = {
      text: Blockly.Msg.DUPLICATE_BLOCK,
      enabled: true,
      callback: function() {
        block.duplicate_();
      }
    };
    if (this.getDescendants().length > this.workspace.remainingCapacity()) {
      duplicateOption.enabled = false;
    }
    options.push(duplicateOption);


    // Option to duplicate this block and the below.
    var duplicateBelowOption = {
      text: Blockly.Msg.DUPLICATE_BELOW_BLOCK,
      enabled: true,
      callback: function() {
        block.duplicateBelow_();
      }
    };
    if (this.getDescendants().length > this.workspace.remainingCapacity()) {
      duplicateOption.enabled = false;
    }
    options.push(duplicateBelowOption);



    if (this.isEditable() && !this.collapsed_ &&
        this.workspace.options.comments) {
      // Option to add/remove a comment.
      var commentOption = {enabled: true};
      if (this.comment) {
        commentOption.text = Blockly.Msg.REMOVE_COMMENT;
        commentOption.callback = function() {
          block.setCommentText(null);
        };
      } else {
        commentOption.text = Blockly.Msg.ADD_COMMENT;
        commentOption.callback = function() {
          block.setCommentText('');
        };
      }
      // options.push(commentOption);
    }

    // Option to make block inline.
    if (!this.collapsed_) {
      for (var i = 1; i < this.inputList.length; i++) {
        if (this.inputList[i - 1].type != Blockly.NEXT_STATEMENT &&
            this.inputList[i].type != Blockly.NEXT_STATEMENT) {
          // Only display this option if there are two value or dummy inputs
          // next to each other.
          var inlineOption = {enabled: true};
          var isInline = this.getInputsInline();
          inlineOption.text = isInline ?
              Blockly.Msg.EXTERNAL_INPUTS : Blockly.Msg.INLINE_INPUTS;
          inlineOption.callback = function() {
            block.setInputsInline(!isInline);
          };
          // options.push(inlineOption);
          break;
        }
      }
    }

    if (this.workspace.options.collapse) {
      // Option to collapse/expand block.
      if (this.collapsed_) {
        var expandOption = {enabled: true};
        expandOption.text = Blockly.Msg.EXPAND_BLOCK;
        expandOption.callback = function() {
          block.setCollapsed(false);
        };
        // options.push(expandOption);
      } else {
        var collapseOption = {enabled: true};
        collapseOption.text = Blockly.Msg.COLLAPSE_BLOCK;
        collapseOption.callback = function() {
          block.setCollapsed(true);
        };
        // options.push(collapseOption);
      }
    }

    if (this.workspace.options.disable) {
      // Option to disable/enable block.
      var disableOption = {
        text: this.disabled ?
            Blockly.Msg.ENABLE_BLOCK : Blockly.Msg.DISABLE_BLOCK,
        enabled: !this.getInheritedDisabled(),
        callback: function() {
          block.setDisabled(!block.disabled);
        }
      };
      // options.push(disableOption);
    }

    // Option to delete this block.
    // Count the number of blocks that are nested in this block.
    var descendantCount = this.getDescendants().length;
    var nextBlock = this.getNextBlock();
    if (nextBlock) {
      // Blocks in the current stack would survive this block's deletion.
      descendantCount -= nextBlock.getDescendants().length;
    }
    var deleteOption = {
      text: descendantCount == 1 ? Blockly.Msg.DELETE_BLOCK :
          Blockly.Msg.DELETE_X_BLOCKS.replace('%1', String(descendantCount)),
      enabled: true,
      callback: function() {
        block.dispose(true, true);
      }
    };
    // options.push(deleteOption);
  }

  // Option to get help.
  var url = goog.isFunction(this.helpUrl) ? this.helpUrl() : this.helpUrl;
  var helpOption = {enabled: !!url};
  helpOption.text = Blockly.Msg.HELP;
  helpOption.callback = function() {
    block.showHelp_();
  };
  // options.push(helpOption);

  // Allow the block to add or modify options.
  if (this.customContextMenu && !block.isInFlyout) {
    this.customContextMenu(options);
  }

  Blockly.ContextMenu.show(e, options, this.RTL);
  Blockly.ContextMenu.currentBlock = this;
};


/**
 * Minimum height of a block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y = 38; //25

/**
 * Height of horizontal puzzle tab.
 * @const
 */
Blockly.BlockSvg.TAB_HEIGHT = 25;  //20

// /**
//  * Minimum height of field rows.
//  * @const
//  */
Blockly.BlockSvg.FIELD_HEIGHT = 25;  //18


// // modified by callblueday - fix value block drop off bug
Blockly.BlockSvg.TAB_PATH_DOWN = 'v 9 c 0,10 -' + Blockly.BlockSvg.TAB_WIDTH +
    ',-8 -' + Blockly.BlockSvg.TAB_WIDTH + ',7.5 s ' +
    Blockly.BlockSvg.TAB_WIDTH + ',-2.5 ' + Blockly.BlockSvg.TAB_WIDTH + ',7.5';

