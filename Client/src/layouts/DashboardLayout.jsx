import React, { useState } from 'react';
import mojazLogo from '../assets/logo.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Heroicons clipboard-list SVG
const ActivitiesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h3.5a1.5 1.5 0 003 0H17a2 2 0 012 2v12a2 2 0 01-2 2z" />
  </svg>
);
// Heroicons table SVG
const TableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 0A2.25 2.25 0 003 7.5v9a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 16.5v-9a2.25 2.25 0 00-2.25-2.25m-16.5 0V7.5m16.5-2.25V7.5m-16.5 0h16.5m-16.5 0v9m16.5-9v9m-16.5 0h16.5" />
  </svg>
);
// Report (document) icon SVG
const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75h9A2.25 2.25 0 0118.75 6v12A2.25 2.25 0 0116.5 20.25h-9A2.25 2.25 0 015.25 18V6A2.25 2.25 0 017.5 3.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25h6m-6 3h6m-6 3h3" />
  </svg>
);

const SurveillanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V7.125A2.625 2.625 0 015.625 4.5h12.75A2.625 2.625 0 0121 7.125V13.5m-18 0v3.375A2.625 2.625 0 005.625 19.5h12.75A2.625 2.625 0 0021 16.875V13.5m-18 0h18" />
  </svg>
);

const StatusReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const DashboardLayout = ({ children, role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} h-screen fixed left-0 top-0 z-10 flex flex-col items-center py-4 bg-[#232334] shadow-lg transition-all duration-300 ease-in-out`}>
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-2 bg-[#36a9e1] text-white p-1 rounded-sm hover:bg-[#5bc0ee] transition-colors duration-200"
        >
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
            </svg>
          )}
        </button>

        {/* Logo */}
        {sidebarOpen ? (
          <img src={mojazLogo} alt="MOJAZ Support Program Logo" className="h-12 w-auto mb-4 mt-8" />
        ) : (
          <img src={mojazLogo} alt="MOJAZ Support Program Logo" className="h-8 w-auto mb-4 mt-8" />
        )}

        <nav className="w-full flex-1 overflow-y-auto">
          <ul className="space-y-3 w-full px-3">
            <li>
              <Link
                to="/cctv-report"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-sm font-medium transition-colors duration-200 text-sm
                  ${location.pathname === '/cctv-report'
                    ? 'bg-[#36a9e1] text-white shadow'
                    : 'text-gray-400 hover:bg-[#5bc0ee] hover:text-white'}`}
                title={!sidebarOpen ? "Add Activities" : ""}
              >
                <ActivitiesIcon />
                {sidebarOpen && <span>Add Activities</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/activities-report"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-sm font-medium transition-colors duration-200 text-sm
                  ${location.pathname === '/activities-report'
                    ? 'bg-[#36a9e1] text-white shadow'
                    : 'text-gray-400 hover:bg-[#5bc0ee] hover:text-white'}`}
                title={!sidebarOpen ? "Activities Report" : ""}
              >
                {/* Document with lines inside a circle icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-5 h-5">
                  <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="3" fill="none"/>
                  <rect x="13" y="12" width="22" height="24" fill="currentColor"/>
                  <rect x="17" y="18" width="14" height="2" rx="1" fill="white"/>
                  <rect x="17" y="22" width="14" height="2" rx="1" fill="white"/>
                  <rect x="17" y="26" width="14" height="2" rx="1" fill="white"/>
                  <rect x="17" y="30" width="14" height="2" rx="1" fill="white"/>
                  <polygon points="31,12 35,16 31,16" fill="white"/>
                </svg>
                {sidebarOpen && <span>Activities Report</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/daily-surveillance-status"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-sm font-medium transition-colors duration-200 text-sm
                  ${location.pathname === '/daily-surveillance-status'
                    ? 'bg-[#36a9e1] text-white shadow'
                    : 'text-gray-400 hover:bg-[#5bc0ee] hover:text-white'}`}
                title={!sidebarOpen ? "Add Status" : ""}
              >
                <ActivitiesIcon />
                {sidebarOpen && <span>Add Status</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/daily-surveillance-status-report"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-sm font-medium transition-colors duration-200 text-sm
                  ${location.pathname === '/daily-surveillance-status-report'
                    ? 'bg-[#36a9e1] text-white shadow'
                    : 'text-gray-400 hover:bg-[#5bc0ee] hover:text-white'}`}
                title={!sidebarOpen ? "Status Report" : ""}
              >
                {/* Status report document with heartbeat/status line icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-5 h-5">
                  <rect x="8" y="8" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="14" y="14" width="16" height="2" fill="currentColor"/>
                  <rect x="14" y="19" width="16" height="2" fill="currentColor"/>
                  <path d="M14 26h7l2 4 3-8h4" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="36" cy="30" r="3" fill="currentColor"/>
                </svg>
                {sidebarOpen && <span>Status Report</span>}
              </Link>
            </li>
            {role === 'admin' && (
              <li>
                <Link
                  to="/change-password"
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-sm font-medium transition-colors duration-200 text-sm
                    ${location.pathname === '/change-password'
                      ? 'bg-[#36a9e1] text-white shadow'
                      : 'text-gray-400 hover:bg-[#5bc0ee] hover:text-white'}`}
                  title={!sidebarOpen ? "Change Password" : ""}
                >
                  {/* Lock with circular arrow and asterisks icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-5 h-5">
                    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
                    <path d="M24 16a4 4 0 0 1 4 4v4h-8v-4a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <rect x="18" y="24" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M24 28v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 12a18 18 0 0 1 28 6" stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
                    <text x="24" y="40" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace" fontWeight="bold">****</text>
                    <defs>
                      <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L6,3 z" fill="currentColor" />
                      </marker>
                    </defs>
                  </svg>
                  {sidebarOpen && <span>Change Password</span>}
                </Link>
              </li>
            )}
            {role === 'admin' && (
              <li>
                <Link
                  to="/add-user"
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-sm font-medium transition-colors duration-200 text-sm
                    ${location.pathname === '/add-user'
                      ? 'bg-[#36a9e1] text-white shadow'
                      : 'text-gray-400 hover:bg-[#5bc0ee] hover:text-white'}`}
                  title={!sidebarOpen ? "Add User" : ""}
                >
                  {/* User silhouette with circular plus icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-5 h-5">
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2"/>
                    <path d="M20 26c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z" fill="currentColor"/>
                    <circle cx="20" cy="16" r="6" fill="currentColor"/>
                    <circle cx="36" cy="36" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M36 32v8M32 36h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {sidebarOpen && <span>Add User</span>}
                </Link>
              </li>
            )}
          </ul>
        </nav>
        
        {/* Logout Button */}
        {sidebarOpen ? (
          <button
            onClick={handleLogout}
            className="mb-2 w-5/6 flex items-center shadow rounded overflow-hidden"
          >
            {/* Left square with lock icon */}
            <span className="flex items-center justify-center bg-[#5bc0ee] w-12 h-8">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" className="w-6 h-6">
                <rect x="8" y="14" width="16" height="10" rx="2" fill="white"/>
                <path d="M12 14v-3a4 4 0 1 1 8 0v3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="16" cy="19" r="1.5" fill="#4a90a4"/>
              </svg>
            </span>
            {/* Right rectangle with text */}
            <span className="flex-1 bg-[#2494be] h-8 flex items-center pl-4 font-medium text-white tracking-widest text-sm">
              LOGOUT
            </span>
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="mb-2 w-10 h-8 bg-[#5bc0ee] rounded flex items-center justify-center hover:bg-[#36a9e1] transition-colors duration-200"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" className="w-5 h-5">
              <rect x="8" y="14" width="16" height="10" rx="2" fill="white"/>
              <path d="M12 14v-3a4 4 0 1 1 8 0v3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="16" cy="19" r="1.5" fill="#4a90a4"/>
            </svg>
          </button>
        )}
      </aside>
      
      {/* Main Content */}
      <main className={`flex-1 text-black min-h-screen overflow-x-auto overflow-y-auto transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-56' : 'ml-16'}`}>
        {/* Header Area */}
        <div className="bg-[#1a1a2e] text-white px-6 py-4 border-b border-[#36a9e1]">
          <div className="flex items-center justify-center">
            <h1 className="text-lg font-semibold">MOJAZ SUPPORT PROGRAM</h1>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-8 bg-gray-50 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 