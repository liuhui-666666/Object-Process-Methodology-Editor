// eventEmitter.ts
import { EventEmitter } from 'events';

// 创建一个继承自 EventEmitter 的类
class MyEmitter extends EventEmitter {}

// 实例化这个类
const emitter = new MyEmitter();

emitter.setMaxListeners(20);

// 导出这个实例，以便在其他文件中使用
export default emitter;