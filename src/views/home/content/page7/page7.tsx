import styles from './page8.module.scss';
const Page5: React.FC = () => {
  return (
    <div className = {styles.page}>
      <div className={styles.pic}>
      </div>
      <div className={styles.hero}>
      <section>
      <h1 className='page-title'>大模型AI智能生成知识地图</h1>
      <p className='page-description'>
      读取自然语言描述的文章、书籍等资料，AI自动生成知识地图。
      智能生成的行动地图可进行二次编辑，进行定制化修改。
      </p>
      </section>
      </div>
    </div>
  );
};
  
  export default Page5;
    