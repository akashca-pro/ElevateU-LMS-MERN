import React from 'react'

const categories = [
    {
      title: "Machine Learning",
      courses: "9+ courses",
      icon: "🧠",
    },
    {
      title: "Cloud Computing",
      courses: "15+ courses",
      icon: "☁️",
    },
    {
      title: "Web Development",
      courses: "70+ courses",
      icon: "💻",
    },
    {
      title: "Graphic Designing",
      courses: "12+ courses",
      icon: "🎨",
    },
    {
      title: "Cyber Security",
      courses: "7+ courses",
      icon: "🔒",
    },
    {
      title: "Digital Marketing",
      courses: "21+ courses",
      icon: "📱",
    },
  ]

const CategoriesBanner = () => {
    return (
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Top categories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="flex items-center gap-4 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="font-semibold text-lg">{category.title}</h3>
                <p className="text-gray-500 text-sm">{category.courses}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  

export default CategoriesBanner
