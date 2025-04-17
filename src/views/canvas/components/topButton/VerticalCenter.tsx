import {createFromIconfontCN} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import store from "@/store/index";
const IconFont = createFromIconfontCN({
  scriptUrl:'./static/iconfont.js'
})
const VerticalCenter = () => {
  const onClick = () => {
    const selectedList = store.getState().selectedList;
    const nodes = selectedList.filter((t:any)=>t.group()==='nodes')
    let list = nodes.filter((t:any)=>t.parent().length===0)
    if(list.length===0){
      list = nodes
    }
    const minX = list.reduce((min:number, item:any) => {
      return item.position().x < min ? item.position().x : min;
    }, Infinity);
    const maxX = list.reduce((max:number, item:any) => {
      return item.position().x > max ? item.position().x :max;
      }, -Infinity);
      const x = (minX + maxX)/2
      list.map((item:any)=>{
      item.position('x',x)
      })
    const list1 = list.sort((a:any,b:any)=>a.position().y-b.position().y)
    let totalHeight = 0
    list1.map((item:any,index:number)=>{
      if(index==0 || index == (list1.length-1)){
        if(item._private.autoHeight!=undefined){
          totalHeight = totalHeight + (item._private.autoHeight/2)
        }else{
          totalHeight = totalHeight + (item._private.style.height.value/2)
        }
      }else{
       if(item._private.autoHeight!=undefined){
        totalHeight = totalHeight + item._private.autoHeight
       }else{
        totalHeight = totalHeight + item._private.style.height.value
       }
      }
    })
    if(list1.length>=2){
      const disTanceY = list1[list1.length-1].position().y - list1[0].position().y
      const dif = disTanceY - totalHeight
      let Distance = dif/(list1.length-1)
      if(Distance <30 ){
        Distance = 30
      }
      list1.map((item:any,index:number)=>{
        if(index>0){
          let height1 
          let height2
          if(list1[index-1]._private.autoHeight!=undefined){
            height1 = list1[index-1]._private.autoHeight/2
          }else{
            height1 = list1[index-1]._private.style.height.value/2
          }
          if(list1[index]._private.autoHeight!=undefined){
            height2 = list1[index]._private.autoHeight/2
          }else{
            height2 = list1[index]._private.style.height.value/2
          } 
          let posy = height1 + list1[index-1].position().y + Distance + height2
          item.position('y',posy)
        }
      })
    }
  };
  return (
    <Tooltip placement="bottom" title={'垂直居中'}>
      <Button className='export-button' icon={<IconFont type="icon-Vertical"/>} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default VerticalCenter;