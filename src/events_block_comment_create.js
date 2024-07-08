import * as Blockly from 'blockly/core';
import {BlockCommentBase} from './events_block_comment_base.js';

class BlockCommentCreate extends BlockCommentBase {
  constructor(opt_blockComment) {
    super(opt_blockComment);
    this.type = 'block_comment_create';
    const size = opt_blockComment.getSize();
    const location = opt_blockComment.getRelativeToSurfaceXY();
    this.json = {
      x: location.x,
      y: location.y,
      width: size.width,
      height: size.height,
    }
    this.recordUndo = false;
  }

  toJson() {
    return {
      ...super.toJson(),
      json: this.json,
    };
  }

  static fromJson(json, workspace, event) {
    const newEvent = super.fromJson(json, workspace, event);
    newEvent.json = {
      x: json['json']['x'],
      y: json['json']['y'],
      width: json['json']['width'],
      height: json['json']['height'],
    };

    return newEvent;
  }
}

Blockly.registry.register(
  Blockly.registry.Type.EVENT,
  'block_comment_create',
  BlockCommentCreate,
);
