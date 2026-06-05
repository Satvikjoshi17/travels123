import React from 'react';
import Link from 'next/link';

export default function AIPage() {
  return (
    <div className="bg-background text-on-background font-body-lg overflow-hidden h-screen flex flex-col">
      {/* Top Navigation Anchor */}
      <header className="fixed top-0 w-full z-50 bg-surface/5 backdrop-blur-xl border-b border-white/10 shadow-lg h-20">
        <div className="flex justify-between items-center px-margin-mobile md:px-gutter h-full max-w-container-max mx-auto">
          <div className="flex items-center gap-stack-sm">
            <Link href="/" className="font-headline-md text-headline-md font-bold tracking-tight text-primary dark:text-white">GlobeTrek</Link>
            <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">AI PRO</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300" href="#">Hotels</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300" href="#">Flights</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300" href="#">Cars</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300" href="#">Deals</Link>
          </nav>
          <div className="flex items-center gap-stack-md">
            <span className="material-symbols-outlined text-primary dark:text-white cursor-pointer p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all">language</span>
            <img alt="User profile avatar" className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzosgsGv8QlDRlqA4OxLIdqycjBxdaz6gRwgq9WLOXy4BzAlYJd3ZwL_X-kgp9Qc97krFbVh1qEuq7GC4U6FbbCt2xUAMzYBUg1UDczjBg7ZtpN6zDbhl9qWkvVQTmjLIBuUykQkw5cYpAr1uO-d3QbsZjbUgL2HVXpUHKLexcjd8q_DXD1aN6EcHf6m0fP2js9k6zSXfEFUdVjFUQqCXzti-ldrzYHv82afP3A9GtrPbgMGoKh2juFkudejppxkziVDOHm8_c1w"/>
          </div>
        </div>
      </header>

      <main className="pt-20 h-full flex relative overflow-hidden flex-1">
        {/* AI Background Ambience */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary rounded-full blur-[100px]"></div>
        </div>

        {/* Left Context Sidebar */}
        <aside className="w-80 h-full border-r border-outline-variant dark:border-white/10 bg-surface-container-low/50 dark:bg-surface/50 backdrop-blur-lg z-10 p-6 hidden lg:flex flex-col gap-stack-lg">
          <div className="space-y-stack-md">
            <h3 className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Current Request</h3>
            <div className="bg-surface-container-lowest dark:bg-surface-container p-4 rounded-xl shadow-sm border border-outline-variant/30 dark:border-white/10 space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary">flight_takeoff</span>
                <div>
                  <p className="font-label-bold text-label-bold text-outline">Origin</p>
                  <p className="font-title-lg text-title-lg text-primary dark:text-white">San Francisco (SFO)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary">flight_land</span>
                <div>
                  <p className="font-label-bold text-label-bold text-outline">Destination</p>
                  <p className="font-title-lg text-title-lg text-primary dark:text-white">Tokyo (NRT)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary">calendar_today</span>
                <div>
                  <p className="font-label-bold text-label-bold text-outline">Dates</p>
                  <p className="font-title-lg text-title-lg text-primary dark:text-white">Oct 12 - Oct 24</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-stack-md">
            <div className="bg-primary-container p-4 rounded-xl text-on-primary-container">
              <p className="font-body-sm text-body-sm text-primary dark:text-primary-fixed-dim mb-2">Smart Tip</p>
              <p className="font-body-md text-body-md">Prices are 15% lower than average for these dates. AI recommends booking within 4 hours.</p>
            </div>
          </div>
        </aside>

        {/* Conversational Interface */}
        <section className="flex-1 flex flex-col items-center justify-start p-6 relative z-10 max-w-4xl mx-auto w-full">
          {/* AI Header */}
          <div className="text-center mt-8 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-4">
              <span className="material-symbols-outlined text-secondary text-[18px]">auto_awesome</span>
              <span className="text-secondary font-label-bold text-label-bold">AETHER AI ACTIVE</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-primary dark:text-white mb-2">How can I help you today?</h1>
            <p className="text-on-surface-variant dark:text-outline-variant font-body-lg">"Find me a direct flight to Tokyo under $1200"</p>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 w-full overflow-y-auto space-y-stack-lg px-4 pb-32 scrollbar-hide">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-md">
                <p className="font-body-lg text-body-lg">Find the best value business class flight to Tokyo for my dates.</p>
              </div>
            </div>

            {/* AI Typing / Progress */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="glass-panel p-4 rounded-2xl rounded-tl-none border border-white/40 dark:border-white/10 shadow-sm max-w-[80%]">
                    <p className="font-body-lg text-body-lg text-on-surface dark:text-white">Searching 450+ airlines for the best business class fares to Tokyo...</p>
                    <div className="mt-4 flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary shimmer"></div>
                        <span className="text-[12px] font-medium text-secondary">Comparing prices</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-40">
                        <div className="w-2 h-2 rounded-full bg-outline"></div>
                        <span className="text-[12px] font-medium text-outline">Securing fares</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Fare Card Result */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <div className="flex-1 space-y-4">
                <div className="glass-panel p-4 rounded-2xl rounded-tl-none border border-white/40 dark:border-white/10 shadow-sm max-w-[80%] mb-4">
                  <p className="font-body-lg text-body-lg text-on-surface dark:text-white">I've found an exceptional deal with Japan Airlines. It includes a lie-flat seat and premium lounge access.</p>
                </div>

                {/* Fare Card */}
                <div className="bg-surface-container-lowest dark:bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/30 dark:border-white/10 shadow-xl max-w-md">
                  <div className="ai-gradient-bg p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined">workspace_premium</span>
                      <span className="font-label-bold text-label-bold uppercase">Best Value Deal</span>
                    </div>
                    <span className="bg-secondary-fixed-dim text-on-secondary-fixed px-2 py-0.5 rounded text-[10px] font-bold">BUSINESS</span>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <p className="font-headline-sm text-headline-sm text-primary dark:text-white">SFO</p>
                        <p className="text-on-surface-variant dark:text-outline-variant font-body-sm">11:35 AM</p>
                      </div>
                      <div className="flex-1 px-4 flex flex-col items-center">
                        <p className="text-[10px] text-outline font-bold uppercase mb-1">11h 20m Direct</p>
                        <div className="w-full h-[1px] bg-outline-variant dark:bg-outline/50 relative">
                          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-surface-container-lowest dark:bg-surface-container px-1">
                            <span className="material-symbols-outlined text-secondary text-sm">flight</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-headline-sm text-headline-sm text-primary dark:text-white">NRT</p>
                        <p className="text-on-surface-variant dark:text-outline-variant font-body-sm">3:55 PM (+1)</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-outline-variant/30 dark:border-white/10 flex justify-between items-end">
                      <div>
                        <p className="text-outline font-body-sm">Price per person</p>
                        <p className="font-display-lg text-[32px] text-primary dark:text-white">$1,142</p>
                      </div>
                      <button className="bg-secondary hover:bg-secondary-container transition-all text-white px-6 py-3 rounded-xl font-title-lg flex items-center gap-2 active:scale-95 shadow-md">
                        Quick Book <span className="material-symbols-outlined">bolt</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Control & Input Area */}
          <div className="fixed bottom-0 left-0 right-0 lg:left-80 p-6 z-50 bg-gradient-to-t from-background via-background/80 to-transparent">
            <div className="max-w-3xl mx-auto glass-panel rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl p-3 flex items-center gap-4 dark:bg-surface/80">
              <button className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg hover:shadow-primary/20 transition-all">
                <span className="material-symbols-outlined">add</span>
              </button>
              <div className="flex-1 relative">
                <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface dark:text-white font-body-lg py-4 placeholder:text-outline outline-none" placeholder="Type or use voice to search..." type="text"/>
              </div>
              <div className="flex items-center gap-3 pr-2">
                {/* Pulse Mic */}
                <div className="relative">
                  <div className="absolute inset-0 pulse-ring rounded-full"></div>
                  <button className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center relative z-10 shadow-lg">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                  </button>
                </div>
                <button className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Assist Panel */}
        <aside className="w-80 h-full border-l border-outline-variant dark:border-white/10 bg-surface-container-low/50 dark:bg-surface/50 backdrop-blur-lg z-10 p-6 hidden xl:flex flex-col gap-stack-lg overflow-y-auto">
          <h3 className="font-label-bold text-label-bold text-outline uppercase tracking-wider">AI Assistant Stats</h3>
          <div className="space-y-4">
            <div className="p-4 bg-surface-container-lowest/40 dark:bg-surface-container/40 rounded-xl border border-outline-variant/30 dark:border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-on-surface-variant dark:text-white/80 font-body-sm">Inventory Scanned</span>
                <span className="text-secondary font-label-bold">98%</span>
              </div>
              <div className="w-full h-1.5 bg-outline-variant dark:bg-outline/50 rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: '98%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-surface-container-lowest/40 dark:bg-surface-container/40 rounded-xl border border-outline-variant/30 dark:border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-on-surface-variant dark:text-white/80 font-body-sm">Market Volatility</span>
                <span className="text-error font-label-bold">High</span>
              </div>
              <p className="text-[11px] text-outline">Prices changing every 2.4 minutes on this route.</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-label-bold text-label-bold text-outline uppercase tracking-wider mb-4">Trip Moodboard</h3>
            <div className="grid grid-cols-2 gap-2">
              <img alt="Tokyo Skyline" className="rounded-lg aspect-square object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0AJU5M12EX9WbTAjTf4bt54qxBb6NXuif3_Wj536JDYZhFjuR1tNPgMFGQGN-E9nsm0ExPtjwZjixiYI9pZhRV2uYt9GU9s0FEMjZqZnOAcc6znsmQvuBB0Nrm4sZrnwTJp-na5LcBBgvGjmeD6xLTKAup7Kdedec4CPApyEUJcBbAvROCbJgY3f1OBYr7YZQ4ydhpskLkJmRwpf4bvfW5UQuPZVVLo3UYnWZ2OeNYOkLzgTUpALvgf41V2yApg9JkXb_X-mHSQ"/>
              <img alt="Japanese Temple" className="rounded-lg aspect-square object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiJEbCB84k0EgYUZvvFHV7m4UNOls1ARwlG-7urSoI-6cfBtIEDNobTO_05tJYCowjW2-x0Yat-sJp1koA-3iyIQwJMJRFlk1PWMsPPbVfQnvhJ1T6M0wahh9Y8-BSWvgD3_wC8I7s37QWWrNN6qzBZ_pEO1pu-jrMNl_NGa6FfXLk7oUutbb8jjEvUnYiC73Famo9NoGs2vsvLSobchR9_7qvYgICn_CXI4lgX_3xhoYcTaZWbwspYCuIxXj6lPrGpOTqcU0WaQ"/>
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile Bottom Nav Override */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface dark:bg-surface-container border-t border-outline-variant/30 dark:border-white/10 grid grid-cols-5 h-16 items-center z-[100]">
        <Link href="/" className="flex flex-col items-center text-primary dark:text-white">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <button className="flex flex-col items-center text-outline">
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px]">Explore</span>
        </button>
        <button className="flex flex-col items-center -mt-8">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white shadow-lg pulse-ring">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
          </div>
        </button>
        <button className="flex flex-col items-center text-outline">
          <span className="material-symbols-outlined">bookmark</span>
          <span className="text-[10px]">Saved</span>
        </button>
        <button className="flex flex-col items-center text-outline">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}
