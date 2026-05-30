import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { label: "Flights", href: "/" },
    { label: "Hotels", href: "/" },
    { label: "Car Hire", href: "/" },
    { label: "Holiday Packages", href: "/" },
    { label: "Bus Tickets", href: "/" },
    { label: "Travel Insurance", href: "/" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Press Room", href: "#" },
    { label: "Partner Help", href: "#" },
    { label: "Advertise with Us", href: "#" },
  ];

  const supportLinks = [
    { label: "Help Centre", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Accessibility", href: "#" },
  ];

  const exploreLinks = [
    { label: "Price Alerts", href: "#" },
    { label: "Explore Anywhere", href: "#" },
    { label: "Travel Tips & Guides", href: "#" },
    { label: "Best Time to Travel", href: "#" },
    { label: "AI Travel Planner", href: "/ai" },
  ];

  const partnerLogos = [
    "Booking.com", "MakeMyTrip", "Expedia", "Agoda", 
    "Trip.com", "Hotels.com", "Cleartrip", "GoIbibo",
  ];

  return (
    <footer className="bg-surface-container-high dark:bg-on-background w-full transition-colors duration-300">
      {/* Trust Bar — Partner Logos */}
      <div className="border-b border-outline-variant/15 dark:border-white/5 py-8">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <p className="text-center text-[11px] font-label-bold text-outline dark:text-white/30 uppercase tracking-[0.2em] mb-5">
            Comparing prices across trusted partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
            {partnerLogos.map((name) => (
              <span
                key={name}
                className="text-[13px] font-label-bold text-outline-variant dark:text-white/20 hover:text-primary dark:hover:text-white/60 transition-colors duration-200 cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-[18px]">travel_explore</span>
              </div>
              <span className="font-display-lg text-[22px] font-bold text-primary dark:text-white tracking-tight">
                GlobeTrek
              </span>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-white/50 leading-relaxed mb-5 max-w-[280px]">
              The world&apos;s smartest travel meta-search engine. We compare 100+ sites to find you the absolute lowest prices.
            </p>

            {/* App Download Badges */}
            <div className="flex gap-2 mb-5">
              <div className="flex items-center gap-1.5 bg-surface-container dark:bg-white/5 border border-outline-variant/20 dark:border-white/10 rounded-lg px-3 py-2 cursor-pointer hover:bg-surface-container-high dark:hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-on-surface dark:text-white text-[18px]">
                  phone_iphone
                </span>
                <div>
                  <p className="text-[8px] text-on-surface-variant dark:text-white/50 leading-none">GET IT ON</p>
                  <p className="text-[11px] font-label-bold text-on-surface dark:text-white leading-tight">Google Play</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container dark:bg-white/5 border border-outline-variant/20 dark:border-white/10 rounded-lg px-3 py-2 cursor-pointer hover:bg-surface-container-high dark:hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-on-surface dark:text-white text-[18px]">
                  laptop_mac
                </span>
                <div>
                  <p className="text-[8px] text-on-surface-variant dark:text-white/50 leading-none">Download on the</p>
                  <p className="text-[11px] font-label-bold text-on-surface dark:text-white leading-tight">App Store</p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {["X (Twitter)", "Instagram", "Facebook", "YouTube"].map((platform) => (
                <div
                  key={platform}
                  className="w-9 h-9 rounded-full bg-surface-container dark:bg-white/5 border border-outline-variant/15 dark:border-white/10 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 text-on-surface-variant dark:text-white/40"
                  title={platform}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {platform === "X (Twitter)" ? "tag" : 
                     platform === "Instagram" ? "photo_camera" : 
                     platform === "Facebook" ? "thumb_up" : "play_arrow"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-label-bold text-[11px] text-on-surface dark:text-white uppercase tracking-[0.15em] mb-4">
              Products
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body-sm text-[13px] text-on-surface-variant dark:text-white/45 hover:text-primary dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-label-bold text-[11px] text-on-surface dark:text-white uppercase tracking-[0.15em] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body-sm text-[13px] text-on-surface-variant dark:text-white/45 hover:text-primary dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-label-bold text-[11px] text-on-surface dark:text-white uppercase tracking-[0.15em] mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body-sm text-[13px] text-on-surface-variant dark:text-white/45 hover:text-primary dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Links */}
          <div className="hidden lg:block">
            <h4 className="font-label-bold text-[11px] text-on-surface dark:text-white uppercase tracking-[0.15em] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body-sm text-[13px] text-on-surface-variant dark:text-white/45 hover:text-primary dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Bar */}
        <div className="mt-12 mb-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 dark:from-white/3 dark:via-white/5 dark:to-white/3 rounded-2xl border border-outline-variant/15 dark:border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-secondary/10 dark:bg-secondary/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[22px]">mail</span>
            </div>
            <div>
              <p className="font-label-bold text-on-surface dark:text-white text-[14px]">Get exclusive deals</p>
              <p className="text-[12px] text-on-surface-variant dark:text-white/50">Price drops & travel tips straight to your inbox.</p>
            </div>
          </div>
          <div className="flex w-full md:w-auto md:flex-1 max-w-md">
            <input
              className="flex-1 bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/25 dark:border-white/10 rounded-l-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none text-on-surface dark:text-white placeholder:text-outline dark:placeholder:text-white/30"
              placeholder="Your email address"
              type="email"
            />
            <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-r-xl font-label-bold text-sm transition-colors shadow-sm active:scale-[0.98]">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-outline-variant/15 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body-sm text-[12px] text-on-surface-variant dark:text-white/30 text-center md:text-left">
            © {currentYear} GlobeTrek. All rights reserved. GlobeTrek is a meta-search engine — we compare prices but do not sell tickets directly.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-on-surface-variant dark:text-white/30">
            <Link href="#" className="hover:text-primary dark:hover:text-white/60 transition-colors">Privacy</Link>
            <span className="text-outline-variant dark:text-white/10">·</span>
            <Link href="#" className="hover:text-primary dark:hover:text-white/60 transition-colors">Terms</Link>
            <span className="text-outline-variant dark:text-white/10">·</span>
            <Link href="#" className="hover:text-primary dark:hover:text-white/60 transition-colors">Cookies</Link>
            <span className="text-outline-variant dark:text-white/10">·</span>
            <Link href="#" className="hover:text-primary dark:hover:text-white/60 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
