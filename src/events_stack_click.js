import * as Blockly from 'blockly/core';

export class StackClickEvent extends Blockly.Events.UiBase {
  type = 'stackClick';

  constructor(blockId, workspaceId) {
    super(workspaceId);
    this.blockId = blockId;
  }
}
