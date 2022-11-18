import { useEffect, useState } from 'react';
import { Badge } from '@mantine/core';
import PreviewCard from './UI/PreviewCard';
import DragDropCard from './UI/DragDropCard';
import { useFormContext } from '../../../context/formContext';
import { useDeleteUploadedFile, useUploadFile } from '../../../hooks/upload.hooks';

const supportedType = ['JPG', 'JPEG', 'PNG', 'PDF'];

const docTypes = [
  {
    text: 'Upload Your Landlord License photocopy',
    name: 'landlordLicense',
  },
  {
    text: 'Upload Your Pan photocopy',
    name: 'pan',
  },
  {
    text: 'Upload Your Aadhaar photocopy',
    name: 'aadhaar',
  },
];

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
    const isPresent = uploadImageList.findIndex(item => item.type === docName);
    if (isPresent > -1) {
      await handleDelete(isPresent);
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

        {docTypes.map(({ name, text }) => (
          <DragDropCard
            key={name}
            cardText={text}
            isLoading={currentDrop.includes(name) ? isUploading : false}
            onHandleDrop={async params => {
              const { url, key } = await onHandleDrop(params, name);
              onPreviewDocuments(url, key, name);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Documents;
