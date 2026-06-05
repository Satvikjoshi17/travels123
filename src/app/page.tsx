"use client";

import Image from "next/image";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CurrencySelector } from "@/components/CurrencySelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AIAssistantFAB } from "@/components/AIAssistantFAB";
import { SearchWidget } from "@/components/SearchWidget";
import { ExploreFlightsSection } from "@/components/ExploreFlightsSection";
import { useEffect, useState } from "react";

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

      <main className="pt-[104px] md:pt-[88px] pb-20 md:pb-0">
        {/* Hero Section with Search Widget */}
        <section className="relative min-h-[700px] md:min-h-[580px] flex flex-col items-center justify-center pt-8 pb-16 z-10 bg-gradient-to-b from-[#002244] via-[#003366] to-[#004080]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "3s" }} />
          </div>

          <div className="relative z-10 w-full max-w-[1300px] px-4 md:px-6 text-center mb-6 animate-fade-in mx-auto">
            <h1 className="text-[clamp(24px,5vw,42px)] leading-[1.2] font-bold text-white mb-3 drop-shadow-lg">Your Smartest Way to Travel</h1>
            <p className="text-[13px] md:text-base text-white/80 mb-8 max-w-2xl mx-auto drop-shadow-md">Search and compare over 100+ travel sites in seconds. Get the best prices, guaranteed.</p>

            {/* Search Widget */}
            <SearchWidget />
          </div>
        </section>


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
                href="https://tp.media/r?marker=734132&trs=534470&p=1904&campaign_id=31&u=https%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Fss%3DMaldives"
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
                href="https://www.jetradar.com/search/?marker=734132&origin=NYC&destination=DEL&adults=1&one_way=false"
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
                href="https://tp.media/r?marker=734132&trs=534470&p=1904&campaign_id=31&u=https%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Fss%3DTokyo"
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

        {/* Live Flight Deals — Powered by Skyscanner API */}
        <ExploreFlightsSection />

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

        {/* Comprehensive Travel Insurance Section */}
        <section className="py-stack-lg bg-surface-container-low dark:bg-surface-container transition-colors duration-300">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
              <div>
                <span className="inline-block bg-secondary text-white font-label-bold text-[10px] uppercase px-2 py-0.5 rounded-full mb-2">Worry-Free Travel</span>
                <h2 className="font-headline-md text-headline-md text-primary dark:text-white mb-stack-sm">Comprehensive Travel Insurance</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-white/80 mb-stack-md">Protect your trip from the unexpected. Our insurance partners provide global coverage for medical emergencies, trip cancellations, and lost luggage.</p>
                <div className="space-y-stack-sm mb-stack-md">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                    <span className="font-body-lg text-on-surface dark:text-white">24/7 Global Assistance Hotline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                    <span className="font-body-lg text-on-surface dark:text-white">Medical Coverage up to {mounted ? formatPrice(1000000) : '$1,000,000'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                    <span className="font-body-lg text-on-surface dark:text-white">Flexible Cancellation Policies</span>
                  </div>
                </div>
                <button className="bg-primary text-on-primary dark:text-background px-stack-lg py-stack-md rounded-lg font-headline-sm text-headline-sm hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">Get a Quote Now</button>
              </div>
              
              <div className="relative flex justify-center mt-10 lg:mt-0 overflow-hidden md:overflow-visible p-10 -m-10">
                <div className="absolute top-0 md:-top-10 left-0 md:-left-10 w-40 h-40 bg-secondary/20 dark:bg-secondary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 md:-bottom-10 right-0 md:-right-10 w-60 h-60 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl"></div>
                <div className="bg-surface-container-lowest dark:bg-surface-container-high p-stack-lg rounded-2xl shadow-xl border border-outline-variant/30 relative z-10 w-full max-w-md">
                  <div className="flex items-center justify-between mb-stack-md">
                    <div className="flex items-center gap-stack-sm">
                      <div className="bg-secondary/10 p-2 rounded-full">
                        <span className="material-symbols-outlined text-secondary">security</span>
                      </div>
                      <span className="font-label-bold text-label-bold text-primary dark:text-white">GlobeTrek Protect+</span>
                    </div>
                    <span className="text-xs text-outline">Partnered with Allianz</span>
                  </div>
                  <div className="space-y-stack-md">
                    <div className="p-3 bg-surface dark:bg-surface-container rounded-lg flex justify-between items-center">
                      <span className="font-body-sm text-on-surface-variant dark:text-white/80">Standard Plan</span>
                      <span className="font-label-bold text-secondary">{mounted ? formatPrice(2.5) : '$2.50'} / day</span>
                    </div>
                    <div className="p-3 bg-primary-container/10 border-2 border-primary-container rounded-lg flex justify-between items-center relative">
                      <span className="font-body-sm text-on-surface-variant dark:text-white/80">Platinum Elite</span>
                      <span className="font-label-bold text-primary dark:text-primary-container">{mounted ? formatPrice(5.2) : '$5.20'} / day</span>
                      <span className="absolute -top-2 right-4 bg-tertiary text-on-tertiary text-[10px] px-2 rounded-full">MOST POPULAR</span>
                    </div>
                    <div className="p-3 bg-surface dark:bg-surface-container rounded-lg flex justify-between items-center">
                      <span className="font-body-sm text-on-surface-variant dark:text-white/80">Family Bundle</span>
                      <span className="font-label-bold text-secondary">{mounted ? formatPrice(12) : '$12.00'} / day</span>
                    </div>
                  </div>
                  <p className="mt-4 text-[10px] text-outline text-center">Terms and conditions apply. Policy underwritten by verified carriers.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Destinations (Bento Grid) */}
        <section className="py-stack-lg bg-surface transition-colors duration-300">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white mb-stack-md">Trending Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
              <a 
                href="https://www.jetradar.com/search/?marker=734132&destination=CDG"
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
                href="https://tp.media/r?marker=734132&trs=534470&p=1904&campaign_id=31&u=https%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Fss%3DBali"
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
                href="https://search.hotellook.com/?marker=734132&destination=Dubai"
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
      </main>

      <Footer />

      <AIAssistantFAB />
    </>
  );
}
