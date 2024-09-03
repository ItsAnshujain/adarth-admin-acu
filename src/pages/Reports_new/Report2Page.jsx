import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useInfiniteCompanies } from '../../apis/queries/companies.queries';
import { useSearchParams } from 'react-router-dom';
import { useBookings } from '../../apis/queries/booking.queries';

const barDataConfigByClient = {
  styles: {
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
};

const normalizeString = (str) => {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
};

const Report2Page = () => {
  const parentCompaniesQuery = useInfiniteCompanies({
    page: 1,
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    type: 'lead-company',
    isParent: false,
  });

  const parentCompanies = useMemo(
    () =>
      parentCompaniesQuery.data?.pages
        .reduce((acc, { docs }) => [...acc, ...docs], [])
        .map(doc => ({
          ...doc,
          label: doc.company,
          value: doc._id,
        })) || [],
    [parentCompaniesQuery?.data]
  );

  console.log('Parent Companies Data:', parentCompanies);

  const [searchParams] = useSearchParams({
    page: 1,
    limit: 1000,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: bookingData, isLoading: isLoadingBookingData, error } = useBookings(searchParams.toString());

  const aggregatedData = useMemo(() => {
    if (!bookingData || !parentCompanies.length) return {};

    const validCompanyTypes = ['government', 'nationalAgency', 'localAgency', 'directClient'];

    // Create a map of normalized company names to their types from parentCompanies
    const companyTypeMap = parentCompanies.reduce((acc, company) => {
      const normalizedCompanyName = normalizeString(company.company);
      acc[normalizedCompanyName] = company.companyType;
      return acc;
    }, {});

    console.log('Company Type Map:', companyTypeMap);

    const aggregatedAmount = validCompanyTypes.reduce((acc, type) => {
      acc[type] = 0;
      return acc;
    }, {});

    bookingData.docs.forEach(booking => {
      const normalizedBookingCompany = normalizeString(booking.company);
      const companyType = companyTypeMap[normalizedBookingCompany];

      console.log(`Booking Company: ${normalizedBookingCompany}, Mapped Type: ${companyType}`);

      // Only aggregate amount if company type is one of the valid types
      if (companyType && validCompanyTypes.includes(companyType)) {
        aggregatedAmount[companyType] += booking.totalAmount || 0;
      } 
    });

    console.log('Aggregated Data:', aggregatedAmount);

    return aggregatedAmount;
  }, [bookingData, parentCompanies]);

  const pieChartData = useMemo(() => {
    const labels = Object.keys(aggregatedData);
    const data = Object.values(aggregatedData);

    return {
      labels,
      datasets: [
        {
          label: 'Revenue by Client Type',
          data,
          ...barDataConfigByClient.styles,
        },
      ],
    };
  }, [aggregatedData]);

  const [updatedClient, setUpdatedClient] = useState(pieChartData);

  useEffect(() => {
    if (bookingData && parentCompanies) {
      setUpdatedClient(pieChartData);
    }
  }, [pieChartData, bookingData, parentCompanies]);

  return (
    <>
      <div className="flex mt-16 mx-10 gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 p-4 items-center min-h-[200px]">
            <p className="font-bold">Client Company Type Revenue Bifurcation</p>
            <div className="w-80">
              {isLoadingBookingData ? (
                <p className="text-center">Loading...</p>
              ) : updatedClient.datasets[0].data.length === 0 ? (
                <p className="text-center">NA</p>
              ) : (
                <Pie
                  data={updatedClient}
                  options={barDataConfigByClient.options}
                  height={200}
                  width={200}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report2Page;
