import React, { useState } from "react";
import DateRangeSelector from "./DateRangeSelector";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const CoursesFilter = ({ onApplyFilter }) => {
  const [dateRange, setDateRange] = useState({
    fromDate: '',
    toDate: '',
  });

  const handleApplyFilter = () => {
    if (dateRange.fromDate && dateRange.toDate) {
      console.log(dateRange)
      onApplyFilter({...dateRange});
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <DateRangeSelector
          onChange={setDateRange}
          className="flex-1"
          initialOption="thisMonth"
        />
        <Button
          onClick={handleApplyFilter}
          disabled={!dateRange.fromDate || !dateRange.toDate}
          className="whitespace-nowrap"
        >
          <Search className="mr-2 h-4 w-4" /> Apply Filter
        </Button>
      </div>
    </div>
  );
};

export default CoursesFilter;