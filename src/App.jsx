import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Landlords from './pages/Landlords';

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
const ViewBooking = lazy(() => import('./pages/Booking/View'));
const Generate = lazy(() => import('./pages/Booking/Generate'));
const CreateOrder = lazy(() => import('./pages/Booking/Create'));

const UserHome = lazy(() => import('./pages/User/Home'));
const User = lazy(() => import('./pages/User/Users'));
const CreateUser = lazy(() => import('./pages/User/Create'));
const ViewUser = lazy(() => import('./pages/User/View'));

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
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <ViewBooking />
            </Suspense>
          }
        />
        <Route
          path="generate-purchase-order/:id"
          element={
            <Suspense fallback="Loading ...">
              <Generate />
            </Suspense>
          }
        />
        <Route
          path="generate-release-order/:id"
          element={
            <Suspense fallback="Loading ...">
              <Generate />
            </Suspense>
          }
        />
        <Route
          path="generate-invoice/:id"
          element={
            <Suspense fallback="Loading ...">
              <Generate />
            </Suspense>
          }
        />
        <Route
          path="create-order"
          element={
            <Suspense fallback="Loading ...">
              <CreateOrder />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/"
        element={
          <Suspense fallback="Loading ...">
            <User />
          </Suspense>
        }
      >
        <Route
          path="users"
          element={
            <Suspense fallback="Loading ...">
              <UserHome />
            </Suspense>
          }
        />
        <Route
          path="users/create-user"
          element={
            <Suspense fallback="Loading ...">
              <CreateUser />
            </Suspense>
          }
        />
        <Route
          path="users/view-details/:id"
          element={
            <Suspense fallback="Loading ...">
              <ViewUser />
            </Suspense>
          }
        />
      </Route>
      <Route path="/landlords" element={<Landlords />} />
    </Routes>
  </Router>
);

export default App;
