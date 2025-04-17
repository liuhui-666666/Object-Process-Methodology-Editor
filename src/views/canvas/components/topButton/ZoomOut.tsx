import {createFromIconfontCN} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { ZoomOut } from '@/views/canvas/controller/zoom';
const IconFont = createFromIconfontCN({
  scriptUrl:'./static/iconfont.js'
})

const ZoomInOut = () => {
  const onClick = () => {
    ZoomOut()
  };
  return (
    <Tooltip placement="bottom" title={'放大'}>
      <Button className='export-button' icon={<IconFont type="icon-sousuofangda"/>} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default ZoomInOut;