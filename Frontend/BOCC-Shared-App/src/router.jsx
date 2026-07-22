import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import RoleSelection from '@/pages/auth/RoleSelection';
import Dashboard from '@/pages/Dashboard';
import BuildStartupJourney from '@/pages/BuildStartupJourney';
import Notifications from '@/pages/Notifications';
import Incubator from '@/pages/incubator/Incubator';
import Applications from '@/pages/incubator/Applications';
import ApplicationReview from '@/pages/incubator/ApplicationReview';
import Messages from '@/pages/incubator/Messages';
import Settings from '@/pages/incubator/Settings';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/role-selection', element: <RoleSelection /> },
    ],
  },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/build-startup/journey', element: <BuildStartupJourney /> },
  { path: '/notifications', element: <Notifications /> },
  { path: '/incubator', element: <Incubator /> },
  { path: '/incubator/applications', element: <Applications /> },
  { path: '/incubator/applications/review', element: <ApplicationReview /> },
  { path: '/incubator/messages', element: <Messages /> },
  { path: '/incubator/settings', element: <Settings /> },
  { path: '/legal/privacy-policy', element: <PrivacyPolicy /> },
]);
