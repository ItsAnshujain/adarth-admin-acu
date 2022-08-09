import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Landlords from './pages/Landlords';
import Users from './pages/Users';
import Bookings from './pages/Bookings';

const LazyInventoryHome = lazy(() => import('./pages/Inventory/Home'));
const LazyInventory = lazy(() => import('./pages/Inventory/Inventorys'));
const LazyCreateSpace = lazy(() => import('./pages/Inventory/Create'));
const LazySpaceDetails = lazy(() => import('./pages/Inventory/View'));

const LazyCampaignHome = lazy(() => import('./pages/Campaign/Home'));
const LazyCampaigns = lazy(() => import('./pages/Campaign/Campaigns'));
const LazyCampaignCreate = lazy(() => import('./pages/Campaign/Create'));
const LazyCampaignView = lazy(() => import('./pages/Campaign/View'));

const LazyProposalsHome = lazy(() => import('./pages/Proposal/Home'));
const LazyProposals = lazy(() => import('./pages/Proposal/Proposals'));
const LazyCreateProposals = lazy(() => import('./pages/Proposal/Create'));
const LazyViewProposal = lazy(() => import('./pages/Proposal/View'));

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/inventory"
        element={
          <Suspense fallback="Loading ...">
            <LazyInventory />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback="Loading ...">
              <LazyInventoryHome />
            </Suspense>
          }
        />
        <Route
          path="create-space"
          element={
            <Suspense fallback="Loading ...">
              <LazyCreateSpace />
            </Suspense>
          }
        />
        <Route
          path="edit-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <LazyCreateSpace />
            </Suspense>
          }
        />
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <LazySpaceDetails />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/campaigns"
        element={
          <Suspense fallback="Loading ...">
            <LazyCampaigns />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback="Loading ...">
              <LazyCampaignHome />
            </Suspense>
          }
        />
        <Route
          path="create-campaign"
          element={
            <Suspense fallback="Loading ...">
              <LazyCampaignCreate />
            </Suspense>
          }
        />
        <Route
          path="edit-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <LazyCampaignCreate />
            </Suspense>
          }
        />
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <LazyCampaignView />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/proposals"
        element={
          <Suspense fallback="Loading ...">
            <LazyProposals />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback="Loading ...">
              <LazyProposalsHome />
            </Suspense>
          }
        />
        <Route
          path="create-proposals"
          element={
            <Suspense fallback="Loading ...">
              <LazyCreateProposals />
            </Suspense>
          }
        />
        <Route
          path="edit-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <LazyCreateProposals />
            </Suspense>
          }
        />
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <LazyViewProposal />
            </Suspense>
          }
        />
      </Route>
      <Route path="/landlords" element={<Landlords />} />
      <Route path="/users" element={<Users />} />
      <Route path="/bookings" element={<Bookings />} />
    </Routes>
  </Router>
);

export default App;
