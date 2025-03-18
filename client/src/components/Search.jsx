import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useGlobalSearchQuery } from "@/services/commonApi";
import { Card } from "./ui/card";
import { useLocation } from "react-router-dom";

export const GlobalSearch = ({ onSearch }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); 
  const { data: details } = useGlobalSearchQuery(searchTerm);
  const courses = details?.data || [];

  useEffect(() => {
    setSearchTerm("");
    setOpen(false);
    setSelectedIndex(-1);
  }, [location.pathname]);

  const handleSelect = (course) => {
    setSearchTerm(course.title);
    setOpen(false);
    setSelectedIndex(-1);
    onSearch(course);
  };

  const handleKeyDown = (e) => {
    if (!open || courses.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < courses.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      handleSelect(courses[selectedIndex]);
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setOpen(true);
          setSelectedIndex(-1);
        }}
        onKeyDown={handleKeyDown} // Listen for arrow key events
        placeholder="Search all courses..."
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Suggestions List */}
      {open && courses.length > 0 && (
        <Card className="absolute w-full bg-white shadow-lg border rounded-lg mt-1 z-50">
          {courses.map((course, index) => (
            <div
              key={course._id}
              className={`p-2 cursor-pointer ${
                index === selectedIndex ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(course)}
            >
              {course.title}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};