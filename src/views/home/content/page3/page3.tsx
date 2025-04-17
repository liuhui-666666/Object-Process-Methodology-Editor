import styles from './page3.module.scss';
const Page3: React.FC = () => {
  return (
    <div className = {styles.page}>
      <div className={styles.pic}>
      </div>
      <div className={styles.hero}>
      <section>
      <h1 className='page-title'>上手简单：9种元素表达万物</h1>
      <p className='page-description'>
      基于OPM对象过程方法的图形化语言，绘制您的知识体系。
      OPM是一种通用建模语言，已成为ISO 19450国际标准，具备严谨、标准的语义约束。
      9种元素，包括7种关系元素和2种节点元素，用于描述任何知识，无论多么复杂。
      </p>
      </section>
      </div>
    </div>
  );
};
  
  export default Page3;
    