import ViewCompanyHeader from '../../components/modules/company/ViewCompanyHeader';

const ViewCompanyPage = ({ type }) => (
  <div className="overflow-y-auto px-3 col-span-10">
    <div className="overflow-y-auto px-3 col-span-10">
      <ViewCompanyHeader type={type} />
    </div>
  </div>
);

export default ViewCompanyPage;
