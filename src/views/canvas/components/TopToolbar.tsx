/**  
 * @file Top toolbar which contain: propagation selection, export to PNG button, 
 *    export to JSON button and import from JSON button. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Typography } from 'antd';
import React,{useEffect} from 'react';
import '@/css/general.css';
import { useReducerProps } from '@/views/canvas/components/App';
import DemoSelect from '@/views/canvas/components/DemoSelect';
import ExportJsonButton from '@/views/canvas/components/topButton/ExportJsonButton';
import ExportPngButton from '@/views/canvas/components/topButton/ExportPngButton';
import ExportPdfButton from '@/views/canvas/components/topButton/ExportPdfButton';
import ImportJsonButton from '@/views/canvas/components/topButton/ImportJsonButton';
import Propagation from '@/views/canvas/components/Propagation';
import ZoomInOut from '@/views/canvas/components/topButton/ZoomOut';
import ZoomInIn from '@/views/canvas/components/topButton/ZoomIn';
import ZoomInCenter from '@/views/canvas/components/topButton/ZoomCenter';
import ExitFullscreen from '@/views/canvas/components/topButton/ExitFullscreen'
import LeftAlignment from '@/views/canvas/components/topButton/LeftAlignment'
import RightAlignment from '@/views/canvas/components/topButton/RightAlignment'
import TopAlignment from '@/views/canvas/components/topButton/TopAlignment'
import BottomAlignment from '@/views/canvas/components/topButton/BottomAlignment'
// import CenterAlignment from '@/views/canvas/components/topButton/CenterAlignment'
import ChangePosButton from '@/views/canvas/components/topButton/ChangePosButton'
// import ChangeStyle from '@/views/canvas/components/topButton/ChangeStyle'
import VerticalCenter from '@/views/canvas/components/topButton/VerticalCenter'
import HorizontallyCenter from '@/views/canvas/components/topButton/HorizontallyCenter'
import StartRunning from '@/views/canvas/components/topButton/StartRunning'
import User from '@/views/canvas/components/topButton/User'
import { ACTIONS } from '@/views/canvas/components/App';

const TopToolbar: React.FC<useReducerProps> = ({ state, dispatch, onAction  }) => {
  const handleClick = () => {
    if (onAction) {
      onAction(); // 调用传递的 onAction 函数
    }
  };
  useEffect(() => {
    const value = 0
    dispatch({type: ACTIONS.CHANGE_PROPAGATION, payload: value})
  }, []);
  return (
    <div className='top-toolbar'>
      <div className='title-content'>
        <div className='top-logo'>
        </div>
        <div className='app-title'>智绘</div>
      </div>
      {/* <div className='top-node'>
        <div className="top-rectangle">
        </div>
        <div className="top-circle"></div>
      </div> */}
      <div className='top-toolbar-right'>
        {/* <div className='propagation-wrapper'>
          <Propagation state={state} dispatch={dispatch} />
        </div> */}
        {/* <DemoSelect state={state} dispatch={dispatch}/> */}
        {/* 切换布局 */}
        {/* <ChangePosButton myClick={handleClick}/> */}
        <StartRunning />
        {/* 切换风格 */}
        {/* <ChangeStyle /> */}
        <LeftAlignment/>
        <RightAlignment/>
        <VerticalCenter/>
        <TopAlignment/>
        <BottomAlignment/>
        <HorizontallyCenter/>
        {/* <CenterAlignment/> */}
        <ZoomInOut />
        <ZoomInIn />
        <ZoomInCenter />
        <ExitFullscreen />
        <ExportPngButton />
        {/* <ExportPdfButton /> */}
        <ExportJsonButton />
        <ImportJsonButton state={state} dispatch={dispatch}/>
        <User />
      </div>
    </div>
  );
};

export default TopToolbar;