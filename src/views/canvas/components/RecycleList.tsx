/**  
 * @file Propagation selection. Implemented with the use of Ant Design Selection component. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Modal,Table,Space,Tag, message,Pagination,Input } from 'antd';
import React,{useState,useEffect} from 'react';
import emitter from '@/utils/emiiter';
import {opmRecycle,opmRestore} from '@/service/user'
import type { TableProps } from 'antd';
import '@/css/loginModal.css'
const { Search } = Input;

let pagParams = {
    pageNum:1,
    pageSize:10,
    fileName:'',
  }
const RecycleList: React.FC = () => {
   const [isModalOpen,setModalOpen] = useState(false);
   const [list,setList] = useState<any[]>([])
   const [total,setTotal] = useState(0)
   const handleCancel = () =>{
    setModalOpen(false)
   }
    const handleShowRecycle = async () => {
    try {
      const response = await opmRecycle(pagParams);
      setList(response.data.rows); // 更新状态以触发重新渲染
      setTotal(response.data.total)
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch recycle list:', error);
    }
   };
   const columns: TableProps<any>['columns'] = [
    {
      title: '名称',
      dataIndex: 'opmName',
      key: 'opmName',
    },
    {
      title: '描述',
      dataIndex: 'fileDescription',
      key: 'fileDescription',
      render: (fileDescription) => <a>{fileDescription}</a>
    },
    {
      title: '操作',
      key: 'opmId',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={()=>handleRestore(record)}>恢复</a>
        </Space>
      ),
    },
  ];
  const handleRestore = async(item:any)=>{
    const params = {
        id:item.id
    }
    try {
     const response = await opmRestore(params);
     message.success(response.data.msg)
     handleShowRecycle()
     emitter.emit('reStore')
    } catch (error) {
    console.error('Failed to fetch recycle list:', error);
    }
  }
  const pagOnChange = (page:number,pageSize:number)=>{
    pagParams.pageNum=page
    pagParams.pageSize=pageSize
    handleShowRecycle()
  }
  const onSearch = (e:string) =>{
    pagParams.fileName = e
    handleShowRecycle()
  }
   useEffect(()=>{
    emitter.on('showRecycle',handleShowRecycle);
   },[])
  return (
    <Modal 
    title="回收站列表" 
    visible={isModalOpen} 
    onCancel={handleCancel} 
    width={650}
    footer={null}
    destroyOnClose ={true}
    >
    <Search placeholder="输入opm名称" allowClear onSearch={(e)=>onSearch(e)} style={{ width: 200 }} className="searchRecycle"/>
    <Table<any> columns={columns} dataSource={list} pagination ={false}/>
   <div className="pagBox">
   <Pagination defaultCurrent={1} total={total}  showTotal={(total) => `共 ${total} 条`} onChange={(page, pageSize)=>pagOnChange(page, pageSize)}/>
   </div>
  </Modal>
  );
};

export default RecycleList;