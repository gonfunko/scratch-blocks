import * as Blockly from 'blockly/core';
import {BlockCommentBase} from './events_block_comment_base.js';

class BlockCommentChange extends BlockCommentBase {
  constructor(opt_blockComment, oldContents, newContents) {
    super(opt_blockComment);
    this.type = 'block_comment_change';
    this.oldContents_ = oldContents;
    this.newContents_ = newContents;
    this.recordUndo = false;
  }

  toJson() {
    return {
      ...super.toJson(),
      newContents: this.newContents_,
      oldContents: this.oldContents_,
    };
  }

  static fromJson(json, workspace, event) {
    const newEvent = super.fromJson(json, workspace, event);
    newEvent.newContents_ = json['newContents'];
    newEvent.oldContents_ = json['oldContents'];

    return newEvent;
  }
}

Blockly.registry.register(
  Blockly.registry.Type.EVENT,
  'block_comment_change',
  BlockCommentChange,
);
