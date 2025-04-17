import {createFromIconfontCN} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useEffect,useState } from 'react';
const IconFont = createFromIconfontCN({
  scriptUrl:'./static/iconfont.js'
})
const ExitFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenOutlined = () => {
    if (document.documentElement.requestFullscreen) {  
      document.documentElement.requestFullscreen()
    }
  };
  const fullscreenExitOutlined = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  };
  useEffect(() => {
    const fullscreenChangeHandler = () => {
      // 监听全屏状态变化，自动更新状态
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    return () => {
      // 组件卸载时移除事件监听器
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
    };
  }, []);
  return (
    <div>
     {!isFullscreen && (
        <Tooltip placement="bottom" title={'全屏'}>
          <Button className='export-button' icon={<IconFont type="icon-quanping"/>} onClick={fullscreenOutlined} size='large' />
        </Tooltip>
      )}
      {isFullscreen && (
        <Tooltip placement="bottom" title={'退出全屏'}>
          <Button className='export-button' icon={<IconFont type="icon-tuichuquanping"/>} onClick={fullscreenExitOutlined} size='large' />
        </Tooltip>
      )}
    </div>
  );
};

export default ExitFullscreen;