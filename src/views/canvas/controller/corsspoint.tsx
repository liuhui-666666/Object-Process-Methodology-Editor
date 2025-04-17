import { cy } from "@/views/canvas/components/DiagramCanvas";
import { addNode,deleteNodeAndEdge } from '@/views/canvas/controller/general';
import { masterModelRoot } from "@/views/canvas/model/node-model";
import {removeSorAndTar,addExcOR} from '@/views/canvas/controller/xorGeneral'

let currentMMNode = masterModelRoot;
const crosspoint = (dispatch:Function) => {
    const edges = cy.edges().filter((edge:any)=>edge.data().type!='异或边' || edge.data().type!='且连线')
    const points:any = []
    edges.map((edge:any)=>{
    if(edge._private.rstyle.srcX!=undefined){
     points.push({
     x1:edge._private.rstyle.srcX,
     y1:edge._private.rstyle.srcY,
     x2:edge._private.rstyle.tgtX,
     y2:edge._private.rstyle.tgtY
    })
    }
    })
    if(points.length===2){
      const A = {
            x:points[0].x1,
            y:points[0].y1
      }
      const B = {
            x:points[0].x2,
            y:points[0].y2
      }
      const C = {
        x:points[1].x1,
        y:points[1].y1
  }
      const D = {
            x:points[1].x2,
            y:points[1].y2
      }
      const corssPoint = computedCrossPoint(A,B,C,D)
      const nodes = cy.nodes().filter((node:any)=>node.data().type=='corss')
      if(corssPoint&&nodes.length===0){
        console.log('交点为',corssPoint)
        let data:any = {
            id: 'corss',
            label: '',
            type: 'corss',
            parent: '',
            MMRef: null,
          };
        addNode(cy, data, corssPoint, currentMMNode);
      }else if(corssPoint&&nodes.length>=0){
        nodes.map((node:any)=>{
            node.position(corssPoint)
        })
      }else{
        console.log('没有交点')
      }
    }
};

//根据两线端点计算交点
const computedCrossPoint = (A:any,B:any,C:any,D:any) => {
    const denominator = (B.x - A.x) * (D.y - C.y) - (D.x - C.x) * (B.y - A.y);
    if (denominator === 0) {
        // Lines are parallel or coincident
        return null;
    }
    const ua = ((C.x - A.x) * (D.y - C.y) - (D.x - C.x) * (C.y - A.y)) / denominator;
    const ub = ((C.x - A.x) * (B.y - A.y) - (B.x - A.x) * (C.y - A.y)) / denominator;
  
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      // Intersection does not occur on the line segments
      return null;
    }
  
    // Intersection point
    const x = A.x + ua * (B.x - A.x);
    const y = A.y + ua * (B.y - A.y);
    return { x, y };
}

const computedSelectEles = (target:any,dispatch:Function) =>{
  const elements = cy.elements()
  const selectedList = elements.filter((el:any) => el.selected()); 
  const xorEdges = elements.filter((el:any) => el.data().type==='异或边' || el.data().type==='且连线');
  if(selectedList.length===0&&target.data().type!=undefined){
    //选中节点为0，鼠标选中节点target
    removeAndSave(target,xorEdges,dispatch)
  }else if(selectedList.length>0&&target.data().type!=undefined){
    if(target.selected()===false){
      removeAndSave(target,xorEdges,dispatch)
    }else{
      selectedList.map((target:any)=>{removeAndSave(target,xorEdges,dispatch)})
      console.log('target',target.selected()) 
    }
  }
}
const removeAndSave = (target:any,xorEdges:any,dispatch:Function) =>{
  xorEdges.map((edge:any)=>{
    const regex = /(?:target|source|node|edge)(\d+i*)/g;
    const numbers = [];
    let match;
    while ((match = regex.exec(edge.data().id)) !== null) {
      // match[1] 是捕获组，即 source, node, edge 后面的数字和任意数量的i
      numbers.push(match[1]); // 将捕获的数字和任意数量的i添加到数组中
    }
    numbers.map((id:string)=>{
      //移除异或边
      //情况1 移动相关节点
      matchRemove(id,edge,target,dispatch)
     //情况2 移动相关父节点
     try {
      target._private.parent.map((node:any)=>{
        matchRemove(id,edge,node,dispatch)
      })
     } catch (error) {
      // console.log(error,target._private.parent)
     }
     //情况3 移动相关子节点
     try {
      target._private.children.map((node:any)=>{
        matchRemove(id,edge,node,dispatch)
      })
     } catch (error) {
      // console.log(error,target._private.children)
     }
    })
  })
}

const matchRemove =(id:string,edge:any,target:any,dispatch:Function) =>{
  if(id == target.data().id){
    const xorList = localStorage.getItem('xorIdList')
    let xorIdList
    if(xorList!=null){
      xorIdList = JSON.parse(xorList)
    }
    xorIdList.push(
      {id:edge.data().id,
        source:edge.data().source,
        target:edge.data().target,
        type:edge.data().type
      }
      ) 
     localStorage.setItem('xorIdList',JSON.stringify(xorIdList))
     removeSorAndTar(edge,dispatch)
   }
}
const updateXor = (state:any,dispatch:Function) =>{
    let xorList = localStorage.getItem('xorIdList')
    if(xorList!==null){
      let xorIdList = JSON.parse(xorList)
      xorIdList.map((item:any)=>{
        const direction = item.id.slice(8,14)
        const regex = /(?:source|target)(\d+i*)/g;
        const numbers = [];
        let match;
        while ((match = regex.exec(item.id)) !== null) {
          // match[1] 是捕获组，即 source, node, edge 后面的数字和任意数量的i
          numbers.push(match[1]); // 将捕获的数字和任意数量的i添加到数组中
        }
        const targetNodeID = numbers[0]
        const regex1 = /(?:edge)(\d+i*)/g;
        const numbers1 = [];
        let match1;
        while ((match1 = regex1.exec(item.id)) !== null) {
          // match[1] 是捕获组，即 source, node, edge 后面的数字和任意数量的i
          numbers1.push(match1[1]); // 将捕获的数字和任意数量的i添加到数组中
        }
        const selectId = numbers1
        const num = item.source.slice(6,7)
        let distance:number
        if(num === '1'){
          distance = 20
        }else{
          distance = 30
        }
        const edgeId1 = item.source.slice(7)
        const edgeId2 = item.target.slice(7)
        const edge1 = cy.getElementById(edgeId1)
        const edge2 = cy.getElementById(edgeId2)
        if(direction==='source'){
          setTimeout(()=>{
            if(edge1.length==0){
              return
            }
            //判断是否异或边两边起点不一致
            if(edge1._private.source.data().id!==edge2._private.source.data().id){
              return
            }
            addExcOR('sameSource',targetNodeID,selectId,state,distance,num,item.type)
          },10)
        }else{
         setTimeout(()=>{
           //判断是否异或边两边终点不一致
          if(edge1._private.target.data().id!==edge2._private.target.data().id){
            return
          }
          addExcOR('sameTarget',targetNodeID,selectId,state,distance,num,item.type)
         },10)
        }
      })
      xorIdList = []
      localStorage.setItem('xorIdList',JSON.stringify(xorIdList))
    }
}

//计算异或边交点
const createCrossPoint = (edge:any) =>{
  const regex = /(?:edge)(\d+i*)/g;
  let numbers = [];
  let match;
  while ((match = regex.exec(edge.data().id)) !== null) {
    // match[1] 是捕获组，即 source, node, edge 后面的数字和任意数量的i
    numbers.push(match[1]); // 将捕获的数字和任意数量的i添加到数组中
  }
  const Sid = edge.data().source.slice(7)
  const Tid = edge.data().target.slice(7)
  numbers = numbers.filter((id:string)=>id!=Sid)
  numbers = numbers.filter((id:string)=>id!=Tid)
  //计算numbers 内id的边与edge的交点
  if(numbers.length>0){
    numbers.map((id:string)=>{
      const xorEdge = cy.getElementById(id)
      const pos = {
        x1:xorEdge._private.rstyle.srcX,
        y1:xorEdge._private.rstyle.srcY,
        x2:xorEdge._private.rstyle.tgtX,
        y2:xorEdge._private.rstyle.tgtY
      }
      const A = {
        x:pos.x1,
        y:pos.y1
      }
      const B = {
        x:pos.x2,
        y:pos.y2
      }
      setTimeout(()=>{
        const pos1 = edge._private.rstyle.bezierPts
        if(pos1==undefined){
          return
        }
        pos1.forEach((item:any,index:number)=>{
         if(index<pos1.length-1){
          const C = {
            x:pos1[index].x,
            y:pos1[index].y
          }
          const D = {
            x:pos1[index+1].x,
            y:pos1[index+1].y
          }
          const corssPoint = computedCrossPoint(A,B,C,D)
          if(corssPoint!=null){
            const Id = edge.data().target.slice(5,7) +id
            createCrossNode(Id,corssPoint)
            return
          }
         }
        })
      },20)
    })
  }
}

const createCrossNode = (id:string,corssPoint:any)=>{
  let data:any = {
      id: 'corss' + id,
      label: '',
      type: 'corss',
      parent: '',
      MMRef: null,
    };
  addNode(cy, data, corssPoint, currentMMNode);
}
export {
    crosspoint,
    computedCrossPoint,
    computedSelectEles,
    updateXor,
    createCrossPoint
  };