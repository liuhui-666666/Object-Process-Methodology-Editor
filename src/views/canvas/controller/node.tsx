import store from "@/store/index";

export const nodeParentInfo = () => {
   executeOncePerSecond()
    
};

let lastCall = 0; // 记录最后一次调用的时间戳
interface Element {
    group: () => string;
    parent:() => any;
    data():any;
    // 这里可以添加其他属性和方法
  }
function need() {
  const selectedElements: Element[] = store.getState().selectedList;
  var nodes = (selectedElements as Element[]).filter((t: Element) => t.group() === 'nodes');
  const parentIdList: Array<{ id: any; parentId: any }> = [];
  nodes.map((item:Element)=>{
    if(item.parent().length!==0){
        parentIdList.push({
            id:item.data().id,
            parentId:item.parent().data().id
        })
    }
  })
  //存储含有父节点的数据
  store.dispatch({type:'parentIdList' , data: parentIdList});
}

function executeOncePerSecond() {
  const now = Date.now(); // 获取当前时间戳
  // 判断当前时间与最后一次调用的时间戳的差值是否至少为1000毫秒（1秒）
  if (now - lastCall >= 1000) {
    need();
    // 更新最后一次调用的时间戳为当前时间
    lastCall = now;
  }
}


