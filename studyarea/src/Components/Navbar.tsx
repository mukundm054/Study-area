import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { auth, provider } from "../Firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Fetaure/Userslice";

interface User {
  name: string;
  email: string;
  photo: string;
}

const Navbar = () => {
  const user = useSelector(selectuser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);

      toast.success("logged In Successfull");
    } catch (error) {
      console.error(error);
      toast.error("logged In Failed");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="bg-white shadow-md h-auto ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/logo.png" alt="studyarea" className="h-12" />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/Interships"
              className="text-gray-700 hover:text-blue-600"
            >
              Internships
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600">
              Jobs
            </Link>

            <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
              <Search size={16} className="text-gray-600" />
              <input
                type="text"
                placeholder="Search"
                className="ml-2 bg-transparent focus:outline-none text-sm w-40 text-black"
              />
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
            {user ? (
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <Link href="/Profile">
                    <img
                      src={user.photo}
                      alt="user"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </Link>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-600 px-3 py-2 rounded-md hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className=" text-gray-600 border h-auto border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
                >
                  Continue with Google
                </button>

                <Link
                  href="/AdminLogin"
                  className="text-gray-600 hover:text-gray-800"
                >
                  ADMIN
                </Link>
              </>
            )}
          </div>
        </div>

        
      </div>

      {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md border-t">
            <Link
              href="/Interships"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Internships
            </Link>

            <Link
              href="/jobs"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Jobs
            </Link>

            <div className="px-4 py-3">
              <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
                <Search size={16} className="text-gray-600" />
                <input
                  type="text"
                  placeholder="Search"
                  className="ml-2 bg-transparent focus:outline-none text-sm w-full text-black"
                />
              </div>
            </div>
          </div>
        )}
    </nav>
  );
};

export default Navbar;
