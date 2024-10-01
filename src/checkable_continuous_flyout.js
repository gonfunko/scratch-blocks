/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly/core";
import { ContinuousFlyout } from "@blockly/continuous-toolbox";
import { RecyclableBlockFlyoutInflater } from "./recyclable_block_flyout_inflater.js";

export class CheckableContinuousFlyout extends ContinuousFlyout {
  constructor(workspaceOptions) {
    workspaceOptions.modalInputs = false;
    super(workspaceOptions);
    this.tabWidth_ = -2;
    this.MARGIN = 12;
    this.GAP_Y = 12;
  }

  show(flyoutDef) {
    super.show(flyoutDef);
    const inflater = this.getInflaterForType("block");
    if (inflater instanceof RecyclableBlockFlyoutInflater) {
      inflater.emptyRecycledBlocks();
    }
  }

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

  setRecyclingEnabled(enabled) {
    const inflater = this.getInflaterForType("block");
    if (inflater instanceof RecyclableBlockFlyoutInflater) {
      inflater.setRecyclingEnabled(enabled);
    }
  }

  /**
   * Records scroll position for each category in the toolbox.
   * The scroll position is determined by the coordinates of each category's
   * label after the entire flyout has been rendered.
   * @package
   */
  recordScrollPositions() {
    this.scrollPositions = [];
    const categoryLabels = this.getContents()
      .filter(
        (item) =>
          (item.type === "label" || item.type === "status_label") &&
          item.element.isLabel() &&
          this.getParentToolbox_().getCategoryByName(
            item.element.getButtonText()
          )
      )
      .map((item) => item.element);
    for (const [index, button] of categoryLabels.entries()) {
      const position = button.getPosition();
      const adjustedPosition = new Blockly.utils.Coordinate(
        position.x,
        position.y
      );
      this.scrollPositions.push({
        name: button.getButtonText(),
        position: adjustedPosition,
      });
    }
  }

  layout_(contents) {
    Blockly.VerticalFlyout.prototype.layout_.call(this, contents);
  }
}
