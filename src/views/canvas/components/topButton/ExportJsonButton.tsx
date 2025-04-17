/**  
 * @file Export to JSON button. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { createFromIconfontCN } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { exportJson } from '@/views/canvas/controller/import-export';
const IconFont = createFromIconfontCN({
  scriptUrl:'./static/iconfont.js'
})

const ExportJsonButton = () => {
  const onClick = () => {
    exportJson()
  };
  return (
    <Tooltip placement="bottom" title={'导出项目文件'}>
      <Button className='export-button' icon={<IconFont type="icon-icon_shangchuanxiazai_xiazai"/>} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default ExportJsonButton;