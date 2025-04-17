import {PlayCircleOutlined,PauseCircleOutlined} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { cy } from "@/views/canvas/components/DiagramCanvas";
import { addNode } from '@/views/canvas/controller/general';
import { masterModelRoot } from "@/views/canvas/model/node-model";
import { useState } from 'react';
import {exportGif} from '@/views/canvas/controller/gif'

let currentMMNode = masterModelRoot;

const StartRunning = () => {
  const [isRunning, setIsRunning] = useState(false);
  const runningOutlined = () => {
    setIsRunning(true);
    const edges = cy.edges().filter((edge:any)=>edge.data().type!=='异或边' || edge.data().type!=='且连线')
    const nodes = cy.nodes()
    let running = false
    let number = 2
    let duration = 560
    edges.map((edge:any)=>{
      if(edge._private.rstyle.linePts){
       if( edge._private.rstyle.linePts.slice().length*2>number){
        number = (edge._private.rstyle.linePts.slice().length-1)*2
        duration = (edge._private.rstyle.linePts.slice().length-1)*552
       }
      }
      if(edge._private.rstyle.bezierPts){
        if(edge._private.rstyle.bezierPts.slice().length*2>number){
          number = (edge._private.rstyle.bezierPts.slice().length-1)*2
          duration =( edge._private.rstyle.bezierPts.slice().length)*152
         }
       }
    })
    exportGif(cy, number, duration)
    nodes.map((item:any)=>{
      if(item.data().id.includes('start')){
        running = true
      }
    })
   if(!running){
    edges.map((edge:any)=>{
      if(!edge.rscratch().allpts){
        return
      }
      let time:number = 0
      let pointList:any = []
      if(edge._private.rstyle.bezierPts){
        time = 100
        pointList = edge._private.rstyle.bezierPts.slice()
        const numX = edge.rscratch().allpts.length-2
        const numY = edge.rscratch().allpts.length-1
        pointList.push({
          x:edge.rscratch().allpts[numX],
          y:edge.rscratch().allpts[numY]
        })
      }else if(edge._private.rstyle.linePts){
        time = 500
        pointList = edge._private.rstyle.linePts.slice()
      }else{
        pointList = [
          {x:edge.rscratch().allpts[0],
           y:edge.rscratch().allpts[1]
          },
          {x:edge.rscratch().allpts[2],
           y:edge.rscratch().allpts[3]
          }
        ]
        time = 500
      }
        //起始点动效
        const source  = edge.source()
        source.select()
        edge.select()
          setTimeout(()=>{
            edge.unselect()
            source.unselect()
          },20)
        let data:any = {
            id: edge.data().id+'start',
            label: '',
            type: 'info',
            parent: '',
            MMRef: null,
          };
        let nodePosition = {
        x: pointList[0].x,
        y: pointList[0].y,
        };
        addNode(cy, data, nodePosition, currentMMNode);
        let node = cy.getElementById( edge.data().id+'start' )
        for(let i=1;i<pointList.length;i++){
            const times = i-1
            setTimeout(()=>{
            node.animate({
                position: { x: pointList[i].x, y: pointList[i].y },
            },{
                duration: time
            });
            },times*(time+50))
        }
        console.log(pointList,pointList.length,time)
        const timer = (pointList.length-1)*(time+50)
        console.log(timer)
        setTimeout(() => {
          cy.remove(node)
          //设置运动结束动效
          const target  = edge.target()
          target.select()
          setTimeout(()=>{
            target.unselect()
          },90)
          setTimeout(()=>{
            target.select()
          },130)
          setTimeout(()=>{
            target.unselect()
          },200)
          const nodes = cy.nodes()
          const infoList = nodes.filter((node:any)=>node.data().type=='info')
          if(infoList.length == 0){
            setIsRunning(false);
          }
        }, timer);
    })
   }
  };
  const runningExitOutlined = () => {
    setIsRunning(false);
  };
  return (
    <div>
     {!isRunning && (
      <Tooltip placement="bottom" title={'开始'}>
      <Button className='export-button' icon={<PlayCircleOutlined />} onClick={runningOutlined} size='large' />
      </Tooltip>
    )}
    {isRunning && (
      <Tooltip placement="bottom" title={'停止'}>
        <Button className='export-button' icon={<PauseCircleOutlined />} onClick={runningExitOutlined} size='large' />
      </Tooltip>
    )}
  </div>
  );
};

export default StartRunning;