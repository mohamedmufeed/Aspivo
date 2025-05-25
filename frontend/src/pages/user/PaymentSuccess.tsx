import successGif from "../../assets/Successful purchase.gif";
import { useNavigate } from "react-router-dom";
import { fetchCompany } from "../../services/company/compayJob";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const handleNavigate = () => navigate("/");
  const user = useSelector((state: RootState) => state.auth.user)
  const userId = user?._id
  useEffect(() => {
    const handlefetchCompany = async () => {
      if (!userId) return;
      const response = await fetchCompany(userId);
      const company = response?.company?.company;
      if (company) {
        navigate("/company-dashboard")
      }
    }
    handlefetchCompany()
  }, [userId])

  return (
    <div className="bg-[#F6F6F6] h-screen flex justify-center items-center font-dm-sans">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <img src={successGif} className="w-70 h-70 mx-auto" alt="Success" />

        <h1 className="text-2xl font-bold  mt-6">Payment Succeeded!</h1>
        <p className="text-gray-600 mt-4">
          Your transaction was completed successfully. Thank you for your purchase!
        </p>

        <button
          onClick={handleNavigate}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg mt-6 transition duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;