import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  X,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Fetaure/Userslice";

function InternshipDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [internshipData, setInterships] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/interships/${id}`
        );

        setInterships(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const [isModelOpen, setisModelOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [Availability, setAvailability] = useState("");
  const user = useSelector(selectuser);

  if (!router.isReady) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!internshipData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Internship not found
      </div>
    );
  }

  const handelSubmitApplication = async () => {
    if (!coverLetter.trim()) {
      toast.error("Please Write a Cover Letter");
      return;
    }

    if (!Availability) {
      toast.error("Please Write a Availability");
      return;
    }

    try {
      const applicationData = {
        category: internshipData.category,
        company: internshipData.company,
        coverLetter: coverLetter,
        availability: Availability,
        user: user,
        internship: id,
      };

      await axios.post(
        "http://localhost:5000/api/application",
        applicationData
      );
      toast.success("Your application is submited ");
      router.push("/interships")
    } catch (error) {
      console.log(error);
      toast.error("failed to submit application");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <ArrowUpRight className="h-5 w-5" />
            <span className="font-medium">Actively Hiring</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {internshipData.title}
          </h1>
          <p className="text-lg text-gray-600">{internshipData.company}</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span>{internshipData.location}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign className="h-5 w-5" />
            <span>{internshipData.stipend}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>{internshipData.startDate}</span>
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-purple-500 mb-4">
            About {internshipData.company}
          </h2>

          <a
            href="#"
            className="text-sky-600 hover:text-blue-700 flex items-center space-x-1 mb-3"
          >
            <span>Visit Company Website</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          <p className="text-gray-700">{internshipData.aboutCompany}</p>
        </div>

        <div className="p-6 border-b space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-purple-500">
              About the Internship
            </h3>
            <p className="text-gray-700">{internshipData.aboutInternship}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-500">
              Who Can Apply
            </h3>
            <p className="text-gray-700">{internshipData.whoCanApply}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-500">Perks</h3>
            <p className="text-gray-700">{internshipData.perks}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-500">
              Additional Information
            </h3>
            <p className="text-gray-700">{internshipData.additionalInfo}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-500">
              Numbers Of Openings
            </h3>
            <p className="text-gray-700">
              {internshipData.numberOfOpening || "Not specified"}
            </p>
          </div>
        </div>

        <div className="p-6 flex justify-center">
          <button
            onClick={() => setisModelOpen(true)}
            className="bg-sky-500 text-white px-8 py-3 rounded-lg hover:bg-lime-500"
          >
            Apply Now
          </button>
        </div>
      </div>

      {isModelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">
                Apply For {internshipData.company}
              </h2>
              <button onClick={() => setisModelOpen(false)}>
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <textarea
                className="w-full h-32 p-3 border rounded-lg text-black"
                placeholder="Write your cover letter here"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />

              {[
                "Yes, I am available to join immediately",
                "No, I am currently on notice period",
                "No, I will have to serve notice period",
                "Other",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 text-black"
                >
                  <input
                    type="radio"
                    name="availability"
                    value={option}
                    checked={Availability === option}
                    onChange={(e) => setAvailability(e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}

              <div className="flex justify-end">
                {user ? (
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer  hover:bg-emerald-600"
                    onClick={handelSubmitApplication}
                  >
                    Submit Application
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                  >
                    Sign up to apply
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InternshipDetails;
