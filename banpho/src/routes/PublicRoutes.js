import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const Qrcode = Loadable(lazy(() => import('views/pages/public-link/TrackingQrcode')));
const TrackingForm = Loadable(lazy(() => import('views/pages/public-link/TrackingForm')));
const SuccessForm = Loadable(lazy(() => import('views/pages/public-link/SuccessUpdate')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const PublicRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/tracking-link',
            element: <TrackingForm />
        },
        {
            path: '/tracking-qrcode',
            element: <Qrcode />
        },
        {
            path: '/success',
            element: <SuccessForm />
        }
    ]
};

export default PublicRoutes;
