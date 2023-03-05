import MainLayout from 'layout/MainLayout';
import DashboardDefault from 'views/dashboard/Default';
import Product from 'views/pages/product/Product';
import ProductForm from 'views/pages/product/ProductFrom';
import Tracking from 'views/pages/tracking/Tracking';
import TrackingForm from 'views/pages/tracking/TrackingForm';
import Users from 'views/pages/users/Users';
import AddUser from 'views/pages/users/AddUser';
import EditUser from 'views/pages/users/EditUser';
import Documents from 'views/pages/documents/Documents';
import DocumentsDashboard from 'views/pages/documents/DocumentsDashboard';
import DocumentsWaiting from 'views/pages/documents/DocumentsWaiting';
import DocumentsApprove from 'views/pages/documents/DocumentsApprove';
import DocumentsDisapprove from 'views/pages/documents/DocumentsDisapprove';

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
            path: '/dashboard-documents',
            element: <DocumentsDashboard />
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
        }
    ]
};

export default MainRoutes;
