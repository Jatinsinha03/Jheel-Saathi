"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#bbdde1] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-[#eef6f9] shadow">
        <h1 className="text-2xl font-bold text-[#3d73a1]">Jheel Saathi</h1>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-[#3d73a1] font-medium">
                Welcome, {user.username}!
              </span>
              <button 
                onClick={logout}
                className="px-4 py-2 rounded-lg border border-[#3d73a1] text-[#3d73a1] hover:bg-blue-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="px-4 py-2 rounded-lg border border-[#3d73a1] text-[#3d73a1] hover:bg-blue-50 transition">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 rounded-lg bg-[#3d73a1] text-white hover:bg-[#1d4ed8] transition">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col md:flex-row items-center justify-between px-10 py-16 fade-up">
        <div className="max-w-lg">
          <h2 className="text-4xl font-semibold text-[#0f172a] leading-tight">
            Understand the Ecological Health of Your Lakes
          </h2>
          <p className="mt-4 text-lg text-[#334155]">
            A community platform empowering citizens to assess neighborhood water bodies.
          </p>
          <button className="mt-6 px-6 py-3 bg-[#3d73a1] text-white rounded-lg shadow hover:bg-[#1d4ed8] transition">
            Get Started
          </button>
        </div>
        <div className="w-full h-64 md:h-80 bg-[#e2e8f0] rounded-xl mt-8 md:mt-0 md:ml-10 flex items-center justify-center">
        <img 
          src="/first.jpg" 
          alt="Lake illustration" 
          className="object-cover w-full h-full rounded-xl" 
        />
        </div>
      </header>

      {/* Features Section */}
      <section className="px-10 py-12 bg-[#eef6f9] fade-left">
        <h3 className="text-2xl font-bold text-[#3d73a1] mb-6">Answer Simple Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg bg-[#bbdde1] shadow-sm hover:shadow-md transition">
            <div className="w-full h-32 bg-[#e2e8f0] rounded mb-4 flex items-center justify-center">
            <img 
              src="/second.jpg" 
              alt="Lake illustration" 
              className="object-cover w-full h-full rounded-xl" 
            />
            </div>
            <h4 className="text-lg font-semibold text-[#1e293b]">Water clarity</h4>
            <p className="text-[#64748b] text-sm">How clear is the water?</p>
          </div>

          <div className="p-6 border rounded-lg bg-[#bbdde1] shadow-sm hover:shadow-md transition">
            <div className="w-full h-32 bg-[#e2e8f0] rounded mb-4 flex items-center justify-center">
            <img 
              src="/third.jpg" 
              alt="Lake illustration" 
              className="object-cover w-full h-full rounded-xl" 
            />
            </div>
            <h4 className="text-lg font-semibold text-[#1e293b]">Biodiversity presence</h4>
            <p className="text-[#64748b] text-sm">What wildlife is present?</p>
          </div>

          <div className="p-6 border rounded-lg bg-[#bbdde1] shadow-sm hover:shadow-md transition">
            <div className="w-full h-32 bg-[#e2e8f0] rounded mb-4 flex items-center justify-center">
            <img 
              src="/fourth.png" 
              alt="Lake illustration" 
              className="object-cover w-full h-full rounded-xl" 
            />
            </div>
            <h4 className="text-lg font-semibold text-[#1e293b]">Vegetation around the lake</h4>
            <p className="text-[#64748b] text-sm">Is there vegetation nearby?</p>
          </div>
        </div>
      </section>

      {/* New Interactive Section */}
      <section className="px-10 py-16 bg-[#bbdde1] ">
      <h3 className="text-3xl font-bold text-[#0f172a] mb-10 text-center">Explore & Contribute</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Interactive Map */}
        <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col justify-between">
          <div>
            <h4 className="text-xl font-semibold text-[#3d73a1] mb-3">Interactive Map</h4>
            <p className="text-[#475569] text-sm mb-6">
              View all lakes on an interactive map. Click on any lake to begin a questionnaire and assess its ecological health.
            </p>
          </div>
          <button className="mt-auto px-4 py-2 bg-[#3d73a1] text-white rounded-lg shadow hover:bg-[#1d4ed8] transition">
            <Link href="/">
            Open Map
            </Link>
          </button>
        </div>

        {/* Add a Water Body */}
        <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col justify-between">
          <div>
            <h4 className="text-xl font-semibold text-[#3d73a1] mb-3">Add a Water Body</h4>
            <p className="text-[#475569] text-sm mb-6">
              Use your current location to add new lakes, ponds, or water bodies that are not yet on the map.
            </p>
          </div>
          <button className="mt-auto px-4 py-2 bg-[#3d73a1] text-white rounded-lg shadow hover:bg-[#1d4ed8] transition">
            <Link href="/">
            Add Water Body
            </Link>
          </button>
        </div>

        {/* Leaderboard */}
        <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col justify-between">
          <div>
            <h4 className="text-xl font-semibold text-[#3d73a1] mb-3">Leaderboard</h4>
            <p className="text-[#475569] text-sm mb-6">
              Track contributions and see who has completed the most reviews in your community.
            </p>
          </div>
          <button className="mt-auto px-4 py-2 bg-[#3d73a1] text-white rounded-lg shadow hover:bg-[#1d4ed8] transition">
            <Link href="/leaderboard">
            View Leaderboard
            </Link>
          </button>
        </div>
      </div>
    </section>


      {/* Footer */}
      <footer className="px-10 py-6 bg-[#eef6f9] shadow-inner text-center text-[#3d73a1] text-sm">
        © {new Date().getFullYear()} Jheel Saathi. All rights reserved.
      </footer>
    </div>
  );
}
