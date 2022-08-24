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
          <p className="text-slate-400 text-sm mb-2 tracking-wide">{data.address}</p>
          <Text weight="bolder">{toIndianCurrency(data.cost)}</Text>
        </div>
        <div>
          <div className="mb-4">
            <p className="text-slate-400 text-sm tracking-wide">Dimension</p>
            <p className="font-normal">{data.dimensions}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm tracking-wide">Impression</p>
            <p className="font-normal">{data.impression}</p>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <p className="text-slate-400 text-sm tracking-wide">Format Support</p>
            <p className="font-normal">{data.format}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm tracking-wide">Lighting/Non Lighting</p>
            <p className="font-normal">{data.lighting}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Places;
