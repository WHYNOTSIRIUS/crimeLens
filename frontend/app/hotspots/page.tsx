"use client";

import { CrimeHotspotMap } from "@/components/crime-hotspot-map";
import { dummyCrimeReports } from "@/lib/dummy-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { addDays, subDays } from "date-fns";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";

// Replace this with your actual API key
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";

export default function HotspotsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Filter reports based on date range
  const filteredReports = dummyCrimeReports.filter((report) => {
    if (!dateRange?.from || !dateRange?.to) return true;
    
    const reportDate = new Date(report.crimeTime);
    return reportDate >= dateRange.from && reportDate <= dateRange.to;
  });

  // Handle quick time range selection
  const handleTimeRangeChange = (value: "7d" | "30d" | "90d" | "all") => {
    setTimeRange(value);
    
    if (value === "all") {
      setDateRange(undefined);
      return;
    }

    const days = value === "7d" ? 7 : value === "30d" ? 30 : 90;
    setDateRange({
      from: subDays(new Date(), days),
      to: new Date(),
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Crime Hotspots</h1>
        <p className="text-muted-foreground">
          Visualize crime patterns and identify high-risk areas
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>

        <DatePickerWithRange
          date={dateRange}
          onDateChange={setDateRange}
        />

        <div className="text-sm text-muted-foreground ml-auto">
          Showing {filteredReports.length} reports
        </div>
      </div>

      <CrimeHotspotMap
        reports={filteredReports}
        apiKey={GOOGLE_MAPS_API_KEY}
      />

      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          The heatmap intensity is calculated based on multiple factors:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Number of reported crimes in the area</li>
          <li>Verification score of reports</li>
          <li>Recency of incidents</li>
          <li>Community engagement (upvotes)</li>
        </ul>
      </div>
    </div>
  );
}
