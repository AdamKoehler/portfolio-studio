import * as React from "react"
import { cn } from "@/lib/utils"

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative pl-6 border-l-2 border-gray-200 dark:border-gray-800", className)}
    {...props}
  />
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative mb-6", className)}
    {...props}
  />
))
TimelineItem.displayName = "TimelineItem"

const TimelineDot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute -left-[9px] w-4 h-4 rounded-full bg-primary border-2 border-background",
      className
    )}
    {...props}
  />
))
TimelineDot.displayName = "TimelineDot"

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ml-4", className)}
    {...props}
  />
))
TimelineContent.displayName = "TimelineContent"

interface TimelineTimeProps extends React.HTMLAttributes<HTMLTimeElement> {
  dateTime?: string;
}

const TimelineTime = React.forwardRef<
  HTMLTimeElement,
  TimelineTimeProps
>(({ className, dateTime, ...props }, ref) => (
  <time
    ref={ref}
    dateTime={dateTime}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
TimelineTime.displayName = "TimelineTime"

export { Timeline, TimelineItem, TimelineDot, TimelineContent, TimelineTime } 