import styles from './page2.module.scss';
const Page2: React.FC = () => {
  return (
    <div className = {styles.page}>
      <div className={styles.pic}>
      </div>
      <div className={styles.hero}>
      <section>
      <h1 className='page-title'>知识体系太复杂?SmartDraw帮你!</h1>
      <p className='page-description'>
      SmarDraw采用独创的多视图方法，包括结构视图、
      活动视图和交互视图，提供科学、标准的方法论，保证知识体系中内容的逻辑性、关联性和严谨
      </p>
      </section>
      </div>
    </div>
  );
};
  
  export default Page2;
    