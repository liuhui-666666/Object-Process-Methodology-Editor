/**  
 * @file Top toolbar which contain: propagation selection, export to PNG button, 
 *    export to JSON button and import from JSON button. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Typography } from 'antd';
import React,{useEffect} from 'react';
import styles from './header.module.scss'
import { useReducerProps } from '@/views/canvas/components/App';
import User from '@/views/canvas/components/topButton/User'
import { ACTIONS } from '@/views/canvas/components/App';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Header: React.FC= () => {
  const navigate = useNavigate();

  const location = useLocation();
  
  // 打印完整路径（包含 search 和 hash）
  const pathname = location.pathname
  useEffect(() => {
  }, []);
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <div className={styles.logo}>
        </div>
        <div className={styles.title}>SmartDraw</div>
        {pathname==='/knowledgeMap' && (
        <div className={styles.introduce}>
        <span>我的知识地图</span>
        </div>
        )}
        {pathname==='/' && (
        <div className={styles.introduce}>
        <span onClick={() => navigate('/canvas')}>产品</span><span>社区</span>
        <span>定价</span><span onClick={() => navigate('/knowledgeMap')}>案例</span> 
        </div>
       )}
      </div>
      <div className={styles.right}>
        <div className={styles.backHome} onClick={() => navigate('/')}>首页</div>
        <User />
      </div>
    </div>
  );
};

export default Header;