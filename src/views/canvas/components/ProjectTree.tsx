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
import '@/css/general.css';
import { useReducerProps } from '@/views/canvas/components/App';
import { cy } from "@/views/canvas/components/DiagramCanvas";
import {
  RadarChartOutlined
} from '@ant-design/icons';
interface DataNode {
  title: string;
  key: string;
  children?: DataNode[];
}

/**
 * Recursive function that transforms the diagram tree model (class instaces) to
 * a regular json that is required by the component
 */
const constructTreeJson = (jsonNode: any, nodes: any): DataNode => {
  jsonNode.children=[]
  nodes.forEach((modelNode:any) => {
    jsonNode.children.push({
      title: modelNode.data().label,
      key: modelNode.data().id,
      icon:< RadarChartOutlined style={{ fontSize: '16px', color: '#71c8f0' }}/> 
    })
  });
  return jsonNode;
};
const ProjectTree: React.FC<useReducerProps> = ({ state, dispatch }) => {
  let initTreeData: DataNode =
  {
    title: '视图',
    key: 'Project',
    children: [],
  };
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreedata] = useState([initTreeData]);
  useEffect(() => {
    const nodes = cy.elements().filter((node:any)=>node.data().type==='project' || node.data().type==='projectlock')
    setTreedata([constructTreeJson(initTreeData, nodes)]);
  }, [state.projectData]);
  /**
   * Actions to be done on diagram selection in the diagram tree.
   * Diagrams have to be switched and the selected diagram is updated
   * @param info - Object with the selected node
   */
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    if (info.node.key === 'Project') {  
      const key:React.Key[]=[]
      setSelectedKeys(key)
      return;  
    }else{
      setSelectedKeys(selectedKeys); 
      if(cy.getElementById(info.node.key)){
      const node = cy.getElementById(info.node.key)
      cy.zoom({
        level: 1.0, // the zoom level
      });
      cy.center(node)
    }
    }
  };

  return (
    <Tree
      className='diagram-tree'
      style={{ marginTop: '0px', height: '100%' }}
      // height={500}
      showLine={{ showLeafIcon: false }}
      onSelect={onSelect}
      treeData={treeData}
      defaultExpandAll={true} 
      selectedKeys={selectedKeys}
      showIcon
      />
  );
};

export default ProjectTree;