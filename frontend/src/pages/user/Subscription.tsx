import { useSelector } from "react-redux";
import Navbar from "../../components/homecomponts/Navbar";
import { subscriptions } from "../../services/stripe";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { fetchCompany } from "../../services/company/compayJob";

const Subscription = () => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [companyId, setCompanyId] = useState<string | undefined>("");
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || "";

  useEffect(() => {
    const fetchCompanyId = async () => {
      if (!userId) {
        setError("Please log in to subscribe.");
        return;
      }
      try {
        const response = await fetchCompany(userId);
        console.log("Fetch company response:", response);
        if (response.company?.company) {
          setCompanyId(response.company.company._id);
        }
      } catch (err: any) {
        console.error("Error fetching company:", err.message);
        setError("Failed to fetch company details");
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
        console.log(" the url ", response.url)
        window.location.href = response.url;

      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create subscription");
      console.log("Error on subscription:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="bg-[#F6F6F6] pt-20 pb-40 flex  h-screen overflow-y-hidden justify-center items-center"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <div className="w-1/3">
          <h1 className="font-bold text-2xl text-center">Subscription</h1>
          <p className="text-gray-600 text-center">Talk to the Decision-Makers</p>
          {error && <div className="text-red-600 text-center mt-4">{error}</div>}
          <div className="w-3/3 p-6 ml-4 bg-white rounded-lg shadow-sm border mt-10 border-gray-100">
            <div className="flex justify-between items-start mb-6">
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

            <div className="space-y-6 pl-10">
              <div className="space-y-3">
                <div className="text-gray-500 text-sm">User</div>
                <div className="font-medium">Resume highlighting</div>
                <div className="font-medium">Unlimited chat with company</div>
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
              disabled={isProcessing || !userId}
              className={`w-full mt-8 py-4 bg-orange-600 text-white rounded-lg font-medium text-lg cursor-pointer ${isProcessing || !userId ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isProcessing ? "Processing..." : "Get Plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;