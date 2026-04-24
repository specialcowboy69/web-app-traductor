import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ConsentProvider } from './lib/consent.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConsentProvider>
      <App />
    </ConsentProvider>
  </StrictMode>,
);
