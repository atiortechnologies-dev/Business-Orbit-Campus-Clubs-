import React, { useRef, useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FileUploadZone({ accept, hint, label, onUpload, fileUrl, fileName }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    if (files && files[0] && onUpload) {
      onUpload(files[0]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-[#FAFAFA] px-4 py-8 text-center transition-colors',
        dragging && 'border-black bg-gray-50'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {fileUrl || fileName ? (
        <div className="flex flex-col items-center gap-2">
          <FileText className="h-8 w-8 text-black" />
          <p className="text-sm font-medium text-black">{fileName || 'File attached'}</p>
        </div>
      ) : (
        <>
          <UploadCloud className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-black">{label || 'Click to upload or drag and drop'}</p>
          <p className="mt-1 text-xs text-gray-400">{hint}</p>
        </>
      )}
    </div>
  );
}