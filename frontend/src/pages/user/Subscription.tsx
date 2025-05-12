import { useSelector } from "react-redux";
import Navbar from "../../components/homecomponts/Navbar";
import { subscriptions } from "../../services/stripe";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { fetchCompany } from "../../services/company/compayJob";
import ToastError from "../../components/Tost/ErrorToast";
import { getProfile } from "../../services/profile";


const Subscription = () => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [companyId, setCompanyId] = useState<string | undefined>("");
  const user = useSelector((state: RootState) => state.auth.user);
  const [alreadySubscribed,setAlreadySubscribed]=useState<boolean|undefined>(false)
  const userId = user?._id || "";

  useEffect(()=>{
    const fetchUser=async()=>{
      try {
        const  response = await getProfile(userId)
        console.log("the user is ",response.user.user.subscription)
        if(response.user.user.subscription){
          setAlreadySubscribed(true)
        }
      } catch (error) {
        console.error("Error on fetching the user");
        
      }
    }
    if(userId){
      fetchUser()
    }
  })

  useEffect(() => {
    const fetchCompanyId = async () => {
      if (!userId) {
        setError("Please log in to subscribe.");
        return;
      }
      try {
        const response = await fetchCompany(userId);
        if (response?.company?.company) {
          setCompanyId(response.company.company._id);
        }
      } catch (err) {
        const error = err as Error
        console.error("Error fetching company:", error.message);
      }
    };
    fetchCompanyId();
  }, [userId]);

  const handleSubscribe = async () => {
    if (!userId) {
      setError("Please log in to subscribe.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log("Initiating subscription with:", { userId, companyId });
      const response = await subscriptions({
        userId,
        companyId
      });
      if (response.url) {
        window.location.href = response.url
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to create subscription");
      console.log("Error on subscription:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="bg-[#F6F6F6] pt-20 pb-40 flex min-h-screen overflow-y-auto justify-center items-center px-4 sm:px-6"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        {error ? <ToastError message={error} onClose={() => setError(null)} /> : ""}

        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <h1 className="font-bold text-2xl text-center">Subscription</h1>
          <p className="text-gray-600 text-center">Talk to the Decision-Makers</p>
          <div className="px-2 sm:px-35">
            <div className="w-full p-6  bg-white rounded-lg shadow-sm border mt-10 border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-[#FF9966] rounded-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-[#FF6600] rounded-full -translate-x-[-25%] translate-y-[-25%]"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 bg-[#FF6600] rounded-tr-2xl"></div>
                  </div>
                  <div className="text-3xl font-bold">₹1,028 /</div>
                </div>
                <div className="px-4 py-1.5 bg-orange-600 text-white rounded-full text-sm font-medium">
                  Popular
                </div>
              </div>

              <div className="h-px bg-gray-200 my-6"></div>

              <div className="space-y-6 sm:pl-6">
                <div className="space-y-3">
                  <div className="text-gray-500 text-sm">User</div>
                  <div className="font-medium">Unlimited chat with company</div>
                  <div className="font-medium">Unlock AI features</div>
                </div>

                {companyId && (
                  <div className="space-y-3">
                    <div className="text-gray-500 text-sm">Company</div>
                    <div className="font-medium">Unlimited Job Posting</div>
                    <div className="font-medium">Access to analytics</div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubscribe}
                disabled={isProcessing || !userId || alreadySubscribed}
                className={`w-full mt-8 py-4 bg-orange-600 text-white rounded-lg font-medium text-lg ${isProcessing || !userId || alreadySubscribed
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-orange-700 transition duration-200"
                  }`}
              >
              {isProcessing ? "Processing..." : (alreadySubscribed ? "Already Purchased" : "Get Plan")}

              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
};

export default Subscription;