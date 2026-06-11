"use client";

import React, { useState } from "react";

interface JobOpening {
  id: string;
  title: string;
  department: "Engineering" | "Product" | "Marketing" | "Operations";
  location: string;
  type: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

const JOB_OPENINGS: JobOpening[] = [
  {
    id: "frontend-engineer-nextjs",
    title: "Software Engineer — Frontend (React / Next.js)",
    department: "Engineering",
    location: "Remote (Global) / Bengaluru, India",
    type: "Full-Time",
    salary: "$90K - $130K • Equity Options",
    description: "We are looking for a Senior Frontend Engineer to lead the development of our core travel search engine interfaces. You will work on optimizing search speed, building interactive maps, and integrating our new AI assistant Milo.",
    responsibilities: [
      "Collaborate with product designers to implement pixel-perfect, highly interactive components using Tailwind CSS and Next.js.",
      "Optimize web application performance to ensure sub-second search response rendering.",
      "Work closely with our backend API team to design clean data schemas and state integrations."
    ],
    requirements: [
      "4+ years of professional software engineering experience with React, Next.js, and TypeScript.",
      "Proven track record of optimizing Core Web Vitals and client-side performance.",
      "Strong aesthetic eye and commitment to creating premium, fluid user animations."
    ]
  },
  {
    id: "senior-product-designer",
    title: "Senior Product Designer (UX/UI)",
    department: "Product",
    location: "Remote (CET / IST Timezones)",
    type: "Full-Time",
    salary: "$85K - $115K • Equity Options",
    description: "Shape the future of travel meta-search. As a Senior Product Designer, you will own the user experience across desktop and mobile devices, focusing on clarity, speed, and premium design vibes.",
    responsibilities: [
      "Conduct user research, design wireframes, high-fidelity mockups, and interactive prototypes.",
      "Own and expand GlobeTrek's Design System in Figma, advocating for consistency and polish.",
      "Partner with engineering to ensure implementation matches design intent perfectly."
    ],
    requirements: [
      "5+ years designing responsive web applications, with a strong portfolio showing interactive dashboards or search widgets.",
      "Expert skills in Figma, prototyping, and micro-interactions.",
      "Basic understanding of HTML/CSS to align easily with developers."
    ]
  },
  {
    id: "growth-marketing-manager",
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote (US / London, UK)",
    type: "Full-Time",
    salary: "$80K - $110K • Performance Bonus",
    description: "Own acquisition and marketing channels at GlobeTrek. You will design, run, and scale campaigns across search, social, and affiliate networks to attract millions of searchers.",
    responsibilities: [
      "Define and execute GlobeTrek's performance marketing strategy across Google Ads, Meta Ads, and travel networks.",
      "A/B test search copy, landing page designs, and referral mechanisms to drive down CAC.",
      "Partner with content creators and travel bloggers to build strategic backlink structures."
    ],
    requirements: [
      "3+ years managing user acquisition budgets of $50K+/month in consumer tech or travel tech.",
      "Deep understanding of SEO, conversion rate optimization (CRO), and digital analytics.",
      "Analytical mindset: comfortable writing simple SQL queries and using Looker or Excel."
    ]
  },
  {
    id: "travel-operations-specialist",
    title: "Travel Operations Specialist",
    department: "Operations",
    location: "Bengaluru, India (Hybrid)",
    type: "Full-Time",
    salary: "₹10L - ₹15L • Health Cover",
    description: "Keep our meta-search queries accurate. You will manage partnerships, monitor API uptimes, resolve rates discrepancies, and ensure customer service quality with partner agencies.",
    responsibilities: [
      "Coordinate with airline, hotel, and bus aggregators to resolve API integration bugs and caching mismatches.",
      "Monitor daily rate discrepancies between our search results and partners' final booking pages.",
      "Handle escalated support tickets related to booking redirects and affiliate link payouts."
    ],
    requirements: [
      "2+ years experience in travel operations, flight ticketing, or OTA account management.",
      "Exceptional communication skills and problem-solving focus.",
      "Familiarity with XML/JSON API responses is a big plus."
    ]
  }
];

export default function CareersContent() {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  
  // Application modal state
  const [activeApplyJob, setActiveApplyJob] = useState<JobOpening | null>(null);
  const [applyForm, setApplyForm] = useState({ name: "", email: "", resume: "", cover: "" });
  const [applySuccess, setApplySuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filteredJobs = JOB_OPENINGS.filter((job) => {
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesDept && matchesSearch;
  });

  const toggleJobExpand = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Mock API Submission
    setTimeout(() => {
      setSubmitting(false);
      setApplySuccess(true);
      setApplyForm({ name: "", email: "", resume: "", cover: "" });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface pt-24 pb-20">
      {/* Simplified Header (No Navbar Home Exit) */}
      <header className="border-b border-outline-variant/15 bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 transition-colors shadow-sm">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-[18px]">travel_explore</span>
            </div>
            <span className="font-display-lg text-[20px] font-bold text-primary tracking-tight">
              GlobeTrek Careers
            </span>
          </div>
          <span className="text-xs font-bold text-secondary tracking-widest uppercase bg-secondary/10 px-3 py-1.5 rounded-full">
            Join the Journey
          </span>
        </div>
      </header>

      {/* Visual background accents */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#000666]/5 via-[#006875]/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[12%] left-[-8%] w-[400px] h-[400px] bg-[#006875]/10 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-8%] w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter relative z-10">
        
        {/* Hero Banner Section */}
        <section className="text-center pt-8 pb-16">
          <div className="inline-block mb-3 px-3.5 py-1 rounded-full bg-secondary/10 border border-secondary/20">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#006875]">
              Work With Us
            </span>
          </div>
          <h1 className="font-display-lg text-[36px] md:text-[56px] font-extrabold text-on-surface leading-tight tracking-tight mb-5">
            Help Us Rebuild <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Travel Search
            </span>
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto text-[16px] md:text-[18px] mb-8">
            We are a remote-first, transparent team of developers, designers, and travel hackers on a mission to save travelers millions of dollars.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="#open-positions" className="bg-primary hover:bg-[#00044d] text-white font-label-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md transition-all">
              View Open Roles
            </a>
            <a href="#core-values" className="bg-white hover:bg-surface-container-low border border-outline-variant/30 text-on-surface font-label-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-sm transition-all">
              Our Core Values
            </a>
          </div>
        </section>

        {/* Benefits Quick Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {[
            { icon: "language", title: "Remote-First Setup", desc: "Work from anywhere in the world on your schedule." },
            { icon: "payments", title: "Competitive Salary", desc: "Top market rates + equity options for everyone." },
            { icon: "school", title: "$2,000 Learning Stipend", desc: "Buy books, courses, or tickets to conferences." },
            { icon: "schedule", title: "Flexible Time Off", desc: "Take breaks when you need. We value outputs, not hours." }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[32px] text-[#006875] mb-3">{benefit.icon}</span>
              <h3 className="font-title-lg text-sm font-bold text-on-surface mb-1">{benefit.title}</h3>
              <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </section>

        {/* Core Values Section */}
        <section id="core-values" className="bg-white rounded-3xl border border-outline-variant/15 p-8 md:p-12 mb-20 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display-lg text-2xl sm:text-3xl font-bold mb-3">Our Core Values</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              How we work together is just as important as what we build. These values direct our decisions every single day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Extreme Transparency",
                desc: "We share everything. Salaries, board decks, roadmap trade-offs, and mistake retrospectives are open to the entire company."
              },
              {
                title: "User Empathy",
                desc: "Every product choice begins by asking: 'Does this save our users time and money?' We avoid dark patterns at all costs."
              },
              {
                title: "Ownership & Trust",
                desc: "We don't micromanage. We hire smart builders, hand them outcomes to achieve, and trust them to execute their own way."
              }
            ].map((value, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-[#006875]">
                <h3 className="font-title-lg text-base font-bold text-on-surface mb-2">{value.title}</h3>
                <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions Board */}
        <section id="open-positions" className="scroll-mt-24">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-display-lg text-2xl sm:text-3xl font-bold mb-3">Open Positions</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Find your next challenge. Search for positions or filter by department.
            </p>
          </div>

          {/* Filters Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/15 p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Dept Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {["All", "Engineering", "Product", "Marketing", "Operations"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => { setSelectedDept(dept); setExpandedJobId(null); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedDept === dept
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery.trim() === "" ? "" : searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value || " "); setExpandedJobId(null); }}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-on-surface placeholder:text-outline"
              />
            </div>
          </div>

          {/* Jobs Accordion List */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-outline-variant/15 max-w-md mx-auto">
                <span className="material-symbols-outlined text-[48px] text-outline mb-4">work_off</span>
                <h3 className="font-title-lg text-lg text-on-surface mb-2">No jobs found</h3>
                <p className="text-sm text-on-surface-variant">We couldn't find any openings matching "{searchQuery.trim()}" in the {selectedDept} department.</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                return (
                  <div
                    key={job.id}
                    className={`bg-white border rounded-2xl shadow-sm transition-all duration-300 ${
                      isExpanded ? "border-primary ring-1 ring-primary/20" : "border-outline-variant/15 hover:border-primary/50"
                    }`}
                  >
                    {/* Accordion Trigger Header */}
                    <div
                      onClick={() => toggleJobExpand(job.id)}
                      className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded">
                            {job.department}
                          </span>
                          <span className="bg-[#006875]/10 text-[#006875] text-[10px] font-bold px-2.5 py-1 rounded">
                            {job.type}
                          </span>
                        </div>
                        <h3 className="font-title-lg text-base sm:text-lg font-bold text-on-surface leading-tight">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-on-surface-variant mt-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-primary">
                            <span className="material-symbols-outlined text-[14px]">payments</span>
                            {job.salary}
                          </span>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                        <span className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* Accordion Content Area */}
                    {isExpanded && (
                      <div className="px-5 pb-6 sm:px-6 sm:pb-8 border-t border-outline-variant/10 pt-5 bg-surface-container-lowest rounded-b-2xl animate-fade-in">
                        <div className="space-y-6">
                          {/* Desc */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-2">About the Role</h4>
                            <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">
                              {job.description}
                            </p>
                          </div>

                          {/* Responsibilities */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-2">Key Responsibilities</h4>
                            <ul className="list-disc list-inside space-y-1.5 font-body-sm text-[13px] text-on-surface-variant leading-relaxed pl-1">
                              {job.responsibilities.map((resp, i) => (
                                <li key={i}>{resp}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Requirements */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-2">What We're Looking For</h4>
                            <ul className="list-disc list-inside space-y-1.5 font-body-sm text-[13px] text-on-surface-variant leading-relaxed pl-1">
                              {job.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Action footer */}
                          <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center gap-4 flex-wrap">
                            <p className="text-[11px] text-on-surface-variant">GlobeTrek is an Equal Opportunity Employer.</p>
                            <button
                              onClick={() => { setActiveApplyJob(job); setApplySuccess(false); }}
                              className="bg-primary hover:bg-[#00044d] text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Dynamic Apply Modal */}
        {activeApplyJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              onClick={() => setActiveApplyJob(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal Body */}
            <div className="bg-white rounded-3xl shadow-2xl border border-outline-variant/15 w-full max-w-xl p-6 sm:p-8 relative z-10 max-h-[90vh] overflow-y-auto animate-scale-up">
              {/* Close button */}
              <button 
                onClick={() => setActiveApplyJob(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>

              {applySuccess ? (
                /* Success Layout */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-sm animate-bounce">
                    <span className="material-symbols-outlined text-[36px]">check_circle</span>
                  </div>
                  <h3 className="font-display-lg text-2xl font-bold text-on-surface mb-2">Application Submitted!</h3>
                  <p className="text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed mb-6">
                    Thank you for applying for the <span className="font-bold text-primary">{activeApplyJob.title}</span> role. Our hiring team will review your credentials and get back to you within 3-5 business days.
                  </p>
                  <button 
                    onClick={() => setActiveApplyJob(null)}
                    className="bg-primary hover:bg-[#00044d] text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-xl shadow-sm transition-all"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                /* Application Form */
                <>
                  <div className="mb-6">
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded">
                      {activeApplyJob.department}
                    </span>
                    <h3 className="font-display-lg text-xl sm:text-2xl font-bold text-on-surface mt-2">
                      Apply for {activeApplyJob.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {activeApplyJob.location} • {activeApplyJob.type}
                    </p>
                  </div>

                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Full Name *</label>
                      <input
                        type="text" required
                        value={applyForm.name}
                        onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Email Address *</label>
                      <input
                        type="email" required
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                        placeholder="johndoe@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Link to Resume / Portfolio *</label>
                      <input
                        type="url" required
                        value={applyForm.resume}
                        onChange={(e) => setApplyForm({ ...applyForm, resume: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                        placeholder="https://linkedin.com/in/username or google drive pdf link"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Cover Letter / Note (Optional)</label>
                      <textarea
                        rows={4}
                        value={applyForm.cover}
                        onChange={(e) => setApplyForm({ ...applyForm, cover: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                        placeholder="Tell us why you are excited to join GlobeTrek!"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit" disabled={submitting}
                        className="w-full bg-primary hover:bg-[#00044d] disabled:bg-primary/50 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Simplified Footer (No Home Link Options) */}
      <footer className="border-t border-outline-variant/15 bg-surface-container-low py-8 mt-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter text-center">
          <p className="font-body-sm text-[12px] text-on-surface-variant">
            © {new Date().getFullYear()} GlobeTrek. All rights reserved. Join our team in reshaping travel aggregator systems.
          </p>
        </div>
      </footer>
    </div>
  );
}
