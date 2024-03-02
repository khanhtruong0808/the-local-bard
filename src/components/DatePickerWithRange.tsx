"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, type SelectRangeEventHandler } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerWithRangeProps {
  className?: string;
  dateRange: DateRange;
  onSelect: SelectRangeEventHandler;
}

export function DatePickerWithRange({
  className,
  dateRange,
  onSelect,
}: DatePickerWithRangeProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              "dark:border-zinc-500 dark:bg-transparent dark:text-zinc-300 dark:ring-offset-zinc-500 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100", // custom dark mode
              !dateRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            fromDate={today}
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
