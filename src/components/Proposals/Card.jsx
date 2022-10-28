import MenuPopover from '../../pages/Proposal/MenuPopover';

const Card = ({ proposalData }) => {
  const { _id, name, price, status, client, totalPlaces } = proposalData;
  return (
    <div className="flex flex-col px-4 py-8 shadow-md gap-4 max-w-72 bg-white">
      <p className="font-bold text-ellipsis w-full overflow-hidden">{name || 'NA'}</p>
      <p className="text-purple-450 text-sm">{status || 'NA'}</p>
      <div className="flex justify-between">
        <div>
          <p className="text-slate-400 text-sm">Client</p>
          <p>{client || 'NA'}</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Total Places</p>
          <p>{totalPlaces || 0}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-purple-450 font-bold">₹{price || 0}</p>
        <MenuPopover itemId={_id} />
      </div>
    </div>
  );
};

export default Card;
