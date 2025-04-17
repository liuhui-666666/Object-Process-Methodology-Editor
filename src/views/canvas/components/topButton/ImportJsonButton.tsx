/**  
 * @file Export from JSON button. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { createFromIconfontCN } from '@ant-design/icons';
import { Button, Tooltip, Upload } from 'antd';
import React, { useEffect,useRef } from 'react';
import { importJson } from '@/views/canvas/controller/import-export';
import { useReducerProps } from '@/views/canvas/components/App';
import emitter from '@/utils/emiiter';
const IconFont = createFromIconfontCN({
  scriptUrl:'./static/iconfont.js'
})

const dummyRequest = ({ file, onSuccess }: any) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const ImportJsonButton: React.FC<useReducerProps> = ({ state, dispatch }) => {
  const inputRef = useRef<any>(null); //
  const onChange = (evt: any) => {
    if (evt.file.status === 'done') {
      const file = evt.file.originFileObj;
      const reader = new FileReader();
      reader.onload = function () {
        importJson(reader.result, dispatch)
      };
      reader.readAsText(file);
    }
  };
  const handleImport = () =>{
    inputRef.current?.click();
  }
  useEffect(()=>{
    emitter.on('importJson',handleImport)
  },[])
  return (
    <Upload  customRequest={dummyRequest} showUploadList={false} onChange={onChange}>
      <Tooltip placement="bottomLeft" title={'导入项目文件'}>
        <Button  ref={inputRef} className='export-button' icon={<IconFont type="icon-icon_shangchuanxiazai_shangchuan"/>} size='large'/>
      </Tooltip>
    </Upload>
  );
};

export default ImportJsonButton;