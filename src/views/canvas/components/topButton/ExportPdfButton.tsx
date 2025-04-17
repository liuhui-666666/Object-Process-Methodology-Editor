/**  
 * @file Export PNG button. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
// @ts-ignore
import { saveAs } from "file-saver";
import { cy } from '@/views/canvas/components/DiagramCanvas';


const ExportPdfButton = () => {
    const onClick = async () => {
        try {
          const blobPromise = cy.pdf({
            // If false then only the visible part of the network will be exported.
            // If true then the entire network is exported regardless of the current zoom/pan.
            full: true, 

            // The background color to use, or none if false. 
            // Can be any CSS color value that's accepted by Cytoscape.js
            bg: false,

            // The paper size, see below for accepted values for these options.
            paperSize: 'A4', 
            orientation: 'PORTRAIT',

            // The width/height to use when the paperSize is set to 'CUSTOM'
            width: null,  // paper width  in "PostScript points", 72 units per inch
            height: null, // paper height in "PostScript points", 72 units per inch

            // The margin, default is 52 units which represents 3/4 of an inch.
            margin: 52,

            // There is limited support for the cytoscape-layers extension.
            // If this flag is true then any SVG layers registered with the cytoscape-layers 
            // extension will be included in the PDF export.
            includeSvgLayers: false,

            // If true will log debug info to the console.
            debug: false, 

            // The options below are temporary and will be removed in the future.
            save: true, // causes a save-as window to pop up when the PDF is ready to be downloaded 
            fileName: 'opm.pdf', 
            serif:'Times New Roman'
          });
          // 使用 await 获取 blob 对象
          const blob = await blobPromise;
          saveAs(blob, 'network.pdf', true);
        } catch (error) {
          console.error('Error exporting PDF:', error);
        }
      };
  return (
    <Tooltip placement="bottom" title={'导出PDF'}>
      <Button className='export-button' icon={<FilePdfOutlined />} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default ExportPdfButton;