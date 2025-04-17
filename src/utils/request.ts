import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { getToken,clearToken } from './token.js';
import {message} from 'antd';
import emitter from './emiiter';
interface AxiosTokenInstance extends AxiosInstance {
  // 如果有额外的方法或属性可以在这里扩展
}

// 创建一个axios实例
const instance: AxiosTokenInstance = axios.create({
  baseURL: '/',
  timeout: 5000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
    const token = getToken();

    // 如果token存在，则添加到请求头
    if (token !== undefined) {
      // 确保 headers 存在且是对象
      config.headers = config.headers || {};
      // 添加 Authorization 头
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 处理响应数据
    if(response.data.code===200){
      return response;
    }else if(response.data.code===401){
      message.error('请重新登录');
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      clearToken()
      emitter.emit('loginOut');
      return response;
    }else if(response.data.code===500){
      message.error((response.data as any).msg);
      return response;
    }else{
      return response;
    }
  },
  (error: AxiosError) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

const { request, get, post,put,delete:del } = instance;

// 暴露axios实例
export { request, get, post, put,del, instance };