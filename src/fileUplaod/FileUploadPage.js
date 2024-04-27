import React, { useEffect, useState } from 'react';
import CsvDropZone from './CsvDropZone';
import Select from 'react-select';
import axios from 'axios';
import { Link } from 'react-router-dom';


const FileUploadPage = () => {
    const [workflowOptions, setWorkflowOptions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [file, setFile] = useState(null)
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [message, setMessage] = useState('')

    const handleCsvFileDrop = (droppedFile) => {
        console.log('Dropped CSV file:', droppedFile);
        setFile(droppedFile); // Set the dropped file to the state
    };

    const handleSelectChange = selectedOption => {
        setSelectedOption(selectedOption);
        console.log(selectedOption, 'selected ioption')
    };


    const handleRunWorkflow = async () => {
        if (!selectedOption || !file) return;

        setIsProcessing(true);

        const formData = new FormData();
        formData.append('csvFile', file, file.name);

        let convertedData = null;

        try {
            const valueArray = selectedOption?.value;
            for (const operation of valueArray) {
                let successMessage = '';
                let errorMessage = '';

                try {
                    switch (operation) {
                        case 'Filter Data':
                            await axios.post('http://localhost:8000/api/convert-to-lowercase', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });
                            successMessage = 'Filter Data operation succeeded';
                            setShowSuccessToast(true)
                            setMessage(successMessage)
                            break;
                        case 'Wait':
                            await axios.get('http://localhost:8000/api/wait');
                            successMessage = 'Wait operation succeeded';
                            setShowSuccessToast(true)
                            setMessage(successMessage)
                            break;
                        case 'Convert Format':
                            const response = await axios.post('http://localhost:8000/api/convert-to-json', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });
                            convertedData = response.data;
                            successMessage = 'Convert Format operation succeeded';
                            setShowSuccessToast(true)
                            setMessage(successMessage)
                            break;
                        case 'Send POST Request':
                            if (!convertedData) throw new Error('Converted data is missing');
                            await axios.post('https://requestcatcher.com/', { data: convertedData });
                            successMessage = 'Send POST Request operation succeeded';
                            setShowSuccessToast(true)
                            setMessage(successMessage)
                            break;
                        default:
                            console.error('Invalid operation:', operation);
                            errorMessage = `Invalid operation: ${operation}`;
                    }
                } catch (error) {
                    setShowErrorToast(true)
                    setMessage(error.message)
                    errorMessage = `Error in ${operation} operation: ${error.message}`;
                }
            }
        } catch (error) {
            // Display error toast for any unexpected errors during workflow execution
            console.error('Error executing workflow:', error);

        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        const fetchWorkflowOptions = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:8000/api/sequences');
                const data = response.data;

                const options = data.map((sequence) => ({
                    value: sequence.operations,
                    label: sequence.name,
                }));
                setWorkflowOptions(options);
            } catch (error) {
                console.error('Error fetching workflow options:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkflowOptions();
    }, []);






    return (
        <div className='vh-100'>
        <div className="d-flex flex-column justify-content-center align-items-center my-5">
            <div className='fw-bold fs-5'>CSV File Drop Zone</div>
            <div>
                <CsvDropZone onCsvFileDrop={handleCsvFileDrop} />
            </div>
            <div className='d-flex justify-content-evenly mt-3' style={{ width: '600px' }}>
                <div className='w-50'>
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        value={selectedOption}
                        onChange={handleSelectChange}
                        defaultValue={workflowOptions[0]}
                        isLoading={isLoading}
                        isClearable={'true'}
                        isSearchable={'true'}
                        name="workflow"
                        options={workflowOptions}
                    />
                </div>
                <button disabled={isProcessing} class="btn btn-primary" onClick={handleRunWorkflow}>
                    {isProcessing && <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                    Run Workflow
                </button>

                <Link to="/" className="btn btn-primary d-flex align-items-center">Create workflow</Link>

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
            {message}
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
            {message}
          </div>
        </div>
      )}
        </div>
        
    );
};

export default FileUploadPage;
