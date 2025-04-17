/**  
 * @file Modal that appears when new edges are created. It displays options of edge types that a user can select. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Card, Image, List, Modal } from "antd";
import 'antd/dist/antd.css';
import React from 'react';
import { edgeCreate, edgeCreateCancel } from '@/views/canvas/controller/edge';
import { EdgeType } from '@/views/canvas/model/edge-model';
import agentImg from '@/static/edge-type-images/agent.svg';
import aggregationImg from '@/static/edge-type-images/aggregation.svg';
import classificationImg from '@/static/edge-type-images/classification.svg';
import consumptionResultImg from '@/static/edge-type-images/consumption-result.svg';
import effectImg from '@/static/edge-type-images/effect.svg';
import exhibitionImg from '@/static/edge-type-images/exhibition.svg';
import generalizationImg from '@/static/edge-type-images/generalization.svg';
import instrumentImg from '@/static/edge-type-images/instrument.svg';
import taggedImg from '@/static/edge-type-images/tagged.svg';
import invocationImg from '@/static/edge-type-images/invocation.svg';
import NotInstrument from '@/static/edge-type-images/notInstrument.svg';
// import NotConsumption from '@/static/edge-type-images/notConsumption.svg';
import NotTaggedImg from '@/static/edge-type-images/notTagged.svg';
import RemarkTagged from '@/static/edge-type-images/remark.svg';
import fbTaggedImg from '@/static/edge-type-images/fbTagged.svg';
// import abnormalImg from '@/static/edge-type-images/abnormal.svg';
// import exceptionImg from '@/static/edge-type-images/exception.svg';
// import lackImg from '@/static/edge-type-images/lack.svg';

import { ACTIONS, StateInterface } from '@/views/canvas/components/App';


interface ModalProps {
  state: StateInterface;
  dispatch: Function;
};

interface EdgeData {
  name: EdgeType;
  img: string;
};

const EdgeTypeSelectionModal: React.FC<ModalProps> = ({ state, dispatch }) => {
  const imgSet = [
    consumptionResultImg,
    taggedImg,
    effectImg,
    instrumentImg,
    agentImg,
    aggregationImg,
    exhibitionImg,
    generalizationImg,
    classificationImg,
    invocationImg,
    NotInstrument,
    // NotConsumption,
    NotTaggedImg,
    RemarkTagged,
    fbTaggedImg,
    // abnormalImg,
    // exceptionImg,
    // lackImg
  ];
  const EdgeTypeArray = Object.values(EdgeType);

  const edgeData = EdgeTypeArray.map((type: EdgeType, index: number) => {
    return {
      'name': type,
      'img': imgSet[index]
    };
  });

  const cancelModal = () => {
    edgeCreateCancel();
    dispatch({ type: ACTIONS.EDGE_TYPE_SELECTION, payload: false });
  };
  return (
    <div onContextMenu={(e) => {
      e.preventDefault();
    }}>

      <Modal
        visible={state.showEdgeTypeSelectonModal}
        // title="Choose an edge type:"
        title="选择一个边类型"
        onCancel={cancelModal}
        footer={null}
        width={600}
      >
        <div
        id="scrollableDiv"
        style={{
          height: 400,
          overflow: 'auto',
          padding: '10px 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
        >
        <List
          grid={{
            gutter: 12,
            column: 3
          }}
          dataSource={edgeData as any}
          renderItem={(edge: EdgeData) => (
            <List.Item>
              <Card
                headStyle={{ fontSize: 10, paddingLeft: 15 }}
                hoverable
                title={edge.name}
                bodyStyle={{
                  padding: '0px',
                  height: '50px',
                  marginTop: '10px',
                  marginBottom: '5px',
                  textAlign: 'center'

                }}
                onClick={() => {
                  edgeCreate(edge.name, state);
                  dispatch({ type: ACTIONS.EDGE_TYPE_SELECTION, payload: false });
                }}>
                <Image
                  src={edge.img}
                  preview={false}
                  height={50}
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
      </Modal>
    </div>
  );
};

export default EdgeTypeSelectionModal;
