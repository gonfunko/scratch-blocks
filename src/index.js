/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import '../blocks_common/math.js';
import '../blocks_vertical/vertical_extensions.js';
import '../blocks_vertical/control.js';
import '../blocks_vertical/data.js';
import '../blocks_vertical/event.js';
import '../blocks_vertical/looks.js';
import '../blocks_vertical/motion.js';
import '../blocks_vertical/operators.js';
import '../blocks_vertical/sensing.js';
import '../blocks_vertical/sound.js';
import * as scratchBlocksUtils from '../core/scratch_blocks_utils.js';
import {
  ContinuousToolbox,
  ContinuousFlyout,
  ContinuousMetrics,
} from '@blockly/continuous-toolbox';

export * from 'blockly';
export * from './categories.js';
export * from '../core/colours.js';
export * from '../msg/scratch_msgs.js';
export {scratchBlocksUtils};

export function inject(container, options) {
  Object.assign(options, {
    plugins: {
      toolbox: ContinuousToolbox,
      flyoutsVerticalToolbox: ContinuousFlyout,
      metricsManager: ContinuousMetrics,
    },
  });
  const workspace = Blockly.inject(container, options);
  return workspace;
}