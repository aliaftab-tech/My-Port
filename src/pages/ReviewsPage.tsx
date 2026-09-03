import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import PageNav from '../components/PageNav';
import PageCta from '../components/PageCta';
import ReviewsSection from '../sections/ReviewsSection';

/**
 * Client reviews — what it's like to work with Ali.
 *
 * These are testimonials about the work, not feedback on the chatbot, and they
 * get their own page for that reason: a review form under a chat window reads
 * as a rating of the chat window.
 */
export default function ReviewsPage() {
  return (
    <div>
      <PageNav />

      <ReviewsSection />

      <div className="px-5 pb-4 sm:px-8 md:px-10">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2.5 rounded-full border border-[#D7E2EA]/20
              px-5 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-[#D7E2EA]
              transition-colors duration-300 hover:bg-[#D7E2EA] hover:text-[#0C0C0C]"
          >
            <MessageSquare size={15} strokeWidth={2.2} />
            Ask the AI about the work
          </Link>
        </div>
      </div>

      <PageCta line="Want to be the next one on this page? Tell me what you're building." />
    </div>
  );
}
