import React from 'react';
import { IPRegistration } from '../utils/websocketService';
import { apiService } from '../utils/apiService';

interface IPRegistrationModalProps {
  ipRegistration: IPRegistration | null;
  isOpen: boolean;
  onClose: () => void;
  isProcessing: boolean;
  currentStep?: string;
  currentMessage?: string;
}

export const IPRegistrationModal: React.FC<IPRegistrationModalProps> = ({ 
  ipRegistration, 
  isOpen, 
  onClose,
  isProcessing,
  currentStep,
  currentMessage
}) => {
  if (!isOpen) {
    return null;
  }

  const explorerUrl = ipRegistration?.ipId ? apiService.getExplorerUrl(ipRegistration.ipId) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 transition-opacity duration-300">
      <div 
        className="bg-[#111] rounded-xl max-w-lg w-full p-6 shadow-xl transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isProcessing ? "Processing Metadata" : "IP Registration Complete"}
          </h2>
          {!isProcessing && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {isProcessing ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <svg className="animate-spin h-16 w-16 text-[#FF0031]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              {currentStep && (
                <h3 className="text-lg font-medium text-white mb-2">{currentStep}</h3>
              )}
              {currentMessage && (
                <p className="text-gray-400">{currentMessage}</p>
              )}
            </div>
          ) : ipRegistration?.success ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-900/20 p-4">
                  <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">IP ID</h3>
                <p className="text-white font-mono break-all">{ipRegistration.ipId}</p>
              </div>
              
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Transaction Hash</h3>
                <p className="text-white font-mono break-all">{ipRegistration.transactionHash}</p>
              </div>
              
              {ipRegistration.metadata && (
                <>
                  <div className="bg-[#1a1a1a] rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">IP Metadata URI</h3>
                    <p className="text-white font-mono break-all">{ipRegistration.metadata.ipMetadataURI}</p>
                  </div>
                  
                  <div className="bg-[#1a1a1a] rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">NFT Metadata URI</h3>
                    <p className="text-white font-mono break-all">{ipRegistration.metadata.nftMetadataURI}</p>
                  </div>
                </>
              )}
              
              <div className="mt-6 flex justify-center">
                <a 
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-umg bg-[#FF0031] hover:bg-[#CC0028] text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  View on Story Protocol Explorer
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-red-900/20 p-4">
                  <svg className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              
              <p className="text-center text-white text-lg mb-4">Registration Failed</p>
              <p className="text-center text-gray-400">{ipRegistration?.message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 