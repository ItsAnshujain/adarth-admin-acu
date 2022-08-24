/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState } from 'react';
import { useTable, useSortBy, useRowSelect, usePagination } from 'react-table';
import { Pagination } from '@mantine/core';
import IndeterminateCheckbox from './Checkbox';
import Ascending from '../../assets/Icons/Ascending';
import Descending from '../../assets/Icons/Descending';

// TODO: selectedFlatRows.original gives array of all selected rows and selectedRowIds contains all the data from id field
const Table = ({ COLUMNS, dummy, allowRowsSelect = false }) => {
  const [activePage, _] = useState();
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => dummy, []);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, nextPage } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },

    useSortBy,
    usePagination,
    useRowSelect,
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

  return (
    <div>
      <div className="mr-7 max-w-screen overflow-x-scroll">
        <table className="w-screen" {...getTableProps()}>
          <thead className="bg-gray-100">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(header => (
                  <th className="text-sm" {...header.getHeaderProps(header.getSortByToggleProps())}>
                    <div className="w-max flex align-center text-left pl-2 text-gray-400 hover:text-black py-2 text-xs">
                      <div className="w-fit">{header.render('Header')}</div>
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
                <tr className="text-left border border-l-0" {...row.getRowProps()}>
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
        {/* TODO: Remove Pagination from here and do everything by sending request to backend */}
      </div>
      <div className="flex justify-end my-4 pr-7">
        <Pagination
          styles={theme => ({
            item: {
              color: theme.colors.gray[5],
              fontWeight: 700,
            },
          })}
          page={activePage}
          onChange={nextPage}
          onClick={nextPage}
          total={dummy.length}
        />
      </div>
    </div>
  );
};

export default Table;
