import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <nav className="bg-[#0b021e] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">BrainWave</h1>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-4">
            <Link href="/analysis/history" className="hover:underline transition duration-200">
              History
            </Link>
            
            <Link href="/inference" className="hover:underline transition duration-200">
              Inference
            </Link>
          </div>
          
          {/* Profile Icon */}
          <Link 
            href="/landing" 
            className="p-2 rounded-full hover:bg-[#1a093a] transition duration-200"
            aria-label="User profile"
          >
            <UserCircleIcon className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;