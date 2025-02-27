import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectExperience({ onSelectExperience, value }) {
 

  return (
    <Select onValueChange={onSelectExperience} value={value}>
      <SelectTrigger className="w-[190px]">
        <SelectValue placeholder="Years of experience" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup >
          <SelectItem value="1">1 Year of Experience</SelectItem>
          <SelectItem value="2">2 Years of Experience</SelectItem>
          <SelectItem value="3">3 Years of Experience</SelectItem>
          <SelectItem value="4">4 Years of Experience</SelectItem>
          <SelectItem value="5">5+ Years of Experience</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}