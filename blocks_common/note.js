/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
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
 * @fileoverview Note block.
 * @author ericr@media.mit.edu (Eric Rosenbaum)
 */
import * as Blockly from "blockly/core";
import { Colours } from "../src/colours.js";
import * as Constants from "../src/constants.js";

Blockly.Blocks["note"] = {
  /**
   * Block for musical note value.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_note",
          name: "NOTE",
          value: 60,
        },
      ],
      outputShape: Constants.OUTPUT_SHAPE_ROUND,
      output: "Number",
      colour: Colours.textField,
      colourSecondary: Colours.textField,
      colourTertiary: Colours.textField,
      colourQuaternary: Colours.textField,
    });
  },
};
