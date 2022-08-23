import { FilePlus } from 'react-feather';

const DragDropCard = ({ fileplus, cardText, cardSubtext, getRootProps, getInputProps }) => {
  const handleClick = () => {};
  return (
    <div className="flex flex-col">
      <div
        aria-hidden
        onClick={handleClick}
        {...getRootProps()}
        className="border border-dashed cursor-pointer  border-slate-400 flex flex-col items-center justify-center relative w-64 h-36 bg-slate-100"
      >
        <FilePlus src={fileplus} alt="" className="h-8" />
        <p className="text-xs">
          Drag and drop your files here, or <span className="text-purple-450">browse</span>
        </p>
        <input type="hidden" {...getInputProps()} />
      </div>
      <div className="text-sm">
        <p className="font-medium">{cardText}</p>
        <p className="text-slate-400">{cardSubtext}</p>
      </div>
    </div>
  );
};

export default DragDropCard;
