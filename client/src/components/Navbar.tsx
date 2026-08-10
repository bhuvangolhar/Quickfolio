import { useState, useEffect } from "react";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#socials" },
];

export default function Navbar() {
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map((link) => link.href.slice(1));
      for (const id of [...sections].reverse()) {
        const element = document.getElementById(id);
        if (element && window.scrollY >= element.offsetTop - 120) {
          setActive(id);
          break;
        }
      }
    };

    // Trigger on mount to establish active route based on initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-cyan-500/10 py-4 transition-all duration-300">
      <div className="w-full flex items-center justify-between px-6 md:px-10">
        {/* Brand Logo Badge */}
        <button
          type="button"
          onClick={() => scrollTo("#hero")}
          aria-label="Scroll to top"
          className="group flex items-center shrink-0 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-white text-black font-mono font-black text-2xl flex items-center justify-center outline outline-2 outline-[#ffff00] outline-offset-2 transition-transform duration-300 group-hover:scale-105">
            B
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-12 ml-auto">
          {NAV_LINKS.map((link) => {
            const id = link.href.slice(1);
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(link.href)}
                className={`text-xs font-mono font-bold tracking-[0.2em] uppercase py-1 transition-colors duration-300 ${
                  isActive ? "text-cyan-400" : "text-white hover:text-cyan-400"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Menu Hamburger Trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          className="md:hidden flex flex-col justify-center gap-[5px] p-2 ml-auto focus:outline-none"
        >
          <span
            className={`block w-[22px] h-[1px] bg-cyan-400 transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-x-[4px] translate-y-[4px]" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-[1px] bg-cyan-400 transition-all duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-[22px] h-[1px] bg-cyan-400 transition-all duration-300 ${
              menuOpen ? "-rotate-45 translate-x-[4px] -translate-y-[4px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pt-4 pb-6 flex flex-col gap-5 bg-black border-t border-cyan-500/10">
          {NAV_LINKS.map((link) => {
            const id = link.href.slice(1);
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(link.href)}
                className={`text-left text-xs font-mono font-bold tracking-[0.2em] uppercase transition-colors duration-200 ${
                  isActive ? "text-cyan-400" : "text-white hover:text-cyan-400"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}