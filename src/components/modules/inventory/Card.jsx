import { Badge, Box, Checkbox, Image, Text, Card as MantineCard } from '@mantine/core';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { getWord } from 'num-count';
import toIndianCurrency from '../../../utils/currencyFormat';
import SpacesMenuPopover from '../../Popovers/SpacesMenuPopover';

const Card = ({
  _id,
  isActive,
  basicInformation,
  location,
  specifications,
  isUnderMaintenance,
  isSelected = false,
  onSelect = () => {},
  onPreview,
}) => (
  <MantineCard
    className={classNames(
      'flex flex-col bg-white w-[270px] min-h-[400px]',
      !isActive ? 'opacity-50' : '',
    )}
    withBorder
    radius="md"
    shadow="sm"
  >
    <MantineCard.Section
      className={classNames(basicInformation?.spacePhoto ? 'cursor-zoom-in' : '')}
      onClick={onPreview}
    >
      {basicInformation?.spacePhoto ? (
        <Image
          height={170}
          src={basicInformation?.spacePhoto}
          alt="card"
          withPlaceholder
          placeholder={<Text align="center">Unexpected error occured. Image cannot be loaded</Text>}
        />
      ) : (
        <Image height={170} src={null} alt="card" fit="contain" withPlaceholder />
      )}
    </MantineCard.Section>
    <Link to={`/inventory/view-details/${_id}`} key={_id}>
      <div className="flex-1 flex flex-col gap-y-2 mt-4">
        <Box className="flex justify-between items-center mb-2" onClick={e => e.stopPropagation()}>
          <Badge
            className="capitalize"
            variant="filled"
            size="lg"
            color={isUnderMaintenance ? 'yellow' : 'green'}
          >
            {isUnderMaintenance ? 'Under Maintenance' : 'Available'}
          </Badge>
          <Checkbox
            onChange={event => onSelect(event.target.value)}
            label="Select"
            classNames={{ root: 'flex flex-row-reverse', label: 'pr-2' }}
            defaultValue={_id}
            checked={isSelected}
          />
        </Box>
        <Text
          size="md"
          weight="bold"
          lineClamp={1}
          className="w-full"
          title={basicInformation?.spaceName}
        >
          {basicInformation?.spaceName}
        </Text>
        <Text size="sm" weight="200" lineClamp={1} title={location?.address}>
          {location?.address || 'NA'}
        </Text>
        <div className="grid grid-cols-2 justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-2">Category</p>
            <Text className="text-sm" lineClamp={1}>
              {basicInformation?.category?.name}
            </Text>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Impressions</p>
            <p className="text-sm font-medium">
              {specifications?.impressions?.max
                ? `${getWord(specifications.impressions.max)}+`
                : 'NA'}
            </p>
          </div>
        </div>
        <Box className="flex justify-between items-center" onClick={e => e.stopPropagation()}>
          <Text size="lg" className="font-bold" color="purple">
            {basicInformation?.price ? toIndianCurrency(basicInformation.price) : 'NA'}
          </Text>
          <SpacesMenuPopover itemId={_id} />
        </Box>
      </div>
    </Link>
  </MantineCard>
);

export default Card;
