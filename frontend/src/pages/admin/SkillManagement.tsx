import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import { addSkill, getSkills } from "../../services/adminService";
import ToastError from "../../components/Tost/ErrorToast";
import { removeSkill } from "../../services/adminService";
import AdminHeader from "../../components/Admin/AdminHeader";
import { IoClose } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from "lucide-react";
import _ from "lodash";
import SearchBar from "../../components/Admin/SearchBar";

interface SkillType {
  _id?: string;
  name: string;
  createdAt: Date;
}

const SkillManagement = () => {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalSkills] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  const prevRequestRef = useRef<AbortController | null>(null);

  const fetchSkills = async (page = 1, query = "") => {
    if (prevRequestRef.current) {
      prevRequestRef.current.abort();
    }
    
    const abortController = new AbortController();
    prevRequestRef.current = abortController;
    
    setLoading(true);
    try {
      
      const response = await getSkills(page, itemsPerPage, query, abortController.signal);
      
      if (prevRequestRef.current === abortController) {
        setSkills(response.skills);
        setTotalSkills(response.totalSkills);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.log("Error fetching skills", error);
        setError("Failed to fetch skills");
      }
    } finally {
      if (prevRequestRef.current === abortController) {
        setLoading(false);
      }
    }
  };

  const debouncedFetch = useCallback(
    _.debounce((page: number, query: string) => {
      fetchSkills(page, query);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedFetch(currentPage, searchQuery);
    } else {
      fetchSkills(currentPage, searchQuery);
    }
  }, [currentPage, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentPage !== 1) setCurrentPage(1);
    debouncedFetch(1, query);
  };

  const addSkillToList = () => {
    const newSkillObj: SkillType = {
      name: skillInput.trim(),
      createdAt: new Date(),
    };
    
    const trimmedSkill = skillInput.trim();
    const isDuplicate = skills.some(
      (skill) => skill.name.toLowerCase() === trimmedSkill.toLowerCase()
    );
    
    if (isDuplicate) {
      setError(`Skill "${trimmedSkill}" already exists.`);
      return;
    }
    
    setSkills((prevSkills) => [...prevSkills, newSkillObj]);
    setSkillInput("");
  };

  const handleDelete = async (name: string, id: string) => {
    if (!id) return;
    try {
      const response = await removeSkill(id);
      if (response) {
        setSkills((prevSkills) => prevSkills.filter((skill) => skill.name !== name));
        if (skills.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchSkills(currentPage, searchQuery);
        }
      }
    } catch (err) {
      const error = err as Error;
      console.log("Error removing skill", error.message);
      setError("Error on removing skill");
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

      if (response.addeddSkill) {
        fetchSkills(currentPage, searchQuery);
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
      <Sidebar />
      <div
        className="bg-[#F6F6F6] w-full overflow-x-hidden relative"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <AdminHeader heading="Skill Management" />
        <SearchBar placeholder="Search Skills..." onSearch={handleSearch} />

        <div className="flex justify-center">
          {error && <ToastError message={error} onClose={() => setError(null)} />}
        </div>

        <div className="p-9">
          <div className="bg-white p-7 rounded-lg shadow-lg mb-10">
            <h2 className="text-xl font-semibold mb-4">Existing Skills</h2>
            {loading ? (
              <p className="text-center text-gray-600">Loading skills...</p>
            ) : !skills || skills.length === 0 ? (
              <p className="text-center text-gray-600">
                No skills found. Add a skill to get started.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-[#eb5a007a] rounded-xl p-3 flex items-center space-x-3"
                  >
                    <p className="font-medium">{skill.name}</p>
                    <button onClick={() => handleDelete(skill.name, skill._id || "")}>
                      <IoClose className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-8 mb-8">
              <button
                className="p-3 rounded-md hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, page) => (
                <button
                  key={page}
                  className={`p-3 w-8 h-8 rounded-sm flex items-center justify-center font-bold ${
                    currentPage === page + 1
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </button>
              ))}

              <button
                className="p-3 rounded-md hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

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
                className={`p-2 px-4 whitespace-nowrap rounded-lg text-white font-bold ${
                  skillInput.trim() || skills.length > 0
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