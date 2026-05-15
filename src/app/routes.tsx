import { createBrowserRouter } from 'react-router';
import { AuthPage } from './components/AuthPage';
import { LawyerLayout } from './components/lawyer/LawyerLayout';
import { LawyerDashboard } from './components/lawyer/LawyerDashboard';
import { LawyerUpload } from './components/lawyer/LawyerUpload';
import { LawyerDocumentReview } from './components/lawyer/LawyerDocumentReview';
import { ClientLayout } from './components/client/ClientLayout';
import { ClientDashboard } from './components/client/ClientDashboard';
import { ClientDocumentView } from './components/client/ClientDocumentView';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AuthPage,
  },
  {
    path: '/advogado',
    Component: LawyerLayout,
    children: [
      { index: true, Component: LawyerDashboard },
      { path: 'upload', Component: LawyerUpload },
      { path: 'documento/:id', Component: LawyerDocumentReview },
    ],
  },
  {
    path: '/cliente',
    Component: ClientLayout,
    children: [
      { index: true, Component: ClientDashboard },
      { path: 'documento/:id', Component: ClientDocumentView },
    ],
  },
]);
