import {cy} from '@/views/canvas/components/DiagramCanvas'
import store from "@/store/index";
export const changeStyle = () => {
const style = store.getState().style
let np = '#000000' //过程边框
let npb = '#ffffff'//过程背景
let npS = '#000000' //被选中过程边框
let npSb = '#ffffff'//被选中过程背景
let ob = '#000000' //对象边框
let obb = '#ffffff' //对象背景
let obS = '#000000' //被选中对象边框
let obSb = '#ffffff' //被选中对象背景
let st = '#000000'
let stb = '#ffffff'
let stS = '#000000'
let stSb = '#ffffff'
let pr = '#000000'
let prb = '#ffffff'
let prS = '#000000'
let edge = 'grey'//边颜色
let edgeS = 'rgb(1,105,217)' //被选中边颜色
let prSbL = '#FAFAFA'//选中锁定视图背景色
switch(style){
case 'cyStylesheet':
 {
  np = 'DeepSkyBlue'
  npb = '#ffffff'
  npS = '#e6f7ff'
  npSb = '#ffffff'
  ob = 'green'
  obb = '#ffffff'
  obS = '#e6f7ff'
  obSb = '#ffffff'
  st = 'orange'
  stb = '#ffffff'
  stS = '#e6f7ff'
  stSb = '#ffffff'
  pr = '#c4e3f1'
  prb = 'rgb(235, 239, 243)'
  prS = '#e6f7ff'
  edge = 'grey'
  edgeS = 'rgb(1,105,217)'
 break;
 }
 case 'stylesheetBlack':
 {
  np = '#000000'
  npb = '#ffffff'
  npS = '#e6f7ff'
  npSb = '#ffffff'
  ob = '#000000'
  obb = '#ffffff'
  obS = '#e6f7ff'
  obSb = '#ffffff'
  st = '#000000'
  stb = '#ffffff'
  stS = '#e6f7ff'
  stSb = '#ffffff'
  pr = '#000000'
  prb = 'rgb(235, 239, 243)'
  prS = '#e6f7ff'
  edge = '#000000'
  edgeS = 'rgb(1,105,217)'
  break;
 }
 case 'stylesheetBlue':
 {
  np = 'rgb(8,161,217)'
  npb = 'rgb(206,236,247)'
  npS = '#e6f7ff'
  ob = 'rgb(117,189,66)'
  obb = 'rgb(204,239,220)'
  obS = '#e6f7ff'
  st = 'rgb(249,106,27)'
  stb = 'rgb(254,225,209)'
  stS = '#e6f7ff'
  pr = 'rgb(131,208,236)'
  prb = 'rgb(235, 239, 243)'
  prS = '#e6f7ff'
  edge = 'grey'
  edgeS = 'rgb(1,105,217)'
  break;
 }
 case 'stylesheetGreen':
 {
 np = 'rgb(242,168,2)'
 npb = 'rgb(233,224,179)'
 npS = '#e6f7ff'
 ob = 'rgb(0,112,192)'
 obb = 'rgb(204,226,242)'
 obS = '#e6f7ff'
 st = 'rgb(112,48,160)'
 stb = 'rgb(226,214,236)'
 stS = '#e6f7ff'
 pr = 'rgb(248,211,127)'
 prb = 'rgb(235, 239, 243)'
 prS = '#e6f7ff'
 edge = 'grey'
 edgeS = 'rgb(1,105,217)'
  break;
 }
 case 'stylesheetRed':
 {
 np = 'rgb(0,176,80)'
 npb = 'rgb(204,239,220)'
 npS = '#e6f7ff'
 ob = 'rgb(8,161,217)'
 obb = 'rgb(206,236,247)'
 obS = '#e6f7ff'
 st = 'rgb(249,106,27)'
 stb = 'rgb(254,225,209)'
 stS = '#e6f7ff'
 pr = 'rgb(127,215,167)'
 prb = 'rgb(235, 239, 243)'
 prS = '#e6f7ff'
 edge = 'grey'
 edgeS = 'rgb(1,105,217)'
 break;
 }
}
//选中状态集合
const nodesSelect = cy.nodes().filter((node:any)=>node.selected()===true)
//未选中状态集合
const nodesNotSelect = cy.nodes().filter((node:any)=>node.selected()===false)
//过程节点集合
const nodesProcessSelect = nodesSelect.filter((node:any)=>node.data().type=='process'||node.data().type=='processParent' || node.data().type=='processMax')
const nodesProcessNot = nodesNotSelect.filter((node:any)=>node.data().type=='process'||node.data().type=='processParent' || node.data().type=='processMax')
//对象节点集合
const nodesObjectSelect = nodesSelect.filter((node:any)=>node.data().type=='object'||node.data().type=='objectParent')
const nodesObjectNot = nodesNotSelect.filter((node:any)=>node.data().type=='object'||node.data().type=='objectParent')
//状态节点集合
const nodesStateSelect = nodesSelect.filter((node:any)=>node.data().type=='state')
const nodesStateNot = nodesNotSelect.filter((node:any)=>node.data().type=='state')
//视图节点集合
const nodesProjectSelect = nodesSelect.filter((node:any)=>node.data().type=='project')
const nodesProjectNot = nodesNotSelect.filter((node:any)=>node.data().type=='project')
//锁定的视图节点集合
const nodesProjectLockSelect = nodesSelect.filter((node:any)=>node.data().type=='projectlock')
const nodesProjectLockNot = nodesNotSelect.filter((node:any)=>node.data().type=='projectlock')

const edgesSelect = cy.edges().filter((edge:any)=>edge.selected()===true)
const edgeNotSelect = cy.edges().filter((edge:any)=>edge.selected()===false)

nodesProcessSelect.map((node:any)=>{
    node.style('border-color',npS)
})
nodesProcessNot.map((node:any)=>{
    node.style('border-color',np)
    node.style('background-color',npb)
})
nodesObjectSelect.map((node:any)=>{
    node.style('border-color',obS)
})
nodesObjectNot.map((node:any)=>{
    node.style('border-color',ob)
    node.style('background-color',obb)
})
nodesStateSelect.map((node:any)=>{
    node.style('border-color',stS)
})
nodesStateNot.map((node:any)=>{
    node.style('border-color',st)
    node.style('background-color',stb)
})
nodesProjectSelect.map((node:any)=>{
    node.style('border-color',prS)
})
nodesProjectNot.map((node:any)=>{
    node.style('border-color',pr)
    node.style('background-color',prb)
})
nodesProjectLockSelect.map((node:any)=>{
    node.style('border-color',prS)
    node.style('background-color',prSbL)
})
nodesProjectLockNot.map((node:any)=>{
    node.style('border-color',pr)
    node.style('background-color',prSbL)
})
edgesSelect.style({
  'line-color': edgeS,
  'target-arrow-color': edgeS, // 设置目标箭头的颜色为红色
  'source-arrow-color': edgeS, 
})
edgeNotSelect.style({
    'line-color': edge,
    'target-arrow-color': edge, // 设置目标箭头的颜色为红色
    'source-arrow-color': edge, 
  })
}