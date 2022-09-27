import React from 'react';
import { Button, Menu as MantineMenu } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const Menu = ({ btnLabel, options = [] }) => {
  const navigate = useNavigate();

  return (
    <MantineMenu shadow="md" width={200}>
      <MantineMenu.Target>
        <Button rightIcon={<ChevronDown />} className="bg-black text-sm  text-white">
          {btnLabel}
        </Button>
      </MantineMenu.Target>

      <MantineMenu.Dropdown>
        {options.map(item => (
          <MantineMenu.Item
            key={item?.path}
            className="font-bold"
            onClick={() => navigate(item?.path)}
          >
            {item.label}
          </MantineMenu.Item>
        ))}
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
};

export default Menu;
