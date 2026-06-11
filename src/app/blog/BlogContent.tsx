"use client";

import React, { useState } from "react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: "Travel Tips" | "Destinations" | "Product News";
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "flight-booking-hacks-2026",
    title: "How to Hack the Flight Booking Algorithm (2026 Guide)",
    excerpt: "Learn the secrets of airline dynamic pricing, how to spot error fares, and when to book to get the lowest possible price on your next flight.",
    category: "Travel Tips",
    author: "Milo AI",
    date: "June 10, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "switzerland-hidden-gems",
    title: "10 Hidden Gems in Switzerland You Haven't Heard Of",
    excerpt: "Skip the tourist crowds in Interlaken and explore these pristine Swiss alpine villages, turquoise lakes, and scenic hiking trails.",
    category: "Destinations",
    author: "Sophia Chen",
    date: "June 08, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "luxury-hotels-under-100",
    title: "How to Find Luxury Hotels for Under $100/Night",
    excerpt: "From booking secret hotel lists to leveraging loyalty points and offseason rates, discover how to stay in 5-star comfort on a budget.",
    category: "Travel Tips",
    author: "Liam Patel",
    date: "June 05, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "introducing-milo-ai",
    title: "Introducing Milo: Your Personal AI Travel Assistant",
    excerpt: "We are thrilled to launch Milo, our AI concierge. Chat directly with Milo to find flights, compare hotels, and create custom itineraries in seconds.",
    category: "Product News",
    author: "The GlobeTrek Team",
    date: "June 01, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "kyoto-first-timers-guide",
    title: "The Ultimate First-Timer's Guide to Kyoto, Japan",
    excerpt: "Navigate shrines, temples, traditional teahouses, and bamboo forests. Includes dining recommendations and neighborhood walking routes.",
    category: "Destinations",
    author: "Yuki Tanaka",
    date: "May 28, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "carry-on-packing-art",
    title: "The Art of Carry-On Only: Pack for a 2-Week Trip",
    excerpt: "Ditch the baggage fees and long checkout lines. Here is our checklist for ultra-efficient packing and smart travel layering.",
    category: "Travel Tips",
    author: "Emma Watson",
    date: "May 25, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=600&auto=format&fit=crop",
  },
];

export default function BlogContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>(" ");

  // Normalizing string check
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured || selectedCategory !== "All" || searchQuery.trim() !== "");

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
              GlobeTrek Blog
            </span>
          </div>
          <span className="text-xs font-bold text-[#006875] tracking-widest uppercase bg-secondary/10 px-3 py-1.5 rounded-full">
            Insights &amp; Tips
          </span>
        </div>
      </header>

      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#000666]/5 via-[#006875]/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[10%] right-[-5%] w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[30%] left-[-5%] w-[350px] h-[350px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter relative z-10">
        
        {/* Header Block */}
        <div className="text-center pt-8 pb-12">
          <div className="inline-block mb-3 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              GlobeTrek Insights
            </span>
          </div>
          <h1 className="font-display-lg text-[36px] md:text-[56px] font-extrabold text-on-surface leading-tight tracking-tight mb-4">
            Travel Tips & Guides
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto text-[16px] md:text-[18px]">
            Stay updated with smart hacking guides, travel news, and curated itineraries from our globetrotting experts.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/15 p-4 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {["All", "Travel Tips", "Destinations", "Product News"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery.trim() === "" ? "" : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value || " ")}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-on-surface placeholder:text-outline"
            />
          </div>
        </div>

        {/* Featured Post (only show if no search/filter active) */}
        {selectedCategory === "All" && searchQuery.trim() === "" && featuredPost && (
          <div className="mb-16">
            <h2 className="font-label-bold text-xs uppercase tracking-widest text-[#006875] mb-4">Featured Story</h2>
            <div className="group bg-white rounded-3xl overflow-hidden border border-outline-variant/15 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image side */}
              <div className="lg:col-span-7 relative h-[250px] sm:h-[350px] lg:h-auto overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                  {featuredPost.category}
                </div>
              </div>
              {/* Content side */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-4">
                  <span className="font-bold text-primary">{featuredPost.author}</span>
                  <span>•</span>
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-semibold">{featuredPost.readTime}</span>
                </div>
                <h3 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface group-hover:text-primary transition-colors mb-4 leading-snug">
                  {featuredPost.title}
                </h3>
                <p className="font-body-sm text-on-surface-variant leading-relaxed mb-6">
                  {featuredPost.excerpt}
                </p>
                <div>
                  <button className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                    Read Article <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div>
          <h2 className="font-label-bold text-xs uppercase tracking-widest text-[#006875] mb-6">
            {selectedCategory === "All" && searchQuery.trim() === "" ? "Recent Articles" : `Results (${filteredPosts.length})`}
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-outline-variant/15 max-w-md mx-auto">
              <span className="material-symbols-outlined text-[48px] text-outline mb-4">find_in_page</span>
              <h3 className="font-title-lg text-lg text-on-surface mb-2">No articles found</h3>
              <p className="text-sm text-on-surface-variant">We couldn't find any articles matching "{searchQuery.trim()}". Try clearing filters or using different keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-outline-variant/15 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#006875] text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1.5 rounded-md shadow-sm">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mb-3">
                        <span className="font-bold text-primary">{post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="font-title-lg text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-3">
                        {post.title}
                      </h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                      <span className="text-[11px] font-semibold text-outline">{post.readTime}</span>
                      <button className="text-xs font-bold text-primary flex items-center gap-1 group-hover:text-secondary transition-colors">
                        Read <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Subscription Block */}
        <div className="mt-20 bg-gradient-to-br from-primary to-primary-container text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-[40px] text-secondary mb-4">notifications_active</span>
            <h2 className="font-display-lg text-2xl sm:text-3xl font-bold mb-4">Never Miss a Flight Hack</h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8">
              Join 50,000+ smart travelers. Subscribe to get our weekly email packed with error fares, dynamic pricing hacks, and secret travel destinations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs placeholder:text-white/50 text-white outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
              <button className="bg-secondary hover:bg-secondary/95 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
                Subscribe
              </button>
            </div>
            <p className="text-[10px] text-white/50 mt-4">We respect your privacy. Unsubscribe at any time. No spam, guaranteed.</p>
          </div>
        </div>

      </div>

      {/* Simplified Footer (No Home Link Options) */}
      <footer className="border-t border-outline-variant/15 bg-surface-container-low py-8 mt-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter text-center">
          <p className="font-body-sm text-[12px] text-on-surface-variant">
            © {new Date().getFullYear()} GlobeTrek. All rights reserved. Travel insights, comparison hacks, and dynamic fare analysis guides.
          </p>
        </div>
      </footer>
    </div>
  );
}
