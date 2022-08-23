import { useDropzone } from 'react-dropzone';
import pdf from '../../../assets/pdf.svg';
import trash from '../../../assets/trash.svg';
import PreviewCard from './UI/PreviewCard';
import DragDropCard from './UI/DragDropCard';

const previewCardData = {
  trash,
  pdf,
  cardText: 'Landlord License',
  cardSubtext: 'Your landlord license photocopy',
  filename: 'license.pdf',
};

const dataPreviewCard = new Array(4).fill(previewCardData);

const dragDropCardData = {
  cardText: 'Landlord License',
  cardSubtext: 'Your landlord license photocopy',
};

const dataDragDropCard = new Array(4).fill(dragDropCardData);

const Documents = () => {
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  dragDropCardData.getInputProps = getInputProps;
  dragDropCardData.getRootProps = getRootProps;

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

  dragDropCardData.acceptedFileItems = acceptedFileItems;
  dragDropCardData.fileRejectionItems = fileRejectionItems;

  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="text-xl font-bold mb-8">Documents of the associates</p>
      <div className="grid grid-cols-4 gap-8">
        {dataPreviewCard.map(doc => (
          <PreviewCard {...doc} />
        ))}
        {dataDragDropCard.map(doc => (
          <DragDropCard {...doc} />
        ))}
      </div>
    </div>
  );
};

export default Documents;
