import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopGovBar } from '../common/TopGovBar';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F8] text-[#1B1C1C]">
      {/* Institutional Banner */}
      <TopGovBar />
      
      {/* Sticky Main Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8">
        <Outlet />
      </main>

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
};
