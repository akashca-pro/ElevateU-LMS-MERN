import * as React from "react"
import {SlidersHorizontal} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function FilterBox({onSelect ,selectValue, disable=null , options}) {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[160px] flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4" />
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup >
        {options && options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
