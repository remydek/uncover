'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { CSVImportLogger } from '@/lib/logger';

interface Message {
  text: string;
  type: 'error' | 'success' | 'info' | '';
}

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message>({ text: '', type: '' });
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCsvText(''); // Clear text when file is selected
      CSVImportLogger.log('File selected', { fileName: e.target.files[0].name, fileSize: e.target.files[0].size });
    }
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCsvText(e.target.value);
    if (e.target.value) setFile(null); // Clear file when text is entered
    CSVImportLogger.log('Text input changed', { textLength: e.target.value.length });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    CSVImportLogger.log('CSV import initiated');
    
    if ((!file && !csvText.trim()) || (file && csvText.trim())) {
      const error = 'Please provide either a file or paste CSV text, not both.';
      CSVImportLogger.error(error);
      setMessage({ text: error, type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: 'Importing data...', type: 'info' });
    CSVImportLogger.log('Starting CSV import process');

    try {
      const formData = new FormData();
      
      if (file) {
        formData.append('file', file);
        CSVImportLogger.log('Processing file upload', { fileName: file.name, fileSize: file.size });
      } else {
        formData.append('csvText', csvText);
        CSVImportLogger.log('Processing CSV text', { textLength: csvText.length });
      }

      CSVImportLogger.log('Sending request to /api/import-csv');
      const response = await fetch('/api/import-csv', {
        method: 'POST',
        body: formData,
      });

      CSVImportLogger.log('Response received', { status: response.status, statusText: response.statusText });
      
      const result = await response.json();
      CSVImportLogger.log('Response parsed', result);
      
      if (response.ok) {
        const successMsg = `Successfully imported ${result.count} items!`;
        CSVImportLogger.log(successMsg, { count: result.count, errors: result.errors });
        setMessage({ text: successMsg, type: 'success' });
        setCsvText('');
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Show detailed logs
        if (result.errors && result.errors.length > 0) {
          CSVImportLogger.warn('Some records had errors', result.errors);
        }
      } else {
        const error = result.error || 'Failed to import data';
        CSVImportLogger.error('Import failed', { error, details: result.details });
        throw new Error(error);
      }
    } catch (error) {
      CSVImportLogger.error('Error during CSV import', error);
      setMessage({ 
        text: error instanceof Error ? error.message : 'An unknown error occurred', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
      CSVImportLogger.log('CSV import process completed');
    }
  };

  const showDebugLogs = () => {
    const logs = CSVImportLogger.getLogs();
    setDebugLogs(logs);
    setShowDebug(true);
  };

  const clearDebugLogs = () => {
    CSVImportLogger.clearLogs();
    setDebugLogs([]);
    setShowDebug(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">CSV Import to Supabase</h1>
        
        {message.text && (
          <div className={`p-4 mb-6 rounded ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 
            message.type === 'success' ? 'bg-green-100 text-green-700' : 
            'bg-blue-100 text-blue-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <div className="mt-1 flex items-center">
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div>
            <label htmlFor="csv-text" className="block text-sm font-medium text-gray-700 mb-2">
              Paste CSV Text
            </label>
            <textarea
              id="csv-text"
              name="csv-text"
              rows={10}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="content,type,category&#10;&quot;Sample question?&quot;,&quot;questions&quot;,&quot;family-friends&quot;"
              value={csvText}
              onChange={handleTextareaChange}
            />
            <p className="mt-2 text-sm text-gray-500">
              Format: content,type,category (e.g., "Sample question?","questions","family-friends")
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || (!file && !csvText.trim())}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isLoading || (!file && !csvText.trim()) 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? 'Importing...' : 'Import to Supabase'}
            </button>
          </div>
        </form>

        {/* Debug Section */}
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Debug Logs</h2>
            <div className="space-x-2">
              <button
                onClick={showDebugLogs}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Show Logs
              </button>
              <button
                onClick={clearDebugLogs}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear Logs
              </button>
            </div>
          </div>
          
          {showDebug && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg max-h-96 overflow-y-auto">
              <h3 className="font-semibold mb-2 text-gray-900">Recent Logs:</h3>
              {debugLogs.length > 0 ? (
                <pre className="text-xs font-mono whitespace-pre-wrap text-gray-700">
                  {debugLogs.join('\n')}
                </pre>
              ) : (
                <p className="text-sm text-gray-500">No logs available</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">CSV Format Guide:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Required columns:</strong> content, type, category</p>
            <p><strong>Types:</strong> questions, dilemmas, situations</p>
            <p><strong>Categories:</strong> family-friends, dating-relationship, work-career, personal-growth, fun-social, general</p>
            <p><strong>Example:</strong> "What's your favorite memory?","questions","family-friends"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
