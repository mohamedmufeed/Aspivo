import { useEffect, useState } from "react";
import { fetchCompany } from "../../services/company/compayJob";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useNavigate } from "react-router-dom";
import ComapanyHeader from "../../components/Company/ComapanyHeader";


import CompanySidebar from "../../components/Company/ComapnySidebar";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || "";
  useEffect(() => {
    const handleCompany = async () => {
      try {
        if (!userId) return;
        const response = await fetchCompany(userId);
        if (!response.company.company) {
          navigate("/company-signup");
        }
        if (response.company.company.status != "Approved") {
          navigate("/success")
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    handleCompany();
  }, [userId, location]);
  const [selected, setSelectedMenu] = useState <string|undefined>("Dashboard");

  return (
    <div className="flex">
      <CompanySidebar setSelected={setSelectedMenu} />
      <div
        className="bg-[#F6F6F6] w-full  overflow-x-hidden relative"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        {/* header */}
        <ComapanyHeader heading="Dashboard" />

        <div className="flex justify-center items-center ">
          <h1 className="font-bold text-center ">Hello Welcome 🫶🏻</h1>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
