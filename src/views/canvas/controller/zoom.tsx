
import { cy } from "@/views/canvas/components/DiagramCanvas";

export const ZoomOut = () => {
  var currentZoomLevel = cy.zoom();  
  // 在当前缩放级别基础上放大两倍  
  var newZoomLevel = currentZoomLevel * 1.2;  
  // 使用新的缩放级别来放大视图  
  var centerPosition = cy.center();
  cy.animate({
    zoom: newZoomLevel,
    center: centerPosition,
    duration: 300
  }, { 
    easing: 'ease-in-out', // 动画的缓动函数
    complete: function () {
        // 动画完成后的回调函数，如果需要的话
    }
  });
}

export const ZoomIn = () => {
  var currentZoomLevel = cy.zoom();  
  // 在当前缩放级别基础上放大两倍  
  var newZoomLevel = currentZoomLevel * 0.84;  
  // 使用新的缩放级别来放大视图  
  var centerPosition = cy.center();
  cy.animate({
    zoom: newZoomLevel,
    center: centerPosition,
    duration: 300
  }, { 
    easing: 'ease-in-out', // 动画的缓动函数
    complete: function () {
        // 动画完成后的回调函数，如果需要的话
    }
  });
}

export const ZoomCenter = () => {
  cy.center()//居中
}