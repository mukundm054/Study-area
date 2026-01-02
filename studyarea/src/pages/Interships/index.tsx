import React, { useEffect, useState } from "react";
import {
  Filter,
  ArrowUpRight,
  PlayCircle,
  Pin,
  DollarSign,
  Clock
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

function Interships() {
  const [filteredInternships, setfilteredInternships] = useState<any>([]);
  const [isFiltervisible, setisFiltervisible] = useState(false);
  const [filter, setfilters] = useState({
     category: "",
    location: "",
    workFromHome: false,
    partTime: false,
    stipend: 50,
  });

  const [intershipsData,setInterships] = useState<any>([])
  


  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get("https://study-area-ko6n.onrender.com/api/interships");

      setInterships(res.data);            
      setfilteredInternships(res.data) 
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();
}, []);



  useEffect(() => {
  const filtered = intershipsData.filter((interships: any) => {
    const matchesCategory = (interships.category || "")
      .toLowerCase()
      .includes(filter.category.toLowerCase());

    const matchesLocation = (interships.location || "")
      .toLowerCase()
      .includes(filter.location.toLowerCase());

    return matchesCategory && matchesLocation;
  });

  setfilteredInternships(filtered);
}, [filter, intershipsData]);


  const handelfilterchanges = (e: any) => {
    const { name, value, type, checked } = e.target;
    setfilters((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearFilters = () => {
    setfilters({
      category: "",
      location: "",
      workFromHome: false,
      partTime: false,
      stipend: 50,
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block w-64 bg-white rounded-lg shadow-sm p-6 h-fit ">
            <div className="flex items-center justify-between mb-6 ">
              <div className="flex items-center space-x-2 ">
                <Filter className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-black">Filters</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
            </div>
            {/* profile categores filters */}
            <div className="space-y-6">
              <div className="block text-sm font-medium text-gray-700 mb-1">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={filter.category}
                  onChange={handelfilterchanges}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="e.g. Marketing Intern"
                />
              </div>
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={filter.location}
                  onChange={handelfilterchanges}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="e.g. Mumbai"
                />
              </div>
              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="workFromHome"
                    checked={filter.workFromHome}
                    onChange={handelfilterchanges}
                    className="h-4 w-4 text-blue-600 rounded "
                  />
                  <span className="text-gray-700">Work from home</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="partTime"
                    checked={filter.partTime}
                    onChange={handelfilterchanges}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-gray-700">Part-time</span>
                </label>
              </div>
              {/* Stipend Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Stipend (₹)
                </label>
                <input
                  type="range"
                  name="stipend"
                  min="0"
                  max="100"
                  value={filter.stipend}
                  onChange={handelfilterchanges}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹0</span>
                  <span>₹50K</span>
                  <span>₹100K</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="md:hidden mb-4">
              <button
                onClick={() => setisFiltervisible(!isFiltervisible)}
                className="w-full flex items-center justify-center space-x-2 bg-white p-3 rounded-lg shadow-sm text-black"
              >
                <Filter className="h-5 w-5" />
                <span>Show Filters</span>
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="text-center font-medium text-black">
                {filteredInternships.length} Interships Found
              </p>
            </div>
            <div>
              {filteredInternships.map((interships: any) => (
                <div
                  key={interships._id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md mb-4 cursor-pointer"
                >
                  <div className="flex items-center space-x-2 text-blue-600 mb-4">
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="font-medium">Actively Hiring</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {interships.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{interships.company}</p>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <PlayCircle className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Starting Date</p>
                        <p className="text-sm">{interships.startDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Pin className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm">{interships.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Stipend</p>
                        <p className="text-sm">{interships.stipend}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        Internship
                      </span>
                      <div className="flex items-center space-x-1 text-green-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Posted recently</span>
                      </div>
                    </div>
                    <Link
                      href={`/detailiternship/${interships._id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interships;

