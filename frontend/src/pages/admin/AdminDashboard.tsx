import {  useState } from "react"
import Sidebar from "../../components/Admin/Sidebar"
const AdminDashboard = () => {
   const [selected,setSelectedMenu]=useState("Dashboard")
  return (
    <div>
<div className="flex">
<Sidebar setSelected={setSelectedMenu}/>
        <div className="flex justify-center items-center w-full ">
    <h1 className="text-center text-2xl font-semibold">Hello Welcome 🫶🏻</h1>
</div>
</div>



        
    </div>
  )
}

export default AdminDashboard