import styles from './page6.module.scss';
const Page5: React.FC = () => {
  return (
    <div className = {styles.page}>
      <div className={styles.pic}>
      </div>
      <div className={styles.hero}>
      <section>
      <h1 className='page-title'>协同编辑，知识地图共创成为可能</h1>
      <p className='page-description'>
      SmartDraw采用云服务、多租户的架构，
      多个用户能够在线同时构建和维护一张知识地图实现复杂知识体系共创。
      </p>
      </section>
      </div>
    </div>
  );
};
  
  export default Page5;
    