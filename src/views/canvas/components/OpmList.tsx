/**  
 * @file Diagram tree located in the left sidebar. Implemented with the use of Ant Design Tree component. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/
// import { saveAs } from "file-saver";
import React, { useState,useEffect,useRef } from 'react';
import { cy } from "@/views/canvas/components/DiagramCanvas";
import { Avatar, List, Input, Button,message,Modal,Form,Space,Pagination,Dropdown,Menu} from 'antd';
import { EditOutlined,FolderAddOutlined,BulbTwoTone,DownSquareOutlined } from '@ant-design/icons';
import img from '@/static/images/title.svg'
import { getToken } from '@/utils/token';
import {opmList,editOpm,saveOpm,opmV2DTO,getOpmData,opmCopy,markStar,historyOPM,markStop,deleteOpm,opmInfo} from '@/service/user'
import { importJson,exportOpmData } from '@/views/canvas/controller/import-export';
import { useReducerProps } from '@/views/canvas/components/App';
import emitter from '@/utils/emiiter';
import '@/css/loginModal.css';
import { ACTIONS, currentDiagram,reducerInitState } from "@/views/canvas/components/App";
import { importMMRoot, masterModelRoot, MMNode, MMRoot } from '@/views/canvas/model/node-model';
import { DiagramTreeNode, diagramTreeRoot, importDiagramTreeRoot } from '@/views/canvas/model/diagram-tree-model';
import { derivedEdgeArray, originalEdgeArray, EdgeArray, importEdgeArrays, MMEdge } from '@/views/canvas/model/edge-model';
import { eleCounter, ElementCounter } from '@/views/canvas/controller/elementCounter';
import { replacer, reviver } from 'telejson';

const { TextArea } = Input;
const { Search } = Input;
let params:any = {}
let pagParams = {
  pageNum:1,
  pageSize:10,
  opmName:''
}
const data1: Item[] = [];
let totalSize = 100
const opmDataFirst = {"masterModelRoot":{"children":[],"_constructor-name_":"MMRoot"},"originalEdgeArray":{"edges":[],"_constructor-name_":"EdgeArray"},"derivedEdgeArray":{"edges":[],"_constructor-name_":"EdgeArray"},"diagramTreeRoot":{"label":"模型","labelData":"模型","labelId":0,"parent":null,"children":[],"mainNode":"_duplicate_[\"masterModelRoot\"]","diagramJson":{"elements":{},"data":{},"zoomingEnabled":true,"userZoomingEnabled":true,"zoom":1,"minZoom":1e-50,"maxZoom":1e+50,"panningEnabled":true,"userPanningEnabled":true,"pan":{"x":0,"y":0},"boxSelectionEnabled":true,"renderer":{"name":"canvas"},"wheelSensitivity":0.1},"_constructor-name_":"DiagramTreeNode"},"eleCounter":"1"}
let opmJson:string
interface Item {
  opmId:string;
  opmDataId:string;
  opmName: string;
  fileDescription: string;
}
const OpmList: React.FC<useReducerProps> = ({ state, dispatch }) => {
    const [data, setItems] = useState(data1);
    const [editIndex, setEditIndex] = React.useState<number>(-1);
    const [editIndexDes, setEditIndexDes] = React.useState<number>(-1);
    const [isOpen, setOpen] = useState(false);
    const [title,setTitle] = useState('');
    const [openIndex,setOpenIndex] = React.useState<number>(-1);
    const [isModalOpen,setModalOpen] = useState(false);
    const [isButtonDisabled,setButtonDisabled] = useState(true);
    const [width,setWidth] = useState('200px')
    const  handleEdit = () => {
        setEditIndex(-1); // 取消编辑模式
        editOpm(params).then((response)=>{
            if((response.data as any).code==200){
              message.success('修改成功')
              getOpmList()
            }
          })
    };
    const  handleEditDes = () => {
      setEditIndexDes(-1); // 取消编辑模式
      editOpm(params).then((response)=>{
          if((response.data as any).code==200){
            message.success('修改成功')
            getOpmList()
          }
        })
  };
    const handleEditChange = (e:any, id:String) => {
        const newData = data.map((item:any) => {
          if (item.opmId === id) {
            return { ...item, opmName: e.target.value }; // 更新名称
          }
          return item;
        });
        params.opmName = e.target.value
        setItems(newData); 
    };
    const handleEditChangeDes = (e:any, id:String) =>{
      const newData = data.map((item:any) => {
        if (item.opmId === id) {
          return { ...item, describe: e.target.value }; // 更新名称
        }
        return item;
      });
      params.describe = e.target.value
      setItems(newData); 
    }
    const handleEditClick = (e:any,index:number) => {
        const param = {
          opmId:e.opmId
        }
        getOpmData(param).then((response:any)=>{
          params = {
            opmName:e.opmName,
            opmDataId:e.opmDataId,
            opmId:e.opmId,
            describe:e.fileDescription===null?'':e.fileDescription,
            opmData:response.data.data.opmData
            }
            setEditIndex(index);
        })
      };
    const handleEditClickDes = (e:any,index:number) => {
        const param = {
          opmId:e.opmId
        }
        getOpmData(param).then((response:any)=>{
          params = {
            opmName:e.opmName,
            opmDataId:e.opmDataId,
            opmId:e.opmId,
            describe:e.fileDescription===null?'':e.fileDescription,
            opmData:response.data.data.opmData
            }
            setEditIndexDes(index);
        })
       
      };
      
    const  handleOpenClick =(e:any) =>{
      params = {
        opmName:e.opmName,
        opmDataId:e.opmDataId,
        opmId:e.opmId,
        describe:e.fileDescription,
        opmData:e.opmData
      }
      const param = {
        opmId:e.opmId
      }
      emitter.emit('sendOpmName',e.opmName)
      setButtonDisabled(false)
      getOpmData(param).then((response:any)=>{
        importJson(response.data.data.opmData, dispatch)
        message.success('打开成功')
      })
    }
    interface Item {
        opmId:string;
        opmDataId:string;
        opmName: string;
        fileDescription:string
    }
    const getOpmList = () =>{
        setOpen(true)
        opmList(pagParams).then((response:any)=>{
          // const list: Item[] = [];
          const list:any = [];
          if((response.data as any).code==200){
            totalSize = (response.data as { total: number }).total;
           (response.data as any).rows.map((item:any)=>{
            list.push({
              opmId:item.id,
              opmDataId:item.opmDataId,
              opmName:item.opmName,
              fileDescription:item.fileDescription,
              top:item.top,
              star:item.star,
              password:item.password              
            })
           })
           setItems(list)
           setOpenIndex(-1)
          }
         })
    }
    const loginOut = () =>{
        setOpen(false)
    }
    const addOpm = () =>{
      opmJson = JSON.stringify(opmDataFirst)
      setModalOpen(true)
    }
    const handleCancel = () =>{
      setModalOpen(false)
    }
    const onFinish = (values:any) =>{
       const params:opmV2DTO = {
            opmName: values.name,
            describe:values.fileDescription,
            opmData:opmJson
          }
        saveOpm(params).then((response)=>{
        if((response.data as any).code==200){
            message.success('操作成功')
            setModalOpen(false);
            getOpmList()
        }
        })
    }
    const opmData = ()=>{
      const json = cy.json()
      delete json.style;
      currentDiagram.diagramJson = json 
      const data = {
        masterModelRoot: masterModelRoot,
        originalEdgeArray: originalEdgeArray,
        derivedEdgeArray: derivedEdgeArray,
        diagramTreeRoot: diagramTreeRoot,
        eleCounter: eleCounter.value,
      };
      //@ts-ignore
       return JSON.stringify(data, replacer({allowClass:true, allowFunction:false}))
    }
    const saveOldOpm = () =>{
      params.opmData=opmData()
      handleEdit()
    }
    const saveNewOpm = () =>{
        const json = cy.json()
        delete json.style;
        currentDiagram.diagramJson = json 
        const data = {
          masterModelRoot: masterModelRoot,
          originalEdgeArray: originalEdgeArray,
          derivedEdgeArray: derivedEdgeArray,
          diagramTreeRoot: diagramTreeRoot,
          eleCounter: eleCounter.value,
        };
        //@ts-ignore
        opmJson = JSON.stringify(data, replacer({allowClass:true, allowFunction:false}))
        setModalOpen(true)
    }
    const pagOnChange = (page:number, pageSize:number) =>{
        pagParams.pageNum=page
        pagParams.pageSize=pageSize
        getOpmList()
    }
    const onSearch = (e:any) =>{
     pagParams.opmName = e
     getOpmList()
    }
    const exportOpm = (item:Item) =>{
      const param = {
        opmId:item.opmId
      }
      getOpmData(param).then((response:any)=>{
        const data =response.data.data.opmData
        exportOpmData(item.opmName,data)
      })
    }
    const handleOpmCopy = (item:Item) =>{
      const param = {
        opmId:item.opmId
      }
      opmCopy(param).then((response:any)=>{
        message.success('创建成功')
        getOpmList()
      })
    }
    const markStarOpm = (item:Item) =>{
      const param = {
        opmId:item.opmId,
        markStar:true
      }
      markStar(param).then((response:any)=>{
        // message.success('创建成功')
        getOpmList()
      })
    }
    const handleHistoryOPM = (item:Item) =>{
      const param = {
        opmId:item.opmId
      }
      historyOPM(param).then((response:any)=>{
       
      })
    }
    const markStopOpm = (item:Item)=>{
      const param = {
        opmId:item.opmId,
        markStop:true
      }
      markStop(param).then((response:any)=>{
        message.success('操作成功')
        getOpmList()
      })
    }
    const handleDeleteOpm = (item:Item) =>{
      if(params.opmId === item.opmId){
        emitter.emit('noOpmName');
      }
      deleteOpm(item.opmId).then((response:any)=>{
        message.success('删除成功')
        const opmData = JSON.stringify(opmDataFirst)
        importJson(opmData,dispatch)
        getOpmList()
      })
    }
    const handleOpmInfo = (item:Item) =>{
      const param = {
        opmId:item.opmId
      }
      opmInfo(param).then((response:any)=>{
        message.success('操作成功')
      })
    }
    const handleMenuClick =(e:any,item:Item) =>{
      console.log(item)
      switch(e.key){
        case "1":{ //打开
          handleOpenClick(item)
          return
        }
        case '2':{//查看版本
          handleHistoryOPM(item)
          return
        }
        case '3':{//创建副本
          handleOpmCopy(item)
          return
        }
        case '4':{//导出
          exportOpm(item)
          return
        }
        case '5':{//标星
          markStarOpm(item)
          return
        }
        case '6':{//置顶
          markStopOpm(item)
          return
        }
        case '7':{//删除
          handleDeleteOpm(item)
          return
        }
        case '8':{//属性
          handleOpmInfo(item)
          return
        }
       }
    }
    useEffect(()=>{
     emitter.on('loginSuccess',getOpmList);
     emitter.on('loginOut',loginOut);
     emitter.on('reStore',getOpmList);
     emitter.on('updateListBarWidth',(e)=>{
      setWidth(`${e-100}px`)
     })
     if(getToken()){
        getOpmList()
     }
    },[])
  return (
    <div>
       {isOpen && (
       <div className="addButtonBox">
          <Button className="addButton" type='primary' onClick={()=>addOpm()} icon={<FolderAddOutlined />} >新建</Button>
          <Button className="addButton" type='primary' disabled={isButtonDisabled} onClick={()=>saveOldOpm()} icon={<FolderAddOutlined/>} >保存</Button>
          <Button className="addButton" type='primary' onClick={()=>saveNewOpm()} icon={<FolderAddOutlined />} >另存</Button>
       </div>
       )}
      {isOpen && (
        <div>
         <Search placeholder="输入opm名称" allowClear onSearch={(e)=>onSearch(e)} style={{width:width}}/>
          <List
          className='listHeight'
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => {
            const menu = (
              <Menu onClick={(e) => handleMenuClick(e,item)}>
                <Menu.Item key="1">打开</Menu.Item>
                {/* <Menu.Item key="2">查看版本</Menu.Item> */}
                <Menu.Item key="3">创建副本</Menu.Item>
                <Menu.Item key="4">导出</Menu.Item>
                {/* <Menu.Item key="5">标星</Menu.Item> */}
                <Menu.Item key="6">置顶</Menu.Item>
                <Menu.Item key="7">删除</Menu.Item>
                {/* <Menu.Item key="8">属性</Menu.Item> */}
              </Menu>
            );
           const placement = index < 6 ? "bottomRight" : "topRight";
           return(
            <List.Item
            actions={[
             <div>
              <Dropdown overlay={menu} placement={placement}>
              <Space>
              <DownSquareOutlined />
              </Space>
              </Dropdown>
             </div>
            ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={img} />}
                title={
                  editIndex === data.indexOf(item) ? (
                    <Input
                      defaultValue={item.opmName}
                      onChange={(e) => handleEditChange(e, item.opmId)}
                      onBlur={handleEdit}
                      onPressEnter={handleEdit}
                      maxLength={9}
                      showCount
                    />
                  ) : (
                    <span>{item.opmName}
                    <EditOutlined onClick={() => {
                      handleEditClick(item,index);}}/>
                    </span>
                  )
                }
                description={
                  editIndexDes === data.indexOf(item) ? (
                    <Input
                      defaultValue={item.fileDescription}
                      onChange={(e) => handleEditChangeDes(e, item.opmId)}
                      onBlur={handleEditDes}
                      onPressEnter={handleEditDes}
                      maxLength={16}
                      showCount
                    />
                  ) : (
                    <span>{item.fileDescription}
                    <EditOutlined onClick={() => {
                      handleEditClickDes(item,index);}}/>
                    </span>
                  )
                }
              />
            </List.Item>
           )
          }}
           />
         <Pagination 
         className='pagButton'
         simple defaultCurrent={pagParams.pageNum} total={totalSize} onChange={(page, pageSize)=>pagOnChange(page, pageSize)}/>
        </div>
      )}
      {!isOpen && (
       <div className="notLogin"><Space><BulbTwoTone /></Space>&nbsp;&nbsp;请先登录！</div>
       )}
     <Modal 
        title="保存项目文件" 
        visible={isModalOpen} 
        onCancel={handleCancel} 
        width={350}
        footer={null}
        destroyOnClose ={true}
        >
        <Form name="nest-messages" onFinish={onFinish}>
          <Form.Item name="name" label="请输入名称"
            rules={[{ required: true, message: '请输入名称!' }]}
          >
            <Input maxLength={9} showCount/>
          </Form.Item>
          <Form.Item name="fileDescription" label="请输入描述"
           rules={[{ required: true, message: '请输入描述!' }]}
          >
            <TextArea rows={2} placeholder="最多输入两行" maxLength={18} showCount/>
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit" className="login-form-button">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OpmList;