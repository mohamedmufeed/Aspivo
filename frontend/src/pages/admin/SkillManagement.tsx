import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import { addSkill, getSkills } from "../../services/adminService";
import ToastError from "../../components/Tost/ErrorToast";
import { removeSkill } from "../../services/adminService";
import AdminHeader from "../../components/Admin/AdminHeader";
import { IoClose } from "react-icons/io5";
interface SkillType {
  _id?: string;
  name: string,
  createdAt: Date
}

const SkillManagement = () => {
  const [selected, setSelectedMenu] = useState("Skills");
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)



  useEffect(() => {

    const fetchSkills = async () => {
      try {
        const response = await getSkills()
        console.log(" the response", response.response)
        setSkills(response.response)
      } catch (error) {
        console.log("Erro fetching skills", error)
      }
    }
    fetchSkills()

  }, [])
  const addSkillToList = () => {
    const newSkillObj: SkillType = {
      name: skillInput.trim(),
      createdAt: new Date(),
    };
    const trimmedSkill = skillInput.trim()
    const isDuplicate = skills.some((skill) => skill.name.toLowerCase() === trimmedSkill.toLowerCase())
    if (isDuplicate) {
      setError(`Skill "${trimmedSkill}" already exists.`)
      return
    }
    setSkills((prevSkills) => [...prevSkills, newSkillObj]);
    setSkillInput("");
  };



  const handleDelete = async (name: string, id: string) => {
    if (!id) return
    try {
      const response = await removeSkill(id)
      if (response) {
        setSkills((prevSkills) => prevSkills.filter((skill) => skill.name !== name));
      }

    } catch (err) {
      const error= err as Error
      console.log("Error removing skilll",error.message)
      setError("Error on removing skill")
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newSkills = skills.filter((skill) => !skill._id);

    if (newSkills.length === 0) {
      setError("No new skills to save.");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        skills: newSkills.map((skill) => skill.name),
      };

      const response = await addSkill(requestData);
      console.log("Add skill response:", response);

      if (response.addeddSkill) {
        setSkills((prev) =>
          prev
            .filter((skill) => skill._id)
            .concat(response.addeddSkill)
        );
      }
    } catch (error) {
      console.log("Error in adding skill:", error);
      setError("Error adding skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar setSelected={setSelectedMenu} />
      <div className="bg-[#F6F6F6] w-full overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
        <AdminHeader heading="Skill Management" />


        <hr className="border-gray-300" />
        <div className="flex justify-center">
          {error && <ToastError message={error} onClose={() => setError(null)} />}
        </div>

        <div className="p-9">
          <div className="bg-white p-7 rounded-lg shadow-lg mb-10">
            <h2 className="text-xl font-semibold mb-4">Existing Skills</h2>
            {loading ? (
              <p className="text-gray-600">Loading skills...</p>
            ) : !skills || skills.length === 0 ? (
              <p className="text-gray-600">No skills found. Add a skill to get started.</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-[#eb5a007a] rounded-xl p-3 flex items-center space-x-3">
                    <p className=" font-medium">{skill.name}</p>
                    <button onClick={() => handleDelete(skill.name, skill._id || "")}>
                      <IoClose className="w-6 h-6 " />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-7 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Skill</h2>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="border p-2 w-full rounded-lg focus:outline-orange-400"
                placeholder="Enter skill name"
              />
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  if (skillInput.trim()) {
                    addSkillToList();
                  } else if (skills.length > 0) {
                    handleSubmit(e);
                  }
                }}
                className={`p-2 px-4 whitespace-nowrap rounded-lg text-white font-bold ${skillInput.trim() || skills.length > 0
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-gray-400 cursor-not-allowed"
                  }`}
                disabled={!skillInput.trim() && skills.length === 0}
              >
                {skillInput.trim() ? "Add Skill" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillManagement;