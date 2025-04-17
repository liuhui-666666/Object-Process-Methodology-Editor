import { useNavigate } from 'react-router-dom';
import styles from './opmClassification.module.scss'
const OpmClassification: React.FC = () => {
  const navigate = useNavigate();
    return (
      <div className={styles.content}>
        <h1>知识地图分类</h1>
        <div className={styles.box}>

        </div>
      </div>
    );
  };
 
export default OpmClassification;
  