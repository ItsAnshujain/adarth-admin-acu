import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FilePlus } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const navigate = useNavigate();

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'application/file': ['.csv'],
    },
    multiple: false,
    onDrop: useCallback(acceptedFiles => {
      /* eslint-disable no-console */
      console.log(acceptedFiles);
    }, []),
  });

  return (
    <>
      <header className="h-20 border-b border-gray-450 flex justify-between items-center pl-5 pr-7">
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
        className="h-[40%] border-2 border-dashed border-slate-300 bg-[#F9FAFD] ml-5 mr-7 mt-4 flex flex-col items-center justify-center "
      >
        <FilePlus onClick={open} size={34} className="text-slate-400" />
        <input type="hidden" {...getInputProps()} accept=".xlsx, .xls, .csv" />
        <p className="mt-2 mb-3">
          Drag and drop your files here, or{' '}
          <span className="text-purple-450 cursor-pointer">browse</span>
        </p>
        <p className="text-slate-400 text-sm">Support CSV format only</p>
      </div>
      <button
        onClick={open}
        className="bg-purple-450 text-white p-2 rounded mx-auto block mt-3"
        type="button"
      >
        Upload File
      </button>
    </>
  );
};

export default FileUpload;
