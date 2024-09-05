/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly/core";
import { cssVarify } from "../colours.js";

export class ConstantProvider extends Blockly.zelos.ConstantProvider {
  REPLACEMENT_GLOW_COLOUR = "#ffffff";

  setTheme(theme) {
    const root = document.querySelector(":root");
    for (const [key, colour] of Object.entries(theme.blockStyles)) {
      if (typeof colour === "string") {
        const varKey = `--colour-${key}`;
        root.style.setProperty(varKey, colour);
      } else {
        theme.setBlockStyle(`${key}_selected`, {
          colourPrimary: colour.colourQuaternary ?? colour.colourTertiary,
          colourSecondary: colour.colourQuaternary ?? colour.colourTertiary,
          colourTertiary: colour.colourQuaternary ?? colour.colourTertiary,
          colourQuaternary: colour.colourQuaternary ?? colour.colourTertiary,
        });
      }
    }
    super.setTheme(theme);
  }

  createDom(svg, tagName, selector) {
    super.createDom(svg, tagName, selector);
    this.selectedGlowFilterId = "";
  }
}
