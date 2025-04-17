// @ts-nocheck
/**  
 * @file Root component of the application. Includes the diagram canvas, toolbars as well as pop-up modals.
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { EdgeSingular, NodeSingular } from 'cytoscape';
import { useReducer,useState,useRef,useEffect} from 'react';
import { DiagramTreeNode, diagramTreeRoot } from '@/views/canvas/model/diagram-tree-model';
import '@/css/general.css';
import DiagramCanvas from '@/views/canvas/components/DiagramCanvas';
import EdgeSelectionModal from '@/views/canvas/components/EdgeSelectionModal';
import EdgeTypeSelectionModal from '@/views/canvas/components/EdgeTypeSelectionModal';
import LeftSidebar from '@/views/canvas/components/LeftSidebar';
import TopToolbar from '@/views/canvas/components/TopToolbar';
import LeftProject from '@/views/canvas/components/LeftProject'
// import LoginNotModal from '@/views/canvas/components/LoginNotModal'
import { Modal,Drawer,Button,Space,Tooltip } from 'antd';
import { DoubleLeftOutlined,DoubleRightOutlined,BellOutlined,DeleteOutlined,AreaChartOutlined,AlertOutlined } from '@ant-design/icons';
import { getToken } from '@/utils/token';
import OpmList from './OpmList'
import emitter from '@/utils/emiiter';
import RecycleList from './RecycleList';
export interface useReducerProps {
  state: StateInterface;
  dispatch: Function;
  onAction?: () => void; 
};

export interface StateInterface {
  currentDiagram: DiagramTreeNode,
  lastCreatedDiagram: DiagramTreeNode,
  showEdgeTypeSelectonModal: boolean,
  showEdgeSelectionModal: boolean,
  currentNode: NodeSingular | null,
  currentEdge: EdgeSingular | null,
  propagation: Propagation,
  targetNode: null,
  timestamp: Date;
  dynamicClass:boolean,
  projectData:boolean,
  width:number,
  showAddXor:boolean,
  treeDiagram:DiagramTreeNode
}

export enum PropagationEnum {
  None,
  OneLevel,
  Complete
}

export let propagation: PropagationEnum = PropagationEnum.OneLevel;
export let currentDiagram: DiagramTreeNode = diagramTreeRoot;

export const ACTIONS = {
  CHANGE_DIAGRAM: 'change-diagram',
  INZOOM_DIAGRAM: 'inzoom-diagram',
  EDGE_TYPE_SELECTION: 'edge-type-selection',
  EDGE_SELECTION: 'edge-selection',
  CHANGE_CURRENT_NODE: 'change-current-node',
  CHANGE_CURRENT_EDGE: 'change-current-edge',
  CHANGE_PROPAGATION: 'change-propagation',
  UPDATE_TREE: 'update-tree',
  UPDATE_CLASS:'update-class',
  UPDATE_PROJECT:'update-project',
  UPDATE_WIDTH:'update-width',
  CHANGE_TREEDIAGRAM:'change-treeDiagram'
};


// Global state handling
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.CHANGE_DIAGRAM:
      currentDiagram = action.payload;
      return { ...state, currentDiagram: action.payload };
    case ACTIONS.INZOOM_DIAGRAM:
      currentDiagram = action.payload;
      return { ...state, currentDiagram: action.payload, lastCreatedDiagram: action.payload };
    case ACTIONS.EDGE_TYPE_SELECTION:
      return { ...state, showEdgeTypeSelectonModal: action.payload };
    case ACTIONS.EDGE_SELECTION:
      return { ...state, showEdgeSelectionModal: action.payload.show, targetNode: action.payload.node };
    case ACTIONS.CHANGE_PROPAGATION:
      propagation = action.payload;
      return { ...state, propagation: action.payload };
    case ACTIONS.UPDATE_TREE:
      return { ...state, timestamp: new Date() };
    case ACTIONS.UPDATE_CLASS:
        return { ...state, dynamicClass: action.payload };
    case ACTIONS.UPDATE_PROJECT:
      return { ...state, projectData: action.payload };
    case ACTIONS.UPDATE_WIDTH:
      return { ...state, width: action.payload };
    case ACTIONS.CHANGE_TREEDIAGRAM:
        return { ...state, treeDiagram: action.payload };
    default:
      console.log('invalid dispatch type');
  }
}

export const reducerInitState = {
  currentDiagram: diagramTreeRoot,
  lastCreatedDiagram: null,
  createdEdge: null,
  currentNode: null,
  currentEdge: null,
  propagation: PropagationEnum.OneLevel,
  dynamicClass:true,
  projectData:false
};
function App() {
  const [state, dispatch] = useReducer(reducer, reducerInitState);
  const handleAction= ()=>{
    dispatch({ type: ACTIONS.UPDATE_CLASS, payload: !dynamicClass });
  }
  const dynamicClass = state.dynamicClass;
  const [sidebarWidth, setSidebarWidth] = useState(0);  
  const [listbarWidth,setListbarWidth]= useState(300)
  const sidebarRef = useRef<HTMLDivElement>(null);  
  const [itemIndex,setItemIndex] = useState(2)
  let isResizing = false;  
  let startX: number | null = null;  
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {  
    e.preventDefault();  
    isResizing = true;  
    startX = e.clientX;  
    document.addEventListener('mousemove', handleMouseMove);  
    document.addEventListener('mouseup', handleMouseUp);  
  };  
  
  const handleMouseMove = (e: MouseEvent) => {
    if(sidebarWidth!=0){
      if (!isResizing || !startX) return;  
      const deltaX = e.clientX - startX;  
      const newWidth = Math.max(100, sidebarWidth + deltaX); // 最小宽度为100px  
      dispatch({ type: ACTIONS.UPDATE_WIDTH, payload: newWidth });//更新搜索框宽度
      setSidebarWidth(newWidth);  
    }else if(listbarWidth !=0){
      if (!isResizing || !startX) return;  
      const deltaX = e.clientX - startX;  
      const newWidth = Math.max(300, listbarWidth + deltaX); // 最小宽度为100px  
      emitter.emit('updateListBarWidth',newWidth)
      setListbarWidth(newWidth);  
    }
  };  
  
  const handleMouseUp = () => {  
    isResizing = false;  
    startX = null;  
    document.removeEventListener('mousemove', handleMouseMove);  
    document.removeEventListener('mouseup', handleMouseUp);  
  };  
  const [isOpen, setOpen] = useState(false);
  const [isLogin, setLogin] = useState(false)
  const [placement, setPlacement] = useState<DrawerProps['placement']>('right');
  const [opmName,setOpmName] = useState('您可打开以下文件查看OPM图!')
  const [isShowButton,setShowButton] = useState('left')
  const toggleLeft = () => {
    setSidebarWidth(0)
    setListbarWidth(0)
    setItemIndex(0)
    setShowButton('right')
  };
  const toggleRight = () => {
    setSidebarWidth(0)
    setListbarWidth(300)
    setShowButton('left')
    setItemIndex(2)
  };
  const getOpmName =(e) =>{
   const title = '当前文件:' + e
   setOpmName(title)
  }
  const noOpmName  =() =>{
    setOpmName('您可打开以下文件查看OPM图!')
   }
  const loginOut = () =>{
    setLogin(false)
  }
  const loginSucess = () =>{
    setLogin(true)
  }
  const showRecycle = () =>{
    emitter.emit('showRecycle')
  }
  const openOpmList = () =>{
    setSidebarWidth(0)
    setListbarWidth(300)
    emitter.emit('updateListBarWidth',300)
    setItemIndex(2)
    setShowButton('left')
  }
  const openLeftTree = () =>{
    dispatch({ type: ACTIONS.UPDATE_WIDTH, payload: 210 });//更新搜索框宽度
    setListbarWidth(0)
    setSidebarWidth(230)
    setItemIndex(1)
    setShowButton('left')
  }
  useEffect(()=>{
    emitter.on('sendOpmName',getOpmName);
    emitter.on('noOpmName',noOpmName);
    emitter.on('loginOut',loginOut);
    emitter.on('loginSuccess',loginSucess);
    if(getToken()){
      setLogin(true)
    }else{
      setLogin(false)
    }
   },[])
  return (
    <div className="app">
      <div className='flex-vertical-wrapper'>
        <div className='top-toolbar-wrapper'>
          <TopToolbar state={state} dispatch={dispatch} onAction={handleAction} />
        </div>
        <div className={dynamicClass===true?'left-flex-horizontal-wrapper' : 'bottom-flex-horizontal-wrapper'}>
         <div className={dynamicClass===true?'left-diagram-canvas-wrapper' : 'bottom-diagram-canvas-wrapper'}>
            <DiagramCanvas state={state} dispatch={dispatch} />
          </div>
          {/* <div className={dynamicClass===true? 'left-sidebar-wrapper' : 'bottom-sidebar-wrapper'}> */}
          <div className="resizer" onMouseDown={handleMouseDown}></div>  
           <div className={dynamicClass===true? 'left-sidebar-content' : 'bottom-sidebar-content'}
           ref={sidebarRef} style={{ width: `${sidebarWidth}px` }}
           >
            <LeftSidebar state={state} dispatch={dispatch} />
            <LeftProject state={state} dispatch={dispatch} />
           </div>
           <div className={"drawer-left"}  style={{ width: `${listbarWidth}px` }}> {/* 当抽屉打开时渲染抽屉 */}
              <div className="drawer-title">
                <span>这是OPM列表</span>
                  {isLogin && (
                  <div className="historyButton">
                    <Tooltip placement="bottom" title={'回收站'}>
                    <DeleteOutlined onClick={showRecycle}/>
                    </Tooltip>
                  </div>
                  )}
              </div>
              {isLogin && (
              <div className="drawer-Name">
              <BellOutlined /><span>{opmName}</span>
              </div>
              )}
              <div className="drawer-content">
                <OpmList state={state} dispatch={dispatch}></OpmList>
              </div>
        </div>
          <div className ="toolBar">
            {isShowButton==='left' && (
            <DoubleLeftOutlined onClick={toggleLeft} className='closeDrawer'/>
            )}
            {isShowButton==='right' && (
              <DoubleRightOutlined onClick={toggleRight} className='closeDrawer'/>
            )}
            <div onClick={openOpmList} className={itemIndex===2?'toolBarSelect' : 'toolBarNoSelect'}><AreaChartOutlined /><span>列</span><span>表</span></div>
            <div onClick={openLeftTree} className={itemIndex===1?'toolBarSelect' : 'toolBarNoSelect'}><AlertOutlined /><span>设</span><span>计</span></div>
          </div> 
          {/* </div> */}
        </div>
      </div>
      <EdgeTypeSelectionModal state={state} dispatch={dispatch} />
      <EdgeSelectionModal state={state} dispatch={dispatch} />
      {/* <LoginNotModal ></LoginNotModal> */}
      <RecycleList/>
      <a className="contentProvider" href="https://beian.miit.gov.cn/">湘ICP备2024068515号-1</a> 
    </div>
  );
}

export default App;
