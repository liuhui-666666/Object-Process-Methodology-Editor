import { pasteNodeFromContextMenu } from './pasteGeneral';
import { pasteEdgeCreate } from './edge';
import store from "@/store/index";
import { Core } from "cytoscape";
import { Essence, masterModelRoot, MMNode, MMRoot, NodeType } from "@/views/canvas/model/node-model";
import { MMEdge } from "@/views/canvas/model/edge-model";
import {ExclamationCircleFilled} from '@ant-design/icons';
import { Modal } from 'antd';
import {deleteNodeAndEdge} from './general'
import {addExcOR} from '@/views/canvas/controller/xorGeneral'
const copyElements = (cy:Core,currentDiagram:any,state:any) => {
    const parentIdList = store.getState().parentIdList;
    let nodes = store.getState().nodesList.filter((node:any)=>node.data().type!='edgePoint');
    nodes = nodes.filter((node:any)=>node.data().type!='corss')
    const edges = store.getState().edgesList .filter((edge:any)=>edge.data().type!='异或边' && edge.data().type!=='且连线')
    let selectedNodes:any = []
    let selectedEdges:any= []
    nodes.map((ele:any)=>{
      const parentId = parentIdList.filter((t:MMNode)=>t.id===ele.data().id).length>0 ? parentIdList.filter((t:any)=>t.id===ele.data().id)[0].parentId:null;
      selectedNodes.push({
        id:ele.data().id,
        label:ele.data().label,
        position:ele.position(),
        type:ele.data().type,
        parentId:parentId,
        essence:ele.data().essence,
        affiliation:ele.data().affiliation,
        changeParent:false,
        state:ele.data().state,
        borderWidth:ele.data().borderWidth,
        background:ele.data().background
      })
    })
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
    selectedNodes.map((ele:any)=>{
      //保存节点初始id
      const nodeId =ele.id
      ele.id = generateRandomNumbers()
      const sXorList = store.getState().sXorIdList;
      sXorList.map((item:any)=>{
        const targetId = item.target
        if(targetId==nodeId){
          item.target = ele.id
        }
      })
      //更新父节点id
      selectedNodes.map((node:any)=>{
        const id = node.parentId
        if(node.parent!==null){
          if(node.parentId===nodeId && node.changeParent === false){
            node.changeParent = true
            node.parentId = ele.id
          }
        }
      })
      //更新复制数据边起点和终点id
      selectedEdges.map((edge:any)=>{
        const sourceId = edge.source.id 
        const targetId = edge.target.id
        if(sourceId === nodeId){
          edge.source.id = ele.id
        }else if(targetId === nodeId){
          edge.target.id = ele.id
        }
      })
      const event = ele
      const type = ele.type
      //新增节点
      pasteNodeFromContextMenu(cy, event, type, currentDiagram.current,ele.id,ele.essence,ele.affiliation,ele);
    })
    selectedEdges.map((item:any)=>{
      const type = item.type
      pasteEdgeCreate(item,type,state,currentDiagram.current)
    })
    //取消节点选择
    var elements = cy.elements()
    elements.unselect()
    store.dispatch({type:'selectedList' , data: []});
    store.dispatch({type:'nodesList' , data: []});
    store.dispatch({type:'edgesList' , data: []});
  }
  const { confirm } = Modal;
//删除节点
const deleteElements = (cy:Core,dispatch:Function) =>{
  const selectedElements = store.getState().selectedList;
  const edgesList =  selectedElements.filter((edge:any)=>edge.group()==='edges')
  const hasParentNodes = selectedElements.filter((node:any)=>node.group()==='nodes'&&node.parent().length==0)
  let label:string = ''
  if(selectedElements.length>0){
  selectedElements.map((ele:any)=>{
    if(ele.data().type==='project' || ele.data().type==='projectlock'){
      label = label + ele.data().label + '、'
    }
  })
}
  if(label!=''){
    label = label.slice(0,-1)
    confirm({
      title: '移除视图',
      icon: <ExclamationCircleFilled />,
      content: '确定移除"'+ label + '"视图?',
      onOk() {
        //先删除边再删除节点避免报错
       if(edgesList.length>0){
        edgesList.map((edge:any)=>{
           deleteNodeAndEdge(edge,dispatch)
        })
       }
        if(hasParentNodes.length>0){
          hasParentNodes.map((node:any)=>{
            deleteNodeAndEdge(node,dispatch)
          })
        }
      },
      onCancel() {
        console.log('取消');
      },
      okText: '确定',
      cancelText: '取消',
    });
  }else{
    if(edgesList.length>0){
      edgesList.map((edge:any)=>{
         deleteNodeAndEdge(edge,dispatch)
      })
     }
    if(hasParentNodes.length>0){
      hasParentNodes.map((node:any)=>{
        deleteNodeAndEdge(node,dispatch)
      })
    }
  }
}

const cutElements = (cy:Core,dispatch:Function) =>{
  const selectedElements = store.getState().selectedList;
  if(selectedElements.length>0){
    selectedElements.map((ele:any)=>{
      deleteNodeAndEdge(ele,dispatch)
    })
  }
}

const copyXorEdge = (cy:Core,currentDiagram:any,state:any) =>{
  const sXorList = store.getState().sXorIdList;
  sXorList.map((item:any)=>{
    addExcOR(item.direction,item.target,item.numbers,state,item.distance,item.num,item.type)
  })
}

 //生成随机数
const generateRandomNumbers = ()=> {
  let numbers:string = '';
  while (numbers.length < 8) {
      const randomNumber = Math.floor(Math.random() * 10); // 生成0到9之间的随机整数
          numbers = numbers + randomNumber;
  }
  return numbers;
}

export {
copyElements,
deleteElements,
cutElements,
copyXorEdge,
generateRandomNumbers
}