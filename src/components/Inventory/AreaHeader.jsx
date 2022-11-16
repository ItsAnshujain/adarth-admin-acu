import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Text, Button, Checkbox } from '@mantine/core';
import classNames from 'classnames';
import { Plus, ChevronDown, Server, Grid, MapPin } from 'react-feather';
import { useClickOutside } from '@mantine/hooks';
import shallow from 'zustand/shallow';
import Filter from './Filter';
import useLayoutView from '../../store/layout.store';
import RoleBased from '../RoleBased';
import { ROLES } from '../../utils';

const AreaHeader = ({
  text,
  handleSelectedCards = () => {},
  noOfCardsSelected,
  totalCards,
  onDeleteCards = () => {},
  isLoading = false,
}) => {
  const { pathname } = useLocation();
  const [addDetailsClicked, setAddDetails] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const addDetailsButtonRef = useClickOutside(() => setAddDetails(false));

  const { activeLayout, setActiveLayout } = useLayoutView(
    state => ({
      activeLayout: state.activeLayout,
      setActiveLayout: state.setActiveLayout,
    }),
    shallow,
  );

  const toggleFilter = () => setShowFilter(!showFilter);
  const toggleAddDetails = () => setAddDetails(!addDetailsClicked);
  const handleListClick = () => setActiveLayout({ ...activeLayout, inventory: 'list' });
  const handleGridClick = () => setActiveLayout({ ...activeLayout, inventory: 'grid' });
  const handleMapClick = () => setActiveLayout({ ...activeLayout, inventory: 'map' });

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
      <div className="pl-5">
        <Text size="lg" weight="bold">
          {!pathname.includes('reports') ? text : 'Inventory Report'}
        </Text>
      </div>
      <div className="flex justify-around mr-7">
        {!pathname.includes('reports') && (
          <div className="mr-2 flex ">
            <RoleBased
              acceptedRoles={[ROLES.ADMIN, ROLES.MEDIA_OWNER, ROLES.SUPERVISOR, ROLES.MANAGER]}
            >
              <Button
                onClick={onDeleteCards}
                className="border-gray-450 text-black font-normal radius-md mr-2"
                disabled={noOfCardsSelected === 0 || isLoading}
                loading={isLoading}
              >
                Delete items
              </Button>
            </RoleBased>
            {activeLayout.inventory === 'grid' ? (
              <Checkbox
                className="mr-5"
                onChange={event => handleSelectedCards(event.target.checked)}
                label="Select All Product"
                classNames={{ root: 'flex flex-row-reverse', label: 'pr-2' }}
                indeterminate={noOfCardsSelected > 0 && !(totalCards === noOfCardsSelected)}
                checked={totalCards === noOfCardsSelected && totalCards !== 0}
              />
            ) : null}
            <Button
              className={classNames(
                `px-4 border-gray-300 border rounded-md ${
                  activeLayout.inventory === 'list' ? 'bg-purple-450' : 'bg-white'
                }`,
              )}
              onClick={handleListClick}
            >
              <Server
                strokeWidth="3px"
                className={`max-h-5 ${classNames(
                  activeLayout.inventory === 'list' ? 'text-white' : 'text-black',
                )}`}
              />
            </Button>
            <Button
              className={classNames(
                `text-white border-gray-300 border px-4 rounded-md ${
                  activeLayout.inventory === 'grid' ? 'bg-purple-450' : 'bg-white'
                }`,
              )}
              onClick={handleGridClick}
            >
              <Grid
                strokeWidth="3px"
                className={`max-h-5 ${classNames(
                  activeLayout.inventory === 'grid' ? 'text-white' : 'text-black',
                )}`}
              />
            </Button>
            <Button
              className={classNames(
                `px-4 border-gray-300 border rounded-md ${
                  activeLayout.inventory === 'map' ? 'bg-purple-450' : 'bg-white'
                }`,
              )}
              onClick={handleMapClick}
            >
              <MapPin
                strokeWidth="3px"
                className={`max-h-5 ${classNames(
                  activeLayout.inventory === 'map' ? 'text-white' : 'text-black',
                )}`}
              />
            </Button>
          </div>
        )}
        <div className="mr-2">
          <Button onClick={toggleFilter} variant="default" type="button" className="font-medium">
            <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
          </Button>
          {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
        </div>
        {!pathname.includes('reports') && (
          <div className="relative">
            <RoleBased
              acceptedRoles={[ROLES.ADMIN, ROLES.MEDIA_OWNER, ROLES.SUPERVISOR, ROLES.MANAGER]}
            >
              <Button
                onClick={toggleAddDetails}
                className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4 text-sm"
              >
                <Plus size={16} className="mt-[1px] mr-1" /> Add Space
              </Button>
            </RoleBased>
            {addDetailsClicked && (
              <div
                ref={addDetailsButtonRef}
                className="absolute text-sm z-20 bg-white shadow-lg p-4 right-7 w-36"
              >
                <Link to="create-space/single">
                  <div className="mb-2 cursor-pointer">Single Entry</div>
                </Link>
                <Link to="create-space/bulk">
                  <div className="cursor-pointer">Bulk/CSV Upload</div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaHeader;
