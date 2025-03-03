import { Link } from "react-router-dom";
import { Facebook, Github, Twitter, Mail, Globe } from "lucide-react"; 

const Footer = () => {
  return (
    <footer className="bg-[#1D1042] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="ElevateU Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">ElevateU</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Empowering learners through accessible and engaging online education.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Get Help</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/articles">Latest Articles</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Programs</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/courses/art-design">Art & Design</Link>
              </li>
              <li>
                <Link to="/courses/business">Business</Link>
              </li>
              <li>
                <Link to="/courses/it-software">IT & Software</Link>
              </li>
              <li>
                <Link to="/courses/languages">Languages</Link>
              </li>
              <li>
                <Link to="/courses/programming">Programming</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>Email: elevateulms@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-700 pt-8 sm:flex-row">
          <p className="text-sm text-gray-300">© 2025 ElevateU. All rights reserved.</p>
          <div className="mt-4 flex gap-4 sm:mt-0">
            <Link to="https://facebook.com" target="_blank" className="hover:text-blue-500">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link to="https://github.com" target="_blank" className="hover:text-gray-400">
              <Github className="h-5 w-5" />
            </Link>
            <Link to="https://twitter.com" target="_blank" className="hover:text-blue-400">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link to="https://mail.google.com" target="_blank" className="hover:text-red-500">
              <Mail className="h-5 w-5" />
            </Link>
            <Link to="https://www.google.com" target="_blank" className="hover:text-green-500">
              <Globe className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;