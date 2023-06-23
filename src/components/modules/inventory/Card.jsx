import { Badge, Box, Checkbox, Image, Text } from '@mantine/core';
import classNames from 'classnames';
import toIndianCurrency from '../../../utils/currencyFormat';
import SpacesMenuPopover from '../../Popovers/SpacesMenuPopover';

const Card = ({ data, isSelected = false, onSelect = () => {} }) => (
  <div
    className={classNames(
      'flex flex-col drop-shadow-md bg-white w-[270px] max-h-[420px] mb-6',
      !data?.isActive ? 'opacity-50' : '',
    )}
  >
    <div className="flex-1 w-full">
      {data?.basicInformation?.spacePhoto ? (
        <Image
          height={170}
          src={data?.basicInformation?.spacePhoto}
          alt="card"
          withPlaceholder
          placeholder={<Text align="center">Unexpected error occured. Image cannot be loaded</Text>}
        />
      ) : (
        <Image height={170} src={null} alt="card" fit="contain" withPlaceholder />
      )}
    </div>
    <div className="flex-1 p-4 pt-4 pb-7 flex flex-col gap-y-1">
      <Box className="flex justify-between items-center mb-2 " onClick={e => e.stopPropagation()}>
        <Badge
          className="capitalize"
          variant="filled"
          size="lg"
          color={data?.isUnderMaintenance ? 'yellow' : 'green'}
        >
          {data?.isUnderMaintenance ? 'Under Maintenance' : 'Available'}
        </Badge>
        <Checkbox
          onChange={event => onSelect(event.target.value)}
          label="Select"
          classNames={{ root: 'flex flex-row-reverse', label: 'pr-2' }}
          defaultValue={data?._id}
          checked={isSelected}
        />
      </Box>
      <Text size="md" weight="bold" lineClamp={1} className="w-full">
        {data?.basicInformation?.spaceName}
      </Text>
      <Text size="sm" className="mt-2" weight="200" lineClamp={1}>
        {data?.location?.address}
      </Text>
      <div className="grid grid-cols-2 justify-between">
        <div className="mt-2">
          <p className="text-sm text-gray-400">Category</p>
          <Text className="text-sm mt-1" lineClamp={1}>
            {data?.basicInformation?.category?.name}
          </Text>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-400">Impressions</p>
          <p className="text-sm mt-1">{data?.specifications?.impressions?.max}+</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Text size="lg" className="mt-4 font-bold" color="purple">
          {data?.basicInformation?.price ? toIndianCurrency(data.basicInformation.price) : 'NA'}
        </Text>
        <SpacesMenuPopover itemId={data?._id} />
      </div>
    </div>
  </div>
);

export default Card;
