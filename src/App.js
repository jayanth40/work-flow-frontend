import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkFlowCanvas from './workFlowNodes/WorkFlowCanvas';
import FileUploadPage from './fileUplaod/FileUploadPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WorkFlowCanvas />} />
        <Route path="/file-upload" element={<FileUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
