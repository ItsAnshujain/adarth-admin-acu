/* eslint-disable */
import { useMemo, useState } from 'react';
import { useTable, useSortBy, useRowSelect, usePagination } from 'react-table';
import dummy from '../../Dummydata/Inventory.json';
import COLUMNS from './column';
import Ascending from '../../assets/Icons/Ascending';
import Descending from '../../assets/Icons/Descending';
import IndeterminateCheckbox from './Checkbox';
import { Pagination } from '@mantine/core';

// REMINDER : selectedFlatRows.original gives array of all selected rows and selectedRowIds contains all the data from id field
const Table = () => {
  const [activePage, setPage] = useState();
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => dummy, []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // state: { selectedRowIds, pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },

    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        },
        ...columns,
      ]);
    },
  );

  return (
    <div className="mr-7 max-w-screen overflow-scroll">
      <table className="w-screen " {...getTableProps()}>
        <thead className="bg-gray-100">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(header => (
                <th className="text-sm" {...header.getHeaderProps(header.getSortByToggleProps())}>
                  <div className="flex align-center text-left pl-2 text-gray-500 hover:text-black py-2 text-xs">
                    <div>{header.render('Header')}</div>
                    <div className="ml-2 gap-1 flex flex-col">
                      {header.isSorted ? (
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
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr className="text-left border" {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td className="pl-2 py-2 " {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* TODO: Remove Pagination from here and do everything by sending request to backend */}
      <Pagination
        className="absolute right-0 mx-5 mt-2"
        page={activePage}
        onChange={nextPage}
        onClick={nextPage}
        total={3}
      />
    </div>
  );
};

export default Table;
