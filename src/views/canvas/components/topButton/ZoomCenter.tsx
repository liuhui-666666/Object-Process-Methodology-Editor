import {createFromIconfontCN} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { ZoomCenter } from '@/views/canvas/controller/zoom';
const IconFont = createFromIconfontCN({
  scriptUrl:'./static/iconfont.js'
})

const ZoomInCenter = () => {
  const onClick = () => {
    ZoomCenter()
  };
  return (
    <Tooltip placement="bottom" title={'居中'}>
      <Button className='export-button' icon={<IconFont type="icon-juzhong"/>} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default ZoomInCenter;