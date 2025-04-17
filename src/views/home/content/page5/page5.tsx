import styles from './page5.module.scss';
const Page5: React.FC = () => {
  return (
    <div className = {styles.page}>
      <div className={styles.pic}>
      </div>
      <div className={styles.hero}>
      <section>
      <h1 className='page-title'>多层模式，管理复杂知识体系</h1>
      <p className='page-description'>
      SmartNavi具备逐层分解的图层管理模式，每一个图元均具备"展开"功能。
      左侧为分解树，树的每一节点均有视图，通过多层模式，控制每一个图层的知识复杂度。
      </p>
      </section>
      </div>
    </div>
  );
};
  
  export default Page5;
    