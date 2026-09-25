import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading agricultural solutions...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-emerald-900">{message}</p>
    </div>
  );
};

export const ErrorMessage: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'Unable to load products. Please try again.',
  onRetry
}) => {
  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
      <div className="w-10 h-10 mx-auto mb-3 text-red-600 flex items-center justify-center rounded-full bg-red-100">
        !
      </div>
      <h3 className="text-base font-semibold text-red-900 mb-1">Notice</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
