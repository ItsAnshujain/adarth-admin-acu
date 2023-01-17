import { Image, Text, Badge } from '@mantine/core';
import { Link } from 'react-router-dom';
import toIndianCurrency from '../../utils/currencyFormat';

const Card = ({
  data: { _id, status, thumbnail, name = 'N/A', place = [], price = 0, isFeatured, minImpression },
}) => (
  <Link to={`/campaigns/view-details/${_id}`}>
    <div className="flex flex-col drop-shadow-md bg-white w-[270px] mb-6">
      <div className="flex-1 w-full">
        {thumbnail ? (
          <Image
            height={170}
            src={thumbnail}
            alt={name}
            withPlaceholder
            placeholder={
              <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
            }
          />
        ) : (
          <Image height={170} src={null} alt="card" fit="contain" withPlaceholder />
        )}
      </div>
      <div className="flex-1 p-4 pt-4 pb-7 flex flex-col gap-y-1">
        <div className="flex mb-2 items-center">
          <Badge p="sm" radius="xl" color="green" variant="filled">
            {status || 'Created'}
          </Badge>
          {isFeatured ? (
            <p className="flex gap-1 text-xs items-center ml-2 text-purple-450">Featured</p>
          ) : null}
        </div>

        <Text size="md" weight="bold" lineClamp={1} className="w-full">
          {name}
        </Text>
        <div className="grid grid-cols-2 justify-between">
          <div className="mt-2">
            <p className="text-sm text-gray-400">No of Media</p>
            <p className="text-sm mt-1">{place.length || 0}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-400">Impressions</p>
            <p className="text-sm mt-1">{minImpression || 0}</p>
          </div>
        </div>
        <p className="mt-4 font-extrabold text-lg">{price ? toIndianCurrency(price) : 0}</p>
      </div>
    </div>
  </Link>
);

export default Card;
