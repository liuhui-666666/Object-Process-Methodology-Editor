// @ts-nocheck
/**  
 * @file Diagram canvas handled by the Cytoscape.js library. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import cytoscape from 'cytoscape';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import coseBilkent from 'cytoscape-cose-bilkent';
import edgehandles from 'cytoscape-edgehandles';
import popper from 'cytoscape-popper';
import pdf from 'cytoscape-pdf-export';
import React, { useEffect, useRef,useContext,useState } from 'react';
import { edgeCreateDragOutOfElement, edgeCreateDragOverElement, edgeCreateStart, edgeCreateStop, edgeCreateValidate } from '@/views/canvas/controller/edge';
import { changeNodePosAndParent } from '@/views/canvas/controller/changeElements'
import { nodeParentInfo } from '@/views/canvas/controller/node';
import { addConnectedNodesInzoom, addInzoomedNodes, addNodeFromContextMenu, bringAllStates,
removeEdgeContextMenu, removeNodeContextMenu,deleteNodeAndEdge,removeXorEdge,disbandProject } from '@/views/canvas/controller/general';
import { edgeLabelEditingPopup, nodeLabelEditingPopup } from '@/views/canvas/controller/tippy-elements';
import '@/css/general.css';
import { DiagramTreeNode } from '@/views/canvas/model/diagram-tree-model';
import { Affiliation, Essence } from "@/views/canvas/model/node-model";
import { eeDefaults } from '@/views/canvas/options/cytoscape-edge-editing-defaults';
import { ehDefaults } from '@/views/canvas/options/cytoscape-edge-handles-defaults';
import { cyStylesheet } from '@/views/canvas/options/cytoscape-stylesheet';
// import { naDefaults} from '../options/cytoscape-navigation-handles-defaults'
import { ACTIONS, PropagationEnum, useReducerProps } from '@/views/canvas/components/App';
import { switchDiagrams,updateFromMasterModel } from '@/views/canvas/controller/diagram-switching';
import store from "@/store/index";
import {copyElements,deleteElements,cutElements,copyXorEdge} from '@/views/canvas/controller/copy-elements'
import {reducerInitState} from '@/views/canvas/components/App'
import {ExclamationCircleFilled} from '@ant-design/icons';
import { Modal,Drawer,Button } from 'antd';
import { MMNode } from '@/views/canvas/model/node-model';
// 隐藏风格切换功能
// import {changeStyle} from '@/controller/changeStyle'
import {removeSorAndTar,addExcOR} from '@/views/canvas/controller/xorGeneral'
import {crosspoint,computedSelectEles,updateXor} from '@/views/canvas/controller/corsspoint'
import { WebSocketContext } from "@/service/WebSocketContent";
import emitter from '@/utils/emiiter';
var $ = require('jquery');
var konva = require('konva');
const contextMenus = require('cytoscape-context-menus');
var edgeEditing = require('cytoscape-edge-editing');
const nodeEditing = require('cytoscape-node-editing');
var navigator = require('cytoscape-navigator');
window.$ = $;

//extension registration
contextMenus(cytoscape, $);
edgeEditing(cytoscape, $, konva);
nodeEditing(cytoscape, $, konva);
// navigator(cytoscape, $, konva);

cytoscape.use(edgehandles);
cytoscape.use(popper);
cytoscape.use(coseBilkent);
cytoscape.use(pdf);
let cy: Core;

const DiagramCanvas: React.FC<useReducerProps> = ({ state, dispatch }) => {
  //workaround
  const currentDiagram = useRef();
  currentDiagram.current = state.currentDiagram;
  const propagation = useRef();
  propagation.current = state.propagation;
  const { confirm } = Modal;
  const registerEdgeEventHandlers = (cy: Core) => {

    let eh = cy.edgehandles(ehDefaults);

    //edge creation events
    cy.on('cxttapstart', 'node', (evt: Event) => {
      edgeCreateStart(eh, evt);
      const target = evt.target
      let hasSelectChildren = false
      let parenthasSelectChildren = false
      if(target.parent()!=undefined && target.parent().data()!=undefined){
        if(target.parent().data().type==='project' || target.parent().data().type==='projectlock')
        target.parent().children().map(node=>{
          if(node.selected()){
            let selectChidren = target.parent().children().filter(ele=>ele.selected())
            store.dispatch({type:'selectChidren' , data: selectChidren});
            parenthasSelectChildren = true
          }
        })
      }
      if(target.data().type==='project' || target.data().type==='projectlock'){
        target.children().map(node=>{
          if(node.selected()){
            let selectChidren = target.children().filter(ele=>ele.selected())
            store.dispatch({type:'selectChidren' , data: selectChidren});
            hasSelectChildren = true
          }
        })
      }
      //视图
      if(hasSelectChildren){
        changeMoveout(true)
        //视图内的子节点
      }else if(parenthasSelectChildren){
        changeMoveout(true)
        //视图外节点
      }else{
        changeMoveout(false)
      }
    });

    cy.on('cxttapend', 'node', (evt: Event) => {
      edgeCreateStop(eh);
    });

    cy.on('cxtdragover', 'node', (evt: Event) => {
      edgeCreateDragOverElement(evt);

    });
    cy.on('cxtdragout', 'node', (evt: Event) => {
      edgeCreateDragOutOfElement(evt);
    });

    cy.on('ehstop', (evt: Event,) => {
      const callback = () => dispatch({ type: ACTIONS.EDGE_TYPE_SELECTION, payload: true });
      edgeCreateValidate(callback);
    });

    cy.on('tap', 'node,edge', (event: Event) => {
      if(event.target.data().type==='异或边' || event.target.data().type==='且连线' 
      || event.target.data().type === 'edgePoint'||event.target.data().type === 'corss'){
       setTimeout(()=>{
        event.target.unselect()
       },10)
      }
    });

    //监听节点选择事件
    cy.on('select', 'node,edge', function(event) {
      // changeStyle()
      const tippyState = store.getState().tippyState;
      if(tippyState===false){
        const elements = cy.elements()
        const selectedList = elements.filter(el => el.selected()); 
        store.dispatch({type:'selectedList' , data: selectedList});
        const edgesList = selectedList.filter(t=>t.group()==='edges')
        store.dispatch({type:'edgesList' , data: edgesList});
        let nodesList =selectedList.filter(t=>t.group()==='nodes'&&t.children().length!==0)
        selectedList.map(t=>{
          if(t.group()==='nodes'&&t.children().length === 0){
            nodesList.push(t)
          }
        })
        nodesList.map(node=>{
          node.data().essence = node.data().MMRef.essence
          node.data().affiliation = node.data().MMRef.affiliation
        })
        store.dispatch({type:'nodesList' , data: nodesList});
        //存储父节点信息
        nodeParentInfo()
        localStorage.setItem('copy',false)
      }
      let xorEdges = cy.elements().filter(el => el.selected()); 
      xorEdges = xorEdges.filter((edge:any)=>edge.data().type=='异或边' || edge.data().type=='且连线')
      let sXorIdList = []
      xorEdges.map((edge:any)=>{
       const num =edge.data().id.slice(7,8)
       let distance = 10
       if(num==2){
        distance = 20
       }
       let direction = 'sameSource'
       if(edge.data().target.slice(5,6)==='T'){
        direction = 'sameTarget'
       }
       const regex = /(?:edge)(\d+i*)/g;
        let numbers = [];
        let match;
        while ((match = regex.exec(edge.data().id)) !== null) {
          // match[1] 是捕获组，即 source, node, edge 后面的数字和任意数量的i
          numbers.push(match[1]); // 将捕获的数字和任意数量的i添加到数组中
        }
        const regex1 = /(?:source|target)(\d+i*)/g;
        let numbers1 = [];
        let match1;
        while ((match1 = regex1.exec(edge.data().id)) !== null) {
          // match[1] 是捕获组，即 source, node, edge 后面的数字和任意数量的i
          numbers1.push(match1[1]); // 将捕获的数字和任意数量的i添加到数组中
        }
       sXorIdList.push(
        {
        num:num,
        target:numbers1[0],
        distance:distance,
        direction:direction,
        numbers:numbers,
        type:edge.data().type
      }
      )
      })
      store.dispatch({type:'sXorIdList' , data: sXorIdList});
    });
    
    // 监听节点取消选中事件
    cy.on('unselect', 'node,edge', function(event) {
      // changeStyle()
      store.dispatch({type:'tippyState' , data: false});
      const elements = cy.elements()
      const selectedList = elements.filter(el => el.selected()); 
      store.dispatch({type:'selectedList' , data: selectedList});
      const edgesList = selectedList.filter(t=>t.group()==='edges')
      store.dispatch({type:'edgesList' , data: edgesList});
      let nodesList =selectedList.filter(t=>t.group()==='nodes'&&t.children().length!==0)
      selectedList.map(t=>{
        if(t.group()==='nodes'&&t.children().length === 0){
          nodesList.push(t)
        }
      })
      store.dispatch({type:'nodesList' , data: nodesList});
    });
    cy.on('mousedown',(evt)=>{    
      console.log('down',evt.target)
      let xorIdList = []
      localStorage.setItem('xorIdList',JSON.stringify(xorIdList))
      //计算被选择的节点
      computedSelectEles(evt.target,dispatch)
    })
    cy.on('mouseup',(evt)=>{
      changeNodePosAndParent(evt,currentDiagram,state,dispatch)
      updateXor(state,dispatch)
      updateFromMasterModel()
    })
    cy.on('add', (event) => {
      // changeStyle()
    })
    cy.on('drag', 'node',(event) => {
    })
    cy.on('cxttap','node',(event)=>{
        showActivation(event.target)
    })
    //增加导航窗口
    // cy.on('add', function(event) {
      // if (!cy.elements().empty()) {
      //   var hasNavigatorByClass = document.querySelector('.cytoscape-navigator') !== null;
      //   if(!hasNavigatorByClass){
      //     cy.navigator( naDefaults );
      //   }
      // } 
    // });
    //移除导航窗口
    // cy.on('remove', function(event) {
      // if (cy.elements().empty()) {
      //   $('.cytoscape-navigator').remove();
      // }
    // });
  };

  const registerPopperHandlers = (cy: Core) => {
    nodeLabelEditingPopup(cy,dispatch);
    edgeLabelEditingPopup(cy,state);
  };
  let instance
  const registerContextMenu = (cy: Core) => {
     instance = cy.contextMenus({
      menuItems: [
        // {
        //   id: 'hide',
        //   // content: 'Hide',
        //   content: '隐藏',
        //   selector: 'node, edge',
        //   onClickFunction: function (event) {
        //     const target = event.target;
        //     target.data({ lastParent: target.data('parent')});
        //     target.move({ parent: null });
        //     target.data({ display: 'none' });
        //     for (const child of target.children()){
        //       child.data({ display: 'none' });
        //     }
        //   },
        // },
        {
          id: 'in-zoom',
          content: '展开',
          selector: 'node[type = "process"]node:childless,node[type = "object"]node:childless,node[type = "objectParent"]node:childless,node[type = "processParent"]node:childless',
          onClickFunction: function (event) {
            var target = event.target;
            let nextDiagram;
            const MMReference = target.data('MMRef');
            if (nextDiagram = MMReference.diagram) { //already inzoomed
              currentDiagram.current.diagramJson = cy.json();
              cy.elements().remove();
              delete nextDiagram.diagramJson.style;
              cy.json(nextDiagram.diagramJson);
              dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: nextDiagram });
              dispatch({ type: ACTIONS.CHANGE_TREEDIAGRAM, payload: nextDiagram });
              reducerInitState.projectData = !reducerInitState.projectData
              dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: reducerInitState.projectData });
              return;
            }
            //对象展开后加粗
            if(target.data().type==='object'){
              target.data().type='objectParent'
            }
            //过程展开后加粗
            if(target.data().type==='process'){
              target.data().type='processParent'
            }
            currentDiagram.current.diagramJson = cy.json();
            cy.elements().remove();
            nextDiagram = new DiagramTreeNode('', MMReference); //change counter, remove?
            MMReference.diagram = nextDiagram;
            currentDiagram.current.addChild(nextDiagram);

            if (propagation.current !== PropagationEnum.None)
              addConnectedNodesInzoom(cy, MMReference);

            dispatch({ type: ACTIONS.INZOOM_DIAGRAM, payload: nextDiagram });
            // updateFromMasterModel()
            reducerInitState.projectData = !reducerInitState.projectData
            dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: reducerInitState.projectData });
            dispatch({ type: ACTIONS.CHANGE_TREEDIAGRAM, payload: nextDiagram });
          },
          hasTrailingDivider: true
        },
        {
          id: 'in-max',
          content: '放大',
          selector: 'node[type = "process"]node:childless,node[type = "processMax"]node:childless',
          onClickFunction: function (event) {
            var target = event.target;
            let nextDiagram;
            const MMReference = target.data('MMRef');
            if (nextDiagram = MMReference.diagram) { //already inzoomed
              currentDiagram.current.diagramJson = cy.json();
              cy.elements().remove();
              delete nextDiagram.diagramJson.style;
              cy.json(nextDiagram.diagramJson);
              dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: nextDiagram });
              dispatch({ type: ACTIONS.CHANGE_TREEDIAGRAM, payload: nextDiagram });
              reducerInitState.projectData = !reducerInitState.projectData
              dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: reducerInitState.projectData });
              return;
            }
            //过程展开后加粗
            target.data().type='processMax'
            currentDiagram.current.diagramJson = cy.json();
            cy.elements().remove();
            nextDiagram = new DiagramTreeNode('', MMReference); //change counter, remove?
            MMReference.diagram = nextDiagram;
            currentDiagram.current.addChild(nextDiagram);
              addInzoomedNodes(cy, event);
            if (propagation.current !== PropagationEnum.None)
              addConnectedNodesInzoom(cy, MMReference);

            dispatch({ type: ACTIONS.INZOOM_DIAGRAM, payload: nextDiagram });
            // updateFromMasterModel()
            reducerInitState.projectData = !reducerInitState.projectData
            dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: reducerInitState.projectData });
            dispatch({ type: ACTIONS.CHANGE_TREEDIAGRAM, payload: nextDiagram });
          },
          hasTrailingDivider: true
        },
        {
          id: 'return',
          content: '返回',
          coreAsWell: true,
          selector: '$node > node[type != "state"],node[type = "project"],node[type = "projectlock"]',
          onClickFunction: function (event) {
            let nextDiagram = getDiagramJson(store.getState().treeData)
            let currentDiagram = cy.json();
            if(nextDiagram.label==='模型'){
              nextDiagram.NodeId = 'SD'
            }
            dispatch({ type: ACTIONS.CHANGE_TREEDIAGRAM, payload: nextDiagram });
          },
          hasTrailingDivider: true
        },
        {
          id: 'add-state',
          // content: 'Add State',
          content:'添加状态',
          coreAsWell: false,
          selector: 'node[type = "object"]',
          onClickFunction: function (event) {
            addNodeFromContextMenu(cy, event, 'state', currentDiagram.current);
            //添加状态后更新异或边位置
            computedSelectEles(event.target,dispatch)
            updateXor(state,dispatch)
            // updateFromMasterModel()
          },
          hasTrailingDivider: true
        },
        {
          id: 'add-object',
          // content: 'Add Object',
          content:'添加对象',
          coreAsWell: true,
          selector: '$node > node[type != "state"],node[type = "project"],node[type = "projectlock"]',
          onClickFunction: function (event) {
            addNodeFromContextMenu(cy, event, 'object', currentDiagram.current);
            // updateFromMasterModel()
          },
          hasTrailingDivider: true,
        },
        {
          id: 'add-process',
          // content: 'Add Process',
          content:'添加过程',
          coreAsWell: true,
          selector: '$node > node[type != "state"],node[type = "project"],node[type = "projectlock"]',
          onClickFunction: function (event) {
            addNodeFromContextMenu(cy, event, 'process', currentDiagram.current);
            // updateFromMasterModel()
          },
          hasTrailingDivider: true,
        },
        {
          id: 'add-project',
          // content: 'Add Object',
          content:'添加视图',
          coreAsWell: true,
          onClickFunction: function (event) {
            addNodeFromContextMenu(cy, event, 'project', currentDiagram.current);
            reducerInitState.projectData = !reducerInitState.projectData
            dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: reducerInitState.projectData });
          },
          hasTrailingDivider: true,
        },
        {
          id: 'add-remark',
          // content: 'Add Object',
          content:'添加备注',
          coreAsWell: true,
          selector: '$node > node[type != "state"],node[type = "project"],node[type = "projectlock"]',
          onClickFunction: function (event) {
            addNodeFromContextMenu(cy, event, 'remark', currentDiagram.current);
          },
          hasTrailingDivider: true,
        },
        {
          id: 'lock',
          // content: 'Remove',
          content:'锁定视图',
          selector: 'node[type="project"]',
          onClickFunction: function (event) {
            const node = event.target 
            if(node){
              node.lock()
              node.data().type = 'projectlock'
            }
            // changeStyle()
          },
          hasTrailingDivider: true
        },
        {
          id: 'unlock',
          // content: 'Add Object',
          selector: 'node[type="projectlock"]',
          content:'解除锁定',
          onClickFunction: function (event) {
            const node = event.target 
            if(node){
              node.unlock()
              node.data().type = 'project'
            }
          },
          hasTrailingDivider: true
        },
        {
          id: 'remove',
          // content: 'Remove',
          content:'移除',
          selector: 'node, edge',
          onClickFunction: function (event) {
            const target = event.target
            const type = target.data().type
            if(type === 'project' || type === 'projectlock'){
              confirm({
                title: '移除视图',
                icon: <ExclamationCircleFilled />,
                content: '确定移除"'+target.data().label + '"视图?',
                onOk() {
                  deleteNodeAndEdge(event.target,dispatch)
                },
                onCancel() {
                  console.log('取消');
                },
                okText: '确定',
                cancelText: '取消',
              });
            }else if(type=='异或边'){
               //移除边的头和尾连接点
               if(event.target.data().source.slice(6,7)==="1"){
                const id = event.target.data().id.slice(0,7) + '2' + event.target.data().id.slice(8)
                const edge = cy.getElementById(id)
                if(edge.length>0){
                  removeSorAndTar(edge,dispatch)
                }
               }
               removeSorAndTar(event.target,dispatch)
            }else{
              deleteNodeAndEdge(event.target,dispatch)
            }
          },
          hasTrailingDivider: true
        },
        {
          id: 'change-essence',
          // content: 'Change Essence',
          content:'信息/物理',
          coreAsWell: false,
          selector: 'node[type = "object"],node[type = "process"],node[type = "processParent"],node[type = "processMax"],node[type = "objectParent"]',
          onClickFunction: function (event) {
            const node = event.target;
            const MMRef = node.data('MMRef');
            if (MMRef.essence === Essence.Informatical)
              MMRef.essence = Essence.Physical;
            else
              MMRef.essence = Essence.Informatical;

            node.data({ labelWidth: node.width() + 1 });
          },
        },
        {
          id: 'change-affiliation',
          // content: 'Change Affiliation',
          content:'系统/环境',
          coreAsWell: false,
          selector: 'node[type = "object"],node[type = "process"],node[type = "processParent"],node[type = "processMax"],node[type = "objectParent"]',
          onClickFunction: function (event) {
            const node = event.target;
            const MMRef = node.data('MMRef');
            if (MMRef.affiliation === Affiliation.Systemic)
              MMRef.affiliation = Affiliation.Environmental;
            else
              MMRef.affiliation = Affiliation.Systemic;

            node.data({ labelWidth: node.width() + 1 }); // workaround: width has to be changed or ghost node does not appear
            node.data({ essence: node.data().MMRef.essence});
            node.data({ affiliation: node.data().MMRef.affiliation});
          },
        },
        {
          id: 'activation',
          content:'激活',
          coreAsWell: false,
          selector: 'node[type = "object"],node[type = "process"],node[type = "processParent"],node[type = "processMax"],node[type = "objectParent"],node[type = "state"]',
          onClickFunction: function (event) {
            const node = event.target;
            const MMRef = node.data('MMRef');
            let color
            if(node.data().type==='object'||node.data().type==='objectParent'){
             color = 'rgb(204,239,220)'
            }else if(node.data().type==='process'||node.data().type==='processParent'){
             color = 'rgb(206,236,247)'
            }else if(node.data().type==='state'){
             color = 'rgb(254,225,209)'
            }
            MMRef.background = color;
            node.data({ background: color });
          },
          hasTrailingDivider: true,
        },
        {
          id: 'no-activation',
          content:'取消激活',
          coreAsWell: false,
          selector: 'node[type = "object"],node[type = "process"],node[type = "processParent"],node[type = "processMax"],node[type = "objectParent"],node[type = "state"]',
          onClickFunction: function (event) {
            const node = event.target;
            const MMRef = node.data('MMRef');
            let color = undefined
            MMRef.background = color;
            node.data({ background: color });
          },
          hasTrailingDivider: true,
        },
        {
          id: 'Initial-state',
          // content: 'Change Affiliation',
          content:'初始状态',
          coreAsWell: false,
          selector: 'node[type = "state"]',
          onClickFunction: function (event) {
            const node = event.target;
            const MMRef = node.data('MMRef');
            MMRef.state = 'solid';
            MMRef.borderWidth = '3px';
            node.data({ state: 'solid' });
            node.data({ borderWidth: '3px' });
          },
          hasTrailingDivider: true,
        },
        {
          id: 'Defaults-state',
          // content: 'Change Affiliation',
          content:'默认状态',
          coreAsWell: false,
          selector: 'node[type = "state"]',
          onClickFunction: function (event) {
            const node = event.target;
            const MMRef = node.data('MMRef');
            MMRef.state = 'solid';
            MMRef.borderWidth = '2px';
            node.data({ state: 'solid' });
            node.data({ borderWidth: '2px' });
          },
          hasTrailingDivider: true,
        },
        {
          id: 'Final-staten',
          // content: 'Change Affiliation',
          content:'最终状态',
          coreAsWell: false,
          selector: 'node[type = "state"]',
          onClickFunction: function (event) {
            const node = event.target;
            const MMRef = node.data('MMRef');
            MMRef.state = 'double';
            MMRef.borderWidth = '6px';
            node.data({ state: 'double' });
            node.data({ borderWidth: '6px' });
          },
          hasTrailingDivider: true,
        },
        {
          id: 'disband',
          content: '解散',
          selector: 'node[type = "project"]',
          onClickFunction: function (event) {
            disbandProject(event.target)
          },
          hasTrailingDivider: true
        },
        {
          id: 'moveout',
          content: '移出视图',
          selector: 'node',
          onClickFunction: function (event) {
            let selectChidren = store.getState().selectChidren
            selectChidren.map(item=>{
              item.move({parent:null})
              const x = item.position().x + 200
              const y = item.position().y + 200
              item.position({ x: x, y: y });
            })
            var elements = cy.elements()
            elements.unselect()
          },
          hasTrailingDivider: true
        },
        {
          id: 'XOR',
          content:'添加异或连线',
          selector:'node',
          onClickFunction: function (event) {
            const target = event.target
            const selectEdges = target._private.edges.filter((edge:any)=>edge.selected())
            if(selectEdges.length<2){
             alert('请至少选择两条边')
             return
            }
            const sourceId = selectEdges[0]._private.source.data().id
            const targetId = selectEdges[0]._private.target.data().id
            const type = selectEdges[0].data().type
            const sameSource = selectEdges.every((edge:any)=>sourceId===edge._private.source.data().id)
            const sameTarget = selectEdges.every((edge:any)=>targetId===edge._private.target.data().id)
            const sameType = selectEdges.every((edge:any)=>type===edge.data().type)
            if(sameSource===false&&sameTarget===false){
              alert('节点上的选中边需同起点或同终点')
              return
            }
            if(sameType===false){
              alert('请选择相同类型的边')
              return
            }
            let selectId = []
            selectEdges.forEach((edge:any)=>{
              if(edge.data().type==='聚合-分散'|| edge.data().type==='聚合-分散(缺失)' 
              ||edge.data().type==='展示-表征'||edge.data().type==='泛化-特化'
              ||edge.data().type==='类化-实例化'){
                alert('请勿选择结构链接')
                return
              }
              if(edge._private.rstyle.linePts!==null||edge._private.rstyle.bezierPts!==null){
                if(edge.data().type!='触发链接'){
                  alert('请勿选择弯曲边')
                  return
                }
              }
              selectId.push(edge.data().id)
            })
            const targetNodeID = target.data().id
            const distance = 20
            const num = '1'
            const edgeType = '异或边'
            if(sameSource===true){
              addExcOR('sameSource',targetNodeID,selectId,state,distance,num,edgeType)
            }else{
              addExcOR('sameTarget',targetNodeID,selectId,state,distance,num,edgeType)
            }
          },
          hasTrailingDivider: true
        },
        {
          id: 'AND',
          content:'添加且连线',
          selector:'node',
          onClickFunction: function (event) {
            const target = event.target
            const selectEdges = target._private.edges.filter((edge:any)=>edge.selected())
            if(selectEdges.length<2){
             alert('请至少选择两条边')
             return
            }
            const sourceId = selectEdges[0]._private.source.data().id
            const targetId = selectEdges[0]._private.target.data().id
            const type = selectEdges[0].data().type
            const sameSource = selectEdges.every((edge:any)=>sourceId===edge._private.source.data().id)
            const sameTarget = selectEdges.every((edge:any)=>targetId===edge._private.target.data().id)
            const sameType = selectEdges.every((edge:any)=>type===edge.data().type)
            if(sameSource===false&&sameTarget===false){
              alert('节点上的选中边需同起点或同终点')
              return
            }
            if(sameType===false){
              alert('请选择相同类型的边')
              return
            }
            let selectId = []
            selectEdges.forEach((edge:any)=>{
              if(edge.data().type==='聚合-分散'|| edge.data().type==='聚合-分散(缺失)' 
              ||edge.data().type==='展示-表征'||edge.data().type==='泛化-特化'
              ||edge.data().type==='类化-实例化'){
                alert('请勿选择结构链接')
                return
              }
              if(edge._private.rstyle.linePts!==null||edge._private.rstyle.bezierPts!==null){
                if(edge.data().type!='触发链接'){
                  alert('请勿选择弯曲边')
                  return
                }
              }
              selectId.push(edge.data().id)
            })
            const targetNodeID = target.data().id
            const distance = 20
            const num = '1'
            const edgeType = '且连线'
            if(sameSource===true){
              addExcOR('sameSource',targetNodeID,selectId,state,distance,num,edgeType)
            }else{
              addExcOR('sameTarget',targetNodeID,selectId,state,distance,num,edgeType)
            }
          },
          hasTrailingDivider: true
        },
        // {
        //   id: 'removeXor',
        //   // content: 'Remove',
        //   content:'移除异或连线',
        //   selector: 'edge[type != "异或边"]',
        //   onClickFunction: function (event) {
        //     const target = event.target
        //     removeXorEdge(target,dispatch)
        //   },
        //   hasTrailingDivider: true
        // },
        // {
        //   id: 'bring-connected',
        //   content: 'Bring Connected',
        //   coreAsWell: false,
        //   selector: 'node',
        //   onClickFunction: function (event) {
        //     dispatch({ type: ACTIONS.EDGE_SELECTION, payload: {show: true, node: event.target.data('MMRef')} });
        //   },
        //   hasTrailingDivider: false,
        // },
        // {
        //   id: 'bring-all-states',
        //   content: 'Bring All States',
        //   coreAsWell: false,
        //   selector: 'node[type = "object"]',
        //   onClickFunction: function (event) {
        //     const node = event.target;
        //     bringAllStates(cy, node);
        //   },
        //   hasTrailingDivider: false,
        // },
        // {
        //   id: 'show-hidden',
        //   // content: 'Show Hidden',
        //   content: '显示隐藏',
        //   coreAsWell: true,
        //   onClickFunction: function (event) {
        //     for (const element of cy.elements()) {
        //       if (element.data('display') === 'none') {
        //         const parentId = element.data('lastParent')
        //         element.move({ parent: parentId });
        //         element.data({ display: 'element' });
        //       }
        //     }
        //   },
        //   hasTrailingDivider: true,
        // },
      ]
    });
  };

  //返回父级画板数据
  const getDiagramJson = (data) => {
    for (let item of data) {
      if(item.modelReference.children.length>0){
        for (let t of item.modelReference.children){
          if (t.NodeId == store.getState().treeId) {
            return item.modelReference; // 返回具体的 diagramJson
          }
        }
      } 
      // 如果当前项有子项（children），递归调用 getDiagramJson
      if (item.children && item.children.length > 0) {
        const result = getDiagramJson(item.children);
        // 如果递归调用返回了结果，直接返回该结果
        if (result) return result;
      }
    }
  
    // 如果遍历完所有项都没有找到匹配的 key，返回 null 或其他默认值
    return null;
  };
  //根据左侧id判断是否需要隐藏返回按钮，第一级返回隐藏，其他都放开显示
  const changeInstance = (e)=>{
    if(e===undefined||e === 'SD'){
      instance.hideMenuItem('return');
    }else{
      instance.showMenuItem('return');
    }
  }
 
  const changeMoveout = (e) =>{
    if(e===true){
      instance.showMenuItem('moveout')
     }else{
      instance.hideMenuItem('moveout')
     }
  }
  const showActivation = (e) =>{
    if(e.data().type==='remark'||e.data().type === 'project'){
      instance.hideMenuItem('activation')
      instance.hideMenuItem('no-activation')
      return
    }
    if(e.data().background!=undefined){
      instance.showMenuItem('no-activation')
      instance.hideMenuItem('activation')
    }else{
      instance.showMenuItem('activation')
      instance.hideMenuItem('no-activation')
    }
  }
  useEffect(() => {
    cy = cytoscape({
      container: document.getElementById('cy'), // container to render in
      style: cyStylesheet,
      wheelSensitivity: 0.1,
      autounselectify: false,

    });
    registerContextMenu(cy);
    registerEdgeEventHandlers(cy);
    registerPopperHandlers(cy);
    cy.edgeEditing(eeDefaults);
    document.addEventListener('paste', function(event) {
      //监听ctrl+v 粘贴节点
      if(localStorage.getItem('copy') == "true"){
        console.log('paste')
        //复制节点
        copyElements(cy,currentDiagram,state)
        //复制异或边
        setTimeout(()=>{
        copyXorEdge(cy,currentDiagram,state)
        },10)
        reducerInitState.projectData = !reducerInitState.projectData
        dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: reducerInitState.projectData });
        updateFromMasterModel()
      }
    });
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Delete' || event.keyCode === 46) {
        // 执行删除操作
       deleteElements(cy,dispatch)
      }
      if (((event.ctrlKey || event.metaKey) && event.key === 'x')||((event.ctrlKey || event.metaKey) && event.key === 'X')) {
        // 执行剪切操作的代码
       cutElements(cy,dispatch)
       localStorage.setItem('copy',"true")
      }
      if ((event.ctrlKey && event.key === 'c')||(event.ctrlKey && event.key === 'C')) {
        // event.preventDefault(); // 阻止默认行为，即复制操作
        localStorage.setItem('copy',"true")
        // 在这里添加你想要执行的代码
      }
    });
  }, []);
  
  useEffect(()=>{
    emitter.on('treeId',(e)=>{
     changeInstance(e)
     })
  },[])

  const wsService = useContext(WebSocketContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    wsService.addMessageListener(handleMessage);

    return () => {
      wsService.removeMessageListener(handleMessage);
    };
  }, [wsService]);
  return (
    <div className='diagram-canvas' id='cy' />);
};

export default DiagramCanvas;
export { cy };

