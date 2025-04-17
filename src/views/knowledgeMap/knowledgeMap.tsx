import { useNavigate } from 'react-router-dom';
import styles from './knowledgeMap.module.scss'
import Header from '@/components/header/header'
import OpmList from './opmList/opmList';
import OpmClassification from './opmClassification/opmClassification';
const KnowledgeMap: React.FC = () => {
  const navigate = useNavigate();
    return (
      <div className={styles.homeback}>
       <Header/>
        <div className={styles.content}>
          <OpmClassification></OpmClassification>
          <OpmList></OpmList>
        </div>
      </div>
    );
  };
 
export default KnowledgeMap;
  