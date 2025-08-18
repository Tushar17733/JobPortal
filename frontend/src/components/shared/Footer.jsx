const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 sm:py-10 mt-10 sm:mt-16 lg:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Branding */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">Job<span className="text-orange-500">Portal</span></h2>
          <p className="text-xs sm:text-sm text-gray-600 w-full sm:w-[80%] lg:w-[60%]">Your trusted platform to search, apply, and land your dream job.</p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Company</h3>
          <ul className="space-y-1 text-xs sm:text-sm">
            <li><a href="#" className="hover:text-purple-600 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Job Seekers</h3>
          <ul className="space-y-1 text-xs sm:text-sm">
            <li><a href="#" className="hover:text-purple-600 transition-colors">Find Jobs</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">Browse Categories</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">Post Resume</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Recruiters</h3>
          <ul className="space-y-1 text-xs sm:text-sm">
            <li><a href="#" className="hover:text-purple-600 transition-colors">Post a Job</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">Plans & Pricing</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">Support</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t mt-6 sm:mt-8 lg:mt-10 pt-4 text-center text-xs sm:text-sm text-gray-500 px-4 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
