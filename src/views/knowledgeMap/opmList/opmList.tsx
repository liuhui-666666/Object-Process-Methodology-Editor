import { useNavigate } from 'react-router-dom';
import styles from './opmList.module.scss'
const OpmList: React.FC = () => {
  const navigate = useNavigate();
    return (
      <div className={styles.content}>
        <h1>知识地图列表</h1>
        <div className={styles.listBox}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
      </div>
    );
  };
 
export default OpmList;
  