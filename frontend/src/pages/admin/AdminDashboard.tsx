import { use, useState } from "react"
import Sidebar from "../../components/Admin/Sidebar"
const AdminDashboard = () => {
   const [selected,setSelectedMenu]=useState("Dashboard")
  return (
    <div>

        <Sidebar setSelected={setSelectedMenu}/>
        
    </div>
  )
}

export default AdminDashboard