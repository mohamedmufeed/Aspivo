import { useCallback, useEffect, useState } from "react"
import CompanySidebar from "../../components/Company/ComapnySidebar"
import { GoPencil } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import EditCompanyProfileModal from "../../components/Company/Modals/EditCompanyProfile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import EditCompanyDescriptionModal from "../../components/Company/Modals/EditCompanyDescriptionModal";
import AddTeachStack from "../../components/Company/Modals/AddTechStack";
import EditCompanyTeam from "../../components/Company/Modals/EditCompanyTeamModal";
import EditCompanyContact from "../../components/Company/Modals/EditContactModal";
import { fetchCompany } from "../../services/company/compayJob";
import { IPopulatedCompany } from "../../types/types";


const CompanyProfile = () => {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editDescriptionModalOpen, setEditDescriptionModalOpen] = useState(false)
  const [addTeachStackModalOpen, setAddTeachStackModalOpen] = useState(false)
  const [editTeamModalOpen, setEditTeamModalOpen] = useState(false)
  const [editContactModalOpen, setEditConatactModalOpen] = useState(false)
  const [companyData, setCompanyData] = useState<IPopulatedCompany>()
  const user = useSelector((state: RootState) => state.auth.user)
  const userId = user?._id || ""

  const fetchcomapny = useCallback(async () => {
    try {
      const response = await fetchCompany(userId)
      setCompanyData(response.company.company)
    } catch (error) {
      console.error("Error on fetching company", error)
    }
  }, [userId]);  
  
  useEffect(() => {
    fetchcomapny()
  }, [fetchcomapny]);

  const formatDate = (date: string|undefined): string => {
    if (!date) return "Invalid date";
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };



  return (
    <div>
      <div className="flex h-screen overflow-hidden">
        <CompanySidebar />
        <div className="bg-[#F6F6F6] w-full  overflow-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>

          {/* header */}
          <ComapanyHeader heading="Company Profile" />

          <div
            className="bg-[#F6F6F6] pt-16 pb-15 px-6 overflow-y-auto"
            style={{ height: "calc(100vh - 64px)", fontFamily: "DM Sans, sans-serif" }}
          >

            <div className="bg-white rounded-2xl shadow-md shadow-gray-100 p-6 w-full max-w-6xl mx-auto flex items-center gap-16 relative overflow-y-auto">

              <GoPencil className="absolute top-7 right-8 w-6 h-6 text-gray-900 cursor-pointer hover:text-gray-700" onClick={() => setEditModalOpen(true)} />


              <div className="w-28 h-28 bg-white rounded-full shadow-lg flex items-center justify-center border mt-5 border-gray-300">
                <img src={`https://res.cloudinary.com/do4wdvbcy/image/upload/${companyData?.logo}`} alt="Company Logo" className="w-24 h-24 rounded-full" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{companyData?.companyName}</h2>
                <a href={`http://${companyData?.companyUrl}`} className="text-black hover:underline hover:text-orange-600">{companyData?.companyUrl}</a>

                <div className="grid grid-cols-4 gap-40 text-gray-600 mt-6">
                  <div>
                    <h3 className="font-medium">Founded</h3>
                    <p className="text-black font-medium">{formatDate(companyData?.startDate)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Employees</h3>
                    <p className="text-black font-medium">{companyData?.employees}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-black font-medium">{companyData?.location}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Industry</h3>
                    <p className="text-black font-medium">{companyData?.industry}</p>
                  </div>
                </div>
              </div>
              <EditCompanyProfileModal setCompanyData={setCompanyData} companyId={companyData?._id || ""} onClose={() => setEditModalOpen(false)} isOpen={editModalOpen} />
            </div>

            <div className="flex gap-5">

              <div className="bg-white  shadow-gray-100 shadow-lg w-2/3 rounded-lg  p-5 mt-5">
                <div className="flex justify-between px-6">
                  <h1 className="font-medium text-2xl">Company Profile</h1>
                  <GoPencil className="font-extralight cursor-pointer w-5 h-5" onClick={() => setEditDescriptionModalOpen(true)} />
                </div>
                <div className=" font-light px-8 mt-3 p-3">
                  <p className="">
                    {companyData?.description}
                  </p>
                </div>
              </div>
              <EditCompanyDescriptionModal isOpen={editDescriptionModalOpen} setCompanyData={setCompanyData} companyId={companyData?._id || ""} onClose={() => setEditDescriptionModalOpen(false)} />


              <div className="bg-white  shadow-gray-100 shadow-lg w-1/3 rounded-lg  p-5 mt-5">
                <div className="flex justify-between px-3">
                  <h1 className="font-medium text-2xl">Tech Stack</h1>
                  <div className="flex gap-5">
                    <GoPlus className="font-extralight cursor-pointer w-6 h-6" onClick={() => setAddTeachStackModalOpen(true)} />

                  </div>

                </div>

                <div className="px-6 mt-4 space-y-1">
                  {companyData?.stack.map((stack, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-md ">
                      <div className="bg-[#eb5a0023] p-2 rounded-lg">
                        {/* <img src={stack.icon} alt={stack.name} className="w-8 h-8 rounded-full" /> */}
                      </div>

                      <h3 className="font-medium text-lg">{stack}</h3>
                    </div>
                  ))}
                </div>

              </div>
              <AddTeachStack initialTechStack={companyData?.stack} companyId={companyData?._id || ""} isOpen={addTeachStackModalOpen} onClose={() => setAddTeachStackModalOpen(false)} setCompanyData={setCompanyData} />
            </div>

            <div className=" ">
              <div className="bg-white  shadow-gray-100 shadow-lg w-full rounded-lg  p-5 mt-5">
                <div className="flex justify-between px-3">
                  <h1 className="font-medium text-2xl">Team</h1>
                  <GoPencil className="font-extralight cursor-pointer w-5 h-5" onClick={() => setEditTeamModalOpen(true)} />
                </div>

                <div className="px-6 mt-4 flex items-center gap-4 overflow-x-auto">
                  {companyData?.team.map((member, index) => (
                    <div key={index} className="flex flex-col items-center p-4 bg-[#eb5a0023] rounded-lg shadow-md min-w-[200px]">
                      <h3 className="font-semibold text-lg text-gray-800">{member.position}</h3>
                      <p className="text-gray-600">{member.name}</p>
                    </div>
                  ))}
                </div>
                <EditCompanyTeam isOpen={editTeamModalOpen} onClose={() => setEditTeamModalOpen(false)} companyId={companyData?._id || ""} setCompanyData={setCompanyData} />
              </div>


              <div className="bg-white  shadow-gray-100 shadow-lg w-full rounded-lg  p-5 mt-5">
                <div className="flex justify-between px-3">
                  <h1 className="font-medium text-2xl">Contact</h1>
                  <GoPencil className="font-extralight cursor-pointer w-5 h-5" onClick={() => setEditConatactModalOpen(true)} />
                </div>
                <div className="flex gap-4 p-4 rounded-lg ">
                  {companyData?.contact.map((social, index) => (
                    <a key={index} href={`https://${social.url}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                      {social.name}
                    </a>
                  ))}
                </div>
                <EditCompanyContact isOpen={editContactModalOpen} companyId={companyData?._id || ""} onClose={() => setEditConatactModalOpen(false)} setCompanyData={setCompanyData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyProfile