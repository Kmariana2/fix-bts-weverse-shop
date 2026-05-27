"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, ChevronDown, MapPin, Calendar, Users, Music } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const btsMembers = [
  { name: "RM", fullName: "Kim Namjoon", role: "Leader, Rapper" },
  { name: "Jin", fullName: "Kim Seokjin", role: "Vocalist" },
  { name: "SUGA", fullName: "Min Yoongi", role: "Rapper" },
  { name: "j-hope", fullName: "Jung Hoseok", role: "Rapper, Dancer" },
  { name: "Jimin", fullName: "Park Jimin", role: "Vocalist, Dancer" },
  { name: "V", fullName: "Kim Taehyung", role: "Vocalist" },
  { name: "Jung Kook", fullName: "Jeon Jungkook", role: "Vocalist, Dancer" },
];

const usaTourCities2026 = [
  { city: "Los Angeles", venue: "SoFi Stadium", dates: "Jun 14-15, 2026", status: "sold-out" },
  { city: "Las Vegas", venue: "Allegiant Stadium", dates: "Jun 21-22, 2026", status: "available" },
  { city: "Dallas", venue: "AT&T Stadium", dates: "Jun 28-29, 2026", status: "available" },
  { city: "Chicago", venue: "Soldier Field", dates: "Jul 5-6, 2026", status: "limited" },
  { city: "Atlanta", venue: "Mercedes-Benz Stadium", dates: "Jul 12-13, 2026", status: "available" },
  { city: "Miami", venue: "Hard Rock Stadium", dates: "Jul 19-20, 2026", status: "available" },
  { city: "New York", venue: "MetLife Stadium", dates: "Jul 26-27, 2026", status: "limited" },
  { city: "Boston", venue: "Gillette Stadium", dates: "Aug 1-2, 2026", status: "available" },
];

const mainTabs = [
  { name: "'RANG' Pickup", active: true },
  { name: "Album", active: false },
  { name: "Tour Merch", active: false },
  { name: "BT21", active: false },
  { name: "Merch", active: false },
  { name: "LIVE", active: false },
];

export default function Header() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [artistDropdownOpen, setArtistDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("'RANG' Pickup");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setArtistDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        {/* Logo + Dropdown Trigger */}
        <div className="flex items-center gap-1" ref={dropdownRef}>
          <Link href="/" className="flex items-center gap-2" onClick={() => triggerHaptic()}>
            <div className="w-9 h-9 bg-[#00B8D4] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base">W</span>
            </div>
            <span className="font-bold text-lg tracking-tight">BTS</span>
          </Link>
          
          {/* Dropdown Toggle */}
          <button
            onClick={() => {
              setArtistDropdownOpen(!artistDropdownOpen);
              triggerHaptic();
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronDown 
              size={18} 
              className={`text-gray-600 transition-transform duration-200 ${artistDropdownOpen ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Dropdown Menu */}
          {artistDropdownOpen && (
            <div className="absolute top-full left-4 mt-2 w-[340px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              {/* Members Section */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Music size={14} className="text-[#00B8D4]" />
                  <span className="text-xs font-semibold text-gray-400 uppercase">Members</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {btsMembers.map((member) => (
                    <button
                      key={member.name}
                      onClick={() => triggerHaptic()}
                      className="flex flex-col items-center p-1.5 rounded-xl hover:bg-[#00B8D4]/10 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00B8D4] to-[#00838F] rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-xs">{member.name.charAt(0)}</span>
                      </div>
                      <span className="text-[10px] font-medium text-gray-700 group-hover:text-[#00B8D4] truncate w-full text-center">{member.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tour Cities Section */}
              <div className="p-4 max-h-[280px] overflow-y-auto">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-[#00B8D4]" />
                  <span className="text-xs font-semibold text-gray-400 uppercase">2026 USA Tour - Remaining Cities</span>
                </div>
                <div className="space-y-2">
                  {usaTourCities2026.map((tour) => (
                    <button
                      key={tour.city}
                      onClick={() => triggerHaptic()}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                          <MapPin size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{tour.city}</p>
                          <p className="text-[11px] text-gray-500">{tour.venue}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1">
                          <Calendar size={10} />
                          <span>{tour.dates}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          tour.status === "sold-out" 
                            ? "bg-red-100 text-red-600" 
                            : tour.status === "limited"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-600"
                        }`}>
                          {tour.status === "sold-out" ? "SOLD OUT" : tour.status === "limited" ? "LIMITED" : "AVAILABLE"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsOpen(true);
              triggerHaptic();
            }}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#00B8D4] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              triggerHaptic();
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto hide-scrollbar">
        <div className="flex items-center px-2 min-w-max">
          {mainTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                triggerHaptic();
              }}
              className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.name
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.name}
              {activeTab === tab.name && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-black rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[108px] bg-white z-40 overflow-y-auto pb-20">
          {/* Artist Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#00B8D4] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <p className="font-bold text-lg">BTS</p>
                <p className="text-xs text-gray-500">ARIRANG World Tour 2026</p>
              </div>
            </div>

            <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2 tracking-wider">Members</p>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {btsMembers.map((member) => (
                <button
                  key={member.name}
                  onClick={() => triggerHaptic()}
                  className="flex flex-col items-center p-1"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00B8D4] to-[#00838F] rounded-full flex items-center justify-center mb-1">
                    <span className="text-white font-bold text-xs">{member.name.charAt(0)}</span>
                  </div>
                  <span className="text-[9px] font-medium truncate w-full text-center">{member.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tour Cities */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase mb-3 tracking-wider">2026 USA Tour - Remaining Cities</p>
            <div className="space-y-2">
              {usaTourCities2026.map((tour) => (
                <button
                  key={tour.city}
                  onClick={() => triggerHaptic()}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 active:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-[#00B8D4]" />
                    <div className="text-left">
                      <p className="font-semibold text-sm">{tour.city}</p>
                      <p className="text-[11px] text-gray-500">{tour.dates}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                    tour.status === "sold-out" 
                      ? "bg-red-100 text-red-600" 
                      : tour.status === "limited"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-600"
                  }`}>
                    {tour.status === "sold-out" ? "SOLD OUT" : tour.status === "limited" ? "LIMITED" : "ON SALE"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Shop Navigation */}
          <div className="p-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase mb-3 tracking-wider">Shop</p>
            <div className="space-y-1">
              {mainTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setMobileMenuOpen(false);
                    triggerHaptic();
                  }}
                  className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-colors ${
                    activeTab === tab.name
                      ? "bg-[#00B8D4] text-white"
                      : "hover:bg-gray-100 active:bg-gray-200"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <button onClick={() => triggerHaptic()} className="hover:text-black">Help</button>
              <button onClick={() => triggerHaptic()} className="hover:text-black">Orders</button>
              <button onClick={() => triggerHaptic()} className="hover:text-black">Account</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
