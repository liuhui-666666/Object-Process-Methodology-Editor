/**
 * 1. 该文件是用于创建一个为为Count组件服务的reducer,reducer的本质是一个函数
 * 2. reducer函数会接收到两个参数，分别为：之前的状态（preState），动作对象（action）
 */
// const selectedList = []; //初始化状态
// // preState===undefined时，preState = intState
// export default function countReducer(preState = selectedList, action) {
//   // 从action对象中获取：type,data
//   const {data } = action;
//   return data
// }

// 初始状态，使用对象来存储多个字段
const initialState = {
  selectedList: [],
  parentIdList: [],
  tippyState:false,
  nodesList:[],
  edgesList:[],
  style:'cyStylesheet',
  login:false,
  xorList:[],
  sXorIdList:[],
  treeData:[],
  treeId:'SD',
  selectChidren:[]
};

function myReducer(state = initialState, action) {
  switch (action.type) {
    case 'selectedList':
      // 保存选中的节点数据
      return {
        ...state,
        selectedList: action.data
      };
    case 'parentIdList':
      // 保存含有父对象的数据
      return {
        ...state,
        parentIdList: action.data
      };
    case 'tippyState':
        // 保存含有父对象的数据
        return {
          ...state,
          tippyState: action.data
        };
    case 'nodesList':
      // 保存选中的节点数据
      return {
        ...state,
        nodesList: action.data
      };
    case 'edgesList':
      // 保存选中的节点数据
      return {
        ...state,
        edgesList: action.data
      }; 
    case 'style':
        // 保存选中的节点数据
        return {
          ...state,
          style: action.data
      };
    case 'login':
        // 保存选中的登录数据
        return {
          ...state,
          login: action.data
      };
    case 'xorList':
        // 保存选中的异或数据
        return {
          ...state,
          xorList: action.data
    };  
    case 'sXorIdList':
        // 保存选中的异或数据
        return {
          ...state,
          sXorIdList: action.data
    };
    case 'treeData':
        // 保存选中的异或数据
        return {
          ...state,
          treeData: action.data
    };
    case 'treeId':
      // 保存选中的异或数据
      return {
        ...state,
        treeId: action.data
  };   
  case 'selectChidren':
      // 保存选中的异或数据
      return {
        ...state,
        selectChidren: action.data
  };       
    default:
      // 默认情况下不进行任何操作
      return state;
  }
}

// Action creator for updating field1
export function selectedList(value) {
  return {
    type: 'selectedList',
    payload: value
  };
}

// Action creator for updating field2
export function parentIdList(value) {
  return {
    type: 'parentIdList',
    payload: value
  };
}
//保存文本框弹出状态
export function tippyState(value) {
  return {
    type: 'tippyState',
    payload: value
  };
}

export function nodesList(value) {
  return {
    type: 'nodesList',
    payload: value
  };
}

export function edgesList(value) {
  return {
    type: 'edgesList',
    payload: value
  };
}

export function style(value) {
  return {
    type: 'style',
    payload: value
  };
}

export function login(value) {
  return {
    type: 'login',
    payload: value
  };
}

export function xorList(value) {
  return {
    type: 'xorList',
    payload: value
  };
}

export function sXorIdList(value) {
  return {
    type: 'sXorIdList',
    payload: value
  };
}

export function treeData(value) {
  return {
    type: 'treeData',
    payload: value
  };
}

export function treeId(value) {
  return {
    type: 'treeId',
    payload: value
  };
}

export function selectChidren(value) {
  return {
    type: 'selectChidren',
    payload: value
  };
}

// 导出 reducer
export default myReducer;
