import React from 'react';
import { Linkedin, Twitter, Facebook, ArrowUpRight, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full mt-12 frosted-glass rounded-[32px] p-6 sm:p-8 text-zinc-400">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
        {/* Brand & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#c2f866] text-black flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(194,248,102,0.3)]">
              <span className="font-display">C</span>
            </div>
            <span className="font-display font-black text-white tracking-tight text-lg uppercase">
              LEARN<span className="text-[#c2f866]">ME</span>
            </span>
          </div>
          <span className="hidden sm:inline-block text-zinc-600">|</span>
          <span className="text-xs text-zinc-400">
            Next-Generation Enterprise Capacity Building &amp; Competency Intelligence
          </span>
        </div>

        {/* Newsletter Subscription Pill from Screenshot 3 */}
        <form
          onSubmit={handleSubscribe}
          className="flex items-center frosted-glass-pill rounded-full p-1.5 w-full sm:w-auto max-w-md shadow-inner"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to subscribe"
            className="bg-transparent text-xs text-white placeholder-zinc-500 px-4 py-2 focus:outline-none flex-1 sm:w-64"
            required
          />
          <button
            type="submit"
            className="bg-[#c2f866] hover:bg-[#b0f34c] text-black font-extrabold text-xs px-5 py-2 rounded-full transition shrink-0 shadow-sm"
          >
            {subscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
      </div>

      {/* Bottom links & socials */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6 text-zinc-500">
          <a href="#privacy" className="hover:text-white transition">
            Privacy policy
          </a>
          <a href="#terms" className="hover:text-white transition">
            Terms and Conditions
          </a>
          <span>© {new Date().getFullYear()} Capacity Connect Inc.</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-500 text-[11px] mr-1">Follow us on:</span>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-[#1b1c24] hover:bg-white hover:text-black flex items-center justify-center text-zinc-400 transition"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-[#1b1c24] hover:bg-white hover:text-black flex items-center justify-center text-zinc-400 transition"
            aria-label="Facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-[#1b1c24] hover:bg-white hover:text-black flex items-center justify-center text-zinc-400 transition"
            aria-label="Twitter"
          >
            <Twitter className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
