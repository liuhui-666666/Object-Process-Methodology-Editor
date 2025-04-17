/**  
 * @file Export PNG button. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { createFromIconfontCN } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
// @ts-ignore
import { saveAs } from "file-saver";
import { cy } from '@/views/canvas/components/DiagramCanvas';
const IconFont = createFromIconfontCN({
  scriptUrl:'./static/iconfont.js'
})

const ExportPngButton = () => {
  const onClick = () => {
    saveAs(cy.png({ full: true ,bg: 'white'}), "graph.png");
  };
  return (
    <Tooltip placement="bottom" title={'导出图片'}>
      <Button className='export-button' icon={<IconFont type="icon-daochutupian"/>} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default ExportPngButton;