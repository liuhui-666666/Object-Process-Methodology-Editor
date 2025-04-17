/**  
 * @file Diagram tree located in the left sidebar. Implemented with the use of Ant Design Tree component. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Tree } from 'antd';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import { switchDiagrams, updateFromMasterModel } from '@/views/canvas/controller/diagram-switching';
import '@/css/general.css';
import { DiagramTreeNode, diagramTreeRoot } from '@/views/canvas/model/diagram-tree-model';
import { ACTIONS, useReducerProps } from '@/views/canvas/components/App';
import {reducerInitState} from '@/views/canvas/components/App'
import store from "@/store/index";
import emitter from '@/utils/emiiter';
import {
  PartitionOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import {createFromIconfontCN} from '@ant-design/icons';
const IconFont = createFromIconfontCN({
  scriptUrl:'./static/iconfont.js'
})
interface DataNode {
  title: string;
  key: string;
  modelReference: DiagramTreeNode,
  children?: DataNode[];
}

/**
 * Recursive function that transforms the diagram tree model (class instaces) to
 * a regular json that is required by the component
 */
const constructTreeJson = (jsonNode: any, parentModelNode: DiagramTreeNode): DataNode => {
  let type:string
  parentModelNode.children.forEach((modelNode) => {
    if ('mainNode' in modelNode && 'type' in modelNode.mainNode) {  
      type = modelNode.mainNode.type
  }
   let icon = <PartitionOutlined style={{ fontSize: '16px', color: '#52c41a' }}/>
   if(type!='object'){
    icon = <ShareAltOutlined style={{ fontSize: '16px', color: '#1677FF' }} />
    parentModelNode.diagramJson.elements.nodes.map((item:any)=>{
      if(item.data.id === modelNode.NodeId){
       if(item.data.type==='processMax'){
        icon = <IconFont type="icon-baohan" style={{ fontSize: '16px', color: '#1677FF' }}/>
       }
      }
    })
   }
    const newJsonNode: any = {
      title: modelNode.label,
      key: modelNode.NodeId,//key重复导致报错
      modelReference: modelNode,
      children: [],
      icon:icon
      // icon:type==='object'? <PartitionOutlined style={{ fontSize: '16px', color: '#52c41a' }}/> :  <ShareAltOutlined style={{ fontSize: '16px', color: '#1677FF' }} />
    };
    const child = constructTreeJson(newJsonNode, modelNode);
    jsonNode.children.push(child);
    delete parentModelNode.diagramJson.style
  });
  return jsonNode;
};

const DiagramTree: React.FC<useReducerProps> = ({ state, dispatch }) => {
  let initTreeData: DataNode =
  {
    title: '模型',
    key: 'SD',
    modelReference: diagramTreeRoot,
    children: [],
  };
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['SD']);
  const [treeData, setTreedata] = useState([initTreeData]);
  const [treeId, setTreeId] = useState('SD');

  useEffect(() => {
    setTreedata([constructTreeJson(initTreeData, diagramTreeRoot)]);
    if (state.lastCreatedDiagram) {
      setExpandedKeys((prevState) => {
        const newKey = state.lastCreatedDiagram.NodeId;
        if (!expandedKeys.includes(newKey))
          return [...prevState, newKey];
        else
          return [...prevState];
      });
    }
    const id =  state.currentDiagram.NodeId
    setTreeId(id)
    emitter.emit('treeId',id)
    store.dispatch({type:'treeId' ,data:id});
  }, [state.lastCreatedDiagram]);

  useEffect(() => {
    setTreedata([constructTreeJson(initTreeData, diagramTreeRoot)]);
  }, [state.timestamp]);

  useEffect(() => { 
    if(state.treeDiagram===undefined)
    return
    const nextDiagram = state.treeDiagram as DiagramTreeNode 
    switchDiagrams(state.currentDiagram, nextDiagram)
    const id =  state.treeDiagram.NodeId
    setTreeId(id)
    emitter.emit('treeId',id)
    store.dispatch({type:'treeId' ,data:id});
    updateFromMasterModel()
    dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: nextDiagram });
    reducerInitState.projectData = !reducerInitState.projectData
    dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: reducerInitState.projectData });
  }, [state.treeDiagram]);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  useEffect(() => {
    const id =  state.currentDiagram.NodeId
    setTreeId(id)
    store.dispatch({type:'treeId' ,data:id});
  }, [state.currentDiagram]);

  useEffect(() => {
    store.dispatch({type:'treeData' , data: treeData});
  }, [treeData]);
  /**
   * Actions to be done on diagram selection in the diagram tree.
   * Diagrams have to be switched and the selected diagram is updated
   * @param info - Object with the selected node
   */
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    if (info.node.selected === true)
      return;
    const nextDiagram = info.node.modelReference as DiagramTreeNode 
    dispatch({ type: ACTIONS.CHANGE_TREEDIAGRAM, payload: nextDiagram });
  };

  return (
    <Tree
      className='diagram-tree'
      style={{ marginTop: '0px', height: '100%' }}
      // height={500}
      showLine={{ showLeafIcon: false }}
      // selectedKeys={[state.currentDiagram.NodeId]}//点击高亮
      selectedKeys={[treeId]}
      onSelect={onSelect}
      expandedKeys={expandedKeys}
      onExpand={onExpand}
      treeData={treeData} 
      showIcon
      />
  );
};

export default DiagramTree;