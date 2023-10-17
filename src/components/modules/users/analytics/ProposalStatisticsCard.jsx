import { Card, Image } from '@mantine/core';
import classNames from 'classnames';
import React from 'react';

const ProposalStatisticsCard = ({ label, icon, textColor, count }) => (
  <Card key={label} className="rounded-lg flex flex-col p-0 py-4 pl-4 justify-between border">
    <div>
      <Image src={icon} height={20} width={20} fit="contain" />
      <p className="font-medium text-xs mt-3">{label}</p>
    </div>
    <p className={classNames(textColor, 'font-medium text-md')}>{count}</p>
  </Card>
);

export default ProposalStatisticsCard;
