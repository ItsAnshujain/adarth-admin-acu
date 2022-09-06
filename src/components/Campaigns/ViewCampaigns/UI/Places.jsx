import { Text } from '@mantine/core';
import CustomBadge from '../../../shared/Badge';
import toIndianCurrency from '../../../../utils/currencyFormat';

const Places = ({ data }) => (
  <div className="flex gap-4 p-4 shadow-md bg-white mb-2">
    <div>
      <img src={data.img} alt="logo" />
    </div>
    <div className="flex flex-col w-full">
      <CustomBadge
        className="bg-green-200 text-green-700 w-24 mb-2 tracking-widest font-light"
        radius="lg"
        variant="filled"
        text={data.status}
        size="md"
      />

      <div className="grid grid-cols-4">
        <div>
          <Text weight="bolder" className="mb-2">
            {data.name}
          </Text>
          <p className="text-slate-400 text-sm mb-2 tracking-wide">{data.address}</p>
          <Text weight="bolder">{toIndianCurrency(data.cost)}</Text>
        </div>
        <div className="ml-6">
          <div className="mb-4">
            <p className="text-slate-400 text-sm tracking-wide">Media Type</p>
            <p className="font-normal">{data.lighting}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm tracking-wide">Unit</p>
            <p className="font-normal">{data.impression}</p>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <p className="text-slate-400 text-sm tracking-wide">Illumination</p>
            <p className="font-normal">{data.illumination}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm tracking-wide">Supported Media</p>
            <p className="font-normal">{data.format}</p>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <p className="text-slate-400 text-sm tracking-wide">Size</p>
            <p className="font-normal">{data.dimensions}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm tracking-wide">Resolution</p>
            <p className="font-normal">{data.resolution}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Places;
