import { createFromIconfontCN } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import store from "@/store/index";
import {changeStyle} from '@/views/canvas/controller/changeStyle'
const IconFont = createFromIconfontCN({
  scriptUrl:'./static/iconfont.js'
})
const ChangeStyle = () => {
  const onClick = () => {
   let style = store.getState().style
   if(style==='cyStylesheet'){
    store.dispatch({type:'style' , data: 'stylesheetBlack'});
    changeStyle()
   }else if(style==='stylesheetBlack'){
    store.dispatch({type:'style' , data: 'stylesheetBlue'});
    changeStyle()
   }else if(style==='stylesheetBlue'){
    store.dispatch({type:'style' , data: 'stylesheetGreen'});
    changeStyle()
   }else if( style === 'stylesheetGreen'){
    store.dispatch({type:'style' , data: 'stylesheetRed'});
    changeStyle()
   }else{
    store.dispatch({type:'style' , data: 'cyStylesheet'});
    changeStyle()
   }
  };
  return (
    <Tooltip placement="bottom" title={'切换风格'}>
      <Button className='export-button' icon={<IconFont type="icon-qiehuanfengge"/>} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default ChangeStyle;