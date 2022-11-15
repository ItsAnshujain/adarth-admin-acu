import { Image } from '@mantine/core';
import Badge from '../shared/Badge';
import toIndianCurrency from '../../utils/currencyFormat';

const Card = ({
  data: { status, thumbnail, name = 'N/A', place = [], price = 0, isFeatured, minImpression },
}) => (
  <div className="flex flex-col drop-shadow-md bg-white">
    <div className="flex-1 w-full">
      <Image withPlaceholder src={thumbnail} width={270} height={170} alt={name} />
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
        {isFeatured ? (
          <p className="flex gap-1 text-xs items-center ml-2 text-purple-450">Featured</p>
        ) : null}
      </div>

      <p size="lg" className="mt-2 font-bold text-lg">
        {name}
      </p>
      <div className="grid grid-cols-2 justify-between">
        <div className="mt-2">
          <p className="text-sm text-gray-400">No of Media</p>
          <p className="text-sm mt-1">{place.length || 0}</p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-400">Impressions</p>
          <p className="text-sm mt-1">{minImpression}</p>
        </div>
      </div>
      <p className="mt-4 font-extrabold text-lg">{toIndianCurrency(price)}</p>
    </div>
  </div>
);

export default Card;
