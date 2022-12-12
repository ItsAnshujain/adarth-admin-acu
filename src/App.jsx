import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import shallow from 'zustand/shallow';
import Login from './pages/Login/Login';
import LoginMain from './pages/Login/Home';
import ChangePassword from './pages/Login/ChangePassword';
import ForgotPassword from './pages/Login/ForgotPassword';
import Landlords from './pages/Landlords';
import Header from './Loader/Header';
import Loader from './Loader';
import CustomLoader from './Loader/Loader';
import Sidebar from './Loader/Sidebar';
import NoMatch from './pages/NoMatch';
import { useFetchUsersById } from './hooks/users.hooks';
import useTokenIdStore from './store/user.store';
import ProtectedRoutes from './utils/ProtectedRoutes';
import ProtectedRoute from './utils/ProtectedRoute';
import { ROLES } from './utils';
import FileUpload from './components/Finance/Create/FileUpload';

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
// const MasterBrand = lazy(() => import('./pages/Master/Brands'));
// const MasterCategory = lazy(() => import('./pages/Master/Category'));

const HomePage = lazy(() => import('./pages/Home'));
const Notifications = lazy(() => import('./pages/Notification'));
const Settings = lazy(() => import('./pages/Setting/Home'));

const Profile = lazy(() => import('./pages/Profile/Profile'));
const ProfileHome = lazy(() => import('./pages/Profile/Home'));
const ProfileEdit = lazy(() => import('./pages/Profile/Edit'));

const Finance = lazy(() => import('./pages/Finance/Finance'));
const FinanceHome = lazy(() => import('./pages/Finance/Home'));
const FinanceMonthly = lazy(() => import('./pages/Finance/Monthly'));
const FinanceMonthlyDetails = lazy(() => import('./pages/Finance/MonthlyDetails'));
const FinanceCreateOrder = lazy(() => import('./pages/Finance/Create'));

const HeaderSidebarLoader = () => (
  <>
    <Header />
    <Sidebar />
  </>
);

const App = () => {
  const location = useLocation();
  const { token, id } = useTokenIdStore(state => ({ id: state.id, token: state.token }), shallow);

  useFetchUsersById(id, !!id);

  // to avoid logged in users to access the routes
  if (
    token &&
    (location.pathname.includes('/login') ||
      location.pathname.includes('/forgot-password') ||
      location.pathname.includes('/change-password'))
  ) {
    if (location.search.includes('setting')) {
      return <Navigate to="/setting?type=change_password" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/"
        element={
          <Suspense fallback={<CustomLoader />}>
            <Login />
          </Suspense>
        }
      >
        <Route path="/login" element={<LoginMain />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/home"
          element={
            <Suspense fallback={<HeaderSidebarLoader />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/inventory"
          element={
            <Suspense fallback={<HeaderSidebarLoader />}>
              <Inventory />
            </Suspense>
          }
        >
          <Route path="" element={<InventoryHome />} />
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
            <ProtectedRoute
              accepted={[ROLES.ADMIN, ROLES.MEDIA_OWNER, ROLES.MANAGER, ROLES.SUPERVISOR]}
            >
              <Suspense fallback={<HeaderSidebarLoader />}>
                <Campaigns />
              </Suspense>
            </ProtectedRoute>
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
            <Suspense fallback={<HeaderSidebarLoader />}>
              <Proposals />
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<CustomLoader />}>
                <ProposalsHome />
              </Suspense>
            }
          />
          <Route path="create-proposals" element={<CreateProposals />} />
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
            <Suspense fallback={<HeaderSidebarLoader />}>
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
            <ProtectedRoute
              accepted={[ROLES.ADMIN, ROLES.MEDIA_OWNER, ROLES.MANAGER, ROLES.SUPERVISOR]}
            >
              <Suspense fallback={<HeaderSidebarLoader />}>
                <User />
              </Suspense>
            </ProtectedRoute>
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
            <ProtectedRoute
              accepted={[ROLES.ADMIN, ROLES.MEDIA_OWNER, ROLES.MANAGER, ROLES.SUPERVISOR]}
            >
              <Suspense fallback={<HeaderSidebarLoader />}>
                <ReportHome />
              </Suspense>
            </ProtectedRoute>
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
            <ProtectedRoute accepted={ROLES.ADMIN}>
              <Suspense fallback={<HeaderSidebarLoader />}>
                <MasterHome />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <Suspense fallback={<HeaderSidebarLoader />}>
              <Notifications />
            </Suspense>
          }
        />
        <Route
          path="/setting"
          element={
            <Suspense fallback={<HeaderSidebarLoader />}>
              <Settings />
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <Suspense fallback={<HeaderSidebarLoader />}>
              <Profile />
            </Suspense>
          }
        >
          <Route
            path="profile"
            element={
              <Suspense fallback={<CustomLoader />}>
                <ProfileHome />
              </Suspense>
            }
          />
          <Route
            path="edit-profile"
            element={
              <Suspense fallback={<CustomLoader />}>
                <ProfileEdit />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/landlords"
          element={
            <ProtectedRoute
              accepted={[ROLES.ADMIN, ROLES.MEDIA_OWNER, ROLES.MANAGER, ROLES.SUPERVISOR]}
            >
              <Landlords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute
              accepted={[ROLES.ADMIN, ROLES.MEDIA_OWNER, ROLES.MANAGER, ROLES.SUPERVISOR]}
            >
              <Suspense fallback={<HeaderSidebarLoader />}>
                <Finance />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route
            path="/finance"
            element={
              <Suspense fallback={<CustomLoader />}>
                <FinanceHome />
              </Suspense>
            }
          />
          <Route
            path="/finance/:year"
            element={
              <Suspense fallback={<CustomLoader />}>
                <FinanceMonthly />
              </Suspense>
            }
          />
          <Route
            path="/finance/:year/details"
            element={
              <Suspense fallback={<CustomLoader />}>
                <FinanceMonthlyDetails />
              </Suspense>
            }
          />
          <Route
            path="/finance/create-order/:type"
            element={
              <Suspense fallback={<CustomLoader />}>
                <FinanceCreateOrder />
              </Suspense>
            }
          />
          <Route
            path="/finance/create-order/:type/upload"
            element={
              <Suspense fallback={<CustomLoader />}>
                <FileUpload />
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
};

export default App;
