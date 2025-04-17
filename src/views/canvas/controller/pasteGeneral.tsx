/**  
 * @file Functions used when importing from JSON and exporting to JSON
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Core, EdgeSingular, NodeSingular } from "cytoscape";
import { DiagramTreeNode } from "@/views/canvas/model/diagram-tree-model";
import { derivedEdgeArray, EdgeArray, EdgeType, hierarchicalStructuralEdges, MMEdge, originalEdgeArray } from '@/views/canvas/model/edge-model';
import { masterModelRoot, MMNode, MMRoot, NodeType } from "@/views/canvas/model/node-model";
import { eleCounter } from './elementCounter';
import { Affiliation, Essence } from "@/views/canvas/model/node-model";
//random layout options
let options = {
  name: 'random',
  fit: false,
  padding: 30,
  boundingBox: {},
  avoidOverlap: true,
};

let currentMMNode = masterModelRoot;

interface NodeData {
  id: string,
  label: string,
  type: NodeType,
  MMRef: MMNode | null,
  parent: string;
}

interface EdgeData {
  id: string,
  label: string,
  type: EdgeType,
  MMRef: MMEdge | null,
  source: MMNode,
  target: MMNode,
}
interface CyViewport {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w: number,
  h: number,
}

/**
 * Crop viewport by third of the width and height
 * @param viewport - Full viewport
 * @returns - Cropped viewport
 */
const cropViewport = (viewport: CyViewport): CyViewport => {
  const widthDiff = viewport.w / 6;
  const heightDiff = viewport.h / 6;
  viewport.x1 = viewport.x1 + widthDiff;
  viewport.x2 = viewport.x2 - widthDiff;
  viewport.y1 = viewport.y1 + heightDiff;
  viewport.y2 = viewport.y2 - heightDiff;
  viewport.w = viewport.w - widthDiff * 2;
  viewport.h = viewport.h - heightDiff * 2;
  return viewport;
};

/**
 * Adding node to master model as well as in the current diagram
 * @param cy - Cytoscape instance
 * @param data - Node data 
 * @param position - Position to put the node at
 * @param parentMMNode - Master model parent
 */
const addNode = (cy: Core, data: NodeData, position = { x: 0, y: 0 }, parentMMNode: MMNode | MMRoot ,ele:any) => {
  if (cy.getElementById(data.id).length > 0) {
    return;
  }
  // data['label'] = data['label'].charAt(0).toUpperCase() + data['label'].substring(1).toLowerCase();
  if (data['MMRef'] === null) {
    let modelNode = new MMNode(data['id'], data['type'], data['label']);
    parentMMNode.addChild(modelNode);
    data['MMRef'] = modelNode;
    if (data['parent'] !== '' && data['type'] !== 'state')
      modelNode.isSubelementOfMain = true;
    else if (data['type'] === 'state')
      modelNode.isStructurePart = true;
  }


  const parentBB = cy.getElementById(data.parent).boundingBox({ includeNodes: true });
  // cy.elements().lock();

  cy.add({
    data: data,
    position: position
  });

  //if no position was given, position element randomly 
  if (position.x === 0 && position.y === 0) {
    let boundingBox;
    if (data.type === 'state') {
      boundingBox = parentBB;
    }
    else {
      boundingBox = cropViewport(cy.extent());
    }
    options.boundingBox = boundingBox;
    const layout = cy.layout(options);
    layout.run();
  }
  
  //复制状态的属性
  if(ele.type==='state' && ele.state!=undefined){
    const node = cy.getElementById(data.id)
    const MMRef = node.data('MMRef');
    MMRef.state = ele.state;
    MMRef.borderWidth = ele.borderWidth;
    node.data({ state: ele.state });
    node.data({ borderWidth: ele.borderWidth });
  }
  if(ele.background!=undefined){
    console.log(ele.background)
    const node = cy.getElementById(data.id)
    const MMRef = node.data('MMRef');
    MMRef.background = ele.background;
    node.data({ background: ele.background });
  }
  // cy.elements().unlock();

};


/**
 * Adding edge to master model as well as in the current diagram
 * @param cy - Cytoscape instance
 * @param data - Edge data
 * @param shouldPropagate - Whether the edge should be propagated to other diagrams
 * @returns 
 */
const addEdge = (cy: Core, data: EdgeData, shouldPropagate: boolean = false): EdgeSingular | null => {
  if (cy.getElementById(data.id).length > 0) {
    return null;
  }
  if (data['MMRef'] === null) {
    let modelEdge = new MMEdge(data['id'], data['source'], data['target'], data['type'], shouldPropagate);
    originalEdgeArray.addEdge(modelEdge);
    data['MMRef'] = modelEdge;
  }

  const addedEdge = cy.add({
    data: {
      ...data,
      source: data['source'].id,
      target: data['target'].id,
    }

  });
  return addedEdge;
};


/**
 * Actions to be done on addition of an element from context menu.
 * 从上下文菜单添加元素时要执行的操作。
 * @param cy - Cytoscape instance
 * @param event - Event object
 * @param type - Type of removed object
 * @param currentDiagram - Model node of current diagram
 */
const pasteNodeFromContextMenu = (cy: Core, event: any, type: NodeType, currentDiagram: DiagramTreeNode,id:any,essence:string,affiliation:string,ele:any) => {
  currentMMNode = currentDiagram.mainNode;
  let newType:String
  if(type === 'projectlock'){
    newType = 'project'
  }else if(type === 'objectParent'){
    newType = 'object'
  }else if(type === 'processParent' || type === 'processMax'){
    newType = 'process'
  }
  else{
    newType = type
  }
  const label = event.label
  let data: {  
    id: any; // 需要根据id的实际类型来设置  
    label: any; // 需要根据label的实际类型来设置  
    type: any; // 需要根据type的实际类型来设置  
    parent: any; // 需要根据event.parentId的实际类型来设置  
    target: any; // 使用联合类型来允许null值  
    MMRef: any; // 需要根据MMRef的实际类型来设置  
  } = {   
    id: id,  
    label: label,  
    type: newType,
    parent: event.parentId,  
    target: null, // 初始值设置为null  
    MMRef: null,  
  };
  let pos = event.position;
  let nodePosition = {
    x: pos.x + 200,
    y: pos.y + 200,
  };
  //节点内添加子节点
  if (data.parent!==null) { //on element
   const parentNode = cy.getElementById(data.parent)
   data.target = parentNode.data()
   addNode(cy, data, nodePosition, data.target.MMRef,ele);
   const node = cy.getElementById(data.id)
   const MMRef = node.data('MMRef');
   if(essence==='yes'){
    MMRef.essence = Essence.Physical;
    node.data({ labelWidth: node.width() + 1 });
   }
   if(affiliation=='dashed'){
    MMRef.affiliation = Affiliation.Environmental;
    node.data({ labelWidth: node.width() + 1 });
   }
  }
  else
    addNode(cy, data, nodePosition, currentMMNode,ele);
    const node = cy.getElementById(data.id)
    const MMRef = node.data('MMRef');
    if(essence==='yes'){
     MMRef.essence = Essence.Physical;
     node.data({ labelWidth: node.width() + 1 });
    }
    if(affiliation=='dashed'){
      MMRef.affiliation = Affiliation.Environmental;
      node.data({ labelWidth: node.width() + 1 });
     }
};

export {
  pasteNodeFromContextMenu,
  addEdge,
};

