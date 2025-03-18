import  { useEffect, useState } from "react";
import { fetchCompany } from "../../services/company/compayprofile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import {  useNavigate } from "react-router-dom";
import ComapanyHeader from "../../components/Company/ComapanyHeader";


import CompanySidebar from "../../components/Company/ComapnySidebar";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || "";
  console.log(" the user fomr dash", user);
  useEffect(() => {
    const handleCompany = async () => {
      try {
        if (!userId) return;
        const response = await fetchCompany(userId);
        console.log(response.company.company);

        if (!response.company.company) {
          navigate("/company-signup");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    handleCompany();
  }, [userId, location]);
  const [selected, setSelectedMenu] = useState("Dashboard");
  const [heading,setHeading]=useState("Dashboard")
  return (
    <div className="flex">
      <CompanySidebar setSelected={setSelectedMenu} />
      <div
        className="bg-[#F6F6F6] w-full  overflow-x-hidden relative"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        {/* header */}
        <ComapanyHeader heading={heading}/>

        <div className="flex justify-center items-center ">
          <h1 className="font-bold text-center ">Hello Welcome 🫶🏻</h1>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
