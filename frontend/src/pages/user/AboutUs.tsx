
import { IoChevronBackOutline } from "react-icons/io5"
import Navbar from "../../components/homecomponts/Navbar"
import { useNavigate } from "react-router-dom"
import Review from "../../components/homecomponts/Review"
import Footer from "../../components/homecomponts/Footer"
import { useState } from "react"
import { addReview } from "../../services/reviewService"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store/store"

const AboutUs = () => {
    const navigate = useNavigate()
    const [review, setReview] = useState("")
    const [error, setError] = useState("")
    const user = useSelector((state: RootState) => state.auth.user)
    const userId = user?._id
    const handleSubmit = async () => {
        if (!userId) return
        if (!review) {
            setError("Review is req")
            return
        }
        try {
            const response = await addReview(userId, review)
            console.log(" the revew resoponse", review)
        } catch (error) {
            console.error("Error on adding Review");

        }

    }
    return (
        <div>
            <Navbar />
            <div className="bg-[#F6F6F6] ">

                <div className="flex px-5 sm:px-10 pt-10 text-center space-x-5">
                    <IoChevronBackOutline
                        className="w-8 h-8 sm:w-8 sm:h-8  sm:ml-3 mr-3 sm:mr-6 cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="text-2xl sm:text-3xl font-medium">About Us</h1>
                </div>
                <div className="px-7 sm:px-27 pt-10 text-base/8">
                    <p>At <span className="text-orange-600">Aspivo</span> , we believe that finding the right job or hiring the perfect candidate should be simple, fast, and effective. Our platform is designed to connect job seekers with top employers, providing a seamless experience through advanced job search, real-time communication, and smart application tracking. Whether you're looking for your dream job or the ideal candidate, we make the process effortless with intuitive tools and a user-friendly interface.
                        Our goal is to bridge the gap between talent and opportunity by offering a secure, efficient, and transparent hiring process. Job seekers can create standout profiles, apply for jobs with ease, and connect directly with companies through chat and video calls. Employers can post job openings, manage applications, and engage with candidates quickly to build a strong workforce. <br />

                        With a focus on innovation and user satisfaction, <span className="text-orange-600">Aspivo</span>  is committed to transforming the recruitment experience. Join us today and take the next step toward your career or hiring success!</p>
                </div>

                <h1 className="text-2xl sm:text-3xl px-7 sm:px-25 pt-10 font-medium">Our Vision</h1>
                <div className="px-7 sm:px-27 pt-10 text-base/8">
                    <p>We envision a world where finding the right job or the perfect candidate is effortless. Whether you're a job seeker looking for new opportunities or an employer searching for top talent, we make the process smooth, transparent, and efficientt
                    </p>
                </div>

                <h1 className="text-2xl sm:text-3xl px-7 sm:px-25 pt-10 font-medium">What we Offer</h1>
                <div className="px-7 sm:px-27 pt-10 text-base/8 space-y-5">
                    <p><span className="font-semibold">For Job Seekers </span>    - Discover job opportunities, apply with ease, and communicate directly with companies through live chat and video calls. Build a strong profile to stand out from the crowd.</p>
                    <p><span className="font-semibold">For Employers </span>    - Post jobs, manage applications, and connect with potential hires instantly. Showcase your company and attract the best talent in the industry.</p>
                    <p><span className="font-semibold">For Admins </span>    -  Ensure a safe and trustworthy platform by managing users and companies efficiently while maintaining platform integrity.</p>
                </div>

                <Review />

                <div className="px-5 sm:px-27 pt-20 ">
                    <div className="bg-white shadow-lg rounded-xl p-8 sm:p-15">

                        <div className="flex justify-center">
                            <p className=" text-sm sm:text-base leading-6 sm:leading-8">
                                <span className="text-orange-600 font-semibold">Tell us what you think!</span> We’d love to hear about your experience.
                                Leave a review and let us know how <span className="text-orange-600 font-semibold">Aspivo</span> has helped you in your career journey or streamlined your hiring process.
                                Your feedback helps us grow and serve you better.
                            </p>
                        </div>

                        {error && (<p className="text-red-600">{error}</p>)}
                        <div className="pt-10">
                            <textarea placeholder="Start writing here . . . " rows={10} className=" block w-full  rounded-t-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 placeholder:p-2  sm:text-sm/6"
                                onChange={(e) => {
                                    setReview(e.target.value)
                                    if (review) { setError("") }
                                }}>

                            </textarea>
                            <div className="border-r border-l border-b  border-gray-300 py-5 rounded-b-md flex justify-end px-6">
                                <button className="bg-orange-600 text-white font-bold p-3 px-4 rounded-lg " onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>



                    </div>
                </div>

                <Footer />

            </div>
        </div>
    )
}

export default AboutUs