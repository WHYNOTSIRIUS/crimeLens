"use client";

import { CrimeCard } from "@/components/crime-card";
import { dummyCrimeReports } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  TrendingUp,
  CheckCircle2,
  MapPin,
  Search,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

export default function Home() {
  // Initialize state for filters
  const [division, setDivision] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [sortBy, setSortBy] = useState("recent");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  // Get unique divisions and districts
  const divisions = useMemo(() => {
    return Array.from(new Set(dummyCrimeReports.map(report => report.division)));
  }, []);

  const districts = useMemo(() => {
    return Array.from(new Set(dummyCrimeReports.map(report => report.district)));
  }, []);

  // Filter and sort reports based on selected criteria
  const filteredReports = useMemo(() => {
    let filtered = dummyCrimeReports.filter(report => {
      const matchesDivision = !division || report.division === division;
      const matchesDistrict = !district || report.district === district;
      const matchesSearch = !searchQuery || 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDateRange = !dateRange?.from || !dateRange?.to ||
        (new Date(report.crimeTime) >= dateRange.from &&
         new Date(report.crimeTime) <= dateRange.to);
      const matchesVerification = !showVerifiedOnly || report.verificationScore >= 0.8;

      return matchesDivision && matchesDistrict && matchesSearch && 
             matchesDateRange && matchesVerification;
    });

    // Sort the filtered results
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.crimeTime).getTime() - new Date(a.crimeTime).getTime();
        case "verified":
          return b.verificationScore - a.verificationScore;
        case "upvotes":
          return b.upvotes - a.upvotes;
        default:
          return 0;
      }
    });
  }, [division, district, searchQuery, dateRange, sortBy, showVerifiedOnly]);

  const handleReset = () => {
    setDivision("");
    setDistrict("");
    setSearchQuery("");
    setSortBy("recent");
    setShowVerifiedOnly(false);
    setDateRange({
      from: addDays(new Date(), -7),
      to: new Date(),
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Recent Crime Reports</h1>
        <p className="text-muted-foreground">
          Stay informed about incidents in your area and help verify reports
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-card rounded-lg p-4 mb-8 space-y-4">
        {/* Quick Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button 
            variant={sortBy === "recent" ? "default" : "outline"} 
            size="sm" 
            className="whitespace-nowrap"
            onClick={() => setSortBy("recent")}
          >
            <Clock className="mr-2 h-4 w-4" />
            Most Recent
          </Button>
          <Button 
            variant={sortBy === "upvotes" ? "default" : "outline"} 
            size="sm" 
            className="whitespace-nowrap"
            onClick={() => setSortBy("upvotes")}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Most Upvoted
          </Button>
          <Button 
            variant={showVerifiedOnly ? "default" : "outline"} 
            size="sm" 
            className="whitespace-nowrap"
            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Verified Only
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="whitespace-nowrap ml-auto"
            onClick={handleReset}
          >
            Reset Filters
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger>
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map(div => (
                  <SelectItem key={div} value={div}>{div}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {districts.map(dist => (
                  <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredReports.length} reports found
        </div>
      </div>

      <div className="space-y-6">
        {filteredReports.map((report) => (
          <CrimeCard key={report.id} report={report} />
        ))}
        
        {filteredReports.length > 0 && (
          <div className="flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        )}
      </div>
    </div>
  );
}
