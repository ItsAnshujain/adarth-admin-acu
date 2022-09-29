import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PreviewCard from './UI/PreviewCard';
import DragDropCard from './UI/DragDropCard';
import { useFormContext } from '../../../context/formContext';
import { useUploadFile } from '../../../hooks/upload.hooks';

const Documents = () => {
  const { id: userId } = useParams();
  const { setFieldValue, values } = useFormContext();
  const [uploadImageList, setUploadImageList] = useState([]);
  const { mutateAsync: upload } = useUploadFile();

  const onHandleDrop = async data => {
    const formData = new FormData();
    formData.append('files', data?.[0]);
    const res = await upload(formData);
    return res[0]?.Location;
  };

  const handleDelete = docIndex => {
    setUploadImageList(uploadImageList.filter((_, index) => index !== docIndex));
  };

  const onPreviewDocuments = (url, docType) => {
    if (uploadImageList.length < 3) {
      setUploadImageList(prevState => {
        if (prevState) {
          return [...prevState, { type: docType, url }];
        }

        return null;
      });
    }
  };

  useEffect(() => {
    if (userId) {
      const tempArr = [];
      const tempObj = values?.docs;
      if (tempObj) {
        // TODO: fix this
        // eslint-disable-next-line guard-for-in
        for (const key in tempObj) {
          tempArr.push({
            type: key,
            url: values.docs[key],
          });
        }
      }

      setUploadImageList(tempArr);
    }
  }, [values?.docs]);

  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="text-xl font-bold mb-8">Documents of the associates</p>

      <div className="grid grid-cols-4 gap-8">
        {uploadImageList?.map((doc, index) => (
          <PreviewCard
            onClickDelete={() => handleDelete(index)}
            filename={doc?.type}
            cardText={doc?.type}
            cardSubtext={doc?.type}
            fileExtensionType={doc?.url}
          />
        ))}
        <DragDropCard
          cardText="Upload Your Landlord License photocopy"
          onHandleDrop={async params => {
            const url = await onHandleDrop(params);
            setFieldValue('docs.landlordLicense', url);
            onPreviewDocuments(url, 'landlordLicense');
          }}
        />
        <DragDropCard
          cardText="Upload Your Pan photocopy"
          onHandleDrop={async params => {
            const url = await onHandleDrop(params);
            setFieldValue('docs.pan', url);
            onPreviewDocuments(url, 'pan');
          }}
        />
        <DragDropCard
          cardText="Upload Your Aadhaar photocopy"
          onHandleDrop={async params => {
            const url = await onHandleDrop(params);
            setFieldValue('docs.aadhaar', url);
            onPreviewDocuments(url, 'aadhaar');
          }}
        />
      </div>
    </div>
  );
};

export default Documents;
