import React, { useState, useEffect } from "react";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfYear,
  subYears,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Format to YYYY/MM/DD
const formatDateString = (date) => {
  return format(date, "yyyy/MM/dd");
};

const DateRangeSelector = ({
  onChange,
  className,
  initialRange,
  initialOption = "thisMonth",
}) => {
  const [fromDate, setFromDate] = useState(initialRange?.fromDate || null);
  const [toDate, setToDate] = useState(initialRange?.toDate || null);
  const [selectedOption, setSelectedOption] = useState(initialOption);

  const setDateRange = (option) => {
    const now = new Date();
    let start;
    let end;

    switch (option) {
      case "thisMonth":
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case "lastMonth":
        const lastMonth = subMonths(now, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      case "last6Months":
        start = startOfMonth(subMonths(now, 5));
        end = endOfMonth(now);
        break;
      case "lastYear":
        start = startOfMonth(subYears(now, 1));
        end = endOfMonth(now);
        break;
      case "custom":
        return;
      default:
        return;
    }

    setFromDate(start);
    setToDate(end);
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    if (value !== "custom") {
      setDateRange(value);
    }
  };

  const handleFromDateChange = (date) => {
    if (date) {
      setFromDate(date);
      setSelectedOption("custom");
    }
  };

  const handleToDateChange = (date) => {
    if (date) {
      setToDate(date);
      setSelectedOption("custom");
    }
  };

  // Call onChange with formatted string dates
  useEffect(() => {
    if (fromDate && toDate) {
      onChange({
        fromDate: formatDateString(fromDate),
        toDate: formatDateString(toDate),
      });
    }
  }, [fromDate, toDate, onChange]);

  // ⚙️ Initial range load
  useEffect(() => {
    if (initialOption !== "custom" && !initialRange) {
      setDateRange(initialOption);
    }
  }, [initialOption, initialRange]);

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      {/* Select dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Period:</span>
        <Select value={selectedOption} onValueChange={handleOptionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom Range</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
            <SelectItem value="last6Months">Last 6 Months</SelectItem>
            <SelectItem value="lastYear">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date pickers */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* From Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[200px] justify-start text-left font-normal",
                !fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "PPP") : <span>From date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={handleFromDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
              disabled={(date) => (toDate ? date > toDate : false)}
            />
          </PopoverContent>
        </Popover>

        {/* To Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[200px] justify-start text-left font-normal",
                !toDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "PPP") : <span>To date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={handleToDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
              disabled={(date) => (fromDate ? date < fromDate : false)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeSelector;