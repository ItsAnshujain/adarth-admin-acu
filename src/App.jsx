import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Landlords from './pages/Landlords';
import Users from './pages/Users';

const InventoryHome = lazy(() => import('./pages/Inventory/Home'));
const Inventory = lazy(() => import('./pages/Inventory/Inventory'));
const CreateSpace = lazy(() => import('./pages/Inventory/Create'));
const SpaceDetails = lazy(() => import('./pages/Inventory/View'));

const CampaignHome = lazy(() => import('./pages/Campaign/Home'));
const Campaigns = lazy(() => import('./pages/Campaign/Campaigns'));
const CampaignCreate = lazy(() => import('./pages/Campaign/Create'));
const CampaignView = lazy(() => import('./pages/Campaign/View'));

const ProposalsHome = lazy(() => import('./pages/Proposal/Home'));
const Proposals = lazy(() => import('./pages/Proposal/Proposals'));
const CreateProposals = lazy(() => import('./pages/Proposal/Create'));
const ViewProposal = lazy(() => import('./pages/Proposal/View'));

const BookingHome = lazy(() => import('./pages/Booking/Home'));
const Booking = lazy(() => import('./pages/Booking/Bookings'));

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/inventory"
        element={
          <Suspense fallback="Loading ...">
            <Inventory />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback="Loading ...">
              <InventoryHome />
            </Suspense>
          }
        />
        <Route
          path="create-space"
          element={
            <Suspense fallback="Loading ...">
              <CreateSpace />
            </Suspense>
          }
        />
        <Route
          path="edit-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <CreateSpace />
            </Suspense>
          }
        />
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <SpaceDetails />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/campaigns"
        element={
          <Suspense fallback="Loading ...">
            <Campaigns />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback="Loading ...">
              <CampaignHome />
            </Suspense>
          }
        />
        <Route
          path="create-campaign"
          element={
            <Suspense fallback="Loading ...">
              <CampaignCreate />
            </Suspense>
          }
        />
        <Route
          path="edit-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <CampaignCreate />
            </Suspense>
          }
        />
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <CampaignView />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/proposals"
        element={
          <Suspense fallback="Loading ...">
            <Proposals />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback="Loading ...">
              <ProposalsHome />
            </Suspense>
          }
        />
        <Route
          path="create-proposals"
          element={
            <Suspense fallback="Loading ...">
              <CreateProposals />
            </Suspense>
          }
        />
        <Route
          path="edit-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <CreateProposals />
            </Suspense>
          }
        />
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <ViewProposal />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/bookings"
        element={
          <Suspense fallback="Loading ...">
            <Booking />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback="Loading ...">
              <BookingHome />
            </Suspense>
          }
        />
      </Route>
      <Route path="/landlords" element={<Landlords />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  </Router>
);

export default App;
