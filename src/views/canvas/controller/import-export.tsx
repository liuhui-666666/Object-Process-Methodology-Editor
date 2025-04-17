/**  
 * @file Functions used when importing from JSON and exporting to JSON
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

// @ts-ignore
import { saveAs } from "file-saver";
import { replacer, reviver } from 'telejson';
import { ACTIONS, currentDiagram,reducerInitState } from "@/views/canvas/components/App";
import { cy } from "@/views/canvas/components/DiagramCanvas";
import { DiagramTreeNode, diagramTreeRoot, importDiagramTreeRoot } from '@/views/canvas/model/diagram-tree-model';
import { derivedEdgeArray, originalEdgeArray, EdgeArray, importEdgeArrays, MMEdge } from '@/views/canvas/model/edge-model';
import { importMMRoot, masterModelRoot, MMNode, MMRoot } from '@/views/canvas/model/node-model';
import { updateFromMasterModel } from "./diagram-switching";
import { eleCounter, ElementCounter } from './elementCounter';


/**
 * Resetting prototypes of master model nodes after importing
 * @param node
 */
const setMMNodePrototype = (node: MMNode) => {
  Object.setPrototypeOf(node, MMNode.prototype);
  for (const child of node.children) {
    setMMNodePrototype(child);
  }
};

/**
 * Resetting prototypes of diagram tree model nodes after importing
 * @param node
 */
const setDiagramTreeNodePrototype = (node: DiagramTreeNode) => {
  Object.setPrototypeOf(node, DiagramTreeNode.prototype);
  for (const child of node.children) {
    setDiagramTreeNodePrototype(child);
  }
};

/**
 * Resetting prototypes of all object in an imported JSON, including
 * node model, edge array, derived edge array, diagram tree model and
 * element counter
 * @param data - Object created from the imported JSON
 */
const setPrototypes = (data: any) => {
  Object.setPrototypeOf(data['originalEdgeArray'], EdgeArray.prototype);
  Object.setPrototypeOf(data['derivedEdgeArray'], EdgeArray.prototype);

  Object.setPrototypeOf(data['masterModelRoot'], MMRoot.prototype);
  Object.setPrototypeOf(data['eleCounter'], ElementCounter.prototype);

  for (const edge of data['originalEdgeArray'].edges) {
    Object.setPrototypeOf(edge, MMEdge.prototype);
  }

  for (const edge of data['derivedEdgeArray'].edges) {
    Object.setPrototypeOf(edge, MMEdge.prototype);
  }

  for (const node of data['masterModelRoot'].children) {
    setMMNodePrototype(node);
  }
  setDiagramTreeNodePrototype(data['diagramTreeRoot']);
};

/**
 * Set global variables of the main model objects
 * @param data - Object created from the imported JSON
 */
const setImportedModel = (data: any) => {
  importMMRoot(data['masterModelRoot']);
  importDiagramTreeRoot(data['diagramTreeRoot']);
  importEdgeArrays(data['originalEdgeArray'], data['derivedEdgeArray']);
  eleCounter.value = data['eleCounter'];
};

/**
 * Handle importing of JSON
 * Parse JSON, reset prototypes, update canvas and signal UI to update
 * @param stringJson - The imported JSON
 * @param dispatch - React reducer function to signal the UI to update after import
 */
export const importJson = (stringJson: any, dispatch: Function) => {
  // @ts-ignore
  const importedData = JSON.parse(stringJson as string, reviver({ allowClass: true, allowFunction: false }));
  setPrototypes(importedData);

  setImportedModel(importedData);
  cy.elements().remove();

  const diagramRoot = importedData['diagramTreeRoot'];
  delete diagramRoot.diagramJson.style
  cy.json(diagramRoot.diagramJson);
  updateFromMasterModel()

  // //递归处理
  // function removeNonMatchingChildren(diagramRoot:any) {
  //   // 首先，创建一个映射，以便快速检查NodeId是否存在于nodes中
  //   const nodesMap = new Map(diagramRoot.diagramJson.elements.nodes.map((node:any) => [node.data.id, true]));
  
  //   // 递归地对每个child的children进行相同的操作
  //   diagramRoot.children = diagramRoot.children.map((child:any )=> {
  //     // 检查child的NodeId是否存在于nodesMap中
  //     if ('NodeId' in child && nodesMap.has(child.NodeId)) {
  //       // 如果存在，并且child有children属性，则递归处理
  //       if (child.children.length>0) {
  //         removeNonMatchingChildren(child);
  //       }
  //       return child; // 返回处理后的child
  //     } else {
  //       console.log('不存在',child)
  //       // 如果child的NodeId不存在，则不返回，即移除该child
  //       return null;
  //     }
  //   }).filter((child:any) => child !== null); // 过滤掉null值，即移除不匹配的子节点
  // }
  // // 假设diagramRoot是已经定义好的图表根节点对象
  // removeNonMatchingChildren(diagramRoot);

  dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: diagramRoot });
  dispatch({ type: ACTIONS.UPDATE_TREE });
  reducerInitState.projectData = !reducerInitState.projectData
  dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: reducerInitState.projectData });
};

/**
 * Gather all main model objects, stringify them and save. For saving file explorer is invoked.
 * 收集所有主要模型对象，将其字符串化并保存。为了保存文件，调用资源管理器
 */
export const exportJson = () => {
  const json = cy.json()
  delete json.style;
  currentDiagram.diagramJson = json
  // json文件瘦身
  console.log(diagramTreeRoot,json)
  originalEdgeArray.edges = []
  derivedEdgeArray.edges = []
  function removeDeleteTrueNode(masterModelRoot:any) {
    masterModelRoot.children = masterModelRoot.children.filter((node:any)=>node.deleted == false)
    if(masterModelRoot.children.length>0){
      masterModelRoot.children.map((child:any)=>{
        removeDeleteTrueNode(child)
          if(child.diagram===null){
            return
          }
          if(child.diagram.parent===null){
            return
          }
          if(child.diagram.parent.diagramJson.elements.edges===undefined){
            return
          }
          child.diagram.parent.diagramJson.elements.edges.map((edge:any)=>{
            edge.data.MMRef.originalEdges = []
            edge.data.MMRef.derivedEdges = []
          })
      })
    }
  }
  removeDeleteTrueNode(masterModelRoot)
  function removeDeleteTrue(diagramJson:any){
    if(diagramJson.elements.edges===undefined){
      return
    }
    diagramJson.elements.edges.map((edge:any)=>{
      edge.data.MMRef.originalEdges = []
      edge.data.MMRef.derivedEdges = []

    })
    if(diagramJson.elements.nodes===undefined){
      return
    }
    diagramJson.elements.nodes.map((node:any)=>{
      if(node.data.MMRef===null){
        return
      }
      if(node.data.MMRef.diagram!=null){
        removeDeleteTrue(node.data.MMRef.diagram.diagramJson)
      }
    })
  }
  masterModelRoot.children.map((node:any)=>{
    if(node.diagram!=null){
      removeDeleteTrue(node.diagram.diagramJson)
    }
  })
  const data = {
      masterModelRoot: masterModelRoot,
      originalEdgeArray: originalEdgeArray,
      derivedEdgeArray: derivedEdgeArray,
      diagramTreeRoot: diagramTreeRoot,
      eleCounter: eleCounter.value,
    };
    //@ts-ignore
    const stringified = JSON.stringify(data, replacer({allowClass:true, allowFunction:false}))
    let blob = new Blob([stringified], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "graph.json");
}

export const exportOpmData = (opmName:string,data:string) =>{
  let blob = new Blob([data], {
    type: "text/plain;charset=utf-8"
  });
  const title = opmName + '.json'
  saveAs(blob, title);
}