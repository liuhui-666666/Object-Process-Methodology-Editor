/**  
 * @file Functions used when importing from JSON and exporting to JSON
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Core, EdgeSingular, NodeSingular } from "cytoscape";
import { ACTIONS,reducerInitState } from "@/views/canvas/components/App";
import { DiagramTreeNode } from "@/views/canvas/model/diagram-tree-model";
import { derivedEdgeArray, EdgeArray, EdgeType, hierarchicalStructuralEdges, MMEdge, originalEdgeArray } from '@/views/canvas/model/edge-model';
import { masterModelRoot, MMNode, MMRoot, NodeType } from "@/views/canvas/model/node-model";
import { eleCounter } from './elementCounter';
import {cy} from '@/views/canvas/components/DiagramCanvas'
import {removeSorAndTar} from '@/views/canvas/controller/xorGeneral'
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
const addNode = (cy: Core, data: any, position = { x: 0, y: 0 }, parentMMNode: any) => {
  if (cy.getElementById(data.id).length > 0) {
    return;
  }
  data['label'] = data['label'].charAt(0).toUpperCase() + data['label'].substring(1).toLowerCase();
  if (data['MMRef'] === null) {
    let modelNode = new MMNode(data['id'], data['type'], data['label']);
    parentMMNode.addChild(modelNode);
    //选择节点添加视图后添加节点激活属性和状态属性
    data['MMRef'] = modelNode;
    data['MMRef'].borderWidth = data['borderWidth']
    data['MMRef'].state = data['state']
    data['MMRef'].background = data['background']
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

const addEdgeChange = (cy: Core, data: EdgeData, shouldPropagate: boolean = false): EdgeSingular | null => {
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
      source: data['source'].id + 'i',
      target: data['target'].id + 'i',
    }

  });
  return addedEdge;
};
/**
 * Actions to be done on removal of a node from context menu.
 * @param node - Cytoscape node
 * @param dispatch - React reducer function to update UI (when main node of a diagram is deleted, 
 *    it has to be removed from the diagram tree) 
 * React reducer函数用于更新UI（当图表的主节点被删除时，
 *它必须从图表树中删除
 */
const removeNodeContextMenu = (node: NodeSingular, dispatch: Function) => {
  const MMRef = node.data('MMRef') as MMNode;
  if(MMRef==null){
    return
  }
  if (MMRef.diagram !== null) {
    const diagram = MMRef.diagram;
    diagram.parent?.removeChild(diagram);
    dispatch({ type: ACTIONS.UPDATE_TREE });
  }

  MMRef.deleted = true;
  node.data({ 'MMRef': null });

  for (const childNode of MMRef.children) {
    if (childNode.type === 'state') {
      childNode.deleted = true;
    }
  }

  //mark connected edges as removed 将连接的边标记为已删除
  for (const connectedEdge of node.connectedEdges().toArray()) {
    const edgeMMRef = connectedEdge.data('MMRef');
    MMRef.deleted = true;
    originalEdgeArray.removeEdge(edgeMMRef);
    if (edgeMMRef.originalEdges.length) {
      originalEdgeArray.removeOriginalEdges(edgeMMRef.originalEdges);
    }
    else {
      originalEdgeArray.removeEdge(edgeMMRef);
      if(edgeMMRef.derivedEdges.length>0){
        if (typeof edgeMMRef.removeAllDerived === 'function') {
          edgeMMRef.removeAllDerived();
        } else {
          console.warn("edge.removeAllDerived is not a function:", edgeMMRef);
        }
      }
    }
    connectedEdge.data({ 'MMRef': null });
  }
 setTimeout(()=>{
  reducerInitState.projectData = !reducerInitState.projectData
  dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: reducerInitState.projectData });
 },10)
};

/**
 * Actions to be done on removal of an edge from context menu.
 * 从关联菜单中删除边时要执行的操作。
 * @param edge - Cytoscape edge
 */
const removeEdgeContextMenu = (edge: EdgeSingular) => {
  const MMRef = edge.data('MMRef') as MMEdge;
  if(MMRef==null){
    return
  }
  if (MMRef.originalEdges.length) {
    originalEdgeArray.removeOriginalEdges(MMRef.originalEdges);
    for (const edge of MMRef.originalEdges) {
      if (typeof edge.removeAllDerived === 'function') {
        edge.removeAllDerived();
      } else {
        console.warn("edge.removeAllDerived is not a function:", edge);
      }
    }
  }
  else {
    originalEdgeArray.removeEdge(MMRef);
    if(MMRef.derivedEdges.length>0){
      if (typeof MMRef.removeAllDerived === 'function') {
        MMRef.removeAllDerived();
      } else {
        console.warn("MMRef.removeAllDerived is not a function:", MMRef);
      }
    }
  }

  edge.data({ 'MMRef': null });
};

/**
 * Actions to be done on addition of an element from context menu.
 * 从上下文菜单添加元素时要执行的操作。
 * @param cy - Cytoscape instance
 * @param event - Event object
 * @param type - Type of removed object
 * @param currentDiagram - Model node of current diagram
 */
const addNodeFromContextMenu = (cy: Core, event: any, type: NodeType, currentDiagram: DiagramTreeNode) => {
  currentMMNode = currentDiagram.mainNode;
  const counter = eleCounter.value;
  let nodeName:any
  if(type==="object"){
    nodeName="对象"
  }else if(type==="process"){
    nodeName="过程"
  }else if(type==="state"){
    nodeName="状态"
  }else if(type==="remark"){
    nodeName="备注"
  }else{
    nodeName="视图"
  }
  const defaultLabel = [nodeName + " " + counter];
  let data = {
    id: counter,
    label: defaultLabel[0],
    type: type,
    parent: '',
    MMRef: null,
  };

  let pos = event.position;
  let nodePosition = {
    x: pos.x,
    y: pos.y,
  };
  //节点内添加子节点
  if (event.target !== cy) { //on element
    data['parent'] = event.target.id() as string;
    addNode(cy, data, nodePosition, event.target.data('MMRef'));
  }
  else
    addNode(cy, data, nodePosition, currentMMNode);
};

/**
 * Copying of in-zoomed process and addition of placehoder subprocesses
 * 复制放大的流程并添加占位符子流程
 * @param cy - Cytoscape instance
 * @param event - Event object
 */
const addInzoomedNodes = (cy: Core, event: any) => {
  let inzoomedNode = event.target;
  let type = inzoomedNode.data('type') as NodeType;
  let parentId = inzoomedNode.id() as string;

  const viewport = cy.extent();
  const centerX = (viewport.x1 + viewport.x2) / 2;
  const centerY = (viewport.y1 + viewport.y2) / 2;
  if(inzoomedNode.data().type==='processParent' || inzoomedNode.data().type==='processMax'){
    inzoomedNode.data().type='process'
  }
  // add inzoomed node to new diagram 将放大的节点添加到新图表
  addNode(cy, inzoomedNode.data(), { x: centerX, y: centerY }, currentMMNode);

  let MMRef = inzoomedNode.data('MMRef') as MMNode;
  // add 2 default subnodes默认加了两个子节点
  let counter = eleCounter.value;
  let nodeName:any
  if(type==="object"){
    nodeName="对象"
  }else if(type==="process"){
    nodeName="过程"
  }else if(type==="state"){
    nodeName="状态"
  }else if(type==="remark"){
    nodeName="备注"
  }else if(type==="processParent" || type==="processMax"){
    type = 'process' as NodeType;
    nodeName="过程"
  }else{
    nodeName="视图"
  }
  let data = {
    id: counter,
    label: nodeName + ' ' + counter,
    parent: parentId,
    type: type,
    MMRef: null
  };
  addNode(cy, data, { x: centerX - 10, y: centerY + 10 }, MMRef);

  counter = eleCounter.value;
  let nodeName1:any
  if(type==="object"){
    nodeName1="对象"
  }else if(type==="process"){
    nodeName1="过程"
  }else if(type==="state"){
    nodeName1="状态"
  }else if(type==="remark"){
    nodeName1="备注"
  }else if(type==="processParent" || type==="processMax"){
    type = 'process' as NodeType;
    nodeName1="过程"
  }else{
    nodeName1="视图"
  }
  data = {
    id: counter,
    label: nodeName1 + ' ' + counter,
    parent: parentId,
    type: type,
    MMRef: null
  };
  addNode(cy, data, { x: centerX + 10, y: centerY - 10 }, MMRef);

};

/**
 * Get connected edges to a given master model node 获取到给定主模型节点的连接边
 * @param MMNode - Master model node
 * @param array - Original edge array or derived edge array
 * @returns - Array of master model edges connected to the given node
 */
const getConnectedEdges = (MMNode: MMNode, array: EdgeArray): Array<MMEdge> => {
  let connectedEdges = array.findIngoingEdges(MMNode);
  connectedEdges = connectedEdges.concat(array.findOutgoingEdges(MMNode));
  return connectedEdges;
};

/**
 * Determine wheter given element is present and visible in the current diagram.
 * 确定给定元素在当前图表中是否存在和可见。
 * @param cy - Cytoscape instance
 * @param id - element id
 * @returns - True if exists on current diagram and is not hidden, else false
 */
const eleAlreadyInAndVisible = (cy: Core, id: string): boolean => {
  const ele = cy.getElementById(id);
  const result = ele.length > 0 && ele.data('display') !== 'none';
  return result;
};

/**
 * Create node data for the cytoscape node
 * @param node - Master model node
 * @returns: Data object
 */
const createCytoNodeData = (node: MMNode): any => {
  return {
    id: node.id,
    MMRef: node,
    label: node.label,
    type: node.type,
  };
};

/**
 * Create edge data for the cytoscape edge
 * @param edge - Master model node
 * @returns: Data object
 */
const createCytoEdgeData = (edge: MMEdge): any => {
  let label = edge.label;
  if (edge.originalEdges.length)
    label = edge.originalEdges[0].label;

  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    MMRef: edge,
    label: label,
    type: edge.type
  };
};

/**
 * Determine if the given derived edge should be skipped (because a more specific one could be added instead)
 * 确定是否应跳过给定的派生边（因为可以添加更具体的边）
 * @param cy - Cytoscape instance
 * @param edge - Master model edge
 * @returns - True if should be skipped, false if not
 */
const skipDerivedEdge = (cy: Core, edge: MMEdge): boolean => {
  if (edge.preferedEdge !== null) {
    const sourceId = edge.preferedEdge.source.id;
    const targetId = edge.preferedEdge.target.id;
    if (eleAlreadyInAndVisible(cy, sourceId) && eleAlreadyInAndVisible(cy, targetId))
      return true;
  }
  //@ts-ignore
  for (const diagramEdge of cy.edges()) {
    const originalEdges = diagramEdge.data('MMRef').originalEdges;
    if (originalEdges.length > 1) {
      for (const origEdge of originalEdges) {
        if (eleAlreadyInAndVisible(cy, origEdge.id))
          return true;
      }
    }
  }
  return false;
};

const derivedAlreadyIn = (cy: Core, edge: MMEdge): boolean => {
  for (const derived of edge.derivedEdges) {
    if (cy.getElementById(derived.id).data('MMRef') === derived) {
      return true;
    }
  }
  // @ts-ignore
  for (const diagramEdge of cy.edges()) {
    if (diagramEdge.data('MMRef').preferedEdge == edge)
      return true;
  }
  return false;
};

/**
 * Add an array of edges to given node
 * @param cy - Cytoscape instance
 * @param MMNode - Given master model node
 * @param edges - Array of master model edges
 */
const addEdgeArray = (cy: Core, MMNode: MMNode, edges: Array<MMEdge>) => {
  for (const edge of edges) {
    if (eleAlreadyInAndVisible(cy, edge.id) ||
      edge.source.deleted || edge.target.deleted ||
      edge.propagation == false) {
      continue;
    }

    if (edge.originalEdges.length > 0 && skipDerivedEdge(cy, edge))
      continue;

    if (derivedAlreadyIn(cy, edge))
      continue;

    let connectedNode;
    if (MMNode === edge.source)
      connectedNode = edge.target;
    else
      connectedNode = edge.source;

    if (!eleAlreadyInAndVisible(cy, connectedNode.id)) {
      let parent = connectedNode.parent as MMNode;
      const nodeData = createCytoNodeData(connectedNode);

      if (connectedNode.type === 'state') {
        nodeData['parent'] = parent ? parent.id : null;
        if (!eleAlreadyInAndVisible(cy, parent.id)) {
          const nodeParentData = createCytoNodeData(parent);
          addNode(cy, nodeParentData, { x: 0, y: 0 }, currentMMNode);
        }
      }
      addNode(cy, nodeData, { x: 0, y: 0 }, parent);
    }

    const edgeData = createCytoEdgeData(edge);
    addEdge(cy, edgeData);
  }
};

/**
 * Add connected edge after selecting it from the Bring Connected selection 从“连接”选择中选择连接边后添加连接边
 * @param cy - Cytoscape instance
 * @param edge - Selected edge
 * @param targetNode - Node that the Bring Connected was invoked on
 */
const bringConnectedEdge = (cy: Core, edge: MMEdge, targetNode: MMNode) => {
  let connectedNode;
  if (targetNode === edge.source)
    connectedNode = edge.target;
  else
    connectedNode = edge.source;

  const diagramEdge = cy.getElementById(edge.id);
  if (diagramEdge.length > 0 && diagramEdge.data('display') == 'none') {
    diagramEdge.remove();
  }
  const cyConnectedNode = cy.getElementById(connectedNode.id)
  cyConnectedNode.data({ display: 'element' });
  if (connectedNode.type === 'state'){
    //@ts-ignore
    const parent = connectedNode.parent as MMNode
    cyConnectedNode.move({parent: parent.id})
    const cyParentNode = cy.getElementById(parent.id)
    cyParentNode.data({ display: 'element' });
  }

  cy.getElementById(edge.id).data({ display: 'element' });

  if (!eleAlreadyInAndVisible(cy, connectedNode.id)) {
    let parent = connectedNode.parent as MMNode;
    const nodeData = createCytoNodeData(connectedNode);

    if (connectedNode.type === 'state') {
      nodeData['parent'] = parent ? parent.id : null;
      if (!eleAlreadyInAndVisible(cy, parent.id)) {
        const nodeParentData = createCytoNodeData(parent);
        addNode(cy, nodeParentData, { x: 0, y: 0 }, currentMMNode);
      }
    }
    addNode(cy, nodeData, { x: 0, y: 0 }, parent);
  }

  const edgeData = createCytoEdgeData(edge);
  addEdge(cy, edgeData);
};

/**
 * Find connected edges from the master model and connect them. 从主模型中查找连接的边并将它们连接起来。
 * @param cy - Cytoscape instance
 * @param MMNode - Master model node to which elements are connected to
 */
const addConnectedNodes = (cy: Core, MMNode: MMNode) => {
  let connectedOriginalEdges = getConnectedEdges(MMNode, originalEdgeArray);
  let connectedStructuralEdges = connectedOriginalEdges.filter((edge) => hierarchicalStructuralEdges.includes(edge.type));
  let connectedDerivedEdges = getConnectedEdges(MMNode, derivedEdgeArray);
  addEdgeArray(cy, MMNode, connectedStructuralEdges);
  addEdgeArray(cy, MMNode, connectedDerivedEdges);
  addEdgeArray(cy, MMNode, connectedOriginalEdges);
};

/** 
 * Adding connected nodes to just inzoomed node, original edges are prefered.
 * 将连接的节点添加到刚刚放大的节点，则首选原始边。
 * @param cy - Cytoscape instance
 * @param MMNode - In-zoomed master model node
 */
const addConnectedNodesInzoom = (cy: Core, MMNode: MMNode) => {
  let connectedOriginalEdges = getConnectedEdges(MMNode, originalEdgeArray);
  let connectedDerivedEdges = getConnectedEdges(MMNode, derivedEdgeArray);
  addEdgeArray(cy, MMNode, connectedOriginalEdges);
  addEdgeArray(cy, MMNode, connectedDerivedEdges);
};

const getAllConnectedEdges = (cy: Core, node: MMNode): Array<MMEdge> => {
  const connectedOriginalEdges = getConnectedEdges(node, originalEdgeArray);
  const connectedDerivedEdges = getConnectedEdges(node, derivedEdgeArray);
  const allConnected = connectedOriginalEdges.concat(connectedDerivedEdges);
  const filteredConnected = allConnected.filter((edge) => {
    let connectedNode;
    if (node === edge.source)
      connectedNode = edge.target;
    else
      connectedNode = edge.source;

    let result = false;
    //连线报错
    // if (!eleAlreadyInAndVisible(cy, edge.id) ||
    //   !eleAlreadyInAndVisible(cy, connectedNode.id))
    //   result = true;
    // if (connectedNode.isSubelementOfMain && !eleAlreadyInAndVisible(cy, connectedNode.id))
    //   result = false;
    return result;
  });

  return filteredConnected;
};
/**
 * Find all states of the given node and add them into the current diagram
 * 查找给定节点的所有状态，并将它们添加到当前图表中
 * @param cy - Cytoscape instance
 * @param node - Cytoscape node
 */
const bringAllStates = (cy: Core, node: NodeSingular) => {
  const MMRef = node.data('MMRef');
  for (const child of MMRef.children) {
    if (child.type === 'state') {
      const data = {
        id: child.id,
        label: child.label,
        type: NodeType.State,
        MMRef: child,
        parent: MMRef.id
      };
      let cyNode = cy.getElementById(child.id);
      if (cyNode.length > 0) {
        cyNode.move({ parent: MMRef.id }); //move out of the compound node so when no children are displayed, the parent node is no longer compound 移出复合节点，这样当没有显示子节点时，父节点就不再是复合节点
        cyNode.data({ display: 'element' });
      }
      else {
        addNode(cy, data, { x: 0, y: 0 }, MMRef);
      }
    }
  }
};

const removeNode = (target:any,dispatch:Function) =>{
    removeXorEdge(target,dispatch)
    if (target.isNode()) {
      removeNodeContextMenu(target, dispatch); //临时隐藏
    }
    else if (target.isEdge()) {
      removeEdgeContextMenu(target);//临时隐藏
    }
    target.remove();
}
const deleteNodeAndEdge =(target:any,dispatch:Function) =>{
  const xorEdges = cy.elements().filter((edge:any)=>edge.data().type==='异或边' || edge.data().type==='且连线')
  xorEdges.map((edge:any)=>{
    const regex = /(?:source|target|node)(\d+i*)/g
    let numbers = [];
        let match;
        while ((match = regex.exec(edge.data().id)) !== null) {
          // match[1] 是捕获组，即 source, node, edge 后面的数字和任意数量的i
          numbers.push(match[1]); // 将捕获的数字和任意数量的i添加到数组中
        }
    //异或边的起始边和终边的终点或起点id
    numbers.push(
      edge.data().source.slice(7),
      edge.data().target.slice(7)
    )
    numbers.map((id:string)=>{
      if(id == target.data().id){
        removeSorAndTar(edge,dispatch)
      }
    })
  })
  if(target._private.children.length!=0){
    //先移除子节点
    const nodesToRemove = target._private.children.slice();
    for(let i=0;i<nodesToRemove.length;i++){
      removeNode(nodesToRemove[i],dispatch)
    }
    //移除父节点
    removeNode(target,dispatch)
    //移除父节点
    }else{
    removeNode(target,dispatch)
   }
}

const removeXorEdge = (target:any,dispatch:Function) => {
  const xorList = cy.elements().filter((edge:any)=>edge.data().type==='异或边' || edge.data().type==='且连线')
  const id = target.data().id
  if(target.isEdge()){
    xorList.map((edge:any)=>{
     const sId = edge.data().source.slice(7)
     const tId = edge.data().target.slice(7)
     if(id==sId||id==tId){//此连接线位于该边上，移除异或连接线
      removeSorAndTar(edge,dispatch)
     }
    })
  }else{
   const edges = target._private.edges
   edges.map((item:any)=>{
   const id = item.data().id
   xorList.map((edge:any)=>{
      const sId = edge.data().source.slice(7)
      const tId = edge.data().target.slice(7)
      if(id==sId||id==tId){//此连接线位于该边上，移除异或连接线
       removeSorAndTar(edge,dispatch)
      }
     })
   })
  }
}

const disbandProject = (target:any) => {
  console.log(target,target.children())
  target.children().map((child:any)=>{
    child.move({ parent: null });
  })
  target.remove()
}
export {
  addNodeFromContextMenu,
  addInzoomedNodes,
  addConnectedNodesInzoom,
  addConnectedNodes,
  addEdge,
  removeNodeContextMenu,
  removeEdgeContextMenu,
  eleAlreadyInAndVisible,
  getAllConnectedEdges,
  bringAllStates,
  createCytoEdgeData,
  bringConnectedEdge,
  addNode,
  deleteNodeAndEdge,
  removeNode,
  removeXorEdge,
  addEdgeChange,
  disbandProject
};

