import {TableOutlined} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import store from "@/store/index";

const CenterAlignment = () => {
  const onClick = () => {
    const selectedList = store.getState().selectedList;
    const nodes = selectedList.filter((t:any)=>t.group()==='nodes')
    const list = nodes.filter((t:any)=>t.parent().length===0)
    const list1 = list.sort((a:any,b:any)=>a.position().y-b.position().y)
    if(list1.length>2){
      const disTanceY = list1[list1.length-1].position().y - list1[0].position().y
      let Distance = disTanceY/(list1.length-1)
      if(Distance<120){
        Distance = 120
      }
      list1.map((item:any,index:number)=>{
        let posy = list1[0].position().y + Distance*index
        item.position('y',posy)
      })
    }
    const list2 = list.sort((a:any,b:any)=>a.position().x-b.position().x)
    if(list2.length>2){
      const disTanceX = list2[list2.length-1].position().x - list2[0].position().x
      let Distance = disTanceX/(list2.length-1)
      if(Distance<120){
        Distance = 120
      }
      list2.map((item:any,index:number)=>{
        let posx = list2[0].position().x + Distance*index
        item.position('x',posx)
      })
    }  
  };
  return (
    <Tooltip placement="bottom" title={'均匀分布'}>
      <Button className='export-button' icon={<TableOutlined />} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default CenterAlignment;