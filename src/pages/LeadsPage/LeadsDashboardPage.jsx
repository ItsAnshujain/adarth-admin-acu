import dayjs from 'dayjs';
import { useLeadStats } from '../../apis/queries/leads.queries';
import LeadsList from '../../components/modules/leads/LeadsList';
import LeadsStats from '../../components/modules/leads/LeadsStats';
import { financialEndDate, financialStartDate, serialize } from '../../utils';
import { DATE_FORMAT } from '../../utils/constants';

const LeadsDashboardPage = () => {
  const leadStatsQuery = useLeadStats(
    serialize({
      from: dayjs(financialStartDate).format(DATE_FORMAT),
      to: dayjs(financialEndDate).format(DATE_FORMAT),
    }),
    !!financialStartDate && !!financialEndDate,
  );

  return (
    <div className="overflow-y-auto px-3 col-span-10">
      <LeadsStats heading="Lead Stats" leadStatsData={leadStatsQuery?.data} />
      <LeadsList />
    </div>
  );
};

export default LeadsDashboardPage;
