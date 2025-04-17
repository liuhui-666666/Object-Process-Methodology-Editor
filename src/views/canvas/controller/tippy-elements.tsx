/**  
 * @file Definitions of name editing popups. The popups are html elements that get invoked
 *    on double click. They are implemented with the cytoscape-popper extension.
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Core } from "cytoscape";
import tippy from "tippy.js";
import store from "@/store/index";
import { diagramTreeRoot } from '@/views/canvas/model/diagram-tree-model';
import { ACTIONS,reducerInitState } from "@/views/canvas/components/App";
import { addExcOR } from "@/views/canvas/controller/xorGeneral";
/**
 * Definition of node name editing popup
 * @param cy Cytoscape instance
 */
function updateLabelRecursively(items:any, targetId:String, newLabel:String,dispatch: Function) {
  items.forEach((item:any) => {
    // 检查当前项是否匹配目标节点ID
    if (item.NodeId === targetId) {
      // 更新标签
      // item.label = item.labelData + newLabel;
      item.label = newLabel;
      dispatch({ type: ACTIONS.UPDATE_TREE });
    }
    
    // 如果存在嵌套的 children 属性，则递归调用更新函数
    if (item.children && Array.isArray(item.children)) {
      updateLabelRecursively(item.children, targetId, newLabel,dispatch);
    }
  });
}
const nodeLabelEditingPopup = (cy: Core,dispatch: Function) => {
  cy.on('dbltap', 'node', (evt: any) => {
    store.dispatch({type:'tippyState' , data: true});
    store.dispatch({type:'selectedList' , data: []});
    store.dispatch({type:'nodesList' , data: []});
    store.dispatch({type:'edgesList' , data: []});
    const targetNode = evt.target;
    let ref = targetNode.popperRef();
    let dummyDomEle = document.createElement('div');
    document.body.appendChild(dummyDomEle);
    let tip = tippy(dummyDomEle, {
      getReferenceClientRect: ref.getBoundingClientRect,
      trigger: 'manual',
      placement: 'bottom',
      interactive: true,
      content: () => {
        let content = document.createElement('div');
        content.classList.add('renameDialog')
        // const inputElement = document.createElement('input');
        const inputElement = document.createElement('textarea');
        // inputElement.type = 'text';
        //父节点更新后，切换画板修改节点文字点击tip label显示未更新问题
        inputElement.value = targetNode.data().MMRef.label;
        inputElement.classList.add('labelInput');
        let newLabel = inputElement.value;

        inputElement.addEventListener("change", function (event) {
          // @ts-ignore
          newLabel = event.target.value;
        });
        inputElement.classList.add('display-block');
        content.appendChild(inputElement);

        const buttonConfirm = document.createElement('button');
        buttonConfirm.type = 'button';
        buttonConfirm.innerHTML = "确认";
        buttonConfirm.addEventListener("click", function (event) {
          event.preventDefault();
          targetNode.data({ label: newLabel });
          //读取文本每一行的长度并获取最长那行文本的长度
          // 获取textarea元素
          // 获取textarea中的值
          var text = newLabel;

          // 使用换行符分割文本成行
          var line = text.split('\n');

          // 初始化最长行的长度和文本内容
          var maxLength = 0;
          var longestLine = '';

          // // 遍历每一行文本并计算长度
          // for (var i = 0; i < line.length; i++) {
          //   var lineLength = line[i].length;

          //   // 如果当前行长度大于最长行长度，则更新最长行的长度和文本内容
          //   if (lineLength > maxLength) {
          //     maxLength = lineLength;
          //   }
          // }
          //读取输入框有几行文本
          let lines = newLabel.split('\n');  
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
          // const newLabelWidth = newLabel.length * 8.5 > 60 ?  newLabel.length  * 8.5 : 60
          // const newLabelWidth = maxLength * 17 > 70 ?  maxLength  * 17 : 70
          const newLabelWidth = maxLength > 70 ?  maxLength : 70
          //根据行数设置高度
          const newLabelHeight = numLines * 20 > 45 ?  numLines  * 20 : 45
          //不更新project大小
          if(targetNode.data().type!=='project' && targetNode.data().type!=='projectlock'){
            targetNode.data({ labelWidth: newLabelWidth,labelHeight:newLabelHeight});
          }
          targetNode.data('MMRef').label = newLabel;
          //同步SD Label
          if(targetNode.data().type === 'process' || targetNode.data().type === 'object' || 
          targetNode.data().type === 'objectParent' || targetNode.data().type === 'processParent' 
          || targetNode.data().type === 'processMax' ){ 
            const targetId = targetNode.data().id;
            const newLabel = targetNode.data().label;
            updateLabelRecursively(diagramTreeRoot.children, targetId, newLabel,dispatch);
          }
          if(targetNode.data().type === 'project' || targetNode.data().type ==='projectlock'){
            reducerInitState.projectData = !reducerInitState.projectData
            dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: reducerInitState.projectData });
          }
          tip.hide();
    
        });

        content.appendChild(buttonConfirm);

        const buttonCancel = document.createElement('button');
        buttonCancel.type = 'button';
        buttonCancel.innerHTML = "取消";
        buttonCancel.addEventListener("click", function (event) {
          event.preventDefault();
          tip.hide();
        });
        content.appendChild(buttonCancel);
        return content;
      },
    });
    tip.show();
  });
};

/**
 * Definition of edge name editing popup
 * @param cy Cytoscape instance
 */
const edgeLabelEditingPopup = (cy: Core,state:any) => {
  cy.on('dbltap', 'edge', (evt: any) => {
    store.dispatch({type:'tippyState' , data: true});
    store.dispatch({type:'selectedList' , data: []});
    store.dispatch({type:'nodesList' , data: []});
    store.dispatch({type:'edgesList' , data: []});
    const targetEdge = evt.target;
    if(targetEdge.data().type==='且连线'){
      return
    }
    if(targetEdge.data().type==='异或边'){
      if(targetEdge.data().source.slice(6,7)==='1'){
        const id = targetEdge.data().source.slice(0,6) + '2' + targetEdge.data().source.slice(7)
        let direction 
        if(targetEdge.data().source.slice(5,6)==='S'){
          direction = 'sameSource'
        }else{
          direction = 'sameTarget'
        }
        const regex = /(?:source|target)(\d+i*)/g;
        let numbers = [];
        let match;
        while ((match = regex.exec(targetEdge.data().id)) !== null) {
          // match[1] 是捕获组，即 source, node, edge 后面的数字和任意数量的i
          numbers.push(match[1]); // 将捕获的数字和任意数量的i添加到数组中
        }
        const targetNodeID = numbers[0]

        let selectId = [];
        const regex1 = /(?:edge)(\d+i*)/g;
        let match1; 
        while ((match1 = regex1.exec(targetEdge.data().id)) !== null) {
          // match[1] 是捕获组，即 source, node, edge 后面的数字和任意数量的i
          selectId.push(match1[1]); // 将捕获的数字和任意数量的i添加到数组中
        }
        const distance = 30
        const num = '2'
        const type = targetEdge.data().type
        if(cy.getElementById(id).length==0){
          addExcOR(direction,targetNodeID,selectId,state,distance,num,type)
        }
      }
      return
    }
    let ref = targetEdge.popperRef();
    let dummyDomEle = document.createElement('div');
    document.body.appendChild(dummyDomEle);
    let tip = tippy(dummyDomEle, {
      getReferenceClientRect: ref.getBoundingClientRect,
      trigger: 'manual',
      placement: 'bottom',
      interactive: true,

      content: () => {
        let content = document.createElement('div');
        content.classList.add('renameDialog')

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = targetEdge.data('label');
        let newLabel = inputElement.value;

        inputElement.addEventListener("change", function (event) {
          // @ts-ignore
          newLabel = event.target.value;
        });
        inputElement.classList.add('display-block');
        content.appendChild(inputElement);

        const buttonConfirm = document.createElement('button');
        buttonConfirm.type = 'button';
        buttonConfirm.innerHTML = "确认";
        buttonConfirm.addEventListener("click", function (event) {
          event.preventDefault();
          targetEdge.data({ label: newLabel });
          const MMRef = targetEdge.data('MMRef')
          MMRef.label = newLabel;
          if (MMRef.originalEdges.length)
            MMRef.originalEdge.label = newLabel;
            
          tip.hide();
        });
        buttonConfirm.classList.add('tippyButton');

        content.appendChild(buttonConfirm);

        const buttonCancel = document.createElement('button');
        buttonCancel.type = 'button';
        buttonCancel.classList.add('tippyButton');
        buttonCancel.innerHTML = "取消";
        buttonCancel.addEventListener("click", function (event) {
          event.preventDefault();
          tip.hide();
        });
        content.appendChild(buttonCancel);
        return content;
      },
    });
    tip.show();
  });
};
// 函数：检查字符是否为中文
function isChinese(char:any) {
  const charCode = char.charCodeAt(0);
  return (charCode >= 0x4E00 && charCode <= 0x9FFF);
}
export { nodeLabelEditingPopup, edgeLabelEditingPopup };
