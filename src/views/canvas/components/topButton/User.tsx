import {UserOutlined,LockOutlined,AlertOutlined} from '@ant-design/icons';
import { Avatar, Tooltip, Button,Modal,Col,Row,Image,Input,Form,message,Checkbox,Dropdown, Space, Menu,ConfigProvider  } from 'antd';
import {register,getCaptchaImg,login,getUserInfo} from '@/service/user'
import React,{useEffect, useState} from 'react'
import type { FormProps,MenuProps} from 'antd';
import { useNavigate } from 'react-router-dom';
import '@/css/login.css';
import { getUuid, setUuid,setToken,getToken,setUsername } from '@/utils/token';
import {registerV2DTO,loginV2DTO,PeopleDTOList} from '@/service/user'
import store from "@/store/index";
import emitter from '@/utils/emiiter';
type FieldType = {
    username?: string;
    password?: string;
    code:string;
    confirmPassword:string;
  };
const User:React.FC=()=>{
    const [isLogin, setIsLogin] = useState(false);
    const [open, setOpen] = useState(false);
    const [openR,setOpenRegister] = useState(false);
    const [captchaCode, setCaptchaCode] = useState<string>('');
    const form = React.useRef(null);
    const [userName,setUserName] = useState<string>('')
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
      if (values.username !== undefined && values.password !== undefined && values.code!== undefined) {
        const params: loginV2DTO = {
          username: values.username,
          password: values.password,
          code: values.code,
          autoLogin:true,
          uuid:getUuid()!
        };
        login(params).then((response) => {
          if((response.data as any).code===200){
            setToken((response.data as any).token)
            setUsername(values.username)
            setIsLogin(true)
            setOpen(false)
            message.success('登录成功');
            store.dispatch({type:'login' , data: true});
            userInfo()
            emitter.emit('loginSuccess');
          }
        });
      } else {
        console.error('Username or password is undefined');
      }
    };
    const onFinishRegister: FormProps<FieldType>['onFinish'] = (values) => {
      if (values.username !== undefined && values.password !== undefined) {
        const params:registerV2DTO = {
          username : values.username,
          password:values.password,
          confirmPassword:values.confirmPassword,
          code: values.code,
          uuid:getUuid()!
        }
        register(params).then((response) => {
          if((response.data as any).code===200){
            setOpenRegister(false)
            message.success('注册成功');
            showModal()
          }
          if((response.data as any).code===500){
            message.error((response.data as any).msg);
          }
        });
      } else {
        console.error('Username or password is undefined');
      }
    };
    const showModal = async () => {
      setOpen(true);
      getCaptchaCode()
    };
    const getCaptchaCode = ()=>{
        getCaptchaImg().then((response)=>{
            const imgdata = `data:image/png;base64,${(response as any).data.img}`;
            setCaptchaCode(imgdata);
            if(response.data.uuid!==undefined){
              const uuid = response.data.uuid
              setUuid(uuid);
            }
        })
    }
    const userInfo = () =>{
       getUserInfo().then((response)=>{
       })
    }
    const handleCancel = () =>{
      setOpen(false)
    }
    const handleCancelRegister = () =>{
      setOpenRegister(false)
    }
    const openRegister = () =>{
      setOpen(false)
      setOpenRegister(true)
    }
    const navigate = useNavigate();
    const onClick: MenuProps['onClick'] = ({ key }) => {
      if(key=='2'){
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        setIsLogin(false)
        store.dispatch({type:'login' , data: false});
        showModal()
        emitter.emit('loginOut');
      }else{
        navigate('/center')
      }
    };
    const loginOutLogin = () =>{
      setIsLogin(false)
    }
    const menu = (
      <Menu onClick={onClick}>
        <Menu.Item key="1">个人中心</Menu.Item>
        <Menu.Item key="2">退出登录</Menu.Item>
      </Menu>
    );
  useEffect(()=>{
    emitter.on('login', showModal)
    emitter.on('loginOut',loginOutLogin);
    if(getToken()){
     setIsLogin(true)
     store.dispatch({type:'login' , data: true});
    }
    const getUsername = () => {
      const username = localStorage.getItem('username');
      return username !== null ? username : ''; // 提供一个默认值
    };
    if(getUsername()!==null){
     setUserName(getUsername)
    }   
  })
  return (
    <div >
     {isLogin && (
      <Dropdown overlay={menu}>
        <Space>
        <Avatar style={{ backgroundColor: '#40ffff33'}} icon={<UserOutlined  onClick={()=>userInfo()}/>} />
         <span className='userName'>{userName}</span>
        </Space>
      </Dropdown>
    )}
     {!isLogin && (
         <Tooltip placement="bottom" title={'登录'}>
         <Button
         className="loginButton"
         icon={<AlertOutlined />} size="large" onClick={()=>showModal()}>登录</Button>
       </Tooltip>
      )}
      <Modal
      visible={open}
      title="登录"
      onCancel={handleCancel}
      footer={null}
      >
      <Form
        ref={form}
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 480 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入账号!' }]}
        >
        <Input prefix={<UserOutlined />} placeholder="账号" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
        <Input.Password prefix={<LockOutlined />} type="password" placeholder="密码" />
        </Form.Item>
        <Form.Item>
        <Row>
        <Col flex={13}>
          <Form.Item  name="code"
          rules={[{ required: true, message: '请输入验证码!'}]}>
            <Input placeholder="请输入验证码" />
          </Form.Item>
            </Col>
            <Col flex={2}>
              <Image
              src={captchaCode}
              alt="验证码"
              style={{
                  display: 'inline-block',
                  verticalAlign: 'top',
                  cursor: 'pointer',
                  paddingLeft: '10px',
                  width: '100px',
                  height:'42px'
              }}
              preview={false}
              onClick={() => getCaptchaCode()}
              />
          </Col>
        </Row>
        </Form.Item>
      <Form.Item className="login-form-password">
      <Row>
        <Col flex={19}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>记住密码</Checkbox>
          </Form.Item>
        </Col>
        <Col flex={1}>
        <Button type="link" >忘记密码</Button>
        </Col>
      </Row>
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
      </Form.Item>
      <Form.Item className="login-form-password">
      <Row>
        <Col flex={19}>
        </Col>
        <Col flex={1}>
        <Button type="link" onClick={()=>{openRegister()}}>现在注册</Button>
        </Col>
      </Row>
      </Form.Item>
        </Form>
      </Modal>
      <Modal
      visible={openR}
      title="注册"
      // onOk={handleOk}
      onCancel={handleCancelRegister}
      footer={null}
      >
      <Form
        ref={form}
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 480 }}
        onFinish={onFinishRegister}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入账号!' }]}
        >
        <Input prefix={<UserOutlined />} placeholder="账号" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
        <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: '请确认密码!' }]}
        >
        <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
        </Form.Item>
        <Form.Item>
        <Row>
        <Col flex={13}>
          <Form.Item  name="code"
          rules={[{ required: true, message: '请输入验证码!'}]}>
            <Input placeholder="请输入验证码" />
          </Form.Item>
            </Col>
            <Col flex={2}>
              <Image
              src={captchaCode}
              alt="验证码"
              style={{
                  display: 'inline-block',
                  verticalAlign: 'top',
                  cursor: 'pointer',
                  paddingLeft: '10px',
                  width: '100px',
                  height:'42px'
              }}
              preview={false}
              onClick={() => getCaptchaCode()}
              />
          </Col>
        </Row>
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" className="login-form-button">
            注册
          </Button>
      </Form.Item>
      </Form>
      </Modal>
    </div>
  );
};

export default User;