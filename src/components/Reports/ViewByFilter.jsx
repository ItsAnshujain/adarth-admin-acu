import { Button, Menu } from '@mantine/core';
import React from 'react';

const ViewByFilter = ({ handleViewBy = () => {} }) => (
  <Menu shadow="md" width={130}>
    <Menu.Target>
      <Button className="secondary-button">View By</Button>
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Item className="text-red-450" onClick={() => handleViewBy('reset')}>
        Reset
      </Menu.Item>
      <Menu.Item onClick={() => handleViewBy('week')}>Weekly</Menu.Item>
      <Menu.Item onClick={() => handleViewBy('month')}>Monthly</Menu.Item>
      <Menu.Item onClick={() => handleViewBy('quarter')}>Quartly</Menu.Item>
      <Menu.Item onClick={() => handleViewBy('year')}>Yearly</Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

export default ViewByFilter;
