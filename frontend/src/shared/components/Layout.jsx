import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-background text-gray-900 m-0 p-0 font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar className="z-10" />
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}