import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/teams", label: "Teams", exact: false },
  { to: "/schedule", label: "Schedule", exact: false },
  { to: "/standings", label: "Standings", exact: false },
  { to: "/news", label: "News", exact: false },
];

export function Navbar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string, exact: boolean) =>
    exact ? currentPath === to : currentPath.startsWith(to);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-navy/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/assets/generated/nffl-logo-transparent.dim_200x200.png"
            alt="NFFL Logo"
            className="h-10 w-10 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-display font-black text-lg leading-tight tracking-tight text-white">
              NFFL
            </span>
            <span className="text-[10px] font-ui font-medium text-orange-DEFAULT/80 uppercase tracking-widest leading-tight">
              League
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.to, link.exact);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-ui font-semibold uppercase tracking-wider transition-colors rounded-md ${
                  active
                    ? "text-orange-DEFAULT"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md bg-orange-DEFAULT/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/40 bg-navy overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.to, link.exact);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-md text-sm font-ui font-semibold uppercase tracking-wider transition-colors ${
                      active
                        ? "bg-orange-DEFAULT/10 text-orange-DEFAULT"
                        : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
