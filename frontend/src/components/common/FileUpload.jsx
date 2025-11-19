import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const FileUpload = ({
  onFileSelect,
  onFileRemove,
  accept = '*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 10,
  disabled = false,
  label = 'Upload files',
  description = 'Drag and drop files here or click to browse',
  error = '',
  className = '',
  variant = 'default', // 'default', 'compact', 'avatar'
  showPreview = true,
  files = []
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const getFileIcon = (file) => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (type.includes('pdf')) return <FileText className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    if (maxSize && file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }
    
    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      const mimeType = file.type.toLowerCase();
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        if (type.includes('/*')) {
          const baseType = type.split('/')[0];
          return mimeType.startsWith(baseType + '/');
        }
        return mimeType === type.toLowerCase();
      });
      
      if (!isAccepted) {
        return `File type not accepted. Accepted types: ${accept}`;
      }
    }
    
    return null;
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    let validFiles = [];
    let errors = [];

    // Check max files limit
    if (!multiple && newFiles.length > 1) {
      setUploadError('Only one file is allowed');
      return;
    }

    if (files.length + newFiles.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setUploadError(errors.join(', '));
      return;
    }

    setUploadError('');
    if (onFileSelect) {
      onFileSelect(multiple ? validFiles : validFiles[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleRemoveFile = (index) => {
    if (onFileRemove) {
      onFileRemove(index);
    }
    setUploadError('');
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Compact variant for inline use
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
        />
        
        <button
          type="button"
          onClick={openFileDialog}
          disabled={disabled}
          className={`
            inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500'
            }
          `}
        >
          <Upload className="h-4 w-4 mr-2" />
          {label}
        </button>
        
        {(error || uploadError) && (
          <span className="text-sm text-red-600">{error || uploadError}</span>
        )}
      </div>
    );
  }

  // Avatar variant for profile pictures
  if (variant === 'avatar') {
    const previewFile = files[0];
    const previewUrl = previewFile && previewFile.type.startsWith('image/') 
      ? URL.createObjectURL(previewFile) 
      : null;

    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        <div className="relative">
          <div className={`
            w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            overflow-hidden
          `}>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">Upload Photo</span>
              </div>
            )}
          </div>
          
          {previewFile && (
            <button
              type="button"
              onClick={() => handleRemoveFile(0)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept={accept}
          disabled={disabled}
          className="hidden"
        />

        <button
          type="button"
          onClick={openFileDialog}
          disabled={disabled}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
        >
          {previewFile ? 'Change Photo' : 'Upload Photo'}
        </button>

        {(error || uploadError) && (
          <p className="text-sm text-red-600 text-center">{error || uploadError}</p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInput}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : error || uploadError
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Upload className={`h-12 w-12 mx-auto mb-4 ${
          error || uploadError ? 'text-red-400' : 'text-gray-400'
        }`} />
        
        <p className="text-lg font-medium text-gray-900 mb-2">
          {dragActive ? 'Drop files here' : 'Upload files'}
        </p>
        
        <p className="text-sm text-gray-500 mb-4">
          {description}
        </p>

        <div className="text-xs text-gray-400 space-y-1">
          {accept !== '*' && <p>Accepted files: {accept}</p>}
          <p>Maximum file size: {formatFileSize(maxSize)}</p>
          {multiple && <p>Maximum files: {maxFiles}</p>}
        </div>
      </div>

      {(error || uploadError) && (
        <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error || uploadError}</span>
        </div>
      )}

      {/* File Preview */}
      {showPreview && files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
