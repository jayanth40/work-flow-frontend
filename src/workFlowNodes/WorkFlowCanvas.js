import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './nodeStyle.css';
import NodeTable from './NodeTable';
import axios from 'axios';
import { Link } from 'react-router-dom';

const initialNodes = [];

const WorkFlowCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const saveWorkflow = async () => {
    try {
      setIsLoading(true);
      const data = {
        name: name,
        operations: nodes.map(node => node.data.label)
      };

      const response = await axios.post('http://localhost:8000/api/create-sequence', data);
      setShowSuccessToast(true);
      setToastMessage('Workflow saved successfully');
      setName('');
      setNodes([]);
      setEdges([]);
    } catch (error) {
      setShowErrorToast(true);
      setToastMessage('Failed to save workflow');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="dndflow" style={{ margin: '50px' }}>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            >
              <Controls />
            </ReactFlow>
          </div>
          <NodeTable options={nodes.map(node => node.data.label)} />
        </ReactFlowProvider>
      </div>
      <div className='d-flex justify-content-between mx-5' style={{height:'40px'}}>
      <Link to="/file-upload" className="btn btn-primary btn-sm d-flex align-items-center">Upload file</Link>

        <div class="input-group mb-3 w-50">
          <input type="text" class="form-control" placeholder="Type Workflow name here..." value={name} aria-label="Workflow name" onChange={(e) => {
            setName(e.target.value)
          }} />
          <button disabled={isLoading} class="btn btn-primary" onClick={saveWorkflow}>
            {isLoading && <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>}
            Run Workflow
          </button>
        </div>
      </div>


      {showSuccessToast && (
        <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" style={{ backgroundColor: '#198754' }}>
          <div className="toast-header">
            <strong className="me-auto">Success</strong>
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowSuccessToast(false)} style={{ color: '#fff' }}></button>
          </div>
          <div className="toast-body">
            <span style={{ marginRight: '5px' }}><i className="bi bi-check-circle-fill" style={{ color: '#fff' }}></i></span>
            {toastMessage}
          </div>
        </div>
      )}

      {showErrorToast && (
        <div className="toast show bg-danger text-white" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">Error</strong>
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowErrorToast(false)}></button>
          </div>
          <div className="toast-body">
            {toastMessage}
          </div>
        </div>
      )}

    </>
  );
};

export default WorkFlowCanvas;
