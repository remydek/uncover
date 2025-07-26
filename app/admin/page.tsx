'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  text: string;
  type: 'error' | 'success' | 'info' | '';
}

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message>({ text: '', type: '' });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCsvText(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if ((!file && !csvText.trim()) || (file && csvText.trim())) {
      setMessage({ text: 'Please provide either a file or paste CSV text, not both.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: 'Importing data...', type: 'info' });

    try {
      const formData = new FormData();
      
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('csvText', csvText);
      }

      const response = await fetch('/api/import-csv', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage({ text: `Successfully imported ${result.count} items!`, type: 'success' });
        setCsvText('');
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(result.error || 'Failed to import data');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      setMessage({ 
        text: error instanceof Error ? error.message : 'An unknown error occurred', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
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
      </div>
    </div>
  );
}
