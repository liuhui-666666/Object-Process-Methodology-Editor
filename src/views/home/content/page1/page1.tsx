import styles from './page1.module.scss';
import '@/css/page.css'
import { useNavigate } from 'react-router-dom';

const Page1: React.FC = () => {
    const navigate = useNavigate();
  return (
    <div className = {styles.page}>
    <div className = {styles.content}>
    <div className={styles.hero}>
      <section>
      <h1 className={styles.title}>绘制您的知识地图--系统化管理知识体系</h1>
      <p className='description'>
        SmartDraw是一种智能化、可视化绘制知识体系的工具，绘制的成果是一张多层级的知识体系知识网络，我们称为"知识地图"。
        知识地图由2种类型的节点和7种类型的边组成，具备简单易学、表达直观、严谨、标准、强大的特点，
        运用"系统思维"解决知识碎片化问题，帮助您更好的构筑和管理复杂知识体系。
      </p>
      </section>
      <div className={styles.btnContent}>
        <div style={{background:"green"}} onClick={() => navigate('/canvas')}>
         开始免费绘制
        </div>
        <div style={{background:"blue"}}>
         什么是“知识地图”
        </div>
      </div>
    </div>
    <div className = {styles.pic}>
    </div>
    </div>
    <div className = {styles.card}>
      ISO19450
    </div>
    </div>
  );
};
  
  export default Page1;
    