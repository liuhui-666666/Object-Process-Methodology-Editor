/**  
 * @file Class of the diagram tree model nodes.
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/


import { MMNode, masterModelRoot, MMRoot } from "./node-model";

class DiagramTreeNode {
  label: React.Key;
  labelData: React.Key;
  NodeId:any;
  labelId: number;
  parent: DiagramTreeNode | null;
  children: Array<DiagramTreeNode>;
  mainNode: MMNode | MMRoot;
  diagramJson: any;

  constructor(label: React.Key = '', mainNode: MMNode | MMRoot, parent = null,) {
    this.label = label;
    this.labelData = label
    this.labelId = 0;
    this.parent = parent;
    this.children = [];
    this.diagramJson = null;
    this.mainNode = mainNode;
  }

  /**
   * Goes through all nodes and finds the lowest not used ID.
   * Necessary when new diagrams are created after some were deleted.
   * @returns - Lowest available diagram id
   */
  _findLowestAvailableId(): number {
    const sortedChildren = this.children.sort((a, b) => {
      return a.labelId - b.labelId;
    });
    let index = 1;
    for (const child of sortedChildren) {
      if (child.labelId !== index)
        break;
      index++;
    }
    return index;
  }

  /**
   * Adds given diagram as a child element of this and sets this as a parent of the given diagram.
   * Label of the newly added diagram is determined.
   * @param child - Diagram node to be added
   */
  addChild(child: DiagramTreeNode) {
    function isMMNode(node: MMNode | MMRoot): node is MMNode {
      return (node as MMNode).label !== undefined;
    }
    let title:any
    if (isMMNode(child.mainNode)) {
      title = child.mainNode.label;
      child.NodeId = child.mainNode.id
      // ... 使用 title
    }
    child.parent = this;

    const index = this._findLowestAvailableId();
    child.labelId = index;
    child.label = this.labelData;
    child.labelData = this.labelData
    if (this !== diagramTreeRoot)
    child.labelData +='.'
    child.labelData += index.toString();
    if(this.label!=='模型'){
      child.label += '.';
    }
    // child.label += index.toString() + "-";
    // child.label += title.toString();
    child.label = title.toString();
    this.children.push(child);
  }

  /**
   * Remove the given child
   * @param child Diagram model node to be removed
   */
  removeChild(child: DiagramTreeNode) {
    let index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
}

let diagramTreeRoot = new DiagramTreeNode('模型', masterModelRoot);

//used when importing from JSON
const importDiagramTreeRoot = (newDiagramTreeRoot: DiagramTreeNode) => {
  diagramTreeRoot = newDiagramTreeRoot;
};

export { diagramTreeRoot, DiagramTreeNode, importDiagramTreeRoot };