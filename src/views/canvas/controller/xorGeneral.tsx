import {PlayCircleOutlined,PauseCircleOutlined} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { cy } from "@/views/canvas/components/DiagramCanvas";
import { addNode } from '@/views/canvas/controller/general';
import { masterModelRoot } from "@/views/canvas/model/node-model";
import { ACTIONS, StateInterface } from '@/views/canvas/components/App';
import {getSorAndTar,xorCreate} from '@/views/canvas/controller/edge'
import {deleteNodeAndEdge } from '@/views/canvas/controller/general';
import store from '@/store/index'
let currentMMNode = masterModelRoot;
let xorIds:any
let startEdge:any
let endEdge:any

const addExcOR = (direction:string,target:string,selectId:any,state: StateInterface,distance:number,num:string,type:string) =>{
  xorIds = selectId
    const posArray:any = []
    const source1 = cy.getElementById(target)
    //计算点位置
    if(direction === 'sameSource'){
      const sourcePos = cy.getElementById(target).position()
      xorIds.map((id:string)=>{
        const edge = cy.getElementById(id)
        posArray.push(computedPointPos(edge,distance))
      })
      // 计算结果
      const result = findSmallestAngleIncludingAllRays(posArray,sourcePos);
      console.log(`The smallest angle is: ${result.smallestAngle}`);
      console.log(`The starting ray is: ${JSON.stringify(result.startRay)}`);
      console.log(`The ending ray is: ${JSON.stringify(result.endRay)}`);
      startEdge = cy.getElementById(result.startRay.edge)
      endEdge = cy.getElementById(result.endRay.edge)
      connectXorLine(source1,xorIds,result,startEdge,endEdge,state,num,type)
    }else{
     const targetPos = cy.getElementById(target).position()
     xorIds.map((id:string)=>{
      const edge = cy.getElementById(id)
      posArray.push(computedPointPosT(edge,distance))
     })
     const result = findSmallestAngleIncludingAllRays(posArray,targetPos);
     console.log(`The smallest angle is: ${result.smallestAngle}`);
     console.log(`The starting ray is: ${JSON.stringify(result.startRay)}`);
     console.log(`The ending ray is: ${JSON.stringify(result.endRay)}`);
    //  xorEdge = cy.getElementById(edge.id)
     startEdge = cy.getElementById(result.startRay.edge)
     endEdge = cy.getElementById(result.endRay.edge)
     connectXorLineT(source1,xorIds,result,startEdge,endEdge,state,num,type)
    }
}
//计算在起点设异或边，虚线点的位置
const computedPointPos = (edge:any,dis:number) => {
  const X1 = edge._private.rstyle.srcX
  let Y1 = edge._private.rstyle.srcY
  let X2
  let Y2
  if(edge._private.rstyle.linePts!=null){
    X2 = edge._private.rstyle.linePts[1].x
    Y2 = edge._private.rstyle.linePts[1].y
    if(edge.data().type==='聚合-分散'||edge.data().type==='聚合-分散(缺失)'){
      Y1 = Y1 - 65
    }else if(edge.data().type==='展示-表征'){
      Y1 = Y1 - 50
    }else if(edge.data().type==='泛化-特化'){
      Y1 = Y1 - 35
    }else if(edge.data().type==='类化-实例化'){
      Y1 = Y1 - 35
    }
  }else if(edge._private.rstyle.bezierPts!=null){
    X2 = edge._private.rstyle.bezierPts[1].x
    Y2 = edge._private.rstyle.bezierPts[1].y
  }else{
    X2 =edge._private.rstyle.tgtX
    Y2 = edge._private.rstyle.tgtY
  }
  const disX = X2-X1
  const disY = Y2-Y1
  let SX
  let SY
  SX=  X1 + dis/(Math.sqrt(disX*disX +disY*disY))*(disX)
  SY = Y1 + dis/(Math.sqrt(disX*disX +disY*disY))*(disY)
  const position = {
      x:SX,
      y:SY,
      edge:edge.data().id
  }
  return position
}
//计算在终点设异或边，虚线点的位置
const computedPointPosT = (edge:any,dis:number) => {
    const X1 = edge._private.rstyle.tgtX
    let Y1 = edge._private.rstyle.tgtY
    let X2
    let Y2
    if(edge._private.rstyle.linePts!=null){
      X2 = edge._private.rstyle.linePts[edge._private.rstyle.linePts.length-2].x
      Y2 = edge._private.rstyle.linePts[edge._private.rstyle.linePts.length-2].y
      if(edge.data().type==='聚合-分散' || edge.data().type==='聚合-分散(缺失)'){
        Y1 = Y1 - 65
      }else if(edge.data().type==='展示-表征'){
        Y1 = Y1 - 50
      }else if(edge.data().type==='泛化-特化'){
        Y1 = Y1 - 35
      }else if(edge.data().type==='类化-实例化'){
        Y1 = Y1 - 35
      }
    }else if(edge._private.rstyle.bezierPts!=null){
      X2 = edge._private.rstyle.bezierPts[edge._private.rstyle.bezierPts.length-2].x
      Y2 = edge._private.rstyle.bezierPts[edge._private.rstyle.bezierPts.length-2].y
    }else{
      X2 = edge._private.rstyle.srcX
      Y2 = edge._private.rstyle.srcY
    }
    const disX = X2-X1
    const disY = Y2-Y1
    let SX //虚线起始点位置
    let SY //虚线起始点位置
    SX=  X1 + dis/(Math.sqrt(disX*disX +disY*disY))*(disX)
    SY = Y1 + dis/(Math.sqrt(disX*disX +disY*disY))*(disY)
    const position = {
        x: SX,
        y:SY,
        edge:edge.data().id
    }
    return position
}

const calculateAngle = (x1:number, y1:number, x2:number, y2:number) =>{
  // 计算两点之间的角度
  const angle = Math.atan2(y2 - y1, x2 - x1);
  return angle;
}

const findMinMaxAngles = (angles:any) =>{
  // 找到角度中的最小值和最大值
  let minAngle = angles[0];
  let maxAngle = angles[0];
  for (let i = 1; i < angles.length; i++) {
      if (angles[i] < minAngle) {
          minAngle = angles[i];
      }
      if (angles[i] > maxAngle) {
          maxAngle = angles[i];
      }
  }
  return { minAngle, maxAngle };
}

const findSmallestAngleIncludingAllRays = (rays:any,sourcePos:any) =>{
  // 起始点坐标
  const origin = sourcePos
  // 计算每条射线的角度
  const angles = rays.map((ray:any) => calculateAngle(origin.x, origin.y, ray.x, ray.y));

  // 找到最小和最大角度
  const { minAngle, maxAngle } = findMinMaxAngles(angles);

  // 计算最小角度
  const smallestAngle = maxAngle - minAngle;

  // 确定起始边和终止边
  const startRayIndex = angles.indexOf(minAngle);
  const endRayIndex = angles.indexOf(maxAngle);
  return {
      smallestAngle,
      startRay: rays[startRayIndex],
      endRay: rays[endRayIndex]
  };
}

const connectXorLine = (source:number,xorIds:any,result:any,selectEdge:any,xorEdge:any,state:StateInterface,num:string,type:string) => {
  let point 
  if(selectEdge._private.source._private.data.id===xorEdge._private.source._private.data.id){
    point='pointS' + num
  }else{
    point='pointT' + num
  }
  const selectSourcePos = selectEdge._private.source._private.position //节点位置，根据节点在虚线的上方还是下方判断虚线的正反
  let SX = result.startRay.x //虚线起始点位置
  let SY = result.startRay.y//虚线起始点位置
  let TX = result.endRay.x//虚线终点位置
  let TY = result.endRay.y//虚线终点位置
  let dataS:any = {
        id: point + selectEdge._private.data.id,
        label: '',
        type: 'edgePoint',
        parent: '',
        MMRef: null,
      };
    let nodePositionS = {
    x: SX,
    y: SY,
    };
    let dataT:any = {
        id: point + xorEdge._private.data.id,
        label: '',
        type: 'edgePoint',
        parent: '',
        MMRef: null,
      };
    let nodePositionT = {
    x: TX,
    y: TY,
    };
    if(cy.getElementById(point + selectEdge._private.data.id).length>0){
      cy.remove(cy.getElementById(point + selectEdge._private.data.id))
    }
    if(cy.getElementById(point + xorEdge._private.data.id).length>0){
      cy.remove(cy.getElementById(point + xorEdge._private.data.id))
    }
    addNode(cy, dataS, nodePositionS, currentMMNode);
    addNode(cy, dataT, nodePositionT, currentMMNode);
    const XorS = cy.getElementById(point + selectEdge._private.data.id)
    const XorT =  cy.getElementById(point + xorEdge._private.data.id)
    getSorAndTar(XorS,XorT)
    let direction
    const edgeType = type
    if(selectSourcePos.y<SY&&selectSourcePos.y<TY){//起点在终点上方
     if(SX<TX){
      direction = 'forword'
      getSorAndTar(XorS,XorT)
     }else{
      direction = 'reverse'
      getSorAndTar(XorT,XorS)
     }
    }else if(selectSourcePos.y>SY&&selectSourcePos.y>TY){//起点在终点下方
      if(SX>TX){
        direction = 'forword'
        getSorAndTar(XorS,XorT)
       }else{
        direction = 'reverse'
        getSorAndTar(XorT,XorS)
       }
    }else{//起点在终点中间
      if(selectSourcePos.x>SX&&selectSourcePos.x>TX){ //起点在右侧
        if(SY<TY){
          direction = 'forword'
          getSorAndTar(XorS,XorT)
        }else{
          direction = 'reverse'
          getSorAndTar(XorT,XorS)
        }
      }else if(selectSourcePos.x<SX&&selectSourcePos.x<TX){//起点在左侧
        if(SY<TY){
          direction = 'reverse'
          getSorAndTar(XorT,XorS)
        }else{
          direction = 'forword'
          getSorAndTar(XorS,XorT)
        }
      }else{
        const crossProduct = computedDeg(selectSourcePos,SX,SY,TX,TY)
        if(crossProduct<0){
          direction = 'forword'
          getSorAndTar(XorS,XorT)
        }else{
          direction = 'reverse'
          getSorAndTar(XorT,XorS)
        }
      }
    }
    const nodeDirection = 'source'
    xorCreate(source,num,nodeDirection,direction,edgeType, state,xorIds);
}

const connectXorLineT = (source:number,xorIds:any,result:any,selectEdge:any,xorEdge:any,state:StateInterface,num:string,type:string) => {
  let point 
  if(selectEdge._private.source._private.data.id===xorEdge._private.source._private.data.id){
    point='pointS' + num
  }else{
    point='pointT' + num
  }
  const selectSourcePos = selectEdge._private.source._private.position //节点位置，根据节点在虚线的上方还是下方判断虚线的正反
  let SX = result.startRay.x //虚线起始点位置
  let SY = result.startRay.y//虚线起始点位置
  let TX = result.endRay.x//虚线终点位置
  let TY = result.endRay.y//虚线终点位置
  let dataS:any = {
        id: point + selectEdge._private.data.id,
        label: '',
        type: 'edgePoint',
        parent: '',
        MMRef: null,
      };
    let nodePositionS = {
    x: SX,
    y: SY,
    };
    let dataT:any = {
        id: point + xorEdge._private.data.id,
        label: '',
        type: 'edgePoint',
        parent: '',
        MMRef: null,
      };
    let nodePositionT = {
    x: TX,
    y: TY,
    };
    addNode(cy, dataS, nodePositionS, currentMMNode);
    addNode(cy, dataT, nodePositionT, currentMMNode);
    const XorS = cy.getElementById(point +  selectEdge._private.data.id)
    const XorT =  cy.getElementById(point + xorEdge._private.data.id)
    getSorAndTar(XorS,XorT)
    let direction
    const edgeType = type
    if(selectSourcePos.y<SY&&selectSourcePos.y<TY){//起点在终点上方
     if(SX<TX){
      direction = 'forword'
      getSorAndTar(XorT,XorS)
     }else{
      direction = 'reverse'
      getSorAndTar(XorS,XorT)
     }
    }else if(selectSourcePos.y>SY&&selectSourcePos.y>TY){//起点在终点下方
      if(SX>TX){
        direction = 'forword'
        getSorAndTar(XorT,XorS)
       }else{
        direction = 'reverse'
        getSorAndTar(XorS,XorT)
       }
    }else{//起点在终点中间
      if(selectSourcePos.x>SX&&selectSourcePos.x>TX){ //起点在右侧
        if(SY<TY){
          direction = 'forword'
          getSorAndTar(XorT,XorS)
        }else{
          direction = 'reverse'
          getSorAndTar(XorS,XorT)
        }
      }else if(selectSourcePos.x<SX&&selectSourcePos.x<TX){//起点在左侧
        if(SY<TY){
          direction = 'reverse'
          getSorAndTar(XorS,XorT)
        }else{
          direction = 'forword'
          getSorAndTar(XorT,XorS)
        }
      }else{
        const crossProduct = computedDeg(selectSourcePos,SX,SY,TX,TY)
        if(crossProduct<0){
          direction = 'forword'
          getSorAndTar(XorT,XorS)
        }else{
          direction = 'reverse'
          getSorAndTar(XorS,XorT)
        }
      }
    }
    const nodeDirection = 'target'
    xorCreate(source,num,nodeDirection,direction,edgeType, state,xorIds);
}


const computedDeg = (selectSourcePos:any,SX:number,SY:number,TX:number,TY:number) =>{
  const crossProduct =(SX-selectSourcePos.x )*(TY-selectSourcePos.y) - (SY-selectSourcePos.y)*(TX-selectSourcePos.x)
  return crossProduct
}
const removeSorAndTar = (edge:any,dispatch:Function) => {
  const elements = cy.elements()
  const xorEdges = elements.filter((el:any) => el.data().type==='异或边' || el.data().type==='且连线');
  //移除交点
    const num = edge.data().source.slice(6,7)
    const regex = /(?:target|source|node|edge)(\d+i*)/g;
    const numbers = [];
    let match;
    while ((match = regex.exec(edge.data().id)) !== null) {
      // match[1] 是捕获组，即 source, node, edge 后面的数字和任意数量的i
      numbers.push(match[1]); // 将捕获的数字和任意数量的i添加到数组中
    }
    numbers.map((id:string)=>{
      //移除交点
      const crossId = 'corssS' + num +id
      const crossId2 = 'corssT' + num +id
      const sourceCorss = cy.getElementById(crossId)
      const targetCorss = cy.getElementById(crossId2)
        if(sourceCorss.data()!=undefined){
          deleteNodeAndEdge(sourceCorss,dispatch)
        }
        if(targetCorss.data()!=undefined){
          deleteNodeAndEdge(targetCorss,dispatch)
        }
    })
  const source = edge._private.source
  const target = edge._private.target
  deleteNodeAndEdge(edge,dispatch)
  if(edge._private.source._private.edges.length==0){
    deleteNodeAndEdge(source,dispatch)
  }
  if(edge._private.target._private.edges.length==0){
    deleteNodeAndEdge(target,dispatch)
  }
}
export {
    removeSorAndTar,
    addExcOR
  };