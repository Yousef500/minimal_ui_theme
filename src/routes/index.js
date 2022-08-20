// import { Suspense, lazy } from 'react';
// import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// // layouts
// import MainLayout from '../layouts/main';
// import DashboardLayout from '../layouts/dashboard';
// import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// // guards
// import GuestGuard from '../guards/GuestGuard';
// import AuthGuard from '../guards/AuthGuard';
// // import RoleBasedGuard from '../guards/RoleBasedGuard';
// // config
// import { PATH_AFTER_LOGIN } from '../config';
// // components
// import LoadingScreen from '../components/LoadingScreen';

import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';

const ProtectedRoute = lazy(() => import('src/components/khadamat/general/ProtectedRoute'));
const Login = lazy(() => import('src/pages/auth/Login'));
const SignOut = lazy(() => import('src/components/khadamat/general/SignOut'));
const DashboardLayout = lazy(() => import('src/layouts/dashboard'));
const DeadDashboard = lazy(() => import('src/pages/ekram/DeadDashboard'));
const SecurityGuardsDashboard = lazy(() => import('src/pages/securityGuards/SecurityGuardsDashboard'));
const UsersDashboard = lazy(() => import('src/pages/users/UsersDashboard'));
const AddCemetery = lazy(() => import('../pages/ekram/AddCemetery'));
const AddDead = lazy(() => import('../pages/ekram/AddDead'));
const CemeteriesManagement = lazy(() => import('../pages/ekram/CemeteriesManagement'));
const CemeteryDetails = lazy(() => import('../pages/ekram/CemeteryDetails'));
const DeadDetails = lazy(() => import('../pages/ekram/DeadDetails'));
const DeadManagement = lazy(() => import('../pages/ekram/DeadManagement'));
const EditCemetery = lazy(() => import('../pages/ekram/EditCemetery'));
const EditDead = lazy(() => import('../pages/ekram/EditDead'));
const AddLocation = lazy(() => import('../pages/securityGuards/AddLocation'));
const AddLocationShift = lazy(() => import('../pages/securityGuards/AddLocationShift'));
const EditLocation = lazy(() => import('../pages/securityGuards/EditLocation'));
const LocationDetails = lazy(() => import('../pages/securityGuards/LocationDetails'));
const LocationsManagement = lazy(() => import('../pages/securityGuards/LocationsManagement'));
const ShiftsManagement = lazy(() => import('../pages/securityGuards/ShiftsManagement'));
const AddNationality = lazy(() => import('../pages/users/AddNationality'));
const CreateUser = lazy(() => import('../pages/users/CreateUser'));
const EditNationality = lazy(() => import('../pages/users/EditNationality'));
const EditUser = lazy(() => import('../pages/users/EditUser'));
const Nationalities = lazy(() => import('../pages/users/Nationalities'));
const UserDetails = lazy(() => import('../pages/users/UserDetails'));
const UsersManagement = lazy(() => import('../pages/users/UsersManagement'));
const UsersPermissions = lazy(() => import('../pages/users/UsersPermissions'));
const ShiftTimesManagement = lazy(() => import('../pages/securityGuards/ShiftTimesManagement'));
const AddShiftTime = lazy(() => import('src/pages/securityGuards/AddShiftTime'));
const Dashboard = lazy(() => import('src/pages/khadmat/Dashboard'));
// ----------------------------------------------------------------------

// const Loadable = (Component) => (props) => {
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const { pathname } = useLocation();

//   return (
//     <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
//       <Component {...props} />
//     </Suspense>
//   );
// };

export default function Router() {
    const { userInfo } = useSelector((state) => state.currentUser);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute allowed={!!userInfo?.Token} />}>
                <Route path="/" element={<DashboardLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="dead" element={<DeadDashboard />} />
                    <Route path="dead/management" element={<DeadManagement />} />
                    <Route path="dead/cemeteries" element={<CemeteriesManagement />} />
                    <Route path="dead/cemeteries/:id" element={<CemeteryDetails />} />
                    <Route path="dead/cemeteries/edit/:id" element={<EditCemetery />} />
                    <Route path="dead/cemeteries/add" element={<AddCemetery />} />

                    <Route path="dead/:id" element={<DeadDetails />} />
                    <Route path="dead/edit/:id" element={<EditDead />} />
                    <Route path="dead/add" element={<AddDead />} />
                    <Route path="users" element={<UsersDashboard />} />
                    <Route path="users/management" element={<UsersManagement />} />
                    <Route path="users/:id" element={<UserDetails />} />
                    <Route path="users/permissions" element={<UsersPermissions />} />
                    <Route path="users/nationalities" element={<Nationalities />} />
                    <Route path="users/nationalities/add" element={<AddNationality />} />
                    <Route path="users/nationalities/edit/:id" element={<EditNationality />} />
                    <Route path="users/create" element={<CreateUser />} />
                    <Route path="users/edit/:id" element={<EditUser />} />
                    <Route path="securityGuards" element={<SecurityGuardsDashboard />} />
                    <Route path="securityGuards/locations" element={<LocationsManagement />} />
                    <Route path="securityGuards/locations/add" element={<AddLocation />} />
                    <Route path="securityGuards/locations/:id" element={<LocationDetails />} />
                    <Route path="securityGuards/locations/edit/:id" element={<EditLocation />} />
                    <Route path="securityGuards/shifts" element={<ShiftsManagement />} />
                    <Route path="securityGuards/shifts/add" element={<AddLocationShift />} />
                    <Route path="securityGuards/shiftTimes" element={<ShiftTimesManagement />} />
                    <Route path="securityGuards/shiftTimes/add" element={<AddShiftTime />} />
                    <Route path="users/logout" element={<SignOut />} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
            </Route>
            <Route path="/sign-in" element={<Login />} />
        </Routes>
    );
    // useRoutes([
    //   {
    //     path: 'auth',
    //     children: [
    //       {
    //         path: 'login',
    //         element: (
    //           <GuestGuard>
    //             <Login />
    //           </GuestGuard>
    //         ),
    //       },
    //       {
    //         path: 'register',
    //         element: (
    //           <GuestGuard>
    //             <Register />
    //           </GuestGuard>
    //         ),
    //       },
    //       { path: 'login-unprotected', element: <Login /> },
    //       { path: 'register-unprotected', element: <Register /> },
    //       { path: 'reset-password', element: <ResetPassword /> },
    //       { path: 'new-password', element: <NewPassword /> },
    //       { path: 'verify', element: <VerifyCode /> },
    //     ],
    //   },

    //   // Dashboard Routes
    //   {
    //     path: 'dashboard',
    //     element: (
    //       <AuthGuard>
    //         <DashboardLayout />
    //       </AuthGuard>
    //     ),
    //     children: [
    //       { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
    //       { path: 'app', element: <GeneralApp /> },
    //       { path: 'ecommerce', element: <GeneralEcommerce /> },
    //       { path: 'analytics', element: <GeneralAnalytics /> },
    //       { path: 'banking', element: <GeneralBanking /> },
    //       { path: 'booking', element: <GeneralBooking /> },

    //       {
    //         path: 'e-commerce',
    //         children: [
    //           { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
    //           { path: 'shop', element: <EcommerceShop /> },
    //           { path: 'product/:name', element: <EcommerceProductDetails /> },
    //           { path: 'list', element: <EcommerceProductList /> },
    //           { path: 'product/new', element: <EcommerceProductCreate /> },
    //           { path: 'product/:name/edit', element: <EcommerceProductEdit /> },
    //           { path: 'checkout', element: <EcommerceCheckout /> },
    //         ],
    //       },
    //       {
    //         path: 'user',
    //         children: [
    //           { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
    //           { path: 'profile', element: <UserProfile /> },
    //           { path: 'cards', element: <UserCards /> },
    //           { path: 'list', element: <UserList /> },
    //           { path: 'new', element: <UserCreate /> },
    //           { path: ':name/edit', element: <UserCreate /> },
    //           { path: 'account', element: <UserAccount /> },
    //         ],
    //       },
    //       {
    //         path: 'invoice',
    //         children: [
    //           { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
    //           { path: 'list', element: <InvoiceList /> },
    //           { path: ':id', element: <InvoiceDetails /> },
    //           { path: ':id/edit', element: <InvoiceEdit /> },
    //           { path: 'new', element: <InvoiceCreate /> },
    //         ],
    //       },
    //       {
    //         path: 'blog',
    //         children: [
    //           { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
    //           { path: 'posts', element: <BlogPosts /> },
    //           { path: 'post/:title', element: <BlogPost /> },
    //           { path: 'new', element: <BlogNewPost /> },
    //         ],
    //       },
    //       {
    //         path: 'mail',
    //         children: [
    //           { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
    //           { path: 'label/:customLabel', element: <Mail /> },
    //           { path: 'label/:customLabel/:mailId', element: <Mail /> },
    //           { path: ':systemLabel', element: <Mail /> },
    //           { path: ':systemLabel/:mailId', element: <Mail /> },
    //         ],
    //       },
    //       {
    //         path: 'chat',
    //         children: [
    //           { element: <Chat />, index: true },
    //           { path: 'new', element: <Chat /> },
    //           { path: ':conversationKey', element: <Chat /> },
    //         ],
    //       },
    //       { path: 'calendar', element: <Calendar /> },
    //       { path: 'kanban', element: <Kanban /> },
    //       { path: 'permission-denied', element: <PermissionDenied /> },
    //     ],
    //   },

    //   // Main Routes
    //   {
    //     path: '*',
    //     element: <LogoOnlyLayout />,
    //     children: [
    //       { path: 'coming-soon', element: <ComingSoon /> },
    //       { path: 'maintenance', element: <Maintenance /> },
    //       { path: 'pricing', element: <Pricing /> },
    //       { path: 'payment', element: <Payment /> },
    //       { path: '500', element: <Page500 /> },
    //       { path: '404', element: <Page404 /> },
    //       { path: '403', element: <Page403 /> },
    //       { path: '*', element: <Navigate to="/404" replace /> },
    //     ],
    //   },
    //   {
    //     path: '/',
    //     element: <MainLayout />,
    //     children: [
    //       { element: <HomePage />, index: true },
    //       { path: 'about-us', element: <About /> },
    //       { path: 'contact-us', element: <Contact /> },
    //       { path: 'faqs', element: <Faqs /> },
    //     ],
    //   },
    //   { path: '*', element: <Navigate to="/404" replace /> },
    // ]);
}

// // AUTHENTICATION
// const Login = Loadable(lazy(() => import('../pages/auth/Login')));
// const Register = Loadable(lazy(() => import('../pages/auth/Register')));
// const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
// const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));
// const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// // DASHBOARD

// // GENERAL
// const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
// const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
// const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
// const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
// const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));

// // ECOMMERCE
// const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
// const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
// const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
// const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductCreate')));
// const EcommerceProductEdit = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductEdit')));
// const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));

// // INVOICE
// const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/InvoiceList')));
// const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/InvoiceDetails')));
// const InvoiceCreate = Loadable(lazy(() => import('../pages/dashboard/InvoiceCreate')));
// const InvoiceEdit = Loadable(lazy(() => import('../pages/dashboard/InvoiceEdit')));

// // BLOG
// const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
// const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
// const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));

// // USER
// const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
// const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
// const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
// const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
// const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

// // APP
// const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
// const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
// const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
// const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')));

// // TEST RENDER PAGE BY ROLE
// const PermissionDenied = Loadable(lazy(() => import('../pages/dashboard/PermissionDenied')));

// // MAIN
// const HomePage = Loadable(lazy(() => import('../pages/Home')));
// const About = Loadable(lazy(() => import('../pages/About')));
// const Contact = Loadable(lazy(() => import('../pages/Contact')));
// const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
// const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
// const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
// const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
// const Payment = Loadable(lazy(() => import('../pages/Payment')));
// const Page500 = Loadable(lazy(() => import('../pages/Page500')));
// const Page403 = Loadable(lazy(() => import('../pages/Page403')));
// const Page404 = Loadable(lazy(() => import('../pages/Page404')));
