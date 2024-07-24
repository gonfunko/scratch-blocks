import * as Blockly from "blockly/core";

class ScratchVariableCreate extends Blockly.Events.VarCreate {
  constructor(variable) {
    super(variable);
    this.isLocal = variable.isLocal;
    this.isCloud = variable.isCloud;
  }
}

Blockly.registry.register(
  Blockly.registry.Type.EVENT,
  Blockly.Events.VAR_CREATE,
  ScratchVariableCreate,
  true
);
