import GIF from "gif.js"

export const exportGif = (cy:any, numFrames:number, duration:number) =>{
  captureFrames(cy, numFrames, duration);
}

let pngWidth = 500
let pngHeight = 500

// 捕获多个状态
const captureFrames = (cy:any, numFrames:number, duration:number) => {
  const frames:any = [];
  const interval = duration / numFrames;
  
  for (let i = 0; i <= numFrames; i++) {
    setTimeout(() => {
      const png = cy.png({ 
        full: true,
        bg: 'white' // 设置背景颜色为白色
       });
       
       const img = new Image();
       img.src = png;
       
       img.onload = () => {
          pngWidth = img.width;
          pngHeight = img.height;
       };
      frames.push(png);
      if (frames.length > numFrames) {
        // 所有帧都捕获完毕，开始合成 GIF
        createGif(frames, 'cytoscape-animation.gif');
      }

      console.log(i * interval)
    }, i * interval);
  }
};

const createGif = (frames:any, filename:string) => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      // willReadFrequently: true,
      background: '#fff', // 当源图像透明时的背景色，默认为白色
      width: pngWidth, // 输出GIF的宽度，如果没有设置则自动检测
      height: pngHeight, // 输出GIF的高度，如果没有设置则自动检测
      workerScript: process.env.PUBLIC_URL + '/static/gif/gif.worker.js'
    });
    frames.forEach((frame:any, index:number) => {
        const img = new Image();
        img.src = frame;
        img.onload = () => {
          gif.addFrame(img, { delay: 100 }); // 每帧延迟 100 毫秒
          if (index === frames.length - 1) {
            console.log(gif,index)
            gif.on('finished', function(blob) {
              //保存为文件
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              a.click();
              URL.revokeObjectURL(url);
            });
            gif.render();
          }
        };
      });
};