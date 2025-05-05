import Navbar from '../../components/homecomponts/Navbar'
import bannerImage from "../../assets/Rectangle 38.png"
import { CiBookmark } from "react-icons/ci";
import { MdOutlineMail } from "react-icons/md";
import { RiComputerLine } from "react-icons/ri";
import { RiHomeOfficeLine } from "react-icons/ri";
import { useParams } from 'react-router-dom';
import { getJobDetails, savedJobs, saveJob } from '../../services/jobService';
import { useEffect, useState } from 'react';
import { ISavedJobs, JobData } from '../../types/types';
import { applyForJob } from '../../services/jobService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import ToastError from '../../components/Tost/ErrorToast';
import { User } from "../../types/types"
import { getProfile } from '../../services/profile';
import { isApplied } from '../../services/jobService';
import { IoBookmark } from 'react-icons/io5';
import Footer from '../../components/homecomponts/Footer';




const formatSalary = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  } else {
    return `₹${amount}`;
  }
};


const JobDetails = () => {
  const { id } = useParams()
  const [jobDetails, setJobDetails] = useState<JobData>()
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false);
  const [responseUserId, setResponseUserId] = useState("")
  const [hasApplied, setHasApplied] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [userSavedJobs, setUserSavedJobs] = useState<ISavedJobs[]>([])

  const user = useSelector((state: RootState) => state.auth.user)
  const userId = user?._id || ""

  useEffect(() => {
    const fechDetails = async () => {
      try {
        const response = await getJobDetails(id || "")
        if (response.job) {
          setJobDetails(response.job)
        }
        setResponseUserId(response.job.company.userId)
        if (response.job.company.userId) {
          const userResponse = await getProfile(userId)
          setUserDetails(userResponse.user.user)
        }
      } catch (error) {
        console.log("error in feching job details", error)
      } finally {
        setLoading(false)
      }
    }
    fechDetails()
  }, [userId, id, responseUserId])



  useEffect(() => {

    const handleApplied = async () => {
      try {
        const response = await isApplied(userId, id || "")
        if (response.application) {
          setHasApplied(true)
        }
      } catch (error) {
        setHasApplied(false)
        console.log("error in feching job applied status", error)
      }
      finally {
        setLoading(false)
      }
    }
    handleApplied()
  }, [id, userId])

  const validateUserDetails = (user: User | null): boolean => {
    if (!user) {
      setErrorMessage("User details not found. Please log in again.");
      return false;
    }

    const requiredFields = [
      { field: user.firstName, name: "Full Name" },
      { field: user.email, name: "Email" },
      { field: user.resume, name: "Resume" },
      { field: user.phoneNumber, name: "Phone Number" },
      { field: user.education, name: "Education" },
      { field: user.experiences, name: "Experience" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field) {
        setErrorMessage(`Please complete your profile: ${name} is required.`);
        return false;
      }
    }

    setErrorMessage(null);
    return true;
  };

  const handleApplyJob = async () => {
    if (!validateUserDetails(userDetails)) {
      return;
    }
    setApplying(true);
    try {
      const response = await applyForJob(id || "", userId)
      if (response.application) {
        setHasApplied(true)
      }
      console.log("the response", response)
    } catch (error) {
      console.log("Error in the apply for the job", error)
    } finally {
      setApplying(false)
    }
  }

  const handleSavingJob = async (jobId: string | undefined) => {
    if (!jobId) return
    try {
      await saveJob(userId, jobId)
      setUserSavedJobs(prevSaved => {
        const alredySaved = prevSaved.find(saved => saved.jobId === jobId)
        if (alredySaved) {
          return prevSaved.filter(saved => saved.jobId != jobId)
        } else {
          return [...prevSaved, { jobId, savedAt: new Date().toISOString() }];
        }
      })
  
    } catch (error) {
      console.error("Error on saving Job",error)
    }
  }


  useEffect(() => {

    const fetchSavedJobs = async () => {
      try {
        const response = await savedJobs(userId)
        setUserSavedJobs(response.savedJobs)
      } catch (error) {
        console.error("Error on fethicing the saved jobs",error)
      }
    }
    if (userId) {
      fetchSavedJobs()
    }
  }, [userId])


  if (loading) {
    return (
      <div className="bg-[#F6F6F6] min-h-screen" style={{ fontFamily: "DM Sans, sans-serif" }}>
        <Navbar />
        <div className="px-10 py-6 text-center text-gray-600">Loading job details...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6F6] min-h-screen" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <div className='flex justify-center'>
        {errorMessage ? <ToastError message={errorMessage} onClose={() => setErrorMessage(null)} /> : ""}
      </div>

      <Navbar />

      <div className="px-10 py-6">
        {/* profiile section */}
        <div className="bg-white shadow-lg w-full rounded-xl overflow-hidden">
          <div className="relative">

            <img
              src={bannerImage}
              alt="Job Banner"
              className="w-full h-40 object-cover rounded-t-lg"
            />


            <div className="absolute top-32 sm:top-22 bottom-0 sm:bottom-35 left-8 w-22 h-22 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md">
              <img
                className="w-full h-full rounded-full object-cover"
                src={`https://res.cloudinary.com/do4wdvbcy/image/upload/${jobDetails?.company.logo}`}
                alt="Company Profile"
              />
            </div>


            <div className="mt-20 px-10 pb-6 sm:flex sm:justify-between items-center">
              <div className="space-y-3">
                <div>
                  <h1 className="font-bold text-2xl">{jobDetails?.jobTitle}</h1>
                  <h2 className="font-medium text-md text-gray-800">{jobDetails?.company.companyName}</h2>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <p className="font-light">{jobDetails?.company.location || "N/A"}</p>
                  <p>{jobDetails?.startDate
                    ? `Posted ${new Date(jobDetails.startDate).toLocaleDateString()}`
                    : "Date not available"}</p>
                </div>
              </div>


              <div className="flex mt-9 sm:mt-15 space-x-4">
                <button className="bg-white shadow-md rounded-lg py-2 px-5 font-bold flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer">
                  {userSavedJobs.some((saved) => saved.jobId.toString() === jobDetails?._id?.toString()) ? (
                    <div className='flex space-x-5 '>    <IoBookmark className="w-6 h-6" onClick={() => handleSavingJob(jobDetails?._id)} /> Saved</div>


                  ) : (
                    <div className='flex'>      <CiBookmark className="w-6 h-6" onClick={() => handleSavingJob(jobDetails?._id)} />
                      Save
                    </div>

                  )
                  }

                </button>
                <button
                  onClick={handleApplyJob}
                  disabled={applying || hasApplied}
                  className={`bg-orange-600 shadow-md rounded-lg py-2 px-5 font-semibold text-white transition cursor-pointer ${applying ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-700"
                    }`}
                >
                  {responseUserId === userId
                    ? "Your Job"
                    : hasApplied
                      ? "Applied"
                      : applying
                        ? "Applying..."
                        : "Apply"}
                </button>
              </div>


            </div>
          </div>
        </div>


        {/* about section  */}
        <div className="mt-5 flex flex-col md:flex-row gap-4">

          <div className="bg-white shadow-md w-full md:w-[850px] rounded-xl p-6">
            <div className="space-y-6">

              <div className='pt-4'>
                <h1 className="font-semibold text-2xl px-3 text-gray-900">About the Job</h1>
                <p className=" mt-3 px-3 text-sm text-gray-700 leading-relaxed">
                  {jobDetails?.jobDescription}

                </p>
              </div>


              <div>
                <h2 className="font-semibold px-3 pt-5 text-lg text-gray-900">Responsibilities</h2>
                <p className="mt-3 text-sm px-3 text-gray-700 leading-relaxed">
                  {jobDetails?.jobResponsibilities}
                </p>
              </div>

              {/* Skills */}
              <div className="px-3">
                <h1 className="font-semibold text-xl pt-5 text-gray-900">Skills</h1>
                {jobDetails && jobDetails.requiredSkills && jobDetails.requiredSkills.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-5">
                    {jobDetails.requiredSkills.map((item, index) => (
                      <span
                        key={index}
                        className="bg-[#eb5a0023]  text-gray-800 text-sm font-medium  px-4 py-2 rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mt-4">No skills specified.</p>
                )}
              </div>
            </div>
          </div>


          <div className="bg-white shadow-md w-full md:w-[550px] rounded-xl p-6">

            <div className='p-4'>
              <h1 className='font-semibold text-2xl'>  {jobDetails?.minimumSalary && jobDetails.maximumSalary
                ? `${formatSalary(jobDetails.minimumSalary)} - ${formatSalary(jobDetails.maximumSalary)}`
                : "N/A"}</h1>
              <p className='text-sm text-gray-700'>Yearly salary</p>
            </div>

            <div className='p-5 space-y-5'>

              <div className='flex'>
                <div className='bg-[#eb5a0023] p-3 rounded-lg'>
                  <MdOutlineMail className='w-7 h-7' />
                </div>
                <div className=' pl-5'>
                  <h2 className='font-medium'>{jobDetails?.company.email}</h2>
                  <p className='text-sm text-gray-600'>Email</p>
                </div>

              </div>

              <div className='flex'>
                <div className='bg-[#eb5a0023] p-3 rounded-lg'>
                  <RiComputerLine className='w-7 h-7' />
                </div>
                <div className='pl-5'>
                  <h2 className='font-medium'>{jobDetails?.category}</h2>
                  <p className='text-sm text-gray-600'>Industry</p>
                </div>

              </div>

              <div className='flex'>
                <div className='bg-[#eb5a0023] p-3 rounded-lg'>
                  <RiHomeOfficeLine className='w-7 h-7' />
                </div>
                <div className='pl-5'>
                  <h2 className='font-medium'>{jobDetails?.typesOfEmployment}</h2>
                  <p className='text-sm text-gray-600'>Employment-Type</p>
                </div>

              </div>
            </div>

            <div className=''>
              <p className='text-sm p-5 text-gray-700'>
                At Google, we value innovation, collaboration, and continuous growth. As a Senior Developer, you’ll work alongside
                talented teams to build impactful solutions that reach millions of users worldwide. We are committed to fostering an inclusive and dynamic
                work environment where creativity and ambition are celebrated. If you’re passionate about technology and eager to take on new challenges, we encourage you to apply and become a
                part of our journey to shape the future of digital experiences
              </p>
            </div>

          </div>
        </div>


        <div className='bg-white shadow-lg rounded-xl sm:flex mt-5'>
          <div className='p-5 '>
            <h1 className='font-semibold text-xl pl-4 pt-4 '>About the Company </h1>
            <p className='text-sm text-gray-700 pl-4 pt-5'>{jobDetails?.company.description}</p>

          </div>

          <div className="flex ">
            <div className=' sm:p-20 mt-3  hidden sm:block'>

              <img src={`https://res.cloudinary.com/do4wdvbcy/image/upload/${jobDetails?.company.logo}`} alt="" className='w-9 h-9 ml-2 rounded-Full' />
              <h1 className='font-semibold text-lg'>{jobDetails?.company.companyName}</h1>
            </div>
          </div>

        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default JobDetails