import { Badge, Divider, Select } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { indianCurrencyInDecimals } from '../../../utils';
import { DATE_FORMAT } from '../../../utils/constants';

const LeadsOverview = ({ leadData }) => {
  const primaryInChargeOptions = useMemo(
    () =>
      leadData?.primaryInCharge
        ? [{ label: leadData?.primaryInCharge?.name, value: leadData?.primaryInCharge?._id }]
        : [],
    [leadData],
  );
  const secondaryInChargeOptions = useMemo(
    () =>
      leadData?.secondaryInCharge
        ? [{ label: leadData?.secondaryInCharge?.name, value: leadData?.secondaryInCharge?._id }]
        : [],
    [leadData],
  );
  return (
    <div>
      <div className="flex gap-2">
        <div className="border border-gray-200 flex items-center text-gray-400 text-sm rounded-md px-2 w-fit">
          <div className="text-sm">Primary Incharge - </div>
          <Select
            clearable
            searchable
            placeholder="Select..."
            name="primaryIncharge"
            data={primaryInChargeOptions}
            value={primaryInChargeOptions?.[0]?.value}
            withAsterisk
            rightSection={<ChevronDown size={20} />}
            className="w-28"
            readOnly
            classNames={{
              input: 'border-none',
              dropdown: 'w-56',
            }}
          />
        </div>
        <div className="border border-gray-200 flex items-center text-gray-400 text-md rounded-md px-2 w-fit">
          <div className="text-sm">Secondary Incharge - </div>
          <Select
            clearable
            searchable
            placeholder="Select..."
            name="secondaryIncharge"
            data={secondaryInChargeOptions}
            value={secondaryInChargeOptions?.[0]?.value}
            withAsterisk
            rightSection={<ChevronDown size={20} />}
            className="w-28"
            readOnly
            classNames={{
              input: 'border-none',
              dropdown: 'w-56',
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 py-4">
        <div className="text-xl font-bold">{leadData?.leadCompany?.companyName}</div>
        <div className="text-sm text-black/80">{leadData?.objective}</div>
        <div className="text-lg font-bold">Basic information</div>
        <div className="flex">
          <div className="flex flex-col w-1/4">
            <div className="text-sm text-gray-500 pb-1">Start Date</div>
            <div className="text-sm">
              {leadData?.targetStartDate
                ? dayjs(leadData?.targetStartDate).format(DATE_FORMAT)
                : '-'}
            </div>
          </div>
          <div className="flex flex-col w-1/4">
            <div className="text-sm text-gray-500 pb-1">End Date</div>
            <div className="text-sm">
              {' '}
              {leadData?.targetEndDate ? dayjs(leadData?.targetEndDate).format(DATE_FORMAT) : '-'}
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col  w-1/4">
            <div className="text-sm text-gray-500 pb-1">Contact Person</div>
            <div className="text-sm">{leadData?.contact?.name}</div>
          </div>
          <div className="flex flex-col  w-1/4">
            <div className="text-sm text-gray-500 pb-1">Contact Number</div>
            <div className="text-sm">
              {leadData?.contact?.contactNumber ? `+91${leadData?.contact?.contactNumber}` : '-'}
            </div>
          </div>
        </div>
        <div className="flex flex-col  w-1/4">
          <div className="text-sm text-gray-500 pb-1">Display Brand</div>
          <div className="text-sm">{leadData?.brandDisplay}</div>
        </div>
        <div className="flex flex-col  w-1/4">
          <div className="text-sm text-gray-500 pb-1">Company Representing</div>
          <div className="text-sm">{leadData?.companyRepresenting?.companyName}</div>
        </div>
        <Divider className="my-6" />
        <div className="text-base font-bold">Other information</div>
        <div className="flex">
          <div className="flex flex-col  w-1/4">
            <div className="text-sm text-gray-500 pb-1">Overall Budget</div>
            <div className="text-sm">{indianCurrencyInDecimals(leadData?.overAllBudget || 0)}</div>
          </div>
          <div className="flex flex-col  w-1/4">
            <div className="text-sm text-gray-500 pb-1">Lead Close Date</div>
            <div className="text-sm">
              {leadData?.leadCloseDate ? dayjs(leadData?.leadCloseDate).format(DATE_FORMAT) : '-'}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-gray-500 pb-1">Target Audience</div>
          <div className="flex gap-2">
            {leadData?.targetAudience?.[0]?.length
              ? leadData?.targetAudience?.map(target => (
                  <Badge size="xs" className="bg-purple-450 text-white w-fit p-3 my-1 capitalize">
                    {target}
                  </Badge>
                ))
              : '-'}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-gray-500 pb-1">Campaign Theme</div>
          {leadData?.campaignTheme ? (
            <Badge size="xs" className="bg-purple-450 text-white w-fit p-3 my-1 capitalize">
              {leadData?.campaignTheme}
            </Badge>
          ) : (
            '-'
          )}
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-gray-500 pb-1">Brand Competitor</div>

          <div className="flex gap-2">
            {leadData?.brandCompetitors?.[0]?.length
              ? leadData?.brandCompetitors?.map(competitor => (
                  <Badge size="xs" className="bg-purple-450 text-white w-fit p-3 my-1 capitalize">
                    {competitor}
                  </Badge>
                ))
              : '-'}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-gray-500 pb-1">Prospect</div>
          <div className="text-sm">{leadData?.prospect || '-'}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-gray-500 pb-1">Lead Source</div>
          <div className="text-sm">{leadData?.leadSource || '-'}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-gray-500 pb-1">Remarks</div>
          <div className="text-sm">{leadData?.remarksComments || '-'}</div>
        </div>
      </div>
    </div>
  );
};

export default LeadsOverview;
