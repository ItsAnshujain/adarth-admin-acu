import { Button, Menu } from '@mantine/core';
import classNames from 'classnames';
import React from 'react';
import { Bookmark, Edit2, Eye, Trash } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../utils';
import MenuIcon from '../Menu';
import RoleBased from '../RoleBased';

const CampaignsMenuPopover = ({ isFeatured, itemId, onClickSetAsFeature, onClickDelete }) => {
  const navigate = useNavigate();

  return (
    <Menu shadow="md">
      <Menu.Target>
        <Button>
          <MenuIcon />
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>
          <div
            aria-hidden
            onClick={() => navigate(`/campaigns/view-details/${itemId}`)}
            className="cursor-pointer flex items-center gap-1"
          >
            <Eye className="h-4" />
            <span className="ml-1">View Details</span>
          </div>
        </Menu.Item>
        <RoleBased acceptedRoles={[ROLES.ADMIN]}>
          <Menu.Item>
            <div
              aria-hidden
              onClick={() => navigate(`edit-details/${itemId}`)}
              className="cursor-pointer flex items-center gap-1"
            >
              <Edit2 className="h-4" />
              <span className="ml-1">Edit</span>
            </div>
          </Menu.Item>
          <Menu.Item aria-hidden onClick={onClickDelete}>
            <div className="cursor-pointer flex items-center gap-1">
              <Trash className="h-4" />
              <span className="ml-1">Delete</span>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div
              className={classNames(
                'bg-white cursor-pointer flex items-center text',
                isFeatured ? 'text-purple-450' : '',
              )}
              aria-hidden
              onClick={onClickSetAsFeature}
            >
              <Bookmark className="h-4 mr-2" />
              <span>Set as Featured</span>
            </div>
          </Menu.Item>
        </RoleBased>
      </Menu.Dropdown>
    </Menu>
  );
};

export default CampaignsMenuPopover;
