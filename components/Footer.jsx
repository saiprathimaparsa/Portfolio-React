import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  return (
    <footer className="sticky bottom-0 left-0 right-0 py-4 sm:py-6 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="text-gray-600 text-sm sm:text-base">
          © {new Date().getFullYear()} Sai Prathima Parsa. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 text-sm sm:text-base">
            Home
          </Link>
          <Link to="/projects" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 text-sm sm:text-base">
            Projects
          </Link>
          <a
            href="mailto:saiprathimaparsa@gmail.com"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-300 text-sm sm:text-base"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 