/**  
 * @file Initilizing options for cytoscape.js-edge-editing extension, which is used for reconnecting and
 *    adding bend points and control points. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

// @ts-nocheck
import { edgeReconnect } from "@/views/canvas/controller/edge";

export const eeDefaults = {
  anchorShapeSizeFactor: 5,
  handleReconnectEdge: function (sourceID, targetID, data, location) {
    edgeReconnect(sourceID, targetID, data)
  },
    // undoable: true,
    bendRemovalSensitivity: 16,
    enableMultipleAnchorRemovalOption: true,
    initAnchorsAutomatically: false,
    useTrailingDividersAfterContextMenuOptions: false,
    enableCreateAnchorOnDrag: false,
    addBendMenuItemTitle: "增加控制点",
    removeBendMenuItemTitle: "移除控制点",
    removeAllBendMenuItemTitle: "移除所有控制点",
    addControlMenuItemTitle: "添加弯曲点",
    removeControlMenuItemTitle: "移除弯曲点",
    removeAllControlMenuItemTitle: "移除所有弯曲点",
    moveSelectedAnchorsOnKeyEvents: function () {
      return true;
    },
    bendPositionsFunction: function(ele) {
      return ele.data('bendPointPositions');
    },
    controlPositionsFunction: function(ele) {
      return ele.data('controlPointPositions');
    },
    // A function parameter to set bend point positions
    bendPointPositionsSetterFunction: function(ele, bendPointPositions) {
      ele.data('bendPointPositions', bendPointPositions);
    },
    // A function parameter to set bend point positions
    controlPointPositionsSetterFunction: function(ele, controlPointPositions) {
      ele.data('controlPointPositions', controlPointPositions);
    },
};