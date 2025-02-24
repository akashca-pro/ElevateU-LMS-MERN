import React,{useState} from "react";
import {Search } from "lucide-react"

const ProfileEnrolledCourse = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("relevance");
  
    const courses = [
      {
        id: 1,
        title: "Beginner's Guide to Design",
        author: "Ronald Richards",
        ratings: 1200,
        stars: 5,
        image: "/placeholder.svg?height=200&width=300",
      },
      ...Array(8)
        .fill()
        .map((_, i) => ({
          id: i + 2,
          title: "Beginner's Guide to Design",
          author: "Ronald Richards",
          ratings: 1200,
          stars: 5,
          image: "/placeholder.svg?height=200&width=300",
        })),
    ];
  
    return (
      <main className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">
            Courses <span className="text-sm text-gray-500">(12)</span>
          </h1>
        </div>
  
        {/* Search and Filter */}
        <div className="flex justify-between mb-8">
          <div className="relative w-64">
            <input
              type="search"
              placeholder="Search User"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
  
          <div className="flex gap-4">
            <select
              className="px-4 py-2 rounded-lg border focus:outline-none focus:border-purple-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
  
            <button className="px-4 py-2 rounded-lg border hover:bg-gray-50">Filter</button>
          </div>
        </div>
  
        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="border rounded-lg overflow-hidden">
              <img
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">By {course.author}</p>
                <div className="flex items-center gap-1">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  <span className="text-sm text-gray-600">({course.ratings} Ratings)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50">&lt;</button>
          <button className="px-3 py-1 border rounded bg-purple-600 text-white">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">&gt;</button>
        </div>
      </main>
    );
}

export default ProfileEnrolledCourse
