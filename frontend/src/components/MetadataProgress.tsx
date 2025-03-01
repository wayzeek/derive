import React from 'react';
import { ProgressUpdate } from '../utils/websocketService';

interface MetadataProgressProps {
  progress: ProgressUpdate | null;
  isProcessing: boolean;
}

export const MetadataProgress: React.FC<MetadataProgressProps> = ({ progress, isProcessing }) => {
  if (!isProcessing || !progress) {
    return null;
  }

  return (
    <div className="rounded-xl bg-[#111] p-6 mb-8">
      <h2 className="mb-4 text-xl font-semibold text-white">Processing Metadata</h2>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-white">{progress.step}</span>
          <span className="text-sm font-medium text-white">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-[#FF0031] h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-gray-400">{progress.message}</p>
    </div>
  );
}; 