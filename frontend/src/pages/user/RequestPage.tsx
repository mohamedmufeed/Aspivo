import Navbar from "../../components/homecomponts/Navbar";
import gif from "../../assets/Confirmed-pana.svg";

const RequestPage = () => {
  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-20">

        <img className="w-80 h-80 mb-8" src={gif} alt="Confirmation" />

        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold mb-4">Your Registration is Under Review</h1>
          <h3 className="text-xl font-semibold mb-2">
            Thank you for registering your company with <span className="text-orange-600">Aspivo</span>!
          </h3>
          <p className="text-gray-600 mb-4">
            Your application is currently under review. Our admin team will notify you within <strong>24-48 hours</strong>.
          </p>
          <p className="text-gray-600 mb-8">We’ll send you a notification once your registration is approved.</p>

          <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
          <p className="text-gray-600">
            Contact us at{" "}
            <a
              href="mailto:aspivo44@gmail.com?subject=Support%20Request&body=Hi%20there,"
              className="text-orange-600 underline"
            >
              aspivo44@gmail.com
            </a>
          </p>
          .

        </div>
      </div>
    </div>
  );
};

export default RequestPage;
