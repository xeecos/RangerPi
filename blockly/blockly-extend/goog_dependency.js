/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2013 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview create dependency for mblockly.
 */
'use strict';

goog.provide('Blockly.Dependency');

goog.require('goog.ui.Dialog')
goog.require('goog.ui.Slider');

Blockly.Dependency = function(text) {
  var dialog = new goog.ui.Dialog();
  var slider = new goog.ui.Slider();
};