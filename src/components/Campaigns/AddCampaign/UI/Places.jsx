import { Text } from '@mantine/core';
import { Calendar } from 'react-feather';
import CustomBadge from '../../../shared/Badge';
import toIndianCurrency from '../../../../utils/currencyFormat';

const Places = ({ data }) => (
  <div className="flex gap-4 p-4 shadow-md bg-white mb-2">
    <div>
      <img src={data.img} alt="logo" />
    </div>
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center w-full mb-2">
        <CustomBadge
          className="bg-green-200 text-green-700 tracking-wider"
          radius="lg"
          variant="filled"
          text={data.status}
          size="md"
        />

        <div className="flex gap-2">
          <div className="flex gap-2 border p-2 rounded-md">
            <Calendar />
            <span> {data.from_date}</span>
          </div>
          <div className="flex gap-2 border p-2 rounded-md">
            <Calendar />
            <span>{data.to_date}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3">
        <div>
          <Text weight="bolder" className="mb-2">
            {data.name}
          </Text>
          <Text className="mb-2" size="sm" weight="300">
            {data.address}
          </Text>
          <Text weight="bolder">{toIndianCurrency(data.cost)}</Text>
        </div>
        <div>
          <div className="mb-4">
            <Text size="sm" weight="300">
              Dimension
            </Text>
            <Text>{data.dimensions}</Text>
          </div>
          <div>
            <Text size="sm" weight="300">
              Impression
            </Text>
            <Text>{data.impression}</Text>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <Text size="sm" weight="300">
              Format Support
            </Text>
            <Text>{data.format}</Text>
          </div>
          <div>
            <Text size="sm" weight="300">
              Lighting/Non Lighting
            </Text>
            <Text>{data.lighting}</Text>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Places;
