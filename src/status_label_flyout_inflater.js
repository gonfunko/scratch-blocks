/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly/core";
import { FlyoutExtensionCategoryHeader } from "./flyout_extension_category_header.js";

class StatusLabelFlyoutInflater extends Blockly.LabelFlyoutInflater {
  load(state, flyoutWorkspace) {
    const label = new FlyoutExtensionCategoryHeader(
      flyoutWorkspace,
      flyoutWorkspace.targetWorkspace,
      state,
      true
    );
    label.show();
    return label;
  }
}

export function registerStatusLabelFlyoutInflater() {
  Blockly.registry.register(
    Blockly.registry.Type.FLYOUT_INFLATER,
    "status_label",
    StatusLabelFlyoutInflater
  );
}
