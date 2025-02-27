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
      className="min-h-screen bg-[#0A0A0A] cursor-pointer relative overflow-hidden w-full"
      onClick={handlePageClick}
      style={{ margin: 0, padding: 0 }}
    >
      {/* Content container */}
      <div className="relative z-10 w-full">
        {/* Logo at top center */}
        <div className="flex justify-center pt-14">
          <div className="hover:scale-110 animate-on-load opacity-0 translate-y-4 transform transition-all duration-500 ease-out animate-visible:opacity-100 animate-visible:translate-y-0 animate-float">
            <img src="/derive.png" alt="Dérive Logo" className="h-32 w-32" />
          </div>
        </div>
        
        {/* Hero Section */}
        <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:px-8 lg:pt-16 lg:pb-16">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
              <span className="block animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-100 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">Derive</span>
              <span className="block bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-200 ease-out animate-visible:opacity-100 animate-visible:translate-y-0 md:px-8 sm:text-5xl md:text-6xl mb-10">
                IP Platform<br/>
              </span>
            </h1>
            <p className="mx-auto mt-10 max-w-2xl text-xl text-white animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-300 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
              Streamline your intellectual property management with powerful tools for rights distribution, submission tracking, and royalty management.<br/> 
              Built on Story Protocol with blockchain integrations for music distributors, labels, and creators.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white italic animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-400 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
              Get started today and take control of your intellectual property assets with our decentralized, transparent platform for the modern creative economy.
            </p>
            <div className="mt-10 flex justify-center gap-4 animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 delay-500 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/overview");
                }}
                className="rounded-md bg-white px-8 py-3 text-base font-medium text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 hover:scale-105"
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
                className="rounded-md border border-white bg-white px-8 py-3 text-base font-medium text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-8 relative z-10" onClick={(e) => e.stopPropagation()}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-on-load opacity-0 translate-y-4 transform transition-all duration-700 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Powerful IP Management Tools
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-lg text-white">
                Everything you need to manage your intellectual property in one place
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-24">
              {/* Feature 1 */}
              <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-on-load opacity-0 translate-y-4 transform delay-100 ease-out animate-visible:opacity-100 animate-visible:translate-y-0">
                <h3 className="text-xl font-medium text-white mb-4">Submission Tracking</h3>
                <p className="mt-2 text-gray-400">
                  Track all your IP submissions in real-time with detailed analytics and verification status.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-on-load opacity-0 translate-y-4 transform ease-out animate-visible:opacity-100 animate-visible:translate-y-0 delay-200">
                <h3 className="text-xl font-medium text-white mb-4">Rights Distribution</h3>
                <p className="mt-2 text-gray-400">
                  Manage and distribute rights across different categories with transparent allocation and tracking.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-on-load opacity-0 translate-y-4 transform ease-out animate-visible:opacity-100 animate-visible:translate-y-0 delay-300">
                <h3 className="text-xl font-medium text-white mb-4">Royalty Management</h3>
                <p className="mt-2 text-gray-400">
                  Automate royalty calculations and distributions with detailed reporting and transparent transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal footer - positioned at bottom of page with transparent background */}
      <div className="absolute bottom-0 w-full py-2 text-center text-xs text-white bg-transparent">
        &copy; {new Date().getFullYear()} Derive
      </div>
    </div>
  );
};
