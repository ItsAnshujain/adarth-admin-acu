import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FilePlus } from 'react-feather';
import { useNavigate } from 'react-router-dom';

import { useCsvImport } from '../../hooks/inventory.hooks';

const FileUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const { mutate, isLoading } = useCsvImport();

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'application/file': ['.csv'],
    },
    disabled: isLoading,
    multiple: false,
    onDrop: useCallback(acceptedFiles => {
      setFile(acceptedFiles[0]);
    }, []),
  });

  const handleUpload = () => {
    const fd = new FormData();
    fd.append('files', file);
    mutate(fd, {
      onSuccess: () => {
        setFile(null);
        setTimeout(() => {
          navigate('/inventory');
        }, 1000);
      },
    });
  };

  return (
    <>
      <header className="h-[60px] border-b border-gray-450 flex justify-between items-center pl-5 pr-7">
        <p className="text-xl font-bold">Upload Space CSV</p>
        <button
          onClick={() => navigate(-1)}
          className="flex gap-1 border rounded-md p-2"
          type="button"
        >
          <span>Close</span>
        </button>
      </header>
      <div
        {...getRootProps()}
        disabled
        className="h-[40%] border-2 border-dashed border-slate-300 bg-[#F9FAFD] ml-5 mr-7 mt-4 flex flex-col items-center justify-center "
      >
        <FilePlus onClick={open} size={34} className={file ? 'text-green-500' : 'text-slate-400'} />
        <input type="hidden" {...getInputProps()} accept=".xlsx, .xls, .csv" />

        {file ? (
          <p className="mt-2 mb-3">{file.name}</p>
        ) : (
          <>
            <p className="mt-2 mb-3">
              Drag and drop your files here, or{' '}
              <span className="text-purple-450 cursor-pointer">browse</span>
            </p>
            <p className="text-slate-400 text-sm">Support CSV format only</p>
          </>
        )}
      </div>
      <button
        disabled={isLoading}
        onClick={file ? handleUpload : open}
        className="bg-purple-450 text-white p-2 rounded mx-auto block mt-3"
        type="button"
      >
        Upload File
      </button>
    </>
  );
};

export default FileUpload;
