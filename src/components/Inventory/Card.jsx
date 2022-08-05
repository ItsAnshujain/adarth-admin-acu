import { Text } from '@mantine/core';
import unsplash from '../../assets/unsplash.png';
import Badge from '../shared/Badge';
import toIndianCurrency from '../../utils/currencyFormat';

const Card = ({
  data: { title, category, impression, cost, status, subtitle },
  handleCheckbox,
  checkbox,
}) => (
  <div className="flex flex-col drop-shadow-md bg-white">
    <div className="flex-1 w-full">
      <img className="w-full" src={unsplash} alt="card" />
    </div>
    <div className="flex-1 p-4 pt-4 pb-7">
      <div className="flex justify-between mb-2">
        <Badge radius="md" color="green" variant="filled" text={status} size="md" />
        <div className="flex gap-1 items-center">
          <span>Select</span>
          <input checked={checkbox} onChange={() => handleCheckbox()} type="checkbox" />
        </div>
      </div>
      <Text size="md" weight="bold">
        {title}
      </Text>
      <Text size="sm" className="mt-2" weight="200">
        {subtitle}
      </Text>
      <div className="grid grid-cols-2 justify-between">
        <div className="mt-2">
          <p className="text-sm text-gray-400" weight="200">
            Category
          </p>
          <p className="text-sm mt-1">{category}</p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-400" weight="200">
            Impressions
          </p>
          <p className="text-sm mt-1">{impression}</p>
        </div>
      </div>
      <Text size="lg" className="mt-4" color="purple">
        {toIndianCurrency(cost)}
      </Text>
    </div>
  </div>
);

export default Card;
