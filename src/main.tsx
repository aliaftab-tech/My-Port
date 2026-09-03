import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const container = document.getElementById('root')!;

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// `npm run build` prerenders every route to real HTML, so in production there
// is already markup here to hydrate. The dev server ships an empty root, and
// so would a build with prerendering switched off — both fall back to
// rendering from scratch rather than breaking.
if (container.firstChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
