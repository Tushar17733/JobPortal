const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-black mb-2">Job<span className="text-orange-500">Portal</span></h2>
          <p className="text-sm text-gray-600 w-[60%]">Your trusted platform to search, apply, and land your dream job.</p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Company</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:text-purple-600">About Us</a></li>
            <li><a href="#" className="hover:text-purple-600">Careers</a></li>
            <li><a href="#" className="hover:text-purple-600">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Job Seekers</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:text-purple-600">Find Jobs</a></li>
            <li><a href="#" className="hover:text-purple-600">Browse Categories</a></li>
            <li><a href="#" className="hover:text-purple-600">Post Resume</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Recruiters</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:text-purple-600">Post a Job</a></li>
            <li><a href="#" className="hover:text-purple-600">Plans & Pricing</a></li>
            <li><a href="#" className="hover:text-purple-600">Support</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
