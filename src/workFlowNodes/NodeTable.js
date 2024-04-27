import React from 'react';

const NodeTable = ({options}) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description fs-6 fw-bold">Drag these nodes to canvas for building workflow</div>
      <div className="dndnode filterData fs-6" onDragStart={(event) => onDragStart(event, 'Filter Data')} draggable>
      Filter Data
      </div>
      <div className="dndnode fs-6" onDragStart={(event) => onDragStart(event, 'Wait')} draggable>
      Wait
      </div>
      <div className="dndnode convertFormat fs-6" onDragStart={(event) => onDragStart(event, 'Convert Format')} draggable>
      Convert Format
      </div>
      <div className="dndnode sendPOSTRequest fs-6" onDragStart={(event) => onDragStart(event, 'Send POST Request')} draggable>
      Send POST Request
      </div>


      {options.length > 0 && <div>
        <div className='fw-bold fs-6'>Selected Workflow</div>
        {options?.map((option, index)=>(
          <div className='fw-bold'>
            {index+1} {option}
            </div>
        ))}
      </div>}

    </aside>
  );
};

export default NodeTable