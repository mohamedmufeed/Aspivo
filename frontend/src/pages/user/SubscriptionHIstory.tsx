import { IoChevronBackOutline } from "react-icons/io5"
import Navbar from "../../components/homecomponts/Navbar"
import { useNavigate } from "react-router-dom"
import { getSubscriptionHistory } from "../../services/profile"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store/store"
import { useEffect, useState } from "react"



interface IHistory {
    _id: string;
    plan: string;
    status: string;
    updatedAt: string;
    createdAt: string;
    amount: number;
    companyId: string;
    subscriptionId: string;
    userId: string;
}

const SubscriptionHIstory = () => {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<IHistory[]>([]);
    const [error, setError] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?._id || "";

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await getSubscriptionHistory(userId);
                console.log("the response", response)
                const subscriptions = Array.isArray(response.subscription)
                    ? response.subscription
                    : [response.subscription];
                setHistory(subscriptions);
            } catch (error) {
                console.log("Error fetching the history:", error);
                setError("Failed to load subscription history. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchHistory();
        }
    }, [userId]);

    useEffect(() => {
        if (history.length === 0) {
            navigate("/subscription")
        }
    })

    const navigate = useNavigate();
    return (

        <div className="bg-[#F6F6F6] h-screen">
            <Navbar />
            <div className="mx-12 mt-10">
                <div className="bg-white p-5 shadow-lg rounded-lg flex items-center">
                    <IoChevronBackOutline
                        className="w-8 h-8 ml-3 mr-6 cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="text-3xl font-medium">Subscription History</h1>
                </div>
                <div className="text-center text-gray-600 p-5">

                </div>
            </div>
            {history.map((subscription, index) => (
                <div
                    key={index}
                    className="bg-white mx-12 shadow-gray-100 shadow-lg rounded-lg mt-5 p-6"
                >
                    <div className="grid grid-cols-3 text-center gap-4 items-center">
                        {/* Plan */}
                        <div>
                            <h1 className="text-black text-xl font-semibold">Popular</h1>
                            <p className="text-gray-700 text-sm font-light">Plan</p>
                        </div>

                        {/* Date */}
                        <div>
                            <h1 className="text-black text-xl font-semibold">
                                {new Date(subscription.updatedAt).toLocaleDateString()}
                            </h1>
                            <p className="text-gray-700 text-sm font-light">Date</p>
                        </div>

                        {/* Status */}
                        <div>
                            <h1 className="text-black text-xl font-semibold capitalize">
                                {subscription.status}
                            </h1>
                            <p className="text-gray-700 text-sm font-light">Status</p>
                        </div>
                    </div>
                </div>
            ))}

            {loading && (
                <div className="text-center mt-10 text-gray-500">Loading history...</div>
            )}
            {error && (
                <div className="text-center mt-10 text-red-500">{error}</div>
            )}
            {!loading && history.length === 0 && (
                <div className="text-center mt-10 text-gray-400">
                    No subscription history found.
                </div>
            )}


        </div>
    )
}

export default SubscriptionHIstory