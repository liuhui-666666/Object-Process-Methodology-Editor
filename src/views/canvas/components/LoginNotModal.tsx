/**  
 * @file Modal that appears on the Bring Connected option and displays all connections that could be added. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Button, Modal } from "antd";
import 'antd/dist/antd.css';
import { ACTIONS, StateInterface } from '@/views/canvas/components/App';
import { cy } from '@/views/canvas/components/DiagramCanvas';
import React,{useEffect, useState} from 'react'
import { getToken } from '@/utils/token';
import '@/css/loginModal.css'
import emitter from '@/utils/emiiter';

interface ModalProps {
  state: StateInterface;
  dispatch: Function;
};

const LoginNotModal: React.FC<ModalProps> = () => {
  const [isLogin, setIsLogin] = useState(false);
  const onLogin = () =>{
    setIsLogin(false)
    emitter.emit('login')
  }
  const createOpm = () =>{
    setIsLogin(false)
  }
  const importJson = () =>{
    setIsLogin(false)
    emitter.emit('importJson')
  }
  useEffect(()=>{
      if(getToken()){
       }else{
        setIsLogin(true)
       }
  },[])
  return (
    <div onContextMenu={(e) => {
      e.preventDefault();
    }}>

      <Modal
        visible={isLogin}
        footer={null}
        width={500}
        closable={false}
        centered = {true}
        mask = {true}
        maskStyle = {{background:"rgba(0,0,0,0.5)"}}
        className="loginModel"
      >
        <div className="loginBox">
        <Button className="loginModel" type="primary" onClick={onLogin}>登录</Button>
        <Button className="loginModel" type="primary" onClick={importJson}>导入数据</Button>
        <Button className="loginModel" type="primary" onClick={createOpm}>创建opm</Button>
        </div>
      </Modal>
    </div>
  );
};

export default LoginNotModal;