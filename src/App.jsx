import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import LoginMain from './pages/Login/Home';
import ChangePassword from './pages/Login/ChangePassword';
import ForgotPassword from './pages/Login/ForgotPassword';
import Landlords from './pages/Landlords';
import Header from './Loader/Header';
import Loader from './Loader';
import CustomLoader from './Loader/Loader';
import Sidebar from './Loader/Sidebar';
import RequireAuth from './components/Auth';
import NoMatch from './pages/NoMatch';
import { useFetchUsersById } from './hooks/users.hooks';
import useUserStore from './store/user.store';

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
const FinanceCreateOrderUpload = lazy(() => import('./pages/Finance/CreateAuto'));

const App = () => {
  const id = useUserStore(state => state.id);
  useFetchUsersById(id, !!id);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/" element={<Login />}>
          <Route path="login" element={<LoginMain />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route
          path="/home"
          element={
            <Suspense
              fallback={
                <>
                  <Header />
                  <Sidebar />
                </>
              }
            >
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            </Suspense>
          }
        />
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
              <RequireAuth>
                <Inventory />
              </RequireAuth>
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<Loader />}>
                <RequireAuth>
                  <InventoryHome />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="create-space/single"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <CreateSpaceSingle />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="create-space/bulk"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <CreateSpaceBulk />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="edit-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <CreateSpaceSingle />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="view-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <SpaceDetails />
                </RequireAuth>
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
              <RequireAuth>
                <Campaigns />
              </RequireAuth>
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<Loader />}>
                <RequireAuth>
                  <CampaignHome />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="create-campaign"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <CampaignCreate />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="edit-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <CampaignCreate />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="view-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <CampaignView />
                </RequireAuth>
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
              <RequireAuth>
                <Proposals />
              </RequireAuth>
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<Loader />}>
                <RequireAuth>
                  <ProposalsHome />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="create-proposals"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <CreateProposals />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="edit-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <CreateProposals />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="view-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <ViewProposal />
                </RequireAuth>
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
              <RequireAuth>
                <Booking />
              </RequireAuth>
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<Loader />}>
                <RequireAuth>
                  <BookingHome />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="view-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <ViewBooking />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="generate-purchase-order/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <Generate />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="generate-release-order/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <Generate />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="generate-invoice/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <Generate />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="create-order"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <CreateOrder />
                </RequireAuth>
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
              <RequireAuth>
                <User />
              </RequireAuth>
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<Loader />}>
                <RequireAuth>
                  <UserHome />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="create-user"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <CreateUser />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="edit-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <CreateUser />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="view-details/:id"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <ViewUser />
                </RequireAuth>
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
              <RequireAuth>
                <ReportHome />
              </RequireAuth>
            </Suspense>
          }
        >
          <Route
            path="inventory"
            element={
              <Suspense fallback={<Loader />}>
                <RequireAuth>
                  <ReportInventory />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="revenue"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <ReportRevenue />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="campaign"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <ReportCampaign />
                </RequireAuth>
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
              <RequireAuth>
                <MasterHome />
              </RequireAuth>
            </Suspense>
          }
        />

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
              <RequireAuth>
                <Notifications />
              </RequireAuth>
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
              <RequireAuth>
                <Settings />
              </RequireAuth>
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <>
                  <Header />
                  <Sidebar />
                </>
              }
            >
              <RequireAuth>
                <Profile />
              </RequireAuth>
            </Suspense>
          }
        >
          <Route
            path="profile"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <ProfileHome />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="edit-profile"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <ProfileEdit />
                </RequireAuth>
              </Suspense>
            }
          />
        </Route>
        <Route path="/landlords" element={<Landlords />} />
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <>
                  <Header />
                  <Sidebar />
                </>
              }
            >
              <RequireAuth>
                <Finance />
              </RequireAuth>
            </Suspense>
          }
        >
          <Route
            path="/finance"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <FinanceHome />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="/finance/:year"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <FinanceMonthly />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="/finance/:year/details"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <FinanceMonthlyDetails />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="/finance/create-order/:type"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <FinanceCreateOrder />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="/finance/create-order/:type/upload"
            element={
              <Suspense fallback={<CustomLoader />}>
                <RequireAuth>
                  <FinanceCreateOrderUpload />
                </RequireAuth>
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
};

export default App;
