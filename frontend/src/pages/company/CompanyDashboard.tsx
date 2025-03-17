import React, { useEffect, useState } from 'react'
import { fetchCompany } from '../../services/company/compayprofile'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import { Navigate, useNavigate } from 'react-router-dom'

import CompanySidebar from '../../components/Company/ComapnySidebar'





const CompanyDashboard = () => {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const userId = user?._id || ""
  console.log(" the user fomr dash", user)
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
  const [selected, setSelectedMenu] = useState("Dashboard")
  return (
    <div className='flex'>
      <CompanySidebar setSelected={setSelectedMenu} />
      <div className="flex justify-center items-center w-full ">
        <h1 className="text-center text-2xl font-semibold">Hello Welcome 🫶🏻</h1>
      </div>

    </div>
  )
}

export default CompanyDashboard