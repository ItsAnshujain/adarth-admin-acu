const PreviewCard = ({ trash, pdf, filename, cardText, cardSubtext }) => (
  <div className="flex flex-col ">
    <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-64 h-36 bg-slate-100">
      <div className="flex justify-center flex-col">
        <img src={pdf} alt="" className="h-8" />
        <p className="text-sm">{filename}</p>
      </div>
      <img src={trash} alt="" className="absolute right-3 top-1 h-4" />
    </div>
    <div className="text-sm">
      <p className="font-medium">{cardText}</p>
      <p className="text-slate-400">{cardSubtext}</p>
    </div>
  </div>
);

export default PreviewCard;
