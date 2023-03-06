import MainLayout from 'layout/MainLayout';
import DashboardDefault from 'views/dashboard/Default';
import DashboardTracking from 'views/dashboard/Default/DashboardTracking';
import DashboardDocument from 'views/dashboard/Default/DashboardDocument';
import Product from 'views/pages/product/Product';
import ProductForm from 'views/pages/product/ProductFrom';
import Tracking from 'views/pages/tracking/Tracking';
import TrackingForm from 'views/pages/tracking/TrackingForm';
import AddUser from 'views/pages/admin/AddUser';
import EditUser from 'views/pages/admin/EditUser';
import Documents from 'views/pages/documents/Documents';
import DocumentsDashboard from 'views/pages/documents/DocumentsDashboard';
import DocumentsWaiting from 'views/pages/documents/DocumentsWaiting';
import DocumentsApprove from 'views/pages/documents/DocumentsApprove';
import DocumentsDisapprove from 'views/pages/documents/DocumentsDisapprove';

// Admin
import Users from 'views/pages/admin/Users';
import Hospital from 'views/pages/admin/Hospital';

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/home',
            element: <DashboardDefault />
        },
        {
            path: '/dashboard-tracking',
            element: <DashboardTracking />
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
            path: '/dashboard-documents',
            element: <DashboardDefault />
        },
        {
            path: '/documents',
            element: <Documents />
        },
        {
            path: '/dashboard-document',
            element: <DashboardDocument />
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
            path: '/admin-users',
            element: <Users />
        },
        {
            path: '/admin-hospital',
            element: <Hospital />
        }
    ]
};

export default MainRoutes;
