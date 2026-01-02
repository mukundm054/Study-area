import React, { useEffect, useState } from "react";
import {
  Filter,
  ArrowUpRight,
  PlayCircle,
  Pin,
  DollarSign,
  Clock,
  X,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

function Jobs() {
  const [filterdJobs, setfilterdJobs] = useState<any[]>([]);
  const [isFiltervisible, setisFiltervisible] = useState(false);
  const [jobsData, setjobsData] = useState<any>([]);

  const [filter, setfilter] = useState({
    category: "",
    location: "",
    experience: "",
    workFromHome: false,
    partTime: false,
    salary: 50,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://study-area-ko6n.onrender.com/api/jobs");

        setjobsData(res.data);
        setfilterdJobs(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = jobsData.filter((job: any) => {
      const matchesCategory = job.category
        .toLowerCase()
        .includes(filter.category.toLowerCase());

      const matchesLocation = job.location
        .toLowerCase()
        .includes(filter.location.toLowerCase());

      const matchesExperience = (job.Experience || "")
        .toLowerCase()
        .includes(filter.experience.toLowerCase());

      return matchesCategory && matchesLocation && matchesExperience;
    });

    setfilterdJobs(filtered);
  }, [filter, jobsData]);

  const handelfilterchanges = (e: any) => {
    const { name, value, type, checked } = e.target;
    setfilter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearFilters = () => {
    setfilter({
      category: "",
      location: "",
      experience: "",
      workFromHome: false,
      partTime: false,
      salary: 50,
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* FILTER SIDEBAR */}
          <div className="hidden md:block w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
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

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={filter.category}
                  onChange={handelfilterchanges}
                  className="w-full px-3 py-2 border border-black rounded-lg "
                  placeholder="e.g. Engineering"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={filter.location}
                  onChange={handelfilterchanges}
                  className="w-full px-3 py-2 border border-black rounded-lg"
                  placeholder="e.g. Remote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={filter.experience}
                  onChange={handelfilterchanges}
                  className="w-full px-3 py-2 border border-black rounded-lg"
                  placeholder="e.g. 2+ years"
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
                  Monthly salary (₹)
                </label>
                <input
                  type="range"
                  name="stipend"
                  min="0"
                  max="100"
                  value={filter.salary}
                  onChange={handelfilterchanges}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹0</span>
                  <span>₹50L</span>
                  <span>₹100L</span>
                </div>
              </div>
            </div>
          </div>

          {/* JOB LIST */}
          <div className="flex-1">
            {/* MOBILE FILTER */}
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
                {filterdJobs.length} Jobs Found
              </p>
            </div>

            <div>
              {filterdJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md mb-4 cursor-pointer"
                >
                  <div className="flex items-center space-x-2 text-blue-600 mb-4">
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="font-medium">Actively Hiring</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{job.company}</p>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <PlayCircle className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Experience</p>
                        <p className="text-sm">{job.Experience}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Pin className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm">{job.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">CTC</p>
                        <p className="text-sm">{job.CTC}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        Job
                      </span>
                      <div className="flex items-center space-x-1 text-green-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Posted recently</span>
                      </div>
                    </div>

                    <Link
                      href={`/detailjobs/${job._id}`}
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

      {/* MOBILE FILTER MODAL */}
      {isFiltervisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white h-full w-full max-w-sm ml-auto p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setisFiltervisible(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* SAME FILTERS AS SIDEBAR */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
