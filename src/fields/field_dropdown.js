/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly/core";

class FieldDropdown extends Blockly.FieldDropdown {
  showEditor_(event) {
    super.showEditor_(event);
    const sourceBlock = this.getSourceBlock();
    if (sourceBlock.isShadow()) {
      sourceBlock.setColour(sourceBlock.style.colourQuaternary);
    }
  }

  dropdownDispose_() {
    super.dropdownDispose_();
    const sourceBlock = this.getSourceBlock();
    if (sourceBlock.isShadow()) {
      sourceBlock.setStyle(`colours_${sourceBlock.type.split("_")[0]}`);
    }
  }
}

Blockly.fieldRegistry.unregister("field_dropdown");
Blockly.fieldRegistry.register("field_dropdown", FieldDropdown);
