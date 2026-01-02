import { selectuser  } from '@/Fetaure/Userslice';
import axios from 'axios';
import { ArrowUpRight, Calendar, DollarSign, ExternalLink, Link, MapPin, X } from 'lucide-react';
import router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';



// export const filteredJobs = [
//      {
//        _id: "101",
//        title: "Frontend Developer",
//        company: "Amazon",
//        location: "Seattle",
//        CTC: "$100K/year",
//        Experience: "2+ years",
//        category: "Engineering",
//        StartDate: "April 1, 2025",
//        aboutCompany:
//          "Amazon is a global leader in e-commerce and cloud computing, providing cutting-edge technology solutions.",
//        aboutJob:
//          "Seeking a skilled Frontend Developer proficient in React.js, JavaScript, and UI development.",
//        Whocanapply:
//          "Developers with experience in JavaScript, React.js, and modern frontend frameworks.",
//        perks:
//          "Remote work, stock options, health insurance, learning resources.",
//        AdditionalInfo: "This role is hybrid with occasional onsite meetings.",
//        numberOfopning: "3",
//      },
//      {
//       _id: "102",
//        title: "Data Analyst",
//        company: "Microsoft",
//        location: "Remote",
//        CTC: "$90K/year",
//        Experience: "1+ years",
//        category: "Data Science",
//       StartDate: "March 15, 2025",
//        aboutCompany:
//          "Microsoft is a technology company specializing in software development, cloud computing, and AI.",
//        aboutJob:
//          "Looking for a Data Analyst with expertise in SQL, Python, and data visualization tools.",
//        Whocanapply:
//          "Candidates with experience in data analytics, SQL, Python, and Tableau/Power BI.",
//        perks: "Flexible hours, remote work, upskilling programs, bonuses.",
//        AdditionalInfo: "This is a fully remote role.",
//        numberOfopning: "2",
//      },
//      {
//        _id: "103",
//        title: "UX Designer",
//        company: "Apple",
//        location: "California",
//        CTC: "$110K/year",
//        Experience: "3+ years",
//        category: "Design",
//        StartDate: "March 30, 2025",
//        aboutCompany:
//          "Apple is a leader in consumer electronics and software, focusing on design and innovation.",
//        aboutJob:
//          "Seeking a UX Designer to craft intuitive user experiences for our next-generation products.",
//        Whocanapply:
//          "Designers with experience in Figma, Adobe XD, user research, and usability testing.",
//        perks:
//         "Creative environment, free lunches, fitness perks, flexible hours.",
//        AdditionalInfo: "Office-based with occasional remote work options.",
//        numberOfopning: "1",
//      },
//      {
//        _id: "104",
//        title: "Backend Developer",
//        company: "NextGen Solutions",
//        location: "Austin, TX",
//        CTC: "$90,000 - $110,000",
//        Experience: "3-5 years",
//        category: "Engineering",
//        StartDate: "March 20, 2025",
//        aboutCompany:
//         "NextGen Solutions specializes in building scalable backend systems and APIs for high-performance applications.",
//        aboutJob:
//          "Looking for a Backend Developer skilled in Node.js, Express.js, and database management.",
//        Whocanapply:
//          "Developers with experience in server-side programming, databases (SQL, NoSQL), and RESTful APIs.",
//        perks: "Stock options, remote work, gym membership, yearly bonuses.",
//        AdditionalInfo: "Hybrid role with 2 days of in-office meetings per week.",
//        numberOfopning: "3",
//      },
//      {
//       _id: "105",
//        title: "UI/UX Designer",
//        company: "Design Pro",
//        location: "San Francisco, CA",
//       CTC: "$70,000 - $85,000",
//        Experience: "2+ years",
//        category: "Design",
//        StartDate: "March 25, 2025",
//        aboutCompany:
//          "Design Pro is an award-winning UI/UX design agency focusing on innovative user experiences.",
//        aboutJob:
//          "We need a UI/UX Designer who can create user-friendly interfaces and improve the user experience of our applications.",
//        Whocanapply:
//          "Designers with proficiency in Figma, Adobe XD, and user research methodologies.",
//        perks:
//          "Creative workspace, wellness programs, free team lunches, flexible hours.",
//        AdditionalInfo: "Office-based with flexible working hours.",
//        numberOfopning: "1",
//          },
//   ];

  const index = () => {

    const router = useRouter();
    const { id } = router.query;

    const [jobsData,setjobs] = useState<any>([])
  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);

      setjobs(res.data);            
      
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

  if (!jobsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Job not found
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
        category: jobsData.category,
        company: jobsData.company,
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
      router.push("/jobs")
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
            {jobsData.title}
          </h1>
          <p className="text-lg text-gray-600">{jobsData.company}</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span>{jobsData.location}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign className="h-5 w-5" />
            <span>{jobsData.CTC}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>{jobsData.startDate}</span>
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-purple-500 mb-4">
            About {jobsData.company}
          </h2>

          <a
            href="#"
            className="text-sky-600 hover:text-blue-700 flex items-center space-x-1 mb-3"
          >
            <span>Visit Company Website</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          <p className="text-gray-700">{jobsData.aboutCompany}</p>
        </div>

        <div className="p-6 border-b space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-purple-500">
              About the Job
            </h3>
            <p className="text-gray-700">{jobsData.aboutJob}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-500">
              Who Can Apply
            </h3>
            <p className="text-gray-700">{jobsData.whoCanApply}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-500">Perks</h3>
            <p className="text-gray-700">{jobsData.perks}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-500">
              Additional Information
            </h3>
            <p className="text-gray-700">{jobsData.additionalInfo}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-500">
               Posted On
            </h3>
            <p className="text-gray-700">{jobsData.createAt}</p>
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
                Apply For {jobsData.company}
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
                <label key={option} className="flex items-center space-x-2 text-black">
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
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer  hover:bg-emerald-600" onClick={handelSubmitApplication}>
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
  )
}

export default index
