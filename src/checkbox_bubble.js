/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly/core";

/**
 * A checkbox shown next to reporter blocks in the flyout.
 * @implements {IBubble}
 * @implements {IRenderedElement}
 */
export class CheckboxBubble {
  /**
   * Size of a checkbox next to a variable reporter.
   * @type {number}
   * @const
   */
  static CHECKBOX_SIZE = 25;

  /**
   * Amount of touchable padding around reporter checkboxes.
   * @type {number}
   * @const
   */
  static CHECKBOX_TOUCH_PADDING = 12;

  /**
   * SVG path data for checkmark in checkbox.
   * @type {string}
   * @const
   */
  static CHECKMARK_PATH =
    "M" +
    CheckboxBubble.CHECKBOX_SIZE / 4 +
    " " +
    CheckboxBubble.CHECKBOX_SIZE / 2 +
    "L" +
    (5 * CheckboxBubble.CHECKBOX_SIZE) / 12 +
    " " +
    (2 * CheckboxBubble.CHECKBOX_SIZE) / 3 +
    "L" +
    (3 * CheckboxBubble.CHECKBOX_SIZE) / 4 +
    " " +
    CheckboxBubble.CHECKBOX_SIZE / 3;

  /**
   * Size of the checkbox corner radius
   * @type {number}
   * @const
   */
  static CHECKBOX_CORNER_RADIUS = 5;

  /**
   * @type {number}
   * @const
   */
  static CHECKBOX_MARGIN = 12;

  /**
   * Total additional width of a row that contains a checkbox.
   * @type {number}
   * @const
   */
  static CHECKBOX_SPACE_X =
    CheckboxBubble.CHECKBOX_SIZE + 2 * CheckboxBubble.CHECKBOX_MARGIN;

  svgRoot;
  clickListener;
  checked = false;
  location = new Blockly.utils.Coordinate(0, 0);

  constructor(sourceBlock) {
    this.sourceBlock = sourceBlock;
    this.svgRoot = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.G,
      {},
      this.sourceBlock.workspace.getBubbleCanvas()
    );

    const touchMargin = CheckboxBubble.CHECKBOX_TOUCH_PADDING;
    const checkboxGroup = Blockly.utils.dom.createSvgElement(
      "g",
      {
        fill: "transparent",
      },
      null
    );
    Blockly.utils.dom.createSvgElement(
      "rect",
      {
        class: "blocklyFlyoutCheckbox",
        height: CheckboxBubble.CHECKBOX_SIZE,
        width: CheckboxBubble.CHECKBOX_SIZE,
        rx: CheckboxBubble.CHECKBOX_CORNER_RADIUS,
        ry: CheckboxBubble.CHECKBOX_CORNER_RADIUS,
      },
      checkboxGroup
    );
    Blockly.utils.dom.createSvgElement(
      "path",
      {
        class: "blocklyFlyoutCheckboxPath",
        d: CheckboxBubble.CHECKMARK_PATH,
      },
      checkboxGroup
    );
    Blockly.utils.dom.createSvgElement(
      "rect",
      {
        class: "blocklyTouchTargetBackground",
        x: -touchMargin + "px",
        y: -touchMargin + "px",
        height: CheckboxBubble.CHECKBOX_SIZE + 2 * touchMargin,
        width: CheckboxBubble.CHECKBOX_SIZE + 2 * touchMargin,
      },
      checkboxGroup
    );
    this.setChecked(this.isChecked(this.sourceBlock.id));

    this.svgRoot.prepend(checkboxGroup);

    this.clickListener = Blockly.browserEvents.bind(
      this.svgRoot,
      "mousedown",
      null,
      (event) => {
        this.setChecked(!this.checked);
        event.stopPropagation();
        event.preventDefault();
      }
    );
    this.updateLocation();
  }

  setChecked(checked) {
    this.checked = checked;
    if (this.checked) {
      Blockly.utils.dom.addClass(this.svgRoot, "checked");
    } else {
      Blockly.utils.dom.removeClass(this.svgRoot, "checked");
    }

    Blockly.Events.fire(
      new Blockly.Events.BlockChange(
        this.sourceBlock,
        "checkbox",
        null,
        !this.checked,
        this.checked
      )
    );
  }

  // Patched by scratch-gui to query the VM state.
  isChecked(blockId) {
    return false;
  }

  isMovable() {
    return false;
  }

  getSvgRoot() {
    return this.svgRoot;
  }

  updateLocation() {
    const blockLocation = this.sourceBlock.getRelativeToSurfaceXY();
    const blockBounds = this.sourceBlock.getHeightWidth();
    const x = this.sourceBlock.workspace.RTL
      ? blockLocation.x + blockBounds.width + CheckboxBubble.CHECKBOX_MARGIN
      : blockLocation.x -
        CheckboxBubble.CHECKBOX_MARGIN -
        CheckboxBubble.CHECKBOX_SIZE;
    const y =
      blockLocation.y + (blockBounds.height - CheckboxBubble.CHECKBOX_SIZE) / 2;
    this.moveTo(x, y);
  }

  moveTo(x, y) {
    this.location.x = x;
    this.location.y = y;
    this.svgRoot.setAttribute("transform", `translate(${x}, ${y})`);
  }

  getRelativeToSurfaceXY() {
    return this.location;
  }

  dispose() {
    Blockly.utils.dom.removeNode(this.svgRoot);
    Blockly.browserEvents.unbind(this.clickListener);
  }

  // These methods are required by the interfaces, but intentionally have no
  // implementation, largely because this bubble's location is fixed relative
  // to its block and is not draggable by the user.
  showContextMenu() {}

  setDragging(dragging) {}

  startDrag(event) {}

  drag(newLocation, event) {}

  moveDuringDrag(newLocation) {}

  endDrag() {}

  revertDrag() {}

  setDeleteStyle(enable) {}
}
