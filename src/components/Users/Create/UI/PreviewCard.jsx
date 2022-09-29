import { Button, Image } from '@mantine/core';
import trash from '../../../../assets/trash.svg';
import pdf from '../../../../assets/pdf.svg';

const docs = {
  landlordLicense: 'Landlord License',
  aadhaar: 'Aadhaar',
  pan: 'Pan',
};

const PreviewCard = ({
  filename,
  cardText,
  cardSubtext,
  fileExtensionType,
  onClickDelete = () => {},
  showTrashBtn = true,
  preview = false,
}) => (
  <div className="flex flex-col ">
    <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-[100%] h-48 bg-slate-100">
      <div className="flex justify-center flex-col">
        {fileExtensionType?.includes('pdf') ? (
          <Image src={pdf} alt="file-type-icon" className="h-8" />
        ) : null}
        {preview ? (
          <p className="text-sm">{docs[Object.keys(filename)[0]]}</p>
        ) : (
          <p className="text-sm">{docs[filename]}</p>
        )}
      </div>
      {showTrashBtn ? (
        <Button className="absolute right-2 top-1 px-0" onClick={onClickDelete}>
          <Image src={trash} alt="trash-icon" />
        </Button>
      ) : null}
    </div>
    <div className="text-sm">
      {preview ? (
        <>
          <p className="font-medium">{docs[Object.keys(filename)[0]]}</p>
          <p className="text-slate-400">Your {docs[Object.keys(filename)[0]]} photocopy</p>
        </>
      ) : (
        <>
          <p className="font-medium">{docs[cardText]}</p>
          <p className="text-slate-400">Your {docs[cardSubtext]} photocopy</p>
        </>
      )}
    </div>
  </div>
);

export default PreviewCard;
