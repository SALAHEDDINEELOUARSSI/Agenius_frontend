import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  return (
    
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/90 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-violet-600 font-medium"
            >
              <div className="flex items-center">
                <div className="bg-violet-600 text-white font-bold rounded-lg p-1 mr-1">
                  <span className="text-xs">A</span>
                </div>
                <span className="text-xl font-semibold tracking-tight">genius</span>
              </div>
            </Link>
            <nav className="flex items-center space-x-8">
              <Link 
                to="/" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-violet-600",
                  location.pathname === "/" ? "text-violet-600" : "text-gray-700"
                )}
              >
                Home
              </Link>
              <Link 
                to="/jobs" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-violet-600",
                  location.pathname.includes("/jobs") ? "text-violet-600" : "text-gray-700"
                )}
              >
                Jobs
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          key={location.pathname}
        >
          <Outlet />
        </motion.div>
      </main>
      <footer className="border-t border-gray-100 py-6 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Agenius. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
