/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly/core";
import { ContinuousFlyout } from "@blockly/continuous-toolbox";
import { CheckboxBubble } from "./checkbox_bubble";
import { StatusIndicatorLabel } from "./status_indicator_label";

export class CheckableContinuousFlyout extends ContinuousFlyout {
  /**
   * Creates a new CheckableContinuousFlyout.
   *
   * @param {!Blockly.Options} workspaceOptions Configuration options for the
   *     flyout workspace.
   */
  constructor(workspaceOptions) {
    workspaceOptions.modalInputs = false;
    super(workspaceOptions);
    this.tabWidth_ = 0;
    this.MARGIN = 12;
    this.GAP_Y = 12;
  }

  /**
   * Serializes a block to JSON in order to copy it to the main workspace.
   *
   * @param {!Blockly.BlockSvg} block The block to serialize.
   * @returns {!Object} A JSON representation of the block.
   */
  serializeBlock(block) {
    const json = super.serializeBlock(block);
    // Delete the serialized block's ID so that a new one is generated when it is
    // placed on the workspace. Otherwise, the block on the workspace may be
    // indistinguishable from the one in the flyout, which can cause reporter blocks
    // to have their value dropdown shown in the wrong place.
    delete json.id;
    return json;
  }

  /**
   * Set the state of a checkbox by block ID.
   * @param {string} blockId ID of the block whose checkbox should be set
   * @param {boolean} value Value to set the checkbox to.
   * @public
   */
  setCheckboxState(blockId, value) {
    this.getWorkspace()
      .getBlockById(blockId)
      ?.getIcon("checkbox")
      ?.setChecked(value);
  }

  getFlyoutScale() {
    return 0.675;
  }

  getWidth() {
    return 250;
  }

  reflowInternal_() {
    super.reflowInternal_();

    if (this.RTL) {
      // The parent implementation assumes that the flyout grows to fit its
      // contents, and adjusts blocks in RTL mode accordingly. In Scratch, the
      // flyout width is fixed (and blocks may exceed it), so re-adjust blocks
      // accordingly based on the actual fixed width.
      for (const item of this.getContents()) {
        const oldX = item.getElement().getBoundingRectangle().left;
        let newX =
          this.getWidth() / this.workspace_.scale -
          item.getElement().getBoundingRectangle().getWidth() -
          this.MARGIN;
        if (
          "checkboxInFlyout" in item.getElement() &&
          item.getElement().checkboxInFlyout
        ) {
          newX -= CheckboxBubble.CHECKBOX_SIZE + CheckboxBubble.CHECKBOX_MARGIN;
        }
        item.getElement().moveBy(newX - oldX, 0);
      }
    }
  }

  /**
   * Updates the state of status indicators for hardware-based extensions.
   */
  refreshStatusButtons() {
    for (const item of this.contents) {
      if (item.element instanceof StatusIndicatorLabel) {
        item.element.refreshStatus();
      }
    }
  }
}
