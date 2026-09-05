import { Analytics } from '@vercel/analytics/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import RouteHead from './components/RouteHead';
import Footer from './sections/Footer';
import BlogPage from './pages/BlogPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import ChatPage from './pages/ChatPage';
import ReviewsPage from './pages/ReviewsPage';
import ServicePage from './pages/ServicePage';
import CaseStudyPage from './pages/CaseStudyPage';
import NotFoundPage from './pages/NotFoundPage';

/** Routes that fill the viewport and manage their own scrolling. */
const APP_ROUTES = new Set(['/chat']);

export default function App() {
  const { pathname } = useLocation();

  // The chat is an app, not a document: it owns the full height of the window,
  // so a footer under it would either be unreachable or push the composer off
  // the bottom of the screen.
  const isApp = APP_ROUTES.has(pathname.replace(/\/+$/, '') || '/');

  return (
    <main className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
      <RouteHead />


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<PostPage />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/work/:slug" element={<CaseStudyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {isApp ? null : <Footer />}

      {/*
        Page views, cookieless, no consent banner needed — and it counts every
        route including the client-side navigations a server log never sees.

        It is here rather than in index.html because the script only loads on a
        Vercel deployment: locally and in the prerenderer it renders nothing, so
        `npm run dev` isn't filing fake traffic against real numbers.

        There is a reason to want this beyond curiosity. The GEO service page
        promises AI referral traffic gets measured rather than assumed, and
        chatgpt.com and perplexity.ai only show up as referrers if something is
        watching for them.
      */}
      <Analytics />
    </main>
  );
}
