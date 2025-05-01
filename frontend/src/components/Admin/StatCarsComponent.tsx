

const StatCarsComponent = ({ title, value, changeValue, icon, trend }:any) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-gray-500 font-medium mb-1">{title}</h2>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-gray-100`}>
        {icon}
      </div>
    </div>
    <div className="flex items-center">
      <span className={`inline-flex items-center ${trend === '↑' ? 'text-green-500' : 'text-red-500'} text-sm font-medium mr-2`}>
        {trend} {changeValue}
      </span>
      <span className="text-gray-500 text-sm">since last week</span>
    </div>
  </div>
  )
}

export default StatCarsComponent


 