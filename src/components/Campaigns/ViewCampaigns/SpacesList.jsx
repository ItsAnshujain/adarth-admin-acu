import { useState, useEffect } from 'react';
import { Text, Button } from '@mantine/core';
import { Plus } from 'react-feather';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebouncedState } from '@mantine/hooks';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import calendar from '../../../assets/data-table.svg';
import DateRange from '../../DateRange';
import Table from '../../Table/Table';

const SpacesList = ({ data = {}, columns }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useDebouncedState('', 500);
  const navigate = useNavigate();
  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleSortByColumn = colId => {
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'desc') {
      searchParams.set('sortOrder', 'asc');
      setSearchParams(searchParams);
      return;
    }
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'asc') {
      searchParams.set('sortOrder', 'desc');
      setSearchParams(searchParams);
      return;
    }

    searchParams.set('sortBy', colId);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (search) {
      searchParams.set('search', search);
    } else {
      searchParams.delete('search');
    }

    setSearchParams(searchParams);
  }, [search]);
  return (
    <>
      <div className="mt-5 pl-5 pr-7 flex justify-between">
        <Text>List of space for the campaign</Text>
        <div className="flex">
          <div className="mr-2 relative">
            <Button onClick={openDatePicker} variant="default" type="button">
              <img src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-3/4 bg-white -top-0.3">
                <DateRange handleClose={openDatePicker} />
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => navigate('/inventory/create-space/single')}
              className="bg-purple-450 flex items-center align-center py-2 text-white rounded-md px-4 text-sm"
              type="button"
            >
              <Plus size={16} className="mt-[1px] mr-1" /> Add Space
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between h-20 items-center">
          <RowsPerPage
            setCount={limit => {
              searchParams.set('limit', limit);
              setSearchParams(searchParams);
            }}
            count={searchParams.get('limit')}
          />
          <Search search={search} setSearch={setSearch} />
        </div>
        <Table
          data={data?.docs || []}
          COLUMNS={columns}
          allowRowsSelect
          handleSorting={handleSortByColumn}
        />
      </div>
    </>
  );
};

export default SpacesList;
