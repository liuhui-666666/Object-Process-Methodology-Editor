import styles from './page4.module.scss';
const Page4: React.FC = () => {
  return (
    <div className = {styles.page}>
      <div className={styles.pic}>
      </div>
      <div className={styles.hero}>
      <section>
      <h1 className='page-title'>在线动画，让流程动起来!</h1>
      <p className='page-description'>
      SmartDraw采用具备动态可运行能力，能够以动画的方式展示生成、消耗、状态转换、
      时序等逻辑关系，让知识地图更加生动和直观。
      </p>
      </section>
      </div>
    </div>
  );
};
  
  export default Page4;
    