import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Home: FC = () => {
  const navigate = useNavigate();

  const handlePageClick = () => {
    navigate("/overview");
  };

  // Add animation classes when component mounts
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-on-load');
    
    setTimeout(() => {
      animatedElements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('animate-visible');
        }, index * 150);
      });
    }, 100);
  }, []);

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212] cursor-pointer"
      onClick={handlePageClick}
    >
      {/* Logo at top center */}
      <div className="flex justify-center pt-10">
        <div className="hover:scale-110 animate-on-load opacity-0 translate-y-4 transform transition-all duration-500 ease-out animate-visible:opacity-100 animate-visible:translate-y-0 animate-float">
          <img src="/derive.png" alt="Dérive Logo" className="h-32 w-32" />
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:px-8 lg:pt-16 lg:pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
            <span className="block animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-100 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">Derive</span>
            <span className="block bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-200 ease-out animate-visible:opacity-100 animate-visible:translate-y-0 md:px-8 sm:text-5xl md:text-6xl">
              IP Management Platform
            </span>
          </h1>
          <p className="mx-auto mt-10 max-w-2xl text-xl text-gray-300 animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-300 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
            Streamline your intellectual property management with powerful tools for rights distribution, submission tracking, and royalty management.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-purple-300 animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-400 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
            Get started today and take control of your intellectual property assets.
          </p>
          <div className="mt-10 flex justify-center gap-4 animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-500 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/overview");
              }}
              className="rounded-md bg-purple-600 px-8 py-3 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 hover:scale-105"
            >
              Launch App
              <svg
                className="ml-2 -mr-1 h-5 w-5 inline"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <a
              href="#features"
              onClick={(e) => e.stopPropagation()}
              className="rounded-md border border-gray-700 bg-transparent px-8 py-3 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-[#0F0F0F] py-8" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Powerful IP Management Tools
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-400">
              Everything you need to manage your intellectual property in one place
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-100 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/30 transition-all duration-300 hover:scale-110">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white">Submission Tracking</h3>
              <p className="mt-2 text-gray-400">
                Track all your IP submissions in real-time with detailed analytics and verification status.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-200 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/30 transition-all duration-300 hover:scale-110">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white">Rights Distribution</h3>
              <p className="mt-2 text-gray-400">
                Manage and distribute rights across different categories with transparent allocation and tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-300 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-900/30 transition-all duration-300 hover:scale-110">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white">Royalty Management</h3>
              <p className="mt-2 text-gray-400">
                Automate royalty calculations and distributions with detailed reporting and transparent transactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal footer */}
      <div className="py-2 text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} Derive
      </div>
    </div>
  );
};
