'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { useDropzone, FileWithPath } from 'react-dropzone';

interface DocumentUploadPanelProps {
  onDocumentsChange: (loi: FileWithPath | null, termsheet: FileWithPath | null, financials: FileWithPath[]) => void;
}

const DocumentUploadPanel: React.FC<DocumentUploadPanelProps> = ({ onDocumentsChange }) => {
  const [loi, setLoi] = useState<FileWithPath | null>(null);
  const [termsheet, setTermsheet] = useState<FileWithPath | null>(null);
  const [financials, setFinancials] = useState<FileWithPath[]>([]);

  // Notify parent component about document changes
  useEffect(() => {
    onDocumentsChange(loi, termsheet, financials);
  }, [loi, termsheet, financials, onDocumentsChange]);

  // Dropzone for Letter of Intent (LOI)
  const onDropLoi = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      setLoi(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps: getLoiRootProps, getInputProps: getLoiInputProps, isDragActive: isLoiDragActive } = useDropzone({
    onDrop: onDropLoi,
    maxFiles: 1,
    accept: {'application/pdf': ['.pdf']}
  });

  // Dropzone for Termsheet
  const onDropTermsheet = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      setTermsheet(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps: getTermsheetRootProps, getInputProps: getTermsheetInputProps, isDragActive: isTermsheetDragActive } = useDropzone({
    onDrop: onDropTermsheet,
    maxFiles: 1,
    accept: {'application/pdf': ['.pdf']}
  });

  // Dropzone for Financials (max 3 files)
  const onDropFinancials = useCallback((acceptedFiles: FileWithPath[]) => {
    setFinancials(prev => [...prev, ...acceptedFiles.filter(file => 
      !prev.some(existingFile => existingFile.path === file.path)
    )].slice(0, 3)); // Ensure max 3 files
  }, []);
  const { getRootProps: getFinancialsRootProps, getInputProps: getFinancialsInputProps, isDragActive: isFinancialsDragActive } = useDropzone({
    onDrop: onDropFinancials,
    maxFiles: 3,
    accept: {'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls']}
  });

  const removeLoi = () => setLoi(null);
  const removeTermsheet = () => setTermsheet(null);
  const removeFinancial = (fileToRemove: FileWithPath) => {
    setFinancials(prev => prev.filter(file => file !== fileToRemove));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
        Documents
      </h2>

      {/* LOI Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Letter of Intent (LOI) <span className="text-gray-500 text-xs">(PDF only, max 1)</span></label>
        <div {...getLoiRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isLoiDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}>
          <input {...getLoiInputProps()} />
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          {isLoiDragActive ?
            <p className="text-blue-600">Drop the LOI here ...</p> :
            <p className="text-gray-600">Drag & drop LOI here, or <span className="text-blue-600 font-semibold">click to select file</span></p>
          }
        </div>
        {loi && (
          <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileIcon className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-900">{loi.name} - {(loi.size / 1024).toFixed(2)} KB</span>
            </div>
            <button
              type="button"
              onClick={removeLoi}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Termsheet Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Termsheet <span className="text-gray-500 text-xs">(PDF only, max 1)</span></label>
        <div {...getTermsheetRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isTermsheetDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}>
          <input {...getTermsheetInputProps()} />
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          {isTermsheetDragActive ?
            <p className="text-blue-600">Drop the Termsheet here ...</p> :
            <p className="text-gray-600">Drag & drop Termsheet here, or <span className="text-blue-600 font-semibold">click to select file</span></p>
          }
        </div>
        {termsheet && (
          <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileIcon className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-900">{termsheet.name} - {(termsheet.size / 1024).toFixed(2)} KB</span>
            </div>
            <button
              type="button"
              onClick={removeTermsheet}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Financials Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Financial Statements <span className="text-gray-500 text-xs">(PDF, XLSX, XLS, max 3)</span></label>
        <div {...getFinancialsRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isFinancialsDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}>
          <input {...getFinancialsInputProps()} />
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          {isFinancialsDragActive ?
            <p className="text-blue-600">Drop the financial files here ...</p> :
            <p className="text-gray-600">Drag & drop financial files here, or <span className="text-blue-600 font-semibold">click to select files</span></p>
          }
          {financials.length >= 3 && (
            <p className="text-sm text-red-600 mt-2">Maximum of 3 financial documents uploaded.</p>
          )}
        </div>
        {financials.length > 0 && (
          <div className="mt-2 space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Uploaded Financials:</h3>
            {financials.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileIcon className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-900">{file.name} - {(file.size / 1024).toFixed(2)} KB</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFinancial(file)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadPanel;
