import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { GoPlus } from "react-icons/go";
import { editTeam, getComapny } from "../../../services/company/companyProfile";
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  setCompanyData: (data: any) => void;
}

export interface TeamMember {
  position: string;
  name: string;
}

const EditCompanyTeam: React.FC<EditProfileModalProps> = ({ setCompanyData, isOpen, onClose, companyId }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { position: "", name: "" },
  ]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [name]: value.trimStart() };
    setTeamMembers(updatedMembers);
  };
  

  const addMember = () => {
    setTeamMembers([...teamMembers, { position: "", name: "" }]);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const seen = new Set<string>();

    teamMembers.forEach((member, index) => {
      const position = member.position.trim();
      const name = member.name.trim();

      if (!position) newErrors[`position-${index}`] = "Position is required";
      if (!name) newErrors[`name-${index}`] = "Name is required";

      const key = `${position.toLowerCase()}-${name.toLowerCase()}`;
      if (seen.has(key)) {
        newErrors[`duplicate-${index}`] = "Duplicate team member";
      } else {
        seen.add(key);
      }
    });
    console.log("Validation errors:", newErrors); 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await getComapny(companyId);
        console.log("the resposense", response.company.team)
        const company = response.company
        if (company && company.team) {
          setTeamMembers(
            company.team.map((member: any) => ({
              position: member.position || "",
              name: member.name || "",
            }))
          );
        }

      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (isOpen) {
      fetchCompanyProfile();
    }
  }, [isOpen, companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  if (!validateForm()) {
    console.log("Validation failed");
    return;
  }

    try {
      console.log("the team members", teamMembers)
      const response = await editTeam(companyId, teamMembers);
      if (response) {
        console.log("Edit team response:", response);
        setCompanyData(response.company);
        onClose();
      }
    } catch (error) {
      console.error("Error in editing team:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-30 transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <div className="bg-white w-5/6  mx-auto rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between mt-2 px-5 p-5">
            <div>
              <h1 className="text-2xl font-medium">Edit Team</h1>
              <p className="text-sm text-gray-500">*indicates required</p>
            </div>
            <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
          </div>
          <hr className="mt-2" />
          <div className="px-7 py-5 space-y-6">
            <form onSubmit={handleSubmit}>
              {teamMembers.map((member, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className="text-gray-600">Position*</label>
                    {errors[`position-${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`position-${index}`]}</p>
                    )}
                    <input
                      type="text"
                      name="position"
                      value={member.position}
                      onChange={(e) => handleChange(index, e)}
                      className="border p-2 w-full rounded-lg focus:outline-orange-400"
                      placeholder="e.g., CEO"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-600">Name*</label>
                    {errors[`name-${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`name-${index}`]}</p>
                    )}
                    <input
                      type="text"
                      name="name"
                      value={member.name}
                      onChange={(e) => handleChange(index, e)}
                      className="border p-2 w-full rounded-lg focus:outline-orange-400"
                      placeholder="e.g., John Samuel"
                      required
                    />
                  </div>
                  {errors[`duplicate-${index}`] && (
                    <p className="text-red-500 text-sm col-span-2">
                      {errors[`duplicate-${index}`]}
                    </p>
                  )}
                </div>
              ))}


              <button
                type="button"
                onClick={addMember}
                disabled={Object.keys(errors).length > 0}
                className="flex items-center text-orange-600 hover:text-orange-700 mt-2"
              >
                <GoPlus className="mr-2" /> Add Member
              </button>
              <hr className="mt-6" />
              <div className="flex justify-end p-4">
                <button
                  type="submit"
                  className="p-2 px-4 bg-orange-600 rounded-lg text-white font-bold hover:bg-orange-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyTeam;