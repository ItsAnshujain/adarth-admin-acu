import unsplash from '../../assets/unsplash.png';
import Badge from '../shared/Badge';
import toIndianCurrency from '../../utils/currencyFormat';

const Card = ({ data: { category, impression, cost, status, subtitle, type } }) => (
  <div className="flex flex-col drop-shadow-md bg-white">
    <div className="flex-1 w-full">
      <img className="w-full" src={unsplash} alt="card" />
    </div>
    <div className="flex-1 p-4 pt-4 pb-7 flex flex-col gap-y-1">
      <div className="flex mb-2 items-center">
        <Badge
          className="normal-case py-2 px-1"
          radius="md"
          color="green"
          variant="filled"
          text={status}
          size="xs"
        />
        <p className="flex gap-1 text-xs items-center ml-2 text-purple-450">{type}</p>
      </div>

      <p size="lg" className="mt-2 font-bold text-lg">
        {subtitle}
      </p>
      <div className="grid grid-cols-2 justify-between">
        <div className="mt-2">
          <p className="text-sm text-gray-400">No of Media</p>
          <p className="text-sm mt-1">{category}</p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-400">Impressions</p>
          <p className="text-sm mt-1">{impression}</p>
        </div>
      </div>
      <p className="mt-4 font-extrabold text-lg">{toIndianCurrency(cost)}</p>
    </div>
  </div>
);

export default Card;
