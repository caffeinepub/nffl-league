import { Link } from "@tanstack/react-router";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border/40 bg-navy mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/nffl-logo-transparent.dim_200x200.png"
              alt="NFFL"
              className="h-8 w-8 object-contain opacity-80"
            />
            <div>
              <div className="font-display font-black text-sm text-white">
                NFFL League
              </div>
              <div className="text-xs text-muted-foreground">
                National Flag Football League
              </div>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link
              to="/"
              className="hover:text-orange-DEFAULT transition-colors"
            >
              Home
            </Link>
            <Link
              to="/teams"
              className="hover:text-orange-DEFAULT transition-colors"
            >
              Teams
            </Link>
            <Link
              to="/schedule"
              className="hover:text-orange-DEFAULT transition-colors"
            >
              Schedule
            </Link>
            <Link
              to="/standings"
              className="hover:text-orange-DEFAULT transition-colors"
            >
              Standings
            </Link>
            <Link
              to="/news"
              className="hover:text-orange-DEFAULT transition-colors"
            >
              News
            </Link>
          </nav>

          {/* Attribution */}
          <div className="text-xs text-muted-foreground text-center md:text-right">
            <div>© {year} NFFL League. All rights reserved.</div>
            <div className="mt-1">
              Built with <span className="text-orange-DEFAULT">♥</span> using{" "}
              <a
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-DEFAULT hover:text-orange-bright transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
