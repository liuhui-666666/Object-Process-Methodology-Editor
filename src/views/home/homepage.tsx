import { useNavigate } from 'react-router-dom';
import styles from './homePage.module.scss'
import Header from '@/components/header/header'
import Page1 from '@/views/home/content/page1/page1'
import Page2 from '@/views/home/content/page2/page2'
import Page3 from '@/views/home/content/page3/page3'
import Page4 from '@/views/home/content/page4/page4'
import Page5 from '@/views/home/content/page5/page5'
import Page6 from '@/views/home/content/page6/page6'
const HomePage: React.FC = () => {
  const navigate = useNavigate();
    return (
      <div className={styles.homeback}>
       <Header/>
       <div className={styles.content}>
       <Page1/>
       <Page2/>
       <Page3/>
       <Page4/>
       <Page5/>
       <Page6/>
       </div>
      </div>
    );
  };

export default HomePage;
  