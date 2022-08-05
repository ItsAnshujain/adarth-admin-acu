import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Inventory from './pages/Inventory';
import Bookings from './pages/Bookings';
import Campaigns from './pages/Campaign/Campaigns';
import CampaignHome from './pages/Campaign/Home';
import CampaignCreate from './pages/Campaign/Create';
import Landlords from './pages/Landlords';
import Proposals from './pages/Proposals';
import Users from './pages/Users';
import CreateSpace from './pages/CreateSpace';
import SpaceDetails from './pages/SpacesDetails';
import CreateProposals from './pages/CreateProposals';
import ViewProposal from './pages/ProposalDetails';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/inventory/create-space" element={<CreateSpace />} />
      <Route path="/inventory/view-details/:id" element={<SpaceDetails />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/campaigns" element={<Campaigns />}>
        <Route path="" element={<CampaignHome />} />
        <Route path="create-campaign" element={<CampaignCreate />} />
      </Route>
      <Route path="/landlords" element={<Landlords />} />
      <Route path="/proposals" element={<Proposals />} />
      <Route path="/proposals/create-proposals" element={<CreateProposals />} />
      <Route path="/proposals/view-details/:id" element={<ViewProposal />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  </Router>
);

export default App;
