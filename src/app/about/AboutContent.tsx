import React from "react";
import Link from "next/link";

export default function AboutContent() {
  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden flex items-center justify-center min-h-[500px]">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000666]/5 via-[#006875]/5 to-transparent dark:from-[#020617] dark:via-[#0f172a] dark:to-background z-0" />
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-gutter text-center">
          <div className="inline-block mb-4 px-3 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-outline-variant/30 backdrop-blur-md">
            <span className="text-xs font-label-bold uppercase tracking-widest text-primary dark:text-secondary bg-clip-text">
              Reimagining Travel
            </span>
          </div>
          <h1 className="font-display-lg text-[40px] md:text-[64px] font-bold text-on-surface dark:text-white leading-[1.1] tracking-tight mb-6 max-w-4xl mx-auto">
            The world’s smartest travel <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-blue-400 dark:to-cyan-300">
              meta-search engine.
            </span>
          </h1>
          <p className="font-body-lg text-[18px] md:text-[22px] text-on-surface-variant dark:text-white/70 max-w-2xl mx-auto leading-relaxed">
            We compare over 100+ travel sites in seconds to find you the absolute lowest prices on flights, hotels, and holiday packages.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-y border-outline-variant/20 dark:border-white/10 bg-surface/50 dark:bg-surface/10 backdrop-blur-sm relative z-10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-x-0 md:divide-x divide-outline-variant/20 dark:divide-white/10">
            {[
              { value: "100+", label: "Travel Sites Compared" },
              { value: "2M+", label: "Happy Travelers" },
              { value: "50+", label: "Countries Covered" },
              { value: "$40M", label: "Saved for Users" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center group">
                <h3 className="font-display-lg text-4xl md:text-5xl font-bold text-primary dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </h3>
                <p className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant dark:text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24 relative z-10">
        <div className="max-w-[900px] mx-auto px-margin-mobile md:px-gutter text-center">
          <span className="material-symbols-outlined text-[48px] text-secondary mb-6 opacity-80">
            explore
          </span>
          <h2 className="font-headline-md text-3xl md:text-4xl text-on-surface dark:text-white mb-8 leading-snug">
            Our mission is to make travel accessible, transparent, and affordable for everyone across the globe.
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </div>
      </section>

      {/* Why Choose Us Grid */}
      <section className="py-20 bg-surface-container-low dark:bg-[#0b1121] relative z-10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-3xl md:text-4xl text-on-surface dark:text-white mb-4">
              Why GlobeTrek?
            </h2>
            <p className="text-on-surface-variant dark:text-white/60 max-w-xl mx-auto">
              We leverage cutting-edge technology to give you the ultimate edge in booking your next adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "smart_toy",
                title: "AI-Powered Search",
                desc: "Our proprietary AI engine scans billions of flight and hotel combinations instantly to surface hidden deals.",
              },
              {
                icon: "price_check",
                title: "Price Drop Protection",
                desc: "Book with confidence. If the price drops after you book, our partners will refund you the difference.",
              },
              {
                icon: "public",
                title: "Global Coverage",
                desc: "From boutique homestays in Bali to first-class flights to New York, we cover every corner of the world.",
              },
              {
                icon: "verified_user",
                title: "Unbiased Results",
                desc: "We don't manipulate prices. We show you the raw, unbiased truth about what your trip should cost.",
              },
              {
                icon: "flash_on",
                title: "Lightning Fast",
                desc: "Powered by advanced edge computing, our search results load faster than a blink of an eye.",
              },
              {
                icon: "support_agent",
                title: "24/7 Support",
                desc: "Our dedicated travel experts are always on standby to assist you anywhere in the world.",
              },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="group p-8 rounded-3xl bg-white dark:bg-surface-container border border-outline-variant/20 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 dark:bg-white/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150" />
                <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-white/10 flex items-center justify-center mb-6 text-primary dark:text-secondary group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[28px]">{feature.icon}</span>
                </div>
                <h3 className="font-title-lg text-xl text-on-surface dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="font-body-sm text-on-surface-variant dark:text-white/70 leading-relaxed relative z-10">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary dark:bg-[#001133] z-0" />
        <div className="absolute inset-0 opacity-20 dark:opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display-lg text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to explore the world?
          </h2>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join millions of smart travelers who save up to 40% on their trips using GlobeTrek.
          </p>
          <Link href="/" className="inline-block bg-white text-primary font-label-bold text-sm uppercase tracking-wider px-10 py-4 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 active:scale-95">
            Start Searching Now
          </Link>
        </div>
      </section>

    </div>
  );
}