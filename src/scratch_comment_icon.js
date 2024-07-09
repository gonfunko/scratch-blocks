/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import {ScratchCommentBubble} from './scratch_comment_bubble.js';

class ScratchCommentIcon extends Blockly.icons.Icon {
  constructor(sourceBlock) {
    super(sourceBlock);
    this.sourceBlock = sourceBlock;
    this.commentBubble = new ScratchCommentBubble(this.sourceBlock, this.getAnchorPoint());
    Blockly.Events.setGroup(true);
    Blockly.Events.fire(
      new (Blockly.Events.get('block_comment_create'))(
        this.commentBubble
      ),
    );
    this.onTextChangedListener = this.onTextChanged.bind(this);
    this.onSizeChangedListener = this.onSizeChanged.bind(this);
    this.onCollapseListener = this.onCollapsed.bind(this);
    this.commentBubble.addTextChangeListener(this.onTextChangedListener);
    this.commentBubble.addSizeChangeListener(this.onSizeChangedListener);
    this.commentBubble.addOnCollapseListener(this.onCollapseListener);
    this.repositionAfterRender = true;

    // We need to force a render of our parent block and wait for it to complete, because at this
    // point, we don't know our own position (needed to calculate the anchor point and position
    // the comment bubble properly relative to the block) and our parent block doesn't know if it's
    // an insertion marker or not (needed to suppress showing the comment bubble attached to an
    // insertion marker block).
    this.sourceBlock.queueRender();
    Blockly.renderManagement.finishQueuedRenders().then(() => {
      if (!this.sourceBlock || !this.commentBubble) return;

      if (this.sourceBlock.isInsertionMarker()) {
        this.commentBubble.dispose();
        return;
      }

      // loadFromState may have already positioned the bubble appropriately when e.g. populating a
      // comment from the undo stack. Only position the bubble at the default location if
      // loadFromState hasn't prohibited repositioning post-render.
      if (this.repositionAfterRender) {
        const anchor = this.getAnchorPoint();
        this.commentBubble.moveTo(anchor.x + 40, anchor.y - 16);
      }
      Blockly.Events.setGroup(false);
    });
  }

  getType() {
    return Blockly.icons.IconType.COMMENT;
  }

  initView(pointerDownListener) {
    // Scratch comments have no indicator icon on the block.
    return;
  }

  getSize() {
    // Awful hack to cancel out the default padding added to icons.
    return new Blockly.utils.Size(-8, 0);
  }

  getAnchorPoint() {
    const sourceBlockOrigin = this.sourceBlock.getRelativeToSurfaceXY();
    let left;
    let right;
    if (this.sourceBlock.RTL) {
      left = sourceBlockOrigin.x - this.sourceBlock.width;
      right = sourceBlockOrigin.x;
    } else {
      left = sourceBlockOrigin.x;
      right = sourceBlockOrigin.x + this.sourceBlock.width;
    }
    const blockRect = new Blockly.utils.Rect(
        sourceBlockOrigin.y, sourceBlockOrigin.y + this.sourceBlock.height, left, right);
    const y = blockRect.top + this.offsetInBlock.y;
    const x = this.sourceBlock.workspace.RTL ? blockRect.left : blockRect.right;
    return new Blockly.utils.Coordinate(x, y);
  }

  onLocationChange(blockOrigin) {
    const initialLocation = this.workspaceLocation;
    super.onLocationChange(blockOrigin);
    const newLocation = this.workspaceLocation;

    if (this.commentBubble) {
      const oldBubbleLocation = this.commentBubble.getRelativeToSurfaceXY();
      const delta = Blockly.utils.Coordinate.difference(newLocation, initialLocation);
      const newBubbleLocation = Blockly.utils.Coordinate.sum(oldBubbleLocation, delta);
      this.commentBubble.moveTo(newBubbleLocation);
      this.commentBubble.setAnchorLocation(this.getAnchorPoint());
      Blockly.Events.fire(
        new (Blockly.Events.get('block_comment_move'))(
          this.commentBubble,
          oldBubbleLocation,
          newBubbleLocation,
        ),
      );
    }
  }

  setText(text) {
    this.commentBubble?.setText(text);
  }

  getText() {
    return this.commentBubble?.getText() ?? '';
  }

  onTextChanged(oldText, newText) {
    Blockly.Events.fire(
      new (Blockly.Events.get(Blockly.Events.BLOCK_CHANGE))(
        this.sourceBlock,
        'comment',
        null,
        oldText,
        newText,
      ),
    );
    Blockly.Events.fire(
      new (Blockly.Events.get('block_comment_change'))(
        this.commentBubble,
        oldText,
        newText,
      ),
    );
  }

  onCollapsed(collapsed) {
    Blockly.Events.fire(
      new (Blockly.Events.get('block_comment_collapse'))(
        this.commentBubble,
        collapsed,
      ),
    );
  }

  onSizeChanged(oldSize, newSize) {
    Blockly.Events.fire(
      new (Blockly.Events.get('block_comment_resize'))(
        this.commentBubble,
        oldSize,
        newSize,
      ),
    );
  }

  setBubbleSize(size) {
    this.commentBubble?.setSize(size);
  }

  getBubbleSize() {
    return this.commentBubble?.getSize() ?? new Blockly.utils.Size(0, 0);
  }

  setBubbleLocation(newLocation) {
    const oldLocation = this.getBubbleLocation();
    this.commentBubble?.moveTo(newLocation);
    Blockly.Events.fire(
      new (Blockly.Events.get('block_comment_move'))(
        this.commentBubble,
        oldLocation,
        newLocation,
      ),
    );
  }

  getBubbleLocation() {
    return this.commentBubble?.getRelativeToSurfaceXY();
  }

  saveState() {
    if (this.commentBubble) {
      const size = this.getBubbleSize();
      const bubbleLocation = this.commentBubble.getRelativeToSurfaceXY();
      const delta = Blockly.utils.Coordinate.difference(bubbleLocation, this.workspaceLocation);
      return {
        'text': this.getText(),
        'height': size.height,
        'width': size.width,
        'x': delta.x,
        'y': delta.y,
        'collapsed': this.commentBubble.isCollapsed(),
      }
    }
    return null;
  }

  loadState(state) {
    this.setText(state['text']);
    this.setBubbleSize(new Blockly.utils.Size(state['width'], state['height']));
    const delta = new Blockly.utils.Coordinate(state['x'], state['y']);
    const newBubbleLocation = Blockly.utils.Coordinate.sum(this.workspaceLocation, delta);
    this.commentBubble.moveTo(newBubbleLocation);
    this.commentBubble.setCollapsed(state['collapsed']);
    this.repositionAfterRender = false;
  }

  bubbleIsVisible() {
    return true;
  }

  async setBubbleVisible(visible) {
    this.commentBubble.setCollapsed(!visible);
  }

  dispose() {
    this.commentBubble?.removeTextChangeListener(this.onTextChangedListener);
    this.commentBubble?.removeSizeChangeListener(this.onSizeChangedListener);
    this.commentBubble?.removeOnCollapseListener(this.onCollapseListener);
    this.commentBubble?.dispose();
    this.commentBubble = null;
    this.sourceBlock = null;
    super.dispose();
  }
}

Blockly.registry.register(
    Blockly.registry.Type.ICON,
    Blockly.icons.IconType.COMMENT.toString(),
    ScratchCommentIcon,
    true);
