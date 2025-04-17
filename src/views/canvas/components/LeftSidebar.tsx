/**  
 * @file Left sidebar containing only the diagram tree. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import '@/css/general.css';
import { useReducerProps } from '@/views/canvas/components/App';
import DiagramTree from '@/views/canvas/components/DiagramTree';
import { useEffect } from 'react';
import { Input } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
const { Search } = Input;
const onSearch: SearchProps['onSearch'] = (value,event) => {
  console.log(value,event)
 };
const LeftSidebar: React.FC<useReducerProps> = ({ state, dispatch }) => {
  useEffect(() => {
  }, [state.dynamicClass]);
  const dynamicClass = state.dynamicClass;
  useEffect(() => {
  }, [state.width]);
  if(state.width==undefined){
    state.width = 230
  }
  const width = (state.width -20) + 'px'
  return (
    <div className={dynamicClass===true? 'left-sidebar' : 'bottom-sidebar'}>
      <div className="projectTop">
      <div className="projectTopTitle">模型</div>
      <Search placeholder="输入模型" onSearch={onSearch} style={{width:width}}/>
      </div>
      <DiagramTree state={state} dispatch={dispatch}/>
    </div>
  );
};

export default LeftSidebar;