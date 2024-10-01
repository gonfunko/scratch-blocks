/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly/core";
import { ContinuousCategory } from "@blockly/continuous-toolbox";

export class ScratchContinuousCategory extends ContinuousCategory {
  showStatusButton = false;

  constructor(toolboxItemDef, parentToolbox, opt_parent) {
    super(toolboxItemDef, parentToolbox, opt_parent);
    this.showStatusButton = toolboxItemDef["showStatusButton"] === "true";
  }

  createIconDom_() {
    if (this.toolboxItemDef_.iconURI) {
      const icon = document.createElement("img");
      icon.src = this.toolboxItemDef_.iconURI;
      icon.className = "categoryIconBubble";
      return icon;
    } else {
      const icon = super.createIconDom_();
      icon.style.border = `1px solid ${this.toolboxItemDef_["secondaryColour"]}`;
      return icon;
    }
  }

  setSelected(isSelected) {
    super.setSelected(isSelected);
    // Prevent hardcoding the background color to grey.
    this.rowDiv_.style.backgroundColor = "";
  }

  shouldShowStatusButton() {
    return this.showStatusButton;
  }
}

export function registerScratchContinuousCategory() {
  Blockly.registry.unregister(
    Blockly.registry.Type.TOOLBOX_ITEM,
    ScratchContinuousCategory.registrationName
  );
  Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    ScratchContinuousCategory.registrationName,
    ScratchContinuousCategory
  );
}
