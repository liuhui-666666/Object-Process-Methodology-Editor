/**  
 * @file Functions related to edges: creation, reconnection, derivation, propagation
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/
import { cy } from '@/views/canvas/components/DiagramCanvas';
import store from "@/store/index";
import { addNode } from './general';
import { pasteEdgeCreate } from './edge';
import {deleteNodeAndEdge} from './general'
import { Affiliation, Essence } from "@/views/canvas/model/node-model";
import {copyXorEdge} from '@/views/canvas/controller/copy-elements'
//global endpoints, set or unset by following functions

/**
 * Function to be invoked on edge create start event - right click and drag. 
 * The edge preview is handled by edgehandles extesion.
 * @param eh - Edgehandles extension instance
 * @param evt - Event object
 */
export const changeNodePosAndParent = (evt: any,currentDiagram:any,state:any,dispatch:Function) => {
    const selectedList = store.getState().selectedList;
    //选择单个节点时没有拖动选择节点的情况
    if(selectedList.length==1){
     const x = evt.position.x
     const y = evt.position.y
    if(selectedList[0]._private.bodyBounds!=null){
     const x1 = selectedList[0]._private.bodyBounds.x1
     const x2 = selectedList[0]._private.bodyBounds.x2
     const y1 = selectedList[0]._private.bodyBounds.y1
     const y2 = selectedList[0]._private.bodyBounds.y2
     if(x1>x||x2<x||y1>y||y2<y){
        return
     }
     //修复视图内节点label修改不成功问题
     if(selectedList[0].parent().data()!=undefined){
      if(selectedList[0].parent().data().type=='project'){
        return
       }
     }
    }
    }
    let nodes = selectedList.filter((t:any)=>t.group()==='nodes')
    nodes = nodes.filter((node:any)=>node.data().type!='edgePoint')
    nodes = nodes.filter((node:any)=>node.data().type!='corss')
    let edges = selectedList.filter((t:any)=>t.group()==='edges')
    edges = edges.filter((edge:any)=>edge.data().type!='异或边' || edge.data().type!=='且连线')
    const edgesCopy = edges.slice()
    const nodesCopy = nodes.slice()
    if(nodes.length>0){
    const hasProject = nodes.some((item:any) => {
        return item.data().type === 'project';
    });
    if(!hasProject){
    const projectNodes = cy.nodes().filter((node:any)=>node.data().type=='project')
    if(projectNodes.length>0 && projectNodes[0]._private.bodyBounds!=undefined){
    projectNodes.map((node:any)=>{
     //判断鼠标在哪个视图上方
     if(node._private.bodyBounds!=null){
        const x = evt.position.x
        const y = evt.position.y
        const x1 = node._private.bodyBounds.x1
        const x2 = node._private.bodyBounds.x2
        const y1 = node._private.bodyBounds.y1
        const y2 = node._private.bodyBounds.y2
        if(x1<x&&x2>x&&y1<y&&y2>y){
           evt.target = node
        }
     }
    })
    }
if(evt.target.length!=undefined && evt.target.data().type=='project'){
    //先删除所有边
    if(edgesCopy.length>0){
    edgesCopy.map((edge:any)=>{
        deleteNodeAndEdge(edge,dispatch)
    })
    }
    const nodesNoParent = nodes.filter((node:any)=>
        node.parent().length==0
    )
    const nodesHasParent = nodes.filter((node:any)=>
        node.parent().length!=0
    )
    nodesNoParent.map((node:any)=>{
       let parentNode = evt.target
       let data = {
           id: node.data().id,
           label: node.data().label,
           type: node.data().type,
           parent: parentNode.data().id,
           MMRef: null,
           borderWidth:node.data().borderWidth,
           state:node.data().state,
           background:node.data().background
       };
       let pos = node.position();
       let nodePosition = {
       x: pos.x,
       y: pos.y,
       };
        cy.remove(node)
        addNode(cy, data, nodePosition, parentNode.data('MMRef'));
        let curNode = cy.getElementById(data.id)
        if(node.data().MMRef.diagram!=null){
            curNode.data().MMRef.diagram  = node.data().MMRef.diagram
        }
        const MMRef = curNode.data('MMRef');
        if(node.data().essence==='yes'){
         MMRef.essence = Essence.Physical;
         curNode.data({ labelWidth: node.width() + 1 });
        }
        if(node.data().affiliation=='dashed'){
          MMRef.affiliation = Affiliation.Environmental;
          curNode.data({ labelWidth: node.width() + 1 });
         }
    })
    nodesHasParent.map((node:any)=>{
        const parentNode = cy.getElementById(node.data().parent)
        let data = {
            id: node.data().id,
            label: node.data().label,
            type: node.data().type,
            parent: node.data().parent,
            MMRef: null,
            borderWidth:node.data().borderWidth,
            state:node.data().state,
            background:node.data().background
        };
        let pos = node.position();
        let nodePosition = {
        x: pos.x,
        y: pos.y,
        };
        cy.remove(node)
        addNode(cy, data, nodePosition, parentNode.data('MMRef'));
     })
    let selectedEdges:any= []
    edges.map((ele:any)=>{
        const source = {
            id:ele.source().data().id,
            label:ele.source().data().label,
            type:ele.source().data().type,
            isStructurePart:false,
            isSubelementOfMain:false,
        } 
        const target = {
            id:ele.target().data().id,
            label:ele.target().data().label,
            type:ele.target().data().type,
            isStructurePart:false,
            isSubelementOfMain:false,
        }
        selectedEdges.push({
            edge:ele,
            id: ele.data().id,
            label: ele.data().label,
            type: ele.data().type,
            MMRef: null,
            source: source,
            target: target,
        })
    })
    selectedEdges.map((item:any)=>{
     const type = item.type
     pasteEdgeCreate(item,type,state,currentDiagram.current)
    })
    store.dispatch({type:'selectedList' , data: []});
    setTimeout(()=>{
        copyXorEdge(cy,currentDiagram,state)
      },10)
    }
  }
 }
};

