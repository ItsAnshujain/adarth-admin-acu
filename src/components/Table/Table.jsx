import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useTable, useSortBy, useRowSelect } from 'react-table';
import { Pagination } from '@mantine/core';
import IndeterminateCheckbox from './Checkbox';
import Ascending from '../../assets/Icons/Ascending';
import Descending from '../../assets/Icons/Descending';

// TODO: FIX table selected rows issue
const Table = ({
  COLUMNS,
  data = [],
  allowRowsSelect = false,
  isCreateOrder = false,
  activePage = 1,
  totalPages = 1,
  setSelectedFlatRows = () => {},
  setActivePage = () => {},
  selectedRowData = [],
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

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, selectedFlatRows } =
    useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, selectedRowIds: handleSelectedRows() },
      },
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
    setSelectedFlatRows(selectedFlatRows);
  }, [selectedFlatRows]);

  return (
    <>
      <div className="mr-7 max-w-screen overflow-x-auto  min-h-[450px]">
        <table className="w-full overflow-y-visible relative z-10" {...getTableProps()}>
          <thead className="bg-gray-100">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(header => (
                  <th className="text-sm" {...header.getHeaderProps(header.getSortByToggleProps())}>
                    {!header.hideHeader ? (
                      <div className="w-max flex align-center text-left pl-2 text-gray-400 hover:text-black py-2 text-xs font-medium">
                        <div className="w-fit tracking-wide">{header.render('Header')}</div>
                        <div className="ml-2 gap-1 flex flex-col">
                          {header.canSort ? (
                            header.isSorted ? (
                              header.isSortedDesc ? (
                                <>
                                  <Ascending fill="#A1A9B8" />
                                  <Descending fill="black" />
                                </>
                              ) : (
                                <>
                                  <Ascending fill="black" />
                                  <Descending fill="#A1A9B8" />
                                </>
                              )
                            ) : (
                              <>
                                <Ascending fill="#A1A9B8" />
                                <Descending fill="#A1A9B8" />
                              </>
                            )
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows?.length === 0 && (
              <tr>
                <td className="pl-2 py-2 text-center">
                  <p>No Records Found</p>
                </td>
              </tr>
            )}
            {rows?.map(row => {
              prepareRow(row);
              return (
                <tr
                  className={classNames(
                    'text-left overflow-auto',
                    !isCreateOrder ? 'border border-l-0' : 'my-4',
                  )}
                  {...row.getRowProps()}
                >
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
      {!isCreateOrder && (
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
      )}
    </>
  );
};

export default Table;
