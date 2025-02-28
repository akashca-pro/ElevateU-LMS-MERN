import React from "react";
import { useParams, useNavigate } from "react-router-dom";


const CategoryList = () => {
    const navigate = useNavigate()
    const { categoryName } = useParams(); 
    const courses = [
      { id: 1, courseName: "MongoDB Mastery", duration: "3 Months", price: "$80", image: "/Course.png" },
      { id: 2, courseName: "React Essentials", duration: "2 Months", price: "$70", image: "/Course.png" },
      { id: 3, courseName: "Node.js Basics", duration: "4 Months", price: "$90", image: "/Course.png" },
      { id: 4, courseName: "AWS Certified Solutions Architect", duration: "3 Months", price: "$100", image: "/Course.png" },
      { id: 5, courseName: "UI/UX Design Fundamentals", duration: "2 Months", price: "$60", image: "/Course.png" },
      { id: 6, courseName: "Full-Stack Development", duration: "6 Months", price: "$120", image: "/Course.png" },
    ];
  
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-4">
              <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-lg" />
              <div className="mt-4">
                <h2 className="text-lg font-semibold">{course.courseName}</h2>
                <p className="text-gray-500 text-sm">{course.duration}</p>
                <p className="text-primary font-semibold mt-2">{course.price}</p>
                <button 
                onClick={()=>navigate(`/admin/profile/category/${categoryName}/${course.courseName.toLowerCase()}`)}
                className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary">
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button className="p-2 rounded-lg border hover:bg-gray-50">&larr;</button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-lg text-sm font-medium ${
                page === 2 ? "bg-primary text-white" : "hover:bg-gray-50 border"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="p-2 rounded-lg border hover:bg-gray-50">&rarr;</button>
        </div>
      </div>
    );
  };

export default CategoryList;