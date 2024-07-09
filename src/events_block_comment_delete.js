/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import {BlockCommentBase} from './events_block_comment_base.js';

class BlockCommentDelete extends BlockCommentBase {
  constructor(opt_blockComment, sourceBlock) {
    super(opt_blockComment);
    this.type = 'block_comment_delete';
    this.blockId = sourceBlock.id;
    this.workspaceId = sourceBlock.workspace.id;
    this.recordUndo = false;
  }
}

Blockly.registry.register(
  Blockly.registry.Type.EVENT,
  'block_comment_delete',
  BlockCommentDelete,
);
