import styles from './page8.module.scss';
const Page5: React.FC = () => {
  return (
    <div className = {styles.page}>
      <div className={styles.pic}>
      </div>
      <div className={styles.hero}>
      <section>
      <h1 className='page-title'>知识地图 VS 思维导图</h1>
      <p className='page-description'>
      相比思维导图的发散思维，知识地图更能够表达事物之间的因果关系、先后关系等逻辑关系，
      并且能够区分静态事物和动态事物，并能表达动态事物的变化过程，更好的描述和表达动态过程和行动影响。
      </p>
      </section>
      </div>
    </div>
  );
};
  
  export default Page5;
    