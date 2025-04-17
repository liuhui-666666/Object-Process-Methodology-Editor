import { RouteObject } from 'react-router-dom'
import Center from '@/views/user/center'
import Canvas from '@/views/canvas/components/App'
import HomePage from '@/views/home/homepage';
import Login from '@/views/user/login'
import Register from '@/views/user/register'
import KnowledgeMap from '@/views/knowledgeMap/knowledgeMap'
import NotFound from '@/views/notFound/notFound'
import { AuthRoute } from "@/components/AuthRoute";

const routes: RouteObject[]=[
  {
    path: '/canvas',
    element: <HomePage/>
  },
  // 登陆
  {
    path: '/login',
    element: <Login/>
  },
  // 注册
  {
    path: '/register',
    element: <Register/>
  },
  // 画板
  {
    path: '/',
    element:
     <Canvas/>
  },
  // 我的知识地图
  {
    path: '/knowledgeMap',
    element:
     <KnowledgeMap/>
  },
  {
    path: '/center',
    element:
    <AuthRoute>
      <Center />
    </AuthRoute>,
  },
  {
    path: '*',
    element: 
        <NotFound />
  }
]


export default routes
