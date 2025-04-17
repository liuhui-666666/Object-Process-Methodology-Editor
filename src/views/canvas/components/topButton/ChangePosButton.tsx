import {LayoutOutlined} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

const ChangePosButton = ({ myClick }: { myClick: () => void }) => {
  const onClick = () => {
    myClick();
  };
  return (
    <Tooltip placement="bottom" title={'切换布局'}>
      <Button className='export-button' icon={<LayoutOutlined />} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default ChangePosButton;