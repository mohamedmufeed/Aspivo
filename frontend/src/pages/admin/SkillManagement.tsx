import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import { IoChevronBackOutline, IoClose } from "react-icons/io5";
import profile from "../../assets/person_1.jpg";
import { addSkill, getSkills } from "../../services/adminService";

const initialSkills = [
  { name: "JavaScript" },
  { name: "HTML" },
];
interface SkillType {
  name: string,
  createdAt: Date
}

const SkillManagement = () => {
  const [selected, setSelectedMenu] = useState("Skills");
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);



  useEffect(() => {

    const fetchSkills = async () => {
      try {
        const response = await getSkills()
        console.log(" the response", response.response)
        setSkills(response.response)
      } catch (error) {

      }
    }
    fetchSkills()

  }, [])
  const addSkillToList = () => {
    const newSkillObj: SkillType = {
      name: skillInput.trim(),
      createdAt: new Date(),
    };
    setSkills((prevSkills) => [...prevSkills, newSkillObj]);
    setSkillInput("");
  };



  const handleDelete = (name: string) => {
    setSkills((prevSkills) => prevSkills.filter((skill) => skill.name !== name));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await addSkill(requestData)
      setSkills((prev) => [...prev,response.addeddSkill])
      console.log(skills)
    } catch (error) {
      console.log("Error in adding skill")
    }
  };
  const requestData = {
    skills: skills
  };

  return (
    <div className="flex">
      <Sidebar setSelected={setSelectedMenu} />
      <div className="bg-[#F6F6F6] w-full overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center">
            <IoChevronBackOutline className="w-8 h-8 cursor-pointer" />
            <h1 className="text-3xl font-medium ml-4">Skill Management</h1>
          </div>
          <div className="flex items-center gap-6">
            <img className="w-12 h-12 rounded-full border-2 border-orange-600" src={profile} alt="Profile" />
          </div>
        </div>

        <hr className="border-gray-300" />

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
                    <button onClick={() => handleDelete(skill.name)}>
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