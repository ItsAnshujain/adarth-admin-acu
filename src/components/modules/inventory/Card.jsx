import { Badge, Box, Checkbox, Image, Text, Card as MantineCard } from '@mantine/core';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import toIndianCurrency from '../../../utils/currencyFormat';
import SpacesMenuPopover from '../../Popovers/SpacesMenuPopover';

const Card = ({ data, isSelected = false, onSelect = () => {}, onPreview }) => (
  <MantineCard
    className={classNames(
      'flex flex-col bg-white w-[270px] min-h-[400px]',
      !data?.isActive ? 'opacity-50' : '',
    )}
    withBorder
    radius="md"
    shadow="sm"
  >
    <MantineCard.Section
      className={classNames(data?.basicInformation?.spacePhoto ? 'cursor-zoom-in' : '')}
      onClick={onPreview}
    >
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
    </MantineCard.Section>
    <Link to={`/inventory/view-details/${data?._id}`} key={data?._id}>
      <div className="flex-1 flex flex-col gap-y-2 mt-4">
        <Box className="flex justify-between items-center mb-2" onClick={e => e.stopPropagation()}>
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
        <Text
          size="md"
          weight="bold"
          lineClamp={1}
          className="w-full"
          title={data?.basicInformation?.spaceName}
        >
          {data?.basicInformation?.spaceName}
        </Text>
        <Text size="sm" weight="200" lineClamp={1} title={data?.location?.address}>
          {data?.location?.address || 'NA'}
        </Text>
        <div className="grid grid-cols-2 justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-2">Category</p>
            <Text className="text-sm" lineClamp={1}>
              {data?.basicInformation?.category?.name}
            </Text>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Impressions</p>
            <p className="text-sm">
              {data?.specifications?.impressions?.max
                ? `${data.specifications.impressions.max}+`
                : 'NA'}
            </p>
          </div>
        </div>
        <Box className="flex justify-between items-center" onClick={e => e.stopPropagation()}>
          <Text size="lg" className="font-bold" color="purple">
            {data?.basicInformation?.price ? toIndianCurrency(data.basicInformation.price) : 'NA'}
          </Text>
          <SpacesMenuPopover itemId={data?._id} />
        </Box>
      </div>
    </Link>
  </MantineCard>
);

export default Card;
