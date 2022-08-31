import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Landlords from './pages/Landlords';
import Header from './Loader/Header';
import Loader from './Loader';
import CustomLoader from './Loader/Loader';
import Sidebar from './Loader/Sidebar';

const InventoryHome = lazy(() => import('./pages/Inventory/Home'));
const Inventory = lazy(() => import('./pages/Inventory/Inventory'));
const CreateSpaceSingle = lazy(() => import('./pages/Inventory/Create'));
const CreateSpaceBulk = lazy(() => import('./pages/Inventory/CreateBulk'));
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

const ReportHome = lazy(() => import('./pages/Report/Report'));
const ReportInventory = lazy(() => import('./pages/Report/Inventory'));
const ReportRevenue = lazy(() => import('./pages/Report/Revenue'));
const ReportCampaign = lazy(() => import('./pages/Report/Campaign'));

const MasterHome = lazy(() => import('./pages/Master/Master'));
const MasterBrand = lazy(() => import('./pages/Master/Brands'));
const MasterCategory = lazy(() => import('./pages/Master/Category'));

const Notifications = lazy(() => import('./pages/Notification'));
const Settings = lazy(() => import('./pages/Setting/Home'));

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/inventory"
        element={
          <Suspense
            fallback={
              <>
                <Header />
                <Sidebar />
              </>
            }
          >
            <Inventory />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback={<Loader />}>
              <InventoryHome />
            </Suspense>
          }
        />
        <Route
          path="create-space/single"
          element={
            <Suspense fallback={<CustomLoader />}>
              <CreateSpaceSingle />
            </Suspense>
          }
        />
        <Route
          path="create-space/bulk"
          element={
            <Suspense fallback={<CustomLoader />}>
              <CreateSpaceBulk />
            </Suspense>
          }
        />
        <Route
          path="edit-details/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <CreateSpaceSingle />
            </Suspense>
          }
        />
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <SpaceDetails />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/campaigns"
        element={
          <Suspense
            fallback={
              <>
                <Header />
                <Sidebar />
              </>
            }
          >
            <Campaigns />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback={<Loader />}>
              <CampaignHome />
            </Suspense>
          }
        />
        <Route
          path="create-campaign"
          element={
            <Suspense fallback={<CustomLoader />}>
              <CampaignCreate />
            </Suspense>
          }
        />
        <Route
          path="edit-details/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <CampaignCreate />
            </Suspense>
          }
        />
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <CampaignView />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/proposals"
        element={
          <Suspense
            fallback={
              <>
                <Header />
                <Sidebar />
              </>
            }
          >
            <Proposals />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback={<Loader />}>
              <ProposalsHome />
            </Suspense>
          }
        />
        <Route
          path="create-proposals"
          element={
            <Suspense fallback={<CustomLoader />}>
              <CreateProposals />
            </Suspense>
          }
        />
        <Route
          path="edit-details/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <CreateProposals />
            </Suspense>
          }
        />
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <ViewProposal />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/bookings"
        element={
          <Suspense
            fallback={
              <>
                <Header />
                <Sidebar />
              </>
            }
          >
            <Booking />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback={<Loader />}>
              <BookingHome />
            </Suspense>
          }
        />
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <ViewBooking />
            </Suspense>
          }
        />
        <Route
          path="generate-purchase-order/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <Generate />
            </Suspense>
          }
        />
        <Route
          path="generate-release-order/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <Generate />
            </Suspense>
          }
        />
        <Route
          path="generate-invoice/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <Generate />
            </Suspense>
          }
        />
        <Route
          path="create-order"
          element={
            <Suspense fallback={<CustomLoader />}>
              <CreateOrder />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="users"
        element={
          <Suspense
            fallback={
              <>
                <Header />
                <Sidebar />
              </>
            }
          >
            <User />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback={<Loader />}>
              <UserHome />
            </Suspense>
          }
        />
        <Route
          path="create-user"
          element={
            <Suspense fallback={<CustomLoader />}>
              <CreateUser />
            </Suspense>
          }
        />
        <Route
          path="edit-details/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <CreateUser />
            </Suspense>
          }
        />
        <Route
          path="view-details/:id"
          element={
            <Suspense fallback={<CustomLoader />}>
              <ViewUser />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/reports"
        element={
          <Suspense
            fallback={
              <>
                <Header />
                <Sidebar />
              </>
            }
          >
            <ReportHome />
          </Suspense>
        }
      >
        <Route
          path="inventory"
          element={
            <Suspense fallback={<Loader />}>
              <ReportInventory />
            </Suspense>
          }
        />
        <Route
          path="revenue"
          element={
            <Suspense fallback={<CustomLoader />}>
              <ReportRevenue />
            </Suspense>
          }
        />
        <Route
          path="campaign"
          element={
            <Suspense fallback={<CustomLoader />}>
              <ReportCampaign />
            </Suspense>
          }
        />
      </Route>

      <Route
        path="/masters"
        element={
          <Suspense
            fallback={
              <>
                <Header />
                <Sidebar />
              </>
            }
          >
            <MasterHome />
          </Suspense>
        }
      >
        <Route
          path="category"
          element={
            <Suspense fallback={<Loader />}>
              <MasterCategory />
            </Suspense>
          }
        />
        <Route
          path="brand"
          element={
            <Suspense fallback={<CustomLoader />}>
              <MasterBrand />
            </Suspense>
          }
        />
      </Route>

      <Route
        path="/notification"
        element={
          <Suspense
            fallback={
              <>
                <Header />
                <Sidebar />
              </>
            }
          >
            <Notifications />
          </Suspense>
        }
      />

      <Route
        path="/setting"
        element={
          <Suspense
            fallback={
              <>
                <Header />
                <Sidebar />
              </>
            }
          >
            <Settings />
          </Suspense>
        }
      />

      <Route path="/landlords" element={<Landlords />} />
    </Routes>
  </Router>
);

export default App;
