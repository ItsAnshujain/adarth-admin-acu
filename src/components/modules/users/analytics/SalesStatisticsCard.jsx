import { Card, Group, Image } from '@mantine/core';
import React from 'react';
import { getWord } from 'num-count';
import classNames from 'classnames';

const SalesStatisticsCard = ({ icon, label, count, backgroundColor, textColor }) => (
  <Card className={classNames(backgroundColor, 'rounded-lg flex flex-col p-4')}>
    <Group className="items-start">
      <Image src={icon} height={20} width={20} fit="contain" />
      <div>
        <p className="font-medium text-xs mb-2">{label}</p>
        <p className={classNames(textColor, 'font-semibold text-md ')}>{`₹${getWord(
          count || 0,
        )}`}</p>
      </div>
    </Group>
  </Card>
);

export default SalesStatisticsCard;
