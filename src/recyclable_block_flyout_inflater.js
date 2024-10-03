/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly/core";

/**
 * A block inflater that caches and reuses blocks to improve performance.
 */
export class RecyclableBlockFlyoutInflater extends Blockly.BlockFlyoutInflater {
  recyclingEnabled = true;
  recycledBlocks = new Map();

  /**
   * Toggles whether or not recycling is enabled.
   *
   * @param {boolean} enabled True if recycling should be enabled.
   */
  setRecyclingEnabled(enabled) {
    this.recyclingEnabled = enabled;
  }

  /**
   * Creates a new block from the given block definition.
   *
   * @param {Object} blockDefinition The definition to create a block from.
   * @returns {!Blockly.BlockSvg} The newly created block.
   */
  createBlock(blockDefinition) {
    const blockType = this.getTypeFromDefinition(blockDefinition);
    return (
      this.getRecycledBlock(blockType) ??
      super.createBlock(blockDefinition, this.flyoutWorkspace)
    );
  }

  /**
   * Returns the type of a block from an XML or JSON block definition.
   *
   * @param blockDefinition {Object} The block definition to parse.
   * @returns {string} The block type.
   */
  getTypeFromDefinition(blockDefinition) {
    if (blockDefinition["blockxml"]) {
      const xml =
        typeof blockDefinition["blockxml"] === "string"
          ? Blockly.utils.xml.textToDom(blockDefinition["blockxml"])
          : blockDefinition["blockxml"];
      return xml.getAttribute("type");
    } else {
      return blockDefinition["type"];
    }
  }

  /**
   * Puts a previously created block into the recycle bin and moves it to the
   * top of the workspace. Used during large workspace swaps to limit the number
   * of new DOM elements we need to create.
   *
   * @param block The block to recycle.
   */
  recycleBlock(block) {
    const xy = block.getRelativeToSurfaceXY();
    block.moveBy(-xy.x, -xy.y);
    this.recycledBlocks.set(block.type, block);
  }

  /**
   * Returns a block from the cache of recycled blocks with the given type, or
   * undefined if one cannot be found.
   *
   * @param blockType The type of the block to try to recycle.
   * @returns The recycled block, or undefined if
   *     one could not be recycled.
   */
  getRecycledBlock(blockType) {
    const block = this.recycledBlocks.get(blockType);
    this.recycledBlocks.delete(blockType);
    return block;
  }

  /**
   * Returns whether the given block can be recycled or not.
   *
   * @param block The block to check for recyclability.
   * @returns True if the block can be recycled. False otherwise.
   */
  blockIsRecyclable(block) {
    if (!this.recyclingEnabled) {
      return false;
    }

    // If the block needs to parse mutations, never recycle.
    if (block.mutationToDom && block.domToMutation) {
      return false;
    }

    if (!block.isEnabled()) {
      return false;
    }

    for (const input of block.inputList) {
      for (const field of input.fieldRow) {
        // No variables.
        if (field.referencesVariables()) {
          return false;
        }
        if (field instanceof Blockly.FieldDropdown) {
          if (field.isOptionListDynamic()) {
            return false;
          }
        }
      }
      // Check children.
      if (input.connection) {
        const targetBlock =
          /** @type {Blockly.BlockSvg} */
          (input.connection.targetBlock());
        if (targetBlock && !this.blockIsRecyclable(targetBlock)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Disposes of the provided block.
   *
   * @param {!Blockly.BlockSvg} element The block to dispose of.
   */
  disposeElement(element) {
    if (this.blockIsRecyclable(element)) {
      this.removeListeners(element.id);
      this.recycleBlock(element);
    } else {
      super.disposeElement(element);
    }
  }

  /**
   * Clears the cache of recycled blocks.
   */
  emptyRecycledBlocks() {
    this.recycledBlocks
      .values()
      .forEach((block) => block.dispose(false, false));
    this.recycledBlocks.clear();
  }
}

/**
 * Registers the recyclable block flyout inflater.
 */
export function registerRecyclableBlockFlyoutInflater() {
  Blockly.registry.unregister(Blockly.registry.Type.FLYOUT_INFLATER, "block");
  Blockly.registry.register(
    Blockly.registry.Type.FLYOUT_INFLATER,
    "block",
    RecyclableBlockFlyoutInflater
  );
}
