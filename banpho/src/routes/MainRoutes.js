import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
// import Report from '../views/pages/product';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

const Product = Loadable(lazy(() => import('views/pages/product/Product')));
const ProductForm = Loadable(lazy(() => import('views/pages/product/ProductFrom')));

const Tracking = Loadable(lazy(() => import('views/pages/tracking/Tracking')));
const TrackingForm = Loadable(lazy(() => import('views/pages/tracking/TrackingForm')));

const Users = Loadable(lazy(() => import('views/pages/users/Users')));
const AddUser = Loadable(lazy(() => import('views/pages/users/AddUser')));
const EditUser = Loadable(lazy(() => import('views/pages/users/EditUser')));

const Documents = Loadable(lazy(() => import('views/pages/documents/Documents')));

const DocumentsWaiting = Loadable(lazy(() => import('views/pages/documents/DocumentsWaiting')));
const DocumentsApprove = Loadable(lazy(() => import('views/pages/documents/DocumentsApprove')));
const DocumentsDisapprove = Loadable(lazy(() => import('views/pages/documents/DocumentsDisapprove')));

const WaitingCheck = Loadable(lazy(() => import('views/pages/sterilization/WaitingCheck')));
const WaitingSterilization = Loadable(lazy(() => import('views/pages/sterilization/WaitingSterilization')));
const SterilizationFinish = Loadable(lazy(() => import('views/pages/sterilization/SterilizationFinish.js')));

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/home',
            element: <DashboardDefault />
        },
        {
            path: '/tracking',
            element: <Tracking />
        },
        {
            path: '/tracking-form',
            element: <TrackingForm />
        },
        {
            path: '/user-add',
            element: <AddUser />
        },
        {
            path: '/user-edit',
            element: <EditUser />
        },
        {
            path: '/documents',
            element: <Documents />
        },
        {
            path: '/report-documents',
            element: <DocumentsWaiting />
        },
        {
            path: '/report-documents-approve',
            element: <DocumentsApprove />
        },
        {
            path: '/report-documents-disapproved',
            element: <DocumentsDisapprove />
        },
        {
            path: '/waiting-for-check',
            element: <WaitingCheck />
        },
        {
            path: '/waiting-for-sterilization',
            element: <WaitingSterilization />
        },
        {
            path: '/sterilization-completed',
            element: <SterilizationFinish />
        }
    ]
};

export default MainRoutes;
