import React, { useEffect, useMemo } from 'react';
import { useTable, useSortBy, useRowSelect, useFilters } from 'react-table';
import { Pagination } from '@mantine/core';
import classNames from 'classnames';
import IndeterminateCheckbox from './Checkbox';
import Ascending from '../../assets/Icons/Ascending';
import Descending from '../../assets/Icons/Descending';

// TODO: FIX table selected rows issue
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
  isLoading = false,
  showPagination = true,
  className = '',
}) => {
  const columns = useMemo(() => COLUMNS, [COLUMNS]);

  const handleSelectedRows = () => {
    const obj = {};
    const preIds = selectedRowData.map(item => item._id);
    data?.forEach((row, index) => {
      if (preIds.includes(row._id)) {
        obj[index] = true;
      }
    });
    return obj;
  };

  const onHandleHeader = col => handleSorting(col.id);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, selectedFlatRows } =
    useTable(
      {
        columns,
        data,
        disableSortRemove: true,
        initialState: {
          pageIndex: 0,
          selectedRowIds: handleSelectedRows(),
        },
        manualPagination: true,
        manualSortBy: true,
        onHeaderClick: onHandleHeader,
      },
      useFilters,
      useSortBy,
      useRowSelect,
      /* eslint-disable react/no-unstable-nested-components */
      allowRowsSelect &&
        (hooks => {
          hooks.visibleColumns.push(cols => [
            {
              id: 'selection',
              Header: ({ getToggleAllRowsSelectedProps }) => (
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              ),
              Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
            },
            ...cols,
          ]);
        }),
    );

  useEffect(() => {
    if (!isLoading) {
      setSelectedFlatRows(selectedFlatRows);
    }
  }, [selectedFlatRows, isLoading]);

  return (
    <>
      <div className={classNames('mr-7 max-w-screen overflow-x-auto min-h-[450px]', className)}>
        <table className="w-full overflow-y-visible relative z-10" {...getTableProps()}>
          <thead className="bg-gray-100">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
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
                          header.isSortedDesc ? (
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
                <tr className="text-left overflow-auto border border-l-0" {...row.getRowProps()}>
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
