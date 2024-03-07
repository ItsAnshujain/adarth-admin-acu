import LeadsList from '../../components/modules/leads/LeadsList';
import LeadsStats from '../../components/modules/leads/LeadsStats';

const LeadsDashboardPage = () => (
  <div className="overflow-y-auto px-3 col-span-10">
    <LeadsStats />
    <LeadsList />
  </div>
);

export default LeadsDashboardPage;
