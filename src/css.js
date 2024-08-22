/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2013 Google Inc.
 * https://developers.google.com/blockly/
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

const styles = `
  .blocklySvg {
    background-color: var(--colour-workspace);
    outline: none;
    overflow: hidden;  /* IE overflows by default. */
    position: absolute;
    display: block;
  }

  /* Necessary to position the drag surface */
  .blocklyRelativeWrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .blocklyWidgetDiv {
    display: none;
    position: absolute;
    z-index: 99999; /* big value for bootstrap3 compatibility */
  }

  .injectionDiv {
    height: 100%;
    position: relative;
    overflow: hidden; /* So blocks in drag surface disappear at edges */
    touch-action: none;
  }

  .injectionDiv.boundless {
    overflow: visible;
  }

  .blocklyNonSelectable {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  .blocklyBlockCanvas.blocklyCanvasTransitioning,
  .blocklyBubbleCanvas.blocklyCanvasTransitioning {
    transition: none;
  }

  .blocklyWidgetDiv.fieldTextInput {
    overflow: hidden;
    border: 1px solid;
    box-sizing: border-box;
    transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    -moz-transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
  }

  .blocklyWidgetDiv.fieldTextInput.removableTextInput {
    overflow: visible;
  }

  .blocklyTextDropDownArrow {
    position: absolute;
  }

  .blocklyTextRemoveIcon {
    position: absolute;
    width: 24px;
    height: 24px;
    top: -40px;
    left: 50%;
    margin-left: -12px;
    cursor: pointer;
  }

  .blocklyWsDragSurface {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
  }
  /* Added as a separate rule with multiple classes to make it more specific
     than a bootstrap rule that selects svg:root. See issue #1275 for context.
  */
  .blocklyWsDragSurface.blocklyOverflowVisible {
    overflow: visible;
  }

  .blocklyTooltipDiv {
    background-color: #ffffc7;
    border: 1px solid #ddc;
    box-shadow: 4px 4px 20px 1px rgba(0,0,0,.15);
    color: #000;
    display: none;
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 9pt;
    opacity: 0.9;
    padding: 2px;
    position: absolute;
    z-index: 100000; /* big value for bootstrap3 compatibility */
  }

  .blocklyDropDownDiv {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    display: none;
    border: 1px solid;
    border-radius: 4px;
    box-shadow: 0px 0px 8px 1px var(--colour-dropDownShadow);
    padding: 4px;
    -webkit-user-select: none;
    min-height: 15px
  }

  .blocklyDropDownContent {
    max-height: 300px; // @todo: spec for maximum height.
    overflow: auto;
  }

  .blocklyDropDownArrow {
    position: absolute;
    left: 0;
    top: 0;
    width: 16px;
    height: 16px;
    z-index: -1;
    background-color: inherit;
    border-color: inherit;
  }

  .blocklyDropDownButton {
    display: inline-block;
    float: left;
    padding: 0;
    margin: 4px;
    border-radius: 4px;
    outline: none;
    border: 1px solid;
    transition: box-shadow .1s;
    cursor: pointer;
  }

  .blocklyDropDownButtonHover {
    box-shadow: 0px 0px 0px 4px var(--colour-fieldShadow);
  }

  .blocklyDropDownButton:active {
    box-shadow: 0px 0px 0px 6px var(--colour-fieldShadow);
  }

  .blocklyDropDownButton > img {
    width: 80%;
    height: 80%;
    margin-top: 5%
  }

  .blocklyDropDownPlaceholder {
    display: inline-block;
    float: left;
    padding: 0;
    margin: 4px;
  }

  .blocklyNumPadButton {
    display: inline-block;
    float: left;
    padding: 0;
    width: 48px;
    height: 48px;
    margin: 4px;
    border-radius: 4px;
    background: var(--colour-numPadBackground);
    color: var(--colour-numPadText);
    outline: none;
    border: 1px solid var(--colour-numPadBorder);
    cursor: pointer;
    font-weight: 600;
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 12pt;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  .blocklyNumPadButton > img {
    margin-top: 10%;
    width: 80%;
    height: 80%;
  }

  .blocklyNumPadButton:active {
    background: var(--colour-numPadActiveBackground);
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  .arrowTop {
    border-top: 1px solid;
    border-left: 1px solid;
    border-top-left-radius: 4px;
    border-color: inherit;
  }

  .arrowBottom {
    border-bottom: 1px solid;
    border-right: 1px solid;
    border-bottom-right-radius: 4px;
    border-color: inherit;
  }

  .valueReportBox {
    min-width: 50px;
    max-width: 300px;
    max-height: 200px;
    overflow: auto;
    word-wrap: break-word;
    text-align: center;
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: .8em;
  }

  .blocklyResizeSE {
    cursor: se-resize;
    fill: #aaa;
  }

  .blocklyResizeSW {
    cursor: sw-resize;
    fill: #aaa;
  }

  .blocklyResizeLine {
    stroke: #888;
    stroke-width: 1;
  }

  .blocklyHighlightedConnectionPath {
    fill: none;
    stroke: #fc3;
    stroke-width: 4px;
  }

  .blocklyPath {
    stroke-width: 1px;
  }

  .blocklySelected>.blocklyPath {
    // stroke: #fc3;
    // stroke-width: 3px;
  }

  .blocklySelected>.blocklyPathLight {
    display: none;
  }

  .blocklyDraggable {
    /* backup for browsers (e.g. IE11) that don't support grab */
    cursor: url("<<<PATH>>>/handopen.cur"), auto;
    cursor: grab;
    cursor: -webkit-grab;
    cursor: -moz-grab;
  }

   .blocklyDragging {
    /* backup for browsers (e.g. IE11) that don't support grabbing */
    cursor: url("<<<PATH>>>/handclosed.cur"), auto;
    cursor: grabbing;
    cursor: -webkit-grabbing;
    cursor: -moz-grabbing;
  }

  /* All the blocks being dragged get the blocklyDragging class, so match only the root one */
  :not(.blocklyDragging) > .blocklyDragging {
    filter: url(#blocklyDragShadowFilter);
  }

  /* Changes cursor on mouse down. Not effective in Firefox because of
    https://bugzilla.mozilla.org/show_bug.cgi?id=771241 */
  .blocklyDraggable:active {
    /* backup for browsers (e.g. IE11) that don't support grabbing */
    cursor: url("<<<PATH>>>/handclosed.cur"), auto;
    cursor: grabbing;
    cursor: -webkit-grabbing;
    cursor: -moz-grabbing;
  }
  /* Change the cursor on the whole drag surface in case the mouse gets
     ahead of block during a drag. This way the cursor is still a closed hand.
   */
  .blocklyBlockDragSurface .blocklyDraggable {
    /* backup for browsers (e.g. IE11) that don't support grabbing */
    cursor: url("<<<PATH>>>/handclosed.cur"), auto;
    cursor: grabbing;
    cursor: -webkit-grabbing;
    cursor: -moz-grabbing;
  }

  .blocklyDragging.blocklyDraggingDelete {
    cursor: url("<<<PATH>>>/handdelete.cur"), auto;
  }

  .blocklyDragging.blocklyDraggingMouseThrough {
    pointer-events: none;
  }

  .blocklyToolboxDelete {
    cursor: url("<<<PATH>>>/handdelete.cur"), auto;
  }

  .blocklyToolboxGrab {
    cursor: url("<<<PATH>>>/handclosed.cur"), auto;
    cursor: grabbing;
    cursor: -webkit-grabbing;
  }

  .blocklyDragging>.blocklyPath,
  .blocklyDragging>.blocklyPathLight {
    fill-opacity: 1.0;
    stroke-opacity: 1.0;
  }

  .blocklyDragging>.blocklyPath {
  }

  .blocklyDisabled>.blocklyPath {
    fill-opacity: .5;
    stroke-opacity: .5;
  }

  .blocklyInsertionMarker>.blocklyPath {
    stroke: none;
  }

  .blocklyText {
    fill: var(--colour-text);
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 12pt;
    font-weight: 500;
  }

  .blocklyTextTruncated {
    font-size: 11pt;
  }

  .blocklyNonEditableText>text {
    pointer-events: none;
  }
  .blocklyNonEditableText>text,
  .blocklyEditableText>text {
    fill: var(--colour-textFieldText);
  }

  .blocklyEditableText>.blocklyEditableLabel {
    fill: #fff;
  }

  .blocklyDropdownText {
    fill: $colour_text !important;
  }

  .blocklyBubbleText {
    fill: var(--colour-textFieldText);
  }
  .blocklyFlyout {
    position: absolute;
    z-index: 20;
  }
  .blocklyFlyoutButton {
    fill: none;
    pointer-events: all;
  }

  .blocklyFlyoutButtonBackground {
      stroke: #c6c6c6;
  }

  .blocklyFlyoutButtonShadow {
    fill: transparent;
  }

  .blocklyFlyoutButton:hover {
    fill: white;
    cursor: pointer;
  }

  .blocklyFlyoutLabel {
    cursor: default;
  }

  .blocklyFlyoutLabelBackground {
    opacity: 0;
  }

  .blocklyTouchTargetBackground {
    fill: transparent;
    cursor: pointer;
  }

  .scratch-renderer.zelos-theme .blocklyFlyoutLabelText {
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 14pt;
    fill: #575E75;
    font-weight: bold;
  }

  .scratch-renderer.zelos-theme .blocklyText,
  .scratch-renderer.zelos-theme .blocklyHtmlInput {
    font-weight: 500;
  }

  .scratch-renderer.zelos-theme .blocklyFlyoutButton .blocklyText {
    fill: var(--colour-textFieldText);
  }

  /*
    Don't allow users to select text.  It gets annoying when trying to
    drag a block and selected text moves instead.
  */
  .blocklySvg text, .blocklyBlockDragSurface text, .blocklyFlyout text, .blocklyToolboxDiv text {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    cursor: inherit;
  }

  .blocklyHidden {
    display: none;
  }

  .blocklyFieldDropdown:not(.blocklyHidden) {
    display: block;
  }

  .blocklyIconGroup {
    cursor: default;
  }

  .blocklyIconGroup:not(:hover),
  .blocklyIconGroupReadonly {
    opacity: .6;
  }

  .blocklyIconShape {
    fill: #00f;
    stroke: #fff;
    stroke-width: 1px;
  }

  .blocklyIconSymbol {
    fill: #fff;
  }

  .blocklyMinimalBody {
    margin: 0;
    padding: 0;
  }

  .blocklyCommentForeignObject {
    position: relative;
    z-index: 0;
  }

  .blocklyCommentRect {
    fill: #E7DE8E;
    stroke: #bcA903;
    stroke-width: 1px
  }

  .blocklyCommentTarget {
    fill: transparent;
    stroke: #bcA903;
  }

  .blocklyCommentTargetFocused {
    fill: none;
  }

  .blocklyCommentHandleTarget {
    fill: none;
  }

  .blocklyCommentHandleTargetFocused {
    fill: transparent;
  }

  .blocklyFocused>.blocklyCommentRect {
    fill: #B9B272;
    stroke: #B9B272;
  }

  .blocklySelected>.blocklyCommentTarget {
    stroke: #fc3;
    stroke-width: 3px;
  }


  .blocklyCommentTextarea {
    background-color: #fef49c;
    border: 0;
    outline: 0;
    margin: 0;
    padding: 3px;
    resize: none;
    display: block;
    overflow: hidden;
  }

  .blocklyCommentDeleteIcon {
    cursor: pointer;
    fill: #000;
    display: none
  }

  .blocklySelected > .blocklyCommentDeleteIcon {
    display: block
  }

  .blocklyDeleteIconShape {
    fill: #000;
    stroke: #000;
    stroke-width: 1px;
  }

  .blocklyDeleteIconShape.blocklyDeleteIconHighlighted {
    stroke: #fc3;
  }

  // Scratch Comments

  .scratchCommentForeignObject {
    position: relative;
  }

  .scratchCommentBody {
    background-color: #fef49c;
    border-radius: 4px;
  }

  .scratchCommentRect {
    fill: #fef49c;
  }

  .scratchCommentTarget {
    fill: transparent;
  }

  .scratchWorkspaceCommentBorder {
    stroke: #bcA903;
    stroke-width: 1px;
  }

  .scratchCommentTargetFocused {
    fill: none;
  }

  .scratchCommentTopBar {
    fill: #000000;
    fill-opacity: 0.1
  }

  .scratchCommentText {
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 12pt;
    font-weight: 400;
  }

  .scratchCommentTextarea {
    background-color: #fef49c;
    border: 0;
    outline: 0;
    padding: 0;
    resize: none;
    overflow: hidden;
  }

  .scratchCommentTextarea::placeholder {
    color: rgba(0,0,0,0.5);
    font-style: italic;
  }

  .scratchCommentResizeSE {
    cursor: se-resize;
    fill: transparent;
  }

  .scratchCommentResizeSW {
    cursor: sw-resize;
    fill: transparent;
  }

  .blocklyHtmlInput {
    border: none;
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 12pt;
    height: 100%;
    margin: 0;
    outline: none;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    color: var(--colour-textFieldText);
    font-weight: 500;
  }

  .blocklyMainBackground {
    stroke-width: 1;
    stroke: #c6c6c6;  /* Equates to #ddd due to border being off-pixel. */
  }

  .blocklyMutatorBackground {
    fill: #fff;
    stroke: #ddd;
    stroke-width: 1;
  }

  .blocklyFlyoutBackground {
    fill: var(--colour-flyout);
    fill-opacity: .8;
  }

  .blocklyMainWorkspaceScrollbar {
    z-index: 20;
  }

  .blocklyFlyoutScrollbar {
    z-index: 30;
  }

  .blocklyScrollbarHorizontal, .blocklyScrollbarVertical {
    position: absolute;
    outline: none;
  }

  .blocklyScrollbarBackground {
    opacity: 0;
  }

  .blocklyScrollbarHandle {
    fill: var(--colour-scrollbar);
  }

  .blocklyScrollbarBackground:hover+.blocklyScrollbarHandle,
  .blocklyScrollbarHandle:hover {
    fill: var(--colour-scrollbarHover);
  }

  .blocklyZoom>image {
    opacity: 1;
  }

  /* Darken flyout scrollbars due to being on a grey background. */
  /* By contrast, workspace scrollbars are on a white background. */
  .blocklyFlyout .blocklyScrollbarHandle {
    fill: #bbb;
  }

  .blocklyFlyout .blocklyScrollbarBackground:hover+.blocklyScrollbarHandle,
  .blocklyFlyout .blocklyScrollbarHandle:hover {
    fill: #aaa;
  }

  .blocklyInvalidInput {
    background: #faa;
  }

  .blocklyAngleCircle {
    stroke: var(--colour-motion-tertiary);
    stroke-width: 1;
    fill: var(--colour-motion-secondary);
  }

  .blocklyAngleCenterPoint {
    stroke: #fff;
    stroke-width: 1;
    fill: #fff;
  }

  .blocklyAngleDragHandle {
    stroke: #fff;
    stroke-width: 5;
    stroke-opacity: 0.25;
    fill: #fff;
    cursor: pointer;
  }

  .blocklyAngleDragArrow {
    pointer-events: none
  }

  .blocklyAngleMarks {
    stroke: #fff;
    stroke-width: 1;
    stroke-opacity: 0.5;
  }

  .blocklyAngleGauge {
    fill: #fff;
    fill-opacity: 0.20;
  }

  .blocklyAngleLine {
    stroke: #fff;
    stroke-width: 1;
    stroke-linecap: round;
    pointer-events: none;
  }

  .blocklyContextMenu {
    border-radius: 4px;
    max-height: 100%;
  }

  .blocklyDropdownMenu {
    padding: 0 !important;
  }

  .blocklyDropDownNumPad {
    background-color: var(--colour-numPadBackground);
  }

  /* Override the default Closure URL. */
  .blocklyWidgetDiv .goog-option-selected .goog-menuitem-checkbox,
  .blocklyWidgetDiv .goog-option-selected .goog-menuitem-icon {
    background: url(<<<PATH>>>/sprites.png) no-repeat -48px -16px !important;
  }

  /* Category tree in Toolbox. */
  .blocklyToolboxDiv {
    background-color: var(--colour-toolbox);
    color: var(--colour-toolboxText);
    overflow-x: visible;
    overflow-y: auto;
    position: absolute;
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    z-index: 40; /* so blocks go over toolbox when dragging */
    -webkit-tap-highlight-color: transparent; /* issue #1345 */
    padding: 0;
  }

  .blocklyTreeRoot {
    padding: 4px 0;
  }

  .blocklyTreeRoot:focus {
    outline: none;
  }

  .blocklyToolboxDiv .blocklyTreeRow {
    line-height: 22px;
    margin: 0;
    padding: 0.375rem 0px;
    white-space: nowrap;
    cursor: pointer;
  }

  .blocklyHorizontalTree {
    float: left;
    margin: 1px 5px 8px 0;
  }

  .blocklyHorizontalTreeRtl {
    float: right;
    margin: 1px 0 8px 5px;
  }

  .blocklyToolboxDiv[dir="RTL"] .blocklyTreeRow {
    margin-left: 8px;
  }

  .blocklyTreeRow:hover {
    color: var(--colour-toolboxHover);
  }

  .blocklyTreeSeparator {
    display: none;
  }

  .blocklyTreeSeparatorHorizontal {
    border-right: solid #e5e5e5 1px;
    width: 0;
    padding: 5px 0;
    margin: 0 5px;
  }

  .blocklyTreeIcon {
    background-image: url(<<<PATH>>>/sprites.png);
    height: 16px;
    vertical-align: middle;
    width: 16px;
  }

  .blocklyTreeIconClosedLtr {
    background-position: -32px -1px;
  }

  .blocklyTreeIconClosedRtl {
    background-position: 0px -1px;
  }

  .blocklyTreeIconOpen {
    background-position: -16px -1px;
  }

  .blocklyTreeSelected>.blocklyTreeIconClosedLtr {
    background-position: -32px -17px;
  }

  .blocklyTreeSelected>.blocklyTreeIconClosedRtl {
    background-position: 0px -17px;
  }

  .blocklyTreeSelected>.blocklyTreeIconOpen {
    background-position: -16px -17px;
  }

  .blocklyTreeIconNone,
  .blocklyTreeSelected>.blocklyTreeIconNone {
    background-position: -48px -1px;
  }

  .blocklyTreeLabel {
    cursor: default;
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: .65rem;
    padding: 0 3px;
    vertical-align: middle;
    width: 60px;
    text-align: center;
  }

  .blocklyTreeSelected .blocklyTreeLabel {
    color: inherit;
  }

  .blocklyToolboxDelete .blocklyTreeLabel {
    cursor: url("<<<PATH>>>/handdelete.cur"), auto;
  }

  .blocklyToolboxSelected {
    background-color: var(--colour-toolboxSelected);
  }

  .blocklyDropDownDiv .goog-slider-horizontal {
    margin: 8px;
    height: 22px;
    width: 150px;
    position: relative;
    outline: none;
    border-radius: 11px;
    margin-bottom: 20px;
  }

  .blocklyDropDownDiv .goog-slider-horizontal .goog-slider-thumb {
    width: 26px;
    height: 26px;
    top: -1px;
    position: absolute;
    background-color: white;
    border-radius: 100%;
    -webkit-box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.15);
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.15);
  }

  .scratchEyedropper {
    background: none;
    outline: none;
    border: none;
    width: 100%;
    text-align: center;
    border-top: 1px solid #ddd;
    padding-top: 5px;
    cursor: pointer;
  }

  .scratchColourPicker {
    width: min-content;
  }

  .scratchColourPickerLabel {
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 0.65rem;
    color: var(--colour-toolboxText);
    margin: 8px;
  }

  .scratchColourPickerLabelText {
    font-weight: bold;
  }

  .scratchColourPickerReadout {
    margin-left: 10px;
  }

  .scratchColourSlider {
    appearance: none;
    margin: 8px;
    height: 22px;
    width: 150px;
    position: relative;
    outline: none;
    border-radius: 11px;
    margin-bottom: 20px;
  }

  /* Combining this and the -moz equivalent below with a comma break the webkit version */
  .scratchColourSlider::-webkit-slider-thumb {
    appearance: none;
    background-color: #fff;
    height: 26px;
    width: 26px;
    border-radius: 100%;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.15);
  }

  .scratchColourSlider::-moz-range-thumb {
    appearance: none;
    background-color: #fff;
    height: 26px;
    width: 26px;
    border-radius: 100%;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.15);
  }

  .scratchMatrixButtonDiv {
    width: 50%;
    text-align: center;
    float: left;
  }

  .scratchNotePickerKeyLabel {
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 0.75rem;
    fill: var(--colour-textFieldText);
    pointer-events: none;
  }

  /* Copied from: goog/css/menu.css */
  /*
   * Copyright 2009 The Closure Library Authors. All Rights Reserved.
   *
   * Use of this source code is governed by the Apache License, Version 2.0.
   * See the COPYING file for details.
   */

  /**
   * Standard styling for menus created by goog.ui.MenuRenderer.
   *
   * @author attila@google.com (Attila Bodis)
   */

  .blocklyWidgetDiv .goog-menu {
    background: #fff;
    border-color: #ccc #666 #666 #ccc;
    border-style: solid;
    border-width: 1px;
    cursor: default;
    font: normal 13px "Helvetica Neue", Helvetica, sans-serif;
    margin: 0;
    outline: none;
    padding: 4px 0;
    position: absolute;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 20000;  /* Arbitrary, but some apps depend on it... */
    box-sizing: content-box;
    box-shadow: none;
  }

  .blocklyWidgetDiv .blocklyMenu.blocklyFocused {
    box-shadow: none;
  }

  .blocklyDropDownDiv .goog-menu {
    cursor: default;
    font: normal 13px "Helvetica Neue", Helvetica, sans-serif;
    outline: none;
    z-index: 20000;  /* Arbitrary, but some apps depend on it... */
  }

  /* Copied from: goog/css/menuitem.css */
  /*
   * Copyright 2009 The Closure Library Authors. All Rights Reserved.
   *
   * Use of this source code is governed by the Apache License, Version 2.0.
   * See the COPYING file for details.
   */

  /**
   * Standard styling for menus created by goog.ui.MenuItemRenderer.
   *
   * @author attila@google.com (Attila Bodis)
   */

  /**
   * State: resting.
   *
   * NOTE(mleibman,chrishenry):
   * The RTL support in Closure is provided via two mechanisms -- "rtl" CSS
   * classes and BiDi flipping done by the CSS compiler.  Closure supports RTL
   * with or without the use of the CSS compiler.  In order for them not
   * to conflict with each other, the "rtl" CSS classes need to have the #noflip
   * annotation.  The non-rtl counterparts should ideally have them as well, but,
   * since .goog-menuitem existed without .goog-menuitem-rtl for so long before
   * being added, there is a risk of people having templates where they are not
   * rendering the .goog-menuitem-rtl class when in RTL and instead rely solely
   * on the BiDi flipping by the CSS compiler.  That's why we're not adding the
   * #noflip to .goog-menuitem.
   */
  .blocklyWidgetDiv .goog-menuitem {
    font: normal 13px "Helvetica Neue", Helvetica, sans-serif;
    list-style: none;
    margin: 0;
     /* 28px on the left for icon or checkbox; 7em on the right for shortcut. */
    padding: 4px 7em 4px 28px;
    white-space: nowrap;
  }

  .blocklyDropDownDiv .goog-menuitem {
    color: var(--colour-text);
    font: normal 13px "Helvetica Neue", Helvetica, sans-serif;
    font-weight: bold;
    list-style: none;
    margin: 0;
    min-height: 24px;
     /* 28px on the left for icon or checkbox; 7em on the right for shortcut. */
    padding: 4px 7em 4px 28px;
    white-space: nowrap;
  }

  /* BiDi override for the resting state. */
  /* #noflip */
  .blocklyWidgetDiv .goog-menuitem.goog-menuitem-rtl, ,
  .blocklyDropDownDiv .goog-menuitem.goog-menuitem-rtl {
     /* Flip left/right padding for BiDi. */
    padding-left: 7em;
    padding-right: 28px;
  }

  /* If a menu doesn't have checkable items or items with icons, remove padding. */
  .blocklyWidgetDiv .goog-menu-nocheckbox .goog-menuitem,
  .blocklyWidgetDiv .goog-menu-noicon .goog-menuitem, ,
  .blocklyDropDownDiv .goog-menu-nocheckbox .goog-menuitem,
  .blocklyDropDownDiv .goog-menu-noicon .goog-menuitem { ,
    padding-left: 12px;
  }

  /*
   * If a menu doesn't have items with shortcuts, leave just enough room for
   * submenu arrows, if they are rendered.
   */
  .blocklyWidgetDiv .goog-menu-noaccel .goog-menuitem, ,
  .blocklyDropDownDiv .goog-menu-noaccel .goog-menuitem {
    padding-right: 20px;
  }

  .blocklyWidgetDiv .goog-menuitem-content ,
  .blocklyDropDownDiv .goog-menuitem-content {
    font: normal 13px "Helvetica Neue", Helvetica, sans-serif;
  }

  /* State: disabled. */
  .blocklyWidgetDiv .goog-menuitem-disabled .goog-menuitem-accel,
  .blocklyWidgetDiv .goog-menuitem-disabled .goog-menuitem-content, ,
  .blocklyDropDownDiv .goog-menuitem-disabled .goog-menuitem-accel,
  .blocklyDropDownDiv .goog-menuitem-disabled .goog-menuitem-content {
    color: #ccc !important;
  }

  .blocklyWidgetDiv .goog-menuitem-disabled .goog-menuitem-icon, ,
  .blocklyDropDownDiv .goog-menuitem-disabled .goog-menuitem-icon {
    opacity: 0.3;
    -moz-opacity: 0.3;
    filter: alpha(opacity=30);
  }

  /* State: hover. */
  .blocklyWidgetDiv .goog-menuitem-highlight,
  .blocklyWidgetDiv .goog-menuitem-hover {
    background-color: #d6e9f8;
     /* Use an explicit top and bottom border so that the selection is visible
      * in high contrast mode. */
    border-color: #d6e9f8;
    border-style: dotted;
    border-width: 1px 0;
    padding-bottom: 3px;
    padding-top: 3px;
  }

  .blocklyDropDownDiv .goog-menuitem-highlight,
  .blocklyDropDownDiv .goog-menuitem-hover {
    background-color: var(--colour-menuHover);
  }

  /* State: selected/checked. */
  .blocklyWidgetDiv .goog-menuitem-checkbox,
  .blocklyWidgetDiv .goog-menuitem-icon, ,
  .blocklyDropDownDiv .goog-menuitem-checkbox,
  .blocklyDropDownDiv .goog-menuitem-icon {
    background-repeat: no-repeat;
    height: 16px;
    left: 6px;
    position: absolute;
    right: auto;
    vertical-align: middle;
    width: 16px;
  }

  .blocklyWidgetDiv .goog-option-selected .goog-menuitem-checkbox,
  .blocklyWidgetDiv .goog-option-selected .goog-menuitem-icon,
  .blocklyDropDownDiv .goog-option-selected .goog-menuitem-checkbox,
  .blocklyDropDownDiv .goog-option-selected .goog-menuitem-icon {
     /* Client apps may override the URL at which they serve the sprite. */
    background: url(<<<PATH>>>/sprites.png) no-repeat -48px -16px !important;
    position: static; /* Scroll with the menu. */
    float: left;
    margin-left: -24px;
  }

  /* BiDi override for the selected/checked state. */
  /* #noflip */
  .blocklyWidgetDiv .goog-menuitem-rtl .goog-menuitem-checkbox,
  .blocklyWidgetDiv .goog-menuitem-rtl .goog-menuitem-icon,
  .blocklyDropDownDiv .goog-menuitem-rtl .goog-menuitem-checkbox,
  .blocklyDropDownDiv .goog-menuitem-rtl .goog-menuitem-icon {
     /* Flip left/right positioning. */
     float: right;
     margin-right: -24px;
  }

  /* Keyboard shortcut ("accelerator") style. */
  .blocklyWidgetDiv .goog-menuitem-accel, ,
  .blocklyDropDownDiv .goog-menuitem-accel {
    color: #999;
     /* Keyboard shortcuts are untranslated; always left-to-right. */
     /* #noflip */
    direction: ltr;
    left: auto;
    padding: 0 6px;
    position: absolute;
    right: 0;
    text-align: right;
  }

  /* BiDi override for shortcut style. */
  /* #noflip */
  .blocklyWidgetDiv .goog-menuitem-rtl .goog-menuitem-accel, ,
  .blocklyDropDownDiv .goog-menuitem-rtl .goog-menuitem-accel {
     /* Flip left/right positioning and text alignment. */
    left: 0;
    right: auto;
    text-align: left;
  }

  /* Mnemonic styles. */
  .blocklyWidgetDiv .goog-menuitem-mnemonic-hint, ,
  .blocklyDropDownDiv .goog-menuitem-mnemonic-hint {
    text-decoration: underline;
  }

  .blocklyWidgetDiv .goog-menuitem-mnemonic-separator, ,
  .blocklyDropDownDiv .goog-menuitem-mnemonic-separator {
    color: #999;
    font-size: 12px;
    padding-left: 4px;
  }

  /* Copied from: goog/css/menuseparator.css */
  /*
   * Copyright 2009 The Closure Library Authors. All Rights Reserved.
   *
   * Use of this source code is governed by the Apache License, Version 2.0.
   * See the COPYING file for details.
   */

  /**
   * Standard styling for menus created by goog.ui.MenuSeparatorRenderer.
   *
   * @author attila@google.com (Attila Bodis)
   */

  .blocklyWidgetDiv .goog-menuseparator, ,
  .blocklyDropDownDiv .goog-menuseparator {
    border-top: 1px solid #ccc;
    margin: 4px 0;
    padding: 0;
  }

  .blocklyFlyoutCheckbox {
    fill: white;
    stroke: #c8c8c8;
  }

  .checked > .blocklyFlyoutCheckbox {
    fill: var(--colour-motion-primary);
    stroke: var(--colour-motion-tertiary);
  }

  .blocklyFlyoutCheckboxPath {
    fill: transparent;
    stroke: white;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .scratchCategoryMenu {
    width: 60px;
    background: var(--colour-toolbox);
    color: var(--colour-toolboxText);
    font-size: .7rem;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .scratchCategoryMenuHorizontal {
    width: 100%;
    height: 50px;
    background: var(--colour-toolbox);
    color: var(--colour-toolboxText);
    font-size: .7em;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .scratchCategoryMenuHorizontal .scratchCategoryMenuRow {
    float: left;
    margin: 3px;
  }

  .scratchCategoryMenuRow {
  }

  .scratchCategoryMenuItem {
    padding: 0.375rem 0px;
    cursor: pointer;
    text-align: center;
  }

  .scratchCategoryMenuHorizontal .scratchCategoryMenuItem {
    padding: 6px 5px;
  }

  .scratchCategoryMenuItem.categorySelected {
    background: var(--colour-toolboxSelected);
  }

  .scratchCategoryItemBubble {
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid;
    border-radius: 100%;
    margin: 0 auto 0.125rem;
  }

  .scratchCategoryItemIcon {
    width: 1.25rem;
    height: 1.25rem;
    margin: 0 auto 0.125rem;
    background-size: 100%;
  }

  .scratchCategoryMenuItem:hover {
    color: $colour_toolboxHover !important;
  }

  .categoryIconBubble {
    margin: 0 auto 0.125rem;
    width: 1.25rem;
    height: 1.25rem;
  }

  .blocklyComment {
    --colour-commentBorder: #bcA903;
  }

  .blocklyCommentTopbar {
    height: 32px;
    --commentBorderColour: #e2db96;
  }

  .blocklyCommentTopbarBackground {
    height: 32px;
  }

  .blocklyFoldoutIcon {
    width: 32px;
    height: 32px;
    transform-origin: 16px 16px;
  }

  .blocklyComment:not(.blocklyCollapsed) .blocklyCommentHighlight,
  .blocklySelected .blocklyCommentHighlight,
  .blocklyCollapsed .blocklyCommentTopbarBackground,
  .blocklyCollapsed.blocklySelected .blocklyCommentTopbarBackground {
    stroke: var(--colour-commentBorder);
    stroke-width: 1px;
  }

  .blocklyCollapsed.blocklyComment .blocklyFoldoutIcon {
    transform: rotate(-180deg);
  }

  .scratch-renderer.zelos-theme .blocklyComment .blocklyTextarea {
    border: none;
    --commentFillColour: #fef49c;
    font-size: 12pt;
    font-weight: 400;
    padding: 12px;
    color: #575e75;
  }

  .scratch-renderer.zelos-theme .blocklyCommentText.blocklyText {
    font-weight: 400;
  }

  .blocklyToolboxCategory {
    height: auto;
    line-height: auto;
    margin-bottom: 0;
    padding: 0.375rem 0px;
    cursor: pointer;
  }
  .blocklyToolboxCategory:hover {
    color: #4c97ff;
  }
  .blocklyDropDownDiv .blocklyMenuItem {
    color: #fff;
    font-weight: bold;
  }
  .blocklyToolboxSelected .blocklyTreeLabel {
    color: var(--colour-toolboxText);
  }

  .blocklyDeleteIcon {
    display: block;
    width: 32px;
    height: 32px;
  }

  .blocklyResizeHandle {
    height: 20px;
    width: 20px;
  }
`;

Blockly.Css.register(styles);
