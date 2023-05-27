import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import shallow from 'zustand/shallow';
import { v4 as uuidv4 } from 'uuid';
import Header from './Loader/Header';
import CustomLoader from './Loader/Loader';
import Sidebar from './Loader/Sidebar';
import NoMatchFoundPage from './pages/NoMatchFoundPage';
import ProtectedRoutes from './utils/ProtectedRoutes';
import ProtectedRoute from './utils/ProtectedRoute';
import { ROLES } from './utils';
import FileUpload from './components/Finance/Create/FileUpload';
import useUserStore from './store/user.store';
import { useFetchUsersById } from './hooks/users.hooks';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const InventoryDashboardPage = lazy(() => import('./pages/InventoryPage/InventoryDashboardPage'));
const CreateInventoryPage = lazy(() => import('./pages/InventoryPage/CreateInventoryPage'));
const CreateBulkInventoriesPage = lazy(() =>
  import('./pages/InventoryPage/CreateBulkInventoriesPage'),
);
const InventoryDetailsPage = lazy(() => import('./pages/InventoryPage/InventoryDetailsPage'));

const BookingHome = lazy(() => import('./pages/Booking/Home'));
const Booking = lazy(() => import('./pages/Booking/Bookings'));
const ViewBooking = lazy(() => import('./pages/Booking/View'));
const CreateOrder = lazy(() => import('./pages/Booking/Create'));

const ProposalPage = lazy(() => import('./pages/ProposalPage'));
const ProposalDashboardPage = lazy(() => import('./pages/ProposalPage/ProposalDashboardPage'));
const CreateProposalPage = lazy(() => import('./pages/ProposalPage/CreateProposalPage'));
const ProposalDetailsPage = lazy(() => import('./pages/ProposalPage/ProposalDetailsPage'));

const UserHome = lazy(() => import('./pages/User/Home'));
const User = lazy(() => import('./pages/User/Users'));
const CreateUser = lazy(() => import('./pages/User/Create'));
const ViewUser = lazy(() => import('./pages/User/View'));

const MasterHome = lazy(() => import('./pages/Master/Master'));

const CampaignHome = lazy(() => import('./pages/Campaign/Home'));
const Campaigns = lazy(() => import('./pages/Campaign/Campaigns'));
const CampaignCreate = lazy(() => import('./pages/Campaign/Create'));
const CampaignView = lazy(() => import('./pages/Campaign/View'));

const ReportsPage = lazy(() => import('./pages/ReportPage'));
const InventoryReportsPage = lazy(() => import('./pages/ReportPage/InventoryReportsPage'));
const RevenueReportsPage = lazy(() => import('./pages/ReportPage/RevenueReportsPage'));
const CampaignReportsPage = lazy(() => import('./pages/ReportPage/CampaignReportsPage'));

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

const components = {
  PUBLIC: [
    { comp: lazy(() => import('./pages/AuthPage/LoginPage')), path: '/login' },
    { comp: lazy(() => import('./pages/AuthPage/ForgotPasswordPage')), path: '/forgot-password' },
    { comp: lazy(() => import('./pages/AuthPage/ChangePasswordPage')), path: '/change-password' },
    {
      comp: lazy(() => import('./pages/AuthPage/TermsAndConditionsPage')),
      path: '/terms-conditions',
    },
  ],
};

const App = () => {
  const location = useLocation();
  const { token, hasAcceptedTerms, userId } = useUserStore(
    state => ({
      token: state.token,
      hasAcceptedTerms: state.hasAcceptedTerms,
      userId: state.id,
    }),
    shallow,
  );

  const { _ } = useFetchUsersById(userId, !!hasAcceptedTerms);

  if (
    token &&
    hasAcceptedTerms &&
    (location.pathname.includes('/login') ||
      location.pathname.includes('/forgot-password') ||
      location.pathname.includes('/change-password') ||
      location.pathname.includes('/terms-conditions'))
  ) {
    if (location.search.includes('setting')) {
      return <Navigate to="/settings?type=change_password" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      {components.PUBLIC.map(({ comp: Comp, path }) => (
        <Route
          key={uuidv4()}
          path={path}
          element={
            <Suspense fallback={<CustomLoader />}>
              <Comp />
            </Suspense>
          }
        />
      ))}
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
              <InventoryPage />
            </Suspense>
          }
        >
          <Route path="" element={<InventoryDashboardPage />} />
          <Route
            path="create-space/single"
            element={
              <Suspense fallback={<CustomLoader />}>
                <CreateInventoryPage />
              </Suspense>
            }
          />
          <Route
            path="create-space/bulk"
            element={
              <Suspense fallback={<CustomLoader />}>
                <CreateBulkInventoriesPage />
              </Suspense>
            }
          />
          <Route
            path="edit-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <CreateInventoryPage />
              </Suspense>
            }
          />
          <Route
            path="view-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <InventoryDetailsPage />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute accepted={[ROLES.ADMIN]}>
              <Suspense fallback={<HeaderSidebarLoader />}>
                <Campaigns />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<CustomLoader />}>
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
              <ProposalPage />
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<CustomLoader />}>
                <ProposalDashboardPage />
              </Suspense>
            }
          />
          <Route path="create-proposals" element={<CreateProposalPage />} />
          <Route
            path="edit-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <CreateProposalPage />
              </Suspense>
            }
          />
          <Route
            path="view-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <ProposalDetailsPage />
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
              <Suspense fallback={<CustomLoader />}>
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
            <ProtectedRoute accepted={[ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERVISOR]}>
              <Suspense fallback={<HeaderSidebarLoader />}>
                <User />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<CustomLoader />}>
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
            <ProtectedRoute accepted={[ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERVISOR]}>
              <Suspense fallback={<HeaderSidebarLoader />}>
                <ReportsPage />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route
            path="inventories"
            element={
              <Suspense fallback={<CustomLoader />}>
                <InventoryReportsPage />
              </Suspense>
            }
          />
          <Route
            path="revenue"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RevenueReportsPage />
              </Suspense>
            }
          />
          <Route
            path="campaign"
            element={
              <Suspense fallback={<CustomLoader />}>
                <CampaignReportsPage />
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
              <NotificationsPage />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<HeaderSidebarLoader />}>
              <SettingsPage />
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
          path="/"
          element={
            <ProtectedRoute accepted={[ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERVISOR]}>
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
            path="/finance/:year/:month"
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
      <Route path="*" element={<NoMatchFoundPage />} />
    </Routes>
  );
};

export default App;
