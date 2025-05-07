import { useEffect, useState } from "react"
import { getReview } from "../../services/reviewService"


interface PopulatedUser {
  firstName: string;
  lastName: string;
  profileImage: string;
  position: string
}
interface Review {
  _id: string;
  userId: PopulatedUser;
  review: string;
  createdAt: Date;
  updatedAt: Date

}
const Review = () => {
  const [reviews, setReviews] = useState<Review[]>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReview()
        setReviews(response.review)
      } catch (error) {
        console.error("Error on fetching Review",error);

      }
    }
    fetchReviews()
  }, [])

  useEffect(() => {
    if (!reviews) return
    if (reviews?.length > 1) {
      const interval = setInterval(() => {
        goToNextSlide()
      }, 5000);
      return () => clearInterval(interval)
    }
  }, [reviews?.length, isAnimating, currentIndex])

  const goToNextSlide = () => {
    if (!reviews) return
    if (isAnimating || reviews.length <= 1) return;

    setIsAnimating(true)
    setDirection('next')
    setTimeout(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      )
      setTimeout(() => {
        setIsAnimating(false)
      }, 500)
    }, 50)
  }


 
 
  
  return (
    <div className="bg-[#F6F6F6] " style={{ fontFamily: "DM Sans, sans-serif" }}>
      <div className="text-center font-semibold text-2xl sm:text-3xl md:text-3xl pt-25">
        <div className="pb-3"> <span className="text-orange-600"> Reviews </span>  of People Who Have Found Jobs <br /> <span>     Through Aspivo</span></div>
      </div>
      { reviews && reviews.length> 0 && (
        <div className="px-5 sm:px-50 pt-15 ">
          <div className="h-96 overflow-hidden">
          <div  className={`bg-white rounded-2xl p-5 sm:p-9 transform transition-all duration-500 ease-in-out ${
               isAnimating
               ? direction === 'next'
                 ? '-translate-x-full opacity-0'
                 : 'translate-x-full opacity-0'
               : 'translate-x-0 opacity-100'
              }`}>
            <div className="flex justify-center ">
              <img  src={reviews[currentIndex].userId.profileImage}alt="profile-image" className="w-20 h-20 rounded-full shadow-md " />
            </div>
            <div className="flex justify-center text-center text-sm sm:text-lg text-gray-500 pt-10 px-3 sm:px-20">
              <p>“{reviews[currentIndex].review}”</p>
            </div>
            <div className="text-center pt-5 space-y-2">
              <h2 className="font-semibold text-lg "> {reviews[currentIndex].userId.firstName} {reviews[currentIndex].userId.lastName}</h2>
              <p className="text-gray-600 text-sm sm:text-base">  {reviews[currentIndex].userId.position}</p>
            </div>
          </div>
          </div>
        </div>
      )}


      {/* <div className="flex justify-center pt-4">
        <div className="flex space-x-2 mt-4">
          <span className="w-15 h-2.5 rounded-3xl bg-orange-600"></span>
          <span className="w-10 h-2.5 rounded-3xl bg-gray-300"></span>
          <span className="w-10 h-2.5 rounded-3xl  bg-gray-300"></span>
        </div>
      </div> */}


    </div>
  )
}

export default Review