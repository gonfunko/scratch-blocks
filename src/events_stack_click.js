import * as Blockly from 'blockly';

export class StackClickEvent extends Blockly.Events.UiBase {
  type = 'stackClick';

  constructor(blockId, workspaceId) {
    super(workspaceId);
    this.blockId = blockId;
  }
}
