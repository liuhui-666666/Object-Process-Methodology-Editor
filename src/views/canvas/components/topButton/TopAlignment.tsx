import {createFromIconfontCN} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import store from "@/store/index";
const IconFont = createFromIconfontCN({
  scriptUrl:'./static/iconfont.js'
})
const TopAlignment = () => {
  const onClick = () => {
    const selectedList = store.getState().selectedList;
    const nodes = selectedList.filter((t:any)=>t.group()==='nodes')
    let list = nodes.filter((t:any)=>t.parent().length===0)
    if(list.length===0){
      list = nodes
    }
    const minY = list.reduce((min:number, item:any) => {
      let y
      if(item._private.bodyBounds.h!=undefined){
        y = item.position().y - item._private.bodyBounds.h/2
      }else{
        y = item.position().y - item._private.bodyBounds.h/2
      }
      return y < min ? y : min ;
    }, Infinity);
    list.map((item:any)=>{
       let y
       if(item._private.bodyBounds.h!=undefined){
        y = minY + item._private.bodyBounds.h/2
       }else{
        y = minY + item._private.bodyBounds.h/2
       }
       item.position('y',y)
    })
    const list2 = list.sort((a:any,b:any)=>a.position().x-b.position().x)
    let totalWidth = 0
    list2.map((item:any,index:number)=>{
      if(index==0 || index == (list2.length-1)){
        if(item._private.autoWidth!=undefined){
          totalWidth = totalWidth + (item._private.autoWidth/2)
        }else{
          totalWidth = totalWidth + (item._private.style.width.value/2)
        }
      }else{
        if(item._private.autoWidth!=undefined){
          totalWidth = totalWidth + item._private.autoWidth
        }else{
          totalWidth = totalWidth + item._private.style.width.value
        }
      }
    })
    if(list2.length >= 2){
      const disTanceX = list2[list2.length-1].position().x - list2[0].position().x
      const dif = disTanceX - totalWidth
      let Distance = dif/(list2.length-1)
      if(Distance < 30){
        Distance = 30
      }
      list2.map((item:any,index:number)=>{
        if(index>0){
          let width1 
          let width2
          if(list2[index-1]._private.autoWidth!=undefined){
            width1 = list2[index-1]._private.autoWidth/2
          }else{
            width1 = list2[index-1]._private.style.width.value/2
          }
          if(list2[index]._private.autoWidth!=undefined){
            width2 = list2[index]._private.autoWidth/2
          }else{
            width2 = list2[index]._private.style.width.value/2
          }
        let posx = width1 +list2[index-1].position().x + Distance + width2
        item.position('x',posx)
      }
      })
    }
  };
  return (
    <Tooltip placement="bottom" title={'顶部对齐'}>
      <Button className='export-button' icon={<IconFont type="icon-shangduiqi"/>} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default TopAlignment;