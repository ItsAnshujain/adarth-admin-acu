import { Button } from '@mantine/core';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FilePlus } from 'react-feather';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useUpdateBooking } from '../../../hooks/booking.hooks';
import { useUploadFile } from '../../../hooks/upload.hooks';

const orderTypeKey = {
  purchase: 'purchaseOrder',
  release: 'releaseOrder',
  invoice: 'invoice',
};

const FileUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [searchParam] = useSearchParams();
  const { type } = useParams();

  const bookingId = searchParam.get('id');
  const { mutateAsync: uploadPdf, isLoading } = useUploadFile();
  const { mutate: update, isLoading: isUpdateBookingLoading } = useUpdateBooking();
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'application/file': ['.pdf'],
    },
    disabled: isLoading,
    multiple: false,
    onDrop: useCallback(acceptedFiles => {
      setFile(acceptedFiles[0]);
    }, []),
  });

  const handleSubmit = pdfLink => {
    const currentOrderType = orderTypeKey[type];
    const data = {
      [currentOrderType]: pdfLink,
    };

    update({ id: bookingId, data });
  };

  const handleUpload = async () => {
    const fd = new FormData();
    fd.append('files', file);
    const res = await uploadPdf(fd, {
      onSuccess: () => {
        setFile(null);
      },
    });

    if (res?.[0].Location) {
      handleSubmit(res[0].Location);
    }
  };

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <header className="h-[60px] border-b border-gray-450 flex justify-between items-center pl-5 pr-7">
        <p className="text-xl font-bold">Upload PDF</p>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex gap-1 border rounded-md p-2"
        >
          <span>Close</span>
        </Button>
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
            <p className="text-slate-400 text-sm">Support PDF format only</p>
          </>
        )}
      </div>
      <Button
        disabled={isLoading || isUpdateBookingLoading}
        onClick={file ? handleUpload : open}
        className="bg-purple-450 text-white p-2 rounded mx-auto block mt-3"
      >
        Upload File
      </Button>
    </div>
  );
};

export default FileUpload;