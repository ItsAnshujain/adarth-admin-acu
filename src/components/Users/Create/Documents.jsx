import { useEffect, useState } from 'react';
import { Badge } from '@mantine/core';
import PreviewCard from './UI/PreviewCard';
import DragDropCard from './UI/DragDropCard';
import { useFormContext } from '../../../context/formContext';
import { useDeleteUploadedFile, useUploadFile } from '../../../hooks/upload.hooks';

const supportedType = ['JPG', 'JPEG', 'PNG', 'PDF'];

const Documents = ({ documents }) => {
  const { setFieldValue } = useFormContext();
  const [uploadImageList, setUploadImageList] = useState([]);
  const [currentDrop, setCurrentDrop] = useState([]);
  const { mutateAsync: upload, isLoading: isUploading } = useUploadFile();
  const { mutateAsync: deleteFile } = useDeleteUploadedFile();

  const handleDelete = async docIndex => {
    if (uploadImageList[docIndex].key) {
      await deleteFile(uploadImageList[docIndex].key);
    }
    setUploadImageList(uploadImageList.filter((_, index) => index !== docIndex));
  };

  const onHandleDrop = async (data, docName) => {
    setCurrentDrop(prev => [...prev, docName]);
    const isPresent = uploadImageList.find(item => item.type === docName);
    if (isPresent) {
      for (let i = 0; i < uploadImageList.length; i += 1) {
        const item = uploadImageList[i];
        if (item.type === docName) {
          // eslint-disable-next-line no-await-in-loop
          await handleDelete(i);
          break;
        }
      }
    }
    const formData = new FormData();
    formData.append('files', data?.[0]);
    const res = await upload(formData);
    setCurrentDrop(prev => prev.filter(item => item !== docName));
    return { url: res[0]?.Location, key: res[0]?.key };
  };

  const onPreviewDocuments = (url, key, docType) => {
    setUploadImageList(prevState => [...prevState, { type: docType, url, key }]);
  };

  useEffect(() => {
    if (documents) {
      const tempArr = [];
      for (const item of documents) {
        tempArr.push({
          type: Object.keys(item)[0],
          url: item[Object.keys(item)[0]],
          key: item[Object.keys(item)[0]].split('/')[
            item[Object.keys(item)[0]].split('/').length - 1
          ],
        });
      }

      setUploadImageList(tempArr);
    }
  }, [documents]);

  useEffect(() => {
    const data = [];
    for (const item of uploadImageList) {
      data.push({
        [item.type]: item.url,
      });
    }
    setFieldValue('docs', [...data]);
  }, [uploadImageList]);

  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="text-xl font-bold">Documents of the associates</p>
      <p className="text-sm mb-8">
        <span className="font-bold text-gray-500 mr-2">Supported types</span>
        {supportedType.map(item => (
          <Badge key={item} className="mr-2">
            {item}
          </Badge>
        ))}
      </p>

      <div className="grid grid-cols-4 gap-8">
        {uploadImageList?.map((doc, index) => (
          <PreviewCard
            key={Math.random()}
            onClickDelete={() => handleDelete(index)}
            filename={doc?.type}
            cardText={doc?.type}
            cardSubtext={doc?.type}
            fileExtensionType={doc?.url}
          />
        ))}
        <DragDropCard
          cardText="Upload Your Landlord License photocopy"
          isLoading={currentDrop.includes('landlordLicense') ? isUploading : false}
          onHandleDrop={async params => {
            const { url, key } = await onHandleDrop(params, 'landlordLicense');
            onPreviewDocuments(url, key, 'landlordLicense');
          }}
        />
        <DragDropCard
          cardText="Upload Your Pan photocopy"
          isLoading={currentDrop.includes('pan') ? isUploading : false}
          onHandleDrop={async params => {
            const { url, key } = await onHandleDrop(params, 'pan');
            onPreviewDocuments(url, key, 'pan');
          }}
        />
        <DragDropCard
          isLoading={currentDrop.includes('aadhaar') ? isUploading : false}
          cardText="Upload Your Aadhaar photocopy"
          onHandleDrop={async params => {
            const { url, key } = await onHandleDrop(params, 'aadhaar');
            onPreviewDocuments(url, key, 'aadhaar');
          }}
        />
      </div>
    </div>
  );
};

export default Documents;
