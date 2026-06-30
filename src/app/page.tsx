"use client";

import Image from "next/image";

const packages = [
  {
    title: "Bali",
    country: "Indonesia",
    days: "7 Days",
    rating: "4.9",
    tagline: "Island of Gods",
    image: "/images/maldives1.png",
    stamp: "🌴",
  },
  {
    title: "Santorini",
    country: "Greece",
    days: "5 Days",
    rating: "4.8",
    tagline: "Sunsets & White Houses",
    image: "/images/santorini.png",
    stamp: "🏛️",
  },
  {
    title: "Paris",
    country: "France",
    days: "6 Days",
    rating: "4.9",
    tagline: "City of Love",
    image: "/images/paris.png",
    stamp: "🗼",
  },
  {
    title: "Dubai",
    country: "UAE",
    days: "4 Days",
    rating: "4.7",
    tagline: "Luxury Meets Desert",
    image: "/images/dubai.jpg",
    stamp: "🐪",
  },
];

/*for square change mt and height and icon place*/
const categories = [
  {
    title: "Adventure Tours",
    image: "/images/paris.png",
    className: "mt-15",
  },
  {
    title: "Cultural Tours",
    image: "/images/ujjain.png",
    className: "mt-15",
  },
  {
    title: "Beach Getaways",
    image: "/images/beach.jpg",
    className: "mt-15",
  },
  {
    title: "Luxury Escapes",
    image: "/images/dubai.png",
    className: "mt-15",
  },
  {
    title: "Family Vacations",
    image: "/images/santorini.png",
    className: "mt-15",
  },
  {
    title: "Wildlife Expeditions",
    image: "/images/mountains.png",
    className: "mt-15",
  },
];


import { useCurrency } from "@/contexts/CurrencyContext";
import { CurrencySelector } from "@/components/CurrencySelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AIAssistantFAB } from "@/components/AIAssistantFAB";
import { SearchWidget } from "@/components/SearchWidget";
import { useEffect, useState } from "react";
import { MapPin, Plane } from "lucide-react";

export default function Home() {
  const { formatPrice, setModalOpen, selectedCountry } = useCurrency();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  

  return (
    <>
      <CurrencySelector />
      <Header />
      <section className="relative overflow-hidden">
  
  {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-indigo-200 to-violet-200" />



  
  <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
    <div className="grid lg:grid-cols-2 gap-10 items-center py-15">

      {/* LEFT CONTENT */}
      <div>

        <h1 className="text-3xl lg:text-5xl font-bold">
          Every Journey
          <br />
          <span className="text-blue-900">Starts Here</span>
        </h1>

        <p className="mt-2 text-base text-slate-600 max-w-lg">
          Compare prices from 100+ travel providers and
          book with confidence.
        </p>

        {/* TRUST STATS */}
        <div className="flex flex-wrap gap-8 mt-5">
          <div>
            <h3 className="font-bold text-xl">2M+</h3>
            <p className="text-slate-500">
              Happy Travelers
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl">100+</h3>
            <p className="text-slate-500">
              Travel Partners
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl">24/7</h3>
            <p className="text-slate-500">
              Customer Support
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE DESTINATION CARDS */}
      <div className="relative w-full max-w-full mx-auto lg:mx-0 h-[190px] sm:h-[290px] lg:h-[220px]">

      {/* japan*/}
      <div className="absolute -left-1 -top-7 sm:left-6 sm:top-1 lg:left-10 lg:top-10">
        <div className="relative">
          <div className="relative w-30 h-30 sm:w-52 sm:h-52 lg:w-35 lg:h-35 rounded-full overflow-hidden border-[3px] border-white shadow-2xl">
            <Image
              src="/images/japan.png"
              alt="japan"
              fill
              sizes="(max-width: 640px) 64px, 80px"
            />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-white rounded-full px-5 py-1 shadow-lg flex items-center gap-2">
            <MapPin size={16} className="text-violet-600" />
            <span className="font-medium">Japan</span>
          </div>
        </div>
      </div>

      {/* ujjain - Large */}
      <div className="absolute left-1/2 top-2 -translate-x-1/2 sm:top-3 lg:top-5">
        <div className="relative">
       <div className="relative w-30 h-30 sm:w-52 sm:h-52 lg:w-38 lg:h-38 rounded-full overflow-hidden border-[3px] border-white shadow-2xl">

            <Image
              src="/images/ujjain.png"
              alt="ujjain"
              fill
               sizes="(max-width: 640px) 64px, 80px"
            />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-white rounded-full px-5 py-1 shadow-lg flex items-center gap-2">
            <MapPin size={16} className="text-violet-600" />
            <span className="font-medium">Ujjain</span>
          </div>
        </div>
      </div>

      {/* Agra */}
      <div className="absolute -right-1 -top-7 sm:right-6 sm:top-1 lg:right-10 lg:top-10">
        <div className="relative">
        <div className="relative w-30 h-30 sm:w-52 sm:h-52 lg:w-35 lg:h-35 rounded-full overflow-hidden border-[3px] border-white shadow-2xl">
            
            <Image
              src="/images/tajmahal.jpg"
              alt="Agra"
              fill
              sizes="(max-width: 640px) 64px, 80px"
            />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-white rounded-full px-5 py-1 shadow-lg flex items-center gap-2">
            <MapPin size={16} className="text-violet-600" />
            <span className="font-medium">Agra</span>
          </div>
        </div>
      </div>
    </div>
   </div>
</div>
  {/* Search Widget */}
  <SearchWidget />
</section>
 
 /*tour category*/
<section className="relative py-15 bg-white overflow-hidden">
 <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center">
          <p className="text-blue-600 font-medium">
            Wonderful place for You
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            Tour Categories
          </h2>
        </div>

        {/* Cards */}
        <div className="flex justify-center items-start gap-6 flex-wrap lg:flex-nowrap">

          {categories.map((category, index) => (
            <div
              key={index}
              className={`${category.className} text-center group`}
            >
              <div
                className={`
                  relative overflow-hidden rounded-full
                  ${
                    index === 2 || index === 3
                      ? "w-32 h-48 sm:w-44 sm:h-66"
                      : "w-32 h-48 sm:w-44 sm:h-66"
                  }
                  shadow-lg cursor-pointer
                `}
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 220px"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <h3 className="mt-4 font-semibold text-lg">
                {category.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-5 bg-rose-100/50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-sky-500 font-medium">
            Curated Especially For You
          </p>

          <h2 className="text-4xl font-bold mt-2">
            Premium Destination Packages
          </h2>
        </div>

        {/* Postcards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">

          {packages.map((item, index) => (
            <div
              key={index}
              className="
                group
                relative
                bg-[#fffdf8]
                rounded-[28px]
                overflow-hidden
                shadow-lg
                hover:-translate-y-3
                transition-all duration-500
                hover:rotate-0
              "
            >
              {/* Stamp */}
              <div className="absolute top-4 right-4 z-20 text-4xl">
                {item.stamp}
              </div>

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />
              </div>

              {/* Dashed Separator */}
              <div className="border-t-2 border-dashed border-gray-300" />

              {/* Content */}
              <div className="p-3">

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {item.title}
                    </h3>

                    <p className="text-gray-500">
                      📍 {item.country}
                    </p>
                  </div>

                  <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm">
                    ⭐ {item.rating}
                  </span>
                </div>

                <p className="mt-2 text-gray-600 italic">
                  "{item.tagline}"
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="font-medium">
                    {item.days}
                  </span>

                  <button
                    className="
                      w-10 h-10 rounded-full
                      bg-sky-500 text-white
                      flex items-center justify-center
                    "
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
        {/* Premium Holiday Packages Section */}
        <section className="py-stack-lg bg-surface transition-colors duration-300">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
            <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-end mb-stack-md gap-2 md:gap-0">
              <div>
                <span className="inline-block bg-tertiary text-on-tertiary font-label-bold text-[10px] uppercase px-2 py-0.5 rounded-full mb-2">Curated for You</span>
                <h2 className="font-headline-md text-headline-md text-primary dark:text-white">Premium Holiday Packages</h2>
              </div>
              <a 
                className="text-secondary font-label-bold hover:underline mb-1 flex items-center gap-1" 
                href="https://tp.media/r?marker=734132&trs=534470&p=4110&campaign_id=137&u=https%3A%2F%2Fwww.klook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore All Packages
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <a 
                href="https://tp.media/r?marker=734132&trs=534470&p=4110&campaign_id=137&u=https%3A%2F%2Fwww.klook.com%2Fen-US%2Fsearch%3Fquery%3DSwitzerland"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-80 block"
              >
                <Image alt="Swiss Alps" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvvHYTPkxrOawM6r39p9MJPZj8APKSDB-UvYiP4FWo_ipEwfwfS6_VpKh3owTyExPu6uHm4OrcpVy18iAYmo-KoWxZYMAppXFoeQBpQX_5B2i1Gmrn7BwPir2wk65htCsULvLXKveGkvenVsFR8TQlWhQDCd0WjrXIX1QL7JopaN3crqCnKUVPFu4Ei5Q9KGail3kLn9AwW1aa4G7n6joqIPavUOXBX1K7q1iX3rn0YZoyw1y0hxgM-hDc6wY-jPKxKOeQOBzCxQ" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 dark:from-background/90 dark:via-background/40 to-transparent transition-colors"></div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <div className="text-xs font-label-bold text-tertiary-fixed mb-1 uppercase tracking-wider">Adventure</div>
                  <h3 className="font-title-lg text-title-lg mb-1">Swiss Alpine Retreat</h3>
                  <p className="font-body-sm text-body-sm text-white/80 mb-2">7 Days | 6 Nights | Full Board</p>
                  <span className="font-headline-sm text-headline-sm">{mounted ? formatPrice(1499) : '$1,499'}</span>
                </div>
              </a>
              <a 
                href={`https://tp.media/r?marker=734132&trs=534470&p=1904&campaign_id=31&u=${encodeURIComponent(`https://www.booking.com/searchresults.html?ss=Maldives&selected_currency=${selectedCountry?.currency?.toUpperCase() || "USD"}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-80 block"
              >
                <Image alt="Maldives Resort" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuEbHaDd9hzMeAvKZFBYDq8pwMVI2eEI-jxf55NMVypigqJIvaU0vsAbJnHa1pk1mg56QvzOIf8rBIEO5VwPcALlO_hka11uaCVnfngXjQCBXlubpD4Q-MRPSzGDRjRL-ee7nkfhLyT_W4Bug8bdCWGUJG8ZRGefDa7FoFakDMQxAT6Z2RLU5p-9XxLfLVdyC-sTqyVq9SfDfScs-mEdYNSoyisHB9dxwHB2VEUkiLQdl0jpt_nuPv9vKYwMOSDB362kbGObA" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 dark:from-background/90 dark:via-background/40 to-transparent transition-colors"></div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <div className="text-xs font-label-bold text-tertiary-fixed mb-1 uppercase tracking-wider">Luxury</div>
                  <h3 className="font-title-lg text-title-lg mb-1">Maldives Overwater Bliss</h3>
                  <p className="font-body-sm text-body-sm text-white/80 mb-2">5 Days | 4 Nights | All-Inclusive</p>
                  <span className="font-headline-sm text-headline-sm">{mounted ? formatPrice(2250) : '$2,250'}</span>
                </div>
              </a>
              <a 
                href="https://tp.media/r?marker=734132&trs=534470&p=4110&campaign_id=137&u=https%3A%2F%2Fwww.klook.com%2Fen-US%2Fsearch%3Fquery%3DKyoto"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-80 block"
              >
                <Image alt="Kyoto Temple" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZtk7U8a5jXVtSYCLnZyhr-RYAk7m0V3P0gjb8upOKniXp1A_mJLgxBdkkbSgmjcNTkYCp-b4yFXVuO_2HTlp90dkDB0H8TDC2eD9PuNOYgC0i-nWpkyW-qVNi8e7uLFPpvO4bSUy9SMb5XWjML9gIoANrHRnGSKRHDNkgWhPqouTNTCwDaYCz7OK_WkSc9jxHBFUqLOK15l0-K0H3U1dzXeB7hvZ2UEnvmLYySFdlWOW2dcRpY6ZRUrGVKwvtvLo06KLXitooOQ" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 dark:from-background/90 dark:via-background/40 to-transparent transition-colors"></div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <div className="text-xs font-label-bold text-tertiary-fixed mb-1 uppercase tracking-wider">Cultural</div>
                  <h3 className="font-title-lg text-title-lg mb-1">Kyoto Heritage Tour</h3>
                  <p className="font-body-sm text-body-sm text-white/80 mb-2">6 Days | 5 Nights | Private Guide</p>
                  <span className="font-headline-sm text-headline-sm">{mounted ? formatPrice(1150) : '$1,150'}</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Flash Deals Section */}
        <section className="py-stack-lg bg-background transition-colors duration-300">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
            <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-end mb-stack-md gap-2 md:gap-0">
              <div>
                <span className="inline-block bg-error text-white font-label-bold text-[10px] uppercase px-2 py-0.5 rounded-full mb-2">Limited Time</span>
                <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white">Flash Deals</h2>
              </div>
              <a 
                className="text-secondary font-label-bold hover:underline mb-1 flex items-center gap-1" 
                href="https://tp.media/r?marker=734132&trs=534470&p=4110&campaign_id=137&u=https%3A%2F%2Fwww.klook.com%2Fen-US%2Fdeals"
                target="_blank"
                rel="noopener noreferrer"
              >
                View All Deals
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              <a 
                href={`https://www.jetradar.com/search/?marker=734132&origin=NYC&destination=DEL&adults=1&one_way=false&currency=${selectedCountry?.currency?.toUpperCase() || "USD"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-container-lowest dark:bg-surface-container rounded-xl overflow-hidden shadow-lg hover:shadow-primary/10 transition-all border border-outline-variant/20 group block text-left"
              >
                <div className="relative h-48">
                  <Image alt="Agra, India" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNMJlWE3YLiIGsFHz_XYewjC1t0GqauhAOZ-YwrpI2dD90LUeIdXhQcreY3ltt1AuqfQ_VrWnfGkUYUukuaQBVcNjc5CylVX-NdS9PatVbgyrzFoziPmnm_O4Ot8-Crw3jvM_BxkuBq5jADzzxoOXONOQPBj90A6FnUGLCfOPRVtJcoT02w_hy2do6GjmdrIkrfhxZYi_pXarP62211FPgfrGvEMEhBeMkfzLHI1-VEjePyTy7Z-cZNrp8apZ3o_aIyFLdjcJ1MQ" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                  <div className="absolute top-2 left-2 bg-error text-white font-label-bold text-[12px] px-2 py-1 rounded">Save 45%</div>
                </div>
                <div className="p-stack-md">
                  <div className="text-primary text-xs font-label-bold mb-1">FLIGHTS</div>
                  <h3 className="font-title-lg text-title-lg text-on-surface dark:text-white mb-1 group-hover:text-primary transition-colors">New Delhi, India</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-on-surface-variant text-sm">Round trip from NYC</p>
                    <div className="text-right">
                      <span className="block text-outline line-through text-xs">{mounted ? formatPrice(1240) : '$1,240'}</span>
                      <span className="text-secondary font-headline-sm text-headline-sm">{mounted ? formatPrice(680) : '$680'}</span>
                    </div>
                  </div>
                </div>
              </a>
              <a 
                href={`https://tp.media/r?marker=734132&trs=534470&p=1904&campaign_id=31&u=${encodeURIComponent(`https://www.booking.com/searchresults.html?ss=Tokyo&selected_currency=${selectedCountry?.currency?.toUpperCase() || "USD"}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-container-lowest dark:bg-surface-container rounded-xl overflow-hidden shadow-lg hover:shadow-primary/10 transition-all border border-outline-variant/20 group block text-left"
              >
                <div className="relative h-48">
                  <Image alt="Tokyo, Japan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO0PQYh2Nu05evh3TNIYEW2aVaufRIM0LE0N8H1KpgoAtAaX8OgesbBdXDZYz6hJPrLv0XvI8h4VySFVCKyPuqhBpcNnL_CfEboa_FjbfMc0T5aCZJ4fjS-suvQPJZiAuWmtTnLj1Ef6VzPlbAOlAT-TS93DSjRjEn3Tzw2-uCAyLTYQdkQt7WtdzCY50tr09pGnFW_PPw8Tv6LRO5D5Pi3VBD4oehExv3PN4PVWscUcPDIveNAzi48LihlRxeYSRiyIa90wm14w" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                  <div className="absolute top-2 left-2 bg-error text-white font-label-bold text-[12px] px-2 py-1 rounded">Save 30%</div>
                </div>
                <div className="p-stack-md">
                  <div className="text-primary text-xs font-label-bold mb-1">HOTELS</div>
                  <h3 className="font-title-lg text-title-lg text-on-surface dark:text-white mb-1 group-hover:text-primary transition-colors">Tokyo, Japan</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-on-surface-variant text-sm">Luxury Stay / Night</p>
                    <div className="text-right">
                      <span className="block text-outline line-through text-xs">{mounted ? formatPrice(420) : '$420'}</span>
                      <span className="text-secondary font-headline-sm text-headline-sm">{mounted ? formatPrice(294) : '$294'}</span>
                    </div>
                  </div>
                </div>
              </a>
              <a 
                href="https://tp.media/r?marker=734132&trs=534470&p=4110&campaign_id=137&u=https%3A%2F%2Fwww.klook.com%2Fen-US%2Fsearch%3Fquery%3DLondon"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-container-lowest dark:bg-surface-container rounded-xl overflow-hidden shadow-lg hover:shadow-primary/10 transition-all border border-outline-variant/20 group block text-left"
              >
                <div className="relative h-48">
                  <Image alt="London, UK" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAumxqoWuP6v_VQq4T-zO20mMutGw3xEiFHaRm2B62ove9CfNxrxDZWhlZIs6fnwTpmwlqhH7euGiqq4kcHer1nXLXyl4E3Fb5FsF0HFYjSM2JmzaZkq8QugfOYTbVcNq-QILh-rVmamZOLfoGFXCXiucRNo4MHmCwCOjObXqVj5WSGk8GaGdc4w5oS1gSaLs9oxJ8v1LW3QYgNXWSI1eEAndb4fiw2SJ1LyYl8elf1Sb8CJagmCHgr07y6ltlW_ZvKZpP7lvU6jQ" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                  <div className="absolute top-2 left-2 bg-error text-white font-label-bold text-[12px] px-2 py-1 rounded">Save 20%</div>
                </div>
                <div className="p-stack-md">
                  <div className="text-primary text-xs font-label-bold mb-1">BUSES</div>
                  <h3 className="font-title-lg text-title-lg text-on-surface dark:text-white mb-1 group-hover:text-primary transition-colors">London, UK</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-on-surface-variant text-sm">Express Pass</p>
                    <div className="text-right">
                      <span className="block text-outline line-through text-xs">{mounted ? formatPrice(85) : '$85'}</span>
                      <span className="text-secondary font-headline-sm text-headline-sm">{mounted ? formatPrice(68) : '$68'}</span>
                    </div>
                  </div>
                </div>
              </a>
              <a 
                href="https://tp.media/r?marker=734132&trs=534470&p=4110&campaign_id=137&u=https%3A%2F%2Fwww.klook.com%2Fen-US%2Fsearch%3Fquery%3DSantorini"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-container-lowest dark:bg-surface-container rounded-xl overflow-hidden shadow-lg hover:shadow-primary/10 transition-all border border-outline-variant/20 group block text-left"
              >
                <div className="relative h-48">
                  <Image alt="Santorini, Greece" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmA4OIfkVLRYJhvzjXUCpqvRUMJR0GRuF3EZjqzMufc3vorQ7JkBvHs4s1F0vzO1QCFlJmQ6JhCl2lS6f2BABXr0DHsy0n2-HaOTtwkScfS_K1QCI7BQ5IWMUhlZN1Wv7JWhDyjfdwev8Pg5Ag-zeIFJeUrn_7iOeBjpo1_umR7C2BQ29XDxayFXM0lnQ7Z-mrIn-acFYhES_lXC-p525j8Z1gUudLDwFY0i9h8Hah4l2uiHhjod5MYEOg25VKkwNhQsXwKVVGgg" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                  <div className="absolute top-2 left-2 bg-error text-white font-label-bold text-[12px] px-2 py-1 rounded">Save 50%</div>
                </div>
                <div className="p-stack-md">
                  <div className="text-primary text-xs font-label-bold mb-1">CARS</div>
                  <h3 className="font-title-lg text-title-lg text-on-surface dark:text-white mb-1 group-hover:text-primary transition-colors">Santorini, Greece</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-on-surface-variant text-sm">Convertible / Day</p>
                    <div className="text-right">
                      <span className="block text-outline line-through text-xs">{mounted ? formatPrice(110) : '$110'}</span>
                      <span className="text-secondary font-headline-sm text-headline-sm">{mounted ? formatPrice(55) : '$55'}</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Premium Experiences & Activities Section — Powered by Klook Affiliate */}
        <section className="py-stack-lg bg-surface transition-colors duration-300">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
            <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-end mb-stack-md gap-2 md:gap-0">
              <div>
                <span className="inline-block bg-tertiary text-on-tertiary font-label-bold text-[10px] uppercase px-2 py-0.5 rounded-full mb-2">Book Attractions</span>
                <h2 className="font-headline-md text-headline-md text-primary dark:text-white">Unforgettable Tours & Experiences</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Discover skip-the-line tickets, day trips, and premium activities worldwide</p>
              </div>
              <a 
                className="text-secondary font-label-bold hover:underline mb-1 flex items-center gap-1" 
                href="https://tp.media/r?marker=734132&trs=534470&p=4110&u=https%3A%2F%2Fklook.com&campaign_id=137" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Explore All Activities
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {[
                {
                  title: "Tokyo Disneyland & DisneySea",
                  location: "Tokyo, Japan",
                  price: 59,
                  rating: "4.9",
                  reviews: "28k+",
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO0PQYh2Nu05evh3TNIYEW2aVaufRIM0LE0N8H1KpgoAtAaX8OgesbBdXDZYz6hJPrLv0XvI8h4VySFVCKyPuqhBpcNnL_CfEboa_FjbfMc0T5aCZJ4fjS-suvQPJZiAuWmtTnLj1Ef6VzPlbAOlAT-TS93DSjRjEn3Tzw2-uCAyLTYQdkQt7WtdzCY50tr09pGnFW_PPw8Tv6LRO5D5Pi3VBD4oehExv3PN4PVWscUcPDIveNAzi48LihlRxeYSRiyIa90wm14w",
                },
                {
                  title: "Gardens by the Bay Skip-the-Line",
                  location: "Singapore",
                  price: 24,
                  rating: "4.8",
                  reviews: "42k+",
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZk_hEbHaDd9hzMeAvKZFBYDq8pwMVI2eEI-jxf55NMVypigqJIvaU0vsAbJnHa1pk1mg56QvzOIf8rBIEO5VwPcALlO_hka11uaCVnfngXjQCBXlubpD4Q-MRPSzGDRjRL-ee7nkfhLyT_W4Bug8bdCWGUJG8ZRGefDa7FoFakDMQxAT6Z2RLU5p-9XxLfLVdyC-sTqyVq9SfDfScs-mEdYNSoyisHB9dxwHB2VEUkiLQdl0jpt_nuPv9vKYwMOSDB362kbGObA",
                },
                {
                  title: "Eiffel Tower Skip-the-Line Entry",
                  location: "Paris, France",
                  price: 36,
                  rating: "4.7",
                  reviews: "15k+",
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzQ43ledBc6wInXQ32JzONbJXBgWLgagpCZiWxJXswbn6TpWnNdUirAsDQAkpLqYRpqUHq7E0xs-wAWwnJw92B0BURJ2aqpRRqcN8iZWDZXurB_VphJHuzpEWA991NDfAIiLlYjqWkz-T4gBgRrQzV9kr6uiQd2ubvp5qltk6CfrCiyUVENvur1Jt9D5U6_LbzwTSYS12UgQz2eEJrpJXRIyQD9hnXQ1QOLgPCtXjr_YNThhi4uSGYdd5BMkCN0l15dMGnOItciQ",
                },
                {
                  title: "Burj Khalifa Observation Deck",
                  location: "Dubai, UAE",
                  price: 45,
                  rating: "4.8",
                  reviews: "34k+",
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLvqqiOSSccRkLSBnr0ubyvyogvnNxpFDXvKFKrxNiZ4gsTTAd3Qxalb_7HNyYMTf4OjbHfPMQD-k6rqAesFUx--sERu-oh37NUq9s4qt8Dlo_FfTas3yyrLk3QWgeIHKt4cO2LbVqC_Qj7rlQrkGu9SrMVZ8MQnxJf6G8afFuiKUCxGsS33sMFtpdhF-3uEnLpgW3pc_X8Js3o_o40AGY4Ue_uZy87fQD4cq1vdQ9abeeDumBnNz45RC2lt6TxNPGcdgxPMe6sg",
                },
              ].map((activity, idx) => {
                // Dynamically route deep link to the exact activity query on Klook via Travelpayouts
                const klookTarget = encodeURIComponent(`https://www.klook.com/en-US/search?query=${encodeURIComponent(activity.title)}`);
                const affiliateLink = `https://tp.media/r?marker=734132&trs=534470&p=4110&campaign_id=137&u=${klookTarget}`;

                return (
                  <a 
                    key={idx} 
                    href={affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-container-lowest dark:bg-surface-container rounded-xl overflow-hidden shadow-lg hover:shadow-primary/10 transition-all border border-outline-variant/20 group flex flex-col h-full"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image 
                        alt={activity.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        src={activity.image} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute top-2 left-2 bg-secondary text-white font-label-bold text-[10px] px-2 py-0.5 rounded shadow">
                        ★ {activity.rating} ({activity.reviews})
                      </div>
                    </div>
                    <div className="p-stack-md flex flex-col justify-between flex-grow">
                      <div>
                        <div className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-1">{activity.location}</div>
                        <h3 className="font-title-lg text-title-md text-on-surface dark:text-white mb-stack-sm leading-snug group-hover:text-primary transition-colors">
                          {activity.title}
                        </h3>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-outline-variant/10">
                        <div className="text-xs text-outline">from <span className="font-headline-sm text-secondary text-base">{mounted ? formatPrice(activity.price) : `$${activity.price}`}</span></div>
                        <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1.5 rounded-lg group-hover:bg-primary group-hover:text-on-primary transition-all flex items-center gap-0.5">
                          Book Now
                          <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>



        {/* Trending Destinations (Bento Grid) */}
        <section className="py-stack-lg bg-surface transition-colors duration-300">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white mb-stack-md">Trending Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
              <a 
                href={`https://www.jetradar.com/search/?marker=734132&destination=CDG&currency=${selectedCountry?.currency?.toUpperCase() || "USD"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-64 md:h-auto md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group shadow-lg block text-left"
              >
                <Image alt="Paris, France" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzQ43ledBc6wInXQ32JzONbJXBgWLgagpCZiWxJXswbn6TpWnNdUirAsDQAkpLqYRpqUHq7E0xs-wAWwnJw92B0BURJ2aqpRRqcN8iZWDZXurB_VphJHuzpEWA991NDfAIiLlYjqWkz-T4gBgRrQzV9kr6uiQd2ubvp5qltk6CfrCiyUVENvur1Jt9D5U6_LbzwTSYS12UgQz2eEJrpJXRIyQD9hnXQ1QOLgPCtXjr_YNThhi4uSGYdd5BMkCN0l15dMGnOItciQ" fill sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <h3 className="font-headline-md text-headline-md">Paris, France</h3>
                  <p className="font-body-sm text-body-sm text-white/80 dark:text-on-surface-variant">Find flights from {mounted ? formatPrice(340) : '$340'}</p>
                </div>
              </a>
              <a 
                href={`https://tp.media/r?marker=734132&trs=534470&p=1904&campaign_id=31&u=${encodeURIComponent(`https://www.booking.com/searchresults.html?ss=Bali&selected_currency=${selectedCountry?.currency?.toUpperCase() || "USD"}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-64 md:h-auto md:col-span-2 md:row-span-1 relative rounded-2xl overflow-hidden group shadow-lg block text-left"
              >
                <Image alt="Bali, Indonesia" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ8NftmweEOGmVksURWdeNBy5u4lX8WxoWeNLfpBdkmSdflTWPHj3La0FozDtsDoUqf9AjSbxDX9-kcaMt6GNL5NOmX2pyTTmUS_L69JHRDpCe2EAbWJa2WuChU8qmT91HaXnodS0UaGT1z1we0J6RJIJfiYV2CFdtB2GyEMru_0z69BJnAJry8R9VnmkiSgAot-N3klB9frt1jL3r8kRk2cOxIHGVlBPi1fqymOUiME5Uprdvr3G3dpbb7NisIFzt4coRaeQbgQ" fill sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <h3 className="font-title-lg text-title-lg">Bali, Indonesia</h3>
                  <p className="font-body-sm text-body-sm text-white/80 dark:text-on-surface-variant">Resorts starting at {mounted ? formatPrice(89) : '$89'}</p>
                </div>
              </a>
              <a 
                href="https://tp.media/r?marker=734132&trs=534470&p=4110&campaign_id=137&u=https%3A%2F%2Fwww.klook.com%2Fen-US%2Fsearch%3Fquery%3DRome"
                target="_blank"
                rel="noopener noreferrer"
                className="h-48 md:h-auto md:col-span-1 md:row-span-1 relative rounded-2xl overflow-hidden group shadow-lg block text-left"
              >
                <Image alt="Rome, Italy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw6xGyjCfbpXCblSYq7hUwRZVmHFFufM7Tal36kxMjkuKwEymGKb9LW7U15SgRvKh8ozy9Dy4fFubHw9lkgNpZc35MjDQOazHIjo2splltCOOKHKNj3ZI0krdZu7R3T5oNXpbaQgMT_5uJNfkQWmaFDZy3lmJRwN9kRLnkju9t76SY8Yqk8nHcjYF-PzB1Wv6fLMToHBZQ8YQATa_yydDGVTMpfmXswf_UTNuEbvlx2syuwef-3GpKWMeVstaUHxyuJIyF138ymw" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white text-left">
                  <h3 className="font-title-lg text-title-lg">Rome, Italy</h3>
                  <p className="font-body-sm text-body-sm text-white/80 dark:text-on-surface-variant">Europe tours from {mounted ? formatPrice(120) : '$120'}</p>
                </div>
              </a>
              <a 
                href={`https://search.hotellook.com/?marker=734132&destination=Dubai&currency=${selectedCountry?.currency?.toLowerCase() || "usd"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-48 md:h-auto md:col-span-1 md:row-span-1 relative rounded-2xl overflow-hidden group shadow-lg block text-left"
              >
                <Image alt="Dubai, UAE" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLvqqiOSSccRkLSBnr0ubyvyogvnNxpFDXvKFKrxNiZ4gsTTAd3Qxalb_7HNyYMTf4OjbHfPMQD-k6rqAesFUx--sERu-oh37NUq9s4qt8Dlo_FfTas3yyrLk3QWgeIHKt4cO2LbVqC_Qj7rlQrkGu9SrMVZ8MQnxJf6G8afFuiKUCxGsS33sMFtpdhF-3uEnLpgW3pc_X8Js3o_o40AGY4Ue_uZy87fQD4cq1vdQ9abeeDumBnNz45RC2lt6TxNPGcdgxPMe6sg" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white text-left">
                  <h3 className="font-title-lg text-title-lg">Dubai, UAE</h3>
                  <p className="font-body-sm text-body-sm text-white/80 dark:text-on-surface-variant">Hotels from {mounted ? formatPrice(150) : '$150'}</p>
                </div>
              </a>
            </div>
          </div>
        </section>
    

      <Footer />

      <AIAssistantFAB />
    </>
  );
}
