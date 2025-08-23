/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as Blockly from "blockly/core";

const Colours = {
  /* PBEGIN RG ADDITIONS */
  "motion": {
    "primary": "#4C97FF",
    "secondary": "#4280D7",
    "tertiary": "#3373CC",
    "quaternary": "#3373CC"
  },
  "looks": {
    "primary": "#9966FF",
    "secondary": "#855CD6",
    "tertiary": "#774DCB",
    "quaternary": "#774DCB"
  },
  "sounds": {
    "primary": "#CF63CF",
    "secondary": "#C94FC9",
    "tertiary": "#BD42BD",
    "quaternary": "#BD42BD"
  },
  "control": {
    "primary": "#FFAB19",
    "secondary": "#EC9C13",
    "tertiary": "#CF8B17",
    "quaternary": "#CF8B17"
  },
  "event": {
    "primary": "#FFBF00",
    "secondary": "#E6AC00",
    "tertiary": "#CC9900",
    "quaternary": "#CC9900"
  },
  "sensing": {
    "primary": "#5CB1D6",
    "secondary": "#47A8D1",
    "tertiary": "#2E8EB8",
    "quaternary": "#2E8EB8"
  },
  "pen": {
    "primary": "#0fBD8C",
    "secondary": "#0DA57A",
    "tertiary": "#0B8E69",
    "quaternary": "#0B8E69"
  },
  "operators": {
    "primary": "#59C059",
    "secondary": "#46B946",
    "tertiary": "#389438",
    "quaternary": "#389438"
  },
  "data": {
    "primary": "#FF8C1A",
    "secondary": "#FF8000",
    "tertiary": "#DB6E00",
    "quaternary": "#DB6E00"
  },
  /** END PRG ADDITION */
  // SVG colours: these must be specified in #RRGGBB style
  // To add an opacity, this must be specified as a separate property (for SVG fill-opacity)
  text: "#FFFFFF",
  workspace: "#F9F9F9",
  toolboxHover: "#4C97FF",
  toolboxSelected: "#e9eef2",
  toolboxText: "#575E75",
  toolbox: "#FFFFFF",
  flyout: "#F9F9F9",
  scrollbar: "#CECDCE",
  scrollbarHover: "#CECDCE",
  textField: "#FFFFFF",
  textFieldText: "#575E75",
  insertionMarker: "#000000",
  insertionMarkerOpacity: 0.2,
  dragShadowOpacity: 0.6,
  stackGlow: "#FFF200",
  stackGlowSize: 4,
  stackGlowOpacity: 1,
  replacementGlow: "#FFFFFF",
  replacementGlowSize: 2,
  replacementGlowOpacity: 1,
  colourPickerStroke: "#FFFFFF",
  // CSS colours: support RGBA
  fieldShadow: "rgba(0,0,0,0.1)",
  dropDownShadow: "rgba(0, 0, 0, .3)",
  numPadBackground: "#547AB2",
  numPadBorder: "#435F91",
  numPadActiveBackground: "#435F91",
  numPadText: "white", // Do not use hex here, it cannot be inlined with data-uri SVG
  valueReportBackground: "#FFFFFF",
  valueReportBorder: "#AAAAAA",
  contextualMenuHover: "rgba(77, 151, 255, .25)",
  menuHover: "rgba(0, 0, 0, .2)",
};

/**
 * Converts the given colours to CSS variables.
 *
 * @param coloursObj A (potentially nested) object whose keys are colour names
 *     and values are CSS colours.
 * @param prefix A prefix to prepend to the CSS variables.
 * @returns A string containing CSS variable definitions for the colours.
 */
function varify(coloursObj: Object, prefix = "--colour"): string {
  return Object.entries(coloursObj)
    .map(([key, colour]) => {
      if (typeof colour === "string") {
        return `${prefix}-${key}: ${colour};`;
      } else {
        return varify(colour, `${prefix}-${key}`);
      }
    })
    .join("\n");
}

const cssVariables = `:root {
  ${varify(Colours)}
}`;

Blockly.Css.register(cssVariables);

export { Colours };
