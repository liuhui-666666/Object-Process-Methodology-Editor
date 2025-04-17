/**  
 * @file Classes of the model edges and edge arrays.
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { MMNode } from "./node-model";

export enum EdgeType {
  Consumption = '生成/消耗链接',
  Tagged = '时序链接',
  Effect = '影响链接',
  Instrument = '条件链接',
  Agent = '代理链接',
  Aggregation = '聚合-分散',
  Exhibition = '展示-表征',
  Generalization = '泛化-特化',
  Classification = '类化-实例化',
  Invocation = '触发链接',
  NotInstrument = '非条件链接',
  // NotConsumption = '非消耗链接',
  NotTagged = '非时序链接',
  RemarkTagged = '备注链接',
  fbTaggedImg = '双向标记',
  // abnormalImg = '超时异常',
  // exceptionImg = '超时例外',
  // AggregationNotAll = '聚合-分散(缺失)',
};

export const hierarchicalStructuralEdges = [
  EdgeType.Aggregation,
  EdgeType.Exhibition,
  EdgeType.Generalization,
  EdgeType.Classification,
  // EdgeType.AggregationNotAll,
];

class MMEdge {
  id: string;
  source: MMNode;
  target: MMNode;
  type: EdgeType;
  label: string;
  originalEdges: Array<MMEdge>;
  derivedEdges: Array<MMEdge>;
  deleted: boolean;
  propagation: boolean;
  preferedEdge: MMEdge | null;

  constructor(id: string, source: MMNode, target: MMNode, type: EdgeType, propagation: boolean, originalEdge: MMEdge | undefined = undefined, label: string = '') {
    this.id = id;
    this.source = source;
    this.target = target;
    this.type = type;
    this.label = label;
    this.originalEdges = originalEdge !== undefined ? [originalEdge] : [];
    this.derivedEdges = [];
    this.deleted = false;
    this.propagation = propagation;
    this.preferedEdge = null;
  }

  /**
   * Add a derived edge the .derivedEdge array.
   * @param derivedEdge
   */
  addDerivedEdge(derivedEdge: MMEdge) {
    this.derivedEdges.push(derivedEdge);
  }

  /**
   * Clear the .derivedEdge array. Handle deletion for each former derived edge.清除.derivedEdge数组。处理每个先前衍生边的删除。
   */
  removeAllDerived() {
    for (const derivedEdge of this.derivedEdges) {
      derivedEdgeArray.removeEdge(derivedEdge);
    }
    this.derivedEdges = [];
  }
}

class EdgeArray {
  edges: Array<MMEdge>;
  constructor() {
    this.edges = [];
  }

  /**
   * Add an edge to the edge array
   * @param newEdge 
   */
  addEdge(newEdge: MMEdge) {
    this.edges.push(newEdge);
  }

  /**
   * Set given edge as deleted and remove it from the edge array.
   * @param edge - Edge to be removed
   */
  removeEdge(edge: MMEdge) {
    edge.deleted = true;
    var index = this.edges.indexOf(edge);
    if (index !== -1) {
      this.edges.splice(index, 1);
    }
  }

  /**
   * Remove given edges. Used only with original edges.
   * @param edges - Original edges
   */
  removeOriginalEdges(edges: Array<MMEdge>) {
    for (const edge of edges) {
      this.removeEdge(edge);
    }
  }

  /**
   * Find all outgoing edges for a given model node.
   * @param node - Model node
   * @returns - Array of outgoing edges
   */
  findOutgoingEdges(node: MMNode): Array<MMEdge> {
    let returnArray: Array<MMEdge> = [];
    this.edges.forEach(edge => {
      if (edge.source == node)
        returnArray.push(edge);
    });
    return returnArray;
  };

  /**
   * Find all ingoing edges for a given model node.
   * @param node - Model node
   * @returns - Array of ingoing edges
   */
  findIngoingEdges(node: MMNode): Array<MMEdge> {
    let returnArray: Array<MMEdge> = [];
    this.edges.forEach(edge => {
      if (edge.target == node)
        returnArray.push(edge);
    });
    return returnArray;
  };

  /**
   * Find all related edges (ingoing and outgoing) for a given model node.
   * @param node - Model node
   * @returns - Array of related edges
   */
  findRelatedEdges(node: MMNode): Array<MMEdge> {
    let returnArray: Array<MMEdge> = [];
    returnArray.concat(this.findIngoingEdges(node));
    returnArray.concat(this.findOutgoingEdges(node));
    return returnArray;
  }

  /**
   * Query edge array and try to find given node's structural parent. Parent in aggragation, classification,...
   * @param node - Child node
   * @returns - Parent node or null
   */
  findStructuralParent(node: MMNode): MMNode | null {
    if (node.type == 'state')
      return node.parent as MMNode;
    for (const edge of this.edges) {
      if (hierarchicalStructuralEdges.includes(edge.type) && edge.target === node)
        return edge.source;
    }
    return null;
  }

  /**
   * Find an existing edge in master model based on given model nodes.
   * @param source 
   * @param target 
   * @returns - Found edge or null
   */
  findEdgeByEndpoints(source: MMNode, target: MMNode): MMEdge | null {
    const outgoingEdges = this.findOutgoingEdges(source);
    for (const edge of outgoingEdges) {
      if (edge.target === target)
        return edge;
    }
    return null;
  }
};

let originalEdgeArray = new EdgeArray();
let derivedEdgeArray = new EdgeArray();

//used when importing from JSON
const importEdgeArrays = (newEdgeArray: EdgeArray, newDerivedEdgeArray: EdgeArray) => {
  originalEdgeArray = newEdgeArray;
  derivedEdgeArray = newDerivedEdgeArray;
};

export { originalEdgeArray, derivedEdgeArray, MMEdge, EdgeArray, importEdgeArrays };