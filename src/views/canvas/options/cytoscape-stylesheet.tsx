/**  
 * @file Cytoscape.js stylesheet defining visuals of diagram elements and edges.
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

export const cyStylesheet = [
  // node styling
  {
    selector: 'node',
    style: {
      'border-width': '2px',
      'background-color': 'white',
      'width': '70px',
      'height': '45 px',
      'text-valign': 'center',
      'taxi-direction': 'vertical',
      'ghost-offset-x': 3,
      'ghost-offset-y': 3,
      'ghost-opacity': 0.4,
      'text-wrap': 'wrap',
      'text-max-width': '100%',
      'text-halign': 'center',
      'line-height': '1.25'
    }
  },
  {
    selector: 'node[MMRef.label]',
    style: {
      'content': 'data(MMRef.label)',
    }
  },

  {
    selector: 'node[MMRef.essence]',
    style: {
      'ghost': 'data(MMRef.essence)',
    }
  },

  {
    selector: 'node[MMRef.affiliation]',
    style: {
      'border-style': 'data(MMRef.affiliation)',
    }
  },

  {
    selector: 'node[MMRef.state]',
    style: {
      'border-style': 'data(MMRef.state)',
      'border-width': 'data(MMRef.borderWidth)',
    }
  },

  {
    selector: 'node[type = "project"]',
    style: {
      'text-valign': 'top',
      'shape': 'rectangle',
      'border-color': '#c4e3f1',
      'padding': '5 px',
      'width': '480 px',
      'height': '300 px',
      'font-weight':600,
      'text-margin-y':"-5px",
      'background-color': 'rgb(235, 239, 243)'
    }
  },
  {
    selector: 'node[type = "info"]',
    style: {
      'shape': 'rectangle',
      'border-color': 'black',
      'padding': '1 px',
      'width': '2 px',
      'height': '2 px',
      'background-color': 'rgb(0, 0,03)'
    }
  },
  {
    selector: 'node[type = "edgePoint"]',
    style: {
      'shape': 'ellipse',
      'border-color': 'grey',
      'padding': '0 px',
      'width': '1 px',
      'height': '1 px',
      'background-color': 'grey'
    }
  },
  {
    selector: 'node[type = "corss"]',
    style: {
      'shape': 'ellipse',
      'border-color': 'grey',
      'padding': '2 px',
      'width': '2 px',
      'height': '2 px',
      'background-color': 'grey'
    }
  },
  {
    selector: 'node[type = "projectlock"]',
    style: {
      'text-valign': 'top',
      'shape': 'rectangle',
      'border-color': '#c4e3f1',
      'padding': '5 px',
      'width': '480 px',
      'height': '300 px',
      'font-weight':600,
      'text-margin-y':"-5px",
      'background-color': '#FAFAFA'
    }
  },
  {
    selector: 'node[type = "remark"]',
    style: {
      'shape': 'rectangle',
      'border-color': 'grey',
      'padding': '0 px',
      'min-zoomed-font-size':8,
      'border-width':'0',
      'color':'grey',
      'background-opacity':0
    }
  },
  {
    selector: 'node[type = "object"]',
    style: {
      'shape': 'rectangle',
      'border-color': 'rgb(111,173,70)',
      'padding': '5 px',
      'min-zoomed-font-size':8
    }
  },
  {
    selector: 'node[type = "objectParent"]',
    style: {
      'shape': 'rectangle',
      'border-color': 'rgb(111,173,70)',
      'padding': '5 px',
      'min-zoomed-font-size':8,
      'border-width': '4px',
    }
  },
  {
    selector: 'node[type = "process"]',
    style: {
      'shape': 'ellipse',
      'border-color': 'rgb(87,152,212)',
      'padding': '8 px',
      'min-zoomed-font-size':8
    }
  },
  {
    selector: 'node[type = "processParent"]',
    style: {
      'shape': 'ellipse',
      'border-color': 'rgb(87,152,212)',
      'padding': '8 px',
      'min-zoomed-font-size':8,
      'border-width': '4px',
    }
  },
  {
    selector: 'node[type = "processMax"]',
    style: {
      'shape': 'ellipse',
      'border-color': 'rgb(87,152,212)',
      'padding': '8 px',
      'min-zoomed-font-size':8,
      'border-width': '4px',
    }
  },
  {
    selector: 'node[type = "state"]',
    style: {
      'shape': 'round-rectangle',
      'border-color': 'orange',
      'min-width': 50,
      'min-zoomed-font-size':8
    }
  },
  {
    selector: 'node[type = "info"]',
    style: {
      'shape': 'ellipse',
      'border-color': 'black',
      'min-width': 0,
      'min-zoomed-font-size':0
    }
  },
  {
    selector: 'node[type = "project"]:selected',
    style: {
      'border-color': '#e6f7ff',
    }
  },
  {
    selector: 'node[type = "projectlock"]:selected',
    style: {
      'border-color': '#e6f7ff',
    }
  },
  {
    selector: 'node[type = "object"]:selected',
    style: {
      'border-color': 'LightGreen',
    }
  },
  {
    selector: 'node[type = "objectParent"]:selected',
    style: {
      'border-color': 'LightGreen',
    }
  },
  {
    selector: 'node[type = "process"]:selected',
    style: {
      'border-color': 'LightBlue',
    }
  },
  {
    selector: 'node[type = "processParent"]:selected',
    style: {
      'border-color': 'LightBlue',
    }
  },
  {
    selector: 'node[type = "processMax"]:selected',
    style: {
      'border-color': 'LightBlue',
    }
  },
  {
    selector: 'node[type = "state"]:selected',
    style: {
      'border-color': 'yellow',
    }
  },
  {
    selector: 'node[labelWidth]',
    style: {
      'width': 'data(labelWidth)',
      'height':'data(labelHeight)'
    }
  },
  {
    selector: 'node[labelHeight]',
    style: {
      'height':'data(labelHeight)'
    }
  },
  //compound nodes styling (objects with states and in-zoomed processes)
  {
    selector: '$node > node[type = "state"]',
    style: {
      'text-valign': 'top',
      'padding': 8,
      'min-width': 80,
      'min-height': 60
    }
  },
  {
    selector: '$node > node[type = "object"], $node > node[type = "process"],$node > node[type = "remark"],$node > node[type = "objectParent"],$node > node[type = "processParent"],$node > node[type = "processMax"]',
    style: {
      'text-valign': 'top',
      'padding': 8,
      'min-width': 480,
      'min-height': 300
    }
  },
  //edge styling
  {
    selector: 'edge',
    style: {
       //边类型
      'curve-style': 'bezier',
      'arrow-scale': 1.5,
    }
  },
  {
    selector: 'edge[label]',
    style: {
      'content': 'data(label)',
      'text-background-opacity': 0.6,
      'text-background-color': 'white',
      'text-background-shape': 'round-rectangle',
      'text-background-padding': 5,
      'min-zoomed-font-size':8,
    }
  },
  {
    selector: 'edge[type = "生成/消耗链接"]',
    style: {
      'target-arrow-shape': 'vee',
      'target-arrow-fill': 'hollow',
    }
  },

  {
    selector: 'edge[type = "影响链接"]',
    style: {
      'source-arrow-shape': 'vee',
      'target-arrow-shape': 'vee',
      'source-arrow-fill': 'hollow',
      'target-arrow-fill': 'hollow',
    }
  },
  {
    selector: `edge[type = "聚合-分散"],
               edge[type = "聚合-分散(缺失)"],
              edge[type = "展示-表征"], 
              edge[type = "泛化-特化"], 
              edge[type = "类化-实例化"]`,
    style: {
      "curve-style": "taxi",
      "taxi-direction": "downward",
      "taxi-turn": '130px',
      'source-arrow-shape': 'triangle',
      'arrow-scale': 3,
      'source-distance-from-node': '65px',
      'target-endpoint': 'outside-to-node'
    }
  },
  {
    selector: 'edge[type = "聚合-分散(缺失)"]',
    style: {
      'source-arrow-shape': 'triangle-cross',
      'source-distance-from-node': '15px',
    }
  },
  {
    selector: 'edge[type = "展示-表征"]',
    style: {
      'source-arrow-shape': 'triangle-inner-triangle',
      'source-arrow-fill': 'hollow',
      'source-distance-from-node': '50px',
    }
  },
  {
    selector: 'edge[type = "泛化-特化"]',
    style: {
      'source-arrow-fill': 'hollow',
      'source-distance-from-node': '35px',
    }
  },
  {
    selector: 'edge[type = "类化-实例化"]',
    style: {
      'source-arrow-shape': 'triangle-inner-circle',
      'source-arrow-fill': 'hollow',
      'source-distance-from-node': '20px',
    }
  },
  {
    selector: `edge[type = "异或边"]`,
    style: {
      'curve-style': 'unbundled-bezier',
      'line-style': 'dashed',
      'control-point-weights': '0.5 0.5',
      'control-point-distances': 'data(controlPointDistances)'
    }
  },
  {
    selector: `edge[type = "且连线"]`,
    style: {
      'curve-style': 'unbundled-bezier',
      'control-point-weights': '0.5 0.5',
      'control-point-distances': 'data(controlPointDistances)'
    }
  },
  {
    selector: 'edge[type = "条件链接"],edge[type = "工具链接"]',
    style: {
      'target-arrow-shape': 'circle',
      'target-arrow-fill': 'hollow',
    }
  },
  {
    selector: 'edge[type = "代理链接"]',
    style: {
      'target-arrow-shape': 'circle',
    }
  },
  {
    selector: 'edge[type = "时序链接"]',
    style: {
      'target-arrow-shape': 'chevron',
    }
  },
  {
    selector: 'edge[type = "非时序链接"]',
    style: {
      'target-arrow-shape': 'chevron-cross'
    }
  },
  {
    selector: 'edge[type = "触发链接"]',
    style: {
      "curve-style": "segments",
      "segment-weights":"0.70, 0.67",
      'segment-distances': [6,-6],
      'target-arrow-shape': 'triangle-backcurve',
      'target-arrow-fill': 'hollow',
    }
  },
  {
    selector: 'edge[type = "非条件链接"],edge[type = "非工具链接"]',
    style: {
      'target-arrow-shape': 'circle-tee',
      'arrow-scale':'1.5',
      'target-arrow-fill': 'hollow',
    }
  },
  {
    selector: 'edge[type = "非消耗链接"]',
    style: {
      'target-arrow-shape': 'vee-crossnew',
      'target-arrow-fill': 'hollow',
      'arrow-scale':'1.5',
    }
  },
  {
    selector: 'edge[type = "备注链接"]',
    style: {
      'target-arrow-shape': 'vee',
      'line-style': 'dashed',
    }
  },
  {
    selector: 'edge[type = "双向标记"]',
    style: {
      'source-arrow-shape': 'fbvee',
      'target-arrow-shape': 'fbvee'
    }
  },
  {
    selector: 'edge[type = "超时异常"]',
    style: {
      'target-arrow-shape': 'nortee'
    }
  },
  {
    selector: 'edge[type = "超时例外"]',
    style: {
      'target-arrow-shape': 'exctee'
    }
  },
  {
    selector: 'edge.eh-ghost-edge',
    style: {
      'target-arrow-shape': 'triangle'
    }
  },
  {
    selector: 'node[display], edge[display]',
    style: {
      'display': 'data(display)'
    }
  },
  //derived edges
  {
    selector: 'edge[MMRef.originalEdges.length > 0]',
    style: {
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
    }
  },
  // cytoscape-edge-handles extention styling, changes in styles while creating an edge and hovering over elements
  {
    selector: '.eh-source',
    style: {
      'border-width': 2,
    }
  },
  {
    selector: '.eh-hover',
    style: {
      'border-width': 3,
      'background-color': 'lightgrey'
    }
  },
  {
    selector: '.eh-preview, .eh-ghost-edge',
    style: {
      'background-color': 'grey',
      'line-color': 'grey',
      'target-arrow-color': 'grey',
      'source-arrow-color': 'grey'
    }
  },
  {
    selector: 'node[MMRef.background]',
    style: {
      'background-color':'data(MMRef.background)',
    }
  },

];