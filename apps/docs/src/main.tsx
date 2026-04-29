import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './lib/router.js';
import { MdxProvider } from './components/mdx-components.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MdxProvider>
      <RouterProvider router={router} />
    </MdxProvider>
  </StrictMode>,
);
