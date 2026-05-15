import { RouterProvider } from 'react-router';
import { router } from './routes';
import { DocumentProvider } from './context/DocumentContext';

export default function App() {
  return (
    <DocumentProvider>
      <RouterProvider router={router} />
    </DocumentProvider>
  );
}
