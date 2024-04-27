import React, { useState } from 'react';
import { FaFileCsv } from 'react-icons/fa'; 

let file

const CsvDropZone = ({ onCsvFileDrop }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

     file = e?.dataTransfer?.files[0];
    if (file?.type === 'text/csv') {
      onCsvFileDrop(file);
    } else {
      alert('Please drop a CSV file.');
    }
  };

  return (
    <div
    className={`border rounded p-3 mt-3 text-center cursor-pointer d-flex align-items-center justify-content-center ${
        file ? 'border-primary' : 'border-dashed'
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{height:'200px', width:'500px'}}
    >
        <FaFileCsv className="file-icon" />
      <p>{file?.name ? file?.name :'Drag and drop a CSV file here'}</p>
    </div>
  );
};

export default CsvDropZone;
