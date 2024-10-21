import { useState, useMemo } from 'react';
import { useBookingsNew } from '../../apis/queries/booking.queries';
import { useSearchParams } from 'react-router-dom';
import { Menu, Button } from '@mantine/core';
import DateRangeSelector from '../../components/DateRangeSelector';
import Table from '../../components/Table/Table';
import classNames from 'classnames';

const viewBy = {
  yearly: 'Yearly',
  halfYearly: 'Half Yearly',
  quarterly: 'Quarterly',
  monthly: 'Monthly',
  weekly: 'Weekly',
  customDate: 'Custom Date Range',
};
const viewOptions = [
  { label: 'Yearly', value: 'yearly' },
  { label: 'Half Yearly', value: 'halfYearly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Custom Date Range', value: 'customDate' },
];

const MediaWiseReport = () => {
  const [searchParams] = useSearchParams({
    page: 1,
    limit: 1000,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: bookingData, isLoading: isLoadingBookingData } = useBookingsNew(
    searchParams.toString(),
  );

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filter, setFilter] = useState('yearly');
  const [activeView, setActiveView] = useState('yearly');

  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const filteredData = useMemo(() => {
    if (!bookingData) return [];

    const getDate = dateString => new Date(dateString);
    const today = new Date();

    // Get the start and end of the current financial year
    const currentFinancialYearStart = new Date(today.getFullYear(), 3, 1); // April 1 of current year
    const currentFinancialYearEnd = new Date(today.getFullYear() + 1, 2, 31); // March 31 of next year
    const currentMonth = today.getMonth(); // 0 = Jan, 11 = Dec

    return bookingData.filter(booking => {
      const createdAt = getDate(booking.createdAt);

      switch (filter) {
        case 'yearly':
          return createdAt >= currentFinancialYearStart && createdAt <= currentFinancialYearEnd;

        case 'halfYearly': {
          const bookingMonth = createdAt.getMonth(); // Month of the booking
          const bookingYear = createdAt.getFullYear();

          if (
            bookingYear === currentFinancialYearStart.getFullYear() ||
            bookingYear === currentFinancialYearEnd.getFullYear()
          ) {
            if (currentMonth >= 9) {
              // If current month is October (9) or later, show Q3 and Q4
              return bookingMonth >= 6 && bookingMonth <= 11; // July - December
            } else {
              // If current month is before October, show Q1 and Q2
              return bookingMonth >= 3 && bookingMonth <= 8; // April - September
            }
          }
          return false;
        }

        case 'quarterly': {
          const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
          const quarterStart = new Date(today.getFullYear(), quarterStartMonth, 1);
          const quarterEnd = new Date(today.getFullYear(), quarterStartMonth + 3, 0); // Last day of the quarter
          return createdAt >= quarterStart && createdAt <= quarterEnd;
        }

        case 'monthly':
          return (
            createdAt.getMonth() === currentMonth && createdAt.getFullYear() === today.getFullYear()
          );

        case 'weekly': {
          const getWeekOfMonth = date => {
            const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const dayOfMonth = date.getDate();
            const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 6 = Saturday
            return Math.ceil((dayOfMonth + firstDayOfWeek) / 7); // Calculate week number within the month
          };

          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the current month
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of the current month

          return createdAt >= startOfMonth && createdAt <= endOfMonth; // Filter only for the current month
        }

        case 'customDate':
          return (
            startDate &&
            endDate &&
            createdAt >= new Date(startDate) &&
            createdAt <= new Date(endDate)
          );

        default:
          return true;
      }
    });
  }, [filter, startDate, endDate, bookingData]);

  const prepareYearlyData = bookings => {
    const groupedData = {};

    const clientTypes = ['Direct Client', 'Local Agency', 'National Agency', 'Government'];

    // Helper function to get the financial year for a given date
    const getFinancialYear = date => {
        const month = date.getMonth();
        const year = date.getFullYear();
        return month >= 3 ? year : year - 1; // Financial year starts from April (month >= 3)
    };

    // Helper function to determine the quarter
    const getQuarter = monthIndex => {
        if (monthIndex >= 3 && monthIndex <= 5) {
            return 'First Quarter'; // April - June
        } else if (monthIndex >= 6 && monthIndex <= 8) {
            return 'Second Quarter'; // July - September
        } else if (monthIndex >= 9 && monthIndex <= 11) {
            return 'Third Quarter'; // October - December
        } else {
            return 'Fourth Quarter'; // January - March
        }
    };

    const today = new Date(); // Current date
    const currentMonth = today.getMonth();
    const currentFinYearStart = new Date(today.getFullYear(), 3, 1); // Financial year starts in April
    const currentFinYearEnd = new Date(today.getFullYear() + 1, 2, 31); // Ends in March next year

    // Object to hold the quarterly summations
    const quarterlySummaries = {};

    // Process bookings to group data
    bookings.forEach(booking => {
        const createdAt = new Date(booking.createdAt);

        // Ignore future data beyond today's date
        if (createdAt > today) return;

        const month = createdAt.getMonth(); // monthIndex: 0 = Jan, 11 = Dec
        const year = getFinancialYear(createdAt); // Adjusted for financial year
        const clientType = booking?.client?.clientType || '-';

        let periodKey = '';
        let groupingKey = '';
        const monthName = createdAt.toLocaleString('default', { month: 'long' });

        switch (filter) {
            case 'yearly':
                if (createdAt < currentFinYearStart || createdAt > currentFinYearEnd) return;

                const quarter = getQuarter(month);
                periodKey = `${monthName} ${year}`;
                groupingKey = `${month}-${year}`; // e.g., "4-2024" for April 2024

                // Add quarter summation structure if not present
                if (!quarterlySummaries[quarter]) {
                    quarterlySummaries[quarter] = {
                        ownedSiteRevenue: 0,
                        tradedSiteRevenue: 0,
                        totalRevenue: 0,
                        tradedMargin: 0,
                        clientType: 'Quarterly Summary',
                        operationalCosts: { electricity: 0, licenseFee: 0, rental: 0, misc: 0 },
                        tradedPurchaseCost: 0,
                        grossRevenueOwned: 0,
                        grossRevenueTraded: 0,
                    };
                }
                break;

            case 'halfYearly':
                if (createdAt < currentFinYearStart || createdAt > currentFinYearEnd) return;
                const halfYear = currentMonth >= 3 && currentMonth <= 8 ? 'First Half' : 'Second Half';
                periodKey = `${monthName} ${year}`;
                groupingKey = `${month}-${year}`;
                break;

            case 'quarterly':
                periodKey = `${createdAt.toLocaleString('default', { month: 'long' })} ${year}`;
                groupingKey = `${getQuarter(month)}-${year}-${month}`;
                break;

            case 'monthly':
                periodKey = `${createdAt.toLocaleString('default', { month: 'long' })} ${year}`;
                groupingKey = `${month}-${year}`;
                break;
                
            case 'weekly': {
                const getWeekOfMonth = date => {
                    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                    const dayOfMonth = date.getDate();
                    const firstDayOfWeek = firstDayOfMonth.getDay();
                    return Math.ceil((dayOfMonth + firstDayOfWeek) / 7); // Week number within the month
                };

                const weekOfMonth = getWeekOfMonth(createdAt); // Calculate the week number for each booking
                periodKey = `Week ${weekOfMonth}, ${monthName} ${year}`; // Display the week number in the period key
                groupingKey = `week-${weekOfMonth}-${today.getMonth()}-${year}`; // Group by week number within the current month
                break;
            }

            case 'customDate':
                periodKey = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                groupingKey = `custom-${startDate}-${endDate}`;
                break;

            default:
                periodKey = '-';
        }

        // Ensure that groupedData[groupingKey] is initialized
        if (!groupedData[groupingKey]) {
            groupedData[groupingKey] = {};
        }

        // Ensure that groupedData[groupingKey][clientType] is initialized
        if (!groupedData[groupingKey][clientType]) {
            groupedData[groupingKey][clientType] = {
                period: periodKey, // Period label (Quarter or Month)
                clientType: clientType,
                ownedSiteRevenue: 0,
                tradedSiteRevenue: 0,
                operationalCosts: {
                    electricity: 0,
                    licenseFee: 0,
                    rental: 0,
                    misc: 0,
                },
                tradedPurchaseCost: 0,
                tradedMargin: 0,
                grossRevenueOwned: 0,
                grossRevenueTraded: 0,
                totalRevenue: 0,
            };
        }

        // Process revenue, operational costs, etc. (same logic as before)
        let totalPrice = 0;
        let totalTradedAmount = 0;
        const totalAmount = booking.totalAmount || 0;

        groupedData[groupingKey][clientType].totalRevenue += totalAmount / 100000; // Convert to lac

        const spaces = booking.details[0]?.campaign?.spaces || [];

        if (Array.isArray(spaces)) {
            spaces.forEach(space => {
                totalTradedAmount += (space.tradedAmount || 0) / 100000; // Convert to lac
                totalPrice += (space.basicInformation?.price || 0) / 100000; // Convert to lac

                if (totalTradedAmount === 0) {
                    groupedData[groupingKey][clientType].ownedSiteRevenue += totalPrice;
                    groupedData[groupingKey][clientType].grossRevenueOwned += totalPrice;
                } else {
                    groupedData[groupingKey][clientType].tradedSiteRevenue += totalPrice;
                    groupedData[groupingKey][clientType].grossRevenueTraded += totalPrice;
                }
                groupedData[groupingKey][clientType].tradedPurchaseCost += totalTradedAmount || 0;
                groupedData[groupingKey][clientType].tradedMargin += totalPrice - (totalTradedAmount || 0);
            });
        }

        // Process operational costs
        if (Array.isArray(booking.operationalCosts)) {
            booking.operationalCosts.forEach(cost => {
                const amount = (cost.amount || 0) / 100000; // Convert to lac
                const typeName = cost.type?.name;

                if (typeName) {
                    switch (typeName) {
                        case 'Electricity':
                            groupedData[groupingKey][clientType].operationalCosts.electricity += amount;
                            break;
                        case 'License Fees Deposit NF Railway':
                        case 'License Fees Deposit ASTC':
                            groupedData[groupingKey][clientType].operationalCosts.licenseFee += amount;
                            break;
                        case 'Site Rental':
                        case 'Hoarding Hire & Rental':
                            groupedData[groupingKey][clientType].operationalCosts.rental += amount;
                            break;
                        default:
                            groupedData[groupingKey][clientType].operationalCosts.misc += amount;
                            break;
                    }
                }
            });
        }

        // Update quarterly summary
       // Update quarterly summary
if (filter === 'yearly') {
  const quarter = getQuarter(month);
  
  // Initialize quarterly summary if it doesn't exist
  if (!quarterlySummaries[quarter]) {
      quarterlySummaries[quarter] = {
          ownedSiteRevenue: 0,
          tradedSiteRevenue: 0,
          totalRevenue: 0,
          tradedMargin: 0,
          operationalCosts: { electricity: 0, licenseFee: 0, rental: 0, misc: 0 },
          tradedPurchaseCost: 0,
          grossRevenueOwned: 0,
          grossRevenueTraded: 0,
      };
  }

  // Aggregate values for the quarterly summary
  const clientData = groupedData[groupingKey][clientType];

  if (clientData) {
      // Ensure to only add valid numbers
      quarterlySummaries[quarter].ownedSiteRevenue += Number.isFinite(clientData.ownedSiteRevenue) 
          ? clientData.ownedSiteRevenue 
          : 0;

      quarterlySummaries[quarter].tradedSiteRevenue += Number.isFinite(clientData.tradedSiteRevenue) 
          ? clientData.tradedSiteRevenue 
          : 0;

      quarterlySummaries[quarter].totalRevenue += Number.isFinite(clientData.totalRevenue) 
          ? clientData.totalRevenue 
          : 0;

      quarterlySummaries[quarter].tradedMargin += Number.isFinite(clientData.tradedMargin) 
          ? clientData.tradedMargin 
          : 0;

      quarterlySummaries[quarter].operationalCosts.electricity += Number.isFinite(clientData.operationalCosts.electricity) 
          ? clientData.operationalCosts.electricity 
          : 0;

      quarterlySummaries[quarter].operationalCosts.licenseFee += Number.isFinite(clientData.operationalCosts.licenseFee) 
          ? clientData.operationalCosts.licenseFee 
          : 0;

      quarterlySummaries[quarter].operationalCosts.rental += Number.isFinite(clientData.operationalCosts.rental) 
          ? clientData.operationalCosts.rental 
          : 0;

      quarterlySummaries[quarter].operationalCosts.misc += Number.isFinite(clientData.operationalCosts.misc) 
          ? clientData.operationalCosts.misc 
          : 0;

      quarterlySummaries[quarter].tradedPurchaseCost += Number.isFinite(clientData.tradedPurchaseCost) 
          ? clientData.tradedPurchaseCost 
          : 0;

      quarterlySummaries[quarter].grossRevenueOwned += Number.isFinite(clientData.grossRevenueOwned) 
          ? clientData.grossRevenueOwned 
          : 0;

      quarterlySummaries[quarter].grossRevenueTraded += Number.isFinite(clientData.grossRevenueTraded) 
          ? clientData.grossRevenueTraded 
          : 0;
        }
        console.log('Client Data:', clientData);
        console.log('Quarterly Summaries Before Update:', quarterlySummaries[quarter]);
  }

    });

    // Ensure all client types are present in the final data for every period
    const finalData = [];
    const orderedGroupingKeys = Object.keys(groupedData).sort((a, b) => {
        const aParts = a.split('-');
        const bParts = b.split('-');
        return parseInt(aParts[0]) - parseInt(bParts[0]) || aParts[1].localeCompare(bParts[1]);
    });

    orderedGroupingKeys.forEach(groupingKey => {
        clientTypes.forEach(clientType => {
            if (!groupedData[groupingKey][clientType]) {
                groupedData[groupingKey][clientType] = {
                    period: groupedData[groupingKey][Object.keys(groupedData[groupingKey])[0]].period,
                    clientType: clientType,
                    ownedSiteRevenue: '-',
                    tradedSiteRevenue: '-',
                    operationalCosts: {
                        electricity: '-',
                        licenseFee: '-',
                        rental: '-',
                        misc: '-',
                    },
                    tradedPurchaseCost: '-',
                    tradedMargin: '-',
                    grossRevenueOwned: '-',
                    grossRevenueTraded: '-',
                    totalRevenue: '-',
                };
            }
            finalData.push(groupedData[groupingKey][clientType]);
        });

        // Add quarterly summaries after processing the last month of each quarter
        const monthIndex = parseInt(groupingKey.split('-')[0]);
        if (filter === 'yearly' && (monthIndex === 5 || monthIndex === 8 || monthIndex === 11)) {
            const quarter = getQuarter(monthIndex);
            if (quarterlySummaries[quarter]) {
                finalData.push(quarterlySummaries[quarter]);
                delete quarterlySummaries[quarter]; // Remove summary after adding
            }
        }
    });

    // Format all amounts to 2 decimal places and return finalData
    return finalData.map(data => ({
        ...data,
        ownedSiteRevenue: data.ownedSiteRevenue !== '-' ? data.ownedSiteRevenue.toFixed(2) : '-',
        tradedSiteRevenue: data.tradedSiteRevenue !== '-' ? data.tradedSiteRevenue.toFixed(2) : '-',
        operationalCosts: {
            electricity: data.operationalCosts.electricity !== '-' ? data.operationalCosts.electricity.toFixed(2) : '-',
            licenseFee: data.operationalCosts.licenseFee !== '-' ? data.operationalCosts.licenseFee.toFixed(2) : '-',
            rental: data.operationalCosts.rental !== '-' ? data.operationalCosts.rental.toFixed(2) : '-',
            misc: data.operationalCosts.misc !== '-' ? data.operationalCosts.misc.toFixed(2) : '-',
        },
        tradedPurchaseCost: data.tradedPurchaseCost !== '-' ? data.tradedPurchaseCost.toFixed(2) : '-',
        tradedMargin: data.tradedMargin !== '-' ? data.tradedMargin.toFixed(2) : '-',
        grossRevenueOwned: data.grossRevenueOwned !== '-' ? data.grossRevenueOwned.toFixed(2) : '-',
        grossRevenueTraded: data.grossRevenueTraded !== '-' ? data.grossRevenueTraded.toFixed(2) : '-',
        totalRevenue: data.totalRevenue !== '-' ? data.totalRevenue.toFixed(2) : '-',
    }));
};


  const yearlyData = useMemo(() => {
    return prepareYearlyData(filteredData);
  }, [filteredData]);
  const onDateChange = val => {
    setStartDate(val[0]);
    setEndDate(val[1]);
  };

  const handleReset = () => {
    setFilter('yearly');
    setActiveView('yearly');
    setStartDate(null);
    setEndDate(null);
  };

  const handleMenuItemClick = value => {
    setFilter(value);
    setActiveView(value);
  };

  const tableSalesData = yearlyData;
  const tableSalesColumns = useMemo(
    () => [
      {
        Header: 'Period',
        accessor: 'period', // Displays Quarter, HalfYear, Month
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: 'Client Type',
        accessor: 'clientType', // Client Type: Direct Client, Local Agency, etc.
        disableSortBy: true,
        Cell: ({ value }) => <p>{value || '-'}</p>,
      },
      {
        Header: 'Owned Site Revenue',
        accessor: 'ownedSiteRevenue',
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: 'Traded Site Revenue',
        accessor: 'tradedSiteRevenue',
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: 'Operational Costs (Electricity)',
        accessor: 'operationalCosts.electricity',
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: 'Operational Costs (License Fee)',
        accessor: 'operationalCosts.licenseFee',
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: 'Operational Costs (Rental)',
        accessor: 'operationalCosts.rental',
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: 'Operational Costs (Misc)',
        accessor: 'operationalCosts.misc',
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: 'Traded Purchase Cost',
        accessor: 'tradedPurchaseCost',
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: 'Traded Margin',
        accessor: 'tradedMargin',
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: 'Gross Revenue (Owned)',
        accessor: 'grossRevenueOwned',
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: 'Gross Revenue (Traded)',
        accessor: 'grossRevenueTraded',
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: 'Total Revenue',
        accessor: 'totalRevenue',
        disableSortBy: true,
        Cell: ({ value }) => <p>{value}</p>,
      },
    ],
    [],
  );

  return (
    <div className="col-span-12 lg:col-span-10 border-gray-450 overflow-auto">
      <div className="pt-6 w-[50rem] mx-10">
        <p className="font-bold pb-4">Sales Overview</p>

        <div className="flex">
          <div>
            <Menu shadow="md" width={130}>
              <Menu.Target>
                <Button className="secondary-button">
                  View By: {viewBy[activeView] || 'Select'}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {viewOptions.map(({ label, value }) => (
                  <Menu.Item
                    key={value}
                    onClick={() => handleMenuItemClick(value)}
                    className={classNames(activeView === value && 'text-purple-450 font-medium')}
                  >
                    {label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </div>
          {filter !== 'yearly' && (
            <div>
              <Button onClick={handleReset} className="mx-2 secondary-button">
                Reset
              </Button>
            </div>
          )}
        </div>

        {filter === 'customDate' && (
          <div className="flex flex-col items-start space-y-4 py-2">
            <DateRangeSelector
              dateValue={[startDate, endDate]}
              onChange={onDateChange}
              minDate={threeMonthsAgo}
              maxDate={today}
            />
          </div>
        )}
      </div>
      <div className=" h-[400px] overflow-auto mx-10 my-4">
        <Table
          data={tableSalesData}
          COLUMNS={tableSalesColumns}
          showPagination={false}
          loading={isLoadingBookingData}
        />
      </div>
    </div>
  );
};

export default MediaWiseReport;
