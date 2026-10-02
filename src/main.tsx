import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupCardApiInterceptor } from './services/apiMock';

// Initialize the API interceptor for /api/v1/cards/issue
setupCardApiInterceptor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
