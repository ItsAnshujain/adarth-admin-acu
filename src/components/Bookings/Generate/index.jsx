import { useDropzone } from 'react-dropzone';
import fileplus from '../../../assets/file-plus.svg';

const Generate = () => {
  const { acceptedFiles, fileRejections, getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <div className="mt-4 p-4 h-full flex flex-col items-center">
      <div
        {...getRootProps()}
        className="border border-slate-500 h-1/2 w-full flex justify-center items-center border-dashed"
      >
        <div className="hidden">
          <input {...getInputProps()} type="file" accept="image/png" />
        </div>
        <div className="text-center">
          <img className="inline-block" src={fileplus} alt="placeholder" />
          <div className="mt-1 mb-2">
            Drag and Drop your files here,or{' '}
            <button type="button" onClick={open} className="text-purple-450 border-none bg-white">
              browse
            </button>
          </div>
          <p className="text-gray-400">Supported csv format only</p>
          <aside>
            {acceptedFileItems.length > 0 && <ul>{acceptedFileItems}</ul>}
            {fileRejectionItems.length > 0 && <ul>{fileRejectionItems}</ul>}
          </aside>
        </div>
      </div>
      <button
        onClick={open}
        type="button"
        className="mx-auto mt-2 bg-purple-450 rounded text-white p-2"
      >
        Upload file
      </button>
    </div>
  );
};

export default Generate;
