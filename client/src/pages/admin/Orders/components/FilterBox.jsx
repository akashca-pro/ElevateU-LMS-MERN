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

export function FilterBox({onSelect ,filterValues,title}) {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[130px] flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4" />
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup >
        {filterValues.map((value,index)=>(
            <SelectItem key={index} value={value} >{value}</SelectItem>
        ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
