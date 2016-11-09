Blockly.Xml.blockToDom_ = function(block) {
  var element = goog.dom.createDom('block');

  // modified
  for(var i in block.extra_attributes){
    element.setAttribute(i, block.extra_attributes[i]);
  }
  if (block.mutationToDom) {
    // Custom data for an advanced block.
    var mutation = block.mutationToDom();
    if (mutation) {
      element.appendChild(mutation);
    }
  }
  function fieldToDom(field) {
    if (field.name && field.EDITABLE) {
      var container = goog.dom.createDom('field', null, field.getValue());
      container.setAttribute('name', field.name);
      element.appendChild(container);
    }
  }
  for (var i = 0, input; input = block.inputList[i]; i++) {
    for (var j = 0, field; field = input.fieldRow[j]; j++) {
      fieldToDom(field);
    }
  }

  var commentText = block.getCommentText();
  if (commentText) {
    var commentElement = goog.dom.createDom('comment', null, commentText);
    if (typeof block.comment == 'object') {
      commentElement.setAttribute('pinned', block.comment.isVisible());
      var hw = block.comment.getBubbleSize();
      commentElement.setAttribute('h', hw.height);
      commentElement.setAttribute('w', hw.width);
    }
    element.appendChild(commentElement);
  }

  if (block.data) {
    // Optional text data that round-trips beween blocks and XML.
    // Has no effect.  May be used by 3rd parties for meta information.
    var dataElement = goog.dom.createDom('data', null, block.data);
    element.appendChild(dataElement);
  }

  for (var i = 0, input; input = block.inputList[i]; i++) {
    var container;
    var empty = true;
    if (input.type == Blockly.DUMMY_INPUT) {
      continue;
    } else {
      var childBlock = input.connection.targetBlock();
      if (input.type == Blockly.INPUT_VALUE) {
        container = goog.dom.createDom('value');
      } else if (input.type == Blockly.NEXT_STATEMENT) {
        container = goog.dom.createDom('statement');
      }
      if (childBlock) {
        container.appendChild(Blockly.Xml.blockToDom_(childBlock));
        empty = false;
      }
    }
    container.setAttribute('name', input.name);
    if (!empty) {
      element.appendChild(container);
    }
  }
  if (block.inputsInlineDefault != block.inputsInline) {
    element.setAttribute('inline', block.inputsInline);
  }
  if (block.isCollapsed()) {
    element.setAttribute('collapsed', true);
  }
  if (block.disabled) {
    element.setAttribute('disabled', true);
  }
  if (!block.isDeletable()) {
    element.setAttribute('deletable', false);
  }
  if (!block.isMovable()) {
    element.setAttribute('movable', false);
  }
  if (!block.isEditable()) {
    element.setAttribute('editable', false);
  }

  var nextBlock = block.getNextBlock();
  if (nextBlock) {
    var container = goog.dom.createDom('next', null,
        Blockly.Xml.blockToDom_(nextBlock));
    element.appendChild(container);
  }

  return element;
};


Blockly.Xml.domToBlockHeadless_ = function(workspace, xmlBlock, opt_reuseBlock) {
  var block = null;
  var prototypeName = xmlBlock.getAttribute('type');
  if (!prototypeName) {
    throw 'Block type unspecified: \n' + xmlBlock.outerHTML;
  }
  var id = xmlBlock.getAttribute('id');
  if (opt_reuseBlock && id) {
    block = Blockly.Block.getById(id, workspace);

    // TODO: The following is for debugging.  It should never actually happen.
    if (!block) {
      throw 'Couldn\'t get Block with id: ' + id;
    }
    var parentBlock = block.getParent();
    // If we've already filled this block then we will dispose of it and then
    // re-fill it.
    if (block.workspace) {
      block.dispose(true, false, true);
    }
    block.fill(workspace, prototypeName);
    block.parent_ = parentBlock;
  } else {
    // attach all addtional attributes to block
    var extra_attributes = {};
    for(var i=0;i<xmlBlock.attributes.length;i++){
      var attr = xmlBlock.attributes[i];
      extra_attributes[attr.name] = attr.value;
    }
    block = Blockly.Block.obtain(workspace, prototypeName, extra_attributes);
  }

  var blockChild = null;
  for (var i = 0, xmlChild; xmlChild = xmlBlock.childNodes[i]; i++) {
    if (xmlChild.nodeType == 3 && xmlChild.data.match(/^\s*$/)) {
      // Extra whitespace between tags does not concern us.
      continue;
    }
    var input;

    // Find the first 'real' grandchild node (that isn't whitespace).
    var firstRealGrandchild = null;
    for (var j = 0, grandchildNode; grandchildNode = xmlChild.childNodes[j];
         j++) {
      if (grandchildNode.nodeType != 3 || !grandchildNode.data.match(/^\s*$/)) {
        firstRealGrandchild = grandchildNode;
      }
    }

    var name = xmlChild.getAttribute('name');
    switch (xmlChild.nodeName.toLowerCase()) {
      case 'mutation':
        // Custom data for an advanced block.
        if (block.domToMutation) {
          block.domToMutation(xmlChild);
          if (block.initSvg) {
            // Mutation may have added some elements that need initalizing.
            block.initSvg();
          }
        }
        break;
      case 'comment':
        block.setCommentText(xmlChild.textContent);
        var visible = xmlChild.getAttribute('pinned');
        if (visible) {
          // Give the renderer a millisecond to render and position the block
          // before positioning the comment bubble.
          setTimeout(function() {
            if (block.comment && block.comment.setVisible) {
              block.comment.setVisible(visible == 'true');
            }
          }, 1);
        }
        var bubbleW = parseInt(xmlChild.getAttribute('w'), 10);
        var bubbleH = parseInt(xmlChild.getAttribute('h'), 10);
        if (!isNaN(bubbleW) && !isNaN(bubbleH) &&
            block.comment && block.comment.setVisible) {
          block.comment.setBubbleSize(bubbleW, bubbleH);
        }
        break;
      case 'data':
        // Optional text data that round-trips beween blocks and XML.
        // Has no effect.  May be used by 3rd parties for meta information.
        block.data = xmlChild.textContent;
        break;
      case 'title':
        // Titles were renamed to field in December 2013.
        // Fall through.
      case 'field':
        block.setFieldValue(xmlChild.textContent, name);
        break;
      case 'value':
      case 'statement':
        input = block.getInput(name);
        if (!input) {
          throw 'Input ' + name + ' does not exist in block ' + prototypeName;
        }
        if (firstRealGrandchild &&
            firstRealGrandchild.nodeName.toLowerCase() == 'block') {
          blockChild = Blockly.Xml.domToBlockHeadless_(workspace,
              firstRealGrandchild, opt_reuseBlock);
          if (blockChild.outputConnection) {
            input.connection.connect(blockChild.outputConnection);
          } else if (blockChild.previousConnection) {
            input.connection.connect(blockChild.previousConnection);
          } else {
            throw 'Child block does not have output or previous statement.';
          }
        }
        break;
      case 'next':
        if (firstRealGrandchild &&
            firstRealGrandchild.nodeName.toLowerCase() == 'block') {
          if (!block.nextConnection) {
            throw 'Next statement does not exist.';
          } else if (block.nextConnection.targetConnection) {
            // This could happen if there is more than one XML 'next' tag.
            throw 'Next statement is already connected.';
          }
          blockChild = Blockly.Xml.domToBlockHeadless_(workspace,
              firstRealGrandchild, opt_reuseBlock);
          if (!blockChild.previousConnection) {
            throw 'Next block does not have previous statement.';
          }
          block.nextConnection.connect(blockChild.previousConnection);
        }
        break;
      default:
        // Unknown tag; ignore.  Same principle as HTML parsers.
        console.log('Ignoring unknown tag: ' + xmlChild.nodeName);
    }
  }

  var inline = xmlBlock.getAttribute('inline');
  if (inline) {
    block.setInputsInline(inline == 'true');
  }
  var disabled = xmlBlock.getAttribute('disabled');
  if (disabled) {
    block.setDisabled(disabled == 'true');
  }
  var deletable = xmlBlock.getAttribute('deletable');
  if (deletable) {
    block.setDeletable(deletable == 'true');
  }
  var movable = xmlBlock.getAttribute('movable');
  if (movable) {
    block.setMovable(movable == 'true');
  }
  var editable = xmlBlock.getAttribute('editable');
  if (editable) {
    block.setEditable(editable == 'true');
  }
  var collapsed = xmlBlock.getAttribute('collapsed');
  if (collapsed) {
    block.setCollapsed(collapsed == 'true');
  }
  return block;
};