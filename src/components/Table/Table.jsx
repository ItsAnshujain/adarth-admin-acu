import React, { useMemo } from 'react';
import { useTable, useSortBy, useRowSelect, useFilters } from 'react-table';
import { Pagination } from '@mantine/core';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import IndeterminateCheckbox from './Checkbox';
import Ascending from '../../assets/Icons/Ascending';
import Descending from '../../assets/Icons/Descending';
import useUserStore from '../../store/user.store';

const Table = ({
  COLUMNS,
  data = [],
  allowRowsSelect = false,
  activePage = 1,
  totalPages = 1,
  setSelectedFlatRows = () => {},
  setActivePage = () => {},
  selectedRowData = [],
  handleSorting = () => {},
  showPagination = true,
  className = '',
}) => {
  const columns = useMemo(() => COLUMNS, [COLUMNS]);
  const [searchParams] = useSearchParams('');
  const sortOrder = searchParams.get('sortOrder');
  const userId = useUserStore(state => state.id);
  const selection = useMemo(() => selectedRowData?.map(item => item._id), [selectedRowData]);
  const selectedAll = useMemo(
    () => data?.length && data.every(item => selection.includes(item._id) || false),
    [data, selection],
  );

  const onHandleHeader = col => handleSorting(col.id);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data,
      disableSortRemove: true,
      initialState: {
        pageIndex: 0,
      },
      manualPagination: true,
      manualSortBy: true,
      onHeaderClick: onHandleHeader,
    },
    useFilters,
    useSortBy,
    useRowSelect,
  );

  const handleRowClick = (row, all = false) => {
    if (all) {
      if (selectedAll) {
        setSelectedFlatRows(selectedRowData.filter(id => row.find(r => r._id === id)));
        return;
      }

      const temp = [...selectedRowData];
      row.forEach(r => !selection.includes(r._id) && temp.push(r));
      setSelectedFlatRows(temp);
      return;
    }

    if (selection.includes(row._id)) {
      setSelectedFlatRows(selectedRowData.filter(item => item._id !== row._id));
      return;
    }

    setSelectedFlatRows([...selectedRowData, row]);
  };

  return (
    <>
      <div className={classNames('mr-7 max-w-screen overflow-x-auto min-h-[450px]', className)}>
        <table className="w-full overflow-y-visible relative z-10" {...getTableProps()}>
          <thead className="bg-gray-100">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {allowRowsSelect && (
                  <th className="text-sm px-2">
                    <IndeterminateCheckbox
                      checked={selectedAll}
                      onClick={() => handleRowClick(data, true)}
                    />
                  </th>
                )}
                {headerGroup.headers.map(header => (
                  <th
                    className="text-sm"
                    {...header.getHeaderProps(header.getSortByToggleProps())}
                    onClick={() => {
                      if (header.id.includes('selection') || header.disableSortBy) return;
                      onHandleHeader(header);
                    }}
                  >
                    <div className="w-max flex align-center text-left pl-2 text-gray-400 hover:text-black py-2 text-xs font-medium">
                      <div className="w-fit tracking-wide">{header.render('Header')}</div>
                      <div className="ml-2 gap-1 flex flex-col">
                        {header?.canSort ? (
                          header.isSortedDesc || sortOrder === 'desc' ? (
                            <>
                              <Ascending fill="black" />
                              <Descending fill="#A1A9B8" />
                            </>
                          ) : (
                            <>
                              <Ascending fill="#A1A9B8" />
                              <Descending fill="black" />
                            </>
                          )
                        ) : null}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows?.map(row => {
              prepareRow(row);
              return (
                <tr
                  className={classNames(
                    row.original?.peerId && row.original.peerId !== userId && 'has-peer',
                    'text-left overflow-auto border border-l-0',
                  )}
                  {...row.getRowProps()}
                >
                  {allowRowsSelect && (
                    <IndeterminateCheckbox
                      className="mx-2 mt-5"
                      checked={selection.includes(row.original._id)}
                      onClick={() => handleRowClick(row.original)}
                    />
                  )}
                  {row.cells.map(cell => (
                    <td className="pl-2 py-2" {...cell.getCellProps()}>
                      <div className="w-max">{cell.render('Cell')}</div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showPagination ? (
        <div className="flex justify-end my-4 pr-7">
          <Pagination
            styles={theme => ({
              item: {
                color: theme.colors.gray[5],
                fontWeight: 700,
              },
            })}
            page={activePage}
            onChange={setActivePage}
            total={totalPages}
          />
        </div>
      ) : null}
    </>
  );
};

export default Table;
