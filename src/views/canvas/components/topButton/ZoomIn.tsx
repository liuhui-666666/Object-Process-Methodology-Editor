import {createFromIconfontCN} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { ZoomIn } from '@/views/canvas/controller/zoom';
const IconFont = createFromIconfontCN({
  scriptUrl:'./static/iconfont.js'
})

const ZoomInIn = () => {
  const onClick = () => {
    ZoomIn()
  };
  return (
    <Tooltip placement="bottom" title={'缩小'}>
      <Button className='export-button' icon={<IconFont type="icon-suoxiao"/>} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default ZoomInIn;