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

export function FilterBox({onSelect ,selectValue, disable=null}) {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[130px] flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4" />
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup >
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          { !disable && <SelectItem value="active">Active</SelectItem>}
          {selectValue && <SelectItem value={selectValue}>{selectValue}</SelectItem>}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
