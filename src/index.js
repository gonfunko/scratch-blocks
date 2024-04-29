/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import '../blocks_common/colour.js';
import '../blocks_common/math.js';
import '../blocks_common/note.js';
import '../blocks_common/text.js';
import '../blocks_vertical/vertical_extensions.js';
import '../blocks_vertical/control.js';
import '../blocks_vertical/data.js';
import '../blocks_vertical/event.js';
import '../blocks_vertical/looks.js';
import '../blocks_vertical/motion.js';
import '../blocks_vertical/operators.js';
import '../blocks_vertical/procedures.js';
import '../blocks_vertical/sensing.js';
import '../blocks_vertical/sound.js';
import * as scratchBlocksUtils from '../core/scratch_blocks_utils.js';
import '../core/css.js';
import '../core/field_vertical_separator.js';
import {
  ContinuousToolbox,
  ContinuousFlyout,
  ContinuousMetrics,
} from '@blockly/continuous-toolbox';
import {CheckableContinuousFlyout} from './checkable_continuous_flyout.js';
import './scratch_continuous_category.js';

export * from 'blockly';
export * from './categories.js';
export * from './procedures.js';
export * from '../core/colours.js';
export * from '../core/field_colour_slider.js';
export * from '../core/field_note.js';
export * from '../msg/scratch_msgs.js';
export {scratchBlocksUtils};
export {CheckableContinuousFlyout};

export function inject(container, options) {
  Object.assign(options, {
    plugins: {
      toolbox: ContinuousToolbox,
      flyoutsVerticalToolbox: CheckableContinuousFlyout,
      metricsManager: ContinuousMetrics,
    },
  });
  const workspace = Blockly.inject(container, options);
  return workspace;
}

Blockly.Scrollbar.scrollbarThickness = Blockly.Touch.TOUCH_ENABLED ? 14 : 11;
Blockly.FlyoutButton.TEXT_MARGIN_X = 40;
Blockly.FlyoutButton.TEXT_MARGIN_Y = 10;
Blockly.ContextMenuRegistry.registry.unregister('blockDisable');
Blockly.ContextMenuRegistry.registry.unregister('blockInline');
