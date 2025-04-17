/**  
 * @file Functions related to diagram switching: saving old and importing new diagrams, updating from master model
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Core } from "cytoscape";
import { cy } from "@/views/canvas/components/DiagramCanvas";
import { DiagramTreeNode } from "@/views/canvas/model/diagram-tree-model";
import { MMEdge } from "@/views/canvas/model/edge-model";
import { MMNode } from "@/views/canvas/model/node-model";
import { addConnectedNodes } from "./general";

/**
 * Updates edge label on diagram switch. If the edge is merged (derived with multiple originals), name gets concatenated
 * @param MMRef - Master model edge
 * @returns - Single string or a concatenated name
 */
const getEdgeLabel = (MMRef: MMEdge): string => {
  const origEdges = MMRef.originalEdges;
  if (origEdges.length) {
    MMRef.label = origEdges[0].label;
    for (let i = 1; i < origEdges.length; i++) {
      const label = origEdges[i].label;
      if (label.length > 0) {
        MMRef.label += ", " + label;
      }
    }
  }
  return MMRef.label;
};

/**
 * Delete elements marked as deleted or edges that were relinked, update labels
 * @param cy - Cytoscape instance
 */
const updateElementsFromMM = (cy: Core) => {
  //解决连线报错
  for (const node of cy.nodes() as any) {
    if(!node.data().type){
      return
    }
  }
  for (const node of cy.nodes() as any) {
    if(node.data().type!=='project' && node.data().type!=='projectlock'){
    const MMRef = node.data('MMRef') as MMNode;
    if (MMRef === null || MMRef === undefined){
      return
    }
    if (MMRef.type === 'state') {
      const parent = MMRef.parent as MMNode;
      if (parent.deleted === true) {
        node.remove();
        continue;
      }
    }
    if (MMRef.deleted) {
      node.remove();
      continue;
    }

  //读取文本每一行的长度并获取最长那行文本的长度
    // 获取textarea元素
    // 获取textarea中的值
    var text = MMRef.label;

    // 使用换行符分割文本成行
    var line = text.split('\n');

    // 初始化最长行的长度和文本内容
    var maxLength = 0;
    var longestLine = '';

    // 遍历每一行文本并计算长度
    // for (var i = 0; i < line.length; i++) {
    //   var lineLength = line[i].length;

    //   // 如果当前行长度大于最长行长度，则更新最长行的长度和文本内容
    //   if (lineLength > maxLength) {
    //     maxLength = lineLength;
    //   }
    // }
    //读取输入框有几行文本
    let lines = MMRef.label.split('\n');  
    let numLines = lines.length;
    // 计算最长行的长度
    for (var i = 0; i < lines.length; i++) {
      let line = lines[i];
      let lineLength = 0;
      for (var j = 0; j < line.length; j++) {
        if (isChinese(line[j])) {
          lineLength += 17; // 中文字符按17像素计算
        } else {
          lineLength += 8;  // 英文字符按8像素计算
        }
      }
      if (lineLength > maxLength) {
        maxLength = lineLength;
      }
    }
    //解决中文状态下文本溢出方框问题
    // const newLabelWidth = maxLength * 17 > 70 ?  maxLength  * 17 : 70
    const newLabelWidth = maxLength > 70 ?  maxLength : 70
    //根据行数设置高度
    const newLabelHeight = numLines * 20 > 45 ?  numLines  * 20 : 45
    if(node.data().type !=='edgePoint'&&node.data().type !=='corss'){
      node.data({
        labelWidth: newLabelWidth,
        labelHeight:newLabelHeight
      });
    }
  }

  for (const edge of cy.edges() as any) {
    const MMRef = edge.data('MMRef');
    if (MMRef.deleted ||
      edge.data('source') != MMRef.source.id ||
      edge.data('target') != MMRef.target.id ||
      MMRef.originalEdge?.deleted) {

      edge.remove();
    }
    else {
      edge.data({
        label: getEdgeLabel(MMRef),
      });
    }
  }
}
};

/**
 * Main diagram switching logic. Save old diagram and display new one.
 * @param currentDiagram 
 * @param nextDiagram 
 */
export const switchDiagrams = (currentDiagram: DiagramTreeNode, nextDiagram: DiagramTreeNode) => {
  const json = cy.json();
  delete json.style; //cy instance has stylesheet, no need to save it with every diagram
  currentDiagram.diagramJson = json;
  cy.elements().remove();
  if(nextDiagram.diagramJson.style){
    delete nextDiagram.diagramJson.style;
  }
  cy.json(nextDiagram.diagramJson);
  // cy.nodes().map((node:any)=>{
    // var data = node.data().MMRef;
    // if(data.children && data.children.length > 0&&data.type==='process'){
    //     node.style({
    //       "border-width" :'4px'
    //     })
    // }
  // });
};

/**
 * Go through all displayed nodes and propagate possible edges
 * @param cy Cytoscape instance
 */
const propagateFromMM = (cy: Core) => {
  for (const node of cy.nodes() as any) {
    const MMRef = node.data('MMRef');
    addConnectedNodes(cy, MMRef);
  }
};

// 函数：检查字符是否为中文
function isChinese(char:any) {
  const charCode = char.charCodeAt(0);
  return (charCode >= 0x4E00 && charCode <= 0x9FFF);
}
/**
 * Update current diagram from master model
 */
export const updateFromMasterModel = () => {
  updateElementsFromMM(cy);
  propagateFromMM(cy);
};